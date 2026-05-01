/* Fluxo v2 */

const STORAGE_KEY = "fluxo/v2";
const NOTIFIED_KEY = "fluxo/notified";

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
  view: "home",
  editingId: null,
  draftSubtasks: [],
  draftNotifications: [],
  draftTagIds: [],
  recognition: null,
  installPrompt: null,
  filters: { type: "all", imp: "all", q: "", tagIds: [], showDone: false },
  calMonth: null,
  pendingRenew: null,
  editingTagId: null,
  editingTagDraft: null,
};

/* ===== persistence ===== */

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      state.tasks = data.tasks || [];
      state.tags = data.tags || [];
    }
  } catch {}
  if (!state.tags.length) {
    state.tags = DEFAULT_TAGS.map(t => ({ id: uid(), name: t.name, color: t.color }));
    save();
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: state.tasks, tags: state.tags }));
}

function getNotified() {
  try { return new Set(JSON.parse(localStorage.getItem(NOTIFIED_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveNotified(s) {
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...s]));
}

/* ===== dates ===== */

function todayISO() {
  const d = new Date();
  return ymd(d);
}
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
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
function fmtRelativeDays(s) {
  if (!s) return "";
  const d = diffDays(s, todayISO());
  if (d === 0) return "hoje";
  if (d === 1) return "amanhã";
  if (d === -1) return "ontem";
  if (d > 0) return `em ${d} dia${d > 1 ? "s" : ""}`;
  return `há ${-d} dias`;
}

/* ===== importance / score ===== */

function scoreFor(task) {
  return IMP_WEIGHT[task.importance] || IMP_WEIGHT[2];
}

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

/* ===== tags ===== */

function tagById(id) { return state.tags.find(t => t.id === id); }
function tagsOf(task) { return (task.tags || []).map(tagById).filter(Boolean); }

/* ===== task queries ===== */

function activeTasks() { return state.tasks.filter(t => !t.completed); }

function tasksOnDate(dateStr) {
  const items = [];
  for (const t of state.tasks) {
    if (t.type === "oneoff") {
      if (!t.completed && t.deadline === dateStr) items.push(t);
    } else {
      if (t.active === false) continue;
      if (t.nextDue === dateStr) items.push(t);
    }
  }
  return items;
}

function dayScore(dateStr) {
  let s = 0;
  for (const t of tasksOnDate(dateStr)) s += scoreFor(t);
  return s;
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

/* ===== views ===== */

function setView(v) {
  state.view = v;
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  render();
}

function render() {
  const view = document.getElementById("view");
  view.innerHTML = "";
  if (state.view === "home") renderHome(view);
  else if (state.view === "pending") renderPending(view);
  else if (state.view === "calendar") renderCalendar(view);
}

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

function renderHome(root) {
  const today = todayISO();
  const oneoffs = state.tasks.filter(t => t.type === "oneoff" && !t.completed);
  const routines = state.tasks.filter(t => t.type === "routine" && t.active !== false);

  // Important always shown (importance 3 or 4) regardless of date
  const importantOneoffs = oneoffs.filter(t => t.importance >= 3);
  const closeOneoffs = oneoffs
    .filter(t => t.deadline)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 8);
  const homeOneoffs = unique([...importantOneoffs, ...closeOneoffs], t => t.id);

  const dueRoutines = routines.filter(r => isDueToday(r) || isOverdue(r));
  const upcomingRoutines = routines
    .filter(r => !dueRoutines.includes(r))
    .sort((a, b) => (a.nextDue || "").localeCompare(b.nextDue || ""))
    .slice(0, 5);
  const homeRoutines = [...dueRoutines, ...upcomingRoutines];

  // Section: Pontuais
  const sec1 = el("section", { class: "section" });
  sec1.appendChild(el("h2", {}, "Pontuais — próximas e importantes"));
  if (!homeOneoffs.length) {
    sec1.appendChild(el("div", { class: "empty" }, "Nenhuma tarefa pontual pendente."));
  } else {
    const list = el("div", { class: "task-list" });
    homeOneoffs
      .sort((a, b) => {
        const ia = a.importance, ib = b.importance;
        if (ia !== ib) return ib - ia;
        return (a.deadline || "9999").localeCompare(b.deadline || "9999");
      })
      .forEach(t => list.appendChild(renderTaskCard(t)));
    sec1.appendChild(list);
  }
  root.appendChild(sec1);

  // Section: Rotinas
  const sec2 = el("section", { class: "section" });
  sec2.appendChild(el("h2", {}, "Rotinas — hoje e em breve"));
  if (!homeRoutines.length) {
    sec2.appendChild(el("div", { class: "empty" }, "Nenhuma rotina ativa."));
  } else {
    const list = el("div", { class: "task-list" });
    homeRoutines.forEach(t => list.appendChild(renderTaskCard(t)));
    sec2.appendChild(list);
  }
  root.appendChild(sec2);
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

function renderTaskCard(t) {
  const card = el("article", { class: "task" + (t.completed ? " completed" : ""), "data-imp": t.importance });
  card.appendChild(el("div", { class: "imp-bar" }));

  const cb = el("input", { type: "checkbox", class: "task-checkbox" });
  cb.checked = !!t.completed;
  cb.addEventListener("click", e => { e.stopPropagation(); toggleComplete(t.id); });
  card.appendChild(cb);

  const body = el("div", { class: "task-body" });
  body.appendChild(el("div", { class: "task-title" }, t.title));

  const meta = el("div", { class: "task-meta" });
  if (t.type === "oneoff" && t.deadline) {
    const overdue = isOverdue(t);
    const cls = "badge" + (overdue ? " danger" : "");
    meta.appendChild(el("span", { class: cls }, `${fmtDateBR(t.deadline)} · ${fmtRelativeDays(t.deadline)}`));
  } else if (t.type === "routine") {
    const overdue = isOverdue(t);
    const cls = "badge" + (overdue ? " danger" : "");
    if (t.nextDue) meta.appendChild(el("span", { class: cls }, `Próx: ${fmtDateBR(t.nextDue)} · ${fmtRelativeDays(t.nextDue)}`));
    meta.appendChild(el("span", { class: "badge" }, `a cada ${t.intervalAmount} ${unitShort(t.intervalUnit, t.intervalAmount)}`));
  }
  if (t.subtasks && t.subtasks.length) {
    const done = t.subtasks.filter(s => s.completed).length;
    meta.appendChild(el("span", { class: "badge" }, `${done}/${t.subtasks.length} subtarefas`));
  }
  if (t.notifications && t.notifications.length) {
    meta.appendChild(el("span", { class: "badge" }, `🔔 ${t.notifications.length}`));
  }
  meta.appendChild(el("span", { class: "badge" }, IMP_LABEL[t.importance]));
  body.appendChild(meta);

  if (t.tags && t.tags.length) {
    const pills = el("div", { class: "task-tag-pills" });
    tagsOf(t).forEach(tag => {
      const p = el("span", { class: "tag-pill" }, tag.name);
      p.style.background = tag.color;
      pills.appendChild(p);
    });
    body.appendChild(pills);
  }

  if (t.subtasks && t.subtasks.length) {
    const total = t.subtasks.length;
    const done = t.subtasks.filter(s => s.completed).length;
    const bar = el("div", { class: "subtasks-progress" });
    const span = el("span");
    span.style.width = `${(done / total) * 100}%`;
    bar.appendChild(span);
    body.appendChild(bar);
  }

  card.appendChild(body);
  card.addEventListener("click", () => openTaskModal(t.id));
  return card;
}

function unitShort(u, n) {
  const map = { days: ["dia", "dias"], weeks: ["semana", "semanas"], months: ["mês", "meses"] };
  const [s, p] = map[u] || ["", ""];
  return n === 1 ? s : p;
}

/* ===== Pendentes (filtered) ===== */

function renderPending(root) {
  const f = state.filters;
  const filters = el("section", { class: "filters" });
  const search = el("input", { type: "text", placeholder: "Buscar título ou descrição...", value: f.q });
  search.addEventListener("input", () => { f.q = search.value; renderPendingList(listEl); });
  filters.appendChild(search);

  const row = el("div", { class: "row" });
  const typeSel = el("select");
  ["all", "oneoff", "routine"].forEach(v => {
    const o = el("option", { value: v }, v === "all" ? "Todos os tipos" : v === "oneoff" ? "Pontuais" : "Rotineiras");
    if (f.type === v) o.selected = true;
    typeSel.appendChild(o);
  });
  typeSel.addEventListener("change", () => { f.type = typeSel.value; renderPendingList(listEl); });
  row.appendChild(typeSel);

  const impSel = el("select");
  [["all", "Toda importância"], ["4", "Crítica"], ["3", "Alta"], ["2", "Média"], ["1", "Baixa"]].forEach(([v, lbl]) => {
    const o = el("option", { value: v }, lbl);
    if (f.imp === v) o.selected = true;
    impSel.appendChild(o);
  });
  impSel.addEventListener("change", () => { f.imp = impSel.value; renderPendingList(listEl); });
  row.appendChild(impSel);
  filters.appendChild(row);

  const tagFilters = el("div", { class: "tag-filters" });
  state.tags.forEach(tag => {
    const id = `tf-${tag.id}`;
    const lbl = el("label", { class: "tag-filter" });
    const input = el("input", { type: "checkbox", id });
    input.checked = f.tagIds.includes(tag.id);
    input.addEventListener("change", () => {
      if (input.checked) f.tagIds.push(tag.id);
      else f.tagIds = f.tagIds.filter(x => x !== tag.id);
      renderPendingList(listEl);
    });
    const span = el("span", {}, tag.name);
    span.style.background = tag.color;
    lbl.append(input, span);
    tagFilters.appendChild(lbl);
  });
  filters.appendChild(tagFilters);

  const showDoneLbl = el("label", { class: "toggle" });
  const showDone = el("input", { type: "checkbox" });
  showDone.checked = f.showDone;
  showDone.addEventListener("change", () => { f.showDone = showDone.checked; renderPendingList(listEl); });
  showDoneLbl.append(showDone, document.createTextNode(" Mostrar concluídas"));
  filters.appendChild(showDoneLbl);

  root.appendChild(filters);

  const listEl = el("div", { class: "task-list" });
  root.appendChild(listEl);
  renderPendingList(listEl);
}

function renderPendingList(container) {
  const f = state.filters;
  let items = state.tasks.slice();
  if (!f.showDone) items = items.filter(t => !t.completed && (t.type !== "routine" || t.active !== false));
  if (f.type !== "all") items = items.filter(t => t.type === f.type);
  if (f.imp !== "all") items = items.filter(t => String(t.importance) === f.imp);
  if (f.tagIds.length) items = items.filter(t => f.tagIds.every(id => (t.tags || []).includes(id)));
  if (f.q.trim()) {
    const q = f.q.trim().toLowerCase();
    items = items.filter(t => t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q));
  }

  // Group: atrasadas / hoje / 7 dias / depois / sem data
  const groups = { atrasadas: [], hoje: [], proximas: [], depois: [], semData: [], concluidas: [] };
  const today = todayISO();
  for (const t of items) {
    if (t.completed) { groups.concluidas.push(t); continue; }
    const due = t.type === "oneoff" ? t.deadline : t.nextDue;
    if (!due) { groups.semData.push(t); continue; }
    const d = diffDays(due, today);
    if (d < 0) groups.atrasadas.push(t);
    else if (d === 0) groups.hoje.push(t);
    else if (d <= 7) groups.proximas.push(t);
    else groups.depois.push(t);
  }

  container.innerHTML = "";
  const renderGroup = (title, list) => {
    if (!list.length) return;
    const sec = el("section", { class: "section" });
    sec.appendChild(el("h2", {}, title));
    const inner = el("div", { class: "task-list" });
    list.sort((a, b) => {
      const da = (a.type === "oneoff" ? a.deadline : a.nextDue) || "9999";
      const db = (b.type === "oneoff" ? b.deadline : b.nextDue) || "9999";
      if (da !== db) return da.localeCompare(db);
      return b.importance - a.importance;
    });
    list.forEach(t => inner.appendChild(renderTaskCard(t)));
    sec.appendChild(inner);
    container.appendChild(sec);
  };
  renderGroup("Atrasadas", groups.atrasadas);
  renderGroup("Hoje", groups.hoje);
  renderGroup("Próximos 7 dias", groups.proximas);
  renderGroup("Depois", groups.depois);
  renderGroup("Sem data", groups.semData);
  if (f.showDone) renderGroup("Concluídas", groups.concluidas);

  if (!container.children.length) {
    container.appendChild(el("div", { class: "empty" }, "Nada por aqui."));
  }
}

/* ===== Calendar ===== */

function renderCalendar(root) {
  if (!state.calMonth) {
    const t = new Date();
    state.calMonth = { y: t.getFullYear(), m: t.getMonth() };
  }
  const { y, m } = state.calMonth;

  const header = el("div", { class: "cal-header" });
  const prev = el("button", { class: "cal-nav-btn" }, "‹");
  prev.addEventListener("click", () => {
    state.calMonth = { y: m === 0 ? y - 1 : y, m: m === 0 ? 11 : m - 1 };
    render();
  });
  const next = el("button", { class: "cal-nav-btn" }, "›");
  next.addEventListener("click", () => {
    state.calMonth = { y: m === 11 ? y + 1 : y, m: m === 11 ? 0 : m + 1 };
    render();
  });
  const monthName = new Date(y, m, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  header.append(prev, el("h2", {}, monthName.charAt(0).toUpperCase() + monthName.slice(1)), next);
  root.appendChild(header);

  const grid = el("div", { class: "cal-grid" });
  ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].forEach(d => grid.appendChild(el("div", { class: "cal-dow" }, d)));

  const first = new Date(y, m, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = todayISO();

  // padding before
  const prevDays = new Date(y, m, 0).getDate();
  for (let i = 0; i < startDow; i++) {
    const day = prevDays - startDow + 1 + i;
    grid.appendChild(makeCalCell(y, m - 1, day, true));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    grid.appendChild(makeCalCell(y, m, d, false));
  }
  const total = startDow + daysInMonth;
  const trailing = (7 - (total % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    grid.appendChild(makeCalCell(y, m + 1, i, true));
  }

  root.appendChild(grid);
}

function makeCalCell(y, m, d, outside) {
  const date = new Date(y, m, d);
  const ds = ymd(date);
  const cell = el("div", { class: "cal-day" + (outside ? " outside" : "") + (ds === todayISO() ? " today" : "") });
  cell.appendChild(el("div", { class: "num" }, String(date.getDate())));

  // routines with importance >= 1 all count per spec update
  const items = tasksOnDate(ds);
  const score = items.reduce((s, t) => s + scoreFor(t), 0);
  const dot = scoreDotStyle(score);
  if (dot) {
    const dotEl = el("div", { class: "cal-dot" });
    dotEl.style.width = dot.size + "px";
    dotEl.style.height = dot.size + "px";
    dotEl.style.background = dot.color;
    cell.appendChild(dotEl);
  }
  cell.addEventListener("click", () => openDaySheet(ds));
  return cell;
}

function openDaySheet(dateStr) {
  const items = tasksOnDate(dateStr);
  const sheet = document.getElementById("day-sheet");
  document.getElementById("day-sheet-title").textContent = parseYMD(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric"
  });
  const list = document.getElementById("day-sheet-list");
  list.innerHTML = "";
  if (!items.length) {
    list.appendChild(el("div", { class: "empty" }, "Nenhuma tarefa neste dia."));
  } else {
    const tl = el("div", { class: "task-list" });
    items.forEach(t => tl.appendChild(renderTaskCard(t)));
    list.appendChild(tl);
  }
  sheet.hidden = false;
}

/* ===== task complete & renew ===== */

function toggleComplete(id) {
  const t = state.tasks.find(x => x.id === id);
  if (!t) return;
  if (t.type === "oneoff") {
    t.completed = !t.completed;
    t.completedAt = t.completed ? new Date().toISOString() : null;
    save();
    render();
  } else {
    // open renew dialog
    state.pendingRenew = { taskId: id };
    const suggested = addInterval(todayISO(), t.intervalAmount, t.intervalUnit);
    document.getElementById("renew-text").textContent =
      `Marcando "${t.title}" como feita hoje. Sugestão de próxima ocorrência: ${fmtDateBR(suggested)}.`;
    document.getElementById("renew-date").value = suggested;
    document.getElementById("renew-modal").hidden = false;
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
  t.active = true;
  state.pendingRenew = null;
  document.getElementById("renew-modal").hidden = true;
  save();
  render();
  showToast("Rotina renovada");
  scheduleNotifications();
}

function skipRenew() {
  const { taskId } = state.pendingRenew || {};
  const t = state.tasks.find(x => x.id === taskId);
  if (!t) return;
  t.lastCompleted = new Date().toISOString();
  t.active = false;
  state.pendingRenew = null;
  document.getElementById("renew-modal").hidden = true;
  save();
  render();
  showToast("Rotina pausada");
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
  renderNotifications();

  state.draftTagIds = t?.tags ? [...t.tags] : [];
  renderTagSelector();

  document.getElementById("mic-status").textContent = "";
  document.getElementById("modal").hidden = false;
  document.getElementById("title").focus();
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
  const map = { hours: ["hora", "horas"], days: ["dia", "dias"], weeks: ["semana", "semanas"] };
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
    wrap.appendChild(el("p", { class: "hint" }, "Nenhuma tag. Crie em \"Gerenciar tags\"."));
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
    notifications: state.draftNotifications.slice(),
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
    base.active = existing?.active !== false;
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
function closeTagsModal() {
  document.getElementById("tags-modal").hidden = true;
}

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
  if (state.view === "pending") render();
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
    b.addEventListener("click", () => {
      state.editingTagDraft.color = c;
      renderTagColorGrid();
    });
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

/* ===== Audio parser ===== */

const NUM_WORDS = { um:1, uma:1, dois:2, duas:2, "três":3, tres:3, quatro:4, cinco:5, seis:6, sete:7, oito:8, nove:9, dez:10 };
function wordToNum(w) { return Number(w) || NUM_WORDS[w.toLowerCase()] || 1; }
function unitMap(s) {
  s = s.toLowerCase();
  if (s.startsWith("dia")) return "days";
  if (s.startsWith("semana")) return "weeks";
  return "months";
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

  // importance
  if (/\b(urgent[ie]|cr[ií]tic[oa])\b/.test(lower)) { result.importance = 4; consumed.push(/\b(urgente|cr[ií]tic[oa])\b/gi); }
  else if (/\b(importante|priorit[áa]ri[oa]|alta prioridade)\b/.test(lower)) { result.importance = 3; consumed.push(/\b(importante|priorit[áa]ri[oa]|alta prioridade)\b/gi); }
  else if (/\b(tranquil[oa]|sem pressa|qualquer hora|baixa prioridade)\b/.test(lower)) { result.importance = 1; consumed.push(/\b(tranquil[oa]|sem pressa|qualquer hora|baixa prioridade)\b/gi); }

  // routine: "a cada X unidade"
  let m = lower.match(/a cada\s+(\d+|um|uma|dois|duas|tr[eê]s|quatro|cinco|seis|sete|oito|nove|dez)\s+(dias?|semanas?|m[eê]s(?:es)?)/);
  if (m) {
    result.type = "routine";
    result.intervalAmount = wordToNum(m[1]);
    result.intervalUnit = unitMap(m[2]);
    consumed.push(/a cada\s+(\d+|um|uma|dois|duas|tr[eê]s|quatro|cinco|seis|sete|oito|nove|dez)\s+(dias?|semanas?|m[eê]s(?:es)?)/gi);
  } else if (/\b(todo dia|todos os dias|diariamente|diári[oa])\b/.test(lower)) {
    result.type = "routine"; result.intervalAmount = 1; result.intervalUnit = "days";
    consumed.push(/\b(todo dia|todos os dias|diariamente|diári[oa])\b/gi);
  } else if (/\b(toda semana|semanalmente|semanal)\b/.test(lower)) {
    result.type = "routine"; result.intervalAmount = 1; result.intervalUnit = "weeks";
    consumed.push(/\b(toda semana|semanalmente|semanal)\b/gi);
  } else if (/\b(todo m[eê]s|mensalmente|mensal)\b/.test(lower)) {
    result.type = "routine"; result.intervalAmount = 1; result.intervalUnit = "months";
    consumed.push(/\b(todo m[eê]s|mensalmente|mensal)\b/gi);
  }

  // dates
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

  // clean title
  let clean = text;
  consumed.forEach(rx => { clean = clean.replace(rx, " "); });
  clean = clean.replace(/\s+/g, " ").replace(/\s+([,.;!?])/g, "$1").trim();
  clean = clean.replace(/^(de\s+|para\s+|às\s+|as\s+|no\s+|na\s+|em\s+)/i, "").trim();
  if (clean) clean = clean.charAt(0).toUpperCase() + clean.slice(1);

  // subtasks: split if separators
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
  if (!SR) {
    micBtn.disabled = true;
    status.textContent = "Voz indisponível neste navegador";
    return;
  }
  const rec = new SR();
  rec.lang = "pt-BR";
  rec.interimResults = true;
  rec.continuous = false;
  let finalText = "";
  rec.onstart = () => { micBtn.classList.add("recording"); status.textContent = "Ouvindo..."; finalText = ""; };
  rec.onresult = e => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript;
      else interim += r[0].transcript;
    }
    status.textContent = (finalText + " " + interim).trim() || "Ouvindo...";
  };
  rec.onerror = e => {
    micBtn.classList.remove("recording");
    status.textContent = e.error === "not-allowed" ? "Permissão de microfone negada" : `Erro: ${e.error}`;
  };
  rec.onend = () => {
    micBtn.classList.remove("recording");
    if (finalText.trim()) {
      const p = parseSpeech(finalText.trim());
      applyParsed(p);
      status.textContent = "Sugestão pronta. Confira e ajuste.";
    } else if (!status.textContent.startsWith("Erro") && !status.textContent.startsWith("Permissão")) {
      status.textContent = "Nada capturado.";
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

function unitToMs(u) { return ({ minutes: 60000, hours: 3600000, days: 86400000, weeks: 604800000 })[u] || 0; }

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
    if (t.type === "routine" && t.active === false) continue;
    const baseMs = dueMsFor(t);
    if (!baseMs) continue;
    for (const n of t.notifications || []) {
      const trigger = baseMs - n.amount * unitToMs(n.unit);
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
  // Daily digests next 2 occurrences
  for (let i = 0; i < 2; i++) {
    const d9 = nextOccurrenceOfTime(9, 0, i);
    const d22 = nextOccurrenceOfTime(22, 0, i);
    items.push(buildDigestItem(d9, "morning"));
    items.push(buildDigestItem(d22, "evening"));
  }
  return items.filter(Boolean);
}

function nextOccurrenceOfTime(h, m, addDays = 0) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  if (d.getTime() < Date.now() && addDays === 0) d.setDate(d.getDate() + 1);
  d.setDate(d.getDate() + addDays);
  return d.getTime();
}

function buildDigestItem(triggerMs, kind) {
  const date = new Date(triggerMs);
  const targetISO = ymd(kind === "morning" ? date : new Date(triggerMs + 86400000));
  const items = tasksOnDate(targetISO);
  if (!items.length) return null;
  const lines = items.slice(0, 6).map(t => `• ${t.title}`);
  return {
    id: `d|${kind}|${ymd(date)}`,
    title: kind === "morning" ? "Suas tarefas de hoje" : "Tarefas de amanhã",
    body: lines.join("\n") + (items.length > lines.length ? `\n+${items.length - lines.length} mais` : ""),
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
      try { new Notification(it.title, { body: it.body, tag: it.id }); } catch {}
      notified.add(it.id);
    }
  }
  // gc old
  for (const id of [...notified]) {
    if (!allIds.has(id)) {
      const parts = id.split("|");
      const baseMs = Number(parts[2] || 0);
      if (baseMs && baseMs < now - 2 * 86400000) notified.delete(id);
    }
  }
  saveNotified(notified);
}

/* ===== install ===== */

function setupInstall() {
  const btn = document.getElementById("install-btn");
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    state.installPrompt = e;
    btn.hidden = false;
  });
  btn.addEventListener("click", async () => {
    if (!state.installPrompt) return;
    state.installPrompt.prompt();
    await state.installPrompt.userChoice;
    state.installPrompt = null;
    btn.hidden = true;
  });
  window.addEventListener("appinstalled", () => { btn.hidden = true; });
}

/* ===== util ===== */

function showToast(msg, ms = 2200) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { t.hidden = true; }, ms);
}

/* ===== wiring ===== */

function setupUI() {
  document.querySelectorAll(".tab").forEach(b => {
    b.addEventListener("click", () => setView(b.dataset.view));
  });
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

  document.getElementById("close-renew").addEventListener("click", () => {
    document.getElementById("renew-modal").hidden = true;
    state.pendingRenew = null;
  });
  document.getElementById("renew-confirm-btn").addEventListener("click", confirmRenew);
  document.getElementById("renew-skip-btn").addEventListener("click", skipRenew);

  document.getElementById("close-day-sheet").addEventListener("click", () => {
    document.getElementById("day-sheet").hidden = true;
  });
  document.getElementById("day-sheet").addEventListener("click", e => {
    if (e.target.id === "day-sheet") document.getElementById("day-sheet").hidden = true;
  });
}

async function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  try { await navigator.serviceWorker.register("./sw.js"); } catch {}
}

async function init() {
  load();
  setupUI();
  setupSpeech();
  setupInstall();
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
