---
title: "PRD - Automação de Conteúdo Social com IA"
status: "Implementação iniciada"
created: 2026-10-02
tags: [nexacos, marketing, instagram, facebook, n8n, codex, prd]
---

# PRD — Automação de Conteúdo Social com IA

> Estado: escopo aprovado pelo pedido de avançar para implementação; ligações externas e publicação real aguardam credenciais e configuração dos serviços.

## 1. Resumo

Criar uma operação multi-marca para a Nexacos Intelligence gerir várias marcas e contas de Facebook e Instagram. Este Codex e o OpenClaw usarão a mesma ponte MCP para administrar e executar workflows no n8n. O n8n executa a rotina; agentes do OpenClaw cuidam de estratégia e textos; a ferramenta de imagem do OpenClaw, autenticada por OAuth Codex, entra exclusivamente para gerar ou editar imagens.

As imagens serão geradas pelo `image_generate` do OpenClaw com o modelo `openai/gpt-image-2` e autenticação Codex OAuth ligada à conta ChatGPT Plus do Joel. Isto usa o limite de utilização do plano; não será usada uma chave paga da OpenAI API para imagens nem fallback automático. O n8n e os agentes de texto não chamam Codex para copy, agenda ou publicação; os trabalhos visuais são a única etapa automática que consome quota Codex. O provider de texto do OpenClaw tem de ser configurado separadamente para não consumir essa quota. Pedidos feitos nesta conversa do Codex para administrar o n8n via MCP podem consumir o uso normal desta sessão. OpenClaw e Codex podem comandar o n8n através do mesmo servidor MCP; a API da Meta publica.

O primeiro onboarding pode começar pela Nexacos Intelligence, mas a estrutura inicial tem de suportar várias marcas e várias contas sociais, isolando dados, materiais, credenciais, agendas e publicações por marca e conta. A licença do n8n para a agência gerir clientes numa instância central continua a ser uma decisão de implementação a confirmar.

## 2. Problema

Produzir publicações frequentes manualmente dá trabalho e dificulta manter consistência. A agência precisa de um processo em que possa fornecer website, descrição da empresa, identidade visual, fotografias, vídeos e materiais comerciais; receber conteúdos coerentes com a marca; e publicar sem copiar e colar todos os dias.

## 3. Utilizadores

- **Administrador da agência:** configura a marca, os canais, os horários e as credenciais.
- **Codex e OpenClaw:** operadores com acesso administrativo livre à API pública completa da instância n8n ligada, pelo MCP, para gerir workflows, execuções, credenciais e os restantes recursos disponíveis na API.
- **Agentes especialistas:** estratega de marca, copywriter, director de arte/especialista de imagens, especialista de carrosséis e revisor de qualidade factual/editorial.
- **Operador humano da agência:** dá instruções e materiais aos agentes, consulta resultados e pode pedir revisão ou interromper uma operação; não precisa montar workflows no painel do n8n.

## 4. Objectivos

- Gerir várias marcas, cada uma com uma ou mais Páginas de Facebook e contas profissionais de Instagram.
- Publicar segundo a cadência configurada por marca e conta social.
- Receber por formulário/webhook o website, texto institucional e ficheiros da marca.
- Usar o `image_generate` do OpenClaw com OAuth Codex/Plus apenas para gerar ou editar imagens dentro do limite do plano.
- Permitir que Codex e OpenClaw controlem o n8n por MCP, criem os blocos/workflows e executem operações sem exigir configuração manual do utilizador no n8n.
- Operar autonomamente segundo a configuração de cada marca; a revisão humana fica disponível a pedido ou como opção por marca.
- Usar agentes especialistas do OpenClaw para estratégia, redação, direcção visual e narrativa de carrosséis; o n8n executa o processo sem invocar Codex nessas etapas. O provider OpenClaw tem quota/custos próprios e é configurado separadamente.
- Registar o estado de cada conteúdo e avisar quando houver falha, expiração de autenticação ou falta de quota.
- Guardar workflows exportáveis e reutilizáveis num repositório GitHub com licença MIT, sem guardar credenciais, mídia ou dados privados no repositório.

## 5. Fora do âmbito do primeiro piloto

- Gestão de comentários, mensagens privadas, anúncios pagos ou resposta automática a clientes.
- Aplicação SaaS pública ou acesso directo de clientes ao painel do n8n.
- Publicação em Stories, TikTok, YouTube ou outras plataformas.
- Geração de vídeo sintético autónoma.
- Política de revisão humana obrigatória para todas as marcas; revisão será opcional e configurável por marca.

## 6. Fluxo principal

1. O administrador envia pelo formulário a URL do website, descrição da empresa, serviços, público, tom de voz, contactos, ofertas e restrições.
2. Envia logótipo, guia de marca, fotografias, vídeos e referências visuais para uma pasta de materiais da marca.
3. O n8n valida o envio, guarda os ficheiros e abre um registo para a marca.
4. Codex ou OpenClaw recebem a instrução em linguagem natural e podem criar/editar/activar/executar workflows necessários pelo MCP partilhado. A rotina recorrente de agenda e publicação corre no n8n sem precisar que Codex fique a trabalhar em segundo plano.
5. Os agentes especialistas do OpenClaw planeiam temas, aperfeiçoam textos, criam brief visual e narrativa de carrossel, e verificam factos/tom/formato usando o modelo configurado para o OpenClaw.
6. Só a etapa de criar ou editar uma imagem chama `image_generate` através do perfil OAuth Codex do OpenClaw. O n8n guarda o resultado e compõe logótipo ou texto exacto por template gráfico quando necessário.
7. O n8n agenda e publica automaticamente; o OpenClaw e este Codex podem consultar ou executar workflows a pedido pelo MCP. Revisão humana é opcional.
8. O sistema regista a execução e o identificador por marca, conta e canal. Falhas são reportadas ao agente operador para diagnóstico e nova execução controlada.

## 7. Escopo funcional do MVP

### Incluído

- Suporte multi-marca e multi-conta social desde a primeira versão operacional.
- Nexacos Intelligence como primeira marca de onboarding.
- Uma ou mais Páginas de Facebook e contas profissionais de Instagram por marca.
- Servidor MCP partilhado entre este Codex e OpenClaw, com acesso livre à API pública completa do n8n e ferramentas directas para criar/editar/activar/executar workflows.
- OpenClaw como operador autónomo; não apenas como canal para enviar pedidos.
- Agentes especialistas do OpenClaw para estratégia, copywriting, direcção de arte, narrativa de carrosséis e qualidade editorial.
- Formulário protegido por token para configuração da marca e envio de materiais.
- Geração de texto pelo OpenClaw e geração/edição de imagem pelo Codex Plus conforme a cadência de cada marca e conta, com variantes por canal.
- Português de Angola, com base nas informações aprovadas do website e nos materiais enviados.
- Publicação automática segundo as instruções da marca; revisão humana opcional quando pedida/configurada.
- Publicação de imagem, carrossel e formatos suportados em Facebook e Instagram.
- Agenda configurável por conta, dia, hora e fuso horário.
- Registo de estados, erro, tentativas e IDs devolvidos pela Meta.
- Botão/configuração para pausar a fila de publicação.

### Fase seguinte

- Onboarding self-service dos clientes.
- Reels com clips autorizados e geração adicional de formatos de vídeo.
- Relatório simples de publicações e métricas disponíveis pela API.

## 8. Requisitos não funcionais

- O n8n e o armazenamento devem permanecer disponíveis para a rotina autónoma. OpenClaw trata os trabalhos criativos textuais; a sua ferramenta `image_generate` usa OAuth Codex só quando uma tarefa pede imagem nova ou edição.
- Codex e OpenClaw usam uma credencial administrativa do MCP para administrar todos os recursos expostos pela API pública da instância n8n configurada, sem aprovação humana por ferramenta/operação.
- Os pedidos de imagem via OAuth Codex devem correr em fila serial. Publicações, copy, agendamento e retries não devem iniciar chamadas de imagem nem chamadas Codex.
- A chave de autenticação do Codex, tokens da Meta e segredos do webhook ficam fora do GitHub e fora dos ficheiros exportados dos workflows.
- Os links públicos de mídia usados pela Meta devem expirar depois de uma janela curta suficiente para a Meta obter o ficheiro.
- Se a autenticação OAuth Codex expirar, a quota acabar ou a geração de imagem falhar, o workflow pode usar asset aprovado já existente ou aguardar uma imagem fornecida manualmente; não usa API paga nem chama Codex para outras etapas.
- Todos os factos comerciais e ofertas devem poder ser rastreados até ao material fornecido; os agentes de texto não podem inventar preços, contactos, garantias ou resultados.

## 9. Critérios de aceitação

- O formulário aceita os dados da empresa, URL e os tipos de ficheiro definidos.
- O n8n agenda, publica e trata retries sem executar Codex para copy ou operações de workflow.
- Os agentes OpenClaw entregam copy estruturado; quando necessário, `image_generate` gera ou edita a imagem através do perfil OAuth Codex/Plus.
- Não é feito fallback silencioso para uma chave API paga de geração de imagem.
- O Codex e o OpenClaw conseguem gerir workflows e execuções pelo MCP partilhado, sem o utilizador editar blocos no n8n.
- O conteúdo configurado para publicação automática é publicado uma vez por conta/canal; retries não duplicam posts.
- Uma marca pode activar revisão humana opcional sem alterar a autonomia das outras marcas.
- O resultado, hora, canal, estado e IDs da Meta ficam registados.
- Uma falha de imagem Plus pausa apenas esse job visual e envia aviso legível; os restantes posts/contas continuam.
- O administrador consegue pausar publicações futuras sem apagar a fila.
- Uma marca/conta nova pode ser criada ou configurada pelo agente sem misturar credenciais, materiais ou publicações de outra marca.
- Workflows-base podem ser duplicados ou ajustados por Codex/OpenClaw sem transportar tokens entre marcas.

## 10. Imagens, plano Plus e limites

O requisito do Joel é usar o plano ChatGPT Plus apenas para imagens. O OpenClaw pode chamar a ferramenta `image_generate` com autenticação Codex OAuth; a utilização fica sujeita aos limites do plano e não é a mesma coisa que chamar a Image Generation API, cobrada à parte. Copy, agenda, publicação e manutenção dos workflows ficam fora do Codex. O provider de texto do OpenClaw é uma configuração separada e ainda está pendente.

O desenho usa a ferramenta `image_generate` do OpenClaw com o perfil OAuth Codex e o modelo de mídia `openai/gpt-image-2`. O OpenClaw mantém a credencial no seu próprio armazenamento de autenticação; não enviar tokens ao n8n, aos workflows nem ao GitHub. A documentação do OpenClaw alerta que renovar tokens em clientes OpenAI separados pode invalidar sessões anteriores; confirmar a sessão existente antes do login. A rota OAuth pode ter limites de modelo/plano e falhar; nesse caso, reutilizar asset aprovado ou aguardar uma imagem enviada pelo utilizador, sem recorrer à API paga.

**Contingência sem API paga:** se a prova técnica ou os limites do Plus impedirem geração totalmente automática, o utilizador pode fornecer uma imagem feita manualmente no ChatGPT Plus; o n8n continua a gerir texto, agenda e publicação, sem parar toda a automação nem recorrer a uma API de imagem paga.

## 11. Etiqueta “AI info”

Se “etiqueta dia” significa uma data impressa na imagem, o fluxo omite-a salvo quando a campanha tiver uma data de evento. Se significa a etiqueta **“AI info” / conteúdo feito com IA**, o sistema não promete removê-la nem impedir que a Meta a aplique. O fluxo não vai retirar metadados de proveniência nem contornar mecanismos de transparência.

Alternativa de produção: usar fotografias e vídeos reais da empresa como base visual, e usar IA para copy, tratamento, recorte e composição gráfica. Isso muda genuinamente a origem do material visual, mas também não garante como a Meta vai classificar a publicação. Para vídeo ou áudio realista criado ou alterado digitalmente, seguir a opção de divulgação da própria plataforma.

## 12. Premissas e decisões pendentes

- O piloto é da Nexacos Intelligence; essa empresa está registada no workspace como agência de Marketing Digital em Luanda.
- A conta Instagram é profissional (Business ou Creator) e está ligada à Página Facebook correcta. Se não estiver, será necessário preparar essa ligação antes do teste.
- O horário e o fuso `Africa/Luanda` são sugestões iniciais; o utilizador confirma antes da configuração.
- O modo pretendido é publicação autónoma; revisão humana fica disponível por marca ou quando pedida.
- O provider/modelo de texto dos agentes OpenClaw será configurado separadamente; a utilização desse modelo não deve consumir a quota Codex reservada para imagem.
- Uma instrução enviada directamente daqui pelo Codex para gerir n8n via MCP pode consumir o uso normal desta sessão Codex; a rotina recorrente no n8n não usa Codex, excepto quando precisa de criar/editar imagem.
- O repositório do projecto fica privado enquanto usar autenticação Plus do Codex. O n8n pode ser auto-hospedado, mas a sua licença é fair-code/Sustainable Use License, não uma licença OSI permissiva. A utilização central para credenciais e workflows de clientes deve ser revista com a n8n; o desenho inicial limita-se à própria agência.
- A primeira publicação pode requerer permissões, roles de teste, revisão da app ou configuração de permissões na Meta. Isso será confirmado no onboarding técnico.

## 13. Referências consultadas

- [Codex — geração de imagem e limites do plano](https://learn.chatgpt.com/docs/image-generation)
- [Codex — preço, uso Plus e diferença entre plano e API](https://learn.chatgpt.com/docs/pricing)
- [Codex — autenticação de conta em automação privada](https://learn.chatgpt.com/docs/auth/ci-cd-auth)
- [OpenClaw — ligar servidores MCP](https://docs.openclaw.ai/tools/mcp)
- [n8n — autenticação da API pública e permissões](https://docs.n8n.io/api/authentication/)
- [n8n — referência da API pública](https://docs.n8n.io/api/api-reference/)
- [Instagram API oficial da Meta — contas profissionais e publicação](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api)
- [Facebook Graph API oficial da Meta](https://www.postman.com/meta/facebook/documentation/r56bjfd/facebook-api)
- [Meta — identificação e etiquetas de conteúdo gerado por IA](https://about.fb.com/news/2024/02/labeling-ai-generated-images-on-facebook-instagram-and-threads/)
- [n8n — nó Facebook Graph API](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.facebookgraphapi/)
- [n8n — licença Sustainable Use](https://docs.n8n.io/sustainable-use-license/)
- [OpenAI — descontinuação da API de vídeo Sora em 24/09/2026](https://developers.openai.com/api/docs/deprecations)

## Ligações

- [[Plano Técnico - Automação Social com IA]]
- [[Tasks - Automação Social com IA]]
