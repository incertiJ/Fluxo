/* Fluxo v6.6 */

const STORAGE_KEY = "fluxo/v2";
const NOTIFIED_KEY = "fluxo/notified";
const CHANGELOG_CHECKS_KEY = "fluxo/changelog-checks";
const APP_VERSION = "8.6";
const AUTH_KEY = "fluxo/auth";

const CHANGELOG = {
  "8.6": [
    "Fix: microfone parava imediatamente por evento mousedown sintético após touchend",
    "Mic: animação mais visível — botão vermelho sólido com pulso de escala enquanto grava",
  ],
  "8.5": [
    "Fix: swipe-delete em páginas de notas — fundo vermelho não aparece mais em repouso",
  ],
  "8.4": [
    "Notas: microfone é toggle — toque para gravar, toque novamente para parar e inserir texto",
    "Notas: deslize página para a esquerda para apagar",
  ],
  "8.3": [
    "Notas: botão de microfone na toolbar — dita texto por voz (pt-BR) e insere no cursor",
    "Compras: container Importantes exibe apenas itens pendentes (marcados como feito não aparecem)",
  ],
  "8.2": [
    "Lembretes: borda vermelha completa (todos os lados) em tarefas atrasadas",
  ],
  "8.1": [
    "Lembretes: atrasadas no topo filtradas por importância alta/crítica (≥ 3) com borda vermelha",
  ],
  "8.0": [
    "Lembretes: tarefas atrasadas aparecem no topo da seção com borda vermelha",
  ],
  "7.9": [
    "Compras: container 'Importantes' agrupa todos os itens urgentes/necessidade de todas as listas",
    "Compras: itens em Importantes têm cor da lista de origem, badge do nome da lista e badge de importância",
    "Compras: Importantes tem cor customizável via long press no header",
    "Back gesture: containers do Importantes colapsáveis via gesto back",
    "Fix: containers forçados fechados ao completar autenticação (PIN)",
  ],
  "7.8": [
    "Inicialização: todos os containers (seções, categorias de compras, cadernos) iniciam fechados a cada abertura do app",
    "Back gesture: padrão duplo toque — primeiro gesto exibe toast; segundo gesto dentro de 3s não empurra estado, próximo back do Android fecha o PWA",
    "Back gesture: debounce de 300ms removido (handler de toque foi removido em 7.6, debounce era redundante)",
  ],
  "7.7": [
    "Back gesture: try/catch no popstate garante que history.pushState é sempre chamado mesmo que render() falhe",
    "Sair: history.go(-100) retorna direto ao estado inicial — próximo gesto do Android fecha o PWA",
  ],
  "7.6": [
    "Gesto de borda: touch handler removido — no Android o back gesture já dispara popstate automaticamente",
    "Popstate: debounce de 300ms mantido para prevenção de disparos rápidos acidentais",
    "Saída: Sim fecha o PWA com segundo history.back() agendado via setTimeout",
  ],
  "7.5": [
    "Gesto de borda direita: debounce de 300ms impede duplo disparo (touch + popstate do mesmo gesto físico)",
    "Saída confirmada: agora fecha o PWA de verdade ao clicar Sim (segundo history.back via setTimeout)",
  ],
  "7.4": [
    "Gesto de borda direita: deslizar da borda direita para esquerda aciona o back (fecha modal, colapsa container ou pergunta saída)",
    "Gesto de borda direita: separado do swipe de aba — não muda de aba quando parte dos últimos 30px da borda",
  ],
  "7.3": [
    "Navegação: back colapsa container mais baixo (data-expanded) até não restar nenhum, então exibe diálogo",
    "Navegação: diálogo de saída reaparece corretamente após cancelar ou fechar com back",
    "Navegação: pressionar back enquanto diálogo está visível fecha o diálogo e mantém o app aberto",
    "Navegação: invariante — popstate sempre restaura entrada no histórico (exceto ao confirmar saída)",
  ],
  "7.2": [
    "Navegação: containers têm atributo data-expanded indicando estado aberto/fechado",
    "Navegação: back colapsa container mais baixo visível até não restar nenhum, então exibe diálogo de saída",
    "Navegação: diálogo de saída reaparece corretamente após cancelar — não some depois de uma vez",
    "Navegação: pressionar back enquanto diálogo está visível fecha o diálogo sem sair do app",
  ],
  "7.1": [
    "Navegação: diálogo de saída aparece corretamente ao pressionar back sem nada aberto",
    "Navegação: cancelar saída funciona — app permanece aberto; Sair libera o gesto natural de fechar",
    "Navegação: estado colapsado dos containers persiste entre renders (não volta ao estado inicial)",
    "Compras: Enter confirma o item na lista sem pular para outro campo (usa form submit)",
    "Notificações: logo redonda do Fluxo restaurada no corpo da notificação",
    "Notificações: badge na barra de status agora é silhueta branca das ondas (sem fundo)",
    "Versão: tela de novidades abre em tela cheia (como página de nota)",
  ],
  "7.0": [
    "Navegação: diálogo de saída agora aparece corretamente (loop de history resolvido)",
    "Navegação: múltiplos containers colapsam corretamente — cada gesto back fecha um",
    "Compras: Enter fecha teclado imediatamente sem selecionar outro campo",
    "Notas: fundo não aparece mais atrás da página quando o teclado está aberto",
    "Notificações: ícone removido do botão Testar (evita logo dupla na notificação de teste)",
  ],
  "6.9": [
    "Navegação: gesto back fecha modal/página aberta antes de colapsar containers",
    "Navegação: página de nota salva automaticamente ao fechar com gesto back",
    "Navegação: diálogo de saída personalizado (substitui confirm() inoperante no Android)",
    "Compras: cores de importância — azul (Luxo), verde (Conforto), laranja (Necessidade), vermelho (Urgente)",
    "Compras: Enter fecha teclado sem pular para outro campo",
    "Notas: indicador de cor reflete a cor atual do cursor ao navegar pelo texto",
    "Notificações: removido ícone grande da notificação (apenas badge monocromático permanece)",
  ],
  "6.8": [
    "Navegação: gesto back colapsa containers expandidos (incluindo calendário e lembrete abertos por padrão)",
    "Navegação: gesto back fecha página de nota aberta e salva automaticamente",
    "Compras: importância de item — badge colorido (Luxo/Conforto/Necessidade/Urgente)",
    "Compras: dropdown para escolher importância ao tocar no badge",
    "Compras: sort por importância ao abrir categoria (Urgente primeiro, comprados no fim)",
    "Compras: deslize para esquerda apaga item (mesmo padrão das tarefas)",
    "Compras: contador corrigido — mostra itens comprados/total (era itens pendentes/total)",
    "Compras: Enter fecha teclado sem pular para outro campo de texto",
    "Notas: páginas salvando corretamente ao clicar Salvar",
    "Notas: to-do list com checkboxes clicáveis — botão ☑ na toolbar",
    "Notas: Enter em to-do list cria novo item com checkbox automaticamente",
    "Notas: botão de lista usa ícone de ponto+linha (sem texto)",
    "Notas: título não desce em direção ao teclado ao abrir página nova",
    "Notas: cor de texto da toolbar resetada ao abrir qualquer página",
    "Notas: bullet list alinhada às linhas da pauta do caderno",
    "Cores: marrom escuro agora é a última cor da paleta (mais escuro = último)",
    "Notificações: ícone do Fluxo regenerado se cache inválido detectado",
  ],
  "6.6": [
    "Design: cor escura da paleta trocada de preto fosco por vinho (#8b3570)",
    "Notificações: badge monocromático (branco) da logo Fluxo na barra de status",
    "Notificações: cache do SW atualizado (fluxo-v14) — garante código novo na PWA",
    "Notas: cor do editor não fica mais travada ao reabrir o painel de cores",
    "Compras: Enter adiciona item sem pular para o campo de outra lista aberta",
  ],
  "6.4": [
    "Design: nova paleta de 14 cores pastéis (7 famílias × 2 tons)",
    "Notas: cores do editor atualizadas — vermelho, azul, verde, amarelo (tons suaves)",
    "Notas: toolbar e cabeçalho sempre visíveis ao topo, mesmo com teclado aberto",
    "Notas: texto posicionado 2px acima da linha do caderno",
    "Notas: auto-save ao voltar com gesto (popstate); usa 'Sem título' se vazio",
    "Tarefas: botão 'Apagar todas' sem margem extra acima da última tarefa",
    "Tarefas: fog de aba suprimido durante deslize de deletar tarefa feita",
    "Tudo: long press reduzido para 300ms (sincroniza com vibração Pixel)",
    "Login: saudação por horário (Bom dia/Boa tarde/Boa noite) com nome configurável",
    "Login: nome configurável via Configurações (clicar na logo/marca)",
    "Notificações: remoção do ícone de badge (mantém apenas ícone do Fluxo à esquerda)",
  ],
  "6.03": [
    "Tarefas: calendário em container colapsável próprio, expandido por padrão",
    "Tarefas: painel de filtros removido definitivamente",
    "Tarefas: deslize para deletar tarefa feita não dispara mais troca de aba",
    "Tarefas: vermelho do deslize e botão 'Apagar todas' em cor pastel da paleta",
    "Tarefas: botão 'Apagar todas' posicionado próximo à última tarefa",
    "Tarefas: cor dos títulos de seção (Lembretes, Hoje, etc.) atualizada",
    "Notas: painel de cores agora oculto por padrão e fecha ao selecionar cor",
    "Notas: texto posicionado 1px acima da linha do caderno",
    "Notas: botão Desfazer (↩) adicionado à barra de ferramentas",
    "Notas: botão Salvar não persiste mais ao navegar sem salvar",
    "Notificações: ícone do Fluxo exibido nas notificações",
  ],
  "6.02": [
    "Calendário: deslize vertical muda o mês (↑ próximo, ↓ anterior); horizontal troca abas",
    "Calendário: células compactas (~60% menos altura), dots de importância proporcionais",
    "Notas: painel de cores com posição fixa — não some ao abrir o teclado",
    "Notas: cor do botão '● Cor' reflete a cor selecionada",
    "Notas: texto reposicionado acima da linha do caderno (baseline acima da régua)",
    "Notas: contagem corrigida — palavras reais + estimativa de linhas no card da página",
    "Notas: botão Salvar removido do cabeçalho; único salvar é o FAB no canto inferior direito",
    "Tarefas feitas: deslize para esquerda deleta com animação + Desfazer (3s)",
    "Tarefas feitas: botão 'Apagar todas' aparece ao chegar ao fim da lista",
  ],
  "6.01": [
    "Calendário ocupa 100% da caixa de filtros; bolinhas por tarefa (cor/tamanho = importância)",
    "Editor de notas WYSIWYG: negrito/itálico/título/lista via execCommand, sem markdown",
    "Notas: paleta de 4 cores + padrão no editor; cor da página = cor do caderno",
    "Notas: contagem de linhas não-vazias; ícone de caderno removido das páginas",
    "Notas: botão Salvar fixo no canto inferior direito, oculto quando teclado aberto",
    "Compras e Notas: botão + via FAB (igual à aba Tarefas)",
    "Gesto de voltar via popstate (Android back gesture) fecha modal ou pergunta saída",
    "Botão testar notificação usa Service Worker (corrige erro no Android Chrome)",
    "Tarefas feitas: botão ✕ para remover permanentemente",
    "Expansão de seção preserva posição do scroll",
    "Ícone de pontual: 𝟏 (1 serifado); título: T serifado; itálico: I inclinado",
  ],
  "6.00": [
    "Login com PIN de 4 dígitos + biometria (digital/rosto) via WebAuthn",
    "Filtros de tarefas: 3 dropdowns empilhados (Importância, Categoria, Frequência)",
    "Fog de transição entre abas: mais visível e mais suave",
    "Compras: click no header expande/colapsa; long press edita a lista",
    "Compras: cor do texto dos itens = cor da categoria; click no nome = edição inline",
    "Notas: long press no caderno = editar",
    "Subtarefas: click no texto = edição inline",
    "Seção 'Feitas' na aba Tarefas com tarefas concluídas",
    "Notificações: notifs perdidas são exibidas ao abrir; agendamento persistente no SW",
  ],
  "5.00": [
    "Aba Início renomeada para Tarefas",
    "Aba Calendário removida — mini-calendário embutido na aba Tarefas",
    "Filtros reorganizados: Frequência + Importância + Categoria com ícone de ordenação",
    "Ordenação por importância ou data (botão ⇅ nos filtros)",
    "Seção 'Sem data' removida — itens aparecem em 'Mais tarde'",
    "Somente Lembretes expandido ao iniciar o app",
    "Click no dia do calendário com tarefas abre modal centralizado",
    "Nova aba Notas com cadernos, páginas e markdown leve",
    "Markdown: **negrito**, *itálico*, # título, - lista",
    "Compras: long press em item abre edição com cor da categoria e nome",
    "Compras: itens coloridos com tint da categoria",
    "Gesto de deslize da borda direita fecha o modal aberto",
    "Nenhum modal aberto + gesto = toast de saída",
    "Fog visual suave ao deslizar entre abas",
    "Badge de versão abre lista das novidades desta versão com checkboxes",
  ],
};

const TAG_COLORS = [
  "#f4f0e8",  // creme
  "#f0d898",  // amarelo pastel
  "#c8a040",  // dourado (= editor amarelo)
  "#d4e890",  // lima
  "#68b888",  // verde (= editor verde)
  "#90dcd4",  // menta
  "#6a9ec8",  // azul (= editor azul)
  "#c0a8e8",  // lilás
  "#f4a8b8",  // rosa pastel
  "#d47878",  // salmão (= editor vermelho)
  "#b89870",  // caramelo
  "#70a870",  // verde musgo
  "#5878a8",  // azul ardósia
  "#906888",  // ameixa
  "#8b3570",  // vinho
  "#504840",  // marrom escuro (mais escuro = último)
];

const DEFAULT_TAGS = [
  { name: "Limpeza", color: "#68b888" },
  { name: "Viagem", color: "#6a9ec8" },
  { name: "Burocracia", color: "#5878a8" },
  { name: "Saúde", color: "#90dcd4" },
  { name: "Finanças", color: "#c8a040" },
  { name: "Compras", color: "#d47878" },
];

const IMP_WEIGHT = { 1: 1, 2: 6, 3: 10, 4: 30 };
const IMP_LABEL = { 1: "Baixa", 2: "Média", 3: "Alta", 4: "Crítica" };

const state = {
  tasks: [],
  tags: [],
  shopping: { categories: [] },
  notes: { notebooks: [], pages: [] },
  view: "home",
  editingId: null,
  draftSubtasks: [],
  draftNotifications: [],
  draftTagIds: [],
  recognition: null,
  installPrompt: null,
  notifSchedule: [{ h: 9, m: 0 }, { h: 22, m: 0 }],
  appTheme: "auto",
  tasksCalMonth: null,
  tasksCalDate: null,
  pendingRenew: null,
  pendingRenewIds: new Set(),
  editingTagId: null,
  editingTagDraft: null,
  editingDateTaskId: null,
  editingTagsTaskId: null,
  homeCollapsed: { calendar: true, reminder: true, atrasadas: true, today: true, nextweek: true, later: true, done: true },
  homeFilters: { types: new Set(), imps: new Set(), tagIds: new Set() },
  homeFilterOpen: { imp: false, tag: false, freq: false },
  editingCategoryId: null,
  editingCategoryDraft: null,
  addItemDraft: { name: "", categoryId: null },
  catPickerContext: null,
  editingNotebookId: null,
  editingNotebookDraft: null,
  editingPageId: null,
  pagePreviewMode: false,
  _lastView: null,
  userName: "",
};

/* ===== persistence ===== */

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const sleep = ms => new Promise(r => setTimeout(r, ms));

function applyTheme() {
  const root = document.documentElement;
  if (state.appTheme === "auto") root.removeAttribute("data-theme");
  else root.dataset.theme = state.appTheme;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      state.tasks = data.tasks || [];
      state.tags = data.tags || [];
      state.shopping = data.shopping || { categories: [] };
      if (!state.shopping.importantes) state.shopping.importantes = { collapsed: true, color: "#f2dada" };
      state.notes = data.notes || { notebooks: [], pages: [] };
      state.notifSchedule = data.notifSchedule || [{ h: 9, m: 0 }, { h: 22, m: 0 }];
      state.appTheme = data.appTheme || "auto";
      state.userName = data.userName || "";
      if (data.homeCollapsed) Object.assign(state.homeCollapsed, data.homeCollapsed);
    }
  } catch {}
  if (!state.tags.length) {
    state.tags = DEFAULT_TAGS.map(t => ({ id: uid(), name: t.name, color: t.color }));
    save();
  }
  state.tasks = state.tasks.filter(t => !(t.type === "routine" && t.active === false));
  state.tasks.forEach(t => { delete t.active; });
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    tasks: state.tasks, tags: state.tags, shopping: state.shopping,
    notes: state.notes, notifSchedule: state.notifSchedule, appTheme: state.appTheme,
    userName: state.userName, homeCollapsed: state.homeCollapsed,
  }));
}

function getNotified() {
  try { return new Set(JSON.parse(localStorage.getItem(NOTIFIED_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveNotified(s) { localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...s])); }

function getChangelogChecks() {
  try { return new Set(JSON.parse(localStorage.getItem(CHANGELOG_CHECKS_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveChangelogChecks(s) { localStorage.setItem(CHANGELOG_CHECKS_KEY, JSON.stringify([...s])); }

/* ===== dates ===== */

function todayISO() { return ymd(new Date()); }
function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}
function parseYMD(s) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addInterval(dateStr, amount, unit) {
  const d = parseYMD(dateStr);
  if (unit === "days") d.setDate(d.getDate() + amount);
  else if (unit === "weeks") d.setDate(d.getDate() + amount * 7);
  else if (unit === "months") d.setMonth(d.getMonth() + amount);
  else if (unit === "years") d.setFullYear(d.getFullYear() + amount);
  return ymd(d);
}
function diffDays(aStr, bStr) {
  const a = parseYMD(aStr).getTime();
  const b = parseYMD(bStr).getTime();
  return Math.round((a - b) / 86400000);
}
function fmtDateBR(s) {
  if (!s) return "";
  const d = parseYMD(s);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
}
function fmtRelativeDays(s) {
  if (!s) return "";
  const d = diffDays(s, todayISO());
  if (d === 0) return "hoje";
  if (d === 1) return "amanhã";
  if (d === -1) return "ontem";
  if (d > 0 && d < 30) return `em ${d}d`;
  if (d < 0 && d > -30) return `há ${-d}d`;
  if (d > 0) return `em ${Math.round(d/30)} mes${d>=60?"es":""}`;
  return `há ${Math.round(-d/30)} meses`;
}

/* ===== importance / score ===== */

function scoreFor(task) { return IMP_WEIGHT[task.importance] || IMP_WEIGHT[2]; }

function scoreDotStyle(score) {
  if (score <= 0) return null;
  let size, color;
  if (score <= 3) { size = 10; color = "#a8c4dc"; }
  else if (score <= 9) { size = 14; color = "#c9b896"; }
  else if (score <= 25) { size = 20; color = "#e0b48a"; }
  else if (score <= 50) { size = 28; color = "#d88c8c"; }
  else { size = 36; color = "#c46b6b"; }
  return { size, color };
}

/* ===== tags / queries ===== */

function tagById(id) { return state.tags.find(t => t.id === id); }
function tagsOf(task) { return (task.tags || []).map(tagById).filter(Boolean); }

function isRoutineHidden(t) { return t.type === "routine" && state.pendingRenewIds.has(t.id); }

function tasksOnDate(dateStr) {
  const items = [];
  for (const t of state.tasks) {
    if (t.type === "oneoff") {
      if (!t.completed && t.deadline === dateStr) items.push(t);
    } else {
      if (isRoutineHidden(t)) continue;
      if (t.nextDue === dateStr) items.push(t);
    }
  }
  return items;
}

function isOverdue(t) {
  const due = t.type === "oneoff" ? t.deadline : t.nextDue;
  if (!due) return false;
  return diffDays(due, todayISO()) < 0;
}
function isDueToday(t) {
  const due = t.type === "oneoff" ? t.deadline : t.nextDue;
  return due === todayISO();
}

/* ===== rendering core ===== */

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
    else if (v === false || v == null) {}
    else if (v === true) e.setAttribute(k, "");
    else e.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return e;
}

function setView(v) {
  state.view = v;
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  render();
}

function render() {
  // Tear down page-save-fab (removes visualViewport listener) when notes modal is not visible
  const noteModal = document.getElementById("notes-page-modal");
  if (noteModal && noteModal.hidden) teardownPageSaveFab();

  const view = document.getElementById("view");
  const fab = document.getElementById("add-btn");

  const viewChanged = state.view !== state._lastView;
  state._lastView = state.view;

  view.innerHTML = "";
  view.className = "view";

  if (viewChanged) {
    void view.offsetWidth;
    view.style.animation = "none";
    requestAnimationFrame(() => { view.style.animation = ""; });
  }

  fab.hidden = false;

  if (state.view === "home") renderHome(view);
  else if (state.view === "shopping") renderShopping(view);
  else if (state.view === "notes") renderNotes(view);
}

function unique(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    const k = keyFn(x);
    if (!seen.has(k)) { seen.add(k); out.push(x); }
  }
  return out;
}

/* ===== Home (Tarefas) ===== */

function taskDue(t) { return t.type === "oneoff" ? t.deadline : t.nextDue; }

function makeFilterDropdown(openObj, key, label, buildBody) {
  const wrap = el("div", { class: "filter-dropdown" });
  const hdr = el("button", { type: "button", class: "filter-dropdown-hdr" + (openObj[key] ? " open" : "") });
  const lspan = el("span", {}, label);
  const caret = el("span", { class: "filter-caret" }, openObj[key] ? "▲" : "▼");
  hdr.append(lspan, caret);

  const body = el("div", { class: "filter-dropdown-body" });
  body.hidden = !openObj[key];
  buildBody(body);

  const open = () => {
    openObj[key] = true;
    hdr.classList.add("open");
    caret.textContent = "▲";
    body.hidden = false;
    setTimeout(() => {
      const closeOnOutside = e => {
        if (!wrap.contains(e.target)) {
          e.stopPropagation();
          e.preventDefault();
          openObj[key] = false;
          hdr.classList.remove("open");
          caret.textContent = "▼";
          body.hidden = true;
          document.removeEventListener("click", closeOnOutside, true);
        }
      };
      document.addEventListener("click", closeOnOutside, true);
    }, 10);
  };

  hdr.addEventListener("click", () => {
    if (openObj[key]) {
      openObj[key] = false;
      hdr.classList.remove("open");
      caret.textContent = "▼";
      body.hidden = true;
    } else {
      open();
    }
  });

  wrap.append(hdr, body);
  return wrap;
}

function buildCalendarSection() {
  const key = "calendar";
  const collapsed = state.homeCollapsed[key];
  const sec = el("section", {
    class: "section section--home" + (collapsed ? " section--collapsed" : ""),
    "data-section": key,
    "data-expanded": collapsed ? "0" : "1"
  });
  const hdr = el("div", { class: "section-hdr" });
  hdr.appendChild(el("h2", {}, "Calendário"));
  hdr.appendChild(el("span", { class: "section-toggle" }, collapsed ? "▶" : "▼"));
  hdr.addEventListener("click", () => {
    state.homeCollapsed[key] = !state.homeCollapsed[key];
    render();
  });
  sec.appendChild(hdr);
  if (!collapsed) {
    const body = el("div", { class: "cal-section-body" });
    body.appendChild(buildMiniCalendar());
    sec.appendChild(body);
  }
  return sec;
}

function buildMiniCalendar() {
  if (!state.tasksCalMonth) {
    const t = new Date();
    state.tasksCalMonth = { y: t.getFullYear(), m: t.getMonth() };
  }
  // Pre-select today if nothing is selected
  if (!state.tasksCalDate) state.tasksCalDate = todayISO();
  const { y, m } = state.tasksCalMonth;

  const wrap = el("div", { class: "mini-cal" });

  // Header: prev | month name | next
  const hdr = el("div", { class: "mini-cal-hdr" });
  const prev = el("button", { type: "button", class: "mini-cal-nav" }, "‹");
  prev.addEventListener("click", e => {
    e.stopPropagation();
    state.tasksCalMonth = { y: m === 0 ? y - 1 : y, m: m === 0 ? 11 : m - 1 };
    render();
  });
  const next = el("button", { type: "button", class: "mini-cal-nav" }, "›");
  next.addEventListener("click", e => {
    e.stopPropagation();
    state.tasksCalMonth = { y: m === 11 ? y + 1 : y, m: m === 11 ? 0 : m + 1 };
    render();
  });
  const monthName = new Date(y, m, 1).toLocaleDateString("pt-BR", { month: "short" });
  const title = el("span", { class: "mini-cal-month" }, monthName.charAt(0).toUpperCase() + monthName.slice(1) + " " + y);
  hdr.append(prev, title, next);
  wrap.appendChild(hdr);

  // Grid
  const grid = el("div", { class: "mini-cal-grid" });
  ["D", "S", "T", "Q", "Q", "S", "S"].forEach(d => grid.appendChild(el("div", { class: "mini-cal-dow" }, d)));

  const first = new Date(y, m, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();

  const TOTAL_CELLS = 35;
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push({ cy: m === 0 ? y - 1 : y, cm: m === 0 ? 11 : m - 1, cd: prevDays - startDow + 1 + i, out: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ cy: y, cm: m, cd: d, out: false });
  const nextM = m === 11 ? 0 : m + 1, nextY = m === 11 ? y + 1 : y;
  let trailing = 1;
  while (cells.length < TOTAL_CELLS) cells.push({ cy: nextY, cm: nextM, cd: trailing++, out: true });
  cells.slice(0, TOTAL_CELLS).forEach(({ cy, cm, cd, out }) => grid.appendChild(makeMiniCalCell(cy, cm, cd, out)));

  wrap.appendChild(grid);

  // Vertical swipe on calendar = change month (up=next, down=prev)
  // Horizontal swipe propagates to tab swipe handler naturally
  let calSwipeX = 0, calSwipeY = 0;
  wrap.addEventListener("touchstart", e => {
    calSwipeX = e.touches[0].clientX;
    calSwipeY = e.touches[0].clientY;
  }, { passive: true });
  wrap.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - calSwipeX;
    const dy = e.changedTouches[0].clientY - calSwipeY;
    if (Math.abs(dx) >= Math.abs(dy)) return; // horizontal dominant = tab swipe
    if (Math.abs(dy) < 30) return;
    if (dy < 0) state.tasksCalMonth = { y: m === 11 ? y + 1 : y, m: m === 11 ? 0 : m + 1 };
    else state.tasksCalMonth = { y: m === 0 ? y - 1 : y, m: m === 0 ? 11 : m - 1 };
    render();
  }, { passive: true });

  return wrap;
}

function makeMiniCalCell(y, m, d, outside) {
  const date = new Date(y, m, d);
  const ds = ymd(date);
  const tasks = tasksOnDate(ds);
  const isSelected = ds === state.tasksCalDate;
  const isToday = ds === todayISO();

  const cell = el("div", {
    class: "mini-cal-day"
      + (outside ? " outside" : "")
      + (isToday ? " today" : "")
      + (isSelected ? " selected" : "")
  });
  cell.appendChild(el("span", { class: "mini-cal-day-num" }, String(date.getDate())));

  if (tasks.length) {
    const dotsRow = el("div", { class: "mini-cal-day-dots" });
    tasks.slice(0, 5).forEach(t => {
      dotsRow.appendChild(el("span", { class: "mini-cal-dot", "data-imp": String(t.importance) }));
    });
    cell.appendChild(dotsRow);
  }

  cell.addEventListener("click", () => {
    state.tasksCalDate = isSelected ? null : ds;
    if (tasks.length && !isSelected) openDayTasksModal(ds);
    else render();
  });
  return cell;
}

function openDayTasksModal(ds) {
  state.tasksCalDate = ds;
  const tasks = tasksOnDate(ds).sort((a, b) => b.importance - a.importance);
  const d = parseYMD(ds);
  const label = d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
  document.getElementById("day-tasks-title").textContent = label.charAt(0).toUpperCase() + label.slice(1);
  const body = document.getElementById("day-tasks-body");
  body.innerHTML = "";
  if (!tasks.length) {
    body.appendChild(el("p", { class: "empty" }, "Nenhuma tarefa neste dia."));
  } else {
    const list = el("div", { class: "task-list" });
    tasks.forEach(t => list.appendChild(renderTaskCard(t)));
    body.appendChild(list);
  }
  document.getElementById("day-tasks-modal").hidden = false;
}

function renderHome(root) {
  root.className = "view view--home";
  const today = todayISO();
  const in7 = ymd(new Date(Date.now() + 7 * 86400000));
  const hf = state.homeFilters;

  // Collapsible calendar section
  root.appendChild(buildCalendarSection());

  // Scrollable sections container
  const scroll = el("div", { class: "home-scroll" });

  function passesFilter(t) {
    if (hf.types.size > 0 && !hf.types.has(t.type)) return false;
    if (hf.imps.size > 0 && !hf.imps.has(String(t.importance))) return false;
    if (hf.tagIds.size > 0 && !(t.tags || []).some(id => hf.tagIds.has(id))) return false;
    return true;
  }

  function isVisible(t) { return !t.completed && !isRoutineHidden(t) && passesFilter(t); }

  const byImp = (a, b) => b.importance - a.importance;
  const byDueThenImp = (a, b) => (taskDue(a) || "").localeCompare(taskDue(b) || "") || b.importance - a.importance;
  const sortFn = byImp;

  const overdue = state.tasks.filter(t => isVisible(t) && taskDue(t) && taskDue(t) < today).sort(sortFn);

  const reminder = [
    ...overdue.filter(t => t.importance >= 3),
    ...state.tasks.filter(t =>
      isVisible(t) && t.type === "oneoff" && t.importance >= 3 &&
      !(t.deadline && t.deadline <= today)
    ).sort((a, b) => byImp(a, b) || (a.deadline || "9999").localeCompare(b.deadline || "9999"))
  ];
  const todayTasks = state.tasks.filter(t => isVisible(t) && taskDue(t) === today).sort(sortFn);
  const nextweek = state.tasks.filter(t => {
    const due = taskDue(t);
    return isVisible(t) && due && due > today && due <= in7;
  }).sort(byDueThenImp);

  // "Mais tarde" includes items with no date
  const later = state.tasks.filter(t => {
    const due = taskDue(t);
    return isVisible(t) && (!due || due > in7);
  }).sort((a, b) => {
    const da = taskDue(a), db = taskDue(b);
    if (!da && !db) return b.importance - a.importance;
    if (!da) return 1;
    if (!db) return -1;
    return da.localeCompare(db) || b.importance - a.importance;
  });

  const done = state.tasks
    .filter(t => t.type === "oneoff" && t.completed)
    .sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""));

  scroll.appendChild(makeHomeSection("reminder", "Lembrete", reminder, "Nenhuma tarefa importante próxima."));
  scroll.appendChild(makeHomeSection("atrasadas", "Atrasadas", overdue, "Nenhuma tarefa atrasada."));
  scroll.appendChild(makeHomeSection("today", "Para hoje", todayTasks, "Nenhuma tarefa para hoje."));
  scroll.appendChild(makeHomeSection("nextweek", "Próxima semana", nextweek, "Nenhuma tarefa para a semana."));
  scroll.appendChild(makeHomeSection("later", "Mais tarde", later, "Nenhuma tarefa além desta semana."));
  scroll.appendChild(makeHomeSection("done", "Feitas", done, "Nenhuma tarefa concluída.", { showDelete: true }));
  root.appendChild(scroll);
}

function makeHomeSection(key, title, tasks, emptyMsg, opts = {}) {
  const collapsed = state.homeCollapsed[key];
  const sec = el("section", {
    class: "section section--home" + (collapsed ? " section--collapsed" : ""),
    "data-section": key,
    "data-expanded": collapsed ? "0" : "1"
  });

  const hdr = el("div", { class: "section-hdr" });
  const h2 = el("h2", {}, title);
  if (tasks.length) h2.appendChild(el("span", { class: "section-count" }, String(tasks.length)));
  hdr.appendChild(h2);
  hdr.appendChild(el("span", { class: "section-toggle" }, collapsed ? "▶" : "▼"));

  hdr.addEventListener("click", () => {
    const wasCollapsed = state.homeCollapsed[key];
    state.homeCollapsed[key] = !wasCollapsed;
    const scrollEl = document.querySelector(".home-scroll");
    const savedTop = scrollEl ? scrollEl.scrollTop : 0;
    render();
    const newScrollEl = document.querySelector(".home-scroll");
    if (newScrollEl) {
      newScrollEl.scrollTop = savedTop;
      if (wasCollapsed) {
        const newHdr = document.querySelector(`[data-section="${key}"] .section-hdr`);
        if (newHdr) newHdr.scrollIntoView({ block: "nearest", behavior: "instant" });
      }
    }
  });

  sec.appendChild(hdr);

  if (!collapsed) {
    if (!tasks.length) {
      sec.appendChild(el("div", { class: "empty" }, emptyMsg));
    } else {
      const list = el("div", { class: "task-list" });
      if (key === "done") {
        tasks.forEach(t => list.appendChild(makeSwipeDeleteCard(t)));
        const sentinel = el("div", { class: "done-list-sentinel" });
        list.appendChild(sentinel);
        const deleteAllBtn = el("button", {
          type: "button", class: "delete-all-btn", "data-delete-all": "1"
        }, "Apagar todas");
        deleteAllBtn.hidden = true;
        deleteAllBtn.addEventListener("click", () => {
          if (!confirm("Apagar todas as tarefas concluídas? Esta ação não pode ser desfeita.")) return;
          state.tasks = state.tasks.filter(t => !t.completed);
          save(); render();
        });
        sec.appendChild(list);
        sec.appendChild(deleteAllBtn);
        // Show button when sentinel enters viewport
        const obs = new IntersectionObserver(entries => {
          deleteAllBtn.hidden = !entries[0].isIntersecting;
        }, { threshold: 0.5 });
        obs.observe(sentinel);
      } else {
        tasks.forEach(t => list.appendChild(renderTaskCard(t, opts)));
        sec.appendChild(list);
      }
    }
  }
  return sec;
}

/* ===== Swipe-to-delete (Feitas section) ===== */

let _undoTimer = null;
let _undoTask = null;

function showDeleteUndoToast(task) {
  if (_undoTimer) clearTimeout(_undoTimer);
  _undoTask = task;
  let toastEl = document.getElementById("undo-delete-toast");
  if (!toastEl) {
    toastEl = el("div", { id: "undo-delete-toast", class: "undo-delete-toast" });
    const msg = el("span", { class: "undo-msg" }, "Tarefa removida");
    const btn = el("button", { type: "button", class: "undo-btn" }, "Desfazer");
    btn.addEventListener("click", () => {
      if (_undoTask) {
        state.tasks.push(_undoTask);
        _undoTask = null;
        save(); render();
      }
      clearTimeout(_undoTimer);
      _undoTimer = null;
      toastEl.hidden = true;
    });
    toastEl.append(msg, btn);
    document.body.appendChild(toastEl);
  }
  toastEl.hidden = false;
  _undoTimer = setTimeout(() => {
    toastEl.hidden = true;
    _undoTask = null;
    _undoTimer = null;
  }, 3000);
}

function makeSwipeDeleteCard(task) {
  const wrap = el("div", { class: "swipe-delete-wrap" });
  const bg = el("div", { class: "swipe-delete-bg" });
  bg.innerHTML = '<span class="swipe-delete-icon" aria-hidden="true">🗑</span>';
  const card = renderTaskCard(task, {});

  let startX = 0, startY = 0, currentDx = 0, dragging = false;

  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    currentDx = 0;
    dragging = true;
    card.style.transition = "none";
  }, { passive: true });

  card.addEventListener("touchmove", e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (Math.abs(dy) > Math.abs(dx) + 5) { dragging = false; card.style.transform = ""; return; }
    if (dx >= 0) { card.style.transform = ""; return; }
    currentDx = dx;
    card.style.transform = `translateX(${dx}px)`;
  }, { passive: true });

  card.addEventListener("touchend", () => {
    dragging = false;
    const threshold = wrap.offsetWidth * 0.4 || 120;
    if (currentDx < -threshold) {
      card.style.transition = "transform 0.22s ease-in";
      card.style.transform = "translateX(-110%)";
      setTimeout(() => {
        state.tasks = state.tasks.filter(t2 => t2.id !== task.id);
        save(); render();
        showDeleteUndoToast(task);
      }, 230);
    } else {
      card.style.transition = "transform 0.18s ease-out";
      card.style.transform = "";
      currentDx = 0;
    }
  }, { passive: true });

  // Prevent card click when user was swiping
  wrap.addEventListener("click", e => {
    if (Math.abs(currentDx) > 8) { e.stopPropagation(); currentDx = 0; }
  }, true);

  wrap.append(bg, card);
  return wrap;
}

/* ===== Task card ===== */

function unitShort(u, n) {
  const map = {
    days: ["dia", "dias"],
    weeks: ["semana", "semanas"],
    months: ["mês", "meses"],
    years: ["ano", "anos"]
  };
  const [s, p] = map[u] || ["", ""];
  return n === 1 ? s : p;
}

function renderTaskCard(t, opts = {}) {
  const card = el("article", {
    class: "task" + (t.completed ? " completed" : "") + (isOverdue(t) ? " task--overdue" : ""),
    "data-imp": t.importance,
    "data-task-id": t.id
  });

  const cb = el("input", { type: "checkbox", class: "task-checkbox" });
  cb.checked = !!t.completed;
  cb.addEventListener("click", e => { e.stopPropagation(); toggleComplete(t.id); });

  const content = el("div", { class: "task-content" });
  content.appendChild(el("div", { class: "task-title" }, t.title));

  const tagPills = el("div", { class: "task-tag-pills" });
  tagsOf(t).forEach(tag => {
    const p = el("span", { class: "tag-pill" }, tag.name);
    p.style.background = tag.color;
    p.addEventListener("click", e => { e.stopPropagation(); openTaskTagsSelector(t.id); });
    tagPills.appendChild(p);
  });
  content.appendChild(tagPills);

  const corner = el("div", { class: "task-corner" });
  corner.appendChild(el("span", { class: "crit-badge", "data-imp": t.importance }, IMP_LABEL[t.importance]));

  const dateStr = t.type === "oneoff" ? t.deadline : t.nextDue;
  if (dateStr) {
    const overdue = isOverdue(t);
    const dateEl = el("div", { class: "task-date" + (overdue ? " overdue" : "") });
    dateEl.innerHTML = `${fmtDateBR(dateStr)}<br><small>${fmtRelativeDays(dateStr)}</small>`;
    dateEl.addEventListener("click", e => { e.stopPropagation(); openQuickDate(t.id); });
    corner.appendChild(dateEl);
  }

  const footer = el("div", { class: "task-footer" });
  const freqIcon = el("button", { type: "button", class: "freq-icon", "aria-label": "Frequência" });
  if (t.type === "routine") {
    freqIcon.textContent = "↻";
  } else {
    freqIcon.innerHTML = '<span class="freq-icon-one">𝟏</span>';
  }
  freqIcon.addEventListener("click", e => {
    e.stopPropagation();
    const msg = t.type === "routine"
      ? `A cada ${t.intervalAmount} ${unitShort(t.intervalUnit, t.intervalAmount)}`
      : "Não se repete";
    showToast(msg);
  });
  footer.appendChild(freqIcon);

  let total, done;
  if (t.type === "oneoff") {
    if (t.subtasks && t.subtasks.length) {
      total = t.subtasks.length;
      done = t.subtasks.filter(s => s.completed).length;
    } else {
      total = 1;
      done = t.completed ? 1 : 0;
    }
  } else {
    total = 1; done = 0;
  }
  footer.appendChild(el("span", { class: "sub-counter" + (done >= total ? " complete" : "") }, `${done}/${total}`));

  card.append(cb, content, corner, footer);
  card.addEventListener("click", () => openTaskModal(t.id));

  if (opts.showDelete) {
    const delBtn = el("button", { type: "button", class: "task-delete-perm-btn", title: "Remover definitivamente" }, "✕");
    delBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (confirm("Remover esta tarefa definitivamente?")) {
        state.tasks = state.tasks.filter(t2 => t2.id !== t.id);
        save();
        render();
      }
    });
    card.appendChild(delBtn);
  }

  return card;
}

/* ===== Shopping ===== */

function renderShopping(root) {
  root.className = "view view--scrollable";
  renderShoppingImportantes(root);
  const cats = state.shopping.categories;
  if (!cats.length) return;
  const sorted = [...cats].sort((a, b) => b.items.length - a.items.length);
  sorted.forEach(cat => root.appendChild(renderShoppingCategory(cat)));
}

function renderShoppingImportantes(root) {
  const imp = state.shopping.importantes;
  if (!imp) return;

  const allItems = [];
  for (const cat of state.shopping.categories) {
    for (const item of cat.items) {
      if ((item.importance === "urgente" || item.importance === "necessidade") && !item.checked) {
        allItems.push({ item, cat });
      }
    }
  }

  const card = el("div", { class: "shopping-category" });
  card.style.setProperty("--cat-color", imp.color);
  card.style.setProperty("--cat-bg", hexToRgba(imp.color, 0.13));

  const hdr = el("div", {
    class: "shopping-cat-header",
    "data-cat-id": "importantes",
    "data-expanded": imp.collapsed ? "0" : "1"
  });
  hdr.addEventListener("click", () => { imp.collapsed = !imp.collapsed; save(); render(); });
  let lpTimer = null;
  hdr.addEventListener("touchstart", () => { lpTimer = setTimeout(() => { lpTimer = null; openCategoryModal("importantes"); }, 300); }, { passive: true });
  hdr.addEventListener("touchend", () => { clearTimeout(lpTimer); lpTimer = null; }, { passive: true });
  hdr.addEventListener("touchmove", () => { clearTimeout(lpTimer); lpTimer = null; }, { passive: true });

  const dot = el("span", { class: "shopping-cat-dot" });
  dot.style.background = imp.color;
  const count = el("span", { class: "shopping-cat-count" }, String(allItems.length));
  const toggle = el("span", { class: "shopping-cat-chevron" }, imp.collapsed ? "▶" : "▼");
  hdr.append(dot, el("span", { class: "shopping-cat-name" }, "Importantes"), count, toggle);
  card.appendChild(hdr);

  if (!imp.collapsed) {
    const body = el("div", { class: "shopping-cat-body" });
    if (!allItems.length) {
      body.appendChild(el("p", { class: "shopping-empty-msg" }, "Nenhum item importante."));
    } else {
      const IMP_ORDER = ["urgente", "necessidade"];
      const IMP_LABELS = { urgente: "Urgente", necessidade: "Necessidade" };
      const sorted = [...allItems].sort((a, b) => {
        const d = IMP_ORDER.indexOf(a.item.importance) - IMP_ORDER.indexOf(b.item.importance);
        return d !== 0 ? d : a.cat.name.localeCompare(b.cat.name);
      });
      for (const { item, cat } of sorted) {
        const row = el("div", { class: "shopping-item" });
        row.style.borderLeft = `3px solid ${cat.color}`;
        const cb = el("input", { type: "checkbox", class: "styled-check" });
        cb.checked = item.checked;
        cb.addEventListener("change", e => { e.stopPropagation(); item.checked = cb.checked; save(); render(); });
        const nameEl = el("span", { class: "shopping-item-name" }, item.name);
        nameEl.style.color = cat.color;
        const catBadge = el("span", { class: "shopping-cat-badge" }, cat.name);
        catBadge.style.background = hexToRgba(cat.color, 0.18);
        catBadge.style.color = cat.color;
        const impBadge = el("span", { class: `shopping-imp-badge shopping-imp-badge--${item.importance}` }, IMP_LABELS[item.importance]);
        row.append(cb, nameEl, catBadge, impBadge);
        body.appendChild(row);
      }
    }
    card.appendChild(body);
  }
  root.appendChild(card);
}

function renderShoppingCategory(cat) {
  const card = el("div", { class: "shopping-category" });
  card.style.setProperty("--cat-color", cat.color);
  card.style.setProperty("--cat-bg", hexToRgba(cat.color, 0.13));
  card.style.setProperty("--cat-tint", hexToRgba(cat.color, 0.07));

  const hdr = el("div", { class: "shopping-cat-header", "data-cat-id": cat.id, "data-expanded": cat.collapsed ? "0" : "1" });

  // Click = expand/collapse
  hdr.addEventListener("click", () => {
    cat.collapsed = !cat.collapsed;
    save();
    render();
  });

  // Long press = edit category
  let catLp = null;
  hdr.addEventListener("touchstart", () => { catLp = setTimeout(() => { catLp = null; openCategoryModal(cat.id); }, 300); }, { passive: true });
  hdr.addEventListener("touchend", () => { clearTimeout(catLp); catLp = null; }, { passive: true });
  hdr.addEventListener("touchmove", () => { clearTimeout(catLp); catLp = null; }, { passive: true });

  const dot = el("span", { class: "shopping-cat-dot" });
  dot.style.background = cat.color;
  const name = el("span", { class: "shopping-cat-name" }, cat.name);
  const checkedCount = cat.items.filter(i => i.checked).length;
  const count = el("span", { class: "shopping-cat-count" }, `${checkedCount}/${cat.items.length}`);
  const toggle = el("span", { class: "shopping-cat-chevron" }, cat.collapsed ? "▶" : "▼");
  hdr.append(dot, name, count, toggle);
  card.appendChild(hdr);

  if (!cat.collapsed) {
    const body = el("div", { class: "shopping-cat-body" });

    const IMP_ORDER = ["urgente", "necessidade", "conforto", "luxo"];
    const IMP_CYCLE = { luxo: "conforto", conforto: "necessidade", necessidade: "urgente", urgente: "luxo" };
    const IMP_LABELS = { urgente: "Urgente", necessidade: "Necessidade", conforto: "Conforto", luxo: "Luxo" };

    // Sort: unchecked first (by importance), checked at end
    const sortedItems = [...cat.items.entries()].sort(([, a], [, b]) => {
      if (a.checked !== b.checked) return a.checked ? 1 : -1;
      return IMP_ORDER.indexOf(a.importance || "luxo") - IMP_ORDER.indexOf(b.importance || "luxo");
    });

    sortedItems.forEach(([i, item]) => {
      const imp = item.importance || "luxo";
      const wrap = el("div", { class: "swipe-delete-wrap" });
      const bg = el("div", { class: "swipe-delete-bg" });
      bg.innerHTML = '<span class="swipe-delete-icon" aria-hidden="true">🗑</span>';
      const row = el("div", { class: "shopping-item" + (item.checked ? " checked" : "") });

      const cb = el("input", { type: "checkbox", class: "styled-check" });
      cb.checked = item.checked;
      cb.addEventListener("change", e => {
        e.stopPropagation();
        cat.items[i].checked = cb.checked;
        save();
        render();
      });

      const nameEl = el("span", { class: "shopping-item-name" }, item.name);
      nameEl.style.color = cat.color;

      // Click → inline edit
      nameEl.addEventListener("click", e => {
        e.stopPropagation();
        const inp = el("input", { type: "text", class: "shopping-item-input", value: item.name, maxlength: "200" });
        const confirmEdit = () => {
          const v = inp.value.trim();
          if (v) { cat.items[i].name = v; save(); }
          inp.replaceWith(nameEl);
          nameEl.textContent = cat.items[i].name;
        };
        inp.addEventListener("blur", confirmEdit);
        inp.addEventListener("keydown", ev => {
          if (ev.key === "Enter") { ev.preventDefault(); inp.blur(); }
          if (ev.key === "Escape") { inp.removeEventListener("blur", confirmEdit); inp.replaceWith(nameEl); }
        });
        nameEl.replaceWith(inp);
        inp.focus();
        inp.select();
      });

      // Importance badge → dropdown to pick level
      const badge = el("button", { type: "button", class: `shopping-imp-badge shopping-imp-badge--${imp}` }, IMP_LABELS[imp]);
      badge.addEventListener("click", e => {
        e.stopPropagation();
        // Remove any open imp-dropdowns
        document.querySelectorAll(".imp-dropdown").forEach(d => d.remove());
        const drop = el("div", { class: "imp-dropdown" });
        IMP_ORDER.forEach(level => {
          const opt = el("button", { type: "button", class: `imp-dropdown-opt imp-dropdown-opt--${level}` }, IMP_LABELS[level]);
          opt.addEventListener("mousedown", ev => { ev.preventDefault(); ev.stopPropagation(); });
          opt.addEventListener("click", ev => {
            ev.stopPropagation();
            cat.items[i].importance = level;
            save(); render();
            drop.remove();
          });
          drop.appendChild(opt);
        });
        const r = badge.getBoundingClientRect();
        drop.style.top = (r.bottom + 4) + "px";
        drop.style.right = (window.innerWidth - r.right) + "px";
        document.body.appendChild(drop);
        setTimeout(() => {
          const close = ev => { if (!drop.contains(ev.target)) { drop.remove(); document.removeEventListener("click", close); } };
          document.addEventListener("click", close);
        }, 10);
      });

      row.append(cb, nameEl, badge);

      // Swipe-to-delete
      let swStartX = 0, swStartY = 0, swDx = 0, swDragging = false;
      row.addEventListener("touchstart", e => {
        swStartX = e.touches[0].clientX;
        swStartY = e.touches[0].clientY;
        swDx = 0; swDragging = true;
        row.style.transition = "none";
      }, { passive: true });
      row.addEventListener("touchmove", e => {
        if (!swDragging) return;
        const dx = e.touches[0].clientX - swStartX;
        const dy = e.touches[0].clientY - swStartY;
        if (Math.abs(dy) > Math.abs(dx) + 5) { swDragging = false; row.style.transform = ""; return; }
        if (dx >= 0) { row.style.transform = ""; return; }
        swDx = dx;
        row.style.transform = `translateX(${dx}px)`;
      }, { passive: true });
      row.addEventListener("touchend", () => {
        swDragging = false;
        const threshold = wrap.offsetWidth * 0.4 || 120;
        if (swDx < -threshold) {
          row.style.transition = "transform 0.22s ease-in";
          row.style.transform = "translateX(-110%)";
          setTimeout(() => { cat.items.splice(i, 1); save(); render(); }, 230);
        } else {
          row.style.transition = "transform 0.18s ease-out";
          row.style.transform = "";
          swDx = 0;
        }
      }, { passive: true });
      wrap.addEventListener("click", e => { if (Math.abs(swDx) > 8) { e.stopPropagation(); swDx = 0; } }, true);

      wrap.append(bg, row);
      body.appendChild(wrap);
    });

    const addRow = el("div", { class: "shopping-add-row", "data-cat-id": cat.id });
    const input = el("input", { type: "text", placeholder: "Adicionar item...", maxlength: "200" });
    const refocusAfterRender = () => {
      requestAnimationFrame(() => {
        const inp = document.querySelector(`.shopping-add-row[data-cat-id="${cat.id}"] input`);
        if (inp) inp.focus();
      });
    };
    const doAdd = (refocus = false) => {
      const v = input.value.trim();
      if (!v) return;
      cat.items.push({ id: uid(), name: v, checked: false, importance: "luxo" });
      input.value = "";
      if (!refocus) input.blur(); // dismiss keyboard before render
      save();
      render();
      if (refocus) {
        refocusAfterRender();
      } else {
        // Belt-and-suspenders: blur any input auto-focused by browser after render
        setTimeout(() => {
          const a = document.activeElement;
          if (a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA")) a.blur();
        }, 100);
      }
    };
    const addItemBtn = el("button", { type: "button", class: "ghost-btn" }, "+");
    addItemBtn.addEventListener("click", () => doAdd(false));
    // Wrap in form so mobile "Go/Enter" fires submit reliably (keydown is unreliable on mobile)
    const addForm = document.createElement("form");
    addForm.style.display = "contents";
    addForm.addEventListener("submit", e => { e.preventDefault(); doAdd(false); });
    addForm.append(input, addItemBtn);
    addRow.appendChild(addForm);
    body.appendChild(addRow);
    card.appendChild(body);
  }
  return card;
}

function activateItemEdit(cat, idx, row, checkboxEl) {
  // Replace row contents with: [color-dot][name-input][OK btn]
  row.innerHTML = "";

  const colorDot = el("button", { type: "button", class: "item-edit-color", title: "Editar cor da categoria" });
  colorDot.style.background = cat.color;
  colorDot.addEventListener("click", e => {
    e.stopPropagation();
    // Open cat modal for this category
    openCategoryModal(cat.id);
  });

  const nameInput = el("input", { type: "text", class: "shopping-item-input", value: cat.items[idx].name, maxlength: "200" });

  const okBtn = el("button", { type: "button", class: "primary-btn small-btn" }, "OK");
  const confirm = () => {
    const v = nameInput.value.trim();
    if (v) { cat.items[idx].name = v; save(); }
    render();
  };
  okBtn.addEventListener("click", confirm);
  nameInput.addEventListener("keydown", ev => {
    if (ev.key === "Enter") { ev.preventDefault(); confirm(); }
    if (ev.key === "Escape") { render(); }
  });

  row.append(colorDot, nameInput, okBtn);
  nameInput.focus();
  nameInput.select();
}

function openCategoryModal(id = null) {
  state.editingCategoryId = id;
  const isImp = id === "importantes";
  const cat = id && !isImp ? state.shopping.categories.find(c => c.id === id) : null;
  state.editingCategoryDraft = {
    name: isImp ? "Importantes" : (cat?.name || ""),
    color: isImp ? (state.shopping.importantes?.color || "#f2dada") : (cat?.color || TAG_COLORS[0])
  };
  document.getElementById("cat-modal-title").textContent = isImp ? "Cor dos Importantes" : (id ? "Editar categoria" : "Nova categoria");
  document.getElementById("cat-delete-btn").hidden = isImp ? true : !id;
  const nameInput = document.getElementById("cat-name");
  nameInput.value = state.editingCategoryDraft.name;
  nameInput.readOnly = isImp;
  renderCategoryColorGrid();
  document.getElementById("cat-modal").hidden = false;
}

function closeCategoryModal() {
  document.getElementById("cat-modal").hidden = true;
  state.editingCategoryId = null;
}

function renderCategoryColorGrid() {
  const grid = document.getElementById("cat-color-grid");
  grid.innerHTML = "";
  TAG_COLORS.forEach(c => {
    const b = el("button", { type: "button" });
    b.style.background = c;
    if (c === state.editingCategoryDraft.color) b.classList.add("selected");
    b.addEventListener("click", () => { state.editingCategoryDraft.color = c; renderCategoryColorGrid(); });
    grid.appendChild(b);
  });
}

function saveCategoryModal() {
  const isImp = state.editingCategoryId === "importantes";
  if (isImp) {
    if (state.shopping.importantes) state.shopping.importantes.color = state.editingCategoryDraft.color;
    save(); closeCategoryModal(); render(); return;
  }
  const name = document.getElementById("cat-name").value.trim();
  if (!name) { showToast("Informe um nome"); return; }
  let newId = null;
  if (state.editingCategoryId) {
    const cat = state.shopping.categories.find(c => c.id === state.editingCategoryId);
    if (cat) { cat.name = name; cat.color = state.editingCategoryDraft.color; }
  } else {
    newId = uid();
    state.shopping.categories.push({ id: newId, name, color: state.editingCategoryDraft.color, collapsed: true, items: [] });
  }
  save();
  closeCategoryModal();
  if (newId && state.catPickerContext === "add-item") {
    state.addItemDraft.categoryId = newId;
    updateCatSelectDisplay();
    closeCatPicker();
    state.catPickerContext = null;
  } else if (!document.getElementById("cat-picker-modal").hidden) {
    renderCatPickerList();
  }
  render();
}

function deleteCategoryModal() {
  if (!confirm("Excluir esta categoria e todos os seus itens?")) return;
  state.shopping.categories = state.shopping.categories.filter(c => c.id !== state.editingCategoryId);
  save();
  closeCategoryModal();
  if (!document.getElementById("cat-picker-modal").hidden) renderCatPickerList();
  render();
}

/* ===== Add-item modal ===== */

function openAddItemModal() {
  state.addItemDraft = { name: "", categoryId: state.shopping.categories[0]?.id || null };
  document.getElementById("add-item-name").value = "";
  updateCatSelectDisplay();
  document.getElementById("add-item-modal").hidden = false;
}

function closeAddItemModal() { document.getElementById("add-item-modal").hidden = true; }

function updateCatSelectDisplay() {
  const cat = state.shopping.categories.find(c => c.id === state.addItemDraft.categoryId);
  const btn = document.getElementById("cat-select-btn");
  if (btn) btn.textContent = cat ? cat.name : "Selecione uma categoria";
}

function saveAddItem() {
  const name = document.getElementById("add-item-name").value.trim();
  if (!name) { showToast("Informe o nome do item"); return; }
  if (!state.addItemDraft.categoryId) { showToast("Selecione uma categoria"); return; }
  const cat = state.shopping.categories.find(c => c.id === state.addItemDraft.categoryId);
  if (!cat) { showToast("Categoria não encontrada"); return; }
  cat.items.push({ id: uid(), name, checked: false });
  cat.collapsed = false;
  save();
  closeAddItemModal();
  render();
}

/* ===== Cat-picker modal ===== */

function openCatPicker(context) {
  state.catPickerContext = context;
  renderCatPickerList();
  document.getElementById("cat-picker-modal").hidden = false;
}

function closeCatPicker() {
  document.getElementById("cat-picker-modal").hidden = true;
  state.catPickerContext = null;
}

function renderCatPickerList() {
  const ul = document.getElementById("cat-picker-list");
  ul.innerHTML = "";
  if (!state.shopping.categories.length) {
    ul.appendChild(el("li", { class: "empty" }, "Nenhuma categoria ainda."));
    return;
  }
  state.shopping.categories.forEach(cat => {
    const li = el("li", { class: "cat-picker-row" });
    const sw = el("span", { class: "tag-swatch" });
    sw.style.background = cat.color;
    const nameEl = el("span", { class: "text" }, cat.name);
    li.append(sw, nameEl);
    li.addEventListener("click", () => {
      if (state.catPickerContext === "add-item") {
        state.addItemDraft.categoryId = cat.id;
        updateCatSelectDisplay();
        closeCatPicker();
      }
    });
    ul.appendChild(li);
  });
}

/* ===== Notes ===== */

function renderNotes(root) {
  root.className = "view view--scrollable";
  const notebooks = state.notes.notebooks;

  if (!notebooks.length) {
    root.appendChild(el("div", { class: "empty" }, "Nenhum caderno ainda. Crie um para começar."));
    return;
  }

  notebooks.forEach(nb => root.appendChild(renderNotebook(nb)));
}

function renderNotebook(nb) {
  const card = el("div", { class: "notebook-card" });
  card.style.setProperty("--nb-color", nb.color);
  card.style.setProperty("--nb-bg", hexToRgba(nb.color, 0.12));

  const hdr = el("div", { class: "notebook-hdr", "data-nb-id": nb.id, "data-expanded": nb.collapsed ? "0" : "1" });
  hdr.addEventListener("click", () => {
    nb.collapsed = !nb.collapsed;
    save();
    render();
  });

  // Long press = edit notebook
  let nbLp = null;
  hdr.addEventListener("touchstart", () => { nbLp = setTimeout(() => { nbLp = null; openNotebookModal(nb.id); }, 300); }, { passive: true });
  hdr.addEventListener("touchend", () => { clearTimeout(nbLp); nbLp = null; }, { passive: true });
  hdr.addEventListener("touchmove", () => { clearTimeout(nbLp); nbLp = null; }, { passive: true });

  const dot = el("span", { class: "notebook-dot" });
  dot.style.background = nb.color;
  const name = el("span", { class: "notebook-name" }, nb.name);

  const pages = state.notes.pages.filter(p => p.notebookId === nb.id);
  const count = el("span", { class: "shopping-cat-count" }, `${pages.length} pág.`);
  const toggle = el("span", { class: "shopping-cat-chevron" }, nb.collapsed ? "▶" : "▼");
  hdr.append(dot, name, count, toggle);
  card.appendChild(hdr);

  if (!nb.collapsed) {
    const body = el("div", { class: "notebook-body" });
    if (!pages.length) {
      body.appendChild(el("p", { class: "empty", style: "padding:12px;text-align:center" }, "Sem páginas."));
    } else {
      pages.forEach(page => {
        const wrap = el("div", { class: "swipe-delete-wrap" });
        const bg = el("div", { class: "swipe-delete-bg" });
        bg.innerHTML = '<span class="swipe-delete-icon" aria-hidden="true">🗑</span>';
        const row = el("div", { class: "page-row" });
        const pageInfo = el("div", { class: "page-info" });
        const nameSpan = el("span", { class: "page-name" }, page.name);
        nameSpan.style.color = nb.color;
        pageInfo.appendChild(nameSpan);
        const tmp = document.createElement("div");
        tmp.innerHTML = page.content || "";
        const rawText = (tmp.innerText || tmp.textContent || "").trim();
        const wordCount = rawText ? rawText.split(/\s+/).filter(Boolean).length : 0;
        const lineCount = wordCount ? Math.ceil(wordCount / 8) : 0;
        const meta = el("span", { class: "page-date" });
        const countStr = wordCount ? ` · ${lineCount} linha${lineCount !== 1 ? "s" : ""} · ${wordCount} palavra${wordCount !== 1 ? "s" : ""}` : "";
        if (page.updatedAt) {
          const d = new Date(page.updatedAt);
          meta.textContent = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) + countStr;
        } else if (wordCount) {
          meta.textContent = `${lineCount} linha${lineCount !== 1 ? "s" : ""} · ${wordCount} palavra${wordCount !== 1 ? "s" : ""}`;
        }
        if (meta.textContent) pageInfo.appendChild(meta);
        row.appendChild(pageInfo);
        row.addEventListener("click", () => openNotePage(page.id));

        let swStartX = 0, swStartY = 0, swDx = 0, swDragging = false;
        row.addEventListener("touchstart", e => {
          swStartX = e.touches[0].clientX; swStartY = e.touches[0].clientY;
          swDx = 0; swDragging = true; row.style.transition = "none";
        }, { passive: true });
        row.addEventListener("touchmove", e => {
          if (!swDragging) return;
          const dx = e.touches[0].clientX - swStartX;
          const dy = e.touches[0].clientY - swStartY;
          if (Math.abs(dy) > Math.abs(dx) + 5) { swDragging = false; row.style.transform = ""; return; }
          if (dx >= 0) { row.style.transform = ""; return; }
          swDx = dx;
          row.style.transform = `translateX(${dx}px)`;
        }, { passive: true });
        row.addEventListener("touchend", () => {
          swDragging = false;
          const threshold = wrap.offsetWidth * 0.4 || 120;
          if (swDx < -threshold) {
            row.style.transition = "transform 0.22s ease-in";
            row.style.transform = "translateX(-110%)";
            setTimeout(() => { state.notes.pages = state.notes.pages.filter(p => p.id !== page.id); save(); render(); }, 230);
          } else {
            row.style.transition = "transform 0.18s ease-out";
            row.style.transform = "";
            swDx = 0;
          }
        }, { passive: true });
        wrap.addEventListener("click", e => { if (Math.abs(swDx) > 8) { e.stopPropagation(); swDx = 0; } }, true);

        wrap.append(bg, row);
        body.appendChild(wrap);
      });
    }
    const addPageBtn = el("button", { type: "button", class: "ghost-btn", style: "width:100%;margin-top:8px;font-size:0.9rem" }, "+ Nova página");
    addPageBtn.addEventListener("click", e => { e.stopPropagation(); openNotePage(null, nb.id); });
    body.appendChild(addPageBtn);
    card.appendChild(body);
  }
  return card;
}

function openNotebookModal(id) {
  state.editingNotebookId = id;
  const nb = id ? state.notes.notebooks.find(n => n.id === id) : null;
  state.editingNotebookDraft = { name: nb?.name || "", color: nb?.color || TAG_COLORS[0] };
  document.getElementById("notebook-modal-title").textContent = id ? "Editar caderno" : "Novo caderno";
  document.getElementById("notebook-delete-btn").hidden = !id;
  document.getElementById("notebook-name").value = state.editingNotebookDraft.name;
  renderNotebookColorGrid();
  document.getElementById("notebook-modal").hidden = false;
}

function closeNotebookModal() {
  document.getElementById("notebook-modal").hidden = true;
  state.editingNotebookId = null;
}

function renderNotebookColorGrid() {
  const grid = document.getElementById("notebook-color-grid");
  grid.innerHTML = "";
  TAG_COLORS.forEach(c => {
    const b = el("button", { type: "button" });
    b.style.background = c;
    if (c === state.editingNotebookDraft.color) b.classList.add("selected");
    b.addEventListener("click", () => { state.editingNotebookDraft.color = c; renderNotebookColorGrid(); });
    grid.appendChild(b);
  });
}

function saveNotebookModal() {
  const name = document.getElementById("notebook-name").value.trim();
  if (!name) { showToast("Informe um nome"); return; }
  if (state.editingNotebookId) {
    const nb = state.notes.notebooks.find(n => n.id === state.editingNotebookId);
    if (nb) { nb.name = name; nb.color = state.editingNotebookDraft.color; }
  } else {
    state.notes.notebooks.push({ id: uid(), name, color: state.editingNotebookDraft.color, collapsed: false });
  }
  save();
  closeNotebookModal();
  render();
}

function deleteNotebookModal() {
  if (!confirm("Excluir este caderno e todas as suas páginas?")) return;
  const id = state.editingNotebookId;
  state.notes.notebooks = state.notes.notebooks.filter(n => n.id !== id);
  state.notes.pages = state.notes.pages.filter(p => p.notebookId !== id);
  save();
  closeNotebookModal();
  render();
}

function hexToRgbStr(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

let _selChangeHandler = null;

function setupColorTracking() {
  teardownColorTracking();
  const editor = document.getElementById("page-content-input");
  const colorDot = document.querySelector(".color-btn-dot");
  if (!editor || !colorDot) return;
  _selChangeHandler = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    if (!editor.contains(sel.getRangeAt(0).startContainer)) return;
    const raw = document.queryCommandValue("foreColor");
    const matched = EDITOR_COLORS.find(c => c.hex !== "default" && hexToRgbStr(c.hex) === raw);
    colorDot.style.color = matched ? matched.hex : "";
  };
  document.addEventListener("selectionchange", _selChangeHandler);
}

function teardownColorTracking() {
  if (_selChangeHandler) {
    document.removeEventListener("selectionchange", _selChangeHandler);
    _selChangeHandler = null;
  }
}

function openNotePage(pageId, notebookId = null) {
  state.editingPageId = pageId;
  const page = pageId ? state.notes.pages.find(p => p.id === pageId) : null;
  document.getElementById("page-title-input").value = page?.name || "";
  const editor = document.getElementById("page-content-input");
  editor.innerHTML = page?.content || "";
  document.getElementById("notes-page-modal").dataset.notebookId = notebookId || page?.notebookId || "";
  document.getElementById("notes-page-modal").hidden = false;
  // Reset color dot and close picker
  const picker = document.querySelector(".page-tool-color-picker");
  if (picker) picker.hidden = true;
  const colorDot = document.querySelector(".color-btn-dot");
  if (colorDot) colorDot.style.color = "";
  setupPageSaveFab();
  setupColorTracking();
}

function closeNotePage() {
  document.getElementById("notes-page-modal").hidden = true;
  state.editingPageId = null;
  teardownPageSaveFab();
  teardownColorTracking();
}

let _pageSaveFabVVListener = null;

function setupPageSaveFab() {
  const fab = document.getElementById("page-save-fab");
  if (!fab) return;
  fab.style.display = "flex";
  if (window.visualViewport) {
    _pageSaveFabVVListener = () => {
      const vh = window.visualViewport.height;
      const keyboardOpen = vh < window.innerHeight * 0.75;
      fab.style.display = keyboardOpen ? "none" : "flex";
      // Shrink modal to visible area so header+toolbar stay at top
      const modalContent = document.querySelector(".notes-page-content");
      if (modalContent) modalContent.style.height = Math.round(vh) + "px";
    };
    window.visualViewport.addEventListener("resize", _pageSaveFabVVListener);
  }
}

function teardownPageSaveFab() {
  const fab = document.getElementById("page-save-fab");
  if (fab) fab.style.display = "none";
  // Reset modal height to CSS default
  const modalContent = document.querySelector(".notes-page-content");
  if (modalContent) modalContent.style.height = "";
  if (_pageSaveFabVVListener && window.visualViewport) {
    window.visualViewport.removeEventListener("resize", _pageSaveFabVVListener);
    _pageSaveFabVVListener = null;
  }
}

/* page preview removed — editor is always active */

function saveNotePage() {
  const name = document.getElementById("page-title-input").value.trim() || "Sem título";
  const content = document.getElementById("page-content-input").innerHTML;
  const notebookId = document.getElementById("notes-page-modal").dataset.notebookId;

  if (state.editingPageId) {
    const page = state.notes.pages.find(p => p.id === state.editingPageId);
    if (page) { page.name = name; page.content = content; page.updatedAt = new Date().toISOString(); }
  } else {
    if (!notebookId) { showToast("Caderno não encontrado"); return; }
    state.notes.pages.push({ id: uid(), notebookId, name, content, updatedAt: new Date().toISOString() });
  }
  save();
  closeNotePage();
  if (state.view === "notes") render();
  showToast("Página salva");
}

function deleteNotePage() {
  if (!state.editingPageId) return;
  if (!confirm("Excluir esta página?")) return;
  state.notes.pages = state.notes.pages.filter(p => p.id !== state.editingPageId);
  save();
  closeNotePage();
  if (state.view === "notes") render();
}

function renderMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings (process before line breaks)
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Lists: consecutive lines starting with - become <ul><li>
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>(\n|$))+/g, match => "<ul>" + match.replace(/\n$/, "") + "</ul>");

  // Inline
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Line breaks (skip inside tags)
  html = html.replace(/(?<![>])\n/g, "<br>");

  return html;
}

/* ===== To-do list in notes editor ===== */

function insertTodoList() {
  const editor = document.getElementById("page-content-input");
  if (!editor) return;
  editor.focus();
  document.execCommand("insertHTML", false,
    '<ul class="todo-list"><li><span class="todo-check" contenteditable="false">☐</span>&nbsp;</li></ul>'
  );
}

function setupTodoCheckboxes(editor) {
  // Toggle checkbox on click
  editor.addEventListener("click", e => {
    const check = e.target.closest(".todo-check");
    if (!check) return;
    e.preventDefault();
    const done = check.textContent === "☑";
    check.textContent = done ? "☐" : "☑";
    check.closest("li")?.classList.toggle("todo-done", !done);
  });

  // Enter in todo-list li creates a new checkbox item
  editor.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const node = sel.anchorNode;
    const el = node.nodeType === 3 ? node.parentElement : node;
    const li = el.closest?.("li");
    if (!li?.closest(".todo-list")) return;
    e.preventDefault();
    const newLi = document.createElement("li");
    const check = document.createElement("span");
    check.className = "todo-check";
    check.textContent = "☐";
    const nbsp = document.createTextNode(" ");
    newLi.append(check, nbsp);
    li.after(newLi);
    const range = document.createRange();
    range.setStart(nbsp, 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  });
}

/* ===== Notes page toolbar ===== */

let _dictRec = null;
let _dictText = "";
let _dictBtn = null;
let _dictRange = null;

function startDictation(btn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast("Reconhecimento de voz não suportado neste navegador"); return; }

  // Second tap: stop and insert
  if (_dictRec) {
    _dictRec.stop();
    return;
  }

  const editor = document.getElementById("page-content-input");
  const sel = window.getSelection();
  _dictRange = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
  _dictText = "";
  _dictBtn = btn;

  const rec = new SR();
  rec.lang = "pt-BR";
  rec.interimResults = false;
  rec.continuous = true;
  rec.maxAlternatives = 1;
  _dictRec = rec;

  btn.classList.add("page-tool-btn--mic-active");

  rec.onresult = e => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) _dictText += e.results[i][0].transcript;
    }
  };

  rec.onerror = () => {
    _dictRec = null;
    btn.classList.remove("page-tool-btn--mic-active");
  };

  rec.onend = () => {
    _dictRec = null;
    btn.classList.remove("page-tool-btn--mic-active");
    const text = _dictText.trim();
    if (text && editor) {
      editor.focus();
      if (_dictRange) {
        const s = window.getSelection();
        s.removeAllRanges();
        s.addRange(_dictRange);
      }
      document.execCommand("insertText", false, text);
    }
    _dictText = "";
    _dictRange = null;
    _dictBtn = null;
  };

  rec.start();
}

const EDITOR_COLORS = [
  { hex: "default", label: "Padrão" },
  { hex: "#d47878", label: "Vermelho" },
  { hex: "#6a9ec8", label: "Azul" },
  { hex: "#68b888", label: "Verde" },
  { hex: "#c8a040", label: "Amarelo" },
];

function setupPageToolbar() {
  const toolbar = document.querySelector(".page-toolbar");
  if (!toolbar) return;
  const picker = toolbar.querySelector(".page-tool-color-picker");
  const colorDot = toolbar.querySelector(".color-btn-dot");

  function hidePicker() { picker.hidden = true; }

  function applyColor(hex) {
    const editor = document.getElementById("page-content-input");
    if (editor) editor.focus();
    if (hex === "default") {
      // reset to computed text color to avoid removing bold/italic
      const textColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim() || "#2d3a3a";
      document.execCommand("styleWithCSS", false, true);
      document.execCommand("foreColor", false, textColor);
      document.execCommand("styleWithCSS", false, false);
    } else {
      document.execCommand("foreColor", false, hex);
    }
    if (colorDot) colorDot.style.color = hex === "default" ? "" : hex;
    hidePicker();
  }

  // Build swatches (picker starts hidden)
  EDITOR_COLORS.forEach(({ hex, label }) => {
    const b = el("button", { type: "button", class: "page-tool-color-swatch", title: label });
    if (hex === "default") {
      b.classList.add("page-tool-color-swatch--default");
    } else {
      b.style.background = hex;
    }
    // mousedown = desktop (prevent blur of editor)
    b.addEventListener("mousedown", e => { e.preventDefault(); applyColor(hex); });
    // touchend = mobile (prevent ghost click, prevent blur)
    b.addEventListener("touchstart", e => { e.preventDefault(); }, { passive: false });
    b.addEventListener("touchend", e => { e.preventDefault(); applyColor(hex); });
    picker.appendChild(b);
  });

  function showPicker(colorBtn) {
    const r = colorBtn.getBoundingClientRect();
    picker.style.top = (r.bottom + 4) + "px";
    picker.style.left = Math.max(4, r.left) + "px";
    picker.hidden = false;
  }

  toolbar.querySelectorAll("[data-action]").forEach(btn => {
    if (btn.dataset.action === "mic") {
      // mic: click only (touch already handled via touchend+preventDefault above)
      btn.addEventListener("click", () => startDictation(btn));
    } else {
      btn.addEventListener("mousedown", e => {
        e.preventDefault();
        const action = btn.dataset.action;
        if (action === "color") {
          if (picker.hidden) showPicker(btn); else hidePicker();
          return;
        }
        hidePicker();
        switch (action) {
          case "bold": document.execCommand("bold"); break;
          case "italic": document.execCommand("italic"); break;
          case "title": {
            const block = document.queryCommandValue("formatBlock").toLowerCase();
            document.execCommand("formatBlock", false, block === "h1" ? "p" : "h1");
            break;
          }
          case "list": document.execCommand("insertUnorderedList"); break;
          case "todo": insertTodoList(); break;
          case "undo": document.execCommand("undo"); break;
        }
      });
    }
    // touch support for non-color buttons
    if (btn.dataset.action !== "color") {
      btn.addEventListener("touchstart", e => { e.preventDefault(); }, { passive: false });
      btn.addEventListener("touchend", e => {
        e.preventDefault();
        const action = btn.dataset.action;
        hidePicker();
        switch (action) {
          case "bold": document.execCommand("bold"); break;
          case "italic": document.execCommand("italic"); break;
          case "title": {
            const block = document.queryCommandValue("formatBlock").toLowerCase();
            document.execCommand("formatBlock", false, block === "h1" ? "p" : "h1");
            break;
          }
          case "list": document.execCommand("insertUnorderedList"); break;
          case "todo": insertTodoList(); break;
          case "undo": document.execCommand("undo"); break;
          case "mic": startDictation(btn); break;
        }
      });
    } else {
      // color button touch
      btn.addEventListener("touchstart", e => { e.preventDefault(); }, { passive: false });
      btn.addEventListener("touchend", e => {
        e.preventDefault();
        if (picker.hidden) showPicker(btn); else hidePicker();
      });
    }
  });

  // Close picker on interaction outside
  document.addEventListener("mousedown", e => {
    if (!picker.hidden && !toolbar.contains(e.target) && !picker.contains(e.target)) hidePicker();
  });
  document.addEventListener("touchstart", e => {
    if (!picker.hidden && !toolbar.contains(e.target) && !picker.contains(e.target)) hidePicker();
  }, { passive: true });
}

/* ===== Animations ===== */

function playBurst(anchor) {
  const r = anchor.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const colors = ["#8ec9c1", "#b3d9c9", "#c8d8b0", "#e8c4a0", "#e8a8a0", "#c8b0d8"];
  const N = 14;
  for (let i = 0; i < N; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = (cx - 4) + "px";
    p.style.top = (cy - 4) + "px";
    p.style.background = colors[i % colors.length];
    const ang = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const dist = 38 + Math.random() * 38;
    p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
    p.style.setProperty("--dy", Math.sin(ang) * dist + "px");
    p.style.animation = "burst 0.65s forwards ease-out";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 720);
  }
}

/* ===== Complete / Renew ===== */

async function toggleComplete(id) {
  const t = state.tasks.find(x => x.id === id);
  if (!t) return;

  if (t.type === "oneoff" && t.completed) {
    t.completed = false;
    t.completedAt = null;
    save();
    render();
    return;
  }

  const card = document.querySelector(`[data-task-id="${id}"]`);
  if (card) {
    const cb = card.querySelector(".task-checkbox");
    if (cb) playBurst(cb);
    card.classList.add("completing");
    await sleep(440);
  }

  if (t.type === "oneoff") {
    t.completed = true;
    t.completedAt = new Date().toISOString();
    save();
    render();
  } else {
    state.pendingRenewIds.add(id);
    state.pendingRenew = { taskId: id };
    const suggested = addInterval(todayISO(), t.intervalAmount, t.intervalUnit);
    document.getElementById("renew-text").textContent =
      `"${t.title}" feita hoje. Próxima sugerida: ${fmtDateBR(suggested)}.`;
    document.getElementById("renew-date").value = suggested;
    document.getElementById("renew-modal").hidden = false;
    render();
  }
}

function confirmRenew() {
  const { taskId } = state.pendingRenew || {};
  const t = state.tasks.find(x => x.id === taskId);
  if (!t) return;
  const newDate = document.getElementById("renew-date").value;
  if (!newDate) { showToast("Escolha uma data"); return; }
  t.lastCompleted = new Date().toISOString();
  t.completionCount = (t.completionCount || 0) + 1;
  t.nextDue = newDate;
  state.pendingRenewIds.delete(taskId);
  state.pendingRenew = null;
  document.getElementById("renew-modal").hidden = true;
  save();
  render();
  showToast("Rotina renovada");
  scheduleNotifications();
}

function skipRenew() {
  const { taskId } = state.pendingRenew || {};
  if (!taskId) return;
  if (!confirm("Excluir esta rotina? Para tê-la de volta, será preciso recriar.")) return;
  state.tasks = state.tasks.filter(x => x.id !== taskId);
  state.pendingRenewIds.delete(taskId);
  state.pendingRenew = null;
  document.getElementById("renew-modal").hidden = true;
  save();
  render();
  showToast("Rotina excluída");
  scheduleNotifications();
}

function cancelRenew() {
  if (state.pendingRenew) state.pendingRenewIds.delete(state.pendingRenew.taskId);
  state.pendingRenew = null;
  document.getElementById("renew-modal").hidden = true;
  render();
}

/* ===== Quick date editor ===== */

function openQuickDate(taskId) {
  const t = state.tasks.find(x => x.id === taskId);
  if (!t) return;
  state.editingDateTaskId = taskId;
  const cur = t.type === "oneoff" ? t.deadline : t.nextDue;
  document.getElementById("quick-date-input").value = cur || "";
  document.getElementById("quick-date-modal").hidden = false;
}
function closeQuickDate() {
  document.getElementById("quick-date-modal").hidden = true;
  state.editingDateTaskId = null;
}
function quickDateSave() {
  const t = state.tasks.find(x => x.id === state.editingDateTaskId);
  if (!t) return;
  const v = document.getElementById("quick-date-input").value || null;
  if (t.type === "oneoff") t.deadline = v;
  else {
    if (!v) { showToast("Rotina precisa de data"); return; }
    t.nextDue = v;
  }
  save();
  closeQuickDate();
  render();
  showToast("Data atualizada");
  scheduleNotifications();
}
function quickDateClear() {
  const t = state.tasks.find(x => x.id === state.editingDateTaskId);
  if (!t) return;
  if (t.type === "oneoff") t.deadline = null;
  else { showToast("Rotina não pode ficar sem data"); return; }
  save();
  closeQuickDate();
  render();
}

/* ===== Task modal ===== */

function openTaskModal(id = null) {
  state.editingId = id;
  const t = id ? state.tasks.find(x => x.id === id) : null;
  document.getElementById("modal-title").textContent = t ? "Editar tarefa" : "Nova tarefa";
  document.getElementById("delete-btn").hidden = !t;
  document.getElementById("title").value = t?.title || "";
  document.getElementById("description").value = t?.description || "";

  const type = t?.type || "oneoff";
  document.querySelector(`input[name="type"][value="${type}"]`).checked = true;
  toggleTypeFields(type);

  document.getElementById("deadline").value = t?.deadline || "";
  state.draftSubtasks = t?.subtasks ? JSON.parse(JSON.stringify(t.subtasks)) : [];
  renderSubtasks();

  document.getElementById("routine-next").value = t?.nextDue || todayISO();
  document.getElementById("interval-amount").value = t?.intervalAmount || 1;
  document.getElementById("interval-unit").value = t?.intervalUnit || "weeks";

  const imp = t?.importance || 2;
  document.querySelector(`input[name="importance"][value="${imp}"]`).checked = true;

  state.draftNotifications = t?.notifications ? JSON.parse(JSON.stringify(t.notifications)) : [];
  const hasNotif = state.draftNotifications.length > 0;
  document.querySelector(`input[name="notif-enabled"][value="${hasNotif ? "yes" : "no"}"]`).checked = true;
  document.getElementById("notif-details").hidden = !hasNotif;
  renderNotifications();

  state.draftTagIds = t?.tags ? [...t.tags] : [];
  renderTagSelector();

  document.getElementById("mic-status").textContent = "";
  document.getElementById("modal").hidden = false;
}

function closeTaskModal() {
  document.getElementById("modal").hidden = true;
  state.editingId = null;
}

function toggleTypeFields(type) {
  document.getElementById("oneoff-fields").hidden = type !== "oneoff";
  document.getElementById("routine-fields").hidden = type !== "routine";
}

function renderSubtasks() {
  const ul = document.getElementById("subtasks-list");
  ul.innerHTML = "";
  state.draftSubtasks.forEach((s, i) => {
    const li = el("li", { class: s.completed ? "done" : "" });
    const cb = el("input", { type: "checkbox" });
    cb.checked = !!s.completed;
    cb.addEventListener("change", () => { state.draftSubtasks[i].completed = cb.checked; renderSubtasks(); });
    const span = el("span", { class: "text", style: "cursor:pointer" }, s.title);
    span.addEventListener("click", e => {
      e.stopPropagation();
      const input = el("input", { type: "text", class: "subtask-inline-input", value: s.title, maxlength: "200" });
      const confirm = () => {
        const v = input.value.trim();
        if (v) state.draftSubtasks[i].title = v;
        renderSubtasks();
      };
      input.addEventListener("blur", confirm);
      input.addEventListener("keydown", ev => {
        if (ev.key === "Enter") { ev.preventDefault(); confirm(); }
        if (ev.key === "Escape") { renderSubtasks(); }
      });
      span.replaceWith(input);
      input.focus();
      input.select();
    });
    const rm = el("button", { type: "button", class: "remove-btn" }, "×");
    rm.addEventListener("click", () => { state.draftSubtasks.splice(i, 1); renderSubtasks(); });
    li.append(cb, span, rm);
    ul.appendChild(li);
  });
}

function renderNotifications() {
  const ul = document.getElementById("notifications-list");
  ul.innerHTML = "";
  state.draftNotifications.forEach((n, i) => {
    const li = el("li");
    const span = el("span", { class: "text" }, notificationLabel(n));
    const rm = el("button", { type: "button", class: "remove-btn" }, "×");
    rm.addEventListener("click", () => { state.draftNotifications.splice(i, 1); renderNotifications(); });
    li.append(span, rm);
    ul.appendChild(li);
  });
}

function notificationLabel(n) {
  const map = {
    hours: ["hora", "horas"],
    days: ["dia", "dias"],
    weeks: ["semana", "semanas"],
    months: ["mês", "meses"],
    years: ["ano", "anos"]
  };
  const [s, p] = map[n.unit] || ["", ""];
  if (n.amount === 0) return "No dia";
  return `${n.amount} ${n.amount === 1 ? s : p} antes`;
}

function renderTagSelector() {
  const wrap = document.getElementById("task-tags");
  wrap.innerHTML = "";
  state.tags.forEach(tag => {
    const lbl = el("label");
    const input = el("input", { type: "checkbox", value: tag.id });
    input.checked = state.draftTagIds.includes(tag.id);
    input.addEventListener("change", () => {
      if (input.checked) state.draftTagIds.push(tag.id);
      else state.draftTagIds = state.draftTagIds.filter(id => id !== tag.id);
    });
    const span = el("span", {}, tag.name);
    span.style.background = tag.color;
    lbl.append(input, span);
    wrap.appendChild(lbl);
  });
  if (!state.tags.length) {
    wrap.appendChild(el("p", { class: "hint" }, 'Nenhuma tag. Crie em "Gerenciar tags".'));
  }
}

function readForm() {
  const title = document.getElementById("title").value.trim();
  if (!title) { showToast("Informe um título"); return null; }
  const description = document.getElementById("description").value.trim();
  const type = document.querySelector('input[name="type"]:checked').value;
  const importance = Number(document.querySelector('input[name="importance"]:checked').value);

  const existing = state.editingId ? state.tasks.find(t => t.id === state.editingId) : null;
  const base = {
    id: existing?.id || uid(),
    title, description, type, importance,
    tags: state.draftTagIds.slice(),
    notifications: document.querySelector('input[name="notif-enabled"]:checked')?.value === "yes"
      ? state.draftNotifications.slice()
      : [],
    completed: existing?.completed || false,
    completedAt: existing?.completedAt || null,
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
  if (type === "oneoff") {
    base.deadline = document.getElementById("deadline").value || null;
    base.subtasks = state.draftSubtasks.slice();
  } else {
    base.nextDue = document.getElementById("routine-next").value || todayISO();
    base.intervalAmount = Math.max(1, Number(document.getElementById("interval-amount").value) || 1);
    base.intervalUnit = document.getElementById("interval-unit").value;
    base.lastCompleted = existing?.lastCompleted || null;
    base.completionCount = existing?.completionCount || 0;
  }
  return base;
}

function saveTask(e) {
  e.preventDefault();
  const t = readForm();
  if (!t) return;
  const idx = state.tasks.findIndex(x => x.id === t.id);
  if (idx >= 0) state.tasks[idx] = t;
  else state.tasks.push(t);
  save();
  closeTaskModal();
  render();
  showToast("Tarefa salva");
  scheduleNotifications();
}

function deleteTask() {
  if (!state.editingId) return;
  if (!confirm("Excluir esta tarefa?")) return;
  state.tasks = state.tasks.filter(t => t.id !== state.editingId);
  save();
  closeTaskModal();
  render();
  showToast("Tarefa excluída");
}

/* ===== Tags management ===== */

function openTagsModal() {
  renderTagsManageList();
  document.getElementById("tags-modal").hidden = false;
}
function closeTagsModal() { document.getElementById("tags-modal").hidden = true; }

function renderTagsManageList() {
  const ul = document.getElementById("tags-manage-list");
  ul.innerHTML = "";
  state.tags.forEach(tag => {
    const li = el("li");
    const sw = el("span", { class: "tag-swatch" });
    sw.style.background = tag.color;
    li.append(sw, el("span", { class: "text" }, tag.name), el("span", { class: "hint" }, "editar"));
    li.addEventListener("click", () => openTagEdit(tag.id));
    ul.appendChild(li);
  });
}

function addNewTag() {
  if (state.tags.length >= 16) { showToast("Limite de 16 tags"); return; }
  const input = document.getElementById("new-tag-name");
  const name = input.value.trim();
  if (!name) return;
  const used = new Set(state.tags.map(t => t.color));
  const color = TAG_COLORS.find(c => !used.has(c)) || TAG_COLORS[state.tags.length % 16];
  state.tags.push({ id: uid(), name, color });
  input.value = "";
  save();
  renderTagsManageList();
  if (!document.getElementById("modal").hidden) renderTagSelector();
  if (state.view === "home") render();
}

function openTagEdit(id) {
  const tag = tagById(id);
  if (!tag) return;
  state.editingTagId = id;
  state.editingTagDraft = { name: tag.name, color: tag.color };
  document.getElementById("tag-edit-name").value = tag.name;
  renderTagColorGrid();
  document.getElementById("tag-edit-modal").hidden = false;
}
function closeTagEdit() {
  document.getElementById("tag-edit-modal").hidden = true;
  state.editingTagId = null;
}
function renderTagColorGrid() {
  const grid = document.getElementById("tag-color-grid");
  grid.innerHTML = "";
  TAG_COLORS.forEach(c => {
    const b = el("button", { type: "button" });
    b.style.background = c;
    if (c === state.editingTagDraft.color) b.classList.add("selected");
    b.addEventListener("click", () => { state.editingTagDraft.color = c; renderTagColorGrid(); });
    grid.appendChild(b);
  });
}
function saveTagEdit() {
  const tag = tagById(state.editingTagId);
  if (!tag) return;
  const name = document.getElementById("tag-edit-name").value.trim();
  if (!name) { showToast("Nome obrigatório"); return; }
  tag.name = name;
  tag.color = state.editingTagDraft.color;
  save();
  closeTagEdit();
  renderTagsManageList();
  if (!document.getElementById("modal").hidden) renderTagSelector();
  render();
}
function deleteTagEdit() {
  if (!confirm("Excluir tag? Será removida das tarefas.")) return;
  state.tasks.forEach(t => { t.tags = (t.tags || []).filter(id => id !== state.editingTagId); });
  state.tags = state.tags.filter(t => t.id !== state.editingTagId);
  save();
  closeTagEdit();
  renderTagsManageList();
  if (!document.getElementById("modal").hidden) renderTagSelector();
  render();
}

/* ===== Per-task tag selector ===== */

function openTaskTagsSelector(taskId) {
  state.editingTagsTaskId = taskId;
  document.getElementById("new-task-tag").value = "";
  renderTaskTagsSelectorList();
  document.getElementById("tag-select-modal").hidden = false;
}

function closeTaskTagsSelector() {
  document.getElementById("tag-select-modal").hidden = true;
  state.editingTagsTaskId = null;
}

function renderTaskTagsSelectorList() {
  const t = state.tasks.find(x => x.id === state.editingTagsTaskId);
  const wrap = document.getElementById("tag-select-list");
  wrap.innerHTML = "";
  if (!t) return;
  const taskTags = new Set(t.tags || []);
  state.tags.forEach(tag => {
    const lbl = el("label");
    const input = el("input", { type: "checkbox", value: tag.id });
    input.checked = taskTags.has(tag.id);
    input.addEventListener("change", () => {
      const cur = state.tasks.find(x => x.id === state.editingTagsTaskId);
      if (!cur) return;
      cur.tags = cur.tags || [];
      if (input.checked) {
        if (!cur.tags.includes(tag.id)) cur.tags.push(tag.id);
      } else {
        cur.tags = cur.tags.filter(id => id !== tag.id);
      }
      save();
      render();
    });
    const span = el("span", {}, tag.name);
    span.style.background = tag.color;
    lbl.append(input, span);
    wrap.appendChild(lbl);
  });
  if (!state.tags.length) {
    wrap.appendChild(el("p", { class: "hint" }, "Nenhuma tag. Crie uma abaixo."));
  }
}

function createTaskTag() {
  if (state.tags.length >= 16) { showToast("Limite de 16 tags"); return; }
  const input = document.getElementById("new-task-tag");
  const name = input.value.trim();
  if (!name) return;
  const used = new Set(state.tags.map(t => t.color));
  const color = TAG_COLORS.find(c => !used.has(c)) || TAG_COLORS[state.tags.length % 16];
  const newTag = { id: uid(), name, color };
  state.tags.push(newTag);
  const t = state.tasks.find(x => x.id === state.editingTagsTaskId);
  if (t) { t.tags = t.tags || []; t.tags.push(newTag.id); }
  input.value = "";
  save();
  renderTaskTagsSelectorList();
  render();
}

/* ===== Audio parser ===== */

const NUM_WORDS = { um:1, uma:1, dois:2, duas:2, "três":3, tres:3, quatro:4, cinco:5, seis:6, sete:7, oito:8, nove:9, dez:10 };
function wordToNum(w) { return Number(w) || NUM_WORDS[w.toLowerCase()] || 1; }
function unitMap(s) {
  s = s.toLowerCase();
  if (s.startsWith("dia")) return "days";
  if (s.startsWith("semana")) return "weeks";
  if (s.startsWith("mês") || s.startsWith("mes") || s.startsWith("meses")) return "months";
  if (s.startsWith("ano")) return "years";
  return "weeks";
}

const WEEKDAY_MAP = {
  "domingo":0,"segunda":1,"segunda-feira":1,"terça":2,"terca":2,"terça-feira":2,
  "quarta":3,"quarta-feira":3,"quinta":4,"quinta-feira":4,"sexta":5,"sexta-feira":5,
  "sábado":6,"sabado":6
};

function parseSpeech(text) {
  const lower = text.toLowerCase();
  const result = {
    title: text, description: "",
    type: "oneoff", importance: 2,
    intervalAmount: 1, intervalUnit: "weeks",
    deadline: null, nextDue: null,
    subtasks: []
  };
  const consumed = [];

  if (/\b(urgent[ie]|cr[ií]tic[oa])\b/.test(lower)) { result.importance = 4; consumed.push(/\b(urgente|cr[ií]tic[oa])\b/gi); }
  else if (/\b(importante|priorit[áa]ri[oa]|alta prioridade)\b/.test(lower)) { result.importance = 3; consumed.push(/\b(importante|priorit[áa]ri[oa]|alta prioridade)\b/gi); }
  else if (/\b(tranquil[oa]|sem pressa|qualquer hora|baixa prioridade)\b/.test(lower)) { result.importance = 1; consumed.push(/\b(tranquil[oa]|sem pressa|qualquer hora|baixa prioridade)\b/gi); }

  let m = lower.match(/a cada\s+(\d+|um|uma|dois|duas|tr[eê]s|quatro|cinco|seis|sete|oito|nove|dez)\s+(dias?|semanas?|m[eê]s(?:es)?|anos?)/);
  if (m) {
    result.type = "routine";
    result.intervalAmount = wordToNum(m[1]);
    result.intervalUnit = unitMap(m[2]);
    consumed.push(/a cada\s+(\d+|um|uma|dois|duas|tr[eê]s|quatro|cinco|seis|sete|oito|nove|dez)\s+(dias?|semanas?|m[eê]s(?:es)?|anos?)/gi);
  } else if (/\b(todo dia|todos os dias|diariamente|diári[oa])\b/.test(lower)) {
    result.type = "routine"; result.intervalAmount = 1; result.intervalUnit = "days";
    consumed.push(/\b(todo dia|todos os dias|diariamente|diári[oa])\b/gi);
  } else if (/\b(toda semana|semanalmente|semanal)\b/.test(lower)) {
    result.type = "routine"; result.intervalAmount = 1; result.intervalUnit = "weeks";
    consumed.push(/\b(toda semana|semanalmente|semanal)\b/gi);
  } else if (/\b(todo m[eê]s|mensalmente|mensal)\b/.test(lower)) {
    result.type = "routine"; result.intervalAmount = 1; result.intervalUnit = "months";
    consumed.push(/\b(todo m[eê]s|mensalmente|mensal)\b/gi);
  } else if (/\b(todo ano|anualmente|anual)\b/.test(lower)) {
    result.type = "routine"; result.intervalAmount = 1; result.intervalUnit = "years";
    consumed.push(/\b(todo ano|anualmente|anual)\b/gi);
  }

  const today = new Date();
  let pickedDate = null;
  if (/\bdepois de amanh[ãa]\b/.test(lower)) {
    const d = new Date(today); d.setDate(d.getDate() + 2); pickedDate = ymd(d);
    consumed.push(/\bdepois de amanh[ãa]\b/gi);
  } else if (/\bamanh[ãa]\b/.test(lower)) {
    const d = new Date(today); d.setDate(d.getDate() + 1); pickedDate = ymd(d);
    consumed.push(/\bamanh[ãa]\b/gi);
  } else if (/\bhoje\b/.test(lower)) {
    pickedDate = ymd(today);
    consumed.push(/\bhoje\b/gi);
  } else {
    const wd = lower.match(/\b(domingo|segunda(?:-feira)?|ter[çc]a(?:-feira)?|quarta(?:-feira)?|quinta(?:-feira)?|sexta(?:-feira)?|s[áa]bado)\b/);
    if (wd) {
      const target = WEEKDAY_MAP[wd[1].replace("-feira","")] ?? WEEKDAY_MAP[wd[1]];
      if (target != null) {
        const d = new Date(today);
        const diff = (target + 7 - d.getDay()) % 7 || 7;
        d.setDate(d.getDate() + diff);
        pickedDate = ymd(d);
        consumed.push(new RegExp(`\\b${wd[1]}\\b`, "gi"));
      }
    }
    const dm = lower.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    if (!pickedDate && dm) {
      const day = Number(dm[1]); const mon = Number(dm[2]) - 1;
      let yr = dm[3] ? Number(dm[3]) : today.getFullYear();
      if (yr < 100) yr += 2000;
      const d = new Date(yr, mon, day);
      if (d < today && !dm[3]) d.setFullYear(yr + 1);
      pickedDate = ymd(d);
      consumed.push(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/g);
    }
    const dn = lower.match(/\bdia (\d{1,2})\b/);
    if (!pickedDate && dn) {
      const day = Number(dn[1]);
      const d = new Date(today);
      d.setDate(day);
      if (d < today) d.setMonth(d.getMonth() + 1);
      pickedDate = ymd(d);
      consumed.push(/\bdia \d{1,2}\b/gi);
    }
  }

  if (pickedDate) {
    if (result.type === "routine") result.nextDue = pickedDate;
    else result.deadline = pickedDate;
  }

  let clean = text;
  consumed.forEach(rx => { clean = clean.replace(rx, " "); });
  clean = clean.replace(/\s+/g, " ").replace(/\s+([,.;!?])/g, "$1").trim();
  clean = clean.replace(/^(de\s+|para\s+|às\s+|as\s+|no\s+|na\s+|em\s+)/i, "").trim();
  if (clean) clean = clean.charAt(0).toUpperCase() + clean.slice(1);

  const subSep = clean.match(/(.+?)(?:\bpassos?:?\s*|\bpreciso:?\s*)(.+)/i);
  let titlePart = clean;
  let subPart = "";
  if (subSep) { titlePart = subSep[1].trim().replace(/[,;:]+$/, ""); subPart = subSep[2]; }
  if (subPart) {
    const parts = subPart.split(/(?:\s+e depois\s+|;\s+|\s+ent[ãa]o\s+|,\s+)/i).map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) result.subtasks = parts.map(p => ({ id: uid(), title: capFirst(p), completed: false }));
    else result.description = capFirst(subPart.trim());
  }

  result.title = (titlePart || text).slice(0, 200);
  return result;
}

function capFirst(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function applyParsed(p) {
  document.getElementById("title").value = p.title;
  if (p.description) document.getElementById("description").value = p.description;
  document.querySelector(`input[name="type"][value="${p.type}"]`).checked = true;
  toggleTypeFields(p.type);
  if (p.type === "oneoff") {
    if (p.deadline) document.getElementById("deadline").value = p.deadline;
  } else {
    document.getElementById("routine-next").value = p.nextDue || todayISO();
    document.getElementById("interval-amount").value = p.intervalAmount;
    document.getElementById("interval-unit").value = p.intervalUnit;
  }
  document.querySelector(`input[name="importance"][value="${p.importance}"]`).checked = true;
  if (p.subtasks.length) {
    state.draftSubtasks = p.subtasks;
    renderSubtasks();
  }
}

/* ===== Speech ===== */

function setupSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn = document.getElementById("mic-btn");
  const status = document.getElementById("mic-status");
  const setStatus = t => { if (status) status.textContent = t; };
  if (!SR) {
    micBtn.disabled = true;
    setStatus("Voz indisponível neste navegador");
    return;
  }
  const rec = new SR();
  rec.lang = "pt-BR";
  rec.interimResults = true;
  rec.continuous = false;
  let finalText = "";
  rec.onstart = () => { micBtn.classList.add("recording"); setStatus("Ouvindo..."); finalText = ""; };
  rec.onresult = e => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript;
      else interim += r[0].transcript;
    }
    setStatus((finalText + " " + interim).trim() || "Ouvindo...");
  };
  rec.onerror = e => {
    micBtn.classList.remove("recording");
    setStatus(e.error === "not-allowed" ? "Permissão de microfone negada" : `Erro: ${e.error}`);
  };
  rec.onend = () => {
    micBtn.classList.remove("recording");
    if (finalText.trim()) {
      const p = parseSpeech(finalText.trim());
      applyParsed(p);
      setStatus("Sugestão pronta. Confira e ajuste.");
    } else if (status && !status.textContent.startsWith("Erro") && !status.textContent.startsWith("Permissão")) {
      setStatus("Nada capturado.");
    }
  };
  micBtn.addEventListener("click", () => {
    if (micBtn.classList.contains("recording")) { rec.stop(); return; }
    try { rec.start(); } catch {}
  });
  state.recognition = rec;
}

/* ===== Notifications ===== */

async function ensureNotif() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  return (await Notification.requestPermission()) === "granted";
}

function offsetMs(amount, unit) {
  switch (unit) {
    case "minutes": return amount * 60000;
    case "hours": return amount * 3600000;
    case "days": return amount * 86400000;
    case "weeks": return amount * 7 * 86400000;
    case "months": return amount * 30 * 86400000;
    case "years": return amount * 365 * 86400000;
    default: return 0;
  }
}

function dueMsFor(t) {
  const due = t.type === "oneoff" ? t.deadline : t.nextDue;
  if (!due) return null;
  const d = parseYMD(due);
  d.setHours(9, 0, 0, 0);
  return d.getTime();
}

function buildScheduledNotifications(lookbackMs = 0) {
  const now = Date.now();
  const horizon = now + 7 * 86400000;
  const since = now - lookbackMs;
  const items = [];
  for (const t of state.tasks) {
    if (t.completed) continue;
    const baseMs = dueMsFor(t);
    if (!baseMs) continue;
    for (const n of t.notifications || []) {
      const trigger = baseMs - offsetMs(n.amount, n.unit);
      if (trigger > since && trigger < horizon) {
        items.push({
          id: `t|${t.id}|${baseMs}|${n.amount}|${n.unit}`,
          title: t.title,
          body: n.amount === 0 ? `Hoje: ${t.title}` : `${notificationLabel(n)}: ${t.title}`,
          triggerMs: trigger,
        });
      }
    }
  }
  for (const slot of state.notifSchedule) {
    const { h, m } = slot;
    const kind = h < 12 ? "morning" : "evening";
    for (let i = 0; i < 2; i++) {
      const ms = nextOccurrenceOfTime(h, m, i);
      const item = buildDigestItem(ms, kind, h, m);
      if (item) items.push(item);
    }
  }
  return items;
}

function nextOccurrenceOfTime(h, m, addDays = 0) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  if (addDays === 0 && d.getTime() <= Date.now()) {
    d.setDate(d.getDate() + 1);
  } else {
    d.setDate(d.getDate() + addDays);
  }
  return d.getTime();
}

function buildDigestItem(triggerMs, kind, h = null, m = null) {
  const date = new Date(triggerMs);
  const targetISO = ymd(kind === "morning" ? date : new Date(triggerMs + 86400000));
  const tasks = tasksOnDate(targetISO);
  if (!tasks.length) return null;
  const hh = String(h ?? date.getHours()).padStart(2, "0");
  const mm = String(m ?? date.getMinutes()).padStart(2, "0");
  const lines = tasks.slice(0, 6).map(t => `• ${t.title}`);
  return {
    id: `d|${hh}${mm}|${ymd(date)}`,
    title: kind === "morning" ? "Suas tarefas de hoje" : "Tarefas de amanhã",
    body: lines.join("\n") + (tasks.length > lines.length ? `\n+${tasks.length - lines.length} mais` : ""),
    triggerMs,
  };
}

let _notifIconUrl = "./icon.svg";
let _notifBadgeUrl = "./icon.svg";

async function generateNotifIconPng() {
  const cachedIcon = localStorage.getItem("fluxo/icon-png");
  const cachedBadge = localStorage.getItem("fluxo/badge-png-v3");
  // Only use cache if both are valid base64 PNGs
  if (cachedIcon?.startsWith("data:image/png") && cachedBadge?.startsWith("data:image/png")) {
    _notifIconUrl = cachedIcon;
    _notifBadgeUrl = cachedBadge;
    return;
  }
  // Clear invalid cache entries
  localStorage.removeItem("fluxo/icon-png");
  localStorage.removeItem("fluxo/badge-png-v3");
  try {
    const res = await fetch("./icon.svg");
    const svg = await res.text();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const objUrl = URL.createObjectURL(blob);
    await new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 192; canvas.height = 192;
        canvas.getContext("2d").drawImage(img, 0, 0, 192, 192);
        const iconDataUrl = canvas.toDataURL("image/png");
        try { localStorage.setItem("fluxo/icon-png", iconDataUrl); } catch {}
        _notifIconUrl = iconDataUrl;

        URL.revokeObjectURL(objUrl);
        // Badge: monochrome SVG — only wave shapes (no background rect) in white on transparent
        const badgeSvgSrc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M70 360 C 160 300, 200 420, 290 360 S 420 300, 460 360 L 460 460 L 70 460 Z" fill="#ffffff"/><path d="M70 280 C 160 220, 220 340, 310 280 S 420 220, 460 280" fill="none" stroke="#ffffff" stroke-width="34" stroke-linecap="round"/><path d="M70 190 C 170 140, 230 250, 320 190 S 420 140, 460 190" fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" opacity="0.85"/></svg>`;
        const badgeBlob = new Blob([badgeSvgSrc], { type: "image/svg+xml" });
        const badgeObjUrl = URL.createObjectURL(badgeBlob);
        const badgeImg = new Image();
        badgeImg.onload = () => {
          const bc = document.createElement("canvas");
          bc.width = 96; bc.height = 96;
          bc.getContext("2d").drawImage(badgeImg, 0, 0, 96, 96);
          URL.revokeObjectURL(badgeObjUrl);
          const badgeDataUrl = bc.toDataURL("image/png");
          try { localStorage.setItem("fluxo/badge-png-v3", badgeDataUrl); } catch {}
          _notifBadgeUrl = badgeDataUrl;
          resolve();
        };
        badgeImg.onerror = () => { URL.revokeObjectURL(badgeObjUrl); resolve(); };
        badgeImg.src = badgeObjUrl;
      };
      img.onerror = () => { URL.revokeObjectURL(objUrl); resolve(); };
      img.src = objUrl;
    });
  } catch {}
}

async function scheduleNotifications() {
  if (!(await ensureNotif())) return;
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const ctrl = navigator.serviceWorker.controller || reg.active;
    if (ctrl) ctrl.postMessage({ type: "schedule", items: buildScheduledNotifications(), icon: _notifIconUrl, badge: _notifBadgeUrl });
  } catch {}
}

function checkDueNotifications() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = Date.now();
  const notified = getNotified();
  const items = buildScheduledNotifications(24 * 3600000); // look back 24h for missed notifs
  const allIds = new Set(items.map(i => i.id));
  const swReady = "serviceWorker" in navigator ? navigator.serviceWorker.ready.catch(() => null) : Promise.resolve(null);
  swReady.then(reg => {
    for (const it of items) {
      if (it.triggerMs <= now && !notified.has(it.id)) {
        if (reg) {
          reg.showNotification(it.title, { body: it.body, tag: it.id, icon: _notifIconUrl, badge: _notifBadgeUrl }).catch(() => {});
        }
        notified.add(it.id);
      }
    }
    // Cleanup stale notified IDs
    for (const id of [...notified]) {
      if (!allIds.has(id)) {
        if (id.startsWith("d|")) {
          const dateStr = id.split("|")[2];
          if (dateStr && diffDays(todayISO(), dateStr) > 2) notified.delete(id);
        } else {
          const parts = id.split("|");
          const baseMs = Number(parts[2] || 0);
          if (baseMs && baseMs < now - 2 * 86400000) notified.delete(id);
        }
      }
    }
    saveNotified(notified);
  });
}

/* ===== Settings modal ===== */

function openSettingsModal() {
  renderSettingsBody();
  document.getElementById("settings-modal").hidden = false;
}

function closeSettingsModal() { document.getElementById("settings-modal").hidden = true; }

function renderSettingsBody() {
  const body = document.getElementById("settings-body");
  body.innerHTML = "";

  const nameField = el("label", { class: "field" });
  nameField.appendChild(el("span", {}, "Como prefere ser chamado?"));
  const nameInput = el("input", { type: "text", value: state.userName, placeholder: "Seu nome", maxlength: "40" });
  nameInput.addEventListener("input", () => { state.userName = nameInput.value.trim(); save(); });
  nameField.appendChild(nameInput);
  body.appendChild(nameField);

  const themeField = el("fieldset", { class: "field" });
  themeField.appendChild(el("legend", {}, "Tema"));
  const themeRow = el("div", { class: "importance-row" });
  [["auto", "Auto"], ["light", "Claro"], ["dark", "Escuro"]].forEach(([val, lbl]) => {
    const lbl2 = el("label", { class: "imp-chip", "data-imp": val === state.appTheme ? "sel" : "" });
    const input = el("input", { type: "radio", name: "theme", value: val });
    if (state.appTheme === val) input.checked = true;
    input.addEventListener("change", () => {
      state.appTheme = val;
      applyTheme();
      save();
      themeRow.querySelectorAll(".imp-chip").forEach(c => c.removeAttribute("data-imp"));
      lbl2.dataset.imp = "sel";
    });
    lbl2.append(input, el("span", {}, lbl));
    themeRow.appendChild(lbl2);
  });
  themeField.appendChild(themeRow);
  body.appendChild(themeField);

  const notifField = el("fieldset", { class: "field" });
  notifField.appendChild(el("legend", {}, "Notificações diárias"));

  state.notifSchedule.forEach((slot, i) => {
    const row = el("div", { class: "notif-slot-row" });
    const hh = String(slot.h).padStart(2, "0");
    const mm = String(slot.m).padStart(2, "0");
    const timeInput = el("input", { type: "time", value: `${hh}:${mm}`, class: "notif-time-input" });
    timeInput.addEventListener("change", () => {
      const [h, m] = timeInput.value.split(":").map(Number);
      state.notifSchedule[i] = { h, m };
      save();
      scheduleNotifications();
    });
    const rm = el("button", { type: "button", class: "remove-btn" }, "×");
    rm.addEventListener("click", () => {
      state.notifSchedule.splice(i, 1);
      save();
      scheduleNotifications();
      renderSettingsBody();
    });
    row.append(timeInput, rm);
    notifField.appendChild(row);
  });

  const addRow = el("div", { class: "notif-slot-row" });
  const newTime = el("input", { type: "time", value: "09:00", class: "notif-time-input" });
  const addBtn = el("button", { type: "button", class: "ghost-btn" }, "+ Adicionar");
  addBtn.addEventListener("click", () => {
    const [h, m] = newTime.value.split(":").map(Number);
    if (!isNaN(h)) {
      state.notifSchedule.push({ h, m });
      save();
      scheduleNotifications();
      renderSettingsBody();
    }
  });
  addRow.append(newTime, addBtn);
  notifField.appendChild(addRow);

  const testBtn = el("button", { type: "button", class: "ghost-btn", style: "margin-top:8px;width:100%" }, "Testar notificação agora");
  testBtn.addEventListener("click", async () => {
    if (!(await ensureNotif())) { showToast("Permissão negada"); return; }
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification("Fluxo — Teste", {
        body: "Notificações estão funcionando!",
        icon: _notifIconUrl,
        badge: _notifBadgeUrl,
        tag: "test-" + Date.now()
      });
      showToast("Notificação enviada");
    } catch (err) {
      showToast("Erro: " + (err?.message || "desconhecido"));
    }
  });
  notifField.appendChild(testBtn);
  body.appendChild(notifField);

  // Security: PIN change
  const secField = el("fieldset", { class: "field" });
  secField.appendChild(el("legend", {}, "Segurança"));
  const changePinBtn = el("button", { type: "button", class: "ghost-btn", style: "width:100%" }, "Alterar PIN");
  changePinBtn.addEventListener("click", () => {
    closeSettingsModal();
    showChangePinFlow();
  });
  secField.appendChild(changePinBtn);
  body.appendChild(secField);
}

/* ===== Changelog modal ===== */

function openChangelogModal() {
  const changes = CHANGELOG[APP_VERSION] || [];
  const checks = getChangelogChecks();
  document.getElementById("changelog-title").textContent = `Novidades v${APP_VERSION}`;
  const body = document.getElementById("changelog-body");
  body.innerHTML = "";
  changes.forEach((item, i) => {
    const key = `${APP_VERSION}:${i}`;
    const row = el("label", { class: "changelog-item" });
    const cb = el("input", { type: "checkbox" });
    cb.checked = checks.has(key);
    cb.addEventListener("change", () => {
      if (cb.checked) checks.add(key); else checks.delete(key);
      saveChangelogChecks(checks);
    });
    const txt = document.createTextNode(" " + item);
    row.append(cb, txt);
    body.appendChild(row);
  });
  document.getElementById("changelog-modal").hidden = false;
}

/* ===== util ===== */

function showToast(msg, ms = 2200) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { t.hidden = true; }, ms);
}

function closeLastModal() {
  const order = [
    "tag-edit-modal", "tags-modal", "modal", "renew-modal",
    "quick-date-modal", "tag-select-modal", "cat-modal",
    "add-item-modal", "cat-picker-modal", "settings-modal",
    "notes-page-modal", "notebook-modal", "day-tasks-modal", "changelog-modal",
  ];
  for (const id of order) {
    const m = document.getElementById(id);
    if (m && !m.hidden) {
      if (id === "notes-page-modal") {
        saveNotePage(); // auto-save; also closes modal and shows toast
      } else {
        m.hidden = true;
      }
      return true;
    }
  }
  return false;
}

/* ===== wiring ===== */

function setupUI() {
  // Version badge → changelog
  const vb = document.getElementById("version-badge");
  if (vb) {
    vb.textContent = "v" + APP_VERSION;
    vb.addEventListener("click", openChangelogModal);
  }

  // Close changelog
  document.getElementById("close-changelog").addEventListener("click", () => {
    document.getElementById("changelog-modal").hidden = true;
  });

  // Settings modal (logo click)
  document.querySelector(".brand").addEventListener("click", openSettingsModal);
  document.getElementById("close-settings").addEventListener("click", closeSettingsModal);
  document.getElementById("settings-modal").addEventListener("click", e => {
    if (e.target.id === "settings-modal") closeSettingsModal();
  });

  document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => setView(b.dataset.view)));

  document.getElementById("add-btn").addEventListener("click", () => {
    if (state.view === "shopping") openAddItemModal();
    else if (state.view === "notes") openNotebookModal(null);
    else openTaskModal();
  });
  document.getElementById("close-modal").addEventListener("click", closeTaskModal);
  document.getElementById("modal").addEventListener("click", e => {
    if (e.target.id === "modal") closeTaskModal();
  });
  document.getElementById("task-form").addEventListener("submit", saveTask);
  document.getElementById("delete-btn").addEventListener("click", deleteTask);
  document.querySelectorAll('input[name="type"]').forEach(r => {
    r.addEventListener("change", () => toggleTypeFields(r.value));
  });

  document.getElementById("add-subtask-btn").addEventListener("click", () => {
    const input = document.getElementById("new-subtask");
    const v = input.value.trim();
    if (!v) return;
    state.draftSubtasks.push({ id: uid(), title: v, completed: false });
    input.value = "";
    renderSubtasks();
  });
  document.getElementById("new-subtask").addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); document.getElementById("add-subtask-btn").click(); }
  });

  document.getElementById("add-notif-btn").addEventListener("click", async () => {
    const amount = Number(document.getElementById("notif-amount").value);
    const unit = document.getElementById("notif-unit").value;
    if (Number.isNaN(amount) || amount < 0) return;
    state.draftNotifications.push({ amount, unit });
    renderNotifications();
    await ensureNotif();
  });

  document.getElementById("manage-tags-btn").addEventListener("click", openTagsModal);
  document.getElementById("close-tags-modal").addEventListener("click", closeTagsModal);
  document.getElementById("tags-modal").addEventListener("click", e => {
    if (e.target.id === "tags-modal") closeTagsModal();
  });
  document.getElementById("add-tag-btn").addEventListener("click", addNewTag);
  document.getElementById("new-tag-name").addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); addNewTag(); }
  });

  document.getElementById("close-tag-edit").addEventListener("click", closeTagEdit);
  document.getElementById("tag-edit-modal").addEventListener("click", e => {
    if (e.target.id === "tag-edit-modal") closeTagEdit();
  });
  document.getElementById("tag-save-btn").addEventListener("click", saveTagEdit);
  document.getElementById("tag-delete-btn").addEventListener("click", deleteTagEdit);

  document.getElementById("close-renew").addEventListener("click", cancelRenew);
  document.getElementById("renew-modal").addEventListener("click", e => {
    if (e.target.id === "renew-modal") cancelRenew();
  });
  document.getElementById("renew-confirm-btn").addEventListener("click", confirmRenew);
  document.getElementById("renew-skip-btn").addEventListener("click", skipRenew);

  // Shopping: category modal
  document.getElementById("close-cat-modal").addEventListener("click", closeCategoryModal);
  document.getElementById("cat-modal").addEventListener("click", e => {
    if (e.target.id === "cat-modal") closeCategoryModal();
  });
  document.getElementById("cat-save-btn").addEventListener("click", saveCategoryModal);
  document.getElementById("cat-delete-btn").addEventListener("click", deleteCategoryModal);

  // Shopping: add-item modal
  document.getElementById("close-add-item").addEventListener("click", closeAddItemModal);
  document.getElementById("add-item-modal").addEventListener("click", e => {
    if (e.target.id === "add-item-modal") closeAddItemModal();
  });
  document.getElementById("add-item-save").addEventListener("click", saveAddItem);
  document.getElementById("add-item-name").addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); saveAddItem(); }
  });
  document.getElementById("cat-select-btn").addEventListener("click", () => openCatPicker("add-item"));

  // Shopping: cat-picker modal
  document.getElementById("close-cat-picker").addEventListener("click", closeCatPicker);
  document.getElementById("cat-picker-modal").addEventListener("click", e => {
    if (e.target.id === "cat-picker-modal") closeCatPicker();
  });
  document.getElementById("cat-picker-add-btn").addEventListener("click", () => {
    document.getElementById("cat-picker-modal").hidden = true;
    openCategoryModal();
  });

  // Quick date
  document.getElementById("close-quick-date").addEventListener("click", closeQuickDate);
  document.getElementById("quick-date-modal").addEventListener("click", e => {
    if (e.target.id === "quick-date-modal") closeQuickDate();
  });
  document.getElementById("quick-date-save").addEventListener("click", quickDateSave);
  document.getElementById("quick-date-clear").addEventListener("click", quickDateClear);

  // Day tasks modal
  document.getElementById("close-day-tasks").addEventListener("click", () => {
    document.getElementById("day-tasks-modal").hidden = true;
  });
  document.getElementById("day-tasks-modal").addEventListener("click", e => {
    if (e.target.id === "day-tasks-modal") document.getElementById("day-tasks-modal").hidden = true;
  });

  // Per-task tag selector
  document.getElementById("close-tag-select").addEventListener("click", closeTaskTagsSelector);
  document.getElementById("tag-select-modal").addEventListener("click", e => {
    if (e.target.id === "tag-select-modal") closeTaskTagsSelector();
  });
  document.getElementById("create-task-tag-btn").addEventListener("click", createTaskTag);
  document.getElementById("new-task-tag").addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); createTaskTag(); }
  });

  // Notes modals
  document.getElementById("close-notebook-modal").addEventListener("click", closeNotebookModal);
  document.getElementById("notebook-modal").addEventListener("click", e => {
    if (e.target.id === "notebook-modal") closeNotebookModal();
  });
  document.getElementById("notebook-save-btn").addEventListener("click", saveNotebookModal);
  document.getElementById("notebook-delete-btn").addEventListener("click", deleteNotebookModal);

  document.getElementById("close-page-modal").addEventListener("click", closeNotePage);
  document.getElementById("notes-page-modal").addEventListener("click", e => {
    if (e.target.id === "notes-page-modal") closeNotePage();
  });
  const pageSaveFab = document.getElementById("page-save-fab");
  if (pageSaveFab) pageSaveFab.addEventListener("click", saveNotePage);
  setupPageToolbar();
  setupTodoCheckboxes(document.getElementById("page-content-input"));

  // Notification toggle
  document.querySelectorAll('input[name="notif-enabled"]').forEach(r => {
    r.addEventListener("change", () => {
      document.getElementById("notif-details").hidden = r.value === "no";
    });
  });

  // Swipe to change tabs only — back gesture handled exclusively via popstate (Android system)
  const swipeTabs = ["home", "shopping", "notes"];
  let touchStartX = 0, touchStartY = 0, touchStartInDoneCard = false;
  const viewEl = document.getElementById("view");
  const fogEl = document.getElementById("swipe-fog");

  viewEl.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartInDoneCard = !!e.target.closest(".swipe-delete-wrap");
  }, { passive: true });

  viewEl.addEventListener("touchmove", e => {
    if (touchStartInDoneCard) { fogEl.style.opacity = "0"; return; }
    const dx = e.touches[0].clientX - touchStartX;
    const absDx = Math.abs(dx);
    if (absDx < 8) { fogEl.style.opacity = "0"; return; }
    const opacity = Math.min(absDx / 120, 1) * 0.35;
    fogEl.style.opacity = String(opacity);
    const dir = dx > 0 ? "to right" : "to left";
    fogEl.style.background = `linear-gradient(${dir}, var(--accent), transparent)`;
  }, { passive: true });

  viewEl.addEventListener("touchend", e => {
    fogEl.style.opacity = "0";
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
    if (touchStartInDoneCard && dx < 0) return; // swipe-to-delete started here — don't change tab
    const cur = swipeTabs.indexOf(state.view);
    if (dx < 0 && cur < swipeTabs.length - 1) setView(swipeTabs[cur + 1]);
    if (dx > 0 && cur > 0) setView(swipeTabs[cur - 1]);
  }, { passive: true });
}

/* ===== Auth (PIN + WebAuthn) ===== */

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function loadAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); }
  catch { return null; }
}
function saveAuth(data) { localStorage.setItem(AUTH_KEY, JSON.stringify(data)); }

async function hashPin(pin) {
  try {
    const data = new TextEncoder().encode(pin + "fluxo-salt-v1");
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  } catch {
    // Fallback if SubtleCrypto not available (should not happen in HTTPS context)
    return btoa(pin + "fluxo-salt-v1");
  }
}

function hasWebAuthn() {
  return typeof window.PublicKeyCredential !== "undefined" &&
    typeof navigator.credentials?.create === "function";
}

function buildAuthPad(onDigit, onDelete, onBio = null) {
  const pad = el("div", { class: "auth-pad" });
  [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].forEach(d => {
    if (d === "") { pad.appendChild(el("button", { type: "button", class: "auth-key auth-key--empty", disabled: true }, "")); return; }
    const cls = d === "⌫" ? "auth-key auth-key--del" : "auth-key";
    const btn = el("button", { type: "button", class: cls }, String(d));
    btn.addEventListener("click", () => d === "⌫" ? onDelete() : onDigit(String(d)));
    pad.appendChild(btn);
  });
  if (onBio) {
    // Replace center-bottom button with bio button
    const keys = pad.querySelectorAll(".auth-key");
    const emptySlot = keys[9];
    const bioBtn = el("button", { type: "button", class: "auth-key auth-key--bio" }, "⬡");
    bioBtn.title = "Biometria";
    bioBtn.addEventListener("click", onBio);
    emptySlot.replaceWith(bioBtn);
  }
  return pad;
}

function buildDotDisplay(len) {
  const wrap = el("div", { class: "auth-dots" });
  for (let i = 0; i < 4; i++) wrap.appendChild(el("span", { class: "auth-dot" + (i < len ? " filled" : "") }));
  return wrap;
}

function showAuthScreen(onSuccess) {
  const auth = loadAuth();
  if (!auth) {
    renderPinSetup(onSuccess);
  } else {
    renderPinEntry(auth, onSuccess);
  }
  document.getElementById("auth-screen").style.display = "flex";
}

function renderPinSetup(onSuccess) {
  const screen = document.getElementById("auth-screen");
  screen.innerHTML = "";
  const wrap = el("div", { class: "auth-wrap" });
  const logo = el("img", { src: "./icon.svg", class: "auth-logo", alt: "" });
  const greeting = el("p", { class: "auth-greeting" }, timeGreeting() + "!");
  const title = el("h2", { class: "auth-title" }, "Criar PIN");
  const hint = el("p", { class: "auth-hint" }, "Escolha um PIN de 4 dígitos para proteger o Fluxo.");

  let pin1 = "", step = 1, currentPin = "";
  let dotsEl = buildDotDisplay(0);

  const update = () => {
    const newDots = buildDotDisplay(currentPin.length);
    dotsEl.replaceWith(newDots);
    dotsEl = newDots;
  };

  const onDigit = d => {
    if (currentPin.length >= 4) return;
    currentPin += d;
    update();
    if (currentPin.length === 4) {
      setTimeout(() => {
        if (step === 1) {
          pin1 = currentPin; currentPin = ""; step = 2;
          title.textContent = "Confirmar PIN";
          hint.textContent = "Digite o PIN novamente para confirmar.";
          hint.className = "auth-hint";
          update();
        } else {
          if (currentPin === pin1) {
            hashPin(currentPin).then(h => {
              saveAuth({ pin: h });
              document.getElementById("auth-screen").style.display = "none";
              onSuccess();
              if (hasWebAuthn()) offerBiometric();
            });
          } else {
            step = 1; pin1 = ""; currentPin = "";
            title.textContent = "Criar PIN";
            hint.textContent = "PINs não coincidem. Tente novamente.";
            hint.className = "auth-hint auth-hint--error";
            update();
          }
        }
      }, 120);
    }
  };
  const onDelete = () => { if (currentPin.length > 0) { currentPin = currentPin.slice(0, -1); update(); } };

  wrap.append(logo, greeting, title, hint, dotsEl, buildAuthPad(onDigit, onDelete));
  screen.appendChild(wrap);
}

function renderPinEntry(auth, onSuccess) {
  const screen = document.getElementById("auth-screen");
  screen.innerHTML = "";
  const wrap = el("div", { class: "auth-wrap" });
  const logo = el("img", { src: "./icon.svg", class: "auth-logo", alt: "" });
  const greetingText = state.userName ? `${timeGreeting()}, ${state.userName}` : timeGreeting();
  const greeting = el("p", { class: "auth-greeting" }, greetingText);
  const hint = el("p", { class: "auth-hint" }, "Digite seu PIN para entrar.");

  let currentPin = "";
  let dotsEl = buildDotDisplay(0);
  const update = () => { const n = buildDotDisplay(currentPin.length); dotsEl.replaceWith(n); dotsEl = n; };

  const tryBio = auth.webAuthnCredId ? async () => {
    try {
      const credIdHex = auth.webAuthnCredId;
      const credIdBytes = Uint8Array.from(credIdHex.match(/.{2}/g).map(b => parseInt(b, 16)));
      await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rpId: window.location.hostname,
          allowCredentials: [{ id: credIdBytes, type: "public-key" }],
          userVerification: "preferred",
          timeout: 60000,
        }
      });
      document.getElementById("auth-screen").style.display = "none";
      onSuccess();
    } catch {
      hint.textContent = "Biometria falhou. Use o PIN.";
      hint.className = "auth-hint auth-hint--error";
    }
  } : null;

  const onDigit = d => {
    if (currentPin.length >= 4) return;
    currentPin += d;
    update();
    if (currentPin.length === 4) {
      setTimeout(async () => {
        const h = await hashPin(currentPin);
        if (h === auth.pin) {
          document.getElementById("auth-screen").style.display = "none";
          onSuccess();
        } else {
          currentPin = "";
          hint.textContent = "PIN incorreto. Tente novamente.";
          hint.className = "auth-hint auth-hint--error";
          update();
        }
      }, 120);
    }
  };
  const onDelete = () => { if (currentPin.length > 0) { currentPin = currentPin.slice(0, -1); update(); } };

  wrap.append(logo, greeting, hint, dotsEl, buildAuthPad(onDigit, onDelete, tryBio));
  screen.appendChild(wrap);

  // Auto-trigger biometric on entry
  if (tryBio) setTimeout(tryBio, 400);
}

async function offerBiometric() {
  if (!hasWebAuthn()) return;
  if (!confirm("Deseja ativar login por biometria (digital/rosto)?")) return;
  try {
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: "Fluxo", id: window.location.hostname },
        user: {
          id: new TextEncoder().encode("fluxo-user"),
          name: "Usuário",
          displayName: "Usuário Fluxo",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" },
        ],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "preferred" },
        timeout: 60000,
      }
    });
    const credIdHex = Array.from(new Uint8Array(cred.rawId)).map(b => b.toString(16).padStart(2, "0")).join("");
    const auth = loadAuth();
    if (auth) { auth.webAuthnCredId = credIdHex; saveAuth(auth); }
    showToast("Biometria ativada!");
  } catch {
    showToast("Biometria não disponível.");
  }
}

function showChangePinFlow() {
  const auth = loadAuth();
  if (!auth) return;
  const screen = document.getElementById("auth-screen");
  screen.innerHTML = "";
  screen.style.display = "flex";
  const wrap = el("div", { class: "auth-wrap" });
  const logo = el("img", { src: "./icon.svg", class: "auth-logo", alt: "" });
  const title = el("h2", { class: "auth-title" }, "Verificar PIN atual");
  const hint = el("p", { class: "auth-hint" }, "Digite o PIN atual para continuar.");
  const cancelBtn = el("button", { type: "button", class: "auth-link" }, "Cancelar");
  cancelBtn.addEventListener("click", () => { screen.style.display = "none"; });

  let step = 1, pinOld = "", pin1 = "", currentPin = "";
  let dotsEl = buildDotDisplay(0);
  const update = () => { const n = buildDotDisplay(currentPin.length); dotsEl.replaceWith(n); dotsEl = n; };

  const onDigit = d => {
    if (currentPin.length >= 4) return;
    currentPin += d;
    update();
    if (currentPin.length === 4) {
      setTimeout(async () => {
        if (step === 1) {
          const h = await hashPin(currentPin);
          if (h !== auth.pin) {
            currentPin = ""; hint.textContent = "PIN incorreto."; hint.className = "auth-hint auth-hint--error"; update(); return;
          }
          pinOld = currentPin; currentPin = ""; step = 2;
          title.textContent = "Novo PIN"; hint.textContent = "Escolha um novo PIN de 4 dígitos."; hint.className = "auth-hint"; update();
        } else if (step === 2) {
          pin1 = currentPin; currentPin = ""; step = 3;
          title.textContent = "Confirmar novo PIN"; hint.textContent = "Confirme o novo PIN."; hint.className = "auth-hint"; update();
        } else {
          if (currentPin !== pin1) {
            currentPin = ""; step = 2; pin1 = "";
            hint.textContent = "PINs não coincidem."; hint.className = "auth-hint auth-hint--error"; update();
            title.textContent = "Novo PIN"; return;
          }
          const h = await hashPin(currentPin);
          auth.pin = h; saveAuth(auth);
          screen.style.display = "none";
          showToast("PIN alterado com sucesso!");
        }
      }, 120);
    }
  };
  const onDelete = () => { if (currentPin.length > 0) { currentPin = currentPin.slice(0, -1); update(); } };

  wrap.append(logo, title, hint, dotsEl, buildAuthPad(onDigit, onDelete), cancelBtn);
  screen.appendChild(wrap);
}

async function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register("./sw.js");
    reg.addEventListener("updatefound", () => {
      const sw = reg.installing;
      if (!sw) return;
      sw.addEventListener("statechange", () => {
        if (sw.state === "installed" && navigator.serviceWorker.controller) {
          sw.postMessage({ type: "SKIP_WAITING" });
        }
      });
    });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  } catch {}
}

function collapseLowestExpandedContainer() {
  const candidates = [];

  document.querySelectorAll('[data-section][data-expanded="1"]').forEach(secEl => {
    candidates.push({ el: secEl, type: "section", key: secEl.dataset.section });
  });
  document.querySelectorAll('[data-cat-id][data-expanded="1"]').forEach(hdrEl => {
    candidates.push({ el: hdrEl, type: "cat", catId: hdrEl.dataset.catId });
  });
  document.querySelectorAll('[data-nb-id][data-expanded="1"]').forEach(hdrEl => {
    candidates.push({ el: hdrEl, type: "nb", nbId: hdrEl.dataset.nbId });
  });

  if (!candidates.length) return false;

  candidates.sort((a, b) => b.el.getBoundingClientRect().bottom - a.el.getBoundingClientRect().bottom);
  const target = candidates[0];

  if (target.type === "section") {
    state.homeCollapsed[target.key] = true;
    save();
    render();
  } else if (target.type === "cat") {
    if (target.catId === "importantes" && state.shopping.importantes) {
      state.shopping.importantes.collapsed = true; save(); render();
    } else {
      const cat = state.shopping.categories.find(c => c.id === target.catId);
      if (cat) { cat.collapsed = true; save(); render(); }
    }
  } else if (target.type === "nb") {
    const nb = state.notes.notebooks.find(n => n.id === target.nbId);
    if (nb) { nb.collapsed = true; save(); render(); }
  }
  return true;
}

let _exitReadyAt = 0;

// Returns true when exit is confirmed (caller must NOT pushState — app will close on next back).
function handleBackAction() {
  if (!closeLastModal() && !collapseLowestExpandedContainer()) {
    if (Date.now() - _exitReadyAt < 3000) {
      _exitReadyAt = 0;
      return true; // second tap within 3s — confirm exit
    }
    _exitReadyAt = Date.now();
    showToast("Toque em voltar novamente para sair do Fluxo", 3000);
  } else {
    _exitReadyAt = 0; // something was closed — reset timer
  }
  return false;
}

async function initApp() {
  await registerSW();
  await generateNotifIconPng();
  checkDueNotifications();
  scheduleNotifications();

  // Intercept system back gesture (Android).
  // Normal: always pushState to keep app alive.
  // Exit confirmed (handleBackAction returns true): don't push — at init_url, next back closes PWA.
  history.pushState({ fluxo: true }, "");
  window.addEventListener("popstate", () => {
    let exitConfirmed = false;
    try { exitConfirmed = handleBackAction(); } catch (e) { console.error("[fluxo] popstate:", e); }
    if (!exitConfirmed) history.pushState({ fluxo: true }, "");
  });
  setInterval(() => {
    checkDueNotifications();
    if (state.view === "home") render();
  }, 60000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      checkDueNotifications();
      scheduleNotifications();
      render();
    }
  });
}

function resetCollapsed() {
  Object.keys(state.homeCollapsed).forEach(k => { state.homeCollapsed[k] = true; });
  (state.shopping.categories || []).forEach(c => { c.collapsed = true; });
  (state.notes.notebooks || []).forEach(n => { n.collapsed = true; });
  if (state.shopping.importantes) state.shopping.importantes.collapsed = true;
}

async function init() {
  load();
  resetCollapsed();
  applyTheme();
  setupUI();
  setupSpeech();
  render();

  showAuthScreen(() => { resetCollapsed(); render(); initApp(); });
}

init();
