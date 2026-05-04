# Skill: PWA Audit

Carregue antes de validação no celular ou suspeita de bug mobile-only.

## Pré-requisitos do PWA (validar 1x)
- [ ] HTTPS ou localhost (Pages OK)
- [ ] `manifest.json` válido: name, start_url, display, icons, theme_color
- [ ] SW registrado e ativo: `navigator.serviceWorker.controller` existe após reload
- [ ] Ícone maskable (purpose:any maskable) — atualmente é SVG, OK pra Chrome
- [ ] `<meta viewport>` com `viewport-fit=cover` (já tem)
- [ ] `<meta theme-color>` (já tem)

## Auditoria de UI mobile

### Tap targets
Mínimo 44×44px (Apple) / 48×48dp (Android). Verificar:
- `.task-checkbox` (22px) — pequeno mas tem padding via card. Aceitável.
- `.tag-pill` — dentro do card. Pode ser apertado. Avaliar.
- `.icon-btn` (36px) — borderline. Aceitável em modais.
- `.cal-day` — aspect-ratio 1, funciona >40px.

### Safe areas
- Top: `env(safe-area-inset-top)` em `.app-header` ✓
- Bottom: `env(safe-area-inset-bottom)` em body + FAB ✓
- Notch / Dynamic Island: cobertos pelo top inset

### Sticky / overflow
**Pegadinha conhecida**: `position: sticky` só funciona se o ancestral com `overflow: auto/scroll` for o pai onde o sticky vive. Não funciona se o ancestral usa `overflow: hidden`.

Validar a cada nova section sticky.

### Animações
- iOS Safari: `position: fixed` em particles funciona. `transform` aceleradas via GPU OK.
- iOS <14: sem suporte a `aspect-ratio` (calendário quebraria). Mínimo iOS 14.6.
- `will-change` apenas onde necessário (`will-change: transform, opacity`) pra economia.

### Notificações
- Android Chrome: requer permissão. SW pode mostrar via `showNotification()`.
- iOS Safari 16.4+: requer instalação como PWA primeiro. Antes disso, `Notification.permission` é "denied".
- Web Speech API: indisponível em iOS. Botão de voz fica `disabled`.

## Bugs comuns mobile-only

| Sintoma | Causa típica |
|---|---|
| Header pula ao rolar | `position: sticky` com ancestral `overflow:hidden` |
| Modal corta no fundo | falta `padding-bottom: env(safe-area-inset-bottom)` |
| Teclado tampa input | falta `scrollIntoView` ao focar / viewport não-resizing |
| FAB clipa atrás de barra de URL | usar `dvh` em vez de `vh`, FAB com bottom inset |
| Touch lento (300ms delay) | falta `<meta viewport>` correto (já temos) |
| Click duplica em mobile | listener tanto em `touchstart` quanto `click` (não usamos) |

## Procedimento de teste no celular
1. Reabrir app pra invalidar cache do SW
2. Testar em portrait E landscape
3. Verificar dark mode (toggle no SO)
4. Criar tarefa, marcar feita, ver animação
5. Calendário: navegar mês, tap no nome, day-sheet
6. Pendentes: aplicar cada filtro, verificar lista
7. Áudio (Android only): gravar, ver parser
8. Notificações: criar pendente em 1 min, fechar app, esperar
