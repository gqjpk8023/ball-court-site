const storageKey = "pair-class-planner-v2";
const passwordKey = "pair-class-admin-password";

const defaultState = {
  slots: [
    {
      id: crypto.randomUUID(),
      name: "周末口语班",
      day: "周六",
      time: "10:00",
      note: "适合基础学员",
      students: ["李同学", "王同学", "陈同学"]
    },
    {
      id: crypto.randomUUID(),
      name: "晚间提高班",
      day: "周三",
      time: "19:30",
      note: "适合有一定基础的学员",
      students: ["张同学", "赵同学"]
    }
  ]
};

let state = loadState();
let isAdmin = false;
let editingSlotId = "";

const elements = {
  passwordSetupForm: document.querySelector("#passwordSetupForm"),
  newAdminPassword: document.querySelector("#newAdminPassword"),
  adminLoginForm: document.querySelector("#adminLoginForm"),
  adminPassword: document.querySelector("#adminPassword"),
  adminMessage: document.querySelector("#adminMessage"),
  adminLogout: document.querySelector("#adminLogout"),
  adminTools: document.querySelector("#adminTools"),
  changePasswordForm: document.querySelector("#changePasswordForm"),
  changeAdminPassword: document.querySelector("#changeAdminPassword"),
  passwordChangeMessage: document.querySelector("#passwordChangeMessage"),
  slotForm: document.querySelector("#slotForm"),
  slotName: document.querySelector("#slotName"),
  slotDay: document.querySelector("#slotDay"),
  slotTime: document.querySelector("#slotTime"),
  slotNote: document.querySelector("#slotNote"),
  slotSubmit: document.querySelector("#slotSubmit"),
  cancelSlotEdit: document.querySelector("#cancelSlotEdit"),
  studentForm: document.querySelector("#studentForm"),
  studentName: document.querySelector("#studentName"),
  studentSlot: document.querySelector("#studentSlot"),
  slotList: document.querySelector("#slotList"),
  studentCount: document.querySelector("#studentCount"),
  classCount: document.querySelector("#classCount"),
  waitingCount: document.querySelector("#waitingCount"),
  exportData: document.querySelector("#exportData"),
  exportDialog: document.querySelector("#exportDialog"),
  exportText: document.querySelector("#exportText"),
  resetDemo: document.querySelector("#resetDemo")
};

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return structuredClone(defaultState);
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed.slots) ? parsed : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function hasAdminPassword() {
  return Boolean(localStorage.getItem(passwordKey));
}

function setAdminPassword(password) {
  localStorage.setItem(passwordKey, password);
}

function checkAdminPassword(password) {
  return localStorage.getItem(passwordKey) === password;
}

function requireAdmin() {
  if (isAdmin) {
    return true;
  }

  elements.adminMessage.textContent = "请先输入管理员密码。";
  elements.adminPassword.focus();
  return false;
}

function getClasses(students) {
  const classes = [];
  for (let index = 0; index < students.length; index += 2) {
    const pair = students.slice(index, index + 2);
    if (pair.length === 2) {
      classes.push(pair);
    }
  }
  return classes;
}

function getWaitingStudent(students) {
  return students.length % 2 === 1 ? students[students.length - 1] : "";
}

function render() {
  renderAdminArea();
  renderSlotOptions();
  renderSlots();
  renderSummary();
  saveState();
}

function renderAdminArea() {
  const passwordExists = hasAdminPassword();

  elements.passwordSetupForm.hidden = passwordExists;
  elements.adminLoginForm.hidden = !passwordExists || isAdmin;
  elements.adminTools.hidden = !isAdmin;
  elements.adminLogout.hidden = !isAdmin;
  elements.slotSubmit.textContent = editingSlotId ? "保存修改" : "添加时间段";
  elements.cancelSlotEdit.hidden = !editingSlotId;
}

function renderSlotOptions() {
  elements.studentSlot.innerHTML = "";

  state.slots.forEach((slot) => {
    const option = document.createElement("option");
    option.value = slot.id;
    option.textContent = `${slot.name}｜${slot.day} ${slot.time}`;
    elements.studentSlot.append(option);
  });

  elements.studentForm.querySelector("button").disabled = state.slots.length === 0;
}

function renderSummary() {
  const students = state.slots.reduce((sum, slot) => sum + slot.students.length, 0);
  const classes = state.slots.reduce((sum, slot) => sum + getClasses(slot.students).length, 0);
  const waiting = state.slots.reduce((sum, slot) => sum + (getWaitingStudent(slot.students) ? 1 : 0), 0);

  elements.studentCount.textContent = students;
  elements.classCount.textContent = classes;
  elements.waitingCount.textContent = waiting;
}

function renderSlots() {
  elements.slotList.innerHTML = "";

  if (state.slots.length === 0) {
    elements.slotList.innerHTML = `<div class="empty-state">还没有上课时间。请联系管理员添加时间段。</div>`;
    return;
  }

  state.slots.forEach((slot) => {
    const classes = getClasses(slot.students);
    const waitingStudent = getWaitingStudent(slot.students);
    const article = document.createElement("article");
    article.className = "slot-card";
    article.innerHTML = `
      <div class="slot-title">
        <div>
          <strong>${escapeHtml(slot.name)}</strong>
          <span>${escapeHtml(slot.day)} ${escapeHtml(slot.time)}${slot.note ? ` · ${escapeHtml(slot.note)}` : ""}</span>
        </div>
        ${isAdmin ? `
          <div class="slot-actions">
            <button class="secondary-button compact-button" type="button" data-edit-slot="${slot.id}">编辑</button>
            <button class="danger-button" type="button" data-delete-slot="${slot.id}">删除时间段</button>
          </div>
        ` : ""}
      </div>
      <div class="slot-body">
        ${classes.length ? `<div class="class-grid">${classes.map((pair, index) => renderClassCard(pair, index, slot.id)).join("")}</div>` : ""}
        ${waitingStudent ? renderWaitingCard(waitingStudent, slot.id) : ""}
        ${!classes.length && !waitingStudent ? `<div class="empty-state">这个时间段还没有学员报名。</div>` : ""}
      </div>
    `;
    elements.slotList.append(article);
  });
}

function renderClassCard(pair, index, slotId) {
  return `
    <div class="class-card">
      <div class="card-kicker">
        <span>第 ${index + 1} 班</span>
        ${isAdmin ? `<button class="danger-button" type="button" data-remove-class="${slotId}" data-class-index="${index}">移除</button>` : ""}
      </div>
      <div class="student-pair">
        ${pair.map((student) => `<span class="student-chip">${escapeHtml(student)}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderWaitingCard(student, slotId) {
  return `
    <div class="waiting-card">
      <div class="card-kicker">
        <span>等待配对</span>
        ${isAdmin ? `<button class="danger-button" type="button" data-remove-student="${slotId}" data-student-name="${escapeHtml(student)}">移除</button>` : ""}
      </div>
      <div class="student-pair">
        <span class="student-chip">${escapeHtml(student)}</span>
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function addSlot(event) {
  event.preventDefault();
  if (!requireAdmin()) {
    return;
  }

  const slotValues = {
    name: elements.slotName.value.trim(),
    day: elements.slotDay.value,
    time: elements.slotTime.value,
    note: elements.slotNote.value.trim()
  };

  if (editingSlotId) {
    const slot = state.slots.find((item) => item.id === editingSlotId);
    if (slot) {
      Object.assign(slot, slotValues);
    }
  } else {
    state.slots.push({
      id: crypto.randomUUID(),
      ...slotValues,
      students: []
    });
  }

  resetSlotForm();
  render();
}

function editSlot(slotId) {
  if (!requireAdmin()) {
    return;
  }

  const slot = state.slots.find((item) => item.id === slotId);
  if (!slot) {
    return;
  }

  editingSlotId = slot.id;
  elements.slotName.value = slot.name;
  elements.slotDay.value = slot.day;
  elements.slotTime.value = slot.time;
  elements.slotNote.value = slot.note;
  renderAdminArea();
  elements.slotName.focus();
}

function resetSlotForm() {
  editingSlotId = "";
  elements.slotForm.reset();
  elements.slotTime.value = "10:00";
  renderAdminArea();
}

function addStudent(event) {
  event.preventDefault();

  const studentName = elements.studentName.value.trim();
  const slot = state.slots.find((item) => item.id === elements.studentSlot.value);
  if (!slot || !studentName) {
    return;
  }

  if (slot.students.includes(studentName)) {
    elements.studentName.setCustomValidity("这个学员已经报名了当前时间段");
    elements.studentName.reportValidity();
    return;
  }

  elements.studentName.setCustomValidity("");
  slot.students.push(studentName);
  elements.studentForm.reset();
  render();
}

function removeSlot(slotId) {
  if (!requireAdmin()) {
    return;
  }

  state.slots = state.slots.filter((slot) => slot.id !== slotId);
  if (editingSlotId === slotId) {
    resetSlotForm();
  }
  render();
}

function removeClass(slotId, classIndex) {
  if (!requireAdmin()) {
    return;
  }

  const slot = state.slots.find((item) => item.id === slotId);
  if (!slot) {
    return;
  }

  slot.students.splice(Number(classIndex) * 2, 2);
  render();
}

function removeStudent(slotId, studentName) {
  if (!requireAdmin()) {
    return;
  }

  const slot = state.slots.find((item) => item.id === slotId);
  if (!slot) {
    return;
  }

  slot.students = slot.students.filter((student) => student !== studentName);
  render();
}

function exportRoster() {
  const lines = state.slots.flatMap((slot) => {
    const heading = [`${slot.name}｜${slot.day} ${slot.time}${slot.note ? `｜${slot.note}` : ""}`];
    const classLines = getClasses(slot.students).map((pair, index) => {
      return `第 ${index + 1} 班：${pair.join("、")}`;
    });
    const waitingStudent = getWaitingStudent(slot.students);
    const waitingLine = waitingStudent ? [`等待配对：${waitingStudent}`] : [];
    return [...heading, ...classLines, ...waitingLine, ""];
  });

  elements.exportText.value = lines.join("\n").trim() || "暂无组班数据";
  elements.exportDialog.showModal();
}

elements.passwordSetupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  setAdminPassword(elements.newAdminPassword.value);
  isAdmin = true;
  elements.newAdminPassword.value = "";
  elements.adminMessage.textContent = "";
  render();
});

elements.adminLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!checkAdminPassword(elements.adminPassword.value)) {
    elements.adminMessage.textContent = "密码不正确，请重新输入。";
    elements.adminPassword.select();
    return;
  }

  isAdmin = true;
  elements.adminPassword.value = "";
  elements.adminMessage.textContent = "";
  render();
});

elements.adminLogout.addEventListener("click", () => {
  isAdmin = false;
  elements.passwordChangeMessage.textContent = "";
  render();
});

elements.changePasswordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireAdmin()) {
    return;
  }

  setAdminPassword(elements.changeAdminPassword.value);
  elements.changeAdminPassword.value = "";
  elements.passwordChangeMessage.textContent = "密码已更新。";
});

elements.slotForm.addEventListener("submit", addSlot);
elements.cancelSlotEdit.addEventListener("click", resetSlotForm);
elements.studentForm.addEventListener("submit", addStudent);
elements.exportData.addEventListener("click", exportRoster);
elements.resetDemo.addEventListener("click", () => {
  if (!requireAdmin()) {
    return;
  }

  state = structuredClone(defaultState);
  render();
});

elements.slotList.addEventListener("click", (event) => {
  const deleteSlotButton = event.target.closest("[data-delete-slot]");
  const editSlotButton = event.target.closest("[data-edit-slot]");
  const removeClassButton = event.target.closest("[data-remove-class]");
  const removeStudentButton = event.target.closest("[data-remove-student]");

  if (editSlotButton) {
    editSlot(editSlotButton.dataset.editSlot);
  }

  if (deleteSlotButton) {
    removeSlot(deleteSlotButton.dataset.deleteSlot);
  }

  if (removeClassButton) {
    removeClass(removeClassButton.dataset.removeClass, removeClassButton.dataset.classIndex);
  }

  if (removeStudentButton) {
    removeStudent(removeStudentButton.dataset.removeStudent, removeStudentButton.dataset.studentName);
  }
});

render();
