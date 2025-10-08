"use client"

import { useMemo } from "react"
import type { WalletState } from "@/lib/mock-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"

export default function Wallet({ wallet }: { wallet: WalletState }) {
  const pct = useMemo(() => {
    const cap = Math.max(1, wallet.balance + wallet.spent + 1) // avoid 0
    return Math.min(100, Math.round((wallet.balance / cap) * 100))
  }, [wallet])

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <CircularProgress size={120} value={pct} label={`${wallet.balance} T2C`} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[240px]">
                Eco Tokens reflect verified recycling value. The ring shows your current balance share.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="grid gap-1 text-sm">
          <div>
            <span className="text-muted-foreground">Balance: </span>
            <span className="font-medium">{wallet.balance} T2C</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="glass elevated hover-glow zoom-on-hover">
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground">Earned</div>
            <div className="text-lg font-semibold">{wallet.earned}</div>
          </CardContent>
        </Card>
        <Card className="glass elevated hover-glow zoom-on-hover">
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground">Spent</div>
            <div className="text-lg font-semibold">{wallet.spent}</div>
          </CardContent>
        </Card>
        <Card className="glass elevated hover-glow zoom-on-hover">
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground">Purchased</div>
            <div className="text-lg font-semibold">{wallet.purchased}</div>
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground">
        Tokens represent verified recycling value. Hover the ring to see your balance share.
      </p>
    </div>
  )
}

function CircularProgress({
  size = 120,
  value = 50,
  label,
}: {
  size?: number
  value?: number
  label?: string
}) {
  const stroke = 10
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (value / 100) * c

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--color-muted-foreground))"
          strokeOpacity="0.25"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--color-primary))"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  )
}
