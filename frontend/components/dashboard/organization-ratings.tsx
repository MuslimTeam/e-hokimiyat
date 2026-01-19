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
      case 0: return "from-yellow-400 to-yellow-600"
      case 1: return "from-gray-400 to-gray-600"
      case 2: return "from-orange-400 to-orange-600"
      default: return "from-muted to-muted-foreground"
    }
  }

  const getRankBg = (index: number) => {
    switch (index) {
      case 0: return "from-yellow-400/20 to-yellow-600/20"
      case 1: return "from-gray-400/20 to-gray-600/20"
      case 2: return "from-orange-400/20 to-orange-600/20"
      default: return "from-muted/50 to-muted-foreground/50"
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "text-green-500"
    if (rating >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getRatingGradient = (rating: number) => {
    if (rating >= 90) return "from-green-500 to-green-600"
    if (rating >= 70) return "from-yellow-500 to-yellow-600"
    return "from-red-500 to-red-600"
  }

  return (
    <Card className="card-modern group relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-orange-600/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center animate-pulse-modern">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-semibold text-gradient-animated">Ташкилотлар рейтиги</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs font-medium text-green-500">+8%</span>
            </div>
            <div className="w-2 h-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full animate-pulse-modern" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4 p-6">
        {sortedOrgs.map((org, index) => (
          <div
            key={org.id}
            className={cn(
              "group/org relative space-y-3 rounded-xl border border-border/50 bg-gradient-to-r from-card to-card/50 p-4 transition-all duration-300 hover:scale-102 hover:shadow-lg hover:shadow-glow animate-slide-up",
              "hover:from-amber-500/5 hover:to-orange-600/5"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Hover background */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-600/5 opacity-0 group-hover/org:opacity-100 transition-opacity duration-300 rounded-xl" />
            
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
                    "absolute -inset-1 rounded-full bg-gradient-to-br opacity-20 animate-pulse-modern",
                    getRankColor(index)
                  )} />
                </div>
                
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground group-hover/org:text-primary transition-colors duration-200" />
                  <div>
                    <h3 className="font-semibold text-foreground group-hover/org:text-primary transition-colors duration-200">
                      {org.name}
                    </h3>
                    <p className="text-xs text-muted-foreground group-hover/org:text-foreground/80 transition-colors duration-200">
                      {org.sector} • {org.region}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Rating */}
              <div className="relative">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-300 group-hover/org:scale-105",
                  "bg-gradient-to-r " + getRatingGradient(org.rating) + "/20"
                )}>
                  <Star className={cn(
                    "w-4 h-4 transition-all duration-200",
                    getRatingColor(org.rating)
                  )} />
                  <span className={cn(
                    "text-sm font-bold transition-all duration-200",
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
                  className="h-3 transition-all duration-1000 ease-out"
                />
                {/* Progress glow effect */}
                <div className={cn(
                  "absolute inset-0 rounded-full bg-gradient-to-r opacity-0 transition-opacity duration-300",
                  getRatingGradient(org.rating) + "/20"
                )} />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full opacity-30 animate-pulse-modern" />
            <div className="absolute bottom-2 left-2 w-2 h-1 bg-gradient-to-br from-orange-600 to-amber-500 rounded-full opacity-30 animate-pulse-modern" />
          </div>
        ))}
        
        {sortedOrgs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mb-4 animate-float">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Ташкилотлар топилмади</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Ҳозирча ҳеч қандай ташкилотлар мавжуд эмас. Ташкилотларни қўшиш учун ташкилотлар бўлимига ўтинг.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
