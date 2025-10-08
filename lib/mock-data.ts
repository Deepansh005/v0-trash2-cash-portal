export type WasteItem = {
  id: string
  type: string
  quantity: number
  owner: string
  location: "Local" | "Regional" | "International" | string
  credits: number
  description: string
  status: "Available" | "In-Process" | "Sold"
  images?: string[]
}

export type Transaction = {
  id: string
  date: string
  material: string
  action: "Waste Listed" | "Waste Purchased" | "Tokens Purchased" | string
  quantity: number
  tokens: number
  counterparty: string
  status: "Pending" | "Verified" | "Completed"
}

export type WalletState = {
  balance: number
  earned: number
  spent: number
  purchased: number
}

export const initialWasteItems: WasteItem[] = [
  {
    id: "w_1",
    type: "Plastic",
    quantity: 120,
    owner: "GreenWorks Co.",
    location: "Regional",
    credits: 90,
    description: "Sorted PET bottles, 90% clear, baled.",
    status: "Available",
  },
  {
    id: "w_2",
    type: "Metal",
    quantity: 60,
    owner: "Urban Scrap",
    location: "Local",
    credits: 150,
    description: "Aluminum cans, crushed, well sorted.",
    status: "In-Process",
  },
  {
    id: "w_3",
    type: "Glass",
    quantity: 200,
    owner: "City MRF",
    location: "Regional",
    credits: 60,
    description: "Mixed glass cullet, color separated.",
    status: "Available",
  },
  {
    id: "w_4",
    type: "Paper",
    quantity: 100,
    owner: "PaperLoop",
    location: "International",
    credits: 80,
    description: "Cardboard bales, minimal contamination.",
    status: "Sold",
  },
]

export const initialTransactions: Transaction[] = [
  {
    id: "t_1",
    date: new Date().toISOString(),
    material: "Plastic",
    action: "Waste Listed",
    quantity: 50,
    tokens: 40,
    counterparty: "Marketplace",
    status: "Verified",
  },
  {
    id: "t_2",
    date: new Date(Date.now() - 86_400_000).toISOString(),
    material: "T2C",
    action: "Tokens Purchased",
    quantity: 100,
    tokens: 100,
    counterparty: "Trash2Cash",
    status: "Completed",
  },
  {
    id: "t_3",
    date: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    material: "Metal",
    action: "Waste Purchased",
    quantity: 20,
    tokens: -60,
    counterparty: "Urban Scrap",
    status: "Completed",
  },
]

export const initialWallet: WalletState = {
  balance: 240,
  earned: 140,
  spent: 60,
  purchased: 160,
}
