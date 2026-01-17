"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrganizations } from "@/lib/api"
import { Progress } from "@/components/ui/progress"
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

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Ташкилотлар рейтиги</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedOrgs.map((org, index) => (
          <div key={org.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                    index === 0 && "bg-yellow-500/20 text-yellow-400",
                    index === 1 && "bg-gray-400/20 text-gray-400",
                    index === 2 && "bg-orange-600/20 text-orange-500",
                    index > 2 && "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-foreground">{org.name}</span>
              </div>
              <span
                className={cn(
                  "text-sm font-bold",
                  org.rating >= 90 ? "text-accent" : org.rating >= 70 ? "text-warning" : "text-destructive",
                )}
              >
                {org.rating}%
              </span>
            </div>
            <Progress value={org.rating} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {org.completedTasks}/{org.tasksCount} topshiriq bajarildi
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
