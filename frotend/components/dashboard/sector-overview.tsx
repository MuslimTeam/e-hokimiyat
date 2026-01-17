"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getTasks } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Layers } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SectorOverview() {
  const [sectorStats, setSectorStats] = React.useState<any[]>([])

  React.useEffect(() => {
    let mounted = true
    getTasks()
      .then((tasks) => {
        if (!mounted) return
        const sectors = Array.from(new Set(tasks.map((t: any) => t.sector)))
        const stats = sectors
          .map((sector) => {
            const sTasks = tasks.filter((t: any) => t.sector === sector)
            const completed = sTasks.filter((t: any) => t.status === "BAJARILDI" || t.status === "NAZORATDAN_YECHILDI").length
            const late = sTasks.filter((t: any) => t.status === "MUDDATI_KECH").length
            return {
              sector,
              label: sector,
              total: sTasks.length,
              completed,
              late,
              inProgress: sTasks.length - completed - late,
              completionRate: sTasks.length > 0 ? Math.round((completed / sTasks.length) * 100) : 0,
            }
          })
          .filter((s) => s.total > 0)
        setSectorStats(stats.slice(0, 6))
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Sohalar bo'yicha statistika
        </CardTitle>
        <Link href="/dashboard/analytics">
          <Button variant="ghost" size="sm">
            Barchasini ko'rish
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sectorStats.map((sector) => (
            <div key={sector.sector} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm truncate">{sector.label}</h4>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    sector.completionRate >= 80
                      ? "text-accent"
                      : sector.completionRate >= 50
                        ? "text-warning"
                        : "text-destructive",
                  )}
                >
                  {sector.completionRate}%
                </span>
              </div>
              <Progress value={sector.completionRate} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Жами: {sector.total}</span>
                <span>Бажарилди: {sector.completed}</span>
                {sector.late > 0 && <span className="text-destructive">Кечиккан: {sector.late}</span>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
