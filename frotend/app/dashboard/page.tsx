import { Header } from "@/components/layout/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { OrganizationRatings } from "@/components/dashboard/organization-ratings"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { SectorOverview } from "@/components/dashboard/sector-overview"

export default function DashboardPage() {
  return (
    <>
      <Header title="Bosh sahifa" description="Tuman hokimligi topshiriqlar boshqaruv tizimi" />
      <div className="p-6 space-y-6">
        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityChart />
          </div>
          <OrganizationRatings />
        </div>

        <SectorOverview />

        <RecentTasks />
      </div>
    </>
  )
}
