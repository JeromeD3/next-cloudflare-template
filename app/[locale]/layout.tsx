import { Menu } from 'lucide-react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import NextTopLoader from 'nextjs-toploader'

import { Providers } from '@/app/[locale]/providers'
import { ChatSidebar } from '@/components/chat-sidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { StarsBackground } from '@/components/ui/stars-background'
import { locales, routing } from '@/i18n/routing'

import type { Metadata, Viewport } from 'next'

import '../globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('siteInfo')

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
    title: {
      default: t('meta.title'),
      template: `%s | ${t('brandName')}`
    },
    description: t('meta.description'),
    icons: {
      icon: '/logo.png'
    },
    authors: [{ name: 'Jerome', url: 'https://github.com/JeromeD3' }],
    creator: 'Jerome',
    openGraph: {
      images: ['/logo.png']
    },
    alternates: {
      languages: {
        'x-default': process.env.NEXT_PUBLIC_BASE_URL,
        ...Object.fromEntries(
          locales.map((locale) => [locale.code, `${process.env.NEXT_PUBLIC_BASE_URL}/${locale.code}`])
        )
      }
    }
  }
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  const currentLocale = locales.find((l) => l.code === locale)

  return (
    <html lang={currentLocale?.code ?? 'en'} dir={currentLocale?.dir || 'ltr'} suppressHydrationWarning>
      <body className="antialiased">
        <NextTopLoader color="#FF1F56" showSpinner={false} />
        <NextIntlClientProvider>
          <Providers>
            <StarsBackground className="-z-10" />
            <div className="flex h-dvh w-full">
              <ChatSidebar />
              <main className="relative flex flex-1 flex-col">
                <div className="absolute top-4 left-4 z-50">
                  <SidebarTrigger>
                    <button className="bg-muted hover:bg-accent flex h-8 w-8 items-center justify-center rounded-full transition-colors">
                      <Menu className="h-4 w-4" />
                    </button>
                  </SidebarTrigger>
                </div>
                <div className="flex flex-1 justify-center">{children}</div>
              </main>
            </div>
            {/* <div className="relative">
              <Header />
              <main className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-1 flex-col px-2.5 py-8 md:px-20">
                {children}
              </main>
            </div>

            <Container>
              <Footer />
            </Container> */}
          </Providers>
          <Toaster richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
