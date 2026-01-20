// @ts-nocheck
import { Header } from "@/components/layout/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { OrganizationRatings } from "@/components/dashboard/organization-ratings"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { SectorOverview } from "@/components/dashboard/sector-overview"
import { OptimizedSection } from "@/components/ui/performance-optimizations"

export default function DashboardPage() {
  return (
    <>
      <Header title="Бош саҳифа" description="Туман ҳокимлиги топшириқлар бошқарув тизими" />
      <div className="min-h-screen bg-background pt-16 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="space-y-6 sm:space-y-8 py-6 sm:py-8">

            {/* Welcome Section */}
            <section className="animate-slide-up">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8 border border-emerald-100/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">🏛️</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-900 to-blue-900 bg-clip-text text-transparent">
                      Хуш келибсиз!
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-emerald-700 font-medium">Тизим статистикаси ва кўрсаткичлари</p>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-emerald-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span>Барча маълумотлар жонли янгиланиб турилади</span>
                </div>
              </div>
            </section>

            {/* Stats Cards Section */}
            <OptimizedSection delay={100}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-xs sm:text-sm lg:text-base">📈</span>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Асосий статистика</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Тизимнинг умумий кўрсаткичлари ва метрикалари</p>
                </div>
              </div>
              <StatsCards />
            </OptimizedSection>

            {/* Charts and Ratings Section */}
            <OptimizedSection delay={200}>
              <div className="grid gap-6 lg:gap-8 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold">📈</span>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground">Фаоллик динамикаси</h3>
                      <p className="text-sm text-muted-foreground">Топшириқларнинг вақт бўйича тақсимланиши</p>
                    </div>
                  </div>
                  <ActivityChart />
                </div>
                
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold">🏆</span>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground">Ташкилот рейтинги</h3>
                      <p className="text-sm text-muted-foreground">Энг фаол ва самарали ташкилотлар</p>
                    </div>
                  </div>
                  <OrganizationRatings />
                </div>
              </div>
            </OptimizedSection>

            {/* Sector Overview Section */}
            <OptimizedSection delay={400}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-xs sm:text-sm lg:text-base">🏢</span>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Соҳалар бўйича таҳлил</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Ҳар бир соҳанинг ижро кўрсаткичлари ва самарадорлиги</p>
                </div>
              </div>
              <SectorOverview />
            </OptimizedSection>

            {/* Recent Tasks Section */}
            <OptimizedSection delay={600}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-xs sm:text-sm lg:text-base">⏰</span>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Муддати яқин топшириқлар</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Ижро муддати яқинлашиб бораётган фаол топшириқлар рўйхати</p>
                </div>
              </div>
              <RecentTasks />
            </OptimizedSection>

          </div>
        </div>
      </div>
    </>
  )
}
