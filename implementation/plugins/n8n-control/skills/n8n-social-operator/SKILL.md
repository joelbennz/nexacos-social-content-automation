---
name: n8n-social-operator
description: Operate the configured n8n instance for multi-brand social publishing through the n8n-control MCP tools.
---

# n8n social operator

Use this skill whenever the user asks to create, inspect, change, run, pause, or troubleshoot the social-content workflows.

- Call `n8n_status` first when you need to confirm the configured instance is reachable.
- Use `n8n_api_request` for the full public API. Paths are relative to `/api/v1`; keep requests on the configured instance. Read the instance's current workflows and conventions before changing them.
- The configured API key grants the tool caller its n8n permissions. Respect the user's requested action and the connected instance; do not request an extra confirmation for ordinary workflow administration.
- For publishing, use the workflow's persisted `brandId`, `accountId`, schedule, idempotency key, and Meta credential reference. Never copy a credential or asset reference between brands.
- After writes or executions, inspect the API result and execution record. Report the resulting workflow/execution IDs and any failure; do not say a publish succeeded without a confirmed platform ID.
- Routine copy, scheduling, retries, and publication belong to OpenClaw/n8n. Use Codex image generation only for a requested visual and keep it within the user's ChatGPT Plus allowance.
