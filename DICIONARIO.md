# Dicionário do Projeto Fluxo

> Termos, conceitos e definições usados no desenvolvimento do app. Atualizar sempre que um novo termo surgir.

---

## O App

**Fluxo** — App de organização pessoal offline-first para tarefas, compras e notas. Roda como PWA (Progressive Web App) no navegador.

---

## Tipos de Tarefa

**Pontual** (`oneoff`) — Evento ou tarefa que acontece uma única vez. Tem uma data limite opcional (deadline). Pode ser marcada como concluída e é movida para a seção "Feitas". Equivale a: evento, compromisso único, to-do com prazo.

**Rotina** (`routine`) — Hábito ou compromisso recorrente. Repete em uma frequência definida. Não é marcada como "concluída" permanentemente — ao completar, o usuário define a próxima data (renovação). Equivale a: hábito, compromisso fixo.

---

## Atributos de Tarefa

**Importância** — Nível de prioridade de uma tarefa. 4 níveis:
- **Baixa** (valor 1, peso 1)
- **Média** (valor 2, peso 6)
- **Alta** (valor 3, peso 10)
- **Crítica** (valor 4, peso 30)

**Frequência** — Define com que regularidade uma tarefa do tipo Rotina se repete. Opções: dia(s), semana(s), mês(es), ano(s). O usuário define o intervalo e a unidade (ex: "a cada 2 semanas").

**Tag** (também chamada de **Categoria** no contexto de tarefas) — Rótulo colorido atribuído a uma tarefa para indicar seu contexto ou área de vida. Exemplos: Saúde, Finanças, Burocracia, Limpeza, Viagem, Compras. Cada tarefa pode ter múltiplas tags.

**Subtarefa** — Item dentro de uma tarefa do tipo Pontual que pode ser verificado individualmente. Permite quebrar uma tarefa grande em passos menores.

**Deadline** — Data de vencimento de uma tarefa Pontual. Quando a data passa sem conclusão, a tarefa aparece na seção "Atrasadas".

**Notificação** — Alerta configurado pelo usuário para ser enviado X tempo antes do deadline. Ex: "3 dias antes", "1 semana antes". Implementado via Service Worker.

---

## Score / Pontuação

**Score** — Valor calculado por dia no mini-calendário. É a soma do peso de importância de todas as tarefas agendadas naquele dia:
- Baixa contribui 1
- Média contribui 6
- Alta contribui 10
- Crítica contribui 30

O score determina a cor do dot (bolinha) no calendário:
- Score ≤ 3: azul claro
- Score ≤ 9: bege/amarelo
- Score ≤ 25: laranja
- Score ≤ 50: salmão
- Score > 50: vermelho

---

## Seções da Aba Tarefas

**Lembrete** — Tarefas importantes (Alta ou Crítica) sem data ou com data futura. Sempre visível no topo.

**Atrasadas** — Tarefas com deadline antes de hoje (vencidas).

**Para hoje** — Tarefas com deadline ou próxima ocorrência igual à data de hoje.

**Próxima semana** — Tarefas com prazo nos próximos 7 dias.

**Mais tarde** — Tarefas sem data ou com prazo além de 7 dias.

**Feitas** — Tarefas do tipo Pontual marcadas como concluídas. Colapsada por default.

---

## Compras

**Lista de compras** (também: **Categoria de compras**) — Agrupamento de itens de compra identificado por nome e cor. Exemplos: Mercado, Farmácia, Tecnologia, Roupas. É o header do accordeon na aba Compras.

**Item de compra** — Produto dentro de uma lista/categoria. Tem nome e pode ser marcado como comprado (checked).

> **Edição**: long press no header (Lista de compras) → abre modal para editar nome/cor. Click no nome do item → edição inline do texto.

---

## Notas

**Caderno** — Agrupamento de páginas de notas, identificado por nome e cor. Equivalente a um notebook/pasta.

**Página** — Uma nota individual dentro de um caderno. Contém título e conteúdo em markdown. Suporta: **negrito**, *itálico*, # Título, - lista, cor da letra.

> **Edição**: long press no nome do caderno → abre modal para editar. Click em página → abre o editor.

---

## Navegação

**Fog** — Efeito de sobreposição gradiente que aparece ao deslizar entre abas. Cria uma transição visual calma e indica a direção do movimento.

**Swipe** — Gesto de deslizar horizontalmente para trocar de aba (Tarefas ↔ Compras ↔ Notas).

**Back swipe / Back gesture** — Gesto de voltar (Android). Tem 3 funções em ordem: (1) fecha modal/tela aberta, (2) colapsa o container mais baixo com `data-expanded="1"`, (3) exibe diálogo de saída. O app nunca fecha sem confirmação.

**PWA** — Progressive Web App. O Fluxo roda no navegador mas se comporta como app nativo: pode ser instalado na tela inicial, funciona offline, e suporta notificações.

---

## Técnico

**Service Worker (SW)** — Script que roda em background no navegador para habilitar modo offline e notificações push por timer (setTimeout).

**Cache fluxo-v21** — Nome da versão atual do cache do Service Worker. Bumpar sempre que JS/CSS mudar.

**fluxo/auth** — Chave no localStorage que armazena os dados de autenticação PIN (hash SHA-256 do PIN + salt).

**fluxo/v2** — Chave no localStorage que armazena todos os dados do app (tarefas, compras, notas, configurações).

**fluxo/notified** — Chave no localStorage que rastreia quais notificações já foram exibidas (evita repetição).

**Score dot** — Bolinha colorida no mini-calendário que representa o score do dia.

---

*Dicionário iniciado em mai/2026. Atualizar sempre que um novo conceito surgir.*
