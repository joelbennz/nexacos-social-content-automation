# Social Content Automation

Implementation workspace for multi-brand Facebook and Instagram publishing with n8n as the scheduler and publisher, and OpenClaw as the content team.

## Current architecture

- n8n owns schedules, retries, publication state, and Meta API credentials.
- OpenClaw owns brand research, planning, copy, art direction, carousel structure, and quality review.
- The local `n8n-control` MCP server gives Codex and OpenClaw the same n8n Public API surface. It is deliberately scoped to the configured n8n `/api/v1` origin; it supports all public API resources and HTTP methods.
- OpenClaw's `image_generate` tool is the image worker. Its `openai/gpt-image-2` media model is configured, but the OpenAI Codex OAuth profile is not authenticated yet. OpenClaw needs its own OAuth login; an ordinary “Sign in with ChatGPT” session does not authenticate image generation. The OAuth profile is shared under provider `openai`, so keep the text model on a separate provider before authorizing it if Codex usage must be reserved for images.
- Generated assets and brand inputs belong to the relevant n8n workflow/storage provider. Never commit client media, OAuth tokens, API keys, or credentials here.

## What's implemented

- `plugins/n8n-control/`: local MCP plugin source shared by Codex and OpenClaw.
- `plugins/n8n-control/skills/`: Codex instructions for administering n8n through the MCP tools.
- `openclaw/`: main coordinator prompt, five specialist role prompts, team config example, and orchestration skill.
- `n8n/`: provisioning notes and workflow contract for the first multi-brand rollout.
- `.env.example`: names and shapes of runtime configuration only.

## Setup state

The MCP entry `social-n8n-admin` is registered and enabled in the Codex CLI, and the same stdio server is registered in OpenClaw. The local MCP handshake and tool listing work. The read-only status call correctly reports that n8n is not configured: neither host has `N8N_BASE_URL` nor `N8N_API_KEY`. Set the API root, such as `https://your-instance.example/api/v1`, and keep the key in each host's protected environment, not in Git. The OpenClaw coordinator has the `full` tools profile and the MCP server uses `approve` mode, which skips per-call approval; other OpenClaw policies and the n8n API key still apply.

The OpenClaw coordinator and five specialist agents (strategy, copy, art direction, carousel design, and QA) are registered, and the orchestrator skill is installed in its workspace. Their day-to-day text model is still OpenAI-backed, so do not authenticate OpenAI OAuth until a separate text provider is configured; otherwise the image-only usage boundary is not established. Meta publishing also needs an n8n credential created through the Meta OAuth flow, plus a Facebook Page and an Instagram Professional account connected to that Page. This project does not fabricate or store those credentials.

The implementation source carries an MIT license. No GitHub remote has been chosen, so the project is not published or pushed yet. Keep credentials, client media, and generated assets outside the repository.

See [setup and architecture](./n8n/README.md) and the original [PRD](../PRD%20-%20Automa%C3%A7%C3%A3o%20de%20Conte%C3%BAdo%20Social%20com%20IA.md), [technical plan](../Plano%20T%C3%A9cnico%20-%20Automa%C3%A7%C3%A3o%20Social%20com%20IA.md), and [tasks](../Tasks%20-%20Automa%C3%A7%C3%A3o%20Social%20com%20IA.md).
