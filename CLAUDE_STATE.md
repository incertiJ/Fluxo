# CLAUDE_STATE.md

Memória de sessão. Atualize ao final de cada sessão antes de resetar o chat.

Combina dois papéis:
- **Snapshot vivo**: status atual, arquivos, pendências, dúvidas
- **Decisions Log** (append-only): histórico de decisões pra evitar revisitar

---

## Projeto

**Fluxo** — PWA estático (HTML/CSS/JS puro, sem build) de gestão pessoal: tarefas, compras, notas. Tema pastel "Calm / Natural / Orgânico". Storage em `localStorage`. Sem backend.

**Repo**: `incertij/test-claude`
**Branch de trabalho atual**: `claude/fix-mobile-cache-update-z3LsR`
**Branch de deploy**: `claude/fluxo-v2`
**Deploy**: GitHub Pages apontando pra `claude/fluxo-v2`.
**Versão atual**: `6.02`

> **REGRA DE VERSÃO**: TODA MODIFICAÇÃO NO CÓDIGO incrementa a versão. +0.01 para bugfix/ajuste (pode fazer sem perguntar). +1.00 (reset decimal) para nova funcionalidade ou refactor significativo — **sempre perguntar ao usuário antes de fazer bump +1.00**.

---

## Identidade Visual

- **Identidade**: Calm / Natural / Orgânico
- **Dark mode**: Mesma identidade, cores adaptadas (não inverte — usa `prefers-color-scheme` + override manual `data-theme`)

### Tokens CSS — Light mode
```
--bg: #f7f3ec          (areia quente)
--surface: #ffffff
--surface-2: #fbf6ec
--surface-3: #f0e9d9
--border: #e6dfd2
--border-strong: #d8cfbd
--text: #2d3a3a        (verde escuro)
--text-dim: #7a8585
--text-soft: #94a09f
--accent: #8ec9c1      (teal pastel)
--accent-2: #b3d9c9
--accent-3: #d4e7d8
```

### Tokens CSS — Dark mode
```
--bg: #1a2222
--surface: #232c2c
--surface-2: #2a3434
--surface-3: #344040
--border: #3a4848
--border-strong: #4a5858
--text: #e6ece9
--text-dim: #a4b0ae
--text-soft: #828d8b
--accent: #8ec9c1      (mesmo accent)
```

### Importância — tints (light)
```
low:  --imp-low-tint: #dde8f2  --imp-low: #8eb0cc
mid:  --imp-mid-tint: #ece6d2  --imp-mid: #b9a27e
high: --imp-high-tint: #f4e4cc --imp-high: #d0a070
crit: --imp-crit-tint: #f2dada --imp-crit: #c87878
```

### TAG_COLORS (16 cores, índices 0–15)
Índices usados como cores de cadernos e notas editor:
- 2 → `#b8d9c4` (verde menta)
- 6 → `#f0c8a0` (laranja pêssego)
- 11 → `#a8c8e0` (azul bebê)
- 9 → `#c8b0d8` (lilás)

### EDITOR_COLORS (notas)
```js
[
  { hex: "default", label: "Padrão" },
  { hex: "#b8d9c4", label: "Verde menta" },
  { hex: "#f0c8a0", label: "Laranja pêssego" },
  { hex: "#a8c8e0", label: "Azul bebê" },
  { hex: "#c8b0d8", label: "Lilás" },
]
```

---

## Padrões de Componente

### Checkboxes / Radios
TODOS os `<input type="checkbox">` e `<input type="radio">` seguem estilo global em `styles.css`. Nunca `accent-color`, nunca `appearance: auto`, nunca override por componente.

### Ícones de ação
Apenas contorno (`border: 1.5px solid var(--border-strong)`), fundo transparente. Nunca background colorido. Exemplos: `.mic-inline`, `.shopping-cat-edit`.

### Text inputs
Sempre: `background: var(--surface-2)`, `border: 1px solid var(--border)`, `color: var(--text)`, `border-radius: 10px`, `padding: 10px 12px`, `font-size: 1rem`. Wrappear em `.field`.

### Seções colapsáveis
Clique registrado no `.section-hdr` inteiro. Seta = `<span pointer-events: none>`. Estado em `state.homeCollapsed[key]`.

### Dropdowns flutuantes
Sempre fechar ao clicar fora: `setTimeout(10)` + `document.addEventListener("click", handler)` que verifica `wrap.contains(e.target)`.

### Notificações
SEMPRE via Service Worker (`navigator.serviceWorker.ready.then(reg => reg.showNotification(...))`). NUNCA `new Notification()` — lança exceção no Android Chrome.

### FAB (Floating Action Button)
`position: fixed; bottom: 24px; right: 18px`. Contexto-aware por aba. Notes page = "Salvar".

---

## Arquitetura

| Arquivo | Propósito |
|---|---|
| `app.js` | Toda a lógica da aplicação (~2500 linhas) |
| `styles.css` | Estilos globais + componentes (~2000 linhas) |
| `index.html` | Estrutura HTML (~430 linhas) |
| `sw.js` | Service Worker: cache + notificações agendadas |
| `manifest.json` | PWA manifest |
| `icon.svg` | Ícone do app |

### Storage
- `fluxo/v2` — dados do app (tasks, shopping, notes, settings)
- `fluxo/notified` — Set de IDs de notificações já exibidas
- `fluxo/changelog-checks` — checkboxes do changelog
- `fluxo/auth` — `{ pin: sha256hash, webAuthnCredId? }`
- `fluxo-v11` — cache do SW (assets estáticos)
- `fluxo-notif` — cache do SW (scheduled-items, persiste entre restarts)

---

## Status Atual — v6.01

### Aba Tarefas
- Calendário mini: 35 células (5×7), dots coloridos por importância, swipe horizontal muda mês
- Dia de hoje: pré-selecionado ao abrir; clique em dia sem tarefas só seleciona (sem modal)
- Clique em dia COM tarefas: abre popup de tarefas do dia
- Seção "Feitas": tarefas `oneoff` completas, com botão ✕ para remoção permanente
- Ícone de pontual: `𝟏` (U+1D7CF — Mathematical Bold Digit One)
- Campo "Descrição" → "Observações (opcional)"
- Importância: tints levemente escurecidos em relação a v5

### Aba Compras
- FAB `+` abre modal "Adicionar novo item"
- Header da categoria: click = expande/colapsa; long press = edição
- Nome do item: click = edição inline

### Aba Notas
- Cadernos com cor; long press = editar; páginas com cor do caderno no nome
- Editor WYSIWYG (contenteditable + execCommand): negrito, itálico, título (h1), lista, cor
- Toolbar: `[T serif]` `[N bold]` `[I skewed]` `[● Cor]` `[☰ Lista]`
- Paleta de cores: 4 cores de TAG_COLORS + padrão (removeFormat)
- Linhas de caderno: `line-height: 2em`, texto acima da linha, `padding-top: 14px`
- Contagem de linhas não-vazias exibida no card da página (ex: "12 mai · 4 linhas")
- Botão Salvar FAB: fixo bottom-right, oculto quando teclado está aberto (via `visualViewport`)

### Navegação
- Swipe lateral: troca abas (Tarefas ↔ Compras ↔ Notas)
- Gesto back (Android): fecha modal aberto, ou pergunta saída via `popstate`
- Sem edge-swipe toast legado

### Auth
- PIN 4 dígitos (SHA-256) + biometria opcional (WebAuthn platform)

### Notificações
- Agendamento via SW (`schedule` message + `rescheduleAll`)
- SW v11: cache `fluxo-v11`, mostra imediatamente notificações já vencidas ao receber schedule

---

## Pendências / Bugs a Verificar

| # | Item |
|---|---|
| 1 | Notificações no horário: validar recebimento após bump do SW para v11 |
| 2 | `visualViewport` no iOS: comportamento pode diferir (teclado não reduz viewport no iOS). Validar save FAB |
| 3 | `page-textarea` contenteditable: `innerText` em algumas engines pode diferir de `textContent` para contagem de linhas |
| 4 | Tints escurecidos: validar em dark mode — os novos valores do dark mode foram mantidos do original |

---

## Histórico de Branches

- `claude/task-manager-voice-input-eisIH` — v1, "Minhas Tarefas"
- `claude/fluxo-v2` — v2/v3/v4 — branch de deploy (GitHub Pages)
- `claude/fix-mobile-cache-update-z3LsR` — v5.00–v6.01 — branch de desenvolvimento atual

---

## Como retomar em nova sessão

1. Leia `CLAUDE_INSTRUCTIONS.md` — todas as 15 regras.
2. Leia este arquivo inteiro.
3. Toda modificação de código = versão incrementa (regra 9). +1.00 → pedir confirmação.
4. Em **toda mensagem**: fazer ≥5 perguntas antes de codar (regra 15).
5. Após respostas: propor plano → aguardar "ok prossiga" → codar (regra 14).
6. Atualize este arquivo antes de fechar a sessão.

---

## Decisions Log (append-only)

### 2026-04
- Stack: HTML/CSS/JS puro, sem build, sem backend
- Storage: `localStorage`, chave `fluxo/v2`
- Áudio: parser pt-BR via regex/keywords
- Notificações: por tarefa + digests 09h/22h
- Rotinas: renovação manual após conclusão
- Importância: 4 níveis (baixa/média/alta/crítica)

### 2026-05 (v4–v5)
- Calendário removido como aba; mini-cal embutido na aba Tarefas
- Seção "Sem data" removida → itens sem data aparecem em "Mais tarde"
- Filtros: Importância / Categoria / Frequência (dropdowns)
- Notas: cadernos + páginas; cor via TAG_COLORS; markdown próprio
- Back gesture: `popstate` handler (não mais edge-swipe)
- Regra 14 adicionada a CLAUDE_INSTRUCTIONS.md

### 2026-05 (v6)
- Editor de notas migrado para WYSIWYG (contenteditable + execCommand)
- Identidade visual confirmada: Calm / Natural / Orgânico
- Dark mode: mesma identidade, cores adaptadas
- Ícone pontual: 𝟏 (U+1D7CF)
- Botão título: T serifado (Georgia bold)
- Botão itálico: I inclinado 15° (skewX)
- Cores editor: 4 de TAG_COLORS (índices 2/6/11/9) + padrão
- Tints de importância: levemente escurecidos (v6.01)
- Calendar day cells: aspect-ratio 1 (quadrado, ~metade da altura anterior)
- Notes save FAB: visualViewport para detectar teclado mobile
- SW cache: fluxo-v11 (bump forçado por mudanças CSS + immediate notifs)

---

## Erros já cometidos / armadilhas a evitar

- **`display: flex` + `[hidden]`**: flex sobrescreve hidden. Usar `style.display` diretamente, não `element.hidden`.
- **`new Notification()` no Android Chrome**: lança exceção. Sempre via SW.
- **Cache SW não invalida**: sempre bumpar o nome do cache ao mudar JS/CSS.
- **Curly quotes em strings JS**: sed/substituição pode introduzir `"` e `"` que quebram strings. Revisar após substituições em massa.
- **Auto-focus em input dentro de modal**: dispara teclado virtual indesejado. Evitar.
- **Checkbox/radio**: nunca `accent-color`, nunca override por componente.
- **Ícones**: nunca background colorido. Só contorno.
- **Inputs fora do `.field`**: não herdam estilos globais automaticamente.
- **Seções colapsáveis**: clique no `.section-hdr` inteiro, seta é passiva.
- **Dropdowns sem fechamento externo**: `setTimeout(10)` + click listener com `contains()`.
