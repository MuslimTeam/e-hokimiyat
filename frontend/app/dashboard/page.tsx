import { Header } from "@/components/layout/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { OrganizationRatings } from "@/components/dashboard/organization-ratings"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { SectorOverview } from "@/components/dashboard/sector-overview"

export default function DashboardPage() {
  return (
    <>
      <Header title="Бош саҳифа" description="Туман ҳокимлиги топшириқлар бошқарув тизими" />
      <div className="min-h-screen bg-gray-50">
        
        <div className="relative z-10 p-6 space-y-8">
          {/* Stats Cards Section */}
          <section className="animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Статистика</h2>
                <p className="text-sm text-gray-500">Тизимнинг умумий кўрсаткичлари</p>
              </div>
            </div>
            <StatsCards />
          </section>

          {/* Charts and Ratings Section */}
          <section className="grid gap-8 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold">📈</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Фаоллик графиги</h3>
                  <p className="text-sm text-gray-500">Топшириқларнинг вақт бўйича тақсимланиши</p>
                </div>
              </div>
              <ActivityChart />
            </div>
            
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold">🏆</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Ташкилот рейтинги</h3>
                  <p className="text-sm text-gray-500">Энг фаол ташкилотлар</p>
                </div>
              </div>
              <OrganizationRatings />
            </div>
          </section>

          {/* Sector Overview Section */}
          <section className="animate-slide-up" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold">🏢</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Соҳалар бўйича кўрсаткичлар</h3>
                <p className="text-sm text-gray-500">Ҳар бир соҳанинг ижро кўрсаткичлари</p>
              </div>
            </div>
            <SectorOverview />
          </section>

          {/* Recent Tasks Section */}
          <section className="animate-slide-up" style={{ animationDelay: "600ms" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold">📋</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Муддати яқинлашаётган топшириқлар</h3>
                <p className="text-sm text-gray-500">Ижро муддати яқинлашиб бораётган фаол топшириқлар</p>
              </div>
            </div>
            <RecentTasks />
          </section>
        </div>
      </div>
    </>
  )
}
