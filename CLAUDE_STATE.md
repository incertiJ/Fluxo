# CLAUDE_STATE.md

Memória de sessão. Atualize ao final de cada sessão antes de resetar o chat.

Combina dois papéis:
- **Snapshot vivo**: status atual, arquivos, pendências, dúvidas
- **Decisions Log** (append-only): histórico de decisões pra evitar revisitar

---

## Projeto
**Fluxo** — PWA estático (HTML/CSS/JS puro, sem build) de gestão de tarefas com tema pastel inspirado em rio. Roda local ou em GitHub Pages / Vercel. Storage em `localStorage`. Sem backend.

**Repo**: `incertij/test-claude`
**Branch de desenvolvimento**: `claude/fix-mobile-cache-update-z3LsR`
**Branch de deploy**: `claude/fluxo-v2`
**Deploy**: GitHub Pages apontando pra `claude/fluxo-v2`.
**Nomenclatura de branches**: `claude/fluxo-vX.X` (ex: `claude/fluxo-v5.01`)
**Versão atual**: `5.01`

---

## Status Atual

### Implementado em v5.01 (branch claude/fix-mobile-cache-update-z3LsR)

**Auth (login)**
- `fluxo/auth` → `{ pin: sha256hash, webAuthnCredId? }`
- Primeiro acesso → `renderPinSetup()` (digitação + confirmação)
- Acessos seguintes → `renderPinEntry()` + auto-trigger biometria se cadastrada
- WebAuthn: `navigator.credentials.create/get` com `authenticatorAttachment: "platform"`
- Alterar PIN: Configurações → "Alterar PIN" (exige PIN atual)
- Logo → settings (sem mudança no behavior do header)

**Aba Tarefas — box filtros+calendário**
- Box `filter-cal-box`: `background: --accent-3`, `border: --accent-2`
- Layout: filtros à esquerda (40%), mini-calendário à direita (flex:1 = 60%)
- Filtros: 3 dropdowns empilhados, largura 95% do container esquerdo
- Ordem dos dropdowns: Importância → Categoria → Frequência
- Sort removido; Frequência virou dropdown (Pontual/Rotina)
- Click fora de dropdown usa `capture:true` + `stopPropagation()` + `preventDefault()`
- Mini-calendário: sempre 35 células (5 linhas × 7)
- Dot colorido por score, sempre 75% do tamanho da célula (não variable)
- Número do dia acima do dot (flex-column)

**Aba Tarefas — seções**
- Startup: só Lembrete expandido
- Nova seção "Feitas": tarefas `oneoff` com `completed:true`, colapsada por default
- `state.homeCollapsed` inclui `done: true`

**Aba Notas**
- Cadernos: click no header expande/colapsa; long press (600ms) no header → `notebook-modal`
- Sem clique direto no nome para editar
- Editor: sem botão pré-visualização; sempre no modo edição
- Barra de ferramentas: `[T]` `[N]` `[I]` `[●Cor]` `[☰ Lista]`
- `applyMarkdownAction()`: insere markdown no cursor do textarea
- `applyColorAction()`: insere `<span style="color:#hex">texto</span>`
- Textarea com linhas de caderno via `repeating-linear-gradient`

**Compras**
- Header da categoria: click → expande/colapsa; long press (600ms) → `openCategoryModal`
- Nome do item: click → edição inline (substitui span por input; blur/Enter salva)
- Cor do texto do item = `cat.color` (não mais tint de background)
- Background dos itens = background padrão da box (sem `--cat-tint`)

**Subtarefas**
- Click no texto da subtarefa → inline edit (input substitui span; Enter/blur salva)

**Fog de swipe**
- `opacity = min(|dx|/120, 1) × 0.35`, transição `0.25s ease-out`

**Notificações — bugs corrigidos**
- `buildScheduledNotifications(lookbackMs)`: inclui notifs dos últimas X ms (default 0)
- `checkDueNotifications()`: usa `lookbackMs = 24h` — notifs perdidas são mostradas ao abrir
- `scheduleNotifications()`: usa `navigator.serviceWorker.ready` (mais robusto que `.controller`)
- `nextOccurrenceOfTime()`: se `addDays=0` e hora passou, avança para amanhã
- SW: persiste `scheduledItems` em Cache API `"fluxo-notif"` — sobrevive restart do SW

**v5.00** (mantido para referência):
- Aba "Tarefas" (renomeada de Início); sem aba Calendário
- Mini-calendário embutido nos filtros
- Aba Notas; Markdown básico
- Gesto back; Fog; Badge de versão/changelog

**Persistência**
- `save()`/`load()` incluem `state.notes`
- `fluxo/changelog-checks` separado (Set de `"VERSION:index"`)

**SW**: cache `fluxo-v7`

---

## Arquivos Modificados

| Arquivo | Mudança | Tamanho aprox. |
|---|---|---|
| `app.js` | Reescrita completa: notas, mini-cal, filtros v2, shopping lp, back gesture, fog, changelog | ~1400 linhas |
| `styles.css` | Adicionado: filter-cal-box, mini-cal, fog, notes, changelog, small-btn | ~1700 linhas |
| `index.html` | Tabs atualizadas, novos modais (notes-page, notebook, day-tasks, changelog), fog div | ~280 linhas |
| `sw.js` | Cache bumped: fluxo-v6 → fluxo-v7 | inalterado funcionalmente |
| `CLAUDE_INSTRUCTIONS.md` | Adicionada regra 14: workflow obrigatório de avaliar→perguntar→plano→aguardar ok |
| `CLAUDE_STATE.md` | Este arquivo |

---

## Pendências / Bugs a Verificar

| # | Item | Notas |
|---|---|---|
| 1 | Long press em desktop (mouse) | Long press usa touchstart/touchend — no desktop o usuário não consegue editar pelo long press. Pode precisar de fallback clique em desktop se necessário. |
| 2 | Fog: suavidade no iOS | `transition: opacity 0.05s` pode ser rápido demais. Validar no celular. |
| 3 | Mini-cal: overflow em tela muito pequena | Se tela < 300px, mini-cal (148px) pode comprimir filtros. Testar em 320px. |
| 4 | `renderMarkdown`: listas múltiplas separadas por texto | Regex de `<ul>` pode unir listas que não estão adjacentes. Validar. |
| 5 | `page-preview h1/h2/h3` herdam estilos do app | Verificar conflito com `.section h2` global. |
| 6 | Long press cancela se usuário mover o dedo (touchmove cancela) | Comportamento intencional. Validar se é aceitável. |

---

## Dúvidas em Aberto

Nenhuma — todas as perguntas de v5.00 foram respondidas antes do coding.

---

## Histórico de Branches

- `claude/task-manager-voice-input-eisIH` — v1, "Minhas Tarefas". Mantida para histórico.
- `claude/fluxo-v2` — v2/v3/v4. Branch de deploy.
- `claude/fix-mobile-cache-update-z3LsR` — v5.00. Branch atual.

---

## Notas de Deploy

- Pages deve apontar pra `claude/fluxo-v2`.
- Após push de mudanças no SW: usuário precisa fechar o app no celular e reabrir (ou limpar cache do site) para o `fluxo-v7` cache entrar em vigor.
- localStorage: `fluxo/v2` (dados), `fluxo/notified` (notificações), `fluxo/changelog-checks` (checkboxes de changelog).

---

## Como retomar em nova sessão

1. Leia `CLAUDE_INSTRUCTIONS.md` (manual de conduta) — incluindo regra 14 (workflow obrigatório).
2. Leia esta seção para contexto do estado atual.
3. Antes de codar: avaliar → perguntar → plano → aguardar ok (regra 14).
4. Se a sessão produzir mudanças, atualize este arquivo antes de resetar.

---

## Decisions Log (append-only)

### 2026-04
- Stack escolhida: HTML/CSS/JS puro, sem build, sem backend
- Storage local em `localStorage` chave única `fluxo/v2`
- Áudio sem API: parser pt-BR via regex/keywords
- Notificações: per-task (X antes) + digests fixos 09h e 22h
- Granularidade de rotina: dia (sem horários intra-dia)
- Rotinas: renovação manual após conclusão
- Importância: 4 níveis (baixa/média/alta/crítica). Pesos: 1/6/10/30

### 2026-05
- Tabs: Início / Pendentes / Calendário → v4.00: Início (6 seções) + Compras → v5.00: Tarefas + Compras + Notas
- Cards: 2 linhas máximo (título + tags). Crit/data canto sup dir; freq/contador canto inf dir.
- Borda colorida pela importância; background tint
- Modo escuro: automático via `prefers-color-scheme`. Manual via `data-theme`.
- Filtros: chips multi-select (Set). Vazio = sem filtro.
- Tags: 16 cores pastel, CRUD, default 6 tags
- Animação de conclusão: burst de 14 partículas + colapso (440ms)
- "Não renovar" rotina = exclusão definitiva
- `CLAUDE_STATE.md` como single source of truth

### 2026-05 (v5.00)
- Calendário: removido como aba. Mini-calendário embutido na aba Tarefas.
- Seção "Sem data": removida. Itens sem data aparecem em "Mais tarde" (no final da lista, após datas futuras).
- Filtros aba Tarefas: sem "Prazo". Layout: [⇅][Frequência chips] / [Categoria ▼][Importância ▼]
- "Tipo" renomeado para "Frequência" nos filtros (não no modal de tarefa)
- Sort: `state.tasksSortBy` = "importance"|"date", NÃO persiste no localStorage
- Mini-calendário: só prev/next inline (sem month-picker-modal)
- Notas: cadernos + páginas. Cor dos cadernos = mesma paleta TAG_COLORS.
- Markdown: implementação própria lightweight (sem biblioteca)
- Long press shopping: 550ms → row inline [color-dot][input][OK]. Color-dot = cor da categoria.
- Back gesture: borda direita (15% da largura) → fecha último modal. Sem modal = toast saída.
- Fog: overlay `#swipe-fog` com gradient na direção do swipe, opacidade 0-15%.
- Version badge: abre changelog-modal (não popover). Checkboxes salvos em `fluxo/changelog-checks`.
- Regra 14 em CLAUDE_INSTRUCTIONS.md: workflow obrigatório avaliar→perguntar→plano→ok para todos os inputs.

---

## Erros já cometidos / armadilhas a evitar

- **Sticky header dentro de container errado**: `position: sticky` falha se o ancestral com `overflow: auto` não é o pai direto.
- **Modal `display: flex` + `[hidden]`**: o flex sobrescreve hidden. Adicionar `.modal[hidden] { display: none; }`.
- **`new Notification()` em Android Chrome**: lança exceção. Sempre via SW em mobile.
- **Cache do SW não invalida**: bumpar o nome ao mudar JS/CSS.
- **Auto-focus em input dentro de modal**: dispara teclado virtual. Evitar `.focus()` programático.
- **Checkbox/radio global**: TODOS devem seguir estilo de `styles.css`. Nunca `accent-color` ou `appearance: auto`.
- **Ícones com fundo colorido**: proibido. Apenas contorno + fundo transparente.
- **Text inputs fora do padrão**: sempre `background: var(--surface-2)`, `border: 1px solid var(--border)`, `border-radius: 10px`.
- **Seções colapsáveis**: clique no `.section-hdr` inteiro, não só na seta. Seta é `pointer-events: none`.
- **Dropdowns sem fechamento externo**: sempre usar `setTimeout(10)` + `document.addEventListener("click", handler)` com `wrap.contains(e.target)`.
