/* Fluxo v5.00 */

const STORAGE_KEY = "fluxo/v2";
const NOTIFIED_KEY = "fluxo/notified";
const CHANGELOG_CHECKS_KEY = "fluxo/changelog-checks";
const APP_VERSION = "5.00";

const CHANGELOG = {
  "5.00": [
    "Aba Início renomeada para Tarefas",
    "Aba Calendário removida — mini-calendário embutido na aba Tarefas",
    "Filtros reorganizados: Frequência + Importância + Categoria com ícone de ordenação",
    "Ordenação por importância ou data (botão ⇅ nos filtros)",
    "Seção “Sem data” removida — itens aparecem em “Mais tarde”",
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
  "#a3d5d2", "#b8d9c4", "#c8d8b0", "#dee2a8",
  "#ead8a8", "#f0c8a0", "#e8a8a0", "#e8b0c8",
  "#c8b0d8", "#b4b8e0", "#a8c8e0", "#a8d4d8",
  "#c8a8a0", "#d8c4b0", "#a8b8c4", "#d8d4c0"
];

const DEFAULT_TAGS = [
  { name: "Limpeza", color: "#b8d9c4" },
  { name: "Viagem", color: "#a8c8e0" },
  { name: "Burocracia", color: "#d8c4b0" },
  { name: "Saúde", color: "#e8a8a0" },
  { name: "Finanças", color: "#d8d4c0" },
  { name: "Compras", color: "#c8b0d8" }
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
  homeCollapsed: { reminder: false, atrasadas: true, today: true, nextweek: true, later: true },
  homeFilters: { types: new Set(), imps: new Set(), tagIds: new Set() },
  homeFilterOpen: { freq: false, imp: false, tag: false },
  tasksSortBy: "importance",
  editingCategoryId: null,
  editingCategoryDraft: null,
  addItemDraft: { name: "", categoryId: null },
  catPickerContext: null,
  editingNotebookId: null,
  editingNotebookDraft: null,
  editingPageId: null,
  pagePreviewMode: false,
  _lastView: null,
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
      state.notes = data.notes || { notebooks: [], pages: [] };
      state.notifSchedule = data.notifSchedule || [{ h: 9, m: 0 }, { h: 22, m: 0 }];
      state.appTheme = data.appTheme || "auto";
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

  fab.hidden = (state.view === "shopping" || state.view === "notes");

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
          openObj[key] = false;
          hdr.classList.remove("open");
          caret.textContent = "▼";
          body.hidden = true;
          document.removeEventListener("click", closeOnOutside);
        }
      };
      document.addEventListener("click", closeOnOutside);
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

function buildFilterPanel() {
  const hf = state.homeFilters;
  const fo = state.homeFilterOpen;
  const panel = el("div", { class: "filter-cal-box" });

  // Left: filters
  const left = el("div", { class: "filter-left" });

  // Row 1: sort icon + frequência chips
  const row1 = el("div", { class: "filter-row" });

  const sortBtn = el("button", { type: "button", class: "sort-btn" + (state.tasksSortBy === "date" ? " active" : ""), title: state.tasksSortBy === "date" ? "Ordenar por importância" : "Ordenar por data" });
  sortBtn.textContent = "⇅";
  sortBtn.addEventListener("click", () => {
    state.tasksSortBy = state.tasksSortBy === "importance" ? "date" : "importance";
    render();
  });
  row1.appendChild(sortBtn);

  // Frequência chips inline (not dropdown)
  const freqGroup = el("div", { class: "filter-chips-inline" });
  [["oneoff", "Pontual"], ["routine", "Rotina"]].forEach(([v, lbl]) => {
    const chip = el("button", { type: "button", class: "filter-chip-inline" + (hf.types.has(v) ? " active" : "") }, lbl);
    chip.addEventListener("click", () => {
      if (hf.types.has(v)) hf.types.delete(v); else hf.types.add(v);
      chip.classList.toggle("active", hf.types.has(v));
      render();
    });
    freqGroup.appendChild(chip);
  });
  row1.appendChild(freqGroup);
  left.appendChild(row1);

  // Row 2: categoria + importância dropdowns
  const row2 = el("div", { class: "filter-row" });

  row2.appendChild(makeFilterDropdown(fo, "tag", "Categoria", body => {
    state.tags.forEach(tag => {
      const chip = el("button", { type: "button", class: "filter-chip filter-chip--tag" + (hf.tagIds.has(tag.id) ? " active" : "") }, tag.name);
      chip.style.setProperty("--chip-color", tag.color);
      chip.addEventListener("click", () => {
        if (hf.tagIds.has(tag.id)) hf.tagIds.delete(tag.id); else hf.tagIds.add(tag.id);
        chip.classList.toggle("active", hf.tagIds.has(tag.id));
        render();
      });
      body.appendChild(chip);
    });
  }));

  row2.appendChild(makeFilterDropdown(fo, "imp", "Importância", body => {
    [["4", "Crítica"], ["3", "Alta"], ["2", "Média"], ["1", "Baixa"]].forEach(([v, lbl]) => {
      const chip = el("button", { type: "button", class: "filter-chip" + (hf.imps.has(v) ? " active" : "") }, lbl);
      chip.addEventListener("click", () => {
        if (hf.imps.has(v)) hf.imps.delete(v); else hf.imps.add(v);
        chip.classList.toggle("active", hf.imps.has(v));
        render();
      });
      body.appendChild(chip);
    });
  }));

  left.appendChild(row2);
  panel.appendChild(left);

  // Right: mini calendar
  panel.appendChild(buildMiniCalendar());

  return panel;
}

function buildMiniCalendar() {
  if (!state.tasksCalMonth) {
    const t = new Date();
    state.tasksCalMonth = { y: t.getFullYear(), m: t.getMonth() };
  }
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

  for (let i = 0; i < startDow; i++) {
    const day = prevDays - startDow + 1 + i;
    grid.appendChild(makeMiniCalCell(y, m - 1, day, true));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    grid.appendChild(makeMiniCalCell(y, m, d, false));
  }
  const total = startDow + daysInMonth;
  const trailing = (7 - (total % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    grid.appendChild(makeMiniCalCell(y, m + 1, i, true));
  }

  wrap.appendChild(grid);
  return wrap;
}

function makeMiniCalCell(y, m, d, outside) {
  const date = new Date(y, m, d);
  const ds = ymd(date);
  const hasTasks = tasksOnDate(ds).length > 0;
  const isSelected = ds === state.tasksCalDate;
  const isToday = ds === todayISO();

  const cell = el("div", {
    class: "mini-cal-day"
      + (outside ? " outside" : "")
      + (isToday ? " today" : "")
      + (isSelected ? " selected" : "")
      + (hasTasks ? " has-tasks" : "")
  });
  cell.appendChild(el("span", {}, String(date.getDate())));

  cell.addEventListener("click", () => {
    if (hasTasks) {
      openDayTasksModal(ds);
    } else {
      state.tasksCalDate = isSelected ? null : ds;
      render();
    }
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

  // Filter + calendar box
  root.appendChild(buildFilterPanel());

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
  const sortFn = state.tasksSortBy === "date" ? byDueThenImp : byImp;

  const reminder = state.tasks.filter(t =>
    isVisible(t) && t.type === "oneoff" && t.importance >= 3 &&
    !(t.deadline && t.deadline <= today)
  ).sort((a, b) => byImp(a, b) || (a.deadline || "9999").localeCompare(b.deadline || "9999"));

  const overdue = state.tasks.filter(t => isVisible(t) && taskDue(t) && taskDue(t) < today).sort(sortFn);
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

  scroll.appendChild(makeHomeSection("reminder", "Lembrete", reminder, "Nenhuma tarefa importante próxima."));
  scroll.appendChild(makeHomeSection("atrasadas", "Atrasadas", overdue, "Nenhuma tarefa atrasada."));
  scroll.appendChild(makeHomeSection("today", "Para hoje", todayTasks, "Nenhuma tarefa para hoje."));
  scroll.appendChild(makeHomeSection("nextweek", "Próxima semana", nextweek, "Nenhuma tarefa para a semana."));
  scroll.appendChild(makeHomeSection("later", "Mais tarde", later, "Nenhuma tarefa além desta semana."));
  root.appendChild(scroll);
}

function makeHomeSection(key, title, tasks, emptyMsg) {
  const collapsed = state.homeCollapsed[key];
  const sec = el("section", { class: "section section--home" + (collapsed ? " section--collapsed" : "") });

  const hdr = el("div", { class: "section-hdr" });
  const h2 = el("h2", {}, title);
  if (tasks.length) h2.appendChild(el("span", { class: "section-count" }, String(tasks.length)));
  hdr.appendChild(h2);
  hdr.appendChild(el("span", { class: "section-toggle" }, collapsed ? "▶" : "▼"));

  hdr.addEventListener("click", () => {
    state.homeCollapsed[key] = !state.homeCollapsed[key];
    render();
  });

  sec.appendChild(hdr);

  if (!collapsed) {
    if (!tasks.length) {
      sec.appendChild(el("div", { class: "empty" }, emptyMsg));
    } else {
      const list = el("div", { class: "task-list" });
      tasks.forEach(t => list.appendChild(renderTaskCard(t)));
      sec.appendChild(list);
    }
  }
  return sec;
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

function renderTaskCard(t) {
  const card = el("article", {
    class: "task" + (t.completed ? " completed" : ""),
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
  freqIcon.textContent = t.type === "routine" ? "↻" : "⚑";
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
  return card;
}

/* ===== Shopping ===== */

function renderShopping(root) {
  root.className = "view view--scrollable";
  const cats = state.shopping.categories;

  const toolbar = el("div", { class: "shopping-toolbar" });
  const addBtn = el("button", { type: "button", class: "primary-btn shopping-add-btn" }, "+ Adicionar item");
  addBtn.addEventListener("click", openAddItemModal);
  toolbar.appendChild(addBtn);
  root.appendChild(toolbar);

  if (!cats.length) {
    root.appendChild(el("div", { class: "empty" }, "Nenhum item ainda. Toque em “+ Adicionar item” para começar."));
    return;
  }
  const sorted = [...cats].sort((a, b) => b.items.length - a.items.length);
  sorted.forEach(cat => root.appendChild(renderShoppingCategory(cat)));
}

function renderShoppingCategory(cat) {
  const card = el("div", { class: "shopping-category" });
  card.style.setProperty("--cat-color", cat.color);
  card.style.setProperty("--cat-bg", hexToRgba(cat.color, 0.13));
  card.style.setProperty("--cat-tint", hexToRgba(cat.color, 0.07));

  const hdr = el("div", { class: "shopping-cat-header" });
  hdr.addEventListener("click", () => {
    cat.collapsed = !cat.collapsed;
    save();
    render();
  });
  const dot = el("span", { class: "shopping-cat-dot" });
  dot.style.background = cat.color;
  const name = el("span", { class: "shopping-cat-name" }, cat.name);
  name.title = "Toque para editar";
  name.addEventListener("click", e => { e.stopPropagation(); openCategoryModal(cat.id); });
  const unchecked = cat.items.filter(i => !i.checked).length;
  const count = el("span", { class: "shopping-cat-count" }, `${unchecked}/${cat.items.length}`);
  const toggle = el("span", { class: "shopping-cat-chevron" }, cat.collapsed ? "▶" : "▼");
  hdr.append(dot, name, count, toggle);
  card.appendChild(hdr);

  if (!cat.collapsed) {
    const body = el("div", { class: "shopping-cat-body" });

    cat.items.forEach((item, i) => {
      const row = el("div", { class: "shopping-item" + (item.checked ? " checked" : "") });
      row.style.background = "var(--cat-tint)";

      const cb = el("input", { type: "checkbox", class: "styled-check" });
      cb.checked = item.checked;
      cb.addEventListener("change", e => {
        e.stopPropagation();
        cat.items[i].checked = cb.checked;
        save();
        render();
      });

      const nameEl = el("span", { class: "shopping-item-name" }, item.name);

      // Long press → inline edit with color + title + OK
      let longPressTimer = null;
      const startLongPress = () => {
        longPressTimer = setTimeout(() => {
          longPressTimer = null;
          activateItemEdit(cat, i, row, cb);
        }, 550);
      };
      const cancelLongPress = () => { clearTimeout(longPressTimer); longPressTimer = null; };
      row.addEventListener("touchstart", startLongPress, { passive: true });
      row.addEventListener("touchend", cancelLongPress, { passive: true });
      row.addEventListener("touchmove", cancelLongPress, { passive: true });

      const rm = el("button", { type: "button", class: "remove-btn" }, "×");
      rm.addEventListener("click", e => {
        e.stopPropagation();
        cat.items.splice(i, 1);
        save();
        render();
      });
      row.append(cb, nameEl, rm);
      body.appendChild(row);
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
      cat.items.push({ id: uid(), name: v, checked: false });
      input.value = "";
      save();
      render();
      if (refocus) refocusAfterRender();
    };
    const addItemBtn = el("button", { type: "button", class: "ghost-btn" }, "+");
    addItemBtn.addEventListener("click", () => doAdd(false));
    input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); doAdd(true); } });
    addRow.append(input, addItemBtn);
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
  const cat = id ? state.shopping.categories.find(c => c.id === id) : null;
  state.editingCategoryDraft = { name: cat?.name || "", color: cat?.color || TAG_COLORS[0] };
  document.getElementById("cat-modal-title").textContent = id ? "Editar categoria" : "Nova categoria";
  document.getElementById("cat-delete-btn").hidden = !id;
  document.getElementById("cat-name").value = state.editingCategoryDraft.name;
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

  const toolbar = el("div", { class: "shopping-toolbar" });
  const addBtn = el("button", { type: "button", class: "primary-btn shopping-add-btn" }, "+ Novo caderno");
  addBtn.addEventListener("click", () => openNotebookModal(null));
  toolbar.appendChild(addBtn);
  root.appendChild(toolbar);

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

  const hdr = el("div", { class: "notebook-hdr" });
  hdr.addEventListener("click", () => {
    nb.collapsed = !nb.collapsed;
    save();
    render();
  });

  const dot = el("span", { class: "notebook-dot" });
  dot.style.background = nb.color;
  const name = el("span", { class: "notebook-name" }, nb.name);
  name.addEventListener("click", e => { e.stopPropagation(); openNotebookModal(nb.id); });

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
        const row = el("div", { class: "page-row" });
        const pageIcon = el("span", { class: "page-icon" }, "📄");
        const pageInfo = el("div", { class: "page-info" });
        pageInfo.appendChild(el("span", { class: "page-name" }, page.name));
        if (page.updatedAt) {
          const d = new Date(page.updatedAt);
          const fmt = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
          pageInfo.appendChild(el("span", { class: "page-date" }, fmt));
        }
        row.append(pageIcon, pageInfo);
        row.addEventListener("click", () => openNotePage(page.id));
        body.appendChild(row);
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

function openNotePage(pageId, notebookId = null) {
  state.editingPageId = pageId;
  state.pagePreviewMode = false;
  const page = pageId ? state.notes.pages.find(p => p.id === pageId) : null;
  document.getElementById("page-title-input").value = page?.name || "";
  document.getElementById("page-content-input").value = page?.content || "";
  document.getElementById("page-preview").hidden = true;
  document.getElementById("page-editor").hidden = false;
  document.getElementById("page-preview-btn").textContent = "Pré-vis.";
  // Store notebookId for new pages
  document.getElementById("notes-page-modal").dataset.notebookId = notebookId || page?.notebookId || "";
  document.getElementById("notes-page-modal").hidden = false;
}

function closeNotePage() {
  document.getElementById("notes-page-modal").hidden = true;
  state.editingPageId = null;
}

function togglePagePreview() {
  state.pagePreviewMode = !state.pagePreviewMode;
  const preview = document.getElementById("page-preview");
  const editor = document.getElementById("page-editor");
  const btn = document.getElementById("page-preview-btn");
  if (state.pagePreviewMode) {
    preview.innerHTML = renderMarkdown(document.getElementById("page-content-input").value);
    preview.hidden = false;
    editor.hidden = true;
    btn.textContent = "Editar";
  } else {
    preview.hidden = true;
    editor.hidden = false;
    btn.textContent = "Pré-vis.";
  }
}

function saveNotePage() {
  const name = document.getElementById("page-title-input").value.trim() || "Sem título";
  const content = document.getElementById("page-content-input").value;
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
    const span = el("span", { class: "text" }, s.title);
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

function buildScheduledNotifications() {
  const now = Date.now();
  const horizon = now + 7 * 86400000;
  const items = [];
  for (const t of state.tasks) {
    if (t.completed) continue;
    const baseMs = dueMsFor(t);
    if (!baseMs) continue;
    for (const n of t.notifications || []) {
      const trigger = baseMs - offsetMs(n.amount, n.unit);
      if (trigger > now && trigger < horizon) {
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
  d.setDate(d.getDate() + addDays);
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

async function scheduleNotifications() {
  if (!(await ensureNotif())) return;
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "schedule", items: buildScheduledNotifications() });
  }
}

function checkDueNotifications() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = Date.now();
  const notified = getNotified();
  const items = buildScheduledNotifications();
  const allIds = new Set(items.map(i => i.id));
  for (const it of items) {
    if (it.triggerMs <= now && !notified.has(it.id)) {
      try { new Notification(it.title, { body: it.body, tag: it.id, icon: "./icon.svg" }); } catch {}
      notified.add(it.id);
    }
  }
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
    try { new Notification("Fluxo — Teste", { body: "Notificações estão funcionando!", icon: "./icon.svg", tag: "test-" + Date.now() }); }
    catch { showToast("Erro ao enviar"); return; }
    showToast("Notificação enviada");
  });
  notifField.appendChild(testBtn);
  body.appendChild(notifField);
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
    if (m && !m.hidden) { m.hidden = true; return true; }
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
  document.getElementById("changelog-modal").addEventListener("click", e => {
    if (e.target.id === "changelog-modal") document.getElementById("changelog-modal").hidden = true;
  });

  // Settings modal (logo click)
  document.querySelector(".brand").addEventListener("click", openSettingsModal);
  document.getElementById("close-settings").addEventListener("click", closeSettingsModal);
  document.getElementById("settings-modal").addEventListener("click", e => {
    if (e.target.id === "settings-modal") closeSettingsModal();
  });

  document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => setView(b.dataset.view)));

  document.getElementById("add-btn").addEventListener("click", () => openTaskModal());
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
  document.getElementById("page-save-btn").addEventListener("click", saveNotePage);
  document.getElementById("page-preview-btn").addEventListener("click", togglePagePreview);

  // Notification toggle
  document.querySelectorAll('input[name="notif-enabled"]').forEach(r => {
    r.addEventListener("change", () => {
      document.getElementById("notif-details").hidden = r.value === "no";
    });
  });

  // Swipe to change tabs
  const swipeTabs = ["home", "shopping", "notes"];
  let touchStartX = 0, touchStartY = 0, touchStartEdge = false;
  const viewEl = document.getElementById("view");
  const fogEl = document.getElementById("swipe-fog");

  viewEl.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartEdge = touchStartX > window.innerWidth * 0.85;
  }, { passive: true });

  viewEl.addEventListener("touchmove", e => {
    if (touchStartEdge) return; // back gesture, don't show fog
    const dx = e.touches[0].clientX - touchStartX;
    const absDx = Math.abs(dx);
    if (absDx < 8) { fogEl.style.opacity = "0"; return; }
    const opacity = Math.min(absDx / 150, 1) * 0.15;
    fogEl.style.opacity = String(opacity);
    const dir = dx > 0 ? "to right" : "to left";
    fogEl.style.background = `linear-gradient(${dir}, var(--accent), transparent)`;
  }, { passive: true });

  viewEl.addEventListener("touchend", e => {
    fogEl.style.opacity = "0";
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;

    // Back gesture: started from right edge, dragged left
    if (touchStartEdge && dx < -50) {
      if (!closeLastModal()) {
        showToast("Deseja sair do Fluxo?");
      }
      return;
    }

    if (!touchStartEdge) {
      const cur = swipeTabs.indexOf(state.view);
      if (dx < 0 && cur < swipeTabs.length - 1) setView(swipeTabs[cur + 1]);
      if (dx > 0 && cur > 0) setView(swipeTabs[cur - 1]);
    }
  }, { passive: true });
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

async function init() {
  load();
  applyTheme();
  setupUI();
  setupSpeech();
  render();
  await registerSW();
  checkDueNotifications();
  scheduleNotifications();
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

init();
