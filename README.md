# Nexacos Social Content Automation

Multi-brand publishing automation for Facebook and Instagram. n8n owns schedules, retries, and publication; OpenClaw coordinates specialist content agents; Codex OAuth through OpenClaw's `image_generate` is reserved for images.

## Repository map

- `PRD - Automação de Conteúdo Social com IA.md` — product scope and acceptance criteria.
- `Plano Técnico - Automação Social com IA.md` — architecture and integration design.
- `Tasks - Automação Social com IA.md` — delivery status and blockers.
- `implementation/plugins/n8n-control/` — local MCP adapter shared by Codex and OpenClaw.
- `implementation/openclaw/` — coordinator, specialist prompts, and OpenClaw team example.
- `implementation/n8n/` — workflow contract and provisioning requirements.

## Current setup

The `social-n8n-admin` MCP entry is already registered in Codex and OpenClaw. Set `N8N_BASE_URL` to the instance API root ending in `/api/v1` and `N8N_API_KEY` in both hosts' protected environments; do not commit the key. Meta OAuth credentials, storage, a public callback route, and a non-Codex text provider are also required before autonomous publishing.

Never commit API keys, OAuth profiles, `auth.json`, client media, or generated assets. `implementation/.gitignore` excludes the local secret and media paths.

## License

The repository code and implementation artifacts are under the MIT License. The n8n product remains under its own license; review n8n's terms for your deployment model.
