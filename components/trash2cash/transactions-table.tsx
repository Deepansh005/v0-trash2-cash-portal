"use client"

import type React from "react"

import { useMemo, useState } from "react"
import type { Transaction } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { exportToCSV } from "@/lib/csv"

export default function TransactionsTable({ rows }: { rows: Transaction[] }) {
  const [q, setQ] = useState("")
  const [type, setType] = useState("all")
  const [from, setFrom] = useState<string>("")
  const [to, setTo] = useState<string>("")

  const filtered = useMemo(() => {
    const start = from ? new Date(from).getTime() : Number.NEGATIVE_INFINITY
    const end = to ? new Date(to).getTime() : Number.POSITIVE_INFINITY
    return rows.filter((r) => {
      const time = new Date(r.date).getTime()
      const matchesQ =
        !q ||
        r.material.toLowerCase().includes(q.toLowerCase()) ||
        r.action.toLowerCase().includes(q.toLowerCase()) ||
        r.counterparty.toLowerCase().includes(q.toLowerCase())
      const matchesType = type === "all" || r.action.toLowerCase().includes(type.toLowerCase())
      const matchesDate = time >= start && time <= end
      return matchesQ && matchesType && matchesDate
    })
  }, [rows, q, type, from, to])

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-4 gap-2">
        <div className="grid gap-1">
          <Label htmlFor="q">Search</Label>
          <Input id="q" placeholder="Material, action, counterparty" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label>Type</Label>
          <select
            className="h-9 rounded-md border bg-background px-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="purchased">Purchased</option>
            <option value="sold">Sold</option>
            <option value="tokens">Tokens</option>
          </select>
        </div>
        <div className="grid gap-1">
          <Label>From</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label>To</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm striped-rows">
          <thead className="bg-muted/50">
            <tr>
              <Th>Date</Th>
              <Th>Material/Action</Th>
              <Th>Qty</Th>
              <Th>Tokens</Th>
              <Th>Counterparty</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t transition-colors hover:bg-muted/60">
                <Td>{new Date(r.date).toLocaleDateString()}</Td>
                <Td>
                  <div className="flex flex-col">
                    <span className="font-medium">{r.material}</span>
                    <span className="text-xs text-muted-foreground">{r.action}</span>
                  </div>
                </Td>
                <Td>{r.quantity}</Td>
                <Td className={r.tokens < 0 ? "text-destructive" : "text-primary"}>{r.tokens}</Td>
                <Td>{r.counterparty}</Td>
                <Td>
                  <span className={badgeClass(r.status)}>{r.status}</span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end">
        <Button variant="secondary" onClick={() => exportToCSV(filtered, "transactions.csv")}>
          Export CSV
        </Button>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left p-3 font-medium">{children}</th>
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="p-3 align-top">{children}</td>
}

function badgeClass(status: Transaction["status"]) {
  const base = "inline-flex items-center px-2 py-1 rounded-full text-xs"
  if (status === "Pending") return `${base} bg-muted text-foreground badge-pulse`
  if (status === "Verified") return `${base} bg-accent text-accent-foreground`
  return `${base} bg-primary text-primary-foreground`
}
