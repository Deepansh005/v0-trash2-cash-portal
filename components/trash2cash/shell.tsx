"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Home, Store, UploadCloud, Wallet, Coins, List, BarChart3 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ShellProps = { title: string; breadcrumb?: string[]; children: React.ReactNode }

export function Shell({ title, breadcrumb = [], children }: ShellProps) {
  const pathname = usePathname()
  const [dark, setDark] = useState(false)

  return (
    <div className={cn("min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr]")}>
      <aside className="hidden lg:flex flex-col gap-4 p-4 glass elevated sticky top-0 h-screen">
        <div className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <span aria-hidden>♻</span> <span>Trash2Cash</span>
        </div>
        <nav className="flex-1 space-y-1">
          <NavItem href="/dashboard" icon={<Home size={18} />} active={pathname?.startsWith("/dashboard")}>
            Overview
          </NavItem>
          <NavItem href="/dashboard#marketplace" icon={<Store size={18} />}>
            Marketplace
          </NavItem>
          <NavItem href="/dashboard#upload" icon={<UploadCloud size={18} />}>
            Upload
          </NavItem>
          <NavItem href="/dashboard#wallet" icon={<Wallet size={18} />}>
            Wallet
          </NavItem>
          <NavItem href="/dashboard#tokens" icon={<Coins size={18} />}>
            Tokens
          </NavItem>
          <NavItem href="/dashboard#transactions" icon={<List size={18} />}>
            Transactions
          </NavItem>
          <NavItem href="/dashboard#impact" icon={<BarChart3 size={18} />}>
            Impact
          </NavItem>
        </nav>
        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              setDark((d) => !d)
              if (typeof document !== "undefined") document.documentElement.classList.toggle("dark")
            }}
            title="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />} <span className="ml-2">Theme</span>
          </Button>
        </div>
      </aside>

      <div className="relative">
        <header className="sticky top-0 z-40 glass elevated flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="lg:hidden font-medium">
              <span aria-hidden>♻</span> Trash2Cash
            </span>
            <Breadcrumbs trail={breadcrumb} />
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="btn-ripple">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Avatar className="border border-(--border)">
              <AvatarFallback>T2C</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h1 className="text-2xl md:text-3xl font-semibold text-pretty mb-4">{title}</h1>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function NavItem({
  href,
  icon,
  children,
  active,
}: { href: string; icon: React.ReactNode; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-(--muted) hover-glow",
        active ? "bg-(--muted) text-(--primary)" : "text-(--foreground)",
      )}
    >
      <span className="opacity-80">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  )
}

function Breadcrumbs({ trail }: { trail: string[] }) {
  if (!trail?.length) return null
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-(--muted-foreground)">
      <ol className="flex items-center gap-2">
        {trail.map((part, i) => (
          <li key={part} className="flex items-center gap-2">
            <span
              className={cn("px-2 py-1 rounded-md", i === trail.length - 1 ? "bg-(--muted) text-(--foreground)" : "")}
            >
              {part}
            </span>
            {i < trail.length - 1 ? <span className="opacity-50">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
