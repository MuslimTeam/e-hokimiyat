"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getTasks } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Layers, TrendingUp, BarChart3, PieChart } from "lucide-react"
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

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return "from-green-500 to-green-600"
    if (rate >= 50) return "from-yellow-500 to-yellow-600"
    return "from-red-500 to-red-600"
  }

  const getCompletionTextColor = (rate: number) => {
    if (rate >= 80) return "text-green-500"
    if (rate >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Card className="card-modern group relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 border-b border-border/50 bg-gradient-to-r from-purple-500/10 to-pink-600/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center animate-pulse-modern">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-semibold text-gradient-animated">Сохалар бўйича статистикаси</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/analytics">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 text-xs text-primary hover:text-primary/80 transition-all duration-200 hover:scale-105"
              >
                Барчасини кўриш
              </Button>
            </Link>
            <div className="w-2 h-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full animate-pulse-modern" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sectorStats.map((sector, index) => (
            <div
              key={sector.sector}
              className={cn(
                "group/sector relative rounded-xl border border-border/50 bg-gradient-to-r from-card to-card/50 p-4 transition-all duration-300 hover:scale-102 hover:shadow-lg hover:shadow-glow animate-slide-up",
                "hover:from-purple-500/5 hover:to-pink-600/5"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-600/5 opacity-0 group-hover/sector:opacity-100 transition-opacity duration-300 rounded-xl" />
              
              {/* Header */}
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-all duration-300 group-hover/sector:scale-110",
                    "bg-gradient-to-br " + getCompletionColor(sector.completionRate)
                  )}>
                    {sector.label.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-foreground group-hover/sector:text-primary transition-colors duration-200">
                    {sector.label}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200",
                    "bg-gradient-to-r " + getCompletionColor(sector.completionRate) + "/20"
                  )}>
                    <TrendingUp className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">{sector.completionRate}%</span>
                  </div>
                  <div className="w-2 h-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full animate-pulse-modern" />
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative z-10 mb-4">
                <Progress 
                  value={sector.completionRate} 
                  className={cn(
                    "h-3 transition-all duration-1000 ease-out",
                    "bg-gradient-to-r " + getCompletionColor(sector.completionRate)
                  )}
                />
                {/* Progress glow effect */}
                <div className={cn(
                  "absolute inset-0 rounded-full bg-gradient-to-r opacity-0 transition-opacity duration-300",
                  getCompletionColor(sector.completionRate) + "/20"
                )} />
              </div>
              
              {/* Stats */}
              <div className="relative z-10 space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 transition-all duration-200 hover:scale-105">
                    <BarChart3 className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-500">{sector.total}</div>
                    <div className="text-xs text-muted-foreground">Жами</div>
                  </div>
                  
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 transition-all duration-200 hover:scale-105">
                    <PieChart className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-500">{sector.completed}</div>
                    <div className="text-xs text-muted-foreground">Бажарилган</div>
                  </div>
                  
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 transition-all duration-200 hover:scale-105">
                    <TrendingUp className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-amber-500">{sector.inProgress}</div>
                    <div className="text-xs text-muted-foreground">Ижрода</div>
                  </div>
                </div>
                
                {sector.late > 0 && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20">
                    <span className="text-sm font-medium text-red-500">Кечиккан: {sector.late}</span>
                    <span className="text-xs text-muted-foreground">Топшириқ</span>
                  </div>
                )}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full opacity-30 animate-pulse-modern" />
              <div className="absolute bottom-2 left-2 w-2 h-1 bg-gradient-to-br from-pink-600 to-purple-500 rounded-full opacity-30 animate-pulse-modern" />
            </div>
          ))}
        </div>
        
        {sectorStats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mb-4 animate-float">
              <Layers className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Сохалар топилмади</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Ҳозирча ҳеч қандай сохалар мавжуд эмас. Топшириқлар яратиш учун сохаларни қўшиш керак.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
