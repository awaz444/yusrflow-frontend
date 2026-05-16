"use client"
//new
import React, { useState, useEffect } from "react"
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
  Heart,
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

  // Redirect authenticated users away from the landing page
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      router.replace('/dashboard')
    }
  }, [router])

  // Dictionary for translations
  const t = {
    // Nav
    platform: isArabic ? "المنصة" : "Platform",
    compliance: isArabic ? "الامتثال" : "Compliance",
    trust: isArabic ? "الثقة" : "Trust",
    toggleLang: isArabic ? "English" : "عربي",
    signIn: isArabic ? "تسجيل الدخول" : "Sign In",

    // Hero strings
    hookLabel: isArabic ? "جديد" : "NEW",
    hookSub: isArabic
      ? "توجيه الشركات نحو الامتثال الكامل"
      : "Guiding Companies Toward Complete Compliance",
    heroTitle: isArabic
      ? "المنصة السعودية الأولى لتوفير تكاليف البرمجيات والامتثال لأنظمة (NDMO)."
      : "The First Saudi-Specific, AI Based Platform for SaaS Savings & NDMO Compliance.",
    heroSubtitle: isArabic
      ? "صفر هدر للبرمجيات. امتثال كامل للأنظمة السعودية. منصة واحدة."
      : "Zero SaaS Waste. Total Saudi Compliance. One Platform.",
    heroDesc: isArabic
      ? "المنصة الأولى ثنائية اللغة المصممة للشركات الصغيرة والمتوسطة السعودية لأتمتة الامتثال لأنظمة NDMO/PDPL وتحسين الرفاهية الرقمية."
      : "The first bilingual platform designed for KSA SMEs to automate NDMO/PDPL compliance and optimize digital well-being.",
    applyCTA: isArabic ? "قدم للحصول على وصول مبكر" : "Apply for Early Access",
    trialCTA: isArabic ? "ابدأ التجربة المجانية" : "Start Free Trial",
    spotsText1: isArabic ? "نقبل 50 شركة صغيرة ومتوسطة لبرنامج المتبنين الأوائل." : "Accepting 50 Saudi SMEs for our 2026 Early Adopter Program.",
    spotsText2: isArabic ? `المتبقي ${spotsLeft} مقاعد.` : `${spotsLeft} spots remaining.`,

    // Video 
    videoTitle: isArabic ? "الحل في 60 ثانية" : "The 60-Second Solution",
    videoSub: isArabic ? "اكتشف كيف نحول التحدي إلى فرصة." : "See how we turn challenges into opportunities.",

    // Value Prop
    valuePillarT1: isArabic ? "توفير التكاليف / المراجعة المالية للبرمجيات SaaS" : "SaaS Wastage / SaaS Financial Audit",
    valuePillarD1: isArabic ? "تحديد تراخيص البرمجيات غير المستخدمة والاشتراكات المكررة فورياً. أوقف النزيف 'الخفي' في ميزانية شركتك." : "Instantly identify unused software licenses and redundant subscriptions. Stop the 'hidden' drain on your company budget.",
    valuePillarT2: isArabic ? "أتمتة الامتثال / الدرع التنظيمي" : "Compliance Automation / The Regulatory Shield",
    valuePillarD2: isArabic ? "ابق في الصدارة مع أنظمة (NDMO) ونظام حماية البيانات الشخصية (PDPL). قلل من مخاطر الغرامات التي تصل إلى 5 ملايين ريال سعودي بسبب عدم الامتثال." : "Stay ahead of NDMO (Data Management) and PDPL (Personal Data Protection) mandates. Minimize the risk of the SAR 5M non-compliance fines.",
    valuePillarT3: isArabic ? "الرفاهية الرقمية (غير السريرية)" : "Digital Well-being (Non-Clinical)",
    valuePillarD3: isArabic ? "تحسين تركيز الفريق والاحتفاظ به من خلال أدوات الرفاهية الرقمية غير المتطفلة. تعزيز العادات التقنية الصحية دون المساس بالخصوصية." : "Improve team focus and retention through non-intrusive digital well-being tools. Promote healthy tech habits without invading privacy.",

    // How it works
    howTitle: isArabic ? "كيف يعمل YusrFlow" : "How YusrFlow Works",
    step1Title: isArabic ? "المسح والاتصال" : "Scan & Connect",
    step2Title: isArabic ? "التحليل والكشف" : "Analyze & Detect",
    step3Title: isArabic ? "التحكم والامتثال" : "Control & Comply",

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          employeeSize: ''
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToApply = () => {
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      className={`relative min-h-screen selection:bg-primary/30 scroll-smooth pb-20 md:pb-0`}
      style={{ fontFamily: isArabic ? "var(--font-tajawal), sans-serif" : "var(--font-inter), sans-serif" }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <AnimatedGridBackground />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Logo width={120} height={30} theme="dark" />
            </div>
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsArabic(!isArabic)}
              className="text-sm font-bold text-white hover:text-primary transition-colors flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {t.toggleLang}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/auth')}
              className="text-sm font-bold text-white border-white/20 hover:bg-white/10"
            >
              {t.signIn}
            </Button>
            <Button
              size="sm"
              onClick={scrollToApply}
              className="hidden md:inline-flex bg-white text-black hover:bg-white/90"
            >
              {t.applyCTA}
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* 1. Hero Section */}
        <section id="hero" className="relative px-6 pt-24 pb-20 md:pt-22 md:pb-32 text-center">
          <FadeIn>
            <div className="mx-auto max-w-4xl space-y-8">
              <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-6xl leading-tight">
                {t.heroTitle}
              </h1>

              <div className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xl md:text-2xl font-bold text-transparent">
                {t.heroSubtitle}
              </div>

              <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
                {t.heroDesc}
              </p>

              {/* Scarcity Counter */}
              <div className="mt-8 flex justify-center">
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  {t.spotsText1} <span className="text-white mx-1">{t.spotsText2}</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
                <Button
                  size="lg"
                  onClick={scrollToApply}
                  className="h-14 w-full bg-primary text-black hover:bg-primary/90 font-bold text-lg sm:w-auto shadow-[0_0_20px_rgba(21,128,61,0.3)]"
                >
                  {t.applyCTA}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToApply}
                  className="h-14 w-full border-white/20 bg-white/5 px-8 text-white hover:bg-white/10 font-semibold sm:w-auto"
                >
                  {t.trialCTA}
                </Button>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* 2. Video Section */}
        <section className="mx-auto max-w-5xl px-6 pb-24 md:pb-32">
          <FadeIn delay={0.2}>
            <div className="mb-10 text-center">
              <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/20">{t.videoTitle}</Badge>
              <h2 className="text-2xl font-bold text-white md:text-4xl">{t.videoSub}</h2>
            </div>
            <div className="relative aspect-video w-full rounded-2xl border border-white/10 bg-black overflow-hidden shadow-2xl">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/51c-VXN3gu4"
                title="Yusrflow Intro Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </FadeIn>
        </section>

        {/* 3. Value Proposition */}
        <section id="platform" className="mx-auto max-w-7xl px-6 py-24 md:py-32 border-t border-white/5">
          <FadeIn>
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-white md:text-5xl">3 Pillars to Optimize Your Stack</h2>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
            <FadeIn delay={0.2} className="h-full">
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6 text-primary" />}
                title={t.valuePillarT1}
                description={t.valuePillarD1}
                badge="Savings"
              />
            </FadeIn>
            <FadeIn delay={0.4} className="h-full">
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                title={t.valuePillarT2}
                description={t.valuePillarD2}
                badge="Compliance"
              />
            </FadeIn>
            <FadeIn delay={0.6} className="h-full">
              <FeatureCard
                icon={<Heart className="h-6 w-6 text-primary" />}
                title={t.valuePillarT3}
                description={t.valuePillarD3}
                badge="Culture"
              />
            </FadeIn>
          </div>
        </section>

        {/* 4. Dashboard Preview */}
        <section className="px-6 py-24 md:py-32 overflow-hidden bg-white/[0.02]">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <FadeIn direction={isArabic ? "right" : "left"}>
                <div className="space-y-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    {isArabic ? "تحكم كامل في بيئة البرمجيات الخاصة بك" : "Complete Visibility into your SaaS Stack"}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {isArabic 
                      ? "احصل على لوحة تحكم واحدة تجمع كل اشتراكاتك، وتكشف الهدر، وتضمن بقاء بياناتك داخل المملكة."
                      : "Get a unified dashboard that tracks every subscription, detects wastage, and ensures your data stays within the Kingdom."
                    }
                  </p>
                  <div className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <LayoutDashboard className="w-8 h-8 text-primary" />
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <Workflow className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction={isArabic ? "left" : "right"}>
                <div className="relative group">
                  <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 rounded-full" />
                  <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-4 shadow-2xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 rounded-xl bg-white/5 border border-white/10 animate-pulse" style={{ animationDelay: '0s' }} />
                      <div className="h-32 rounded-xl bg-white/5 border border-white/10 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="h-32 rounded-xl bg-white/5 border border-white/10 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      <div className="h-32 rounded-xl bg-white/5 border border-white/10 animate-pulse" style={{ animationDelay: '0.6s' }} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-primary/20 backdrop-blur-2xl border border-primary/30 flex items-center justify-center animate-bounce">
                        <Zap className="w-16 h-16 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 5. How YusrFlow Works */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 border-t border-white/5">
          <FadeIn>
            <div className="mb-20 text-center">
              <h2 className="text-3xl font-bold text-white md:text-5xl mb-6">{t.howTitle}</h2>
            </div>
          </FadeIn>

          <div className="relative grid gap-12 md:grid-cols-3">
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

        {/* 6. Trust Section */}
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

        {/* 7. Early Pilot Section (Form) */}
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
                      <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6 ring-1 ring-primary/30 animate-bounce">
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
