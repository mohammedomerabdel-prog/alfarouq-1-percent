
(() => {
  "use strict";

  /* =========================================
     AL-FAROUQ 1% — رحلة التغيير
     ========================================= */

  const STORAGE_KEY = "alfarouq_1_percent_data_v3";
  const LEGACY_KEYS = [
    "alfarouq_1_percent_data",
    "alfarouq_1_percent_data_v2"
  ];

  const HABITS = [
    "prayer",
    "study",
    "exercise",
    "phone",
    "sleep",
    "discipline"
  ];

  const HABIT_LABELS = {
    prayer: "الصلاة",
    study: "الدراسة",
    exercise: "الرياضة",
    phone: "تقليل استخدام الهاتف",
    sleep: "النوم المنتظم",
    discipline: "الانضباط"
  };

  const PRAYERS = ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"];

  let toastTimer = null;
  let selectedDetailDate = null;

  const $ = id => document.getElementById(id);

  /* =========================================
     التاريخ
     ========================================= */

  function localDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const today = localDateKey();

  function parseDate(key) {
    const [year, month, day] = String(key).split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function formatDate(key) {
    if (!key) return "غير محدد";

    return new Intl.DateTimeFormat("ar", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(parseDate(key));
  }

  function dateDifference(first, second) {
    const a = parseDate(first);
    const b = parseDate(second);
    return Math.round((b - a) / 86400000);
  }

  function isValidDateKey(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
  }

  /* =========================================
     البيانات والحفظ
     ========================================= */

  function freshData() {
    return {
      version: 4,
      startDate: today,
      days: {},
      tasks: [],
      sleep: {},
      faith: {},
      health: {},
      commute: {},
      reviews: {}
    };
  }

  function normalizeData(saved) {
    const base = freshData();

    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      return base;
    }

    const result = {
      ...base,
      ...saved,
      days: saved.days && typeof saved.days === "object" ? saved.days : {},
      tasks: Array.isArray(saved.tasks) ? saved.tasks : [],
      sleep: saved.sleep && typeof saved.sleep === "object" ? saved.sleep : {},
      faith: saved.faith && typeof saved.faith === "object" ? saved.faith : {},
      health: saved.health && typeof saved.health === "object" ? saved.health : {},
      commute: saved.commute && typeof saved.commute === "object" ? saved.commute : {},
      reviews: saved.reviews && typeof saved.reviews === "object" ? saved.reviews : {}
    };

    if (!isValidDateKey(result.startDate)) {
      result.startDate = today;
    }

    Object.keys(result.days).forEach(key => {
      const record = result.days[key];

      if (!record || typeof record !== "object" || Array.isArray(record)) {
        result.days[key] = {};
      }

      const day = result.days[key];

      if (!Array.isArray(day.habits)) day.habits = [];
      if (!Array.isArray(day.prayers)) day.prayers = [];
    });

    result.tasks = result.tasks
      .filter(task => task && typeof task === "object")
      .map((task, index) => ({
        id: task.id || `imported-${index}-${Date.now()}`,
        title: String(task.title || "مهمة بدون عنوان"),
        subject: String(task.subject || "بدون مادة"),
        due: isValidDateKey(task.due) ? task.due : "",
        done: Boolean(task.done),
        createdAt: isValidDateKey(task.createdAt) ? task.createdAt : today,
        completedAt: isValidDateKey(task.completedAt) ? task.completedAt : ""
      }));

    return result;
  }

  function loadData() {
    try {
      const current = localStorage.getItem(STORAGE_KEY);

      if (current) {
        return normalizeData(JSON.parse(current));
      }

      for (const key of LEGACY_KEYS) {
        const oldValue = localStorage.getItem(key);

        if (oldValue) {
          const migrated = normalizeData(JSON.parse(oldValue));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        }
      }
    } catch (error) {
      console.error("تعذر تحميل البيانات:", error);
    }

    return freshData();
  }

  const data = loadData();

  function ensureToday() {
    let day = data.days[today];

    if (!day || typeof day !== "object" || Array.isArray(day)) {
      day = {};
      data.days[today] = day;
    }

    if (!Array.isArray(day.habits)) day.habits = [];
    if (!Array.isArray(day.prayers)) day.prayers = [];

    if (
      !data.health[today] ||
      typeof data.health[today] !== "object"
    ) {
      data.health[today] = { water: 0, exercise: 0 };
    }

    const health = data.health[today];

    health.water = Math.max(0, Number(health.water) || 0);
    health.exercise = Math.max(0, Number(health.exercise) || 0);

    if (
      !data.commute[today] ||
      typeof data.commute[today] !== "object"
    ) {
      data.commute[today] = {
        outbound: false,
        return: false
      };
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("تعذر حفظ البيانات:", error);
      showToast("تعذر الحفظ. صدّر نسخة احتياطية من بياناتك.");
      return false;
    }
  }

  ensureToday();

  /* =========================================
     رسائل التنبيه
     ========================================= */

  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = value;
  }

  /* =========================================
     التاريخ والقائمة الجانبية
     ========================================= */

  const dateElement = $("currentDate");

  if (dateElement) {
    dateElement.textContent = formatDate(today);
  }

  const menuButton = $("menuButton");
  const navigation = $("navigation");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const opened = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(opened));
    });

    navigation.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* =========================================
     سجل اليوم
     ========================================= */

  function getTodayRecord() {
    ensureToday();
    return data.days[today];
  }

  function getDayRecord(key) {
    const record = data.days[key];

    if (!record || typeof record !== "object" || Array.isArray(record)) {
      return {
        habits: [],
        prayers: []
      };
    }

    return {
      ...record,
      habits: Array.isArray(record.habits) ? record.habits : [],
      prayers: Array.isArray(record.prayers) ? record.prayers : []
    };
  }

  function hasDayActivity(key) {
    const day = getDayRecord(key);
    const health = data.health[key] || {};
    const commute = data.commute[key] || {};
    const review = data.reviews[key] || {};

    return (
      day.habits.length > 0 ||
      day.prayers.length > 0 ||
      Number(health.water) > 0 ||
      Number(health.exercise) > 0 ||
      Boolean(data.sleep[key]) ||
      Boolean(data.faith[key]) ||
      Boolean(commute.outbound) ||
      Boolean(commute.return) ||
      Boolean(review.done) ||
      Boolean(review.next) ||
      data.tasks.some(task => task.createdAt === key || task.completedAt === key)
    );
  }

  /* =========================================
     العادات اليومية
     ========================================= */

  document.querySelectorAll("[data-habit]").forEach(input => {
    const key = input.dataset.habit;

    if (!HABITS.includes(key)) return;

    input.checked = getTodayRecord().habits.includes(key);

    input.addEventListener("change", () => {
      const day = getTodayRecord();

      if (input.checked && !day.habits.includes(key)) {
        day.habits.push(key);
      }

      if (!input.checked) {
        day.habits = day.habits.filter(item => item !== key);
      }

      save();
      updateDashboard();
      renderJourneyLog();
    });
  });

  /* =========================================
     النوم
     ========================================= */

  const sleepStart = $("sleepStart");
  const sleepEnd = $("sleepEnd");
  const sleepForm = $("sleepForm");
  const sleepResult = $("sleepResult");

  function sleepDuration(start, end) {
    if (!start || !end) return 0;

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    let minutes = (eh * 60 + em) - (sh * 60 + sm);

    if (minutes <= 0) minutes += 1440;

    return minutes;
  }

  function renderSleepResult() {
    const record = data.sleep[today];

    if (!record || !sleepResult) return;

    const minutes = sleepDuration(record.start, record.end);
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    sleepResult.textContent =
      `سجلت ${hours} ساعة و${remaining} دقيقة من النوم.`;
  }

  if (data.sleep[today]) {
    if (sleepStart) sleepStart.value = data.sleep[today].start || "21:00";
    if (sleepEnd) sleepEnd.value = data.sleep[today].end || "04:00";
    renderSleepResult();
  }

  if (sleepForm) {
    sleepForm.addEventListener("submit", event => {
      event.preventDefault();

      if (!sleepStart || !sleepEnd || !sleepStart.value || !sleepEnd.value) {
        showToast("أدخل وقت النوم والاستيقاظ أولاً");
        return;
      }

      data.sleep[today] = {
        start: sleepStart.value,
        end: sleepEnd.value
      };

      save();
      renderSleepResult();
      updateDashboard();
      renderJourneyLog();

      showToast("تم حفظ سجل النوم");
    });
  }

  /* =========================================
     المواد والمهام الدراسية
     ========================================= */

  const DEFAULT_SUBJECTS = [
    "السلوك التنظيمي",
    "الإدارة باللغة الإنجليزية",
    "المحاسبة المالية",
    "الاقتصاد",
    "القانون التجاري",
    "المصارف",
    "الإحصاء",
    "الحاسوب"
  ];

  const subjects =
    window.APP_DATA &&
    Array.isArray(window.APP_DATA.subjects) &&
    window.APP_DATA.subjects.length
      ? window.APP_DATA.subjects
      : DEFAULT_SUBJECTS;

  const subjectSelect = $("subjectSelect");

  if (subjectSelect) {
    subjectSelect.innerHTML = "";

    subjects.forEach(subject => {
      const option = document.createElement("option");
      option.value = subject;
      option.textContent = subject;
      subjectSelect.appendChild(option);
    });
  }

  function renderTasks() {
    const list = $("taskList");
    if (!list) return;

    list.innerHTML = "";

    const sorted = [...data.tasks].sort((a, b) => {
      if (a.done !== b.done) return Number(a.done) - Number(b.done);

      return (a.due || "9999-99-99").localeCompare(
        b.due || "9999-99-99"
      );
    });

    if (!sorted.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "ما عندك مهام دراسية حالياً. أضف أول مهمة.";
      list.appendChild(empty);
    }

    sorted.forEach(task => {
      const row = document.createElement("div");
      row.className = `task-item${task.done ? " done" : ""}`;

      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = Boolean(task.done);
      check.setAttribute("aria-label", "تغيير حالة المهمة");

      check.addEventListener("change", () => {
        task.done = check.checked;
        task.completedAt = check.checked ? today : "";

        save();
        renderTasks();
        updateDashboard();
        renderJourneyLog();

        showToast(check.checked ? "أحسنت! أُنجزت المهمة" : "أُعيد فتح المهمة");
      });

      const main = document.createElement("div");
      main.className = "task-main";

      const title = document.createElement("span");
      title.className = "task-title";
      title.textContent = task.title;

      const meta = document.createElement("span");
      meta.className = "task-meta";

      const dueText = task.due
        ? ` • الموعد: ${task.due}`
        : "";

      meta.textContent = `${task.subject}${dueText}`;

      main.append(title, meta);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete-task";
      remove.textContent = "حذف";

      remove.addEventListener("click", () => {
        if (!confirm("هل تريد حذف هذه المهمة؟")) return;

        data.tasks = data.tasks.filter(item => item.id !== task.id);

        save();
        renderTasks();
        updateDashboard();
        renderJourneyLog();

        showToast("تم حذف المهمة");
      });

      row.append(check, main, remove);
      list.appendChild(row);
    });

    const completed = data.tasks.filter(task => task.done).length;
    const open = data.tasks.length - completed;

    setText("completedTaskCount", completed);
    setText("openTaskCount", open);
  }

  function addTask() {
    const titleInput = $("taskTitle");
    const dueInput = $("taskDue");

    if (!titleInput) return;

    const title = titleInput.value.trim();

    if (!title) {
      showToast("اكتب اسم المهمة أولاً");
      titleInput.focus();
      return;
    }

    const due = dueInput ? dueInput.value : "";

    data.tasks.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject: subjectSelect?.value || "بدون مادة",
      title,
      due: isValidDateKey(due) ? due : "",
      done: false,
      createdAt: today,
      completedAt: ""
    });

    titleInput.value = "";

    if (dueInput) dueInput.value = "";

    save();
    renderTasks();
    updateDashboard();
    renderJourneyLog();

    showToast("أُضيفت المهمة بنجاح");
  }

  $("addTaskButton")?.addEventListener("click", addTask);

  $("taskTitle")?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });

  /* =========================================
     الصلوات
     ========================================= */

  document.querySelectorAll("[data-prayer]").forEach(input => {
    const name = input.dataset.prayer;

    if (!PRAYERS.includes(name)) return;

    input.checked = getTodayRecord().prayers.includes(name);

    input.addEventListener("change", () => {
      const day = getTodayRecord();

      if (input.checked && !day.prayers.includes(name)) {
        day.prayers.push(name);
      }

      if (!input.checked) {
        day.prayers = day.prayers.filter(item => item !== name);
      }

      save();
      updateDashboard();
      renderJourneyLog();

      showToast("تم تحديث متابعة الصلاة");
    });
  });

  /* =========================================
     الورد والملاحظات الإيمانية
     ========================================= */

  const faithNote = $("faithNote");

  if (faithNote) {
    faithNote.value = data.faith[today] || "";
  }

  $("saveFaithButton")?.addEventListener("click", () => {
    data.faith[today] = faithNote ? faithNote.value.trim() : "";

    save();

    setText("faithFeedback", "تم حفظ الورد اليومي.");
    renderJourneyLog();

    showToast("تم حفظ الورد");
  });

  /* =========================================
     الصحة: الماء والرياضة
     ========================================= */

  function updateHealth() {
    const health = data.health[today];

    setText("waterCount", health.water);
    setText("exerciseMinutes", health.exercise);
    setText("reportWater", health.water);
    setText("reportExercise", health.exercise);
  }

  $("waterPlus")?.addEventListener("click", () => {
    data.health[today].water = Math.min(
      30,
      data.health[today].water + 1
    );

    save();
    updateHealth();
    renderJourneyLog();
  });

  $("waterMinus")?.addEventListener("click", () => {
    data.health[today].water = Math.max(
      0,
      data.health[today].water - 1
    );

    save();
    updateHealth();
    renderJourneyLog();
  });

  $("exercisePlus")?.addEventListener("click", () => {
    data.health[today].exercise = Math.min(
      1440,
      data.health[today].exercise + 5
    );

    save();
    updateHealth();
    renderJourneyLog();
  });

  $("exerciseMinus")?.addEventListener("click", () => {
    data.health[today].exercise = Math.max(
      0,
      data.health[today].exercise - 5
    );

    save();
    updateHealth();
    renderJourneyLog();
  });

  /* =========================================
     المواصلات
     ========================================= */

  document.querySelectorAll("[data-commute]").forEach(input => {
    const key = input.dataset.commute;

    if (!["outbound", "return"].includes(key)) return;

    input.checked = Boolean(data.commute[today][key]);

    input.addEventListener("change", () => {
      data.commute[today][key] = input.checked;

      save();
      renderJourneyLog();

      showToast("تم تحديث خطة المواصلات");
    });
  });

  /* =========================================
     مراجعة اليوم وخطة الغد
     ========================================= */

  const review = data.reviews[today] || {};

  if ($("dailyReview")) {
    $("dailyReview").value = review.done || "";
  }

  if ($("tomorrowPlan")) {
    $("tomorrowPlan").value = review.next || "";
  }

  $("saveReview")?.addEventListener("click", () => {
    data.reviews[today] = {
      done: $("dailyReview")?.value.trim() || "",
      next: $("tomorrowPlan")?.value.trim() || ""
    };

    save();

    setText("reviewFeedback", "تم حفظ مراجعتك. أحسنت!");

    renderJourneyLog();
    showToast("تم حفظ مراجعة اليوم");
  });

  /* =========================================
     لوحة الملخص والإحصائيات
     ========================================= */

  function updateDashboard() {
    const day = getTodayRecord();
    const completedHabits = day.habits.length;

    const progress = Math.round(
      (completedHabits / HABITS.length) * 100
    );

    setText("progressCount", `${progress}%`);
    setText("reportHabits", `${completedHabits} / ${HABITS.length}`);

    const elapsed = Math.max(
      0,
      dateDifference(data.startDate, today)
    );

    setText("dayCount", elapsed + 1);

    let streak = 0;
    const cursor = parseDate(today);

    while (true) {
      const key = localDateKey(cursor);
      const record = data.days[key];

      if (!record || !Array.isArray(record.habits) || record.habits.length === 0) {
        break;
      }

      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    setText("streakCount", streak);

    const completedTasks = data.tasks.filter(task => task.done).length;
    const openTasks = data.tasks.length - completedTasks;

    setText("taskCount", openTasks);
    setText("reportTasks", completedTasks);
  }

  /* =========================================
     سجل الرحلة اليومي
     ========================================= */

  function getLogDates() {
    const dates = new Set();

    Object.keys(data.days).forEach(key => {
      if (isValidDateKey(key) && key <= today) dates.add(key);
    });

    [
      data.sleep,
      data.faith,
      data.health,
      data.commute,
      data.reviews
    ].forEach(collection => {
      Object.keys(collection).forEach(key => {
        if (isValidDateKey(key) && key <= today) dates.add(key);
      });
    });

    data.tasks.forEach(task => {
      if (isValidDateKey(task.createdAt) && task.createdAt <= today) {
        dates.add(task.createdAt);
      }

      if (isValidDateKey(task.completedAt) && task.completedAt <= today) {
        dates.add(task.completedAt);
      }
    });

    return [...dates].sort((a, b) => b.localeCompare(a));
  }

  function getLogPeriod() {
    const selector = $("logPeriod");
    return selector ? selector.value : "7";
  }

  function getLogDescription(key) {
    const day = getDayRecord(key);
    const health = data.health[key] || {};
    const commute = data.commute[key] || {};

    const habits = day.habits.length;
    const prayers = day.prayers.length;
    const water = Number(health.water) || 0;
    const exercise = Number(health.exercise) || 0;

    const taskCount = data.tasks.filter(task =>
      task.createdAt === key || task.completedAt === key
    ).length;

    return {
      habits,
      prayers,
      water,
      exercise,
      taskCount,
      commuteCount: Number(Boolean(commute.outbound)) +
        Number(Boolean(commute.return)),
      hasSleep: Boolean(data.sleep[key]),
      percentage: Math.round((habits / HABITS.length) * 100)
    };
  }

  function renderJourneyLog() {
    const body = $("journeyLogBody");
    if (!body) return;

    const period = getLogPeriod();
    let dates = getLogDates();

    if (period !== "all") {
      const count = Number(period) || 7;
      dates = dates.slice(0, count);
    }

    body.innerHTML = "";

    if (!dates.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 5;
      cell.textContent = "لسه ما عندك سجلات. ابدأ يومك وسجّل إنجازاتك.";

      row.appendChild(cell);
      body.appendChild(row);

      setText("logDaysCount", "0");
      return;
    }

    dates.forEach(key => {
      const summary = getLogDescription(key);
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(key);

      const habitCell = document.createElement("td");
      habitCell.textContent = `${summary.habits}/${HABITS.length}`;

      const prayerCell = document.createElement("td");
      prayerCell.textContent = `${summary.prayers}/${PRAYERS.length}`;

      const healthCell = document.createElement("td");
      healthCell.textContent =
        `${summary.water} ماء • ${summary.exercise} دقيقة رياضة`;

      const actionCell = document.createElement("td");
      const button = document.createElement("button");

      button.type = "button";
      button.className = "view-day-button";
      button.textContent = "التفاصيل";

      button.addEventListener("click", () => {
        openDayDetails(key);
      });

      actionCell.appendChild(button);
      row.append(dateCell, habitCell, prayerCell, healthCell, actionCell);
      body.appendChild(row);
    });

    setText("logDaysCount", String(dates.length));
  }

  /* =========================================
     تفاصيل اليوم
     ========================================= */

  function addDetailLine(container, label, value) {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = `${label}: `;
    paragraph.append(strong, document.createTextNode(String(value)));

    container.appendChild(paragraph);
  }

  function openDayDetails(key) {
    selectedDetailDate = key;

    const panel = $("dayDetails");
    const content = $("dayDetailsContent");

    if (!panel || !content) return;

    const day = getDayRecord(key);
    const health = data.health[key] || {};
    const commute = data.commute[key] || {};
    const sleep = data.sleep[key] || {};
    const faith = data.faith[key] || "";
    const review = data.reviews[key] || {};

    content.innerHTML = "";

    const habitsText = day.habits.length
      ? day.habits.map(item => HABIT_LABELS[item] || item).join("، ")
      : "لم يتم تسجيل عادات مكتملة";

    const prayersText = day.prayers.length
      ? day.prayers.join("، ")
      : "لم يتم تسجيل صلوات";

    addDetailLine(content, "العادات", habitsText);
    addDetailLine(content, "الصلوات", prayersText);
    addDetailLine(content, "الماء", `${Number(health.water) || 0} كوب`);
    addDetailLine(content, "الرياضة", `${Number(health.exercise) || 0} دقيقة`);

    addDetailLine(
      content,
      "المواصلات",
      `الذهاب: ${commute.outbound ? "تم" : "لم يسجل"}، العودة: ${commute.return ? "تم" : "لم تسجل"}`
    );

    if (sleep.start || sleep.end) {
      const duration = sleepDuration(sleep.start, sleep.end);

      addDetailLine(
        content,
        "النوم",
        `${sleep.start || "؟"} إلى ${sleep.end || "؟"} — ${Math.floor(duration / 60)} ساعة و${duration % 60} دقيقة`
      );
    } else {
      addDetailLine(content, "النوم", "لم يتم تسجيل النوم");
    }

    addDetailLine(content, "الورد الإيماني", faith || "لا توجد ملاحظات");

    const createdTasks = data.tasks.filter(task => task.createdAt === key);
    const completedTasks = data.tasks.filter(task => task.completedAt === key);

    const taskHeading = document.createElement("h4");
    taskHeading.textContent = "المهام المرتبطة بهذا اليوم";
    content.appendChild(taskHeading);

    if (!createdTasks.length && !completedTasks.length) {
      addDetailLine(content, "المهام", "لا توجد مهام مرتبطة بهذا اليوم");
    } else {
      createdTasks.forEach(task => {
        addDetailLine(
          content,
          "مهمة أُضيفت",
          `${task.title} — ${task.subject}`
        );
      });

      completedTasks.forEach(task => {
        addDetailLine(content, "مهمة أُنجزت", task.title);
      });
    }

    addDetailLine(content, "مراجعة اليوم", review.done || "لم تسجل");
    addDetailLine(content, "خطة الغد", review.next || "لم تسجل");

    setText("detailDate", formatDate(key));

    panel.hidden = false;
    panel.classList.add("open");

    panel.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  $("closeDayDetails")?.addEventListener("click", () => {
    const panel = $("dayDetails");

    if (panel) {
      panel.classList.remove("open");
      panel.hidden = true;
    }

    selectedDetailDate = null;
  });

  $("logPeriod")?.addEventListener("change", renderJourneyLog);

  /* =========================================
     التقارير
     ========================================= */

  function updateReports() {
    const health = data.health[today] || {};

    setText("reportHabits", `${getTodayRecord().habits.length} / ${HABITS.length}`);
    setText("reportTasks", data.tasks.filter(task => task.done).length);
    setText("reportWater", Number(health.water) || 0);
    setText("reportExercise", Number(health.exercise) || 0);
  }

  /* =========================================
     النسخ الاحتياطي والتصدير
     ========================================= */

  $("exportData")?.addEventListener("click", () => {
    try {
      const backup = {
        ...data,
        exportedAt: new Date().toISOString(),
        application: "AL-FAROUQ 1%"
      };

      const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json;charset=utf-8" }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `alfarouq-backup-${today}.json`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

      showToast("تم تجهيز النسخة الاحتياطية");
    } catch (error) {
      console.error(error);
      showToast("تعذر إنشاء النسخة الاحتياطية");
    }
  });

  /* =========================================
     استيراد النسخة الاحتياطية
     ========================================= */

  $("importButton")?.addEventListener("click", () => {
    $("importFile")?.click();
  });

  $("importFile")?.addEventListener("change", async event => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const imported = JSON.parse(await file.text());

      if (
        !imported ||
        typeof imported !== "object" ||
        !imported.days ||
        !Array.isArray(imported.tasks)
      ) {
        throw new Error("صيغة الملف غير صحيحة");
      }

      if (!confirm("سيتم استبدال البيانات الحالية بالنسخة المستوردة. هل تريد المتابعة؟")) {
        return;
      }

      const normalized = normalizeData(imported);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(normalized)
      );

      showToast("تم استيراد البيانات بنجاح");

      setTimeout(() => location.reload(), 700);
    } catch (error) {
      console.error("خطأ الاستيراد:", error);
      showToast("تعذر استيراد الملف. تأكد أنه نسخة احتياطية صحيحة.");
    } finally {
      event.target.value = "";
    }
  });

  /* =========================================
     بدء الرحلة وتحديث الصفحة
     ========================================= */

  renderTasks();
  updateHealth();
  updateDashboard();
  updateReports();
  renderJourneyLog();

  save();

  console.log("AL-FAROUQ 1% — التطبيق جاهز");
})();
