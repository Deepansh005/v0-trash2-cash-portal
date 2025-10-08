"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts"

export default function TokenMarket({ onBuy }: { onBuy: (amount: number, pricePerToken: number) => void }) {
  const [amount, setAmount] = useState(25)
  const pricePerToken = 0.2 // fiat placeholder

  // mock price & volume series
  const priceData = [
    { t: "Mon", price: 0.19 },
    { t: "Tue", price: 0.2 },
    { t: "Wed", price: 0.21 },
    { t: "Thu", price: 0.2 },
    { t: "Fri", price: 0.22 },
    { t: "Sat", price: 0.21 },
    { t: "Sun", price: 0.23 },
  ]
  const volumeData = [
    { t: "Mon", vol: 120 },
    { t: "Tue", vol: 200 },
    { t: "Wed", vol: 160 },
    { t: "Thu", vol: 240 },
    { t: "Fri", vol: 280 },
    { t: "Sat", vol: 190 },
    { t: "Sun", vol: 260 },
  ]

  const total = amount * pricePerToken
  const animatedTotal = useCounter(total, 350)

  return (
    <div className="grid gap-4">
      {/* Purchase controls */}
      <div className="grid gap-3">
        <div className="grid gap-1">
          <Label htmlFor="amount">Buy Tokens</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              id="amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value || 0))}
            />
            <div className="col-span-2 grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" onClick={() => setAmount(25)}>
                +25
              </Button>
              <Button type="button" variant="secondary" onClick={() => setAmount(100)}>
                +100
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Price:</span>{" "}
            <span className="font-medium">${pricePerToken.toFixed(2)}/token</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total:</span>{" "}
            <span className="font-medium">${animatedTotal.toFixed(2)}</span>
          </div>
        </div>
        <Button
          onClick={() => onBuy(amount, pricePerToken)}
          className="rounded-lg btn-neon btn-ripple transition-transform hover:scale-[1.01]"
        >
          Purchase
        </Button>
      </div>

      {/* Charts */}
      <div className="grid gap-3">
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium mb-2">Price Trend</div>
          <ChartContainer
            config={{
              price: { label: "Price", color: "hsl(var(--color-primary))" },
            }}
            className="h-48"
          >
            <ResponsiveContainer>
              <LineChart data={priceData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid stroke="hsl(var(--color-border))" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="t" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={40} />
                <Tooltip content={<ChartTooltipContent indicator="line" />} />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--color-primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium mb-2">Daily Volume</div>
          <ChartContainer
            config={{
              vol: { label: "Volume", color: "hsl(var(--color-accent))" },
            }}
            className="h-40"
          >
            <ResponsiveContainer>
              <BarChart data={volumeData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid stroke="hsl(var(--color-border))" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="t" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="vol" fill="hsl(var(--color-primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Promos */}
      <div className="grid gap-2 pt-1">
        <PromoCard title="Starter Pack" description="Buy 100, get 10 free" />
        <PromoCard title="Eco Partner" description="5% bonus on 500+ tokens" />
      </div>
    </div>
  )
}

function PromoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border p-3 bg-card">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  )
}

function useCounter(value: number, duration = 300) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()
    let raf = 0
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration)
      setDisplay(from + (value - from) * t)
      if (t < 1) raf = requestAnimationFrame(tick)
      else fromRef.current = value
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return display
}
