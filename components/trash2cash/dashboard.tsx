"use client"

import { useState, useMemo } from "react"
import useSWR, { mutate } from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Marketplace from "./marketplace"
import ListingForm from "./listing-form"
import Wallet from "./wallet"
import TokenMarket from "./token-market"
import TransactionsTable from "./transactions-table"
import ImpactAnalytics from "./impact-analytics"
import {
  initialWasteItems,
  initialTransactions,
  initialWallet,
  type WasteItem,
  type Transaction,
  type WalletState,
} from "@/lib/mock-data"

const fetcher = (key: string) => {
  if (key === "waste-items") return initialWasteItems
  if (key === "transactions") return initialTransactions
  if (key === "wallet") return initialWallet
  return null
}

export default function Dashboard() {
  const { toast } = useToast()
  const { data: wasteItems = [] } = useSWR<WasteItem[]>("waste-items", fetcher, { fallbackData: initialWasteItems })
  const { data: transactions = [] } = useSWR<Transaction[]>("transactions", fetcher, {
    fallbackData: initialTransactions,
  })
  const { data: wallet = initialWallet } = useSWR<WalletState>("wallet", fetcher, { fallbackData: initialWallet })

  // Marketplace filters
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [minCredits, setMinCredits] = useState<number>(0)
  const [minQty, setMinQty] = useState<number>(0)

  const filteredItems = useMemo(() => {
    return wasteItems.filter((item) => {
      const matchesSearch =
        search.length === 0 ||
        item.type.toLowerCase().includes(search.toLowerCase()) ||
        item.owner.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === "all" || item.type === typeFilter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesLocation = locationFilter === "all" || item.location === locationFilter
      const matchesCredits = item.credits >= minCredits
      const matchesQty = item.quantity >= minQty
      return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesCredits && matchesQty
    })
  }, [wasteItems, search, typeFilter, statusFilter, locationFilter, minCredits, minQty])

  function buyItem(item: WasteItem) {
    if (wallet.balance < item.credits) {
      toast({ title: "Insufficient tokens", description: "Top up your wallet to complete this purchase." })
      return
    }
    const newWallet = { ...wallet, balance: wallet.balance - item.credits, spent: wallet.spent + item.credits }
    const newTransactions: Transaction[] = [
      {
        id: `txn_${Date.now()}`,
        date: new Date().toISOString(),
        action: "Waste Purchased",
        material: item.type,
        quantity: item.quantity,
        tokens: -item.credits,
        counterparty: item.owner,
        status: "Completed",
      },
      ...transactions,
    ]
    const newWaste = wasteItems.map((w) => (w.id === item.id ? { ...w, status: "Sold" as const } : w))

    mutate("wallet", newWallet, false)
    mutate("transactions", newTransactions, false)
    mutate("waste-items", newWaste, false)

    toast({ title: "Purchase completed", description: `${item.type} purchased for ${item.credits} tokens` })
  }

  function addListing(newItem: WasteItem, earnedCredits: number) {
    const withId = { ...newItem, id: `w_${Date.now()}` }
    const newWaste = [withId, ...wasteItems]
    const newWallet = { ...wallet, balance: wallet.balance + earnedCredits, earned: wallet.earned + earnedCredits }
    const newTransactions: Transaction[] = [
      {
        id: `txn_${Date.now()}`,
        date: new Date().toISOString(),
        action: "Waste Listed",
        material: withId.type,
        quantity: withId.quantity,
        tokens: +earnedCredits,
        counterparty: "Marketplace",
        status: "Verified",
      },
      ...transactions,
    ]
    mutate("waste-items", newWaste, false)
    mutate("wallet", newWallet, false)
    mutate("transactions", newTransactions, false)
    toast({ title: "Listing created", description: "Your waste is now visible in the marketplace." })
  }

  function buyTokens(amount: number, pricePerToken: number) {
    const newWallet = { ...wallet, balance: wallet.balance + amount, purchased: wallet.purchased + amount }
    const newTransactions: Transaction[] = [
      {
        id: `txn_${Date.now()}`,
        date: new Date().toISOString(),
        action: "Tokens Purchased",
        material: "T2C",
        quantity: amount,
        tokens: +amount,
        counterparty: "Trash2Cash",
        status: "Completed",
      },
      ...transactions,
    ]
    mutate("wallet", newWallet, false)
    mutate("transactions", newTransactions, false)
    toast({ title: "Tokens added", description: `${amount} tokens purchased` })
  }

  const uniqueTypes = useMemo(() => ["all", ...Array.from(new Set(wasteItems.map((w) => w.type)))], [wasteItems])
  const uniqueStatuses = useMemo(() => ["all", ...Array.from(new Set(wasteItems.map((w) => w.status)))], [wasteItems])
  const uniqueLocations = useMemo(
    () => ["all", ...Array.from(new Set(wasteItems.map((w) => w.location)))],
    [wasteItems],
  )

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8 space-y-6">
      <Tabs defaultValue="market" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="market">Marketplace</TabsTrigger>
          <TabsTrigger value="list">List Waste</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="tokens">Token Market</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="impact">Impact Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-4" id="marketplace">
          <section className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <Marketplace items={filteredItems} onBuy={buyItem} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search by type, owner..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-1">
                    <Label>Type</Label>
                    <select
                      className="h-9 rounded-md border bg-background px-2"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      {uniqueTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-1">
                    <Label>Status</Label>
                    <select
                      className="h-9 rounded-md border bg-background px-2"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      {uniqueStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-1">
                    <Label>Location</Label>
                    <select
                      className="h-9 rounded-md border bg-background px-2"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    >
                      {uniqueLocations.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="min-credits">Min Credits</Label>
                  <Input
                    id="min-credits"
                    type="number"
                    min={0}
                    value={minCredits}
                    onChange={(e) => setMinCredits(Number(e.target.value || 0))}
                  />
                </div>

                <div className="grid gap-1">
                  <Label>Min Quantity: {minQty}</Label>
                  <Slider min={0} max={300} step={10} value={[minQty]} onValueChange={([v]) => setMinQty(v)} />
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="list" id="upload">
          <Card>
            <CardHeader>
              <CardTitle>List New Waste</CardTitle>
            </CardHeader>
            <CardContent>
              <ListingForm onCreate={addListing} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" id="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Eco Token Wallet</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Wallet wallet={wallet} />
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Keep your tokens safe. Earn by listing quality waste, spend to acquire materials.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" id="tokens">
          <Card>
            <CardHeader>
              <CardTitle>Token Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <TokenMarket onBuy={buyTokens} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" id="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsTable rows={transactions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" id="impact">
          <ImpactAnalytics items={wasteItems} transactions={transactions} />
        </TabsContent>
      </Tabs>

      <footer className="text-center text-xs text-muted-foreground py-6">
        © {new Date().getFullYear()} Trash2Cash — Circular credit & barter network
      </footer>
    </div>
  )
}
