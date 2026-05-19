import type { Metadata, Viewport } from 'next'
import { Inter, Tajawal } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppLayout } from '@/components/layout/app-layout'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { Providers } from '@/components/providers';
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter', display: 'swap' });
const tajawal = Tajawal({ weight: ['300', '400', '500', '700'], subsets: ["arabic"], variable: '--font-tajawal', display: 'swap' });

export const metadata: Metadata = {
  title: 'Yusrflow | The First Saudi-Specific SaaS Compliance Platform',
  description: 'Automate NDMO/PDPL compliance and optimize SaaS spend for Saudi SMEs.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6d5cff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning dir="ltr">
      <body suppressHydrationWarning className={`antialiased bg-background text-foreground font-sans ${inter.variable} ${tajawal.variable}`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
        <LanguageProvider>
          <Providers>
            <AppLayout>
              {children}
            </AppLayout>
          </Providers>
        </LanguageProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
