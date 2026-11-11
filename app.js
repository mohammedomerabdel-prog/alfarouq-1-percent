
(() => {
  "use strict";

  // ==========================================
  // AL-FAROUQ 1% — MAIN APPLICATION
  // ==========================================

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

  const PRAYERS = ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"];

  const CATEGORY_NAMES = {
    faith: "الدين والإيمان",
    self: "تطوير الذات",
    study: "الدراسة والتعلم",
    mind: "النفس والسلوك",
    health: "الصحة والعادات"
  };

  const FALLBACK_SUBJECTS = [
    "السلوك التنظيمي",
    "الإدارة باللغة الإنجليزية",
    "المحاسبة المالية",
    "الاقتصاد",
    "القانون التجاري",
    "المصارف",
    "الإحصاء",
    "الحاسوب"
  ];

  const APP_DATA = window.APP_DATA || {};

  const SUBJECTS = Array.isArray(APP_DATA.subjects) &&
    APP_DATA.subjects.length
    ? APP_DATA.subjects
    : FALLBACK_SUBJECTS;

  const VIDEOS = Array.isArray(APP_DATA.videos)
    ? APP_DATA.videos
    : [];

  const $ = id => document.getElementById(id);

  let toastTimer = null;

  // ==========================================
  // DATE HELPERS
  // ==========================================

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function parseDate(dateKey) {
    return new Date(`${dateKey}T00:00:00`);
  }

  function daysBetween(firstDate, secondDate) {
    const first = parseDate(firstDate);
    const second = parseDate(secondDate);

    return Math.floor(
      (second.getTime() - first.getTime()) / 86400000
    );
  }

  const today = localDateKey();

  // ==========================================
  // DATA MANAGEMENT
  // ==========================================

  function freshData() {
    return {
      startDate: today,
      days: {},
      tasks: [],
      sleep: {},
      faith: {},
      health: {},
      commute: {},
      reviews: {},
      dailyLogs: {},
      videoWatched: {}
    };
  }

  function isObject(value) {
    return value !== null &&
      typeof value === "object" &&
      !Array.isArray(value);
  }

  function safeObject(value) {
    return isObject(value) ? value : {};
  }

  function normalizeData(saved) {
    const defaults = freshData();
    const source = safeObject(saved);

    const normalized = {
      ...defaults,
      ...source,

      days: safeObject(source.days),
      tasks: Array.isArray(source.tasks)
        ? source.tasks
        : [],

      sleep: safeObject(source.sleep),
      faith: safeObject(source.faith),
      health: safeObject(source.health),
      commute: safeObject(source.commute),
      reviews: safeObject(source.reviews),
      dailyLogs: safeObject(source.dailyLogs),

      videoWatched: safeObject(source.videoWatched)
    };

    if (
      typeof normalized.startDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(normalized.startDate)
    ) {
      normalized.startDate = today;
    }

    normalized.tasks = normalized.tasks
      .filter(task => isObject(task))
      .map((task, index) => ({
        ...task,
        id: task.id || `task-${index}-${Date.now()}`,
        title: String(task.title || "مهمة بدون عنوان"),
        subject: String(task.subject || "بدون مادة"),
        due: String(task.due || ""),
        done: Boolean(task.done),
        createdAt: task.createdAt || today
      }));

    Object.keys(normalized.health).forEach(date => {
      const health = safeObject(normalized.health[date]);

      normalized.health[date] = {
        water: Math.max(0, Number(health.water) || 0),
        exercise: Math.max(0, Number(health.exercise) || 0)
      };
    });

    return normalized;
  }

  function loadData() {
    try {
      let saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "null"
      );

      if (!isObject(saved)) {
        for (const key of LEGACY_KEYS) {
          try {
            const legacy = JSON.parse(
              localStorage.getItem(key) || "null"
            );

            if (isObject(legacy)) {
              saved = legacy;
              break;
            }
          } catch (error) {
            console.warn("تعذر قراءة نسخة قديمة:", error);
          }
        }
      }

      if (!isObject(saved)) {
        return freshData();
      }

      return normalizeData(saved);

    } catch (error) {
      console.warn("تعذر تحميل البيانات:", error);
      return freshData();
    }
  }

  const data = loadData();

  function ensureToday() {
    if (!isObject(data.days[today])) {
      data.days[today] = {
        habits: [],
        prayers: []
      };
    }

    if (!Array.isArray(data.days[today].habits)) {
      data.days[today].habits = [];
    }

    if (!Array.isArray(data.days[today].prayers)) {
      data.days[today].prayers = [];
    }

    if (!isObject(data.health[today])) {
      data.health[today] = {
        water: 0,
        exercise: 0
      };
    }

    data.health[today].water = Math.max(
      0,
      Number(data.health[today].water) || 0
    );

    data.health[today].exercise = Math.max(
      0,
      Number(data.health[today].exercise) || 0
    );

    if (!isObject(data.commute[today])) {
      data.commute[today] = {
        outbound: false,
        return: false
      };
    }
  }

  ensureToday();

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  function showToast(message) {
    const toast = $("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2300);
  }

  // ==========================================
  // DAILY SNAPSHOTS AND SAVING
  // ==========================================

  function buildDaySnapshot(dateKey) {
    const day = data.days[dateKey] || {};
    const health = data.health[dateKey] || {};
    const commute = data.commute[dateKey] || {};
    const sleep = data.sleep[dateKey] || {};
    const review = data.reviews[dateKey] || {};

    const dayTasks = data.tasks.filter(task =>
      task.createdAt === dateKey ||
      task.completedAt === dateKey
    );

    const watchedVideos = Object.keys(data.videoWatched)
      .filter(id => data.videoWatched[id]);

    return {
      date: dateKey,

      habits: Array.isArray(day.habits)
        ? [...day.habits]
        : [],

      prayers: Array.isArray(day.prayers)
        ? [...day.prayers]
        : [],

      water: Number(health.water) || 0,
      exercise: Number(health.exercise) || 0,

      sleep: {
        start: sleep.start || "",
        end: sleep.end || ""
      },

      commute: {
        outbound: Boolean(commute.outbound),
        return: Boolean(commute.return)
      },

      videosWatched: watchedVideos,

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
        .map(task => ({
          title: task.title,
          subject: task.subject
        }))
    };
  }

  function save() {
    try {
      data.dailyLogs[today] = buildDaySnapshot(today);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

      renderJourneyLog();

    } catch (error) {
      console.error("خطأ أثناء الحفظ:", error);
      showToast("تعذر الحفظ. تحقق من مساحة المتصفح.");
    }
  }

  // ==========================================
  // HEADER AND NAVIGATION
  // ==========================================

  function initializeHeader() {
    const dateElement = $("currentDate");

    if (dateElement) {
      dateElement.textContent = new Intl.DateTimeFormat(
        "ar",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      ).format(new Date());
    }

    const menuButton = $("menuButton");
    const navigation = $("navigation");

    if (!menuButton || !navigation) return;

    menuButton.addEventListener("click", () => {
      const opened = navigation.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(opened)
      );
    });

    navigation.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    });
  }

  // ==========================================
  // HABITS
  // ==========================================

  function initializeHabits() {
    document.querySelectorAll("[data-habit]").forEach(input => {
      const key = input.dataset.habit;

      input.checked = data.days[today].habits.includes(key);

      input.addEventListener("change", () => {
        const habits = data.days[today].habits;

        if (input.checked && !habits.includes(key)) {
          habits.push(key);
        }

        if (!input.checked) {
          data.days[today].habits = habits.filter(
            item => item !== key
          );
        }

        save();
        updateDashboard();
      });
    });
  }

  // ==========================================
  // SLEEP
  // ==========================================

  function sleepDuration(start, end) {
    if (!start || !end) return 0;

    const [startHour, startMinute] = start
      .split(":")
      .map(Number);

    const [endHour, endMinute] = end
      .split(":")
      .map(Number);

    let minutes =
      (endHour * 60 + endMinute) -
      (startHour * 60 + startMinute);

    if (minutes <= 0) {
      minutes += 1440;
    }

    return minutes;
  }

  function renderSleepResult() {
    const result = $("sleepResult");
    const record = data.sleep[today];

    if (!result) return;

    if (!record) {
      result.textContent = "لم تسجل نوم اليوم بعد.";
      return;
    }

    const minutes = sleepDuration(
      record.start,
      record.end
    );

    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;

    result.textContent =
      `سجلت ${hours} ساعة و${remainder} دقيقة من النوم.`;
  }

  function initializeSleep() {
    const start = $("sleepStart");
    const end = $("sleepEnd");
    const form = $("sleepForm");

    if (!start || !end || !form) return;

    if (data.sleep[today]) {
      start.value = data.sleep[today].start || "21:00";
      end.value = data.sleep[today].end || "04:00";
    }

    renderSleepResult();

    form.addEventListener("submit", event => {
      event.preventDefault();

      if (!start.value || !end.value) {
        showToast("حدد وقت النوم والاستيقاظ أولاً.");
        return;
      }

      data.sleep[today] = {
        start: start.value,
        end: end.value
      };

      save();
      renderSleepResult();

      showToast("تم حفظ سجل النوم");
    });
  }

  // ==========================================
  // SUBJECTS AND TASKS
  // ==========================================

  function initializeSubjects() {
    const select = $("subjectSelect");

    if (!select) return;

    select.innerHTML = "";

    SUBJECTS.forEach(subject => {
      const option = document.createElement("option");

      option.value = subject;
      option.textContent = subject;

      select.appendChild(option);
    });
  }

  function renderTasks() {
    const list = $("taskList");

    if (!list) return;

    list.innerHTML = "";

    const sortedTasks = [...data.tasks].sort((a, b) => {
      if (a.done !== b.done) {
        return Number(a.done) - Number(b.done);
      }

      return (a.due || "9999").localeCompare(
        b.due || "9999"
      );
    });

    if (sortedTasks.length === 0) {
      const empty = document.createElement("p");

      empty.className = "empty-state";
      empty.textContent =
        "ما عندك مهام دراسية حالياً. أضف أول مهمة.";

      list.appendChild(empty);
    }

    sortedTasks.forEach(task => {
      const row = document.createElement("div");

      row.className = `task-item${task.done ? " completed" : ""}`;

      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.checked = Boolean(task.done);
      checkbox.setAttribute("aria-label", "إكمال المهمة");

      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;

        if (checkbox.checked) {
          task.completedAt = today;
        } else {
          delete task.completedAt;
        }

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
        `${task.subject}` +
        (task.due ? ` • الموعد: ${task.due}` : "");

      main.append(title, meta);

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const remove = document.createElement("button");

      remove.type = "button";
      remove.textContent = "حذف";

      remove.addEventListener("click", () => {
        if (!confirm("هل تريد حذف هذه المهمة؟")) {
          return;
        }

        data.tasks = data.tasks.filter(
          item => item.id !== task.id
        );

        save();
        renderTasks();
        updateDashboard();

        showToast("تم حذف المهمة");
      });

      actions.appendChild(remove);

      row.append(
        checkbox,
        main,
        actions
      );

      list.appendChild(row);
    });

    const completed = data.tasks.filter(
      task => task.done
    ).length;

    const opened = data.tasks.length - completed;

    if ($("completedTaskCount")) {
      $("completedTaskCount").textContent = completed;
    }

    if ($("openTaskCount")) {
      $("openTaskCount").textContent = opened;
    }
  }

  function addTask() {
    const titleInput = $("taskTitle");
    const subjectSelect = $("subjectSelect");
    const dueInput = $("taskDue");

    if (!titleInput || !subjectSelect || !dueInput) {
      return;
    }

    const title = titleInput.value.trim();

    if (!title) {
      showToast("اكتب اسم المهمة أولاً");
      titleInput.focus();
      return;
    }

    data.tasks.push({
      id: `task-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`,

      subject: subjectSelect.value || "بدون مادة",
      title,
      due: dueInput.value,
      done: false,
      createdAt: today
    });

    titleInput.value = "";
    dueInput.value = "";

    save();
    renderTasks();
    updateDashboard();

    showToast("أُضيفت المهمة بنجاح");
  }

  function initializeTasks() {
    initializeSubjects();

    $("addTaskButton")?.addEventListener(
      "click",
      addTask
    );

    $("taskTitle")?.addEventListener(
      "keydown",
      event => {
        if (event.key === "Enter") {
          event.preventDefault();
          addTask();
        }
      }
    );

    renderTasks();
  }

  // ==========================================
  // PRAYERS AND FAITH
  // ==========================================

  function initializePrayers() {
    document.querySelectorAll("[data-prayer]").forEach(input => {
      const name = input.dataset.prayer;

      input.checked = data.days[today].prayers.includes(name);

      input.addEventListener("change", () => {
        const prayers = data.days[today].prayers;

        if (input.checked && !prayers.includes(name)) {
          prayers.push(name);
        }

        if (!input.checked) {
          data.days[today].prayers = prayers.filter(
            item => item !== name
          );
        }

        save();
        updateDashboard();

        showToast("تم تحديث متابعة الصلاة");
      });
    });
  }

  function initializeFaith() {
    const note = $("faithNote");
    const button = $("saveFaithButton");
    const feedback = $("faithFeedback");

    if (note) {
      note.value = data.faith[today] || "";
    }

    if (!button || !note) return;

    button.addEventListener("click", () => {
      data.faith[today] = note.value.trim();

      save();

      if (feedback) {
        feedback.textContent = "تم حفظ الورد اليومي.";
      }

      showToast("تم حفظ الورد");
    });
  }

  // ==========================================
  // HEALTH: WATER AND EXERCISE
  // ==========================================

  function updateHealth() {
    const health = data.health[today];

    const water = $("waterCount");
    const exercise = $("exerciseMinutes");

    if (water) {
      water.textContent = health.water;
    }

    if (exercise) {
      exercise.textContent = health.exercise;
    }

    if ($("reportWater")) {
      $("reportWater").textContent = health.water;
    }

    if ($("reportExercise")) {
      $("reportExercise").textContent = health.exercise;
    }
  }

  function changeWater(amount) {
    const health = data.health[today];

    health.water = Math.max(
      0,
      Math.min(30, health.water + amount)
    );

    updateHealth();
    save();
  }

  function changeExercise(amount) {
    const health = data.health[today];

    health.exercise = Math.max(
      0,
      Math.min(1440, health.exercise + amount)
    );

    updateHealth();
    save();
  }

  function initializeHealth() {
    $("waterPlus")?.addEventListener(
      "click",
      () => changeWater(1)
    );

    $("waterMinus")?.addEventListener(
      "click",
      () => changeWater(-1)
    );

    $("exercisePlus")?.addEventListener(
      "click",
      () => changeExercise(5)
    );

    $("exerciseMinus")?.addEventListener(
      "click",
      () => changeExercise(-5)
    );

    updateHealth();
  }

  // ==========================================
  // COMMUTE ACADEMY — 50 VIDEOS
  // ==========================================

  function getJourneyDay() {
    return Math.max(
      1,
      daysBetween(data.startDate, today) + 1
    );
  }

  function isVideoWatched(videoId) {
    return Boolean(data.videoWatched[videoId]);
  }

  function setVideoWatched(videoId, watched) {
    if (watched) {
      data.videoWatched[videoId] = true;
    } else {
      delete data.videoWatched[videoId];
    }

    save();
    renderAcademyProgress();
    renderVideoLibrary();
  }

  function getWatchedCount() {
    return VIDEOS.filter(video =>
      isVideoWatched(video.id)
    ).length;
  }

  function renderAcademyProgress() {
    const total = VIDEOS.length;
    const watched = getWatchedCount();

    const text = $("videoProgressText");
    const bar = $("videoProgressBar");

    if (text) {
      text.textContent = `${watched} / ${total} فيديو`;
    }

    if (bar) {
      const percentage = total
        ? (watched / total) * 100
        : 0;

      bar.style.width = `${percentage}%`;
    }
  }

  function categoryName(category) {
    return CATEGORY_NAMES[category] || "متنوع";
  }

  function getVideo(day, slot) {
    return VIDEOS.find(video =>
      Number(video.day) === Number(day) &&
      video.slot === slot
    );
  }

  function renderDailyVideo(slot) {
    const prefix = slot === "outbound"
      ? "outbound"
      : "return";

    const title = $(`${prefix}Title`);
    const description = $(`${prefix}Description`);
    const category = $(`${prefix}Category`);
    const dayLabel = $(`${prefix}Day`);
    const link = $(`${prefix}Link`);
    const checkbox = $(
      slot === "outbound"
        ? "outboundWatched"
        : "returnWatched"
    );

    if (!title || !link || !checkbox) return;

    const journeyDay = getJourneyDay();

    if (dayLabel) {
      dayLabel.textContent = `اليوم ${journeyDay}`;
    }

    const video = getVideo(journeyDay, slot);

    if (!video) {
      title.textContent = journeyDay > 25
        ? "أكملت خطة الفيديوهات ذات الـ25 يوماً! أحسنت."
        : "لا يوجد فيديو محدد لهذا اليوم.";

      if (description) {
        description.textContent = journeyDay > 25
          ? "يمكنك مراجعة المكتبة واختيار أي فيديو تريد إعادة الاستماع إليه."
          : "راجع مكتبة الفيديوهات الموجودة بالأسفل.";
      }

      if (category) {
        category.textContent = "اكتملت الخطة";
      }

      link.hidden = true;
      checkbox.checked = false;
      checkbox.disabled = true;

      return;
    }

    title.textContent = video.title;

    if (description) {
      description.textContent = video.description || "";
    }

    if (category) {
      category.textContent = categoryName(video.category);
    }

    link.href = video.url || "https://www.youtube.com/";
    link.hidden = false;

    checkbox.disabled = false;
    checkbox.checked = isVideoWatched(video.id);

    checkbox.onchange = () => {
      setVideoWatched(video.id, checkbox.checked);

      showToast(
        checkbox.checked
          ? "أحسنت! تم تسجيل الاستماع للفيديو."
          : "تم تحديث حالة الفيديو."
      );
    };
  }

  function renderVideoLibrary() {
    const library = $("videoLibrary");

    if (!library) return;

    const filter = $("videoCategoryFilter")?.value || "all";

    const filteredVideos = VIDEOS.filter(video =>
      filter === "all" || video.category === filter
    );

    library.innerHTML = "";

    if (!filteredVideos.length) {
      const empty = document.createElement("p");

      empty.className = "empty-state";
      empty.textContent = "لا توجد فيديوهات في هذا المجال.";

      library.appendChild(empty);
      return;
    }

    filteredVideos.forEach(video => {
      const item = document.createElement("article");

      item.className = "video-library-item";

      if (isVideoWatched(video.id)) {
        item.classList.add("is-watched");
      }

      const details = document.createElement("div");

      const heading = document.createElement("h4");
      heading.textContent = video.title;

      const info = document.createElement("p");

      info.textContent =
        `اليوم ${video.day} • ${categoryName(video.category)}`;

      details.append(heading, info);

      const actions = document.createElement("div");
      actions.className = "video-library-actions";

      const link = document.createElement("a");

      link.href = video.url || "https://www.youtube.com/";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "فتح ↗";

      const watchedButton = document.createElement("button");

      watchedButton.type = "button";
      watchedButton.textContent = isVideoWatched(video.id)
        ? "تم الاستماع ✓"
        : "تحديد كمستمع";

      watchedButton.addEventListener("click", () => {
        const nextState = !isVideoWatched(video.id);

        setVideoWatched(video.id, nextState);

        showToast(
          nextState
            ? "تم تسجيل الاستماع للفيديو"
            : "تم إلغاء تسجيل الاستماع"
        );
      });

      actions.append(link, watchedButton);

      item.append(details, actions);

      library.appendChild(item);
    });
  }

  function initializeAcademy() {
    const filter = $("videoCategoryFilter");

    if (filter) {
      filter.addEventListener("change", renderVideoLibrary);
    }

    renderDailyVideo("outbound");
    renderDailyVideo("return");

    renderAcademyProgress();
    renderVideoLibrary();
  }

  // ==========================================
  // DAILY REVIEW
  // ==========================================

  function initializeReview() {
    const review = data.reviews[today] || {};

    const dailyReview = $("dailyReview");
    const tomorrowPlan = $("tomorrowPlan");

    if (dailyReview) {
      dailyReview.value = review.done || "";
    }

    if (tomorrowPlan) {
      tomorrowPlan.value = review.next || "";
    }

    $("saveReview")?.addEventListener("click", () => {
      data.reviews[today] = {
        done: dailyReview?.value.trim() || "",
        next: tomorrowPlan?.value.trim() || ""
      };

      save();

      const feedback = $("reviewFeedback");

      if (feedback) {
        feedback.textContent = "تم حفظ مراجعتك. أحسنت!";
      }

      showToast("تم حفظ مراجعة اليوم");
    });
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  function updateDashboard() {
    const completedHabits = data.days[today].habits.length;

    const progress = Math.round(
      (completedHabits / HABITS.length) * 100
    );

    if ($("progressCount")) {
      $("progressCount").textContent = `${progress}%`;
    }

    if ($("reportHabits")) {
      $("reportHabits").textContent =
        `${completedHabits} / ${HABITS.length}`;
    }

    const journeyDay = getJourneyDay();

    if ($("dayCount")) {
      $("dayCount").textContent = journeyDay;
    }

    let streak = 0;
    const cursor = parseDate(today);

    while (true) {
      const key = localDateKey(cursor);
      const record = data.days[key];

      if (
        !record ||
        !Array.isArray(record.habits) ||
        record.habits.length === 0
      ) {
        break;
      }

      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    if ($("streakCount")) {
      $("streakCount").textContent = streak;
    }

    const completedTasks = data.tasks.filter(
      task => task.done
    ).length;

    const openTasks = data.tasks.length - completedTasks;

    if ($("taskCount")) {
      $("taskCount").textContent = openTasks;
    }

    if ($("reportTasks")) {
      $("reportTasks").textContent = completedTasks;
    }

    updateHealth();
  }

  // ==========================================
  // JOURNEY LOG
  // ==========================================

  function getLogDates() {
    const dates = new Set(
      Object.keys(data.dailyLogs || {})
    );

    [
      data.days,
      data.health,
      data.sleep,
      data.faith,
      data.commute,
      data.reviews
    ].forEach(group => {
      Object.keys(group || {}).forEach(date => {
        dates.add(date);
      });
    });

    data.tasks.forEach(task => {
      if (task.createdAt) {
        dates.add(task.createdAt);
      }

      if (task.completedAt) {
        dates.add(task.completedAt);
      }
    });

    return [...dates]
      .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
      .sort((a, b) => b.localeCompare(a));
  }

  function snapshotFor(date) {
    return data.dailyLogs[date] ||
      buildDaySnapshot(date);
  }

  function dayCompletion(snapshot) {
    const habits = snapshot.habits?.length || 0;
    const prayers = snapshot.prayers?.length || 0;
    const tasks = snapshot.tasksCompleted?.length || 0;

    return Math.round(
      (
        (habits / HABITS.length) +
        (prayers / PRAYERS.length) +
        Math.min(1, tasks / 2)
      ) / 3 * 100
    );
  }

  function renderJourneyLog() {
    const body = $("journeyLogBody");

    if (!body) return;

    const period = $("logPeriod")?.value || "all";

    let dates = getLogDates();

    if (period !== "all") {
      const limit = parseDate(today);

      limit.setDate(
        limit.getDate() - (Number(period) - 1)
      );

      const minimumDate = localDateKey(limit);

      dates = dates.filter(date =>
        date >= minimumDate && date <= today
      );
    }

    if ($("logDaysCount")) {
      $("logDaysCount").textContent =
        `${dates.length} يوم مسجل`;
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

      const formattedDate = new Intl.DateTimeFormat(
        "ar",
        {
          day: "numeric",
          month: "short",
          year: "numeric"
        }
      ).format(parseDate(date));

      const values = [
        formattedDate,
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

        row.appendChild(cell);
      });

      const actionCell = document.createElement("td");
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = "عرض";

      button.addEventListener("click", () => {
        showDayDetails(date);
      });

      actionCell.appendChild(button);
      row.appendChild(actionCell);

      body.appendChild(row);
    });
  }

  function showDayDetails(date) {
    const record = snapshotFor(date);

    const panel = $("dayDetails");
    const content = $("dayDetailsContent");
    const heading = $("detailDate");

    if (!panel || !content || !heading) return;

    heading.textContent = new Intl.DateTimeFormat(
      "ar",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(parseDate(date));

    const habitNames = {
      prayer: "المحافظة على الصلاة",
      study: "المذاكرة والتركيز",
      exercise: "الحركة والرياضة",
      phone: "استخدام واعٍ للهاتف",
      sleep: "الالتزام بالنوم",
      discipline: "الابتعاد عن الإباحية"
    };

    const watchedCount = Array.isArray(record.videosWatched)
      ? record.videosWatched.length
      : 0;

    const details = [
      [
        "العادات",
        (record.habits || [])
          .map(key => habitNames[key] || key)
          .join("، ") || "لم تسجل عادات مكتملة"
      ],
      [
        "الصلوات",
        (record.prayers || []).join("، ") ||
          "لا توجد صلوات مسجلة"
      ],
      [
        "الماء والرياضة",
        `${record.water || 0} كوب ماء — ${record.exercise || 0} دقيقة نشاط`
      ],
      [
        "النوم",
        record.sleep?.start && record.sleep?.end
          ? `النوم ${record.sleep.start} — الاستيقاظ ${record.sleep.end}`
          : "لم يسجل النوم"
      ],
      [
        "المواصلات",
        `الذهاب: ${record.commute?.outbound ? "تم" : "لم يسجل"} — العودة: ${record.commute?.return ? "تم" : "لم تسجل"}`
      ],
      [
        "فيديوهات الأكاديمية",
        `${watchedCount} فيديو تم تسجيل الاستماع إليه`
      ],
      [
        "الدراسة",
        `مهام أضيفت: ${(record.tasksCreated || []).length} — مهام أُكملت: ${(record.tasksCompleted || []).length}`
      ],
      [
        "الورد والأذكار",
        record.faith || "لا يوجد تسجيل"
      ],
      [
        "أفضل إنجاز اليوم",
        record.review || "لم تكتب مراجعة"
      ],
      [
        "خطة الغد",
        record.tomorrow || "لم تكتب خطة"
      ],
      [
        "المهام",
        [
          ...(record.tasksCreated || []).map(task =>
            `${task.subject}: ${task.title}${task.done ? " (مكتملة)" : ""}`
          ),
          ...(record.tasksCompleted || []).map(task =>
            `${task.subject}: ${task.title} (أُكملت اليوم)`
          )
        ].join("\n") || "لا توجد مهام مسجلة"
      ]
    ];

    content.innerHTML = "";

    details.forEach(([title, value]) => {
      const item = document.createElement("div");

      item.className = "detail-item";

      const label = document.createElement("b");
      label.textContent = title;

      const text = document.createElement("span");
      text.textContent = value;

      item.append(label, text);
      content.appendChild(item);
    });

    panel.hidden = false;

    panel.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function initializeJourneyLog() {
    $("logPeriod")?.addEventListener(
      "change",
      renderJourneyLog
    );

    $("closeDayDetails")?.addEventListener(
      "click",
      () => {
        const details = $("dayDetails");

        if (details) {
          details.hidden = true;
        }
      }
    );
  }

  // ==========================================
  // BACKUP EXPORT AND IMPORT
  // ==========================================

  function exportBackup() {
    try {
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

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      showToast("تم تجهيز النسخة الاحتياطية");

    } catch (error) {
      console.error(error);
      showToast("تعذر تصدير البيانات");
    }
  }

  function initializeBackup() {
    $("exportData")?.addEventListener(
      "click",
      exportBackup
    );

    const importButton = $("importButton");
    const importFile = $("importFile");

    if (!importButton || !importFile) return;

    importButton.addEventListener("click", () => {
      importFile.click();
    });

    importFile.addEventListener("change", async event => {
      const file = event.target.files?.[0];

      if (!file) return;

      try {
        const imported = JSON.parse(
          await file.text()
        );

        if (
          !isObject(imported) ||
          !isObject(imported.days) ||
          !Array.isArray(imported.tasks)
        ) {
          throw new Error("نسخة احتياطية غير صحيحة");
        }

        if (
          !confirm(
            "سيتم استبدال البيانات الحالية بالنسخة المستوردة. هل تريد المتابعة؟"
          )
        ) {
          return;
        }

        const normalized = normalizeData(imported);

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(normalized)
        );

        showToast("تم الاستيراد. سيتم تحديث الصفحة.");

        setTimeout(() => {
          location.reload();
        }, 800);

      } catch (error) {
        console.error(error);

        showToast(
          "تعذر استيراد الملف. تأكد أنه ملف نسخة احتياطية صحيح."
        );

      } finally {
        importFile.value = "";
      }
    });
  }

  // ==========================================
  // INITIALIZE APPLICATION
  // ==========================================

  function initializeApp() {
    initializeHeader();
    initializeHabits();
    initializeSleep();
    initializeTasks();
    initializePrayers();
    initializeFaith();
    initializeHealth();
    initializeAcademy();
    initializeReview();
    initializeJourneyLog();
    initializeBackup();

    updateDashboard();
    renderTasks();
    renderJourneyLog();

    save();

    console.log(
      "AL-FAROUQ 1% — التطبيق جاهز للعمل"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeApp,
      { once: true }
    );
  } else {
    initializeApp();
  }

})();
