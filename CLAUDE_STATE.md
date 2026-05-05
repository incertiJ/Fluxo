# CLAUDE_STATE.md

Memória de sessão. Atualize ao final de cada sessão antes de resetar o chat.

---

## Projeto
**Fluxo** — PWA estático (HTML/CSS/JS puro, sem build) de gestão de tarefas com tema pastel inspirado em rio. Roda local ou em GitHub Pages / Vercel. Storage em `localStorage`. Sem backend.

**Repo**: `incertij/test-claude`
**Branch ativa**: `claude/resume-project-changes-HZS4t`
**Cache SW**: `fluxo-v7`
**Deploy**: GitHub Pages (apontar para branch ativa acima).

---

## Status Atual

### Implementado e estável

**Identidade**
- Logo SVG rio, título "Fluxo" com gradiente pastel via `background-clip: text`
- Tema Auto/Claro/Escuro: click no logo abre picker, persiste em `fluxo/theme`, override via `:root[data-theme]`

**4 abas**: Início · Pendentes · Calendário · Compras

**Início**
- Seção "Lembrete": pontuais importantes/próximas, urgentes (≤2 dias) no topo acima de críticas
- Seção "Pra hoje": rotinas vencidas/hoje + pontuais com deadline hoje, ordem desc importância
- Cada seção: `flex: 1 1 0; min-height: 0`, header sticky, scroll interno

**Pendentes**
- Filtros com labels visíveis: Tipo / Importância / Categoria (3 `<select>` em `.filter-group`)
- Chip "Concluídas" (toggle chip-style)
- Grupos: Atrasadas / Hoje / Próximos 7 dias / Depois / Sem data / Concluídas

**Calendário**
- Bola por dia com score ponderado (baixa=1, média=6, alta=10, crítica=30)
- Tap no nome do mês → `month-picker-modal` (ano ‹ › + grid 3×4)
- Tap em dia → `day-sheet` com lista de tarefas

**Compras** *(nova, sessão atual)*
- Itens com nome + categoria opcional
- Categorias de compras independentes das tags de tarefas (default: Mercado, Roupas, Acessórios, Tech)
- Filtro por categoria (chips), gerenciar categorias via modal ⚙
- Itens concluídos em seção separada com "Limpar concluídos"
- Dados em `fluxo/v2` → `shopItems[]` + `shopCats[]`

**Cards de tarefa**
- Borda colorida por importância, background tint suave
- Canto sup. dir.: badge importância + data (`15 jan` / `em 3d` ou `⚑ Xh` se urgente)
- Canto inf. dir.: ícone freq (↻ rotina · pennant SVG pontual) + contador `done/total`
- Animação conclusão: burst 14 partículas + `taskCollapse 0.7s`

**Formulário de tarefa**
- Radio buttons (Pontual/Frequentes): chip-style pastel, sem visual nativo do browser
- Checkbox "Sem notificações": aparência customizada (accent pastel, sem azul do browser)
- Mic 🎤 inline no input de título (absolute right, sem `voice-row` separada)
- Toggle "Sem notificações" por tarefa: silencia per-task E digests

**Notificações**
- Per-task: X horas/dias/semanas/meses/anos antes
- Digests: 09h (hoje) e 22h (amanhã)
- Tarefas com `silentNotifications: true` são excluídas de ambos

**Schema `fluxo/v2`**
```
{
  tasks: [{ id, title, description, type, importance, tags[], notifications[],
            silentNotifications, completed, completedAt, createdAt,
            // oneoff: deadline, subtasks[]
            // routine: nextDue, intervalAmount, intervalUnit, lastCompleted, completionCount }],
  tags:  [{ id, name, color }],
  shopItems: [{ id, name, catId, done, createdAt }],
  shopCats:  [{ id, name }]
}
```

### Estado do objeto `state`
```js
tasks, tags, shopItems, shopCats, shopFilter,
view, editingId, draftSubtasks, draftNotifications, draftTagIds,
filters: { type, imp, tagId, showDone },
calMonth, monthPickerYear,
pendingRenew, pendingRenewIds (Set),
editingTagId, editingTagDraft, editingDateTaskId, editingTagsTaskId,
recognition, installPrompt
```

---

## Arquivos e tamanhos aproximados

| Arquivo | Linhas aprox. |
|---|---|
| `app.js` | ~1650 |
| `styles.css` | ~1150 |
| `index.html` | ~320 |
| `sw.js` | ~73 |

---

## Pendências

### Bugs a verificar no celular
1. Animação burst em iOS Safari: `position: fixed` em partículas pode ter quirks
2. Modal aninhado: tag-select dentro de tags-modal — z-index OK?
3. Sticky header em `.section--home`: validar scroll interno
4. Contraste `.task-date.overdue` em dark mode
5. Badge crítico em dark mode: `var(--imp-low)` como cor de texto — verificar

### Melhorias sugeridas (não pedidas)
- Importação/exportação JSON (backup local, ~30 linhas)
- Sync entre dispositivos via GitHub Gist como storage (sem backend)
- Subtarefas em rotinas (schema atual não suporta)

---

## Como retomar em nova sessão

1. Leia `CLAUDE_INSTRUCTIONS.md`
2. Leia este arquivo
3. Pergunte ao usuário o que quer fazer antes de codar

---

## Decisions Log (append-only)

### 2026-04
- Stack: HTML/CSS/JS puro, sem build, sem backend
- Storage: `localStorage` chave `fluxo/v2`
- Áudio: parser pt-BR via regex, sem API externa
- Notificações: per-task + digests 09h/22h
- Rotinas: granularidade dia, 1 ocorrência por vez, renovação manual
- Importância: 4 níveis. Pesos calendário: 1/6/10/30
- Calendário: bola única por dia, score agregado

### 2026-05
- Tabs: Início / Pendentes / Calendário (Concluídas removida como aba)
- Home: 2 boxes `flex: 1 1 0`, header sticky, scroll interno
- Cards: estilo Planner, borda colorida, 2 linhas máx
- Modo escuro: automático `prefers-color-scheme` + override manual via `[data-theme]`
- Filtros Pendentes: 3 dropdowns + chip concluídas (busca por texto removida)
- Tags: 16 cores pastel, CRUD, default 6 tags
- Modal não auto-foca título (evita teclado virtual mobile)
- Ícone freq: ↻ rotina · pennant SVG pontual (triangular, stroke only)
- Animação conclusão: burst + colapso 0.7s
- Renovação rotina: cancelar restaura; "Excluir rotina" = exclusão definitiva
- "Sem notificações" silencia per-task E digests
- "Pra hoje": só `=== today`, sem overdue
- Urgente ≤2 dias: `⚑ Xh restantes`, sobe acima de críticas no Lembrete
- Tema: Auto/Claro/Escuro via `document.documentElement.dataset.theme`
- Radio buttons: chip-style pastel (input nativo oculto)
- Aba Compras: categorias próprias, independentes das tags de tarefas

---

## Armadilhas a evitar

- `position: sticky` falha se ancestral com `overflow: auto` não é o pai correto
- `display: flex` sobrescreve `[hidden]` → sempre `.modal[hidden] { display: none; }`
- `new Notification()` lança exceção no Android Chrome → usar `swRegistration.showNotification()`
- Auto-focus em input dentro de modal → abre teclado virtual no mobile
- Bump o `CACHE` do SW a cada mudança em JS/CSS, senão usuários ficam na versão antiga
