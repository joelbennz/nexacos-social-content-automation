# n8n Control MCP

Local stdio MCP adapter for the configured n8n Public API. It is dependency-free and requires Node.js with built-in `fetch` and `AbortSignal.timeout` support (Node 20 or newer recommended).

## Tools

- `n8n_status`: read-only reachability/API-key check.
- `n8n_api_request`: generic GET/POST/PUT/PATCH/DELETE for any public API resource under the configured `/api/v1` root. It can create, edit, activate, execute, pause, and delete workflows when the API key permits those operations.

This is full access to the connected n8n API key's permissions. The adapter does not limit resources or methods, and the API key must belong only to the intended agency instance.

## Configuration

Set these variables in the Codex and OpenClaw host environments before starting their MCP processes:

```text
N8N_BASE_URL=https://your-n8n-host.example/api/v1
N8N_API_KEY=<store in the host's secret environment>
```

Use HTTPS for remote instances. HTTP is accepted only for localhost. Never put the API key in Git, an exported workflow, a prompt, or this MCP definition.

The Codex CLI entry `social-n8n-admin` is registered and enabled. The server completed a local MCP initialize and tools/list exchange. Its read-only status call returns a configuration error until the protected `N8N_BASE_URL` and `N8N_API_KEY` values are provided; no live n8n request has succeeded yet.

For OpenClaw, the same server is registered as `social-n8n-admin`; its main agent has the `full` tools profile and the server is configured with approval mode `approve`. No tool filter is set. The n8n API key defines the API authority once connected; other OpenClaw policies still apply.

## Limits

This adapter is only the n8n control plane. It does not provision an n8n instance, create Meta OAuth credentials, store client media, or publish a post until those services and credentials exist. OpenClaw's `image_generate` is configured separately for image work.
