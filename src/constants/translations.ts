
export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    auth: {
      welcomeBack: "مرحباً بعودتك",
      welcomeBackSub: "أكمل رحلتك الريادية مع نموذج بدرية",
      loginTitle: "تسجيل الدخول",
      loginBtn: "تسجيل الدخول",
      signupTitle: "حساب جديد",
      signupSub: "بياناتك ستحفظ سحابياً ويمكنك الوصول لها من أي جهاز",
      createAccount: "إنشاء حساب",
      name: "الاسم الكامل",
      namePlaceholder: "الاسم الثلاثي",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      show: "عرض",
      hide: "إخفاء",
      noAccount: "ليس لديك حساب؟",
      haveAccount: "لديك حساب بالفعل؟",
      backHome: "العودة للرئيسية",
      errors: {
        emailInvalid: "الرجاء إدخال بريد إلكتروني صحيح",
        passwordWeak: "كلمة المرور ضعيفة (6 خانات على الأقل)",
        nameShort: "الاسم قصير جداً",
        userNotFound: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        emailInUse: "البريد الإلكتروني مسجل مسبقاً",
        generic: "حدث خطأ غير متوقع"
      }
    },
    dashboard: {
      welcome: "مرحباً،",
      subtitle: "واصل رحلة التعلم الخاصة بك",
      logout: "تسجيل الخروج",
      progressTitle: "تقدم الدورة التدريبية",
      progressText: "لقد أكملت {completed} من أصل {total} وحدات تعليمية.",
      status: {
        completed: "مكتمل",
        locked: "مغلق",
        available: "متاح"
      },
      startLearning: "ابدأ التعلم",
      quizResult: "نتيجة الاختبار"
    },
    player: {
      contents: "فهرس المحتوى",
      quiz: "اختبار المعلومات",
      exit: "الخروج",
      exitToDash: "الخروج للوحة التحكم",
      next: "التالي",
      prev: "السابق",
      prevUnit: "الوحدة السابقة",
      startQuiz: "بدء الاختبار",
      readingMode: "وضع القراءة",
      fontSize: "حجم الخط",
      theme: "المظهر",
      language: "اللغة",
      page: "صفحة"
    },
    landing: {
      login: "تسجيل الدخول",
      signup: "حساب جديد"
    }
  },
  en: {
    auth: {
      welcomeBack: "Welcome Back",
      welcomeBackSub: "Continue your entrepreneurial journey with Badriyah's Model",
      loginTitle: "Login",
      loginBtn: "Sign In",
      signupTitle: "Create Account",
      signupSub: "Your data is saved in the cloud and accessible from any device",
      createAccount: "Sign Up",
      name: "Full Name",
      namePlaceholder: "Full Name",
      email: "Email Address",
      password: "Password",
      show: "Show",
      hide: "Hide",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      backHome: "Back to Home",
      errors: {
        emailInvalid: "Please enter a valid email address",
        passwordWeak: "Password is too weak (min 6 chars)",
        nameShort: "Name is too short",
        userNotFound: "Invalid email or password",
        emailInUse: "Email already in use",
        generic: "An unexpected error occurred"
      }
    },
    dashboard: {
      welcome: "Hello,",
      subtitle: "Continue your learning journey",
      logout: "Logout",
      progressTitle: "Course Progress",
      progressText: "You have completed {completed} out of {total} learning modules.",
      status: {
        completed: "Completed",
        locked: "Locked",
        available: "Available"
      },
      startLearning: "Start Learning",
      quizResult: "Quiz Score"
    },
    player: {
      contents: "Table of Contents",
      quiz: "Knowledge Quiz",
      exit: "Exit",
      exitToDash: "Exit to Dashboard",
      next: "Next",
      prev: "Previous",
      prevUnit: "Previous Unit",
      startQuiz: "Start Quiz",
      readingMode: "Reading Mode",
      fontSize: "Font Size",
      theme: "Appearance",
      language: "Language",
      page: "Page"
    },
    landing: {
      login: "Login",
      signup: "Sign Up"
    }
  }
};
