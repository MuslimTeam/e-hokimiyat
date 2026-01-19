"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { taskStatusLabels, sectorLabels, sectorColors, type TaskStatus, type Sector } from "@/lib/mock-data"
import { getTasks, getOrganizations } from "@/lib/api"
import React from "react"
import { TrendingUp, TrendingDown, Clock, Target, Layers, Building2 } from "lucide-react"

export default function AnalyticsPage() {
  const [tasks, setTasks] = React.useState<any[]>([])
  const [orgs, setOrgs] = React.useState<any[]>([])

  React.useEffect(() => {
    let mounted = true
    Promise.all([getTasks(), getOrganizations()])
      .then(([tasksList, orgsList]) => {
        if (!mounted) return
        setTasks(tasksList)
        setOrgs(orgsList)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const statusCounts = tasks.reduce((acc: Record<string, number>, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {})

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: taskStatusLabels[status as TaskStatus] || status,
    value: count,
    status,
  }))

  const sectors = Array.from(new Set(tasks.map((t) => t.sector)))
  const sectorStats = sectors
    .map((sector) => {
      const sTasks = tasks.filter((t) => t.sector === sector)
      const completed = sTasks.filter((t) => t.status === "BAJARILDI" || t.status === "NAZORATDAN_YECHILDI").length
      const late = sTasks.filter((t) => t.status === "MUDDATI_KECH").length
      return {
        sector,
        label: sectorLabels[sector as Sector] || sector,
        total: sTasks.length,
        completed,
        late,
        inProgress: sTasks.length - completed - late,
        completionRate: sTasks.length > 0 ? Math.round((completed / sTasks.length) * 100) : 0,
      }
    })
    .filter((s) => s.total > 0)

  const sectorChartData = sectorStats.map((s) => ({
    name: s.label.length > 12 ? s.label.substring(0, 12) + "..." : s.label,
    fullName: s.label,
    jami: s.total,
    bajarildi: s.completed,
    kechikkan: s.late,
    foiz: s.completionRate,
  }))

  const sectorPieData = sectorStats.map((s) => ({ name: s.label, value: s.total, sector: s.sector }))

  const orgPerformanceData = orgs.map((org) => ({
    name: org.name.split(" ")[0],
    bajarildi: org.completedTasks,
    jami: org.tasksCount,
    reyting: org.rating,
  }))

const COLORS = [
  "hsl(240, 60%, 50%)",
  "hsl(85, 60%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(25, 80%, 55%)",
  "hsl(0, 70%, 50%)",
  "hsl(160, 60%, 50%)",
  "hsl(280, 50%, 55%)",
]

const metrics = [
  {
    label: "O'rtacha ijro muddati",
    value: "4.2 kun",
    change: "-0.8",
    trend: "down",
    icon: Clock,
  },
  {
    label: "Ijro samaradorligi",
    value: "87%",
    change: "+5%",
    trend: "up",
    icon: Target,
  },
  {
    label: "Kechikish foizi",
    value: "8%",
    change: "-2%",
    trend: "down",
    icon: TrendingDown,
  },
  {
    label: "Umumiy reyting",
    value: "86.8",
    change: "+3.2",
    trend: "up",
    icon: TrendingUp,
  },
]

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Time Filter */}
        <div className="flex justify-end">
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px] bg-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Oxirgi hafta</SelectItem>
              <SelectItem value="month">Oxirgi oy</SelectItem>
              <SelectItem value="quarter">Oxirgi chorak</SelectItem>
              <SelectItem value="year">Oxirgi yil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">{metric.value}</p>
                    <p
                      className={`mt-1 flex items-center gap-1 text-sm ${
                        metric.trend === "up"
                          ? metric.label.includes("Kechikish")
                            ? "text-destructive"
                            : "text-accent"
                          : metric.label.includes("Kechikish")
                            ? "text-accent"
                            : "text-destructive"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {metric.change}
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <metric.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="sectors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sectors" className="gap-2">
              <Layers className="h-4 w-4" />
              Sohalar bo'yicha
            </TabsTrigger>
            <TabsTrigger value="organizations" className="gap-2">
              <Building2 className="h-4 w-4" />
              Tashkilotlar bo'yicha
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sectors" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Sector Distribution Pie Chart */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{"Sohalar bo'yicha topshiriqlar taqsimoti"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sectorPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sectorPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={sectorColors[entry.sector as Sector]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(240, 10%, 15%)",
                            border: "1px solid hsl(240, 10%, 25%)",
                            borderRadius: "8px",
                            color: "hsl(0, 0%, 95%)",
                          }}
                        />
                        <Legend wrapperStyle={{ color: "hsl(240, 5%, 65%)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Sector Performance Bar Chart */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Sohalar samaradorligi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sectorChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 25%)" />
                        <XAxis type="number" stroke="hsl(240, 5%, 50%)" fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke="hsl(240, 5%, 50%)" fontSize={11} width={100} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(240, 10%, 15%)",
                            border: "1px solid hsl(240, 10%, 25%)",
                            borderRadius: "8px",
                            color: "hsl(0, 0%, 95%)",
                          }}
                          formatter={(value, name) => [
                            value,
                            name === "jami" ? "Jami" : name === "bajarildi" ? "Bajarildi" : "Kechikkan",
                          ]}
                        />
                        <Bar dataKey="jami" fill="hsl(240, 60%, 50%)" name="Jami" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="bajarildi" fill="hsl(160, 60%, 45%)" name="Bajarildi" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{"Sohalar bo'yicha batafsil statistika"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Soha</th>
                        <th className="pb-3 font-medium text-center">Jami</th>
                        <th className="pb-3 font-medium text-center">Bajarildi</th>
                        <th className="pb-3 font-medium text-center">Ijroda</th>
                        <th className="pb-3 font-medium text-center">Kechikkan</th>
                        <th className="pb-3 font-medium text-center">Samaradorlik</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectorStats.map((sector) => (
                        <tr key={sector.sector} className="border-b border-border/50 text-sm">
                          <td className="py-4 font-medium text-foreground">{sector.label}</td>
                          <td className="py-4 text-center text-muted-foreground">{sector.total}</td>
                          <td className="py-4 text-center text-accent">{sector.completed}</td>
                          <td className="py-4 text-center text-warning">{sector.inProgress}</td>
                          <td className="py-4 text-center text-destructive">{sector.late}</td>
                          <td className="py-4 text-center">
                            <span
                              className={`font-semibold ${
                                sector.completionRate >= 80
                                  ? "text-accent"
                                  : sector.completionRate >= 50
                                    ? "text-warning"
                                    : "text-destructive"
                              }`}
                            >
                              {sector.completionRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organizations tab content */}
          <TabsContent value="organizations" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Status Distribution */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{"Topshiriqlar holati bo'yicha"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {statusData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(240, 10%, 15%)",
                            border: "1px solid hsl(240, 10%, 25%)",
                            borderRadius: "8px",
                            color: "hsl(0, 0%, 95%)",
                          }}
                        />
                        <Legend wrapperStyle={{ color: "hsl(240, 5%, 65%)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Organization Performance */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Tashkilotlar samaradorligi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={orgPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 25%)" />
                        <XAxis dataKey="name" stroke="hsl(240, 5%, 50%)" fontSize={12} tickLine={false} />
                        <YAxis stroke="hsl(240, 5%, 50%)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(240, 10%, 15%)",
                            border: "1px solid hsl(240, 10%, 25%)",
                            borderRadius: "8px",
                            color: "hsl(0, 0%, 95%)",
                          }}
                        />
                        <Bar dataKey="jami" fill="hsl(240, 60%, 50%)" name="Jami" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="bajarildi" fill="hsl(160, 60%, 45%)" name="Bajarildi" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats Table */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{"Tashkilotlar bo'yicha batafsil statistika"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Tashkilot</th>
                        <th className="pb-3 font-medium">Soha</th>
                        <th className="pb-3 font-medium text-center">Jami</th>
                        <th className="pb-3 font-medium text-center">Bajarildi</th>
                        <th className="pb-3 font-medium text-center">Ijroda</th>
                        <th className="pb-3 font-medium text-center">Kechikkan</th>
                        <th className="pb-3 font-medium text-center">Reyting</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(orgs || []).map((org) => {
                        const tasksCount = org.tasksCount ?? 0
                        const completed = org.completedTasks ?? 0
                        const inProgress = Math.floor((tasksCount - completed) * 0.6)
                        const late = tasksCount - completed - inProgress
                        return (
                          <tr key={org.id} className="border-b border-border/50 text-sm">
                            <td className="py-4 font-medium text-foreground">{org.name}</td>
                            <td className="py-4 text-muted-foreground">{sectorLabels[org.sector]}</td>
                            <td className="py-4 text-center text-muted-foreground">{org.tasksCount}</td>
                            <td className="py-4 text-center text-accent">{org.completedTasks}</td>
                            <td className="py-4 text-center text-warning">{inProgress}</td>
                            <td className="py-4 text-center text-destructive">{late}</td>
                            <td className="py-4 text-center">
                              <span
                                className={`font-semibold ${
                                  org.rating >= 90
                                    ? "text-accent"
                                    : org.rating >= 70
                                      ? "text-warning"
                                      : "text-destructive"
                                }`}
                              >
                                {org.rating}%
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
