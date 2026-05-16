"use client"

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
  Heart,
} from "lucide-react"
import { FadeIn } from "@/components/fade-in"
import { AnimatedGridBackground } from "@/components/animated-grid-background"

export default function LandingPage() {
  const [isArabic, setIsArabic] = useState(false)
  const [spotsLeft, setSpotsLeft] = useState(12)
  const router = useRouter()

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
    spotsText1: isArabic ? "نقبل 50 شركة صغيرة ومتوسطة لبرنامج המتبنين الأوائل." : "Accepting 50 Saudi SMEs for our 2026 Early Adopter Program.",
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

    // Trust
    trustTitle: isArabic ? "بناء الثقة مع الشركات السعودية" : "Building Trust with Saudi SMEs",
    trustDesc: isArabic ? "نحن مواءمون مع أهداف ورؤية المملكة لتوفير منصة آمنة." : "Aligned with the Kingdom's goals to provide a secure, compliant SaaS platform.",
    trustItem1T: isArabic ? "التوافق مع أنظمة الامتثال" : "Compliance Badges",
    trustItem1D: isArabic ? "NDMO و PDPL: الامتثال الكامل لقوانين إدارة البيانات وحمايتها." : "NDMO & PDPL: Full compliance with data management and privacy laws.",
    trustItem2T: isArabic ? "بياناتك لا تخرج من المملكة أبدًا" : "Your Data Never Leaves the Kingdom",
    trustItem2D: isArabic ? "استضافة محلية 100٪ تتوافق مع SDAIA و CITC." : "100% local hosting in compliance with SDAIA/CITC.",
    trustItem3T: isArabic ? "رؤية 2030" : "Vision 2030 Alignment",
    trustItem3D: isArabic ? "تمكين الشركات الصغيرة والمتوسطة من المساهمة في التحول الرقمي بفعالية." : "Empowering SMEs to effectively contribute to Digital Transformation.",
    trustItem4T: isArabic ? "لماذا 50 مقعداً؟" : "Why 50?",
    trustItem4D: isArabic ? "نحن نحصر إطلاقنا على 50 شركة صغيرة ومتوسطة لضمان حصول كل شريك على دعم مخصص في التوافق المستمر مع الأنظمة السعودية." : "We are limiting our launch to 50 SMEs to ensure every partner receives dedicated support in aligning their SaaS stack with Saudi law.",

    // Form
    formTitle: isArabic ? "احجز مقعدك الآن" : "Secure Your Spot Today",
    formSub: isArabic ? "البرنامج محدود لـ 50 شركة." : "Program strictly limited to 50 SMEs.",
    fName: isArabic ? "اسم الشركة" : "Company Name",
    fEmail: isArabic ? "البريد الإلكتروني للعمل" : "Business Email",
    fPhone: isArabic ? "رقم التواصل" : "Contact Number",
    fSubmit: isArabic ? "انضم لأول 50" : "Join the First 50",

    footerDesc: isArabic ? "مبني ليتوافق مع أهداف المملكة 2030." : "Built to align with Vision 2030."
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
            <a href="#hero" className="text-xl font-bold tracking-tighter text-white">
              Yusrflow
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
            <Button size="sm" className="hidden md:inline-flex bg-white text-black hover:bg-white/90">
              {t.applyCTA}
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* 1. The "First in KSA" Hero Section */}
        <section id="hero" className="relative px-6 pt-24 pb-20 md:pt-22 md:pb-32 text-center">
          <FadeIn>
            <div className="mx-auto max-w-4xl space-y-8">
              {/* <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary md:text-sm">
                <Badge variant="outline" className="h-5 border-primary/30 bg-primary/10 px-1 text-[10px] text-primary">
                  {t.hookLabel}
                </Badge>
                <span>{t.hookSub}</span>
                {isArabic ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </div> */}

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
                <Button size="lg" className="h-14 w-full bg-primary text-black hover:bg-primary/90 font-bold text-lg sm:w-auto shadow-[0_0_20px_rgba(21,128,61,0.3)]">
                  {t.applyCTA}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-full border-white/20 bg-white/5 px-8 text-white hover:bg-white/10 font-semibold sm:w-auto"
                >
                  {t.trialCTA}
                </Button>
              </div>
            </div>
          </FadeIn>
        </section>


        {/* 3. The "60-Second Solution" Animated Video */}
        <section className="mx-auto max-w-5xl px-6 pb-24 md:pb-32">
          <FadeIn delay={0.2}>
            <div className="mb-10 text-center">
              <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/20">{t.videoTitle}</Badge>
              <h2 className="text-2xl font-bold text-white md:text-4xl">{t.videoSub}</h2>
            </div>
            {/* Video Placeholder Box matching Storyboard */}
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

        {/* 2. The Three-Pillar Value Proposition */}
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
              />
            </FadeIn>
            <FadeIn delay={0.4} className="h-full">
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                title={t.valuePillarT2}
                description={t.valuePillarD2}
              />
            </FadeIn>
            <FadeIn delay={0.6} className="h-full">
              <FeatureCard
                icon={<Heart className="h-6 w-6 text-primary" />}
                title={t.valuePillarT3}
                description={t.valuePillarD3}
              />
            </FadeIn>
          </div>
        </section>

        {/* 4. Building Trust Without Client Testimonials */}
        <section id="trust" className="bg-white/5 py-24 md:py-32 backdrop-blur-sm border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-16 md:grid-cols-2">
              <FadeIn direction={isArabic ? "left" : "right"}>
                <div className="space-y-6">
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20">The Secure Choice</Badge>
                  <h2 className="text-3xl font-bold text-white md:text-5xl">{t.trustTitle}</h2>
                  <p className="text-lg text-muted-foreground">
                    {t.trustDesc}
                  </p>
                  <ul className="space-y-6 mt-8">
                    <li className="flex items-start gap-4 text-white">
                      <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{t.trustItem1T}</h4>
                        <p className="text-sm text-muted-foreground">{t.trustItem1D}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 text-white">
                      <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{t.trustItem2T}</h4>
                        <p className="text-sm text-muted-foreground">{t.trustItem2D}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 text-white">
                      <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{t.trustItem3T}</h4>
                        <p className="text-sm text-muted-foreground">{t.trustItem3D}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </FadeIn>
              <FadeIn direction={isArabic ? "right" : "left"}>
                <div className="relative">
                  <div className="absolute -inset-1 rounded-2xl bg-primary/20 blur-2xl opacity-50" />
                  <Card className="relative border-white/10 bg-black/80 p-10 shadow-2xl backdrop-blur-md text-center">
                    <div className="inline-flex h-16 w-16 mb-4 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
                      <span className="text-2xl font-bold text-primary">50</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{t.trustItem4T}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {t.trustItem4D}
                    </p>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-primary rounded-full"></div>
                    </div>
                    <div className="mt-2 text-xs text-white/50 text-right">38/50 spots booked</div>
                  </Card>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 5. The Form (Shadow Box Style) */}
        <section id="apply" className="px-6 py-24 md:py-32">
          <FadeIn>
            <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-black/60 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full"></div>

              <div className="relative text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-3">{t.formTitle}</h2>
                <p className="text-sm text-muted-foreground">
                  {t.formSub}
                </p>
              </div>

              <form className="relative space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 ml-1">{t.fName}</label>
                  <Input className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white placeholder:text-white/20" placeholder={t.fName} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 ml-1">{t.fEmail}</label>
                  <Input type="email" className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white placeholder:text-white/20" placeholder={t.fEmail} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 ml-1">{t.fPhone}</label>
                  <Input type="tel" className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white placeholder:text-white/20" placeholder="+966 5X XXX XXXX" dir="ltr" />
                </div>
                <Button className="w-full h-14 bg-primary text-black font-bold text-lg hover:bg-primary/90 mt-4 transition-all hover:scale-[1.02]">
                  {t.fSubmit}
                </Button>
              </form>
            </div>
          </FadeIn>
        </section>
      </main>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-lg border-t border-white/10 md:hidden z-50 flex flex-col gap-2">
        <div className="text-center text-xs text-red-400 font-bold animate-pulse">
          {t.spotsText1} {t.spotsText2}
        </div>
        <Button className="w-full h-12 bg-primary text-black font-bold text-base hover:bg-primary/90 shadow-[0_0_15px_rgba(21,128,61,0.2)]">
          {t.applyCTA}
        </Button>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mb-24 md:mb-0">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="space-y-4 text-center md:text-left">
              <span className="text-xl font-bold tracking-tighter text-white">Yusrflow</span>
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="group relative overflow-hidden border-white/5 bg-white/5 p-8 transition-all hover:bg-white/10 hover:border-white/10">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20 ring-1 ring-primary/20">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100" />
    </Card>
  )
}
