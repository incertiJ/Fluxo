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
**Versão atual**: `5.00`

---

## Status Atual

### Implementado em v5.00 (branch claude/fix-mobile-cache-update-z3LsR)

**Navegação**
- Aba "Início" renomeada para "Tarefas" (`data-view="home"` mantido internamente)
- Aba "Calendário" removida
- Nova aba "Notas" (`data-view="notes"`)
- Ordem de abas: Tarefas / Compras / Notas
- `swipeTabs = ["home", "shopping", "notes"]`
- FAB oculto nas abas Compras e Notas

**Aba Tarefas — box filtros+calendário**
- Box sticky no topo com layout flex horizontal: filtros à esquerda, mini-calendário à direita
- Linha 1 de filtros: `[⇅ sort]` `[Pontual] [Rotina]` (chips inline de Frequência)
- Linha 2 de filtros: `[Categoria ▼]` `[Importância ▼]`
- Filtro "Prazo" removido definitivamente
- Sort toggle: `state.tasksSortBy = "importance" | "date"` — alterna com botão ⇅
- Mini-calendário: prev/next mês inline, semana começa domingo
- Click em dia com tarefas → `day-tasks-modal` centralizado
- Click em dia sem tarefas → highlight visual (`state.tasksCalDate`)

**Aba Tarefas — seções**
- Startup: só Lembrete expandido (`homeCollapsed: { reminder:false, ...: true }`)
- "Sem data" removida — itens sem data vão para "Mais tarde"
- "Mais tarde" ordena: com data primeiro (por data asc), sem data depois (por importância)
- `state.homeCollapsed` não persiste no localStorage (reseta a cada sessão)

**Badge de versão**
- Clique abre `changelog-modal` (não mais popover)
- Lista de novidades da versão atual com checkboxes (salvo em `fluxo/changelog-checks`)

**Aba Notas**
- Cadernos (`state.notes.notebooks[]`): `{ id, name, color, collapsed }`
- Páginas (`state.notes.pages[]`): `{ id, notebookId, name, content, updatedAt }`
- Cores: mesma paleta `TAG_COLORS` (16 pastéis)
- Cadernos colapsáveis, click no nome abre `notebook-modal`
- Click em página → `notes-page-modal` com editor + pré-visualização markdown
- Markdown: `**negrito**`, `*itálico*`, `# H1`, `## H2`, `### H3`, `- lista`
- Salvar/deletar página com persistência em `fluxo/v2`

**Compras**
- Click em qualquer parte do header da categoria expande/recolhe (já existia, confirmado)
- Long press em item (550ms) → row substitui para: `[color-dot][name-input][OK btn]`
- Click no color-dot → abre `cat-modal` para editar cor da categoria
- Itens coloridos com tint da categoria: `--cat-tint` a 7% de opacidade
- `--cat-tint` aplicado via `row.style.background`

**Gesto back (borda direita)**
- Swipe iniciando nos últimos 15% da largura → `closeLastModal()`
- Nenhum modal aberto → toast "Deseja sair do Fluxo?"
- Modal priority order: tag-edit → tags → modal → renew → quick-date → tag-select → cat → add-item → cat-picker → settings → notes-page → notebook → day-tasks → changelog

**Fog de swipe**
- `<div id="swipe-fog">` fixo, `pointer-events:none`, z-index:99
- `opacity = min(|dx|/150, 1) × 0.15`, gradiente para o lado de destino
- Cor: `var(--accent)`, sem fog se swipe da borda direita

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
