"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  return (
    <main className="relative min-h-dvh flex items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--color-accent)_0%,transparent_60%),linear-gradient(var(--color-background),var(--color-background))] p-4">
      {/* Decorative sustainability illustration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={
            "/placeholder.svg?height=800&width=1200&query=minimal%20sustainability%20illustration%20leaves%20and%20recycling%20icons" ||
            "/placeholder.svg"
          }
          alt=""
          className="absolute -right-10 -top-10 opacity-15 max-w-none w-[900px] rotate-6"
        />
      </div>
      <div className="relative max-w-md w-full">
        <Card className="glass elevated shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-balance">Trash2Cash</CardTitle>
            <CardDescription className="text-pretty">
              Convert verified waste into digital credits. Sign in to access your unified dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate auth
    await new Promise((r) => setTimeout(r, 900))
    router.push("/dashboard")
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email or Username</Label>
        <Input
          id="email"
          type="text"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email or Username"
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            onClick={() => alert("Password reset is coming soon.")}
          >
            Forgot password?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />
      </div>
      <Button
        type="submit"
        className={cn(
          "h-12 text-base font-medium rounded-xl btn-ripple",
          "transition-all duration-300",
          loading ? "animate-pulse" : "hover:scale-[1.02] hover:shadow-md",
        )}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        By continuing, you agree to the Terms and Privacy Policy.
      </p>
    </form>
  )
}
