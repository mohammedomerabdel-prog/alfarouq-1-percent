
(() => {
    "use strict";

    // مفاتيح حفظ البيانات
    const STORAGE_KEY = "alfarouq_1_percent_data";

    const HABIT_NAMES = [
        "prayer",
        "study",
        "exercise",
        "phone",
        "sleep",
        "discipline"
    ];

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

    // التاريخ المحلي
    function getToday() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const today = getToday();

    // تحميل البيانات
    function loadData() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
                startDate: today,
                history: {},
                reviews: {}
            };
        } catch (error) {
            return {
                startDate: today,
                history: {},
                reviews: {}
            };
        }
    }

    const appData = loadData();

    function saveData() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(appData)
        );
    }

    // إنشاء سجل اليوم
    if (!appData.history[today]) {
        appData.history[today] = [];
    }

    // عرض التاريخ
    const dateElement = document.getElementById("currentDate");

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

    // القائمة الرئيسية
    const menuButton = document.getElementById("menuButton");
    const navigation = document.getElementById("navigation");

    function updateMenu() {
        if (!navigation) return;

        if (window.innerWidth <= 650) {
            navigation.style.display =
                navigation.classList.contains("open")
                    ? "flex"
                    : "none";
        } else {
            navigation.style.display = "";
        }
    }

    if (menuButton && navigation) {
        updateMenu();

        menuButton.addEventListener("click", () => {
            navigation.classList.toggle("open");
            updateMenu();
        });

        window.addEventListener("resize", updateMenu);

        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navigation.classList.remove("open");
                updateMenu();
            });
        });
    }

    // متابعة العادات
    const habitInputs = document.querySelectorAll(
        'input[data-habit]'
    );

    habitInputs.forEach(input => {
        const habit = input.dataset.habit;

        input.checked = appData.history[today].includes(habit);

        input.addEventListener("change", () => {
            let completed = appData.history[today];

            if (input.checked) {
                if (!completed.includes(habit)) {
                    completed.push(habit);
                }
            } else {
                completed = completed.filter(
                    item => item !== habit
                );
            }

            appData.history[today] = completed;

            saveData();
            updateStatistics();
        });
    });

    // تحديث الإحصائيات
    function updateStatistics() {
        const completed = appData.history[today] || [];

        const progress = HABIT_NAMES.length
            ? Math.round(
                (completed.length / HABIT_NAMES.length) * 100
            )
            : 0;

        const progressElement =
            document.getElementById("progressCount");

        if (progressElement) {
            progressElement.textContent = progress + "%";
        }

        // أيام الرحلة منذ أول تشغيل
        const start = new Date(appData.startDate + "T00:00:00");
        const current = new Date(today + "T00:00:00");

        const days = Math.max(
            1,
            Math.floor((current - start) / 86400000) + 1
        );

        const dayElement =
            document.getElementById("dayCount");

        if (dayElement) {
            dayElement.textContent = days;
        }

        // سلسلة الأيام التي أنجزت فيها عادة واحدة على الأقل
        let streak = 0;
        const checkDate = new Date(current);

        while (true) {
            const dateKey = [
                checkDate.getFullYear(),
                String(checkDate.getMonth() + 1).padStart(2, "0"),
                String(checkDate.getDate()).padStart(2, "0")
            ].join("-");

            const records = appData.history[dateKey] || [];

            if (records.length === 0) break;

            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        const streakElement =
            document.getElementById("streakCount");

        if (streakElement) {
            streakElement.textContent = streak;
        }
    }

    // مراجعة اليوم
    const reviewInput = document.getElementById("dailyReview");
    const saveReviewButton = document.getElementById("saveReview");

    if (reviewInput) {
        reviewInput.value = appData.reviews[today] || "";
    }

    if (saveReviewButton && reviewInput) {
        saveReviewButton.addEventListener("click", () => {
            appData.reviews[today] = reviewInput.value.trim();

            saveData();

            saveReviewButton.textContent = "تم الحفظ ✓";

            setTimeout(() => {
                saveReviewButton.textContent =
                    "حفظ مراجعة اليوم";
            }, 1800);
        });
    }

    // عرض المواد الجامعية
    const subjectsContainer =
        document.getElementById("subjectsList");

    if (subjectsContainer) {
        let subjectsToShow = DEFAULT_SUBJECTS;

        // استخدام المواد الموجودة في data.js إذا كانت معرفة
        try {
            if (
                typeof subjects !== "undefined" &&
                Array.isArray(subjects)
            ) {
                subjectsToShow = subjects;
            }
        } catch (error) {
            console.log("استخدام قائمة المواد الافتراضية");
        }

        subjectsContainer.innerHTML = "";

        subjectsToShow.forEach(subject => {
            const item = document.createElement("div");

            item.textContent =
                typeof subject === "string"
                    ? subject
                    : subject.name || subject.title || "مادة جامعية";

            subjectsContainer.appendChild(item);
        });
    }

    // تشغيل الإحصائيات أول مرة
    saveData();
    updateStatistics();

    console.log("AL-FAROUQ 1% is running successfully!");
})();
