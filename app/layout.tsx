import { Sidebar } from "@/components/ui/sidebar"
import React from "react"
import type { Metadata } from 'next'
import { Inter, Almarai } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { LanguageProvider } from '@/lib/i18n/language-context'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const almarai = Almarai({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: 'Yusrflow - Compliance Dashboard',
  description: 'AI-driven compliance and SaaS management platform for GCC enterprises',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#2563eb',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${almarai.variable}`}>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <LanguageProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
