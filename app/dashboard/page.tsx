import Dashboard from "@/components/trash2cash/dashboard"
import { Shell } from "@/components/trash2cash/shell"

export default function DashboardPage() {
  return (
    <main className="min-h-dvh">
      <Shell title="Dashboard" breadcrumb={["Home", "Dashboard"]}>
        <Dashboard />
      </Shell>
    </main>
  )
}
