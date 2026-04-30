const STORAGE_KEY = "minhas-tarefas/v1";
const NOTIFIED_KEY = "minhas-tarefas/notified";

const state = {
  tasks: [],
  view: "today",
  editingId: null,
  draftSubtasks: [],
  draftNotifications: [],
  recognition: null,
  installPrompt: null,
};

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.tasks = raw ? JSON.parse(raw) : [];
  } catch {
    state.tasks = [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function getNotifiedSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(NOTIFIED_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveNotifiedSet(set) {
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...set]));
}

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function nextOccurrence(task, from = new Date()) {
  if (task.type !== "routine" || !task.recurrence) return null;
  const r = task.recurrence;
  const [hh, mm] = (r.time || "09:00").split(":").map(Number);
  const candidate = new Date(from);
  candidate.setHours(hh, mm, 0, 0);

  if (r.type === "daily") {
    if (candidate <= from) candidate.setDate(candidate.getDate() + 1);
    return candidate;
  }
  if (r.type === "weekly") {
    const days = (r.daysOfWeek && r.daysOfWeek.length) ? r.daysOfWeek : [from.getDay()];
    for (let i = 0; i < 8; i++) {
      const d = new Date(candidate);
      d.setDate(candidate.getDate() + i);
      if (days.includes(d.getDay()) && d > from) return d;
    }
    return null;
  }
  if (r.type === "monthly") {
    const day = r.dayOfMonth || 1;
    const d = new Date(from.getFullYear(), from.getMonth(), day, hh, mm, 0, 0);
    if (d <= from) d.setMonth(d.getMonth() + 1);
    return d;
  }
  return null;
}

function isRoutinePendingToday(task) {
  if (task.type !== "routine") return false;
  const today = startOfDay();
  if (task.lastCompleted && sameDay(new Date(task.lastCompleted), today)) return false;
  const r = task.recurrence;
  if (!r) return false;
  const dow = today.getDay();
  if (r.type === "daily") return true;
  if (r.type === "weekly") return (r.daysOfWeek || []).includes(dow);
  if (r.type === "monthly") return today.getDate() === (r.dayOfMonth || 1);
  return false;
}

function taskNextDate(task) {
  if (task.type === "oneoff") return task.deadline ? new Date(task.deadline) : null;
  return nextOccurrence(task);
}

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: d.getFullYear?.() === new Date().getFullYear() ? undefined : "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtRelative(d) {
  if (!d) return "";
  const diff = new Date(d) - new Date();
  const abs = Math.abs(diff);
  const min = Math.round(abs / 60000);
  const hours = Math.round(abs / 3600000);
  const days = Math.round(abs / 86400000);
  const past = diff < 0;
  let text;
  if (min < 60) text = `${min} min`;
  else if (hours < 24) text = `${hours} h`;
  else text = `${days} d`;
  return past ? `há ${text}` : `em ${text}`;
}

function recurrenceLabel(r) {
  if (!r) return "";
  if (r.type === "daily") return `Diário às ${r.time || "09:00"}`;
  if (r.type === "weekly") {
    const names = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const ds = (r.daysOfWeek || []).map(i => names[i]).join(", ") || "Seg";
    return `${ds} às ${r.time || "09:00"}`;
  }
  if (r.type === "monthly") return `Dia ${r.dayOfMonth || 1} às ${r.time || "09:00"}`;
  return "";
}

function unitToMs(unit) {
  return { minutes: 60000, hours: 3600000, days: 86400000, weeks: 604800000 }[unit] || 0;
}

function unitLabel(unit, n) {
  const map = {
    minutes: ["minuto", "minutos"],
    hours: ["hora", "horas"],
    days: ["dia", "dias"],
    weeks: ["semana", "semanas"],
  };
  const [s, p] = map[unit] || ["", ""];
  return n === 1 ? s : p;
}

function notificationLabel(n) {
  if (n.amount === 0) return "No horário";
  return `${n.amount} ${unitLabel(n.unit, n.amount)} antes`;
}

function getTasksForView() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  if (state.view === "today") {
    return state.tasks.filter(t => {
      if (t.completed) return false;
      if (t.type === "routine") return isRoutinePendingToday(t);
      if (!t.deadline) return false;
      return new Date(t.deadline) < tomorrowStart;
    }).sort((a, b) => {
      const da = taskNextDate(a)?.getTime() ?? 0;
      const db = taskNextDate(b)?.getTime() ?? 0;
      return da - db;
    });
  }
  if (state.view === "upcoming") {
    return state.tasks.filter(t => {
      if (t.completed || t.type === "routine") return false;
      if (!t.deadline) return true;
      return new Date(t.deadline) >= tomorrowStart;
    }).sort((a, b) => {
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return da - db;
    });
  }
  if (state.view === "routines") {
    return state.tasks.filter(t => t.type === "routine" && !t.completed)
      .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  }
  if (state.view === "done") {
    return state.tasks.filter(t => t.completed)
      .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
  }
  return [];
}

function render() {
  document.querySelectorAll(".tab").forEach(b => {
    b.classList.toggle("active", b.dataset.view === state.view);
  });

  const list = document.getElementById("task-list");
  const tasks = getTasksForView();
  list.innerHTML = "";

  if (!tasks.length) {
    const messages = {
      today: "Nada para hoje. Aproveite!",
      upcoming: "Nenhuma tarefa pontual futura.",
      routines: "Nenhuma rotina cadastrada.",
      done: "Nenhuma tarefa concluída ainda.",
    };
    const div = document.createElement("div");
    div.className = "empty";
    div.textContent = messages[state.view];
    list.appendChild(div);
    return;
  }

  for (const t of tasks) {
    list.appendChild(renderTaskCard(t));
  }
}

function renderTaskCard(t) {
  const card = document.createElement("article");
  card.className = "task";
  if (t.type === "routine") card.classList.add("routine");
  if (t.completed) card.classList.add("completed");

  const deadline = t.type === "oneoff" && t.deadline ? new Date(t.deadline) : null;
  const overdue = deadline && deadline < new Date() && !t.completed;
  if (overdue) card.classList.add("overdue");

  const checked = t.completed || (t.type === "routine" && !isRoutinePendingToday(t));

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = checked;
  checkbox.addEventListener("click", e => {
    e.stopPropagation();
    toggleComplete(t.id);
  });

  const body = document.createElement("div");
  body.className = "task-body";

  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = t.title;
  body.appendChild(title);

  const meta = document.createElement("div");
  meta.className = "task-meta";

  if (t.type === "routine") {
    const b = document.createElement("span");
    b.className = "badge";
    b.textContent = recurrenceLabel(t.recurrence);
    meta.appendChild(b);
  } else if (deadline) {
    const b = document.createElement("span");
    b.className = "badge" + (overdue ? " danger" : "");
    b.textContent = fmtDate(deadline) + " · " + fmtRelative(deadline);
    meta.appendChild(b);
  }

  if (t.subtasks && t.subtasks.length) {
    const done = t.subtasks.filter(s => s.completed).length;
    const b = document.createElement("span");
    b.className = "badge";
    b.textContent = `${done}/${t.subtasks.length} subtarefas`;
    meta.appendChild(b);
  }

  if (t.notifications && t.notifications.length) {
    const b = document.createElement("span");
    b.className = "badge";
    b.textContent = `🔔 ${t.notifications.length}`;
    meta.appendChild(b);
  }

  body.appendChild(meta);

  if (t.subtasks && t.subtasks.length) {
    const total = t.subtasks.length;
    const done = t.subtasks.filter(s => s.completed).length;
    const bar = document.createElement("div");
    bar.className = "subtasks-progress";
    const span = document.createElement("span");
    span.style.width = `${(done / total) * 100}%`;
    bar.appendChild(span);
    body.appendChild(bar);
  }

  card.append(checkbox, body);
  card.addEventListener("click", () => openModal(t.id));
  return card;
}

function toggleComplete(id) {
  const t = state.tasks.find(t => t.id === id);
  if (!t) return;
  if (t.type === "routine") {
    if (t.lastCompleted && sameDay(new Date(t.lastCompleted), new Date())) {
      t.lastCompleted = null;
    } else {
      t.lastCompleted = new Date().toISOString();
    }
  } else {
    t.completed = !t.completed;
    t.completedAt = t.completed ? new Date().toISOString() : null;
  }
  save();
  render();
}

function openModal(id = null) {
  state.editingId = id;
  const t = id ? state.tasks.find(t => t.id === id) : null;

  document.getElementById("modal-title").textContent = t ? "Editar tarefa" : "Nova tarefa";
  document.getElementById("delete-btn").hidden = !t;
  document.getElementById("title").value = t?.title || "";
  document.getElementById("description").value = t?.description || "";

  const type = t?.type || "oneoff";
  document.querySelector(`input[name="type"][value="${type}"]`).checked = true;
  toggleTypeFields(type);

  document.getElementById("deadline").value = t?.deadline ? t.deadline.slice(0, 16) : "";

  state.draftSubtasks = t?.subtasks ? JSON.parse(JSON.stringify(t.subtasks)) : [];
  renderSubtasks();

  state.draftNotifications = t?.notifications ? JSON.parse(JSON.stringify(t.notifications)) : [];
  renderNotifications();

  const r = t?.recurrence || {};
  document.getElementById("recurrence-type").value = r.type || "daily";
  document.getElementById("routine-time").value = r.time || "09:00";
  document.getElementById("day-of-month").value = r.dayOfMonth || 1;
  document.querySelectorAll(".weekdays input").forEach(cb => {
    cb.checked = (r.daysOfWeek || []).includes(Number(cb.value));
  });
  toggleRecurrenceFields(r.type || "daily");

  document.getElementById("modal").hidden = false;
  document.getElementById("title").focus();
}

function closeModal() {
  document.getElementById("modal").hidden = true;
  state.editingId = null;
  state.draftSubtasks = [];
  state.draftNotifications = [];
  document.getElementById("mic-status").textContent = "";
}

function toggleTypeFields(type) {
  document.getElementById("oneoff-fields").hidden = type !== "oneoff";
  document.getElementById("routine-fields").hidden = type !== "routine";
}

function toggleRecurrenceFields(type) {
  document.getElementById("weekly-fields").hidden = type !== "weekly";
  document.getElementById("monthly-field").hidden = type !== "monthly";
}

function renderSubtasks() {
  const ul = document.getElementById("subtasks-list");
  ul.innerHTML = "";
  state.draftSubtasks.forEach((s, i) => {
    const li = document.createElement("li");
    if (s.completed) li.classList.add("done");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!s.completed;
    cb.addEventListener("change", () => {
      state.draftSubtasks[i].completed = cb.checked;
      renderSubtasks();
    });

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = s.title;

    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "remove-btn";
    rm.textContent = "×";
    rm.addEventListener("click", () => {
      state.draftSubtasks.splice(i, 1);
      renderSubtasks();
    });

    li.append(cb, span, rm);
    ul.appendChild(li);
  });
}

function renderNotifications() {
  const ul = document.getElementById("notifications-list");
  ul.innerHTML = "";
  state.draftNotifications.forEach((n, i) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.className = "text";
    span.textContent = notificationLabel(n);
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "remove-btn";
    rm.textContent = "×";
    rm.addEventListener("click", () => {
      state.draftNotifications.splice(i, 1);
      renderNotifications();
    });
    li.append(span, rm);
    ul.appendChild(li);
  });
}

function readForm() {
  const title = document.getElementById("title").value.trim();
  if (!title) {
    showToast("Informe um título");
    return null;
  }
  const description = document.getElementById("description").value.trim();
  const type = document.querySelector('input[name="type"]:checked').value;
  const base = {
    id: state.editingId || uid(),
    title,
    description,
    type,
    notifications: state.draftNotifications.slice(),
    completed: false,
    completedAt: null,
    createdAt: state.editingId
      ? state.tasks.find(t => t.id === state.editingId)?.createdAt || new Date().toISOString()
      : new Date().toISOString(),
  };

  if (state.editingId) {
    const existing = state.tasks.find(t => t.id === state.editingId);
    base.completed = existing?.completed || false;
    base.completedAt = existing?.completedAt || null;
    base.lastCompleted = existing?.lastCompleted || null;
  }

  if (type === "oneoff") {
    const deadlineInput = document.getElementById("deadline").value;
    base.deadline = deadlineInput ? new Date(deadlineInput).toISOString() : null;
    base.subtasks = state.draftSubtasks.slice();
  } else {
    const recType = document.getElementById("recurrence-type").value;
    const time = document.getElementById("routine-time").value || "09:00";
    const recurrence = { type: recType, time };
    if (recType === "weekly") {
      const days = [...document.querySelectorAll(".weekdays input:checked")].map(cb => Number(cb.value));
      recurrence.daysOfWeek = days.length ? days : [new Date().getDay()];
    }
    if (recType === "monthly") {
      recurrence.dayOfMonth = Number(document.getElementById("day-of-month").value) || 1;
    }
    base.recurrence = recurrence;
  }
  return base;
}

function saveTask(e) {
  e.preventDefault();
  const task = readForm();
  if (!task) return;
  const idx = state.tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) state.tasks[idx] = task;
  else state.tasks.push(task);
  save();
  closeModal();
  render();
  showToast("Tarefa salva");
  scheduleAllNotifications();
}

function deleteTask() {
  if (!state.editingId) return;
  if (!confirm("Excluir esta tarefa?")) return;
  state.tasks = state.tasks.filter(t => t.id !== state.editingId);
  save();
  closeModal();
  render();
  showToast("Tarefa excluída");
}

function showToast(msg, ms = 2000) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { t.hidden = true; }, ms);
}

function setupSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn = document.getElementById("mic-btn");
  const status = document.getElementById("mic-status");

  if (!SR) {
    micBtn.disabled = true;
    micBtn.title = "Reconhecimento de voz não suportado neste navegador";
    status.textContent = "Voz indisponível neste navegador";
    return;
  }

  const recognition = new SR();
  recognition.lang = "pt-BR";
  recognition.interimResults = true;
  recognition.continuous = false;

  let finalText = "";

  recognition.onstart = () => {
    micBtn.classList.add("recording");
    status.textContent = "Ouvindo… fale agora";
    finalText = "";
  };
  recognition.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript;
      else interim += r[0].transcript;
    }
    status.textContent = (finalText + " " + interim).trim() || "Ouvindo…";
  };
  recognition.onerror = (e) => {
    micBtn.classList.remove("recording");
    status.textContent = e.error === "not-allowed"
      ? "Permissão de microfone negada"
      : `Erro: ${e.error}`;
  };
  recognition.onend = () => {
    micBtn.classList.remove("recording");
    if (finalText.trim()) {
      applyTranscript(finalText.trim());
      status.textContent = "Texto inserido. Edite se precisar.";
    } else if (!status.textContent.startsWith("Erro") && !status.textContent.startsWith("Permissão")) {
      status.textContent = "Nada capturado.";
    }
  };

  micBtn.addEventListener("click", () => {
    if (micBtn.classList.contains("recording")) {
      recognition.stop();
      return;
    }
    try {
      recognition.start();
    } catch {
      // already started
    }
  });

  state.recognition = recognition;
}

function applyTranscript(text) {
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const cleaned = text.charAt(0).toUpperCase() + text.slice(1);

  if (!titleInput.value.trim()) {
    const firstSentence = cleaned.split(/[.,;!?]/)[0].trim();
    titleInput.value = firstSentence.slice(0, 200);
    const rest = cleaned.slice(firstSentence.length + 1).trim();
    if (rest) descInput.value = (descInput.value ? descInput.value + " " : "") + rest;
  } else {
    descInput.value = (descInput.value ? descInput.value + " " : "") + cleaned;
  }

  const lower = text.toLowerCase();
  const routineHints = ["todo dia", "todos os dias", "diariamente", "toda semana", "todo mês", "todos os meses", "rotina"];
  if (routineHints.some(h => lower.includes(h))) {
    document.querySelector('input[name="type"][value="routine"]').checked = true;
    toggleTypeFields("routine");
    if (lower.includes("toda semana") || lower.includes("semanal")) {
      document.getElementById("recurrence-type").value = "weekly";
      toggleRecurrenceFields("weekly");
    } else if (lower.includes("todo mês") || lower.includes("mensal")) {
      document.getElementById("recurrence-type").value = "monthly";
      toggleRecurrenceFields("monthly");
    }
  }
}

async function ensureNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function getScheduledNotifications() {
  const now = Date.now();
  const horizon = now + 7 * 86400000;
  const items = [];

  for (const task of state.tasks) {
    if (task.completed) continue;
    const baseDate = task.type === "oneoff"
      ? (task.deadline ? new Date(task.deadline) : null)
      : nextOccurrence(task);
    if (!baseDate) continue;
    const baseMs = baseDate.getTime();

    for (const n of task.notifications || []) {
      const triggerMs = baseMs - n.amount * unitToMs(n.unit);
      if (triggerMs > now && triggerMs < horizon) {
        items.push({
          id: `${task.id}|${baseMs}|${n.amount}|${n.unit}`,
          taskId: task.id,
          title: task.title,
          body: n.amount === 0
            ? `Agora: ${task.title}`
            : `${notificationLabel(n)}: ${task.title}`,
          triggerMs,
        });
      }
    }
  }
  return items;
}

async function scheduleAllNotifications() {
  if (!(await ensureNotificationPermission())) return;
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    const items = getScheduledNotifications();
    navigator.serviceWorker.controller.postMessage({ type: "schedule", items });
  }
}

function checkDueNotifications() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = Date.now();
  const notified = getNotifiedSet();
  const items = getScheduledNotifications();
  const allCurrentIds = new Set(items.map(i => i.id));

  for (const item of items) {
    if (item.triggerMs <= now && !notified.has(item.id)) {
      try {
        new Notification(item.title, { body: item.body, tag: item.id });
      } catch {}
      notified.add(item.id);
    }
  }

  for (const id of [...notified]) {
    if (!allCurrentIds.has(id)) {
      const parts = id.split("|");
      const baseMs = Number(parts[1]);
      if (baseMs && baseMs < now - 86400000) notified.delete(id);
    }
  }

  saveNotifiedSet(notified);
}

function setupInstallPrompt() {
  const btn = document.getElementById("install-btn");
  window.addEventListener("beforeinstallprompt", (e) => {
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
  window.addEventListener("appinstalled", () => {
    btn.hidden = true;
  });
}

function setupUI() {
  document.querySelectorAll(".tab").forEach(b => {
    b.addEventListener("click", () => {
      state.view = b.dataset.view;
      render();
    });
  });

  document.getElementById("add-btn").addEventListener("click", () => openModal());
  document.getElementById("close-modal").addEventListener("click", closeModal);
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal();
  });
  document.getElementById("task-form").addEventListener("submit", saveTask);
  document.getElementById("delete-btn").addEventListener("click", deleteTask);

  document.querySelectorAll('input[name="type"]').forEach(r => {
    r.addEventListener("change", () => toggleTypeFields(r.value));
  });
  document.getElementById("recurrence-type").addEventListener("change", e => {
    toggleRecurrenceFields(e.target.value);
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
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("add-subtask-btn").click();
    }
  });

  document.getElementById("add-notif-btn").addEventListener("click", async () => {
    const amount = Number(document.getElementById("notif-amount").value);
    const unit = document.getElementById("notif-unit").value;
    if (Number.isNaN(amount) || amount < 0) return;
    state.draftNotifications.push({ amount, unit });
    renderNotifications();
    await ensureNotificationPermission();
  });
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("./sw.js");
  } catch (err) {
    console.warn("SW registration failed", err);
  }
}

async function init() {
  load();
  setupUI();
  setupSpeech();
  setupInstallPrompt();
  render();
  await registerServiceWorker();
  checkDueNotifications();
  scheduleAllNotifications();
  setInterval(() => {
    checkDueNotifications();
    if (state.view === "today") render();
  }, 30000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      checkDueNotifications();
      render();
    }
  });
}

init();
