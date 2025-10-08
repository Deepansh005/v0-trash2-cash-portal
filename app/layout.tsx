import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Inter, Geist_Mono } from "next/font/google"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground relative overflow-x-hidden">
        <Suspense fallback={null}>
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(40%_30%_at_10%_10%,color-mix(in_oklab,var(--sage-600)_10%,transparent),transparent),radial-gradient(40%_30%_at_90%_20%,color-mix(in_oklab,var(--sage-500)_10%,transparent),transparent)]"
          />
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
