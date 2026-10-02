# OpenClaw agent team

The role instructions in `agents/` are the source for the agency's content team. The orchestrator calls those roles for strategy, copy, visual direction, carousel sequence, and final review. `skills/social-content-orchestrator/SKILL.md` describes the full handoff to n8n.

## Image generation through the ChatGPT plan

OpenClaw's bundled OpenAI image tool supports `openai/gpt-image-2` through OpenAI Codex OAuth. The image model setting is already applied. The OAuth profile itself is not authenticated: it must be authorized from the OpenClaw installation with `openclaw models auth login --provider openai`. A normal “Sign in with ChatGPT” session is not sufficient.

OpenClaw stores ChatGPT/Codex OAuth under provider `openai`, which can also authenticate OpenAI text models. The currently configured default text model is `openai/gpt-6-astra`; therefore the image-only usage boundary is not yet established. Configure and verify a separate non-Codex text provider for the coordinator and specialists before performing OAuth login. OpenAI API-key billing is a different route and is not configured here.

```powershell
openclaw config set agents.defaults.mediaModels.image.primary openai/gpt-image-2
openclaw models auth login --provider openai
```

OAuth must be completed on the computer running the OpenClaw gateway. If the profile is missing, the visual job stops with an authentication error; there is no automatic API-key fallback. Image generation through this route uses the ChatGPT/Codex plan allowance. OpenAI API usage is billed separately from ChatGPT Plus.

## OpenClaw and n8n

`n8n-control` is a local stdio MCP server, already registered as `social-n8n-admin` in OpenClaw. Its tool filter is empty, so the adapter exposes its two tools: a read-only status check and a generic request tool for the full n8n Public API, including destructive HTTP methods. The main agent has profile `full`; server approval mode `approve` skips per-call approval. Actual authority is bounded by the n8n API key and any remaining OpenClaw policy. Both `N8N_BASE_URL` and `N8N_API_KEY` are still missing, so the adapter is not connected to an instance.

`AGENTS.md` contains the coordinator instructions; the five directories under `agents/` contain specialist prompts. `TEAM-CONFIG.example.json5` is a portable reference; the live OpenClaw configuration and agent workspaces have already been set up on this computer. Keep `N8N_API_KEY` in the Gateway's protected environment. The main agent's `full` tool profile makes configured MCP tools available; other OpenClaw policy layers may still affect visibility. The server itself has no tool filter and exposes its complete n8n API adapter.

The main OpenClaw agent is configured to delegate to the five registered specialists, and the social-content orchestration skill is installed in its workspace. The image model is set, but OAuth authentication and a non-Codex text provider remain pending. A local MCP handshake and tool discovery succeeded; the n8n status call returned the expected missing-configuration response, so no live n8n or Meta workflow has been run.

## Labels and video

If “etiqueta dia” means a date printed on the creative, the workflow omits it unless the campaign has an event date. If it means Meta's “AI info” label, the workflow will not strip provenance or attempt to evade Meta detection. Meta may add that label from industry-standard signals or user disclosure, and the publishing API cannot promise to suppress it.

The current `image_generate` path creates and edits still images. Reels can later be assembled from approved photos or client-provided clips with FFmpeg, but generated-video automation needs a separate supported video provider and its own authorization/cost decision.
