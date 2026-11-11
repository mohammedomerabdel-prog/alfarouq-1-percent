
(() => {
    "use strict";

    const STORAGE_KEY = "alfarouq_1_percent_data_v3";

    const SUBJECTS = [
        "السلوك التنظيمي",
        "الإدارة باللغة الإنجليزية",
        "المحاسبة المالية",
        "الاقتصاد",
        "القانون التجاري",
        "المصارف",
        "الإحصاء",
        "الحاسوب"
    ];

    const HABITS = [
        "prayer",
        "study",
        "exercise",
        "phone",
        "sleep",
        "discipline"
    ];

    const PRAYERS = [
        "fajr",
        "dhuhr",
        "asr",
        "maghrib",
        "isha"
    ];

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    function localDate(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    const today = localDate();

    function emptyData() {
        return {
            startDate: today,
            history: {},
            tasks: [],
            reviews: {},
            sleep: {},
            health: {},
            commute: {}
        };
    }

    function loadData() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            if (!saved || typeof saved !== "object") {
                return emptyData();
            }

            const defaults = emptyData();

            return {
                ...defaults,
                ...saved,
                history: saved.history || {},
                tasks: Array.isArray(saved.tasks) ? saved.tasks : [],
                reviews: saved.reviews || {},
                sleep: saved.sleep || {},
                health: saved.health || {},
                commute: saved.commute || {}
            };
        } catch (error) {
            console.error("تعذر قراءة البيانات:", error);
            return emptyData();
        }
    }

    const data = loadData();

    function saveData() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );
            return true;
        } catch (error) {
            console.error("تعذر حفظ البيانات:", error);
            showToast("تعذر الحفظ. تحقق من مساحة المتصفح.");
            return false;
        }
    }

    function ensureToday() {
        if (!data.history[today]) {
            data.history[today] = {
                habits: [],
                prayers: [],
                water: 0,
                exercise: 0
            };
        }

        const record = data.history[today];

        if (Array.isArray(record)) {
            data.history[today] = {
                habits: record,
                prayers: [],
                water: 0,
                exercise: 0
            };
        }

        record.habits = Array.isArray(record.habits)
            ? record.habits : [];

        record.prayers = Array.isArray(record.prayers)
            ? record.prayers : [];

        record.water = Number(record.water) || 0;
        record.exercise = Number(record.exercise) || 0;
    }

    ensureToday();

    function showToast(message) {
        const toast = $("#toast");
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    }

    // التاريخ
    const dateElement = $("#currentDate");

    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString(
            "ar-EG",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
    }

    // القائمة
    const menuButton = $("#menuButton");
    const navigation = $("#navigation");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            navigation.classList.toggle("open");
        });

        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navigation.classList.remove("open");
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 650) {
                navigation.classList.remove("open");
            }
        });
    }

    // العادات
    $$("[data-habit]").forEach(input => {
        const habit = input.dataset.habit;

        input.checked = data.history[today].habits.includes(habit);

        input.addEventListener("change", () => {
            const habits = data.history[today].habits;

            if (input.checked && !habits.includes(habit)) {
                habits.push(habit);
            } else if (!input.checked) {
                data.history[today].habits =
                    habits.filter(item => item !== habit);
            }

            saveData();
            updateStatistics();
            showToast("تم تحديث العادات");
        });
    });

    function updateStatistics() {
        const completed = data.history[today].habits.length;
        const progress = Math.round(
            (completed / HABITS.length) * 100
        );

        if ($("#progressCount")) {
            $("#progressCount").textContent = `${progress}%`;
        }

        if ($("#habitProgressBar")) {
            $("#habitProgressBar").style.width = `${progress}%`;
        }

        if ($("#habitProgressText")) {
            $("#habitProgressText").textContent =
                `${completed} من ${HABITS.length} عادات مكتملة`;
        }

        const start = new Date(data.startDate + "T00:00:00");
        const now = new Date(today + "T00:00:00");

        const days = Math.max(
            1,
            Math.floor((now - start) / 86400000) + 1
        );

        if ($("#dayCount")) {
            $("#dayCount").textContent = days;
        }

        let streak = 0;
        const check = new Date(now);

        while (true) {
            const key = localDate(check);
            const record = data.history[key];

            if (!record) break;

            const habits = Array.isArray(record)
                ? record
                : record.habits || [];

            if (habits.length === 0) break;

            streak++;
            check.setDate(check.getDate() - 1);
        }

        if ($("#streakCount")) {
            $("#streakCount").textContent = streak;
        }
    }

    // المواد الجامعية
    function renderSubjects() {
        const container = $("#subjectsList");
        const select = $("#taskSubject");

        if (!container) return;

        container.innerHTML = "";

        SUBJECTS.forEach(subject => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "subject-card";

            const name = document.createElement("span");
            name.textContent = subject;

            const count = document.createElement("small");
            const total = data.tasks.filter(
                task => task.subject === subject
            ).length;

            count.textContent = `${total} مهام`;

            button.append(name, count);

            button.addEventListener("click", () => {
                if (select) {
                    select.value = subject;
                }

                $$(".subject-card").forEach(card => {
                    card.classList.remove("active");
                });

                button.classList.add("active");

                $("#taskForm")?.classList.remove("hidden");
                $("#taskTitle")?.focus();

                showToast(`تم اختيار ${subject}`);
            });

            container.appendChild(button);

            if (select && !Array.from(select.options).some(
                option => option.value === subject
            )) {
                const option = document.createElement("option");
                option.value = subject;
                option.textContent = subject;
                select.appendChild(option);
            }
        });
    }

    // المهام الدراسية
    const taskForm = $("#taskForm");

    $("#addTaskButton")?.addEventListener("click", () => {
        taskForm?.classList.toggle("hidden");
        $("#taskTitle")?.focus();
    });

    $("#cancelTaskButton")?.addEventListener("click", () => {
        taskForm?.classList.add("hidden");
        taskForm?.reset();
    });

    taskForm?.addEventListener("submit", event => {
        event.preventDefault();

        const title = $("#taskTitle").value.trim();
        const subject = $("#taskSubject").value;
        const dueDate = $("#taskDate").value;

        if (!title || !subject) {
            showToast("اكتب اسم المهمة واختر المادة");
            return;
        }

        data.tasks.push({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            title,
            subject,
            dueDate,
            completed: false,
            createdAt: today
        });

        saveData();
        taskForm.reset();
        taskForm.classList.add("hidden");

        renderTasks();
        renderSubjects();
        showToast("تمت إضافة المهمة بنجاح");
    });

    function renderTasks() {
        const container = $("#tasksList");
        if (!container) return;

        container.innerHTML = "";

        if (data.tasks.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-state";
            empty.textContent = "لا توجد مهام حتى الآن. أضف أول مهمة.";
            container.appendChild(empty);
            return;
        }

        const sorted = [...data.tasks].sort((a, b) => {
            return Number(a.completed) - Number(b.completed);
        });

        sorted.forEach(task => {
            const item = document.createElement("div");
            item.className = "task-item";

            if (task.completed) {
                item.classList.add("completed");
            }

            const info = document.createElement("div");
            info.className = "task-info";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = Boolean(task.completed);
            checkbox.setAttribute("aria-label", "إكمال المهمة");

            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                saveData();
                renderTasks();
                renderSubjects();
                showToast(task.completed ? "أحسنت! أُنجزت المهمة" : "أعيد فتح المهمة");
            });

            const details = document.createElement("div");

            const title = document.createElement("strong");
            title.textContent = task.title;

            const meta = document.createElement("small");
            meta.textContent = `${task.subject}${task.dueDate ? " • موعد: " + task.dueDate : ""}`;

            details.append(title, meta);
            info.append(checkbox, details);

            const remove = document.createElement("button");
            remove.className = "delete-task";
            remove.type = "button";
            remove.textContent = "×";
            remove.title = "حذف المهمة";

            remove.addEventListener("click", () => {
                if (!confirm("هل تريد حذف هذه المهمة؟")) return;

                data.tasks = data.tasks.filter(
                    entry => entry.id !== task.id
                );

                saveData();
                renderTasks();
                renderSubjects();
                showToast("تم حذف المهمة");
            });

            item.append(info, remove);
            container.appendChild(item);
        });
    }

    // الصلوات
    $$("[data-prayer]").forEach(input => {
        const prayer = input.dataset.prayer;

        input.checked = data.history[today].prayers.includes(prayer);

        input.addEventListener("change", () => {
            const prayers = data.history[today].prayers;

            if (input.checked && !prayers.includes(prayer)) {
                prayers.push(prayer);
            } else if (!input.checked) {
                data.history[today].prayers =
                    prayers.filter(item => item !== prayer);
            }

            saveData();
            updatePrayerCount();
            showToast("تم تحديث سجل الصلاة");
        });
    });

    function updatePrayerCount() {
        if ($("#prayerCount")) {
            $("#prayerCount").textContent =
                `${data.history[today].prayers.length} من 5`;
        }
    }

    // النوم
    const savedSleep = data.sleep[today];

    if (savedSleep) {
        $("#sleepTime").value = savedSleep.sleep || "21:00";
        $("#wakeTime").value = savedSleep.wake || "04:00";
        showSleepResult(savedSleep.sleep, savedSleep.wake);
    }

    function showSleepResult(sleep, wake) {
        if (!sleep || !wake || !$("#sleepResult")) return;

        const [sh, sm] = sleep.split(":").map(Number);
        const [wh, wm] = wake.split(":").map(Number);

        let startMinutes = sh * 60 + sm;
        let endMinutes = wh * 60 + wm;

        if (endMinutes <= startMinutes) {
            endMinutes += 1440;
        }

        const duration = endMinutes - startMinutes;
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        $("#sleepResult").textContent =
            `مدة نومك: ${hours} ساعة و${minutes} دقيقة.`;
    }

    $("#saveSleepButton")?.addEventListener("click", () => {
        const sleep = $("#sleepTime").value;
        const wake = $("#wakeTime").value;

        if (!sleep || !wake) {
            showToast("أدخل وقت النوم والاستيقاظ");
            return;
        }

        data.sleep[today] = { sleep, wake };

        saveData();
        showSleepResult(sleep, wake);
        showToast("تم حفظ سجل النوم");
    });

    // الصحة والماء والتمارين
    function updateHealth() {
        const health = data.history[today];

        $("#waterCount").textContent = health.water;
        $("#exerciseCount").textContent = health.exercise;
    }

    $("#addWater")?.addEventListener("click", () => {
        data.history[today].water = Math.min(
            30,
            data.history[today].water + 1
        );

        saveData();
        updateHealth();
        showToast("تم تسجيل كوب ماء");
    });

    $("#removeWater")?.addEventListener("click", () => {
        data.history[today].water = Math.max(
            0,
            data.history[today].water - 1
        );

        saveData();
        updateHealth();
    });

    $("#addExercise")?.addEventListener("click", () => {
        data.history[today].exercise += 10;

        saveData();
        updateHealth();
        showToast("تم تسجيل 10 دقائق نشاط");
    });

    $("#removeExercise")?.addEventListener("click", () => {
        data.history[today].exercise = Math.max(
            0,
            data.history[today].exercise - 10
        );

        saveData();
        updateHealth();
    });

    // المواصلات
    $$("[data-commute]").forEach(input => {
        const direction = input.dataset.commute;

        if (!data.commute[today]) {
            data.commute[today] = [];
        }

        input.checked = data.commute[today].includes(direction);

        input.addEventListener("change", () => {
            const list = data.commute[today];

            if (input.checked && !list.includes(direction)) {
                list.push(direction);
            } else if (!input.checked) {
                data.commute[today] = list.filter(
                    item => item !== direction
                );
            }

            saveData();
            showToast("تم تحديث خطة المواصلات");
        });
    });

    // المراجعة اليومية
    const review = data.reviews[today] || {};

    $("#dailyReview").value = review.achievement || "";
    $("#tomorrowPlan").value = review.tomorrow || "";

    $("#saveReview")?.addEventListener("click", () => {
        data.reviews[today] = {
            achievement: $("#dailyReview").value.trim(),
            tomorrow: $("#tomorrowPlan").value.trim()
        };

        saveData();

        $("#reviewStatus").textContent = "تم حفظ مراجعتك بنجاح ✓";
        showToast("مراجعتك محفوظة");
    });

    // تصدير البيانات
    $("#exportData")?.addEventListener("click", () => {
        saveData();

        const backup = {
            app: "AL-FAROUQ 1%",
            version: 3,
            exportedAt: new Date().toISOString(),
            data
        };

        const blob = new Blob(
            [JSON.stringify(backup, null, 2)],
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

        $("#backupStatus").textContent = "تم تنزيل النسخة الاحتياطية.";
    });

    // استيراد البيانات
    $("#importDataButton")?.addEventListener("click", () => {
        $("#importDataInput")?.click();
    });

    $("#importDataInput")?.addEventListener("change", async event => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const backup = JSON.parse(text);
            const imported = backup.data || backup;

            if (
                !imported ||
                typeof imported !== "object" ||
                !imported.history ||
                !Array.isArray(imported.tasks)
            ) {
                throw new Error("نسخة غير صالحة");
            }

            if (!confirm("سيتم استبدال بياناتك الحالية بالنسخة المستوردة. هل تريد المتابعة؟")) {
                event.target.value = "";
                return;
            }

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(imported)
            );

            showToast("تم استيراد البيانات. جارٍ تحديث الصفحة.");

            setTimeout(() => location.reload(), 700);

        } catch (error) {
            console.error(error);
            $("#backupStatus").textContent =
                "تعذر استيراد الملف. تأكد أنه نسخة صحيحة من الموقع.";
        }

        event.target.value = "";
    });

    // تشغيل الصفحة
    renderSubjects();
    renderTasks();
    updateStatistics();
    updatePrayerCount();
    updateHealth();

    saveData();

    console.log("AL-FAROUQ 1% is ready.");
})();
