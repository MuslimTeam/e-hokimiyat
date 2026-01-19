import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n/context"

export const metadata: Metadata = {
  title: "Топшириқлар Бошқарув Тизими",
  description: "Туман ҳокимлиги топшириқлар бошқарув тизими - вазифалар, ижро назорати, аналитика",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" className="light" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-gray-50 text-gray-900`}>
        <I18nProvider>
          {children}
          <Analytics />
        </I18nProvider>
      </body>
    </html>
  )
}
