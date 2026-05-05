# CLAUDE_STATE.md

Memória de sessão. Atualize ao final de cada sessão antes de resetar o chat.

Combina dois papéis:
- **Snapshot vivo**: status atual, arquivos, pendências, dúvidas
- **Decisions Log** (append-only): histórico de decisões pra evitar revisitar

---

## Projeto
**Fluxo** — PWA estático (HTML/CSS/JS puro, sem build) de gestão de tarefas com tema pastel inspirado em rio. Roda local ou em GitHub Pages / Vercel. Storage em `localStorage`. Sem backend.

**Repo**: `incertij/test-claude`
**Branch ativa**: `claude/fluxo-v2`
**Deploy**: GitHub Pages apontando pra esta branch.

---

## Status Atual (última sessão)

### Implementado nesta iteração (v3, ainda não commitado no momento desta escrita — committed junto com este arquivo)

**Tema e identidade**
- Logo SVG estilo rio (3 curvas, gradiente água→menta sobre fundo creme)
- Título "Fluxo" no header com gradiente pastel (água → menta → areia → coral) via `background-clip: text`
- Modo escuro automático via `@media (prefers-color-scheme: dark)`. Paleta espelhada: bg `#1a2222`, surface `#232c2c`, importâncias dessaturadas

**Layout dos cards de tarefa (Planner-style)**
- Borda inteira do card colorida pela importância (não barra lateral). Background com tint suave da cor.
- 2 linhas máximo no corpo: título + tags
- Canto superior direito: badge crítico (transparente, texto+borda na cor da importância) empilhado com data (`15 jan` + `em 3d` em duas linhas pequenas)
- Canto inferior direito: ícone de frequência (`↻` rotina, `→` pontual) + contador `done/total`
- Pontuais sem subtarefas mostram `0/1` → `1/1` ao concluir
- Click handlers individuais (com `stopPropagation`):
  - Tag pill → abre modal de edição da tag
  - Data → abre modal `quick-date-modal` (alterar/remover)
  - Ícone de frequência → toast com a cadência
  - Resto do card → modal completo de edição

**Animação de conclusão**
- Função `playBurst(anchor)` cria 14 partículas pastel ao redor do checkbox (CSS keyframe `burst`)
- Card recebe classe `.completing` que aciona `taskCollapse` (encolhe + fade, 440ms)
- Após animação: pontual → marca `completed`; rotina → adiciona ao `state.pendingRenewIds` (Set), abre modal de renovação
- `cancelRenew()` (X ou clique fora) restaura tarefa removendo do Set

**Home reformulada**
- Tab principal renomeada de duas seções para "Lembrete" (pontuais importantes + próximas) e "Pra hoje" (rotinas com `nextDue <= today`)
- Cada seção tem altura fixa `flex: 1 1 50%` com cabeçalho sticky e lista interna scrollável
- View `.view--home` tem `overflow: hidden` (não rola), lists internas rolam

**Tab Pendentes**
- Renomeada de "A fazer" → "Pendentes"
- Filtros: 3 dropdowns (Tipo / Importância / Categoria) + toggle "Mostrar concluídas"
- Removido: campo de busca por texto e chips de tag

**Calendário**
- Tap no nome do mês abre `month-picker-modal` com seletor ano (‹ › ) + grid 3×4 de meses
- Score por dia agora inclui rotinas baixas também (decisão do usuário em sessão anterior)
- Pesos: baixa=1, média=6, alta=10, crítica=30

**Schema e formulário**
- Adicionado `years` em `interval-unit` e `notif-unit`
- Renomeado label "Rotineira" → "Se repete"
- Modal não dá `.focus()` em título → não abre teclado virtual no celular

**Notificações**
- `offsetMs(amount, unit)` agora suporta `months` (~30d) e `years` (~365d)
- Digests diários 09h e 22h continuam ativos

### Estados de execução
- `state.pendingRenewIds: Set` — IDs de rotinas em renovação (escondidas até confirmação)
- `state.pendingRenew: { taskId } | null`
- `state.editingDateTaskId` — task sendo editada via quick-date
- `state.monthPickerYear` — ano sendo navegado no picker do calendário
- `state.filters: { type, imp, tagId, showDone }` — sem `q` (busca removida)

---

## Arquivos Modificados Recentemente

| Arquivo | Mudança | Tamanho aprox. |
|---|---|---|
| `app.js` | Reescrita parcial: home, card layout, animações, filtros, quick-date, month-picker, parse de years | ~1100 linhas |
| `styles.css` | Reescrita: dark mode, gradiente título, card grid, animações, sections fixas, popover modals | ~700 linhas |
| `index.html` | Adicionados modais quick-date e month-picker, anos nas selects, label "Se repete" | ~190 linhas |
| `sw.js` | Cache version `fluxo-v3` (para invalidar cache PWA) | inalterado funcionalmente |
| `manifest.json` | Sem mudança nesta iteração |
| `icon.svg` | Sem mudança nesta iteração |

---

## Pendências Próximas

### Mudanças solicitadas pelo usuário — NÃO IMPLEMENTADAS

Sessão de 2026-05 listou 12 mudanças. Apenas a #1 foi feita. Continuar daqui na próxima sessão.

| # | Mudança | Status | Notas técnicas |
|---|---|---|---|
| 1 | Reestilizar botão "Criar" no seletor de tags | ✅ FEITO | trocado `ghost-btn` → `primary-btn` em `tag-select-modal` |
| 2 | Toggle "Sem notificações" na tarefa | ⏳ pendente | novo campo `t.silentNotifications: bool`. Excluir task de `buildScheduledNotifications` E `buildDigestItem`. Default: silencia tudo (per-task + digest) |
| 3 | Mic embutido no input de título (estilo WhatsApp) | ⏳ pendente | Remover `voice-row` separada. Wrapper relativo no input com `<button class="mic-inline">` posicionado absolute right. Tirar texto "Falar". |
| 4 | Fix scroll "Pra hoje" só mostra 2 tarefas | ⏳ pendente | Provavelmente `flex: 1 1 50%; max-height: 50%` está calculando errado. Trocar por `flex: 1 1 0; min-height: 0; max-height: none`. Validar ambas seções rolam. |
| 5 | "Pra hoje" deve incluir pontuais com deadline hoje + ordem desc importância | ⏳ pendente | `renderHome` filter `tasksOnDate(today)` em vez de só rotinas. Sort por `b.importance - a.importance`. NÃO incluir overdue. |
| 6 | Bandeira (🚩) em vez de seta (→) pra pontuais | ⏳ pendente | `freqIcon.textContent = "🚩"` |
| 7 | Lembrete: urgente ≤2 dias acima de crítica + texto "Urgente: X horas restantes" | ⏳ pendente | Sort: rank 0 = `diffDays >=0 && <=2`. Calc horas: assumir 23:59 do dia. Substitui texto da data quando urgente. Overdue mantém "vencida há". |
| 8 | Animação de conclusão muito rápida | ⏳ pendente | Aumentar `taskCollapse` de 0.45s → 0.7s. Aumentar `sleep(440)` → `sleep(700)`. |
| 9 | Reestilizar toggle "Mostrar concluídas" | ⏳ pendente | Trocar checkbox HTML padrão por chip-style (igual `.imp-chip`). Manter mesmo border-radius/cores do app. |
| 10 | Labels visíveis para os 3 filtros | ⏳ pendente | "Tipo", "Importância", "Categoria" como `<span>` acima de cada select. |
| 11 | "Se repete" → "Frequentes" | ⏳ pendente | Em 2 lugares: radio do modal de tarefa (`index.html`) e dropdown de filtro tipo (`app.js renderPending`). |
| 12 | Click no logo Fluxo abre menu de tema (Auto/Claro/Escuro) | ⏳ pendente | Listener em `.brand`. Pequeno modal/popover com 3 botões. Persistir em `fluxo/theme`. Aplicar via `documentElement.dataset.theme`. CSS: `:root[data-theme="dark"]` override + `:root:not([data-theme="light"]):not([data-theme="dark"])` dentro do media query auto. |

### Defaults assumidos para os pendentes (caso não haja revisão)
- (#2) Sem notificações silencia tudo (per-task + digests)
- (#5) "Pra hoje" só `=== today`, NÃO inclui overdue
- (#7) Texto "Urgente" só para futuro <=48h. Overdue mantém visual de vencida.
- (#12) Tema oferece 3 opções: Auto / Claro / Escuro

### Tarefas de migração ao concluir os 12 itens
- Bump cache SW pra `fluxo-v6`
- Atualizar Decisions Log com cada decisão tomada
- Mover entradas desta tabela para "Status Atual" ao serem feitas
- Considerar test no celular após cada lote (sticky, animação, mic)

### Bugs prováveis a verificar no celular (do ciclo anterior)
1. **Animação burst em iOS Safari**: `prefers-color-scheme` e `position: fixed` em particles podem ter quirks. Validar.
2. **Modal aninhado**: ao clicar tag dentro do `tags-modal` (gerenciar) → abre `tag-edit-modal` por cima. z-index OK? Validar.
3. **Sticky header em `.section--home`**: testar scroll dentro da box, header deve permanecer visível.
4. **Click em data quando overdue**: cor coral do `.task-date.overdue` precisa ter contraste em dark mode.
5. **Badge crítico em dark mode**: `var(--imp-low)` pode ser pouco legível como cor de texto. Verificar contraste.

### Funcionalidades pedidas mas ainda não confirmadas / implementadas
- Nenhuma pendente do último ciclo. Aguardando feedback do usuário.

### Pergunta aberta do usuário (não-codificação)
- "Podemos integrar com Google Calendar?" — usuário pediu como curiosidade. Resposta a dar:
  - **Sim, viável**, mas exige Google Cloud project + OAuth2 + chave API (sem custo até quotas modestas)
  - 2 modos: **export one-way** (Fluxo → Google Calendar via API insert) ou **sync bidirecional** (mais complexo, requer webhook ou polling)
  - Sem backend, OAuth tem que ser via Google Identity Services no client (token de curta duração no localStorage)
  - Trade-off: introduz dependência externa, dados saem do device, exige configuração inicial do usuário
  - Sugestão: começar com export one-way (botão "Enviar pra Google Calendar" por tarefa)

### Melhorias técnicas sugeridas (não pedidas)
- **Long-press na tag** abre menu remover-da-tarefa vs edit (UX melhor que sempre abrir tag-edit global)
- **Subtarefas em rotinas**: schema atual não suporta. Avaliar se faz sentido.
- **Importação/exportação JSON**: backup local. ~30 linhas.
- **Sync entre dispositivos**: exigiria backend. Possível: GitHub Gist como storage gratuito (manual).
- **Reativar rotina pausada**: hoje precisa abrir o modal e mudar `active`. Botão direto na lista de rotinas inativas seria útil — mas não há lista de inativas hoje.

---

## Dúvidas em Aberto

Todas as 6 dúvidas anteriores foram respondidas. Ver Decisions Log § 2026-05 (continuação).

Espaço para novas dúvidas:
<!-- Adicionar aqui durante implementações -->

---

## Histórico de Branches

- `claude/task-manager-voice-input-eisIH` — v1, "Minhas Tarefas". Tema escuro/roxo. Schema v1. Mantida para histórico.
- `claude/fluxo-v2` — v2/v3 atual. Tema pastel, schema novo, calendário, tags, animações.

---

## Notas de Deploy

- Pages deve apontar pra `claude/fluxo-v2`.
- Após push de mudanças no SW: usuário precisa fechar o app no celular e reabrir (ou limpar cache do site) para o `fluxo-v3` cache entrar em vigor.
- localStorage do schema antigo (`minhas-tarefas/v1`) fica órfão mas inofensivo.

---

## Como retomar em nova sessão

1. Leia `CLAUDE_INSTRUCTIONS.md` (manual de conduta).
2. Leia esta seção e abra os arquivos listados em "Pendências Próximas" para contexto.
3. Carregue skill relevante de `.claude-ops/04_skills/` ANTES de codar (refactor / pwa_audit / feature_add).
4. Antes de codar, valide com o usuário pendências e dúvidas em aberto.
5. Se a sessão produzir mudanças, atualize este arquivo antes de resetar.

---

## Decisions Log (append-only)

Registre decisões técnicas e escolhas de produto que NÃO devem ser revisitadas sem motivo. Use formato `YYYY-MM-DD — decisão (razão)`.

### 2026-04
- Stack escolhida: HTML/CSS/JS puro, sem build, sem backend (simplicidade + custo zero)
- Storage local em `localStorage` chave única `fluxo/v2` (sync entre dispositivos NÃO é objetivo desta versão)
- Áudio sem API: parser pt-BR via regex/keywords, sem Claude API (usuário não quer pagar API)
- Notificações: per-task (X antes) + digests fixos 09h e 22h (decidido em sessão de planejamento)
- Granularidade de rotina: dia (sem horários intra-dia) — decisão explícita do usuário
- Rotinas: 1 ocorrência por vez no calendário; renovação manual após conclusão (suggested = done + interval)
- Importância: 4 níveis (baixa/média/alta/crítica). Pesos no calendário: 1 / 6 / 10 / 30
- Calendário: bola única por dia, tamanho/cor pelo score agregado (todas tarefas, incluindo rotinas baixas)

### 2026-05
- Tabs: Início (Lembrete + Pra hoje) / Pendentes / Calendário. Removidas: Concluídas como aba separada.
- Home: 2 boxes de altura fixa (~50% cada), header congelado, scroll interno
- Cards: 2 linhas máximo no corpo (título + tags). Crítica/data canto sup. dir.; freq/contador canto inf. dir.
- Borda colorida pela importância (não barra lateral)
- Modo escuro: automático via `prefers-color-scheme`. Sem toggle manual.
- Filtros em Pendentes: 3 dropdowns (Tipo, Importância, Categoria) + toggle concluídas. Removidos: busca por texto.
- Tags: 16 cores pastel, CRUD do usuário, default 6 tags pré-criadas
- Modal de tarefa não auto-foca título (não abre teclado virtual no celular)
- Ícone de frequência: ↻ pra repete, → pra única. Click mostra cadência via toast.
- Animação de conclusão: burst de 14 partículas + colapso do card (440ms total)
- Renovação de rotina: cancelar (X) restaura a tarefa; "não renovar" pausa (active:false)
- Estrutura `.claude-ops/04_skills/` adicionada para skills carregadas sob demanda (token saver)
- `CLAUDE_STATE.md` agora combina snapshot + decisions log (memória externa unificada)

### 2026-05 (continuação)
- Click em tag pill no card abre **seletor leve** de categorias (toggle on/off + criar nova tag inline com cor automática). NÃO abre tag-edit global. Decisão: separar "associar tags a tarefa" de "editar definição da tag" — fluxos distintos.
- "Não renovar" rotina = **exclusão definitiva** (com confirm). Conceito de rotina pausada (`active:false`) descartado: complexidade não justifica. Migração: load() filtra rotinas com `active:false` e remove campo dos demais.
- Botão `Não renovar` renomeado para `Excluir rotina` com estilo danger.
- Estrutura `.claude-ops/04_skills/` (refactor, pwa_audit, feature_add) para carregamento sob demanda.
- Decision Log e Erros Conhecidos movidos pra `CLAUDE_STATE.md` (single source of truth).
- "Sem notificações" (toggle por tarefa): silencia per-task **E** digests para essa task.
- Pra hoje = só `=== today`. Overdue não aparece na home (vai pra Pendentes).
- Texto "Urgente: X horas restantes" para deadline ≤48h no futuro. Overdue continua "vencida há".
- Tema: 3 estados (Auto/Claro/Escuro). Override via `:root[data-theme]`.

### Reservado pra próximas decisões
<!-- Adicionar entradas datadas aqui ao tomar decisões -->

---

## Erros já cometidos / armadilhas a evitar

- **Sticky header dentro de container errado**: `position: sticky` falha se o ancestral com `overflow: auto` não é o pai direto da hierarquia esperada. Sempre validar.
- **Modal `display: flex` + `[hidden]`**: o flex sobrescreve hidden. Adicionar `.modal[hidden] { display: none; }`.
- **`new Notification()` em Android Chrome**: lança exceção. Sempre via `serviceWorkerRegistration.showNotification()` em mobile.
- **Cache do SW não invalida**: bumpa o nome (`fluxo-v2` → `fluxo-v3`) ao mudar JS/CSS, senão usuários ficam presos na versão antiga.
- **Auto-focus em input dentro de modal**: dispara teclado virtual e cobre a tela. Evitar `.focus()` programático em mobile.
