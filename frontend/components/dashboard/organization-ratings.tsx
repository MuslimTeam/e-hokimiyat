"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrganizations } from "@/lib/api"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, TrendingUp, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function OrganizationRatings() {
  const [orgs, setOrgs] = React.useState<any[]>([])

  React.useEffect(() => {
    let mounted = true
    getOrganizations()
      .then((list) => {
        if (!mounted) return
        setOrgs(list)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const sortedOrgs = [...orgs].filter((org) => org.isActive).sort((a, b) => b.rating - a.rating)

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return "from-emerald-400 to-emerald-600"
      case 1: return "from-gray-400 to-gray-600"
      case 2: return "from-amber-400 to-amber-600"
      default: return "from-gray-400 to-gray-600"
    }
  }

  const getRankBg = (index: number) => {
    switch (index) {
      case 0: return "from-emerald-400/20 to-emerald-600/20"
      case 1: return "from-gray-400/20 to-gray-600/20"
      case 2: return "from-amber-400/20 to-amber-600/20"
      default: return "from-gray-100/50 to-gray-600/50"
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "text-emerald-600"
    if (rating >= 70) return "text-amber-600"
    return "text-red-600"
  }

  const getRatingGradient = (rating: number) => {
    if (rating >= 90) return "from-emerald-500 to-emerald-600"
    if (rating >= 70) return "from-amber-500 to-amber-600"
    return "from-red-500 to-red-600"
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm group relative overflow-hidden hover:border-emerald-300 transition-all duration-250">
      
      <CardHeader className="relative z-10 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900">Ташкилотлар рейтиги</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs font-medium text-emerald-700">+8%</span>
            </div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4 p-6">
        {sortedOrgs.map((org, index) => (
          <div
            key={org.id}
            className={cn(
              "group/org relative space-y-3 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-250 hover:scale-105 hover:shadow-md hover:border-emerald-300 animate-slide-up",
              "hover:bg-emerald-50"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            
            {/* Rank and Name */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 group-hover/org:scale-110",
                  "bg-gradient-to-br " + getRankBg(index)
                )}>
                  <span className={cn(
                    "bg-gradient-to-br " + getRankColor(index),
                    "bg-clip-text text-transparent"
                  )}>
                    {index + 1}
                  </span>
                  {/* Decorative ring */}
                  <div className={cn(
                    "absolute -inset-1 rounded-full bg-gradient-to-br opacity-20 animate-pulse",
                    getRatingGradient(org.rating)
                  )} />
                </div>
                
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500 group-hover/org:text-emerald-600 transition-colors duration-250" />
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover/org:text-emerald-600 transition-colors duration-250">
                      {org.name}
                    </h3>
                    <p className="text-xs text-gray-500 group-hover/org:text-gray-600 transition-colors duration-250">
                      {org.sector} • {org.region}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Rating */}
              <div className="relative">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-250",
                  "bg-emerald-100 text-emerald-700"
                )}>
                  <Star className={cn(
                    "w-4 h-4 transition-all duration-250",
                    getRatingColor(org.rating)
                  )} />
                  <span className={cn(
                    "text-sm font-bold transition-all duration-250",
                    getRatingColor(org.rating)
                  )}>
                    {org.rating}%
                  </span>
                </div>
                {/* Decorative glow */}
                <div className={cn(
                  "absolute -inset-1 rounded-lg bg-gradient-to-r opacity-0 transition-opacity duration-300",
                  getRatingGradient(org.rating) + "/10"
                )} />
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative z-10 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Тўлиқлик</span>
                <span className="font-medium">{org.completedTasks}/{org.tasksCount} топшириқ</span>
              </div>
              <div className="relative">
                <Progress 
                  value={org.rating} 
                  className={cn(
                    "h-3 transition-all duration-1000 ease-out",
                    org.rating >= 90 ? "bg-emerald-600" : 
                    org.rating >= 70 ? "bg-amber-600" : "bg-red-600"
                  )}
                />
              </div>
            </div>
            
          </div>
        ))}
        
        {sortedOrgs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ташкилотлар топилмади</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Ҳозирча ҳеч қандай ташкилотлар мавжуд эмас. Ташкилотларни қўшиш учун ташкилотлар бўлимига ўтинг.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
