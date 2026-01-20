import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Noto_Sans_JP } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SessionProvider } from "next-auth/react"
import { Header } from "@/components/header"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "農地マッチング | 日本の農地を、次世代へつなぐ",
  description:
    "新規就農者向けの全国農地マッチングプラットフォーム。あなたにぴったりの農地を見つけて、新しい農業ライフを始めましょう。",
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
    <html lang="ja">
      <body className="font-sans antialiased">
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
