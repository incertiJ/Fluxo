# CLAUDE_STATE.md

Memória de sessão. Atualize ao final de cada sessão antes de resetar o chat.

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

### Bugs prováveis a verificar no celular
1. **Animação burst em iOS Safari**: `prefers-color-scheme` e `position: fixed` em particles podem ter quirks. Validar.
2. **Modal aninhado**: ao clicar tag dentro do `tags-modal` (gerenciar) → abre `tag-edit-modal` por cima. z-index OK? Validar.
3. **Sticky header em `.section--home`**: testar scroll dentro da box, header deve permanecer visível.
4. **Click em data quando overdue**: cor coral do `.task-date.overdue` precisa ter contraste em dark mode.
5. **Badge crítico em dark mode**: `var(--imp-low)` pode ser pouco legível como cor de texto. Verificar contraste.

### Funcionalidades pedidas mas ainda não confirmadas / implementadas
- Nenhuma pendente do último ciclo. Aguardando feedback do usuário.

### Melhorias técnicas sugeridas (não pedidas)
- **Long-press na tag** abre menu remover-da-tarefa vs edit (UX melhor que sempre abrir tag-edit global)
- **Subtarefas em rotinas**: schema atual não suporta. Avaliar se faz sentido.
- **Importação/exportação JSON**: backup local. ~30 linhas.
- **Sync entre dispositivos**: exigiria backend. Possível: GitHub Gist como storage gratuito (manual).
- **Reativar rotina pausada**: hoje precisa abrir o modal e mudar `active`. Botão direto na lista de rotinas inativas seria útil — mas não há lista de inativas hoje.

---

## Dúvidas em Aberto

1. **Click em tag dentro do card**: hoje abre tag-edit (edita/apaga sistema-wide). Usuário disse "mudar ela ou apagar" — ambíguo se queria editar a tag global ou só remover da tarefa. Confirmar.
2. **Click em data de rotina**: hoje força ter data (mostra toast "Rotina não pode ficar sem data"). Está OK?
3. **Rotinas pausadas (`active: false`)**: como o usuário reativa? Hoje só editando manualmente. Faltou UX clara.
4. **Visualização de concluídas**: hoje só via toggle em Pendentes. Sumir do calendário e da home — confirmado. Sumir totalmente sem toggle?
5. **Comportamento "tarefas alta/crítica sempre na home"**: implementado para pontuais. Para rotinas, usuário disse "apenas as repetidas que devem ser feitas hoje". Significa que rotinas crítica NÃO aparecem na home se nextDue for distante? Atual implementação: sim, não aparecem. Confirmar.
6. **Notificações com unidades grandes (meses/anos)**: usamos aproximação de 30/365 dias. Para precisão real, precisaria calcular relativo ao deadline (pega nextDue, subtrai N meses no calendário). Importa?

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
3. Antes de codar, valide com o usuário pendências e dúvidas em aberto.
4. Se a sessão produzir mudanças, atualize este arquivo antes de resetar.
