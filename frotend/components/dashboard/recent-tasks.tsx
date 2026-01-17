"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTasks, getOrganizations } from "@/lib/api"
import { TaskStatusBadge, PriorityBadge } from "@/components/ui/status-badge"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"

export function RecentTasks() {
  const [recentTasks, setRecentTasks] = React.useState<any[]>([])
  const [orgsMap, setOrgsMap] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    let mounted = true
    Promise.all([getTasks(), getOrganizations()])
      .then(([tasks, orgs]) => {
        if (!mounted) return
        setRecentTasks(tasks.slice(0, 5))
        const map: Record<string, string> = {}
        orgs.forEach((o: any) => (map[o.id] = o.name))
        setOrgsMap(map)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Сўнгги топшириқлар</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/tasks" className="text-primary">
            Барчаси <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start justify-between gap-4 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-foreground">{task.title}</h4>
                <PriorityBadge priority={task.priority} />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(task.deadline).toLocaleDateString("uz-UZ")}
                </span>
                <span>{(task.organizations || []).map((id: string) => orgsMap[id]).filter(Boolean).join(", ")}</span>
              </div>
            </div>
            <TaskStatusBadge status={task.status} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
