
(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const STORAGE_KEY = "alfarouq_1_percent_data_v3";
  const LEGACY_KEYS = ["alfarouq_1_percent_data", "alfarouq_1_percent_data_v2"];
  const HABITS = ["prayer", "study", "exercise", "phone", "sleep", "discipline"];
  const today = localDateKey(new Date());
  let toastTimer;

  function localDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function freshData() {
    return {
      startDate: today, days: {}, tasks: [], sleep: {},
      faith: {}, health: {}, commute: {}, reviews: {}, dailyLogs: {}
    };
  }

  function loadData() {
    try {
      let saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");

      if (!saved) {
        for (const key of LEGACY_KEYS) {
          const old = JSON.parse(localStorage.getItem(key) || "null");
          if (old && typeof old === "object") {
            saved = old;
            break;
          }
        }
      }

      if (!saved || typeof saved !== "object") return freshData();

      return {
        ...freshData(),
        ...saved,
        days: saved.days || {},
        tasks: Array.isArray(saved.tasks) ? saved.tasks : [],
        sleep: saved.sleep || {},
        faith: saved.faith || {},
        health: saved.health || {},
        commute: saved.commute || {},
        reviews: saved.reviews || {},
        dailyLogs: saved.dailyLogs || {}
      };
    } catch (error) {
      console.warn("تعذر قراءة البيانات:", error);
      return freshData();
    }
  }

  const data = loadData();

  function ensureToday() {
    if (!data.days[today] || typeof data.days[today] !== "object") {
      data.days[today] = { habits: [], prayers: [] };
    }

    if (!Array.isArray(data.days[today].habits)) data.days[today].habits = [];
    if (!Array.isArray(data.days[today].prayers)) data.days[today].prayers = [];

    if (!data.health[today]) data.health[today] = { water: 0, exercise: 0 };
    if (!data.commute[today]) data.commute[today] = { outbound: false, return: false };
  }

  function buildDaySnapshot(dateKey) {
    const day = data.days[dateKey] || {};
    const health = data.health[dateKey] || {};
    const commute = data.commute[dateKey] || {};
    const sleep = data.sleep[dateKey] || {};
    const review = data.reviews[dateKey] || {};

    const dayTasks = data.tasks.filter(task =>
      task.createdAt === dateKey || task.completedAt === dateKey
    );

    return {
      date: dateKey,
      habits: Array.isArray(day.habits) ? [...day.habits] : [],
      prayers: Array.isArray(day.prayers) ? [...day.prayers] : [],
      water: Number(health.water || 0),
      exercise: Number(health.exercise || 0),
      sleep: { start: sleep.start || "", end: sleep.end || "" },
      commute: {
        outbound: Boolean(commute.outbound),
        return: Boolean(commute.return)
      },
      faith: data.faith[dateKey] || "",
      review: review.done || "",
      tomorrow: review.next || "",
      tasksCreated: dayTasks
        .filter(task => task.createdAt === dateKey)
        .map(task => ({
          title: task.title,
          subject: task.subject,
          done: Boolean(task.done)
        })),
      tasksCompleted: dayTasks
        .filter(task => task.completedAt === dateKey)
        .map(task => ({ title: task.title, subject: task.subject }))
    };
  }

  function save() {
    try {
      data.dailyLogs = data.dailyLogs || {};
      data.dailyLogs[today] = buildDaySnapshot(today);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      renderJourneyLog();
    } catch (error) {
      showToast("تعذر الحفظ. قد تكون مساحة المتصفح ممتلئة.");
      console.error(error);
    }
  }

  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  ensureToday();

  // ==========================================
  // التاريخ والقائمة
  // ==========================================

  const dateElement = $("currentDate");

  if (dateElement) {
    dateElement.textContent = new Intl.DateTimeFormat("ar", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date());
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

  // ==========================================
  // العادات اليومية
  // ==========================================

  document.querySelectorAll("[data-habit]").forEach(input => {
    const key = input.dataset.habit;
    input.checked = data.days[today].habits.includes(key);

    input.addEventListener("change", () => {
      const habits = data.days[today].habits;

      if (input.checked && !habits.includes(key)) habits.push(key);

      if (!input.checked) {
        data.days[today].habits = habits.filter(item => item !== key);
      }

      save();
      updateDashboard();
    });
  });

  // ==========================================
  // النوم
  // ==========================================

  const sleepStart = $("sleepStart");
  const sleepEnd = $("sleepEnd");
  const sleepForm = $("sleepForm");
  const sleepResult = $("sleepResult");

  if (data.sleep[today]) {
    if (sleepStart) sleepStart.value = data.sleep[today].start || "21:00";
    if (sleepEnd) sleepEnd.value = data.sleep[today].end || "04:00";
    renderSleepResult();
  }

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

    const mins = sleepDuration(record.start, record.end);

    sleepResult.textContent =
      `سجلت ${Math.floor(mins / 60)} ساعة و${mins % 60} دقيقة من النوم.`;
  }

  if (sleepForm) {
    sleepForm.addEventListener("submit", event => {
      event.preventDefault();

      data.sleep[today] = {
        start: sleepStart.value,
        end: sleepEnd.value
      };

      save();
      renderSleepResult();
      showToast("تم حفظ سجل النوم");
    });
  }

  // ==========================================
  // المواد والمهام الدراسية
  // ==========================================

  const subjects = window.APP_DATA?.subjects || [
    "السلوك التنظيمي",
    "الإدارة باللغة الإنجليزية",
    "المحاسبة المالية",
    "الاقتصاد",
    "القانون التجاري",
    "المصارف",
    "الإحصاء",
    "الحاسوب"
  ];

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
      return (a.due || "9999").localeCompare(b.due || "9999");
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

        if (check.checked) task.completedAt = today;
        else delete task.completedAt;

        save();
        renderTasks();
        updateDashboard();
      });

      const main = document.createElement("div");
      main.className = "task-main";

      const title = document.createElement("span");
      title.className = "task-title";
      title.textContent = task.title;

      const meta = document.createElement("span");
      meta.className = "task-meta";
      meta.textContent =
        `${task.subject}${task.due ? " • الموعد: " + task.due : ""}`;

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
        showToast("تم حذف المهمة");
      });

      row.append(check, main, remove);
      list.appendChild(row);
    });

    const completed = data.tasks.filter(task => task.done).length;

    if ($("completedTaskCount")) {
      $("completedTaskCount").textContent = completed;
    }

    if ($("openTaskCount")) {
      $("openTaskCount").textContent = data.tasks.length - completed;
    }
  }

  function addTask() {
    const titleInput = $("taskTitle");
    if (!titleInput) return;

    const title = titleInput.value.trim();

    if (!title) {
      showToast("اكتب اسم المهمة أولاً");
      titleInput.focus();
      return;
    }

    data.tasks.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject: subjectSelect?.value || "بدون مادة",
      title,
      due: $("taskDue")?.value || "",
      done: false,
      createdAt: today
    });

    titleInput.value = "";
    if ($("taskDue")) $("taskDue").value = "";

    save();
    renderTasks();
    updateDashboard();
    showToast("أُضيفت المهمة بنجاح");
  }

  $("addTaskButton")?.addEventListener("click", addTask);

  $("taskTitle")?.addEventListener("keydown", event => {
    if (event.key === "Enter") addTask();
  });

  // ==========================================
  // الصلوات والورد
  // ==========================================

  document.querySelectorAll("[data-prayer]").forEach(input => {
    const name = input.dataset.prayer;
    input.checked = data.days[today].prayers.includes(name);

    input.addEventListener("change", () => {
      const prayers = data.days[today].prayers;

      if (input.checked && !prayers.includes(name)) prayers.push(name);

      if (!input.checked) {
        data.days[today].prayers = prayers.filter(item => item !== name);
      }

      save();
      showToast("تم تحديث متابعة الصلاة");
    });
  });

  const faithNote = $("faithNote");

  if (faithNote) faithNote.value = data.faith[today] || "";

  $("saveFaithButton")?.addEventListener("click", () => {
    data.faith[today] = faithNote?.value.trim() || "";
    save();

    if ($("faithFeedback")) {
      $("faithFeedback").textContent = "تم حفظ الورد اليومي.";
    }

    showToast("تم حفظ الورد");
  });

  // ==========================================
  // الصحة: الماء والحركة
  // ==========================================

  function updateHealth() {
    const health = data.health[today];

    if ($("waterCount")) $("waterCount").textContent = health.water;
    if ($("exerciseMinutes")) {
      $("exerciseMinutes").textContent = health.exercise;
    }

    if ($("reportWater")) $("reportWater").textContent = health.water;
    if ($("reportExercise")) {
      $("reportExercise").textContent = health.exercise;
    }
  }

  $("waterPlus")?.addEventListener("click", () => {
    data.health[today].water = Math.min(30, data.health[today].water + 1);
    save();
    updateHealth();
  });

  $("waterMinus")?.addEventListener("click", () => {
    data.health[today].water = Math.max(0, data.health[today].water - 1);
    save();
    updateHealth();
  });

  $("exercisePlus")?.addEventListener("click", () => {
    data.health[today].exercise =
      Math.min(1440, data.health[today].exercise + 5);

    save();
    updateHealth();
  });

  $("exerciseMinus")?.addEventListener("click", () => {
    data.health[today].exercise =
      Math.max(0, data.health[today].exercise - 5);

    save();
    updateHealth();
  });

  // ==========================================
  // المواصلات
  // ==========================================

  document.querySelectorAll("[data-commute]").forEach(input => {
    const key = input.dataset.commute;
    input.checked = Boolean(data.commute[today][key]);

    input.addEventListener("change", () => {
      data.commute[today][key] = input.checked;
      save();
      showToast("تم تحديث خطة المواصلات");
    });
  });

  // ==========================================
  // مراجعة اليوم
  // ==========================================

  const review = data.reviews[today] || {};

  if ($("dailyReview")) $("dailyReview").value = review.done || "";
  if ($("tomorrowPlan")) $("tomorrowPlan").value = review.next || "";

  $("saveReview")?.addEventListener("click", () => {
    data.reviews[today] = {
      done: $("dailyReview")?.value.trim() || "",
      next: $("tomorrowPlan")?.value.trim() || ""
    };

    save();

    if ($("reviewFeedback")) {
      $("reviewFeedback").textContent = "تم حفظ مراجعتك. أحسنت!";
    }

    showToast("تم حفظ مراجعة اليوم");
  });

  // ==========================================
  // لوحة الملخص
  // ==========================================

  function updateDashboard() {
    const completedHabits = data.days[today].habits.length;
    const progress = Math.round((completedHabits / HABITS.length) * 100);

    if ($("progressCount")) {
      $("progressCount").textContent = `${progress}%`;
    }

    if ($("reportHabits")) {
      $("reportHabits").textContent =
        `${completedHabits} / ${HABITS.length}`;
    }

    const start = new Date(`${data.startDate}T00:00:00`);
    const now = new Date(`${today}T00:00:00`);

    if ($("dayCount")) {
      $("dayCount").textContent =
        Math.max(1, Math.floor((now - start) / 86400000) + 1);
    }

    let streak = 0;
    const cursor = new Date(now);

    while (true) {
      const key = localDateKey(cursor);
      const record = data.days[key];

      if (!record || !record.habits || record.habits.length === 0) break;

      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    if ($("streakCount")) $("streakCount").textContent = streak;

    const openTasks = data.tasks.filter(task => !task.done).length;

    if ($("taskCount")) $("taskCount").textContent = openTasks;

    if ($("reportTasks")) {
      $("reportTasks").textContent =
        data.tasks.filter(task => task.done).length;
    }
  }

  // ==========================================
  // سجل الرحلة
  // ==========================================

  function getLogDates() {
    const dates = new Set(Object.keys(data.dailyLogs || {}));

    [data.days, data.health, data.sleep, data.faith,
      data.commute, data.reviews].forEach(group => {
      Object.keys(group || {}).forEach(date => dates.add(date));
    });

    data.tasks.forEach(task => {
      if (task.createdAt) dates.add(task.createdAt);
      if (task.completedAt) dates.add(task.completedAt);
    });

    return [...dates]
      .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
      .sort((a, b) => b.localeCompare(a));
  }

  function snapshotFor(date) {
    return data.dailyLogs?.[date] || buildDaySnapshot(date);
  }

  function dayCompletion(snapshot) {
    const habits = snapshot.habits?.length || 0;
    const prayers = snapshot.prayers?.length || 0;
    const taskDone = snapshot.tasksCompleted?.length || 0;

    return Math.round(
      ((habits / HABITS.length) +
      (prayers / 5) +
      Math.min(1, taskDone / 2)) / 3 * 100
    );
  }

  function renderJourneyLog() {
    const body = $("journeyLogBody");
    if (!body) return;

    const period = $("logPeriod")?.value || "all";
    let dates = getLogDates();

    if (period !== "all") {
      const limit = new Date(`${today}T00:00:00`);
      limit.setDate(limit.getDate() - (Number(period) - 1));
      const minDate = localDateKey(limit);

      dates = dates.filter(date => date >= minDate && date <= today);
    }

    if ($("logDaysCount")) {
      $("logDaysCount").textContent = `${dates.length} يوم مسجل`;
    }

    body.innerHTML = "";

    if (!dates.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 8;
      cell.className = "empty-state";
      cell.textContent =
        "لسه ما عندك أيام مسجلة. ابدأ بتسجيل نشاطك اليوم.";

      row.appendChild(cell);
      body.appendChild(row);
      return;
    }

    dates.forEach(date => {
      const record = snapshotFor(date);
      const row = document.createElement("tr");

      const values = [
        new Intl.DateTimeFormat("ar", {
          day: "numeric", month: "short", year: "numeric"
        }).format(new Date(`${date}T00:00:00`)),
        `${record.habits?.length || 0} / ${HABITS.length}`,
        `${record.prayers?.length || 0} / 5`,
        `${record.water || 0} كوب`,
        `${record.exercise || 0} د`,
        `${record.tasksCompleted?.length || 0} مكتملة`,
        `${dayCompletion(record)}%`
      ];

      values.forEach((value, index) => {
        const cell = document.createElement("td");
        cell.textContent = value;

        if (index === 6) cell.className = "log-progress";

        row.appendChild(cell);
      });

      const actionCell = document.createElement("td");
      const button = document.createElement("button");

      button.type = "button";
      button.className = "log-open-button";
      button.textContent = "عرض";
      button.addEventListener("click", () => showDayDetails(date));

      actionCell.appendChild(button);
      row.appendChild(actionCell);
      body.appendChild(row);
    });
  }

  function showDayDetails(date) {
    const record = snapshotFor(date);
    const panel = $("dayDetails");

    if (!panel) return;

    $("detailDate").textContent =
      new Intl.DateTimeFormat("ar", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      }).format(new Date(`${date}T00:00:00`));

    const habitsNames = {
      prayer: "المحافظة على الصلاة",
      study: "المذاكرة",
      exercise: "الحركة والرياضة",
      phone: "استخدام واعٍ للهاتف",
      sleep: "الالتزام بالنوم",
      discipline: "الابتعاد عن الإباحية"
    };

    const details = [
      ["العادات", (record.habits || [])
        .map(key => habitsNames[key] || key).join("، ") || "لم تُسجل عادات مكتملة"],
      ["الصلوات", (record.prayers || []).join("، ") || "لا توجد صلوات مسجلة"],
      ["الماء والرياضة", `${record.water || 0} كوب ماء — ${record.exercise || 0} دقيقة نشاط`],
      ["النوم", record.sleep?.start && record.sleep?.end
        ? `النوم ${record.sleep.start} — الاستيقاظ ${record.sleep.end}`
        : "لم يُسجل النوم"],
      ["المواصلات", `الذهاب: ${record.commute?.outbound ? "تم" : "لم يسجل"} — العودة: ${record.commute?.return ? "تم" : "لم تسجل"}`],
      ["الدراسة", `مهام أُضيفت: ${(record.tasksCreated || []).length} — مهام أُكملت: ${(record.tasksCompleted || []).length}`],
      ["الورد والأذكار", record.faith || "لا يوجد تسجيل"],
      ["أفضل إنجاز اليوم", record.review || "لم تُكتب مراجعة"],
      ["خطة الغد", record.tomorrow || "لم تُكتب خطة"],
      ["المهام", [
        ...(record.tasksCreated || []).map(t =>
          `${t.subject}: ${t.title}${t.done ? " (مكتملة)" : ""}`),
        ...(record.tasksCompleted || []).map(t =>
          `${t.subject}: ${t.title} (أُكملت اليوم)`)
      ].join("\n") || "لا توجد مهام مسجلة"]
    ];

    const content = $("dayDetailsContent");
    content.innerHTML = "";

    details.forEach(([title, value]) => {
      const item = document.createElement("div");
      item.className = "detail-item";

      const heading = document.createElement("b");
      heading.textContent = title;

      const text = document.createElement("span");
      text.textContent = value;

      item.append(heading, text);
      content.appendChild(item);
    });

    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  $("logPeriod")?.addEventListener("change", renderJourneyLog);

  $("closeDayDetails")?.addEventListener("click", () => {
    $("dayDetails").hidden = true;
  });

  // ==========================================
  // مكتبة الفيديوهات
  // ==========================================

  const libraryModal = $("libraryModal");
  const libraryBackdrop = $("libraryBackdrop");
  const libraryGrid = $("libraryGrid");
  const librarySearch = $("librarySearch");
  const libraryFilters = $("libraryFilters");
  const libraryVideoCount = $("libraryVideoCount");
  const libraryLoading = $("libraryLoading");

  const categoryNames = {
    all: "الكل",
    religion: "الدين",
    "self-development": "تطوير الذات",
    psychology: "النفس والسلوك",
    study: "الدراسة",
    health: "الصحة",
    skills: "المهارات"
  };

  let activeCategory = "all";
  let searchTerm = "";

  function getVideos() {
    return Array.isArray(window.APP_DATA?.videos)
      ? window.APP_DATA.videos
      : [];
  }

  function openLibrary() {
    if (!libraryModal) {
      showToast("نافذة المكتبة غير موجودة في الصفحة");
      return;
    }

    libraryModal.hidden = false;
    document.body.classList.add("library-open");
    document.body.style.overflow = "hidden";

    renderLibrary();
  }

  function closeLibrary() {
    if (!libraryModal) return;

    libraryModal.hidden = true;
    document.body.classList.remove("library-open");
    document.body.style.overflow = "";
  }

  $("openLibraryButton")?.addEventListener("click", openLibrary);
  $("closeLibraryButton")?.addEventListener("click", closeLibrary);

  libraryBackdrop?.addEventListener("click", closeLibrary);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && libraryModal && !libraryModal.hidden) {
      closeLibrary();
    }
  });

  function renderLibrary() {
    if (!libraryGrid) return;

    const videos = getVideos();

    if (libraryLoading) {
      libraryLoading.hidden = videos.length > 0;
    }

    const filtered = videos.filter(video => {
      const matchesCategory =
        activeCategory === "all" || video.category === activeCategory;

      const text = `${video.title || ""} ${video.description || ""}`.toLowerCase();
      const matchesSearch = text.includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    libraryGrid.innerHTML = "";

    if (libraryVideoCount) {
      libraryVideoCount.textContent =
        `${filtered.length} من ${videos.length} فيديو`;
    }

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = videos.length
        ? "ما لقينا فيديو مطابق للبحث."
        : "ما في فيديوهات متاحة حالياً. تأكد من تحميل data.js.";

      libraryGrid.appendChild(empty);
      return;
    }

    filtered.forEach(video => {
      const card = document.createElement("article");
      card.className = "library-video-card";

      const image = document.createElement("img");
      image.className = "library-video-image";
      image.src = video.thumbnail ||
        window.APP_DATA?.videoCovers?.[video.category] || "";
      image.alt = video.title || "صورة الفيديو";
      image.loading = "lazy";

      image.onerror = () => {
        image.style.display = "none";
      };

      const content = document.createElement("div");
      content.className = "library-video-content";

      const day = document.createElement("span");
      day.className = "library-video-day";
      day.textContent =
        `اليوم ${video.day || ""} • ${video.timeLabel || (video.type === "going" ? "فيديو الذهاب" : "فيديو العودة")}`;

      const title = document.createElement("h3");
      title.textContent = video.title || "فيديو بدون عنوان";

      const description = document.createElement("p");
      description.textContent = video.description || "";

      const category = document.createElement("span");
      category.className = "library-video-category";
      category.textContent = categoryNames[video.category] || "متنوع";

      const watch = document.createElement("a");
      watch.className = "primary-button library-watch-button";
      watch.href = video.url || "#";
      watch.target = "_blank";
      watch.rel = "noopener noreferrer";
      watch.textContent = "▶ مشاهدة الفيديو";

      content.append(day, title, description, category, watch);
      card.append(image, content);
      libraryGrid.appendChild(card);
    });
  }

  if (librarySearch) {
    librarySearch.addEventListener("input", () => {
      searchTerm = librarySearch.value.trim();
      renderLibrary();
    });
  }

  if (libraryFilters) {
    libraryFilters.querySelectorAll("[data-category]").forEach(button => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category || "all";

        libraryFilters.querySelectorAll("[data-category]").forEach(item => {
          item.classList.toggle("active", item === button);
          item.setAttribute("aria-pressed", String(item === button));
        });

        renderLibrary();
      });
    });
  }

  // ==========================================
  // تصدير واستيراد النسخة الاحتياطية
  // ==========================================

  $("exportData")?.addEventListener("click", () => {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `alfarouq-backup-${today}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    showToast("تم تجهيز النسخة الاحتياطية");
  });

  $("importButton")?.addEventListener("click", () => {
    $("importFile")?.click();
  });

  $("importFile")?.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imported = JSON.parse(await file.text());

      if (!imported || typeof imported !== "object" ||
          !imported.days || !Array.isArray(imported.tasks)) {
        throw new Error("صيغة الملف غير صحيحة");
      }

      if (!confirm("سيتم استبدال البيانات الحالية بالنسخة المستوردة. هل تريد المتابعة؟")) {
        return;
      }

      imported.dailyLogs = imported.dailyLogs || {};

      localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));

      showToast("تم الاستيراد، سيتم تحديث الصفحة");
      setTimeout(() => location.reload(), 700);

    } catch (error) {
      showToast("تعذر استيراد الملف. تأكد أنه نسخة احتياطية صحيحة.");
    } finally {
      event.target.value = "";
    }
  });

  // ==========================================
  // بدء تشغيل التطبيق
  // ==========================================

  renderTasks();
  updateHealth();
  updateDashboard();
  renderJourneyLog();

  console.log("AL-FAROUQ 1% — التطبيق جاهز");
})();
