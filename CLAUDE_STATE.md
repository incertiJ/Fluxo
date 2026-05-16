# CLAUDE_STATE.md

Memória de sessão. Atualize ao final de cada sessão antes de resetar o chat.

> **TOKEN MINIMIZATION** — Respostas sempre mínimas. Minimizar consumo de tokens em toda interação. Sem repetição, sem sumários desnecessários. Uma frase onde cabe uma frase.

---

## Projeto

**Fluxo** — PWA estático (HTML/CSS/JS puro, sem build) de gestão pessoal: tarefas, compras, notas. Tema pastel "Calm / Natural / Orgânico". Storage em `localStorage`. Sem backend.

**Repo**: `incertij/fluxo`
**Branch de trabalho**: `claude/fix-bugs-add-features-QQVWY` ← NUNCA mudar sem permissão
**Branch de deploy**: `claude/fluxo-v2`
**Deploy**: GitHub Pages apontando pra `claude/fluxo-v2`
**Versão atual**: `7.8`
**SW cache**: `fluxo-v24`

> **REGRA DE VERSÃO**: TODA modificação no código incrementa a versão. +0.01 bugfix, +0.1 feature, +1.0 estrutural (confirmar antes).

> **REGRA DE CHANGELOG**: Toda versão tem entrada em `CHANGELOG` no `app.js`. Usuário acessa pelo badge de versão.

---

## Identidade Visual

- **Identidade**: Calm / Natural / Orgânico
- **Dark mode**: `prefers-color-scheme` + override manual `data-theme`

### Tokens CSS — Light
```
--bg: #f7f3ec          --surface: #ffffff       --surface-2: #fbf6ec
--surface-3: #f0e9d9   --border: #e6dfd2         --border-strong: #d8cfbd
--text: #2d3a3a        --text-dim: #7a8585       --text-soft: #94a09f
--accent: #8ec9c1      --accent-2: #b3d9c9       --accent-3: #d4e7d8
```

### Tokens CSS — Dark
```
--bg: #1a2222    --surface: #232c2c    --surface-2: #2a3434
--surface-3: #344040    --border: #3a4848    --border-strong: #4a5858
--text: #e6ece9    --text-dim: #a4b0ae    --accent: #8ec9c1
```

### Importância — badges de compras
```
luxo:        tint #dde8f2 / text #4a6a9a  (azul)
conforto:    tint #d4eed8 / text #3a7850  (verde)
necessidade: tint #f4e4cc / text #a07030  (laranja)
urgente:     tint #f2dada / text #a04040  (vermelho)
```

### TAG_COLORS (16, lightest→darkest)
```
#f4f0e8 · #f0d898 · #c8a040★ · #d4e890 · #68b888★ · #90dcd4
#6a9ec8★ · #c0a8e8 · #f4a8b8 · #d47878★ · #b89870 · #70a870
#5878a8 · #906888 · #504840 · #282828
```
★ = âncoras do EDITOR_COLORS

### EDITOR_COLORS (notas)
```js
[{hex:"default"},{hex:"#d47878"},{hex:"#6a9ec8"},{hex:"#68b888"},{hex:"#c8a040"}]
```

---

## Arquitetura

| Arquivo | Linhas aprox. | Propósito |
|---|---|---|
| `app.js` | ~3400 | Toda lógica do app |
| `styles.css` | ~2200 | Estilos globais + componentes |
| `index.html` | ~430 | Estrutura HTML |
| `sw.js` | ~120 | Service Worker: cache + notificações |
| `manifest.json` | — | PWA manifest |
| `icon.svg` | — | Ícone (ondas, gradiente pastel) |

### Storage keys
```
fluxo/v2          — dados do app (tasks, shopping, notes, settings)
fluxo/notified    — Set de IDs de notificações já exibidas
fluxo/changelog-checks — checkboxes do changelog
fluxo/auth        — { pin: sha256hash, webAuthnCredId? }
fluxo/icon-png    — PNG 192×192 para notificações (gerado em initApp)
fluxo/badge-png-v3 — PNG 96×96 monochrome badge (ondas brancas sem fundo)
fluxo-v24         — cache SW (assets estáticos)
fluxo-notif       — cache SW (scheduled-items persistidos)
```

### state (objeto global)
```js
{
  tasks, tags, shopping: { categories: [{id, name, color, collapsed, items:[]}] },
  notes: { notebooks: [{id, name, color, collapsed, pages:[]}] },
  notifSchedule, appTheme, userName,
  homeCollapsed: { calendar, overdue, reminder, today, week, later, done },
  view: "home"|"shopping"|"notes"
}
```

---

## Navegação (Back gesture — Android)

**Invariante**: `popstate` sempre faz `history.pushState` ao final (exceto `_exitPending`).

```
popstate dispara
  ├─ _exitPending? → limpa flag, retorna (sem pushState) → próximo back fecha PWA
  ├─ _dialogShowing? → fecha diálogo, _dialogShowing=false → pushState
  ├─ closeLastModal() retornou true? → pushState
  ├─ collapseLowestExpandedContainer() retornou true? → pushState
  └─ else → showExitConfirmDialog() → pushState
```

**Containers colapsáveis** (`collapseLowestExpandedContainer`):
- Usa `querySelectorAll('[data-section][data-expanded="1"]')` (seções home)
- Usa `querySelectorAll('[data-cat-id][data-expanded="1"]')` (headers de categoria shopping)
- Usa `querySelectorAll('[data-nb-id][data-expanded="1"]')` (headers de caderno)
- Ordena por `getBoundingClientRect().bottom` desc → colapsa o mais baixo
- Atributo `data-expanded="1"/"0"` setado em: `buildCalendarSection`, `makeHomeSection`, categoria header, notebook header

---

## Features por aba

### Tarefas (home)
- Seções: Lembretes, Atrasadas, Hoje, Próxima semana, Mais tarde, Feitas
- Mini-calendário: 35 células, dots por score de importância, swipe muda mês
- Filtros: Importância / Categoria / Frequência (dropdowns)
- Importância: 4 níveis (baixa/média/alta/crítica)
- Tipos: Pontual (oneoff) / Rotina (routine)

### Compras (shopping)
- Categorias colapsáveis; long press = editar
- Itens com badge de importância: luxo/conforto/necessidade/urgente
- Swipe-to-delete em itens
- Enter no campo de adicionar item = confirma (via `<form>` submit)

### Notas (notes)
- Cadernos + páginas; cor por caderno
- Editor WYSIWYG (contenteditable + execCommand)
- Toolbar: `[T serif]` `[N bold]` `[I]` `[● Cor]` `[☰ Lista]`
- colorDot rastreia cor do cursor via `selectionchange`
- Fundo opaco ao abrir página (evita ver a aba de notas atrás)

### Notificações
- Agendadas via SW (schedule message + rescheduleAll)
- Ícone: PNG 192×192 gerado por Canvas a partir do icon.svg
- Badge: PNG 96×96 ondas brancas sobre fundo transparente (monochrome)
- Gerado em `initApp` via Canvas + SVG inline (sem `<rect>` de fundo)

### Auth
- PIN 4 dígitos (SHA-256) + biometria opcional (WebAuthn platform)

---

## Padrões de Componente

| Componente | Regra |
|---|---|
| Checkbox/Radio | Estilo global em styles.css. Nunca `accent-color`, nunca override por componente |
| Ícones de ação | Só contorno (`border: 1.5px solid var(--border-strong)`), fundo transparente |
| Text inputs | `background: var(--surface-2)`, `border: 1px solid var(--border)`, `border-radius: 10px`, `padding: 10px 12px`, wrappear em `.field` |
| Seções colapsáveis | Clique no `.section-hdr` inteiro. Seta = `<span pointer-events:none>`. Estado em `state.homeCollapsed[key]` |
| Dropdowns | Fechar ao clicar fora: `setTimeout(10)` + click listener com `wrap.contains(e.target)` |
| Notificações | Sempre via SW (`reg.showNotification`). Nunca `new Notification()` |
| FAB | `position: fixed; bottom: 24px; right: 18px`. Contexto-aware por aba |

---

## Pendências / Bugs conhecidos

| # | Item |
|---|---|
| 1 | Notificações com app fechada: limitação de plataforma (Doze mode). Sem server push = sem garantia |
| 2 | `visualViewport` no iOS: teclado não reduz viewport → save FAB pode não ocultar |
| 3 | Badge na barra de status: alguns launchers ignoram o campo `badge` |

---

## Decisões Log (append-only)

- Stack: HTML/CSS/JS puro, sem build, sem backend
- Storage: `localStorage`, chave `fluxo/v2`
- Notificações: SW-only (nunca `new Notification()`)
- Back gesture: `popstate` handler (invariante: sempre pushState, exceto _exitPending)
- data-expanded: atributo nos containers para collapseLowestExpandedContainer (v7.2+)
- Badge monocromático: SVG inline com só as ondas (sem `<rect>` de fundo) → PNG via Canvas
- Shopping Enter: `<form>` + submit event (cross-platform, não pula para próximo campo)
- homeCollapsed: persistido em localStorage (save/load)
- Changelog: modal fullscreen (como notas-page-modal)
- Versão: APP_VERSION em app.js + badge header + CHANGELOG object

---

## Erros já cometidos / armadilhas

- `display: flex` + `[hidden]`: flex sobrescreve hidden. Usar `style.display` diretamente.
- `new Notification()` no Android Chrome: lança exceção. Sempre via SW.
- Cache SW não invalida: sempre bumpar `CACHE` em sw.js ao mudar JS/CSS.
- Badge com `<rect>` de fundo: source-atop sobre rect = quadrado preto. Usar só paths.
- `data-cat-id` duplicado: header E add-row tinham o mesmo atributo → `querySelector` pegava errado. Fix: só header tem `data-expanded`.
- Back gesture sem invariante: history se esgota → dialog some após cancelar. Fix: sempre pushState no popstate.

---

## Como retomar em nova sessão

1. Leia `CLAUDE_INSTRUCTIONS.md` (todas as regras — especialmente 15 e 16).
2. Leia este arquivo inteiro.
3. Toda modificação = versão incrementa (regra 9).
4. Em toda mensagem: ≥5 perguntas antes de codar (regra 15).
5. Respostas sempre mínimas — minimizar tokens (regra 16).
6. Branch FIXA: `claude/fix-bugs-add-features-QQVWY`. Nunca mudar.
