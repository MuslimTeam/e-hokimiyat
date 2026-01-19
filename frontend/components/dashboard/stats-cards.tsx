"use client"

import { Card, CardContent } from "@/components/ui/card"
import React from "react"
import { ClipboardList, CheckCircle2, AlertTriangle, Clock, TrendingUp, ArrowUp } from "lucide-react"
import { getTasks } from "@/lib/api"
import { cn } from "@/lib/utils"

const computeStats = (tasks: any[]) => {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "BAJARILDI" || t.status === "NAZORATDAN_YECHILDI").length
  const overdueTasks = tasks.filter((t) => t.status === "MUDDATI_KECH").length
  const inProgressTasks = tasks.filter((t) => t.status === "IJRODA").length
  const sectors = Array.from(new Set(tasks.map((t) => t.sector)))
  const activeSectors = sectors.length
  return { totalTasks, completedTasks, overdueTasks, inProgressTasks, activeSectors }
}

export function StatsCards() {
  const [statsData, setStatsData] = React.useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    inProgressTasks: 0,
    activeSectors: 0,
  })

  React.useEffect(() => {
    let mounted = true
    getTasks()
      .then((tasks) => {
        if (!mounted) return
        setStatsData(computeStats(tasks))
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const { totalTasks, completedTasks, overdueTasks, inProgressTasks, activeSectors } = statsData

  const stats = [
    {
      label: "Жами топшириқлар",
      value: totalTasks.toString(),
      change: `${activeSectors}`,
      changeLabel: "та соҳада",
      icon: ClipboardList,
      gradient: {
        from: "#3b82f6",
        to: "#9333ea"
      },
      bgGradient: "from-blue-500/20 to-purple-600/20",
      trend: "up",
      trendValue: "+12%",
      description: "Барча топшириқлар",
    },
    {
      label: "Бажарилган",
      value: completedTasks.toString(),
      change: totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : "0%",
      changeLabel: "ўриндаги",
      icon: CheckCircle2,
      gradient: {
        from: "#10b981",
        to: "#059669"
      },
      bgGradient: "from-green-500/20 to-emerald-600/20",
      trend: "up",
      trendValue: "+8%",
      description: "Муваффақиятли бажарилган",
    },
    {
      label: "Муддат кечиккан",
      value: overdueTasks.toString(),
      change: "Ҳавфли",
      changeLabel: "ҳолат",
      icon: AlertTriangle,
      gradient: {
        from: "#ef4444",
        to: "#f97316"
      },
      bgGradient: "from-red-500/20 to-orange-600/20",
      trend: "down",
      trendValue: "-3%",
      description: "Эътибор берилган топшириқлар",
    },
    {
      label: "Ижрода",
      value: inProgressTasks.toString(),
      change: "фаол",
      changeLabel: "ҳолат",
      icon: Clock,
      gradient: {
        from: "#f59e0b",
        to: "#eab308"
      },
      bgGradient: "from-amber-500/20 to-yellow-600/20",
      trend: "up",
      trendValue: "+5%",
      description: "Ҳозирда ижро бўлган",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="card-modern group relative overflow-hidden animate-slide-up hover-lift"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Animated background gradient */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, ${stat.gradient.from}, ${stat.gradient.to})`
            }}
          />
          
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-2xl" 
               style={{ 
                 background: `linear-gradient(135deg, ${stat.gradient.from}, ${stat.gradient.to})`
               }} />
          
          <CardContent className="relative z-10 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl font-bold text-foreground animate-gradient-shift">{stat.value}</h3>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={cn(
                      "h-4 w-4 transition-all duration-300",
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    )} />
                    <span className={cn(
                      "text-sm font-bold transition-all duration-300",
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    )}>
                      {stat.trendValue}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{stat.change}</span>
                  <span className="text-xs text-muted-foreground/70">{stat.changeLabel}</span>
                </div>
              </div>
            </div>
            
            {/* Icon container with animation */}
            <div className="relative">
              <div className={cn(
                "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 animate-pulse-modern shadow-lg",
                stat.bgGradient
              )}>
                <stat.icon className="h-7 w-7 text-foreground transition-transform duration-300 group-hover:scale-110" />
                
                {/* Decorative ring */}
                <div className={cn(
                  "absolute -inset-2 rounded-2xl bg-gradient-to-br opacity-30 animate-pulse-modern",
                  stat.bgGradient
                )} />
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl animate-shine" />
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Тўлиқлик</span>
                <span>{stat.change}</span>
              </div>
              <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out animate-slide-up",
                    stat.gradient
                  )}
                  style={{ 
                    width: `${Math.min(100, (parseInt(stat.value) / Math.max(1, totalTasks)) * 100)}%`,
                    animationDelay: `${index * 200 + 500}ms`
                  }}
                />
                {/* Progress glow */}
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full" 
                     style={{ 
                           background: `linear-gradient(135deg, ${stat.gradient.from}, ${stat.gradient.to})`
                         }} />
              </div>
            </div>
            
            {/* Description */}
            <p className="text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: `${index * 300 + 500}ms` }}>
              {stat.description}
            </p>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-foreground rounded-full opacity-30 animate-pulse-modern" />
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-foreground rounded-full opacity-20 animate-bounce-subtle" />
            <div className="absolute top-8 left-8 w-3 h-3 bg-foreground rounded-full opacity-10 animate-float" />
            
            {/* Floating particles */}
            <div className="absolute top-2 right-8 w-1 h-1 bg-foreground rounded-full animate-float" style={{ animationDelay: `${index * 100}ms` }} />
            <div className="absolute bottom-6 left-6 w-1 h-1 bg-foreground rounded-full animate-float" style={{ animationDelay: `${index * 200}ms` }} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
