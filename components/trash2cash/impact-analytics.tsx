"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { WasteItem, Transaction } from "@/lib/mock-data"

export default function ImpactAnalytics({ items, transactions }: { items: WasteItem[]; transactions: Transaction[] }) {
  // KPIs (simple mock calculations)
  const totalWaste = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalTokens = transactions.reduce((sum, t) => sum + Math.max(0, t.tokens), 0)
  const totalCO2SavedTons = Math.round((totalTokens * 0.2) / 100) // placeholder conversion

  // Top recyclers by positive tokens earned (approx)
  const recyclerMap = new Map<string, number>()
  for (const t of transactions) {
    if (t.action === "Waste Listed") {
      recyclerMap.set(t.counterparty, (recyclerMap.get(t.counterparty) || 0) + t.tokens)
    }
  }
  const topRecyclers = Array.from(recyclerMap.entries())
    .map(([name, tokens]) => ({ name, tokens }))
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, 5)

  // Most traded materials by quantity
  const materialMap = new Map<string, number>()
  for (const i of items) {
    materialMap.set(i.type, (materialMap.get(i.type) || 0) + i.quantity)
  }
  const materials = Array.from(materialMap.entries())
    .map(([type, qty]) => ({ type, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 6)

  const palette = ["hsl(var(--color-primary))", "hsl(var(--color-accent))", "hsl(var(--color-muted-foreground))"]

  return (
    <div className="grid gap-4">
      {/* KPIs */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="animate-in fade-in slide-in-from-bottom-2">
          <CardHeader>
            <CardTitle>Total Waste Diverted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalWaste.toLocaleString()} kg</div>
            <p className="text-sm text-muted-foreground">Estimated from active listings</p>
          </CardContent>
        </Card>
        <Card className="animate-in fade-in slide-in-from-bottom-2">
          <CardHeader>
            <CardTitle>Total Eco Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalTokens.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Circulating (earned + purchased)</p>
          </CardContent>
        </Card>
        <Card className="animate-in fade-in slide-in-from-bottom-2">
          <CardHeader>
            <CardTitle>CO₂ Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalCO2SavedTons} t</div>
            <p className="text-sm text-muted-foreground">Approximate conversion for demo</p>
          </CardContent>
        </Card>
      </section>

      {/* Charts */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="animate-in fade-in slide-in-from-bottom-2">
          <CardHeader>
            <CardTitle>Top Recyclers</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ tokens: { label: "Tokens", color: "hsl(var(--color-primary))" } }}
              className="h-64"
            >
              <ResponsiveContainer>
                <BarChart data={topRecyclers} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid stroke="hsl(var(--color-border))" strokeOpacity={0.4} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="tokens" fill="hsl(var(--color-primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="animate-in fade-in slide-in-from-bottom-2">
          <CardHeader>
            <CardTitle>Most Traded Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Pie data={materials} dataKey="qty" nameKey="type" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {materials.map((_, idx) => (
                      <Cell key={idx} fill={palette[idx % palette.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Badges */}
      <section className="grid gap-3">
        <div className="text-sm font-medium">Gamification</div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Top Recycler</Badge>
          <Badge>Green Champion</Badge>
          <Badge variant="secondary">Marketplace Pro</Badge>
        </div>
      </section>
    </div>
  )
}
