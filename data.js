
/*
  AL-FAROUQ 1% — DATA
  هذا الملف يحتوي على المواد الجامعية وأكاديمية المواصلات.

  ملاحظة:
  الروابط المباشرة التي تم التحقق منها أُضيفت كما هي.
  بقية العناصر تفتح بحثاً بعنوان الفيديو في يوتيوب،
  حتى لا نضع روابط فيديوهات عشوائية أو معرّفات غير مؤكدة.
*/

window.APP_DATA = {
  subjects: [
    "السلوك التنظيمي",
    "الإدارة باللغة الإنجليزية",
    "المحاسبة المالية",
    "الاقتصاد",
    "القانون التجاري",
    "المصارف",
    "الإحصاء",
    "الحاسوب"
  ],

  videos: [
    // اليوم 1
    {
      id: "v01",
      day: 1,
      slot: "outbound",
      title: "كيف تتفوق في الدراسة؟ أسرار المذاكرة الفعالة وتنظيم الوقت",
      category: "study",
      description: "طرق تنظيم الوقت والتركيز والمراجعة الفعالة.",
      url: "https://www.youtube.com/watch?v=YT-RgEleutk"
    },
    {
      id: "v02",
      day: 1,
      slot: "return",
      title: "كيف أتوب إلى الله توبة نصوحة؟",
      category: "faith",
      description: "شرح شروط التوبة ومعاني الرجوع إلى الله.",
      url: "https://www.youtube.com/watch?v=ESdDnQ_-mUk"
    },

    // اليوم 2
    {
      id: "v03",
      day: 2,
      slot: "outbound",
      title: "5 نصائح للتركيز المطلق أثناء المذاكرة",
      category: "study",
      description: "تقليل المشتتات وتنظيم جلسة المذاكرة.",
      url: "https://www.youtube.com/watch?v=CNlj-uAiqmA"
    },
    {
      id: "v04",
      day: 2,
      slot: "return",
      title: "كيف تحافظ على الصلاة وتثبت عليها؟",
      category: "faith",
      description: "خطوات عملية للمحافظة على الصلاة.",
      url: "https://www.youtube.com/results?search_query=كيف+تحافظ+على+الصلاة+وتثبت+عليها"
    },

    // اليوم 3
    {
      id: "v05",
      day: 3,
      slot: "outbound",
      title: "كيف تبني عادة جديدة وتلتزم بها؟",
      category: "self",
      description: "فهم بناء العادات والاستمرار عليها.",
      url: "https://www.youtube.com/results?search_query=كيف+تبني+عادة+جديدة+وتلتزم+بها"
    },
    {
      id: "v06",
      day: 3,
      slot: "return",
      title: "كيف تتدبر القرآن وتنتفع به؟",
      category: "faith",
      description: "مدخل عملي للتدبر وفهم الآيات.",
      url: "https://www.youtube.com/results?search_query=كيف+تتدبر+القرآن+وتنتفع+به"
    },

    // اليوم 4
    {
      id: "v07",
      day: 4,
      slot: "outbound",
      title: "كيف تتخلص من التسويف وتبدأ الآن؟",
      category: "self",
      description: "أسباب التأجيل وخطوات عملية للتغلب عليه.",
      url: "https://www.youtube.com/results?search_query=كيف+تتخلص+من+التسويف+وتبدأ+الآن"
    },
    {
      id: "v08",
      day: 4,
      slot: "return",
      title: "أهمية أذكار الصباح والمساء",
      category: "faith",
      description: "معاني الذكر وأثره في حياة المسلم.",
      url: "https://www.youtube.com/results?search_query=أهمية+أذكار+الصباح+والمساء+شرح"
    },

    // اليوم 5
    {
      id: "v09",
      day: 5,
      slot: "outbound",
      title: "كيف تتعلم أي مهارة من الصفر؟",
      category: "self",
      description: "خطة للتعلم الذاتي واكتساب المهارات.",
      url: "https://www.youtube.com/results?search_query=كيف+تتعلم+أي+مهارة+من+الصفر"
    },
    {
      id: "v10",
      day: 5,
      slot: "return",
      title: "الصبر والثبات وقت الابتلاء",
      category: "faith",
      description: "معاني الصبر وحسن التوكل على الله.",
      url: "https://www.youtube.com/results?search_query=الصبر+والثبات+وقت+الابتلاء+محاضرة"
    },

    // اليوم 6
    {
      id: "v11",
      day: 6,
      slot: "outbound",
      title: "كيف تقوي ذاكرتك وتتذكر ما تتعلمه؟",
      category: "study",
      description: "أساليب التذكر والمراجعة والاسترجاع.",
      url: "https://www.youtube.com/results?search_query=كيف+تقوي+ذاكرتك+وتتذكر+ما+تتعلمه"
    },
    {
      id: "v12",
      day: 6,
      slot: "return",
      title: "كيف تتعامل مع القلق والتفكير الزائد؟",
      category: "mind",
      description: "فهم التفكير الزائد وطرق التعامل معه.",
      url: "https://www.youtube.com/results?search_query=كيف+تتعامل+مع+القلق+والتفكير+الزائد"
    },

    // اليوم 7
    {
      id: "v13",
      day: 7,
      slot: "outbound",
      title: "كيف تنظم يومك وتحدد أولوياتك؟",
      category: "self",
      description: "إدارة الوقت وترتيب المهام اليومية.",
      url: "https://www.youtube.com/results?search_query=كيف+تنظم+يومك+وتحدد+أولوياتك"
    },
    {
      id: "v14",
      day: 7,
      slot: "return",
      title: "فضل الاستغفار وأثره في حياة المسلم",
      category: "faith",
      description: "معاني الاستغفار وفضله.",
      url: "https://www.youtube.com/results?search_query=فضل+الاستغفار+وأثره+في+حياة+المسلم"
    },

    // اليوم 8
    {
      id: "v15",
      day: 8,
      slot: "outbound",
      title: "كيف تتخلص من إدمان الهاتف؟",
      category: "mind",
      description: "فهم التعلق بالهاتف وتقليل الاستخدام.",
      url: "https://www.youtube.com/results?search_query=كيف+تتخلص+من+إدمان+الهاتف"
    },
    {
      id: "v16",
      day: 8,
      slot: "return",
      title: "حسن الخلق وأثره في التعامل مع الناس",
      category: "faith",
      description: "الأخلاق في الإسلام والتعامل اليومي.",
      url: "https://www.youtube.com/results?search_query=حسن+الخلق+وأثره+في+التعامل+مع+الناس"
    },

    // اليوم 9
    {
      id: "v17",
      day: 9,
      slot: "outbound",
      title: "طريقة فاينمان: كيف تفهم أي موضوع بعمق؟",
      category: "study",
      description: "التعلم عن طريق التبسيط والشرح.",
      url: "https://www.youtube.com/results?search_query=طريقة+فاينمان+كيف+تفهم+أي+موضوع"
    },
    {
      id: "v18",
      day: 9,
      slot: "return",
      title: "كيف تحسن علاقتك بالله؟",
      category: "faith",
      description: "خطوات إيمانية عملية لتقوية الصلة بالله.",
      url: "https://www.youtube.com/results?search_query=كيف+تحسن+علاقتك+بالله+محاضرة"
    },

    // اليوم 10
    {
      id: "v19",
      day: 10,
      slot: "outbound",
      title: "كيف تبني الانضباط الذاتي؟",
      category: "self",
      description: "الفرق بين الحماس والانضباط وكيف تستمر.",
      url: "https://www.youtube.com/results?search_query=كيف+تبني+الانضباط+الذاتي"
    },
    {
      id: "v20",
      day: 10,
      slot: "return",
      title: "كيف تتعامل مع الغضب وتضبط نفسك؟",
      category: "mind",
      description: "فهم الغضب وأساليب التحكم في ردود الأفعال.",
      url: "https://www.youtube.com/results?search_query=كيف+تتعامل+مع+الغضب+وتضبط+نفسك"
    },

    // اليوم 11
    {
      id: "v21",
      day: 11,
      slot: "outbound",
      title: "كيف تذاكر بذكاء وليس لساعات طويلة؟",
      category: "study",
      description: "التعلم الفعال وتوزيع جلسات المذاكرة.",
      url: "https://www.youtube.com/results?search_query=كيف+تذاكر+بذكاء+وليس+لساعات+طويلة"
    },
    {
      id: "v22",
      day: 11,
      slot: "return",
      title: "التوكل على الله مع الأخذ بالأسباب",
      category: "faith",
      description: "التوازن بين السعي والتوكل.",
      url: "https://www.youtube.com/results?search_query=التوكل+على+الله+مع+الأخذ+بالأسباب"
    },

    // اليوم 12
    {
      id: "v23",
      day: 12,
      slot: "outbound",
      title: "كيف تحسن ثقتك بنفسك؟",
      category: "mind",
      description: "بناء الثقة بالنفس بعيداً عن المقارنة.",
      url: "https://www.youtube.com/results?search_query=كيف+تحسن+ثقتك+بنفسك"
    },
    {
      id: "v24",
      day: 12,
      slot: "return",
      title: "قيمة الوقت في حياة المسلم",
      category: "faith",
      description: "أهمية الوقت وحسن استثماره.",
      url: "https://www.youtube.com/results?search_query=قيمة+الوقت+في+حياة+المسلم+محاضرة"
    },

    // اليوم 13
    {
      id: "v25",
      day: 13,
      slot: "outbound",
      title: "كيف تتعلم اللغة الإنجليزية بانتظام؟",
      category: "study",
      description: "بناء روتين بسيط للتعلم والممارسة.",
      url: "https://www.youtube.com/results?search_query=كيف+تتعلم+اللغة+الإنجليزية+بشكل+منتظم"
    },
    {
      id: "v26",
      day: 13,
      slot: "return",
      title: "كيف تتعامل مع الانتكاسة وتبدأ من جديد؟",
      category: "self",
      description: "التعامل مع التعثر دون الاستسلام.",
      url: "https://www.youtube.com/results?search_query=كيف+تتعامل+مع+الانتكاسة+وتبدأ+من+جديد"
    },

    // اليوم 14
    {
      id: "v27",
      day: 14,
      slot: "outbound",
      title: "أهمية النوم لصحة العقل والجسم",
      category: "health",
      description: "دور النوم في التعلم والتركيز والصحة.",
      url: "https://www.youtube.com/results?search_query=أهمية+النوم+لصحة+العقل+والجسم"
    },
    {
      id: "v28",
      day: 14,
      slot: "return",
      title: "الذكر والطمأنينة وراحة القلب",
      category: "faith",
      description: "أثر ذكر الله في حياة الإنسان.",
      url: "https://www.youtube.com/results?search_query=الذكر+والطمأنينة+وراحة+القلب"
    },

    // اليوم 15
    {
      id: "v29",
      day: 15,
      slot: "outbound",
      title: "كيف تفكر بطريقة منظمة وتحل المشكلات؟",
      category: "self",
      description: "التفكير المنطقي وتحليل المشكلات.",
      url: "https://www.youtube.com/results?search_query=كيف+تفكر+بطريقة+منظمة+وتحل+المشكلات"
    },
    {
      id: "v30",
      day: 15,
      slot: "return",
      title: "كيف تحافظ على ورد يومي من القرآن؟",
      category: "faith",
      description: "طرق عملية للاستمرار في قراءة القرآن.",
      url: "https://www.youtube.com/results?search_query=كيف+تحافظ+على+ورد+يومي+من+القرآن"
    },

    // اليوم 16
    {
      id: "v31",
      day: 16,
      slot: "outbound",
      title: "كيف تتحدث أمام الناس بثقة؟",
      category: "self",
      description: "مهارات التواصل والتحدث أمام الجمهور.",
      url: "https://www.youtube.com/results?search_query=كيف+تتحدث+أمام+الناس+بثقة"
    },
    {
      id: "v32",
      day: 16,
      slot: "return",
      title: "فقه الأولويات وتنظيم الأعمال",
      category: "faith",
      description: "كيف توازن بين الواجبات والأعمال.",
      url: "https://www.youtube.com/results?search_query=فقه+الأولويات+وتنظيم+الأعمال+محاضرة"
    },

    // اليوم 17
    {
      id: "v33",
      day: 17,
      slot: "outbound",
      title: "كيف تتجنب التشتت الرقمي؟",
      category: "mind",
      description: "تقليل المقاطعات واستعادة التركيز.",
      url: "https://www.youtube.com/results?search_query=كيف+تتجنب+التشتت+الرقمي"
    },
    {
      id: "v34",
      day: 17,
      slot: "return",
      title: "حقوق الوالدين وصلة الرحم",
      category: "faith",
      description: "فضل بر الوالدين وصلة الأقارب.",
      url: "https://www.youtube.com/results?search_query=حقوق+الوالدين+وصلة+الرحم+محاضرة"
    },

    // اليوم 18
    {
      id: "v35",
      day: 18,
      slot: "outbound",
      title: "أساسيات التغذية الصحية المتوازنة",
      category: "health",
      description: "مبادئ عامة للأكل المتوازن والعادات الصحية.",
      url: "https://www.youtube.com/results?search_query=أساسيات+التغذية+الصحية+المتوازنة"
    },
    {
      id: "v36",
      day: 18,
      slot: "return",
      title: "كيف تتعامل مع الحزن والضيق؟",
      category: "mind",
      description: "فهم المشاعر وطلب الدعم المناسب عند الحاجة.",
      url: "https://www.youtube.com/results?search_query=كيف+تتعامل+مع+الحزن+والضيق"
    },

    // اليوم 19
    {
      id: "v37",
      day: 19,
      slot: "outbound",
      title: "كيف تطور مهاراتك في الإدارة والقيادة؟",
      category: "self",
      description: "مبادئ القيادة وتحمل المسؤولية.",
      url: "https://www.youtube.com/results?search_query=كيف+تطور+مهاراتك+في+الإدارة+والقيادة"
    },
    {
      id: "v38",
      day: 19,
      slot: "return",
      title: "معنى الإخلاص في العمل والعبادة",
      category: "faith",
      description: "الإخلاص وتصحيح النية في الأعمال.",
      url: "https://www.youtube.com/results?search_query=معنى+الإخلاص+في+العمل+والعبادة"
    },

    // اليوم 20
    {
      id: "v39",
      day: 20,
      slot: "outbound",
      title: "كيف تتعلم من أخطائك وتطور نفسك؟",
      category: "self",
      description: "تحويل التجارب والأخطاء إلى فرص للتعلم.",
      url: "https://www.youtube.com/results?search_query=كيف+تتعلم+من+أخطائك+وتطور+نفسك"
    },
    {
      id: "v40",
      day: 20,
      slot: "return",
      title: "أهمية الدعاء وحسن الظن بالله",
      category: "faith",
      description: "معاني الدعاء وآدابه وحسن الظن بالله.",
      url: "https://www.youtube.com/results?search_query=أهمية+الدعاء+وحسن+الظن+بالله"
    },

    // اليوم 21
    {
      id: "v41",
      day: 21,
      slot: "outbound",
      title: "فوائد المشي والنشاط البدني",
      category: "health",
      description: "أثر الحركة المنتظمة على الصحة العامة.",
      url: "https://www.youtube.com/results?search_query=فوائد+المشي+والنشاط+البدني"
    },
    {
      id: "v42",
      day: 21,
      slot: "return",
      title: "كيف تستثمر وقت الفراغ؟",
      category: "self",
      description: "اختيار أنشطة نافعة بدلاً من إضاعة الوقت.",
      url: "https://www.youtube.com/results?search_query=كيف+تستثمر+وقت+الفراغ"
    },

    // اليوم 22
    {
      id: "v43",
      day: 22,
      slot: "outbound",
      title: "كيف تتعامل مع ضغط الامتحانات؟",
      category: "study",
      description: "التخطيط للمراجعة والتعامل مع القلق الدراسي.",
      url: "https://www.youtube.com/results?search_query=كيف+تتعامل+مع+ضغط+الامتحانات"
    },
    {
      id: "v44",
      day: 22,
      slot: "return",
      title: "أهمية الصحبة الصالحة",
      category: "faith",
      description: "أثر الأصدقاء والبيئة على الاستقامة.",
      url: "https://www.youtube.com/results?search_query=أهمية+الصحبة+الصالحة+محاضرة"
    },

    // اليوم 23
    {
      id: "v45",
      day: 23,
      slot: "outbound",
      title: "كيف تبني روتيناً صباحياً ناجحاً؟",
      category: "self",
      description: "بداية اليوم بخطوات بسيطة ومنظمة.",
      url: "https://www.youtube.com/results?search_query=كيف+تبني+روتيناً+صباحياً+ناجحاً"
    },
    {
      id: "v46",
      day: 23,
      slot: "return",
      title: "التوبة والاستقامة والثبات",
      category: "faith",
      description: "كيف يستمر الإنسان في طريق التغيير.",
      url: "https://www.youtube.com/results?search_query=التوبة+والاستقامة+والثبات+محاضرة"
    },

    // اليوم 24
    {
      id: "v47",
      day: 24,
      slot: "outbound",
      title: "كيف تطور مهارة التواصل والاستماع؟",
      category: "self",
      description: "الاستماع الفعال وفهم الآخرين والتواصل الجيد.",
      url: "https://www.youtube.com/results?search_query=كيف+تطور+مهارة+التواصل+والاستماع"
    },
    {
      id: "v48",
      day: 24,
      slot: "return",
      title: "التوازن بين العبادة والدراسة والحياة",
      category: "faith",
      description: "تنظيم المسؤوليات دون إهمال الجانب الإيماني.",
      url: "https://www.youtube.com/results?search_query=التوازن+بين+العبادة+والدراسة+والحياة"
    },

    // اليوم 25
    {
      id: "v49",
      day: 25,
      slot: "outbound",
      title: "كيف تراجع أهدافك وتخطط للشهر القادم؟",
      category: "self",
      description: "مراجعة الإنجازات ووضع أهداف واقعية جديدة.",
      url: "https://www.youtube.com/results?search_query=كيف+تراجع+أهدافك+وتخطط+للشهر+القادم"
    },
    {
      id: "v50",
      day: 25,
      slot: "return",
      title: "الثبات على الطاعة والاستمرار في طريق الخير",
      category: "faith",
      description: "خطوات عملية للاستمرار بعد بداية التغيير.",
      url: "https://www.youtube.com/results?search_query=الثبات+على+الطاعة+والاستمرار+في+طريق+الخير"
    }
  ]
};
