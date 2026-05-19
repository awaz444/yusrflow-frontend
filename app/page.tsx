"use client"
//new
import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ShieldCheck,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  Check,
  PlayCircle,
  Globe,
  Database,
  Lock,
  Languages,
  MapPin,
  Shield,
  Users,
  Zap,
  Eye,
  MousePointerClick,
  Workflow,
  Search,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background"
import { Logo } from "@/components/layout/logo"

export default function LandingPage() {
  const [isArabic, setIsArabic] = useState(false)
  const [spotsLeft, setSpotsLeft] = useState(12)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeSize: ''
  })
  const router = useRouter()

  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)

  // Scroll listener for sticky header — uses ref to avoid re-render on every scroll tick
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Force body to dark while landing page is mounted so the
  // AnimatedGridBackground (z-index: -50) shows through the transparent page div
  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#000'
    return () => { document.body.style.backgroundColor = prev }
  }, [])

  // Redirect authenticated users away from the landing page
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      // Decode token to check role, or just redirect to a safe auth-checked route
      // We redirect to /dashboard; the AuthGuard there will forward super admins to /admin/dashboard
      router.replace('/dashboard')
    }
  }, [])

  // Dictionary for translations
  const t = {
    // Nav
    platform: isArabic ? "المنصة" : "Platform",
    compliance: isArabic ? "الامتثال" : "Compliance",
    trust: isArabic ? "الثقة" : "Trust",
    toggleLang: isArabic ? "English" : "عربي",

    // Hero strings
    heroTitle: isArabic
      ? "منصة ذكاء اصطناعي سعودية لرؤية وحوكمة البرمجيات (SaaS)"
      : "Saudi-Built AI Platform for SaaS Visibility & Governance",
    heroSubtitle: isArabic
      ? "تساعد YusrFlow المؤسسات على كشف هدر البرمجيات، وتحديد التراخيص المكررة، وتعزيز رؤية الحوكمة من خلال منصة عربية-إنجليزية بالكامل مبنية للسوق السعودي."
      : "YusrFlow helps organizations uncover SaaS waste, identify redundant licenses, and strengthen governance visibility through a bilingual Arabic–English platform, built for the Saudi market.",
    loginCTA: isArabic ? "تسجيل الدخول" : "Login",
    applyCTA: isArabic ? "طلب وصول مبكر للبرنامج التجريبي" : "Request Early Pilot Access",
    demoCTA: isArabic ? "شاهد عرضاً لمدة دقيقتين" : "Watch 2-Minute Demo",

    // Built for Saudi Organizations
    saudiTitle: isArabic ? "بنيت للمنظمات السعودية" : "Built for Saudi Organizations",
    saudiBullet1: isArabic ? "منصة ثنائية اللغة (عربي – إنجليزي)" : "Arabic–English bilingual platform",
    saudiBullet2: isArabic ? "نهج نشر يركز على السوق السعودي" : "Saudi-focused deployment approach",
    saudiBullet3: isArabic ? "رؤية الحوكمة متوافقة مع PDPL / NDMO" : "Governance visibility aligned with PDPL / NDMO",
    saudiBullet4: isArabic ? "مصممة لفرق تقنية المعلومات والعمليات الحديثة" : "Designed for modern IT and operations teams",

    // Platform Capabilities
    capabilitiesTitle: isArabic ? "قدرات المنصة" : "Platform Capabilities",
    cap1Title: isArabic ? "رؤية البرمجيات والادخار" : "SaaS Visibility & Savings",
    cap1Desc: isArabic ? "تحديد التراخيص غير المستخدمة، والأدوات المكررة، والإنفاق غير المستغل على البرمجيات." : "Identify unused licenses, redundant tools, and underutilized SaaS spend.",
    cap2Title: isArabic ? "رؤية الحوكمة والامتثال" : "Governance & Compliance Visibility",
    cap2Desc: isArabic ? "تعزيز الرقابة على الوصول والسياسات وحوكمة العمليات." : "Strengthen oversight of access, policy, and operational governance.",
    cap3Title: isArabic ? "تجربة الموظف الرقمية (قريباً)" : "Digital Employee Experience (Coming Soon)",
    cap3Desc: isArabic ? "تسليط الضوء على نقاط الاحتكاك، والعبء الزائد، وفجوات الاعتماد عبر مكان العمل الرقمي." : "Highlight friction, overload, and adoption gaps across the digital workplace.",
    comingSoon: isArabic ? "قريباً" : "Coming Soon",

    // AI Section
    aiTitle: isArabic ? "رؤى مدعومة بالذكاء الاصطناعي" : "AI-Powered Insights",
    aiDesc: isArabic ? "تحلل YusrFlow نشاط البرمجيات والإشارات التشغيلية للكشف عن الهدر والتكرار ونقاط ضعف الحوكمة بشكل أسرع." : "YusrFlow analyzes SaaS activity and operational signals to reveal waste, redundancy, and governance blind spots faster.",
    aiBullet1: isArabic ? "كشف هدر وتكرار البرمجيات" : "Detect SaaS waste and redundancy",
    aiBullet2: isArabic ? "تسليط الضوء على فجوات الحوكمة مبكراً" : "Highlight governance gaps early",
    aiBullet3: isArabic ? "تحويل الإشارات إلى رؤى قابلة للتنفيذ" : "Turn signals into actionable insight",

    // Demo Section
    videoTitle: isArabic ? "شاهد YusrFlow أثناء العمل" : "See YusrFlow in Action",
    videoSub: isArabic ? "نظرة سريعة على كيفية كشف YusrFlow لهدر البرمجيات، والتراخيص المكررة، ونقاط ضعف الحوكمة." : "A quick look at how YusrFlow reveals SaaS waste, redundant licenses, and governance blind spots.",

    // How YusrFlow Works
    howTitle: isArabic ? "كيف يعمل YusrFlow" : "How YusrFlow Works",
    step1Title: isArabic ? "ربط بيئتك" : "Connect your environment",
    step2Title: isArabic ? "إنشاء لقطة للرؤية" : "Generate a visibility snapshot",
    step3Title: isArabic ? "مراجعة الرؤى واتخاذ الإجراءات" : "Review insights and take action",

    // Trust Section
    trustTitle: isArabic ? "بنيت من أجل الثقة" : "Built for Trust",
    trustBullet1: isArabic ? "تصميم منصة يركز على السوق السعودي" : "Saudi-focused platform design",
    trustBullet2: isArabic ? "جاهزية الانضمام للمؤسسات الكبرى" : "Enterprise-ready onboarding",
    trustBullet3: isArabic ? "تدفقات مصادقة آمنة" : "Secure authentication flows",
    trustBullet4: isArabic ? "رؤية واضحة دون تعطيل العمليات" : "Visibility without operational disruption",
    trustBullet5: isArabic ? "رؤى الحوكمة متوافقة مع PDPL / NDMO" : "Governance insights aligned with PDPL / NDMO",

    // Early Pilot Section
    pilotTitle: isArabic ? "البرنامج التجريبي المبكر" : "Early Pilot Program",
    pilotDesc: isArabic ? "نحن ندعو عدداً محدوداً من المنظمات للانضمام إلى برنامج YusrFlow التجريبي المبكر قبل الإطلاق الواسع. يحصل المشاركون على وصول مبكر ويساعدون في تشكيل المنصة من خلال التغذية الراجعة الواقعية." : "We are inviting a limited number of organizations to join YusrFlow’s early pilot program before wider rollout. Participants receive early access and help shape the platform through real-world feedback.",

    // Form
    fName: isArabic ? "اسم المنظمة" : "Organization Name",
    fEmail: isArabic ? "البريد الإلكتروني للعمل" : "Business Email",
    fPhone: isArabic ? "رقم التواصل" : "Contact Number",
    fEmployeeSize: isArabic ? "حجم المنظمة" : "Organization Size",
    fSubmit: isArabic ? "طلب الوصول للمشروع التجريبي" : "Request Early Pilot Access",

    footerDesc: isArabic ? "بني ليتوافق مع أهداف المملكة 2030." : "Built to align with Vision 2030.",

    successTitle: isArabic ? "تم استلام طلبك!" : "Request Received!",
    successDesc: isArabic ? "سوف يتواصل معك فريقنا لمناقشة انضمامك للبرنامج التجريبي." : "Our team will reach out to you shortly to discuss your participation in the pilot program."
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData({ name: '', email: '', phone: '', employeeSize: '' })
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to send. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={`dark relative min-h-screen selection:bg-primary/30 scroll-smooth overflow-x-hidden text-white bg-transparent`}
      style={{
        fontFamily: isArabic ? "var(--font-tajawal), sans-serif" : "var(--font-inter), sans-serif"
      }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <AnimatedGridBackground />

      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[oklch(0.05_0_0)]/80 backdrop-blur-md transition-transform duration-300 ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4 md:gap-8">
            <a href="#hero" className="flex items-center">
              <Logo width={120} height={30} priority theme="dark" className="md:w-[140px] md:h-[35px]" />
            </a>
            <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
              <a href="#platform" className="transition-colors hover:text-white">
                {t.platform}
              </a>
              <a href="#compliance" className="transition-colors hover:text-white">
                {t.compliance}
              </a>
              <a href="#trust" className="transition-colors hover:text-white">
                {t.trust}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsArabic(!isArabic)}
              aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
              className="text-sm font-bold text-white hover:text-primary transition-colors flex items-center gap-1 md:gap-2 px-2 md:px-3"
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t.toggleLang}</span>
            </Button>
            <Button
              size="sm"
              onClick={() => router.push('/auth/login')}
              className="inline-flex bg-white text-black hover:bg-white/90 px-3 md:px-4"
            >
              {t.loginCTA}
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* 1. Hero Section */}
        <section id="hero" className="relative px-6 pt-24 pb-20 md:pt-32 md:pb-40 text-center overflow-hidden">
          <FadeIn>
            <div className="mx-auto max-w-5xl space-y-10">
              <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-7xl leading-[1.1]">
                {t.heroTitle}
              </h1>

              <p className="mx-auto max-w-3xl text-balance text-lg text-muted-foreground md:text-2xl leading-relaxed">
                {t.heroSubtitle}
              </p>

              <div className="flex flex-col items-center justify-center gap-6 pt-8 sm:flex-row">
                <a href="#apply" className="w-full sm:w-auto">
                  <Button size="lg" className="h-auto min-h-[4rem] w-full py-3 px-4 sm:px-8 bg-primary text-black hover:bg-primary/90 font-bold text-base sm:text-lg md:text-xl shadow-[0_0_30px_rgba(21,128,61,0.4)] transition-all hover:scale-105 whitespace-normal text-center">
                    {t.applyCTA}
                  </Button>
                </a>
                <a href="#demo" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-auto min-h-[4rem] py-3 w-full border-white/20 bg-white/5 px-4 sm:px-10 text-white hover:bg-white/10 font-semibold text-base sm:text-lg shadow-xl backdrop-blur-sm whitespace-normal text-center"
                  >
                    <PlayCircle className="mr-2 h-6 w-6 text-primary" />
                    {t.demoCTA}
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* 2. Section: Built for Saudi Organizations */}
        <section className="relative py-24 md:py-32 border-y border-white/5 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white md:text-5xl tracking-tight">{t.saudiTitle}</h2>
              </div>
            </FadeIn>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FadeIn delay={0.1}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                    <Languages className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-white font-medium text-lg leading-tight">{t.saudiBullet1}</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-white font-medium text-lg leading-tight">{t.saudiBullet2}</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-white font-medium text-lg leading-tight">{t.saudiBullet3}</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-white font-medium text-lg leading-tight">{t.saudiBullet4}</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>


        {/* 3. Demo Section */}
        <section id="demo" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <FadeIn>
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-white md:text-5xl mb-6">{t.videoTitle}</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t.videoSub}</p>
            </div>
            <div className="relative aspect-video w-full rounded-2xl border border-white/10 bg-black overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/51c-VXN3gu4?rel=0"
                title="YusrFlow – 2-minute platform demo"
                frameBorder="0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </FadeIn>
        </section>

        {/* 4. Platform Capabilities */}
        <section id="platform" className="mx-auto max-w-7xl px-6 py-24 md:py-32 border-t border-white/5">
          <FadeIn>
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-white md:text-5xl">{t.capabilitiesTitle}</h2>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
            <FadeIn delay={0.1}>
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6 text-primary" />}
                title={t.cap1Title}
                description={t.cap1Desc}
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                title={t.cap2Title}
                description={t.cap2Desc}
              />
            </FadeIn>
            <FadeIn delay={0.3}>
              <FeatureCard
                icon={<MousePointerClick className="h-6 w-6 text-primary" />}
                title={t.cap3Title}
                description={t.cap3Desc}
                badge={t.comingSoon}
              />
            </FadeIn>
          </div>
        </section>

        {/* 5. AI Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -z-10" />
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-16 md:grid-cols-2">
              <FadeIn direction={isArabic ? "left" : "right"}>
                <div className="space-y-8">
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary px-4 py-1">
                    <Zap className="w-3 h-3 mr-2" />
                    {t.aiTitle}
                  </Badge>
                  <h2 className="text-3xl font-bold text-white md:text-5xl leading-tight">
                    {t.aiTitle}
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {t.aiDesc}
                  </p>
                  <ul className="space-y-4">
                    {[t.aiBullet1, t.aiBullet2, t.aiBullet3].map((bullet, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/90">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-lg font-medium">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
              <FadeIn direction={isArabic ? "right" : "left"} delay={0.2}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/10 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                  <div className="relative aspect-square rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-8 flex items-center justify-center overflow-hidden">
                    <div className="grid grid-cols-2 gap-4 w-full h-full opacity-40">
                      <div className="rounded-xl bg-white/5 border border-white/10 animate-pulse" style={{ animationDelay: '0s' }} />
                      <div className="rounded-xl bg-white/5 border border-white/10 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="rounded-xl bg-white/5 border border-white/10 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      <div className="rounded-xl bg-white/5 border border-white/10 animate-pulse" style={{ animationDelay: '0.6s' }} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-primary/20 backdrop-blur-2xl border border-primary/30 flex items-center justify-center" style={{ animation: 'bounce 1s infinite' }}>
                        <Zap className="w-16 h-16 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 6. How YusrFlow Works */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 border-t border-white/5">
          <FadeIn>
            <div className="mb-20 text-center">
              <h2 className="text-3xl font-bold text-white md:text-5xl mb-6">{t.howTitle}</h2>
            </div>
          </FadeIn>

          <div className="relative grid gap-12 md:grid-cols-3">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden md:block" />

            <FadeIn delay={0.1}>
              <div className="relative flex flex-col items-center text-center group">
                <div className="mb-8 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 z-10">
                  <Search className="w-10 h-10 text-primary" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-black font-bold flex items-center justify-center shadow-lg">1</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{t.step1Title}</h3>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="relative flex flex-col items-center text-center group">
                <div className="mb-8 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 z-10">
                  <Eye className="w-10 h-10 text-primary" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-black font-bold flex items-center justify-center shadow-lg">2</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{t.step2Title}</h3>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="relative flex flex-col items-center text-center group">
                <div className="mb-8 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 z-10">
                  <LayoutDashboard className="w-10 h-10 text-primary" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-black font-bold flex items-center justify-center shadow-lg">3</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{t.step3Title}</h3>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 7. Trust Section */}
        <section id="compliance" className="bg-white/5 py-24 md:py-32 backdrop-blur-sm border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-16 md:grid-cols-2">
              <FadeIn direction={isArabic ? "left" : "right"}>
                <div className="space-y-6">
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Operations First</Badge>
                  <h2 className="text-3xl font-bold text-white md:text-5xl">{t.trustTitle}</h2>
                  <div className="space-y-6 mt-8">
                    {[t.trustBullet1, t.trustBullet2, t.trustBullet3, t.trustBullet4, t.trustBullet5].map((bullet, i) => (
                      <div key={i} className="flex items-start gap-4 text-white">
                        <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-bold leading-relaxed">{bullet}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction={isArabic ? "right" : "left"}>
                <div className="relative">
                  <div className="absolute -inset-1 rounded-2xl bg-primary/20 blur-2xl opacity-50" />
                  <Card className="relative border-white/10 bg-black/80 p-10 shadow-2xl backdrop-blur-md text-center overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <div className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Enterprise Ready</div>
                    </div>
                    <div className="inline-flex h-20 w-20 mb-8 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/30">
                      <Lock className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-6">Built for Trust</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                      Our platform is designed with a deep understanding of Saudi corporate governance and operational requirements.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Governance Alignment</span>
                        <span className="text-primary font-bold">100%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-primary rounded-full"></div>
                      </div>
                    </div>
                  </Card>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 8. Early Pilot Section (Form) */}
        <section id="apply" className="px-4 md:px-6 py-24 md:py-40">
          <FadeIn>
            <div className="mx-auto max-w-4xl rounded-[40px] border border-white/10 bg-black shadow-[0_0_100px_rgba(0,0,0,1)] p-6 md:p-20 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full"></div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center w-full">
                <div className="space-y-8 relative w-full min-w-0">
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary px-4 py-1">Limited Availability</Badge>
                  <h2 className="text-4xl font-extrabold text-white leading-tight">{t.pilotTitle}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t.pilotDesc}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/80">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Priority Support</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Shape the Roadmap</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Exclusive Early Pricing</span>
                    </div>
                  </div>
                </div>

                <div className="relative w-full min-w-0">
                  {isSuccess ? (
                    <div className="text-center py-12 space-y-6">
                      <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6 ring-1 ring-primary/30 animate-pulse">
                        <Check className="w-10 h-10" />
                      </div>
                      <h3 className="text-3xl font-bold text-white">{t.successTitle}</h3>
                      <p className="text-muted-foreground text-lg">{t.successDesc}</p>
                      <Button
                        variant="ghost"
                        className="mt-6 text-primary hover:text-white"
                        onClick={() => setIsSuccess(false)}
                      >
                        {isArabic ? "ارسل رد آخر" : "Send another response"}
                      </Button>
                    </div>
                  ) : (
                    <form className="space-y-4 md:space-y-6 relative w-full" onSubmit={handleSubmit}>
                      <div className="space-y-2 w-full">
                        <label className="text-sm font-semibold text-white/80 mx-1">{t.fName}</label>
                        <Input
                          required
                          className="w-full h-14 bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white text-lg rounded-xl"
                          placeholder={t.fName}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <label className="text-sm font-semibold text-white/80 mx-1">{t.fEmail}</label>
                        <Input
                          required
                          type="email"
                          className="w-full h-14 bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white text-lg rounded-xl"
                          placeholder={t.fEmail}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <label className="text-sm font-semibold text-white/80 mx-1">{t.fPhone}</label>
                        <Input
                          required
                          type="tel"
                          className="w-full h-14 bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white text-lg rounded-xl"
                          placeholder="+966 5X XXX XXXX"
                          dir="ltr"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <label className="text-sm font-semibold text-white/80 mx-1">{t.fEmployeeSize}</label>
                        <Input
                          required
                          type="number"
                          className="w-full h-14 bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white text-lg rounded-xl"
                          placeholder="e.g. 100"
                          value={formData.employeeSize}
                          onChange={(e) => setFormData({ ...formData, employeeSize: e.target.value })}
                        />
                      </div>
                      <Button
                        disabled={isSubmitting}
                        className="w-full h-auto min-h-[4rem] py-3 px-4 bg-primary text-black font-bold text-base sm:text-lg md:text-xl hover:bg-primary/90 mt-6 transition-all rounded-xl shadow-2xl disabled:opacity-70 flex items-center justify-center gap-2 sm:gap-3 whitespace-normal text-center"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                            {isArabic ? "جاري الإرسال..." : "Sending..."}
                          </>
                        ) : (
                          <>
                            {t.fSubmit}
                            <ArrowRight className="w-6 h-6" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start w-full mb-6">
                <Logo width={120} height={30} theme="dark" />
              </div>
              <p className="text-xs text-muted-foreground max-w-xs">
                {t.footerDesc}
              </p>
            </div>
            <div className="text-xs text-muted-foreground text-center md:text-right">© 2026 Yusrflow. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, badge }: { icon: React.ReactNode; title: string; description: string; badge?: string }) {
  return (
    <Card className="group relative h-full overflow-hidden border-white/5 bg-white/5 p-8 transition-all hover:bg-white/10 hover:border-white/10">
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold px-2 py-0">
            {badge}
          </Badge>
        </div>
      )}
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20 ring-1 ring-primary/20">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100" />
    </Card>
  )
}
