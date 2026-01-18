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
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full animate-float" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-32 left-40 w-20 h-20 bg-pink-500/10 rounded-full animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-green-500/10 rounded-full animate-float" style={{ animationDelay: "3s" }} />
        </div>
        
        <div className="relative z-10 p-6 space-y-8">
          {/* Stats Cards Section */}
          <section className="animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-modern shadow-lg">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient-animated">Статистика</h2>
                <p className="text-sm text-muted-foreground">Тизимнинг умумий кўрсаткичлари</p>
              </div>
            </div>
            <StatsCards />
          </section>

          {/* Charts and Ratings Section */}
          <section className="grid gap-8 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center animate-pulse-modern">
                  <span className="text-white font-bold">📈</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Фаоллик графиги</h3>
                  <p className="text-sm text-muted-foreground">Топшириқларнинг вақт бўйича тақсимланиши</p>
                </div>
              </div>
              <ActivityChart />
            </div>
            
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center animate-pulse-modern">
                  <span className="text-white font-bold">🏆</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Ташкилот рейтинги</h3>
                  <p className="text-sm text-muted-foreground">Энг фаол ташкилотлар</p>
                </div>
              </div>
              <OrganizationRatings />
            </div>
          </section>

          {/* Sector Overview Section */}
          <section className="animate-slide-up" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center animate-pulse-modern">
                <span className="text-white font-bold">🏢</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Соҳалар бўйича кўрсаткичлар</h3>
                <p className="text-sm text-muted-foreground">Ҳар бир соҳанинг ижро кўрсаткичлари</p>
              </div>
            </div>
            <SectorOverview />
          </section>

          {/* Recent Tasks Section */}
          <section className="animate-slide-up" style={{ animationDelay: "600ms" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center animate-pulse-modern">
                <span className="text-white font-bold">📋</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Сўнгги топшириқлар</h3>
                <p className="text-sm text-muted-foreground">Янги қўшилган ва ўзгартирилган топшириқлар</p>
              </div>
            </div>
            <RecentTasks />
          </section>
        </div>
      </div>
    </>
  )
}
