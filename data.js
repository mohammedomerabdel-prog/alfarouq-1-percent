
// ==========================================
// AL-FAROUQ 1% — البيانات الأساسية للمشروع
// ==========================================

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

  prayers: ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"],

  // صور أغلفة تمثيلية حسب تصنيف الفيديو
  videoCovers: {
    religion:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=640&h=360&fit=crop",
    "self-development":
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=640&h=360&fit=crop",
    psychology:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=640&h=360&fit=crop",
    study:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=640&h=360&fit=crop",
    health:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=640&h=360&fit=crop",
    skills:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=640&h=360&fit=crop"
  },

  // إنشاء بيانات الفيديو
  videos: [
    // اليوم الأول
    {
      id: 1, day: 1, type: "going",
      title: "كيف تبدأ يومك بذكر الله؟",
      category: "religion",
      description: "تذكير بأهمية الأذكار وبداية اليوم بالقرب من الله."
    },
    {
      id: 2, day: 1, type: "return",
      title: "كيف تبني عادة جديدة وتلتزم بها؟",
      category: "self-development",
      description: "خطوات عملية لبناء العادات والاستمرار عليها."
    },

    // اليوم الثاني
    {
      id: 3, day: 2, type: "going",
      title: "كيف تحافظ على الصلاة في وقتها؟",
      category: "religion",
      description: "وسائل عملية للمحافظة على الصلوات اليومية."
    },
    {
      id: 4, day: 2, type: "return",
      title: "قوة الانضباط الذاتي",
      category: "self-development",
      description: "كيف تنجز ما يجب عليك حتى عندما لا تشعر بالرغبة؟"
    },

    // اليوم الثالث
    {
      id: 5, day: 3, type: "going",
      title: "رحلة تدبر القرآن الكريم",
      category: "religion",
      description: "كيف تجعل القرآن جزءاً أساسياً من يومك؟"
    },
    {
      id: 6, day: 3, type: "return",
      title: "كيف تتخلص من التسويف؟",
      category: "self-development",
      description: "طرق بسيطة للتوقف عن تأجيل المهام."
    },

    // اليوم الرابع
    {
      id: 7, day: 4, type: "going",
      title: "حسن الخلق وأثره في حياتك",
      category: "religion",
      description: "أهمية الأخلاق الحسنة في التعامل مع الناس."
    },
    {
      id: 8, day: 4, type: "return",
      title: "إدارة الوقت وتنظيم اليوم",
      category: "self-development",
      description: "كيف تستفيد من ساعات يومك بصورة أفضل؟"
    },

    // اليوم الخامس
    {
      id: 9, day: 5, type: "going",
      title: "معنى التوكل على الله",
      category: "religion",
      description: "الفرق بين التوكل والتواكل."
    },
    {
      id: 10, day: 5, type: "return",
      title: "التفكير الإيجابي وتغيير الحياة",
      category: "psychology",
      description: "كيف تؤثر طريقة تفكيرك على قراراتك؟"
    },

    // اليوم السادس
    {
      id: 11, day: 6, type: "going",
      title: "فضل الاستغفار في حياة المسلم",
      category: "religion",
      description: "التعرف على فضل الاستغفار وأثره."
    },
    {
      id: 12, day: 6, type: "return",
      title: "كيف تزيد ثقتك بنفسك؟",
      category: "psychology",
      description: "خطوات عملية لبناء الثقة بالنفس."
    },

    // اليوم السابع
    {
      id: 13, day: 7, type: "going",
      title: "الصبر وقت الشدائد",
      category: "religion",
      description: "معنى الصبر وكيفية التعامل مع الصعوبات."
    },
    {
      id: 14, day: 7, type: "return",
      title: "كيف تركز في دراستك؟",
      category: "study",
      description: "أساليب تقليل التشتت وزيادة التركيز."
    },

    // اليوم الثامن
    {
      id: 15, day: 8, type: "going",
      title: "أهمية الدعاء في حياة المسلم",
      category: "religion",
      description: "كيف تجعل الدعاء عادة يومية؟"
    },
    {
      id: 16, day: 8, type: "return",
      title: "طريقة بومودورو للمذاكرة",
      category: "study",
      description: "تنظيم جلسات الدراسة والاستراحات."
    },

    // اليوم التاسع
    {
      id: 17, day: 9, type: "going",
      title: "بر الوالدين وفضله",
      category: "religion",
      description: "صور عملية للإحسان إلى الوالدين."
    },
    {
      id: 18, day: 9, type: "return",
      title: "كيف تتعامل مع القلق؟",
      category: "psychology",
      description: "طرق بسيطة للتعامل مع القلق والضغط."
    },

    // اليوم العاشر
    {
      id: 19, day: 10, type: "going",
      title: "قيمة الوقت في الإسلام",
      category: "religion",
      description: "أهمية الوقت وكيفية استثماره."
    },
    {
      id: 20, day: 10, type: "return",
      title: "أسرار القراءة الفعالة",
      category: "study",
      description: "كيف تقرأ وتفهم وتتذكر بصورة أفضل؟"
    },

    // اليوم الحادي عشر
    {
      id: 21, day: 11, type: "going",
      title: "الإخلاص في العمل والعبادة",
      category: "religion",
      description: "كيف تجعل نيتك خالصة لله؟"
    },
    {
      id: 22, day: 11, type: "return",
      title: "العادات الصغيرة تصنع نتائج كبيرة",
      category: "self-development",
      description: "أثر التحسن البسيط والمتواصل."
    },

    // اليوم الثاني عشر
    {
      id: 23, day: 12, type: "going",
      title: "أذكار الصباح والمساء",
      category: "religion",
      description: "فضل الأذكار وأهمية المحافظة عليها."
    },
    {
      id: 24, day: 12, type: "return",
      title: "كيف تتعلم مهارة جديدة؟",
      category: "skills",
      description: "خطة عملية لتعلم أي مهارة من الصفر."
    },

    // اليوم الثالث عشر
    {
      id: 25, day: 13, type: "going",
      title: "الرضا والقناعة",
      category: "religion",
      description: "كيف تعيش مطمئن القلب وراضياً؟"
    },
    {
      id: 26, day: 13, type: "return",
      title: "التحدث أمام الجمهور بثقة",
      category: "skills",
      description: "التغلب على الخوف وتحسين مهارات الإلقاء."
    },

    // اليوم الرابع عشر
    {
      id: 27, day: 14, type: "going",
      title: "التوبة والعودة إلى الله",
      category: "religion",
      description: "معنى التوبة الصادقة وفتح صفحة جديدة."
    },
    {
      id: 28, day: 14, type: "return",
      title: "كيف تبني شخصية قوية؟",
      category: "self-development",
      description: "صفات الشخصية المتزنة والقوية."
    },

    // اليوم الخامس عشر
    {
      id: 29, day: 15, type: "going",
      title: "الرحمة والتسامح في الإسلام",
      category: "religion",
      description: "أثر الرحمة والتسامح في العلاقات."
    },
    {
      id: 30, day: 15, type: "return",
      title: "فهم المشاعر والذكاء العاطفي",
      category: "psychology",
      description: "كيف تفهم مشاعرك وتتعامل معها؟"
    },

    // اليوم السادس عشر
    {
      id: 31, day: 16, type: "going",
      title: "فضل الصدقة والعمل الصالح",
      category: "religion",
      description: "أهمية العطاء وفعل الخير."
    },
    {
      id: 32, day: 16, type: "return",
      title: "أساسيات التغذية الصحية",
      category: "health",
      description: "مبادئ اختيار الطعام الصحي والمتوازن."
    },

    // اليوم السابع عشر
    {
      id: 33, day: 17, type: "going",
      title: "الخشوع في الصلاة",
      category: "religion",
      description: "وسائل تساعدك على حضور القلب في الصلاة."
    },
    {
      id: 34, day: 17, type: "return",
      title: "أهمية شرب الماء للجسم",
      category: "health",
      description: "التعرف على دور الماء في صحة الجسم."
    },

    // اليوم الثامن عشر
    {
      id: 35, day: 18, type: "going",
      title: "الصحبة الصالحة وأثرها",
      category: "religion",
      description: "كيف تختار الصحبة التي تعينك على الخير؟"
    },
    {
      id: 36, day: 18, type: "return",
      title: "تمارين بسيطة لتنشيط الجسم",
      category: "health",
      description: "أهمية الحركة اليومية والنشاط البدني."
    },

    // اليوم التاسع عشر
    {
      id: 37, day: 19, type: "going",
      title: "الشكر والامتنان لنعم الله",
      category: "religion",
      description: "كيف تتذكر النعم وتحافظ على شكرها؟"
    },
    {
      id: 38, day: 19, type: "return",
      title: "تعلم مهارة إدارة المال",
      category: "skills",
      description: "مبادئ تنظيم المصروفات والادخار."
    },

    // اليوم العشرون
    {
      id: 39, day: 20, type: "going",
      title: "الأمانة والصدق في التعامل",
      category: "religion",
      description: "أهمية الصدق والأمانة في الحياة."
    },
    {
      id: 40, day: 20, type: "return",
      title: "مهارات التواصل الفعال",
      category: "skills",
      description: "كيف تستمع وتتحدث وتتواصل بوضوح؟"
    },

    // اليوم الحادي والعشرون
    {
      id: 41, day: 21, type: "going",
      title: "التفكر في خلق الله",
      category: "religion",
      description: "التأمل في نعم الله وعظمة خلقه."
    },
    {
      id: 42, day: 21, type: "return",
      title: "كيف تتخذ قرارات أفضل؟",
      category: "psychology",
      description: "خطوات التفكير قبل اتخاذ القرار."
    },

    // اليوم الثاني والعشرون
    {
      id: 43, day: 22, type: "going",
      title: "أهمية قيام الليل",
      category: "religion",
      description: "فضل قيام الليل وكيف تبدأ بالتدرج."
    },
    {
      id: 44, day: 22, type: "return",
      title: "أساسيات استخدام الحاسوب",
      category: "skills",
      description: "مهارات رقمية مفيدة للدراسة والعمل."
    },

    // اليوم الثالث والعشرون
    {
      id: 45, day: 23, type: "going",
      title: "الاستقامة والثبات على الخير",
      category: "religion",
      description: "كيف تستمر على الطاعات؟"
    },
    {
      id: 46, day: 23, type: "return",
      title: "كيف تتعلم اللغة الإنجليزية؟",
      category: "skills",
      description: "خطوات يومية لتطوير اللغة الإنجليزية."
    },

    // اليوم الرابع والعشرون
    {
      id: 47, day: 24, type: "going",
      title: "حسن الظن بالله",
      category: "religion",
      description: "معنى حسن الظن بالله وأثره في النفس."
    },
    {
      id: 48, day: 24, type: "return",
      title: "كيف تراجع أهدافك وتطور نفسك؟",
      category: "self-development",
      description: "طريقة تقييم التقدم ووضع أهداف جديدة."
    },

    // اليوم الخامس والعشرون
    {
      id: 49, day: 25, type: "going",
      title: "الاستمرار على العمل الصالح",
      category: "religion",
      description: "أهمية المداومة على الأعمال الصالحة."
    },
    {
      id: 50, day: 25, type: "return",
      title: "رحلة التغيير: كيف تستمر بعد التحدي؟",
      category: "self-development",
      description: "كيف تحول التغيير إلى أسلوب حياة؟"
    }
  ]
};

// إضافة رابط البحث وصورة الغلاف لكل فيديو
window.APP_DATA.videos = window.APP_DATA.videos.map(video => ({
  ...video,
  timeLabel: video.type === "going" ? "فيديو الذهاب" : "فيديو العودة",
  url: "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(video.title + " شرح عربي"),
  thumbnail: window.APP_DATA.videoCovers[video.category]
}));
