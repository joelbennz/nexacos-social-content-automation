#!/usr/bin/env node

const SERVER_NAME = "n8n-control";
const SERVER_VERSION = "0.1.0";
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_RESPONSE_CHARS = 4 * 1024 * 1024;
const API_VERSION_PREFIX = "/api/v1";

const tools = [
  {
    name: "n8n_status",
    description:
      "Check whether the configured n8n Public API is reachable and the API key is accepted. This performs a read-only workflow list request.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "n8n_api_request",
    description:
      "Call any endpoint in the configured n8n Public REST API. Use paths relative to /api/v1, such as workflows, workflows/{id}, executions, credentials, tags, variables, projects, or data-tables. Supports GET, POST, PUT, PATCH, and DELETE. This grants the caller the permissions of the configured n8n API key.",
    inputSchema: {
      type: "object",
      properties: {
        method: {
          type: "string",
          enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          description: "HTTP method for the n8n API operation.",
        },
        path: {
          type: "string",
          description:
            "Path relative to /api/v1. Do not include a host, query string, or /api/v1 prefix.",
        },
        query: {
          type: "object",
          description: "Optional query parameters. Values must be strings, numbers, booleans, or arrays of those values.",
          additionalProperties: true,
        },
        body: {
          description: "Optional JSON request body for POST, PUT, or PATCH.",
          type: ["object", "array", "string", "number", "boolean", "null"],
        },
      },
      required: ["method", "path"],
      additionalProperties: false,
    },
  },
];

function config() {
  const rawBase = process.env.N8N_BASE_URL?.trim();
  const apiKey = process.env.N8N_API_KEY?.trim();
  if (!rawBase || !apiKey) {
    throw new Error(
      "n8n is not connected. Set N8N_BASE_URL (the instance API root ending in /api/v1) and N8N_API_KEY in the MCP host's secret environment, then restart its MCP connection.",
    );
  }

  let parsed;
  try {
    parsed = new URL(rawBase);
  } catch {
    throw new Error("N8N_BASE_URL must be an absolute HTTP(S) URL ending in /api/v1.");
  }
  const localHttp =
    parsed.protocol === "http:" &&
    ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname.replace(/^\[|\]$/g, ""));
  if (parsed.protocol !== "https:" && !localHttp) {
    throw new Error("N8N_BASE_URL must use HTTPS. HTTP is allowed only for localhost.");
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error("N8N_BASE_URL cannot contain credentials, query parameters, or a fragment.");
  }
  const path = parsed.pathname.replace(/\/+$/, "");
  if (!path.endsWith(API_VERSION_PREFIX)) {
    throw new Error("N8N_BASE_URL must end in /api/v1, for example https://n8n.example.com/api/v1.");
  }
  parsed.pathname = `${path}/`;
  return { apiRoot: parsed, apiKey };
}

function checkedPath(path) {
  if (typeof path !== "string" || path.length < 1 || path.length > 1024) {
    throw new Error("path must be a non-empty relative n8n API path of at most 1024 characters.");
  }
  const normalized = path.replace(/^\/+/, "");
  if (
    !normalized ||
    normalized.startsWith("api/v1") ||
    normalized.includes("?") ||
    normalized.includes("#") ||
    normalized.includes("\\") ||
    /%(?:2e|2f|5c)/i.test(normalized) ||
    normalized.split("/").some((part) => part === "." || part === "..") ||
    /[\u0000-\u001f\u007f]/.test(normalized)
  ) {
    throw new Error("path must stay inside the configured /api/v1 root; pass the endpoint without a host or query string.");
  }
  return normalized;
}

function appendQuery(url, query) {
  if (query === undefined) return;
  if (!query || typeof query !== "object" || Array.isArray(query)) {
    throw new Error("query must be a JSON object.");
  }
  const entries = Object.entries(query);
  if (entries.length > 50) throw new Error("query can contain at most 50 parameters.");
  for (const [key, value] of entries) {
    if (!key || /[\u0000-\u001f\u007f]/.test(key)) throw new Error("query contains an invalid key.");
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (!["string", "number", "boolean"].includes(typeof item)) {
        throw new Error(`query parameter '${key}' must contain only strings, numbers, or booleans.`);
      }
      url.searchParams.append(key, String(item));
    }
  }
}

async function n8nRequest({ method, path, query, body }) {
  const { apiRoot, apiKey } = config();
  const endpoint = new URL(checkedPath(path), apiRoot);
  if (endpoint.origin !== apiRoot.origin || !endpoint.pathname.startsWith(apiRoot.pathname)) {
    throw new Error("Refused a request outside the configured n8n API root.");
  }
  appendQuery(endpoint, query);

  const options = {
    method,
    headers: {
      Accept: "application/json",
      "X-N8N-API-KEY": apiKey,
    },
    signal: AbortSignal.timeout(60_000),
  };
  if (body !== undefined) {
    const encoded = JSON.stringify(body);
    if (Buffer.byteLength(encoded, "utf8") > MAX_BODY_BYTES) {
      throw new Error(`Request body exceeds ${MAX_BODY_BYTES} bytes.`);
    }
    options.headers["Content-Type"] = "application/json";
    options.body = encoded;
  }

  let response;
  try {
    response = await fetch(endpoint, options);
  } catch (error) {
    throw new Error(`Could not reach n8n (${error.name ?? "network error"}). Check the instance URL, TLS, and connectivity.`);
  }
  const text = await response.text();
  if (text.length > MAX_RESPONSE_CHARS) {
    throw new Error(`n8n response exceeded ${MAX_RESPONSE_CHARS} characters; narrow the request with pagination or filters.`);
  }
  let data = text;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Preserve non-JSON responses from the configured n8n API.
    }
  }
  return { status: response.status, ok: response.ok, data };
}

function textResult(value, isError = false) {
  return {
    content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
    isError,
  };
}

async function callTool(name, args = {}) {
  if (name === "n8n_status") {
    const result = await n8nRequest({ method: "GET", path: "workflows", query: { limit: 1 } });
    if (!result.ok) {
      return textResult({ connected: false, status: result.status, response: result.data }, true);
    }
    return textResult({ connected: true, status: result.status, message: "n8n Public API is reachable and accepted the configured API key." });
  }

  if (name !== "n8n_api_request") throw new Error(`Unknown tool: ${name}`);
  const method = String(args.method ?? "").toUpperCase();
  if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    throw new Error("method must be GET, POST, PUT, PATCH, or DELETE.");
  }
  if (["GET", "DELETE"].includes(method) && args.body !== undefined) {
    throw new Error(`${method} requests cannot include a body in this adapter.`);
  }
  const result = await n8nRequest({ method, path: args.path, query: args.query, body: args.body });
  return textResult({ status: result.status, ok: result.ok, data: result.data }, !result.ok);
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

async function handle(message) {
  if (!message || message.jsonrpc !== "2.0") return;
  const { id, method, params = {} } = message;
  if (method === "notifications/initialized" || method === "notifications/cancelled") return;

  try {
    let result;
    if (method === "initialize") {
      result = {
        protocolVersion: params.protocolVersion ?? "2024-11-05",
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
      };
    } else if (method === "ping") {
      result = {};
    } else if (method === "tools/list") {
      result = { tools };
    } else if (method === "tools/call") {
      const value = await callTool(params.name, params.arguments ?? {});
      if (id === undefined) return;
      send({ jsonrpc: "2.0", id, result: value });
      return;
    } else if (method === "resources/list") {
      result = { resources: [] };
    } else if (method === "prompts/list") {
      result = { prompts: [] };
    } else if (id === undefined) {
      return;
    } else {
      send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } });
      return;
    }
    if (id !== undefined) send({ jsonrpc: "2.0", id, result });
  } catch (error) {
    if (id !== undefined) {
      send({ jsonrpc: "2.0", id, result: textResult(error.message, true) });
    }
  }
}

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
  if (input.length > 8 * 1024 * 1024) {
    process.stderr.write("MCP input buffer exceeded limit.\n");
    process.exit(1);
  }
  let newline;
  while ((newline = input.indexOf("\n")) !== -1) {
    const line = input.slice(0, newline).trim();
    input = input.slice(newline + 1);
    if (!line) continue;
    try {
      void handle(JSON.parse(line));
    } catch {
      // JSON-RPC parse failures do not include request bytes in logs.
    }
  }
});

process.stdin.on("end", () => {
  const line = input.trim();
  if (!line) return;
  try {
    void handle(JSON.parse(line));
  } catch {
    // Ignore an incomplete final frame.
  }
});
