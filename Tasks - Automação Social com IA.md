---
title: "Tasks - Automação Social com IA"
status: "Implementação em curso"
created: 2026-10-02
tags: [nexacos, n8n, codex, openclaw, mcp, tarefas, backlog]
---

# Backlog — Automação Social com IA

> Plano de execução proposto. Codex e OpenClaw devem operar o n8n pela ponte MCP; o utilizador não precisa montar os blocos no editor. O n8n faz agenda/publicação; OpenClaw faz estratégia e copy; Codex Plus é chamado exclusivamente para criar/editar imagens.

## Fase 0 — Contas e operação pretendida

- [ ] **T00 — Confirmar modelo multi-marca** — Listar marcas iniciais e prever várias contas Facebook/Instagram por marca.
- [ ] **T01 — Confirmar contas Meta** — Identificar Página(s) Facebook e contas Instagram profissionais, proprietário/admin e relação entre contas.
- [ ] **T02 — Reunir materiais das marcas** — Websites, logótipos, guias visuais, fotos/clips autorizados, serviços, contactos, ofertas, restrições e exemplos.
- [ ] **T03 — Configurar regras por conta** — Definir frequência, formatos, idioma, fuso, horário e publicação autónoma; revisão humana fica opcional.
- [ ] **T04 — Seleccionar ambiente** — Escolher VPS/servidor sempre ligado para n8n, MCP, OpenClaw, worker de imagem, PostgreSQL e storage.
- [x] **T05 — Criar repositório GitHub MIT** — Repositório público `joelbennz/nexacos-social-content-automation`, branch `main`, licença MIT e conteúdo publicado sem tokens, auth.json, mídia nem credenciais.

## Fase 1 — MCP partilhado para Codex e OpenClaw (bloqueadora)

- [x] **T06 — Implementar servidor `n8n-admin-mcp`** — Servidor MCP local `n8n-control` expõe chamadas genéricas à API pública do n8n por método HTTP e endpoint. Os recursos disponíveis seguem a API e a chave configuradas.
- [ ] **T07 — Ligar n8n e provisionar acesso administrativo** — Usar a API key administrativa da instância da agência, ou fazer uma autorização inicial única se ainda não existir; guardar segredo e conceder aos agentes acesso a todos os recursos/métodos públicos dessa instância, sem aprovação por operação.
- [x] **T08 — Registar o MCP no Codex** — A entrada `social-n8n-admin` está registada e activa no Codex CLI. A origem responde localmente; falta URL/chave do n8n para conectar a instância.
- [x] **T09a — Registar OpenClaw e dar acesso ao agente operador** — MCP registado sem filtro de ferramentas; agente principal com perfil `full` e modo `approve` para não pedir aprovação por chamada.
- [ ] **T09b — Confirmar conectividade OpenClaw↔n8n** — Pendente da URL/API key da instância. O handshake local e listagem MCP passaram; o estado n8n devolve configuração em falta.
- [ ] **T10 — Provar ciclo completo com workflow de teste** — Codex e OpenClaw devem cada um criar, editar, activar, executar, inspeccionar e remover um workflow de teste via MCP; nenhuma edição manual no painel.
- [ ] **T11 — Confirmar controlo de execução** — Verificar listagem de workflows, estado, logs, execução sob demanda, pausa e recuperação de erro por ambos os agentes.

## Fase 2 — Codex Plus apenas para geração/edição de imagens

- [x] **T12a — Seleccionar modelo visual OpenClaw** — `openai/gpt-image-2` está definido como modelo de imagem.
- [ ] **T12b — Autenticar geração visual pelo plano Plus** — Login OAuth Codex no OpenClaw ainda pendente; não usar API key paga.
- [ ] **T13 — Gerar imagem de teste** — Confirmar que `image_generate` produz e grava um ficheiro com a autenticação Plus.
- [ ] **T14 — Isolar a função Codex** — OAuth Codex fica reservado à ferramenta visual; agentes de texto usam provider separado e n8n não chama Codex para publicar.
- [ ] **T15 — Validar quota e fila** — Serializar jobs visuais; confirmar que copy/publicação seguem sem Codex e que quota/autenticação falhada não muda para API paga.
- [ ] **Decisão de saída:** se a geração Plus não for fiável ou a quota estiver esgotada, usar asset previamente aprovado ou upload manual de imagem Plus; n8n continua as restantes operações.

## Fase 3 — Infraestrutura base

- [ ] **T16 — Criar Docker Compose e configuração** — Incluir n8n, PostgreSQL, storage e serviços MCP/worker; incluir `.env.example` sem valores secretos.
- [ ] **T17 — Configurar persistência e acesso** — HTTPS, volumes, backups, logs, health checks, política de actualização e acesso ao host.
- [ ] **T18 — Criar secret stores** — Separar API key do n8n, OAuth Meta por conta, tokens dos webhooks e autenticação Codex fora do Git.
- [ ] **T19 — Configurar object storage privado** — Pastas/buckets separados por marca, URLs temporários para a Meta e política de retenção.

## Fase 4 — Multi-marca e onboarding

- [ ] **T20 — Implementar modelo de dados multi-marca** — Tabelas para brands, facts, social accounts, assets, posts, post_account, publication e execuções.
- [ ] **T21 — Criar onboarding por formulário/API** — Receber dados do site, tom, objectivos, localização, CTA, ofertas, canais e agenda de cada marca.
- [ ] **T22 — Criar upload de materiais** — Receber logótipos, fotos, vídeos e documentos; verificar tipos, dimensões, tamanho e direitos de uso.
- [ ] **T23 — Ligar contas Meta individualmente** — Guardar credencial por Página/Instagram; nunca reutilizar token entre marcas.
- [ ] **T24 — Importar contexto editorial** — Extrair factos do site/materiais, guardar fontes, pilares, público, tom e palavras proibidas para cada marca.

## Fase 5 — OpenClaw e agentes especializados de texto/editorial

- [x] **T25 — Configurar agente operador OpenClaw** — Instruções e skill instaladas no workspace; agente principal ligado ao MCP e autorizado a delegar para os cinco especialistas. Falta conectar n8n e configurar provider de texto.
- [x] **T26 — Registar agente estratega** — Agente OpenClaw criado com instruções próprias; provider de texto ainda pendente.
- [x] **T27 — Registar agente copywriter** — Agente OpenClaw criado com instruções próprias; provider de texto ainda pendente.
- [x] **T28 — Registar especialista de carrosséis** — Agente OpenClaw criado com instruções próprias; provider de texto ainda pendente.
- [x] **T29 — Registar director de arte e agente QA** — Ambos agentes OpenClaw criados com instruções próprias; falta provider de texto e autenticação visual.
- [ ] **T30 — Integrar n8n com OpenClaw** — n8n agenda e chama o fluxo de agentes por webhook/API; receber copy/brief via callback. Confirmar que este caminho não inicia Codex.

## Fase 6 — Geração visual e carrosséis

- [ ] **T31 — Criar workflow visual** — Chamar Codex Plus apenas quando for preciso gerar/editar imagem; ligar o asset à marca, conta e publicação.
- [ ] **T32 — Criar composição de flyers** — Compor logótipo, preços, telefones e texto exacto em template gráfico após a geração.
- [ ] **T33 — Criar composição de slides** — Gerar ou preparar imagens por slide e compor copy com leitura móvel, marca e continuidade visual.
- [ ] **T34 — Reutilizar assets quando possível** — Permitir que n8n use imagem já aprovada para post quando a quota Plus não estiver disponível.
- [ ] **T35 — Validar tamanho e qualidade** — Inspeccionar resolução, proporção, formato, texto sobreposto, margens, logótipo, contraste e sequência do carrossel.

## Fase 7 — Publicação autónoma no Facebook e Instagram

- [ ] **T36 — Criar workflow de agenda** — Ler cadência/fuso/horário por conta e preparar posts sem um agente Codex em execução contínua.
- [ ] **T37 — Implementar publicação Instagram** — Usar Content Publishing API para cada conta profissional e guardar media ID.
- [ ] **T38 — Implementar publicação Página Facebook** — Publicar imagem/carrossel e copy pela Graph API e guardar post ID.
- [ ] **T39 — Implementar locks, deduplicação e retries** — Impedir duplicados por post/conta; retries idempotentes e limitados.
- [ ] **T40 — Tornar revisão opcional** — Normalmente publicar autonomamente; permitir activar revisão para uma marca ou pedir uma revisão a qualquer momento.
- [ ] **T41 — Testar uma publicação autorizada por conta** — Confirmar formato, copy, imagem, hora, destino, resultado e ligação ao registo correcto.

## Fase 8 — Operação, monitorização e escala

- [ ] **T42 — Criar alertas** — Informar OpenClaw e operador sobre falha Meta, quota Codex, worker visual, MCP inacessível, erros n8n e credenciais expiradas.
- [ ] **T43 — Garantir continuidade** — Falha de imagem pausa apenas a imagem/post afectado; outras marcas e posts continuam. Falha de conta pausa só essa conta.
- [ ] **T44 — Criar painel/relatório mínimo** — Expor fila, posts agendados/publicados, execuções e erros por marca.
- [ ] **T45 — Documentar apenas acções de autorização inicial** — Documentar como ligar a instância n8n e autorizar contas Meta; operação diária e alterações de workflows ficam a cargo dos agentes.
- [ ] **T46 — Rever licença n8n multi-cliente** — Confirmar termos comerciais aplicáveis antes de alojar workflows/credenciais de clientes numa instância central.
- [ ] **T47 — Compor Reels opcionais** — Usar FFmpeg para vídeo vertical com imagens e clips autorizados; validar suporte do endpoint Meta antes da publicação.

## Dependências críticas

```text
T00–T05 → T06–T11 → T12–T15 → T16–T19 → T20–T24
                                      ├→ T25–T30 (OpenClaw copy/strategy)
                                      ├→ T31–T35 (Codex Plus images only)
                                      └→ T36–T41 (Meta publish) → T42–T47
```

## Ligações

- [[PRD - Automação de Conteúdo Social com IA]]
- [[Plano Técnico - Automação Social com IA]]

## Implementação local — 2026-10-02

- Feito: servidor MCP registado no Codex e no perfil OpenClaw deste computador. `openclaw mcp status` confirma configuração activa; `openclaw mcp probe` lista `n8n_api_request` e `n8n_status` sem diagnósticos; cache MCP limpo para o próximo runtime do agente. A ligação à API n8n continua pendente porque faltam URL/chave.
- Feito: agente OpenClaw principal, cinco agentes especialistas e skill de orquestração instalados/registados. O principal tem perfil `full`, delegação configurada e MCP em modo `approve`; a chave n8n ainda não está configurada.
- Feito: modelo de imagem definido para `openai/gpt-image-2`; login OAuth do Codex no OpenClaw não foi iniciado.
- Pendente: escolher/configurar provider de texto independente. O modelo actual do OpenClaw é `openai/gpt-6-astra`; autenticar o OAuth OpenAI antes de separar o texto pode permitir que chamadas de texto também usem a rota Codex.
- Feito: repositório Git local inicializado, commit `9b30c46` e publicação no GitHub público [joelbennz/nexacos-social-content-automation](https://github.com/joelbennz/nexacos-social-content-automation); `main` acompanha `origin/main`.
- Pendente: URL/API key do n8n, credenciais Meta por conta, storage persistente e callback acessível. Sem estas integrações não foram criados workflows nem executadas publicações.

## Recuperação do runtime — 2026-10-03

- Observação recebida do agente: a sessão anterior não expôs as ferramentas MCP. O registo no perfil local, por sua vez, aparece configurado/activo e o probe local anuncia `n8n_api_request` e `n8n_status` sem diagnósticos.
- Recuperação: o Gateway local estava sem `gateway.mode`; foi definido como `local` e o processo foi reiniciado. A porta `127.0.0.1:18789` voltou a escutar com o MCP configurado.
- Estado actual: o utilizador confirmou que o Gateway está funcional; não é o bloqueio corrente e não deve ser reiniciado para este diagnóstico.
- Codex: `codex mcp list` mostra `social-n8n-admin` habilitado, mas as ferramentas não aparecem no catálogo desta sessão activa. A documentação do Codex indica que a configuração local é partilhada com a app desktop e pode ser actualizada em Settings → MCP servers → Restart; confirmar a exposição após o refresh.
- [ ] T09b — Confirmar que uma sessão Codex/OpenClaw expõe o MCP e chamar `n8n_status`. O probe do servidor MCP passa, mas o catálogo desta sessão Codex ainda não inclui as ferramentas.
- [ ] T07 — Ligar n8n e provisionar acesso administrativo — URL e chave da API ainda ausentes; configurar a chave no ambiente protegido.
- [ ] T10 — Provar ciclo completo com workflow de teste — Pendente de T07/T09b; nenhum workflow foi criado, executado ou publicado.
