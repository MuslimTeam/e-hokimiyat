"use client"

import { Card, CardContent } from "@/components/ui/card"
import React from "react"
import { ClipboardList, CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import { getTasks } from "@/lib/api"

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
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Бажарилган",
      value: completedTasks.toString(),
      change: `${totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%`,
      changeLabel: "ижро даражаси",
      icon: CheckCircle2,
      iconColor: "text-accent",
      iconBg: "bg-accent/10",
    },
    {
      label: "Муддати ўтган",
      value: overdueTasks.toString(),
      change: overdueTasks > 0 ? `-${overdueTasks}` : "0",
      changeLabel: "кечиккан",
      icon: AlertTriangle,
      iconColor: "text-destructive",
      iconBg: "bg-destructive/10",
    },
    {
      label: "Ижрода",
      value: inProgressTasks.toString(),
      change: inProgressTasks.toString(),
      changeLabel: "фаол",
      icon: Clock,
      iconColor: "text-warning",
      iconBg: "bg-warning/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span
                    className={
                      stat.change.startsWith("+") || stat.change.startsWith("-")
                        ? stat.change.startsWith("+")
                          ? "text-accent"
                          : "text-destructive"
                        : "text-primary"
                    }
                  >
                    {stat.change}
                  </span>{" "}
                  {stat.changeLabel}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
