# Skill: Feature Add

Carregue antes de adicionar nova funcionalidade ao Fluxo.

## Antes de codar — perguntas obrigatórias

### Schema
1. Precisa novo campo em `Task` ou `Tag`? Default value?
2. Migra dados antigos ou bumpa pra `fluxo/v3` (descartando)?
3. Afeta `nextDue` / `deadline` / `lastCompleted`?

### UI
4. Em qual aba aparece? (Início / Pendentes / Calendário)
5. Aparece no card ou só no modal de edição?
6. Mexe em layout de card (já está limitado a 2 linhas + cantos)?
7. Precisa de novo modal ou cabe em existente?

### Comportamento
8. Tem efeito em notificações (digest 9h/22h ou per-task)?
9. Persistência: localStorage ou efêmero (re-render)?
10. Edge cases: vazio, atrasado, sem data, completado, pausado?

### A11y / mobile
11. Tap target ≥44px?
12. Funciona em portrait E landscape?
13. Dark mode coberto?

## Checklist de implementação

### Estrutura de mudança típica
1. **Schema**: adicionar campo em `readForm`, default em `load`, migrar se preciso
2. **HTML**: adicionar input no modal de tarefa OU novo modal
3. **CSS**: respeitar tokens de `:root` (não hardcode hex). Cobrir dark mode.
4. **JS — render**: atualizar `renderTaskCard`, `renderHome`, `renderPending`, `renderCalendar` conforme afetado
5. **JS — comportamento**: handler do input, validações
6. **Notificações**: se afeta `dueMsFor` ou `buildScheduledNotifications`, ajustar
7. **SW cache bump**: incrementar `CACHE = "fluxo-vN"` em `sw.js` se mudou JS/CSS/HTML

### Testes
- `node --check app.js && node --check sw.js`
- Servir local + abrir no navegador
- Marcar visualmente: criar, editar, concluir, deletar
- Recarregar pra confirmar persistência

### Atualizar CLAUDE_STATE.md
Após feature pronta:
- Mover de "Pendências" pra "Status Atual"
- Adicionar entry em "Decisions Log" com data + decisão
- Listar arquivos modificados

## Padrões obrigatórios

### Cores
Usar variáveis CSS de `:root`. Para nova cor:
```css
:root { --new-token: #pastel; }
@media (prefers-color-scheme: dark) {
  :root { --new-token: #darker-version; }
}
```

### Pastel palette principal (light)
- Fundo: `--bg`, `--surface`, `--surface-2`, `--surface-3`
- Texto: `--text`, `--text-dim`, `--text-soft`
- Acentos: `--accent` (água), `--accent-2` (menta), `--accent-3` (sand)
- Importância: `--imp-low`, `--imp-mid`, `--imp-high`, `--imp-crit` (+ soft, tint, text)
- 16 cores de tag em `TAG_COLORS` (app.js)

### Layout do card de tarefa
**Não ultrapasse 2 linhas no corpo.** Slots disponíveis:
- Linha 1: título
- Linha 2: tags
- Canto sup. dir.: badge crítico + data
- Canto inf. dir.: ícone freq + contador

Para info adicional → expandir modal de edição, não o card.

### Acessibilidade
- `aria-label` em botões só com ícone
- Labels conectadas a inputs via `<label>` ou `for`
- Foco visível: outline 2px var(--accent)
