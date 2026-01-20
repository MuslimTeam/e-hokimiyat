"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts"
import { getTasks, getOrganizations, getUsers } from "@/lib/api"
import { taskStatusLabels, TaskStatus } from "@/lib/mock-data"
import { Header } from "@/components/layout/header"
import { TrendingUp, TrendingDown, Users, Building2, CheckCircle, Clock, AlertTriangle, Download, Calendar, Filter } from "lucide-react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState("month")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([getTasks(), getOrganizations(), getUsers()])
      .then(([tasksData, orgsData, usersData]) => {
        setTasks(tasksData)
        setOrganizations(orgsData)
        setUsers(usersData)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === "BAJARILDI" || t.status === "NAZORATDAN_YECHILDI").length
  const inProgressTasks = tasks.filter(t => t.status === "Bajarilmoqda").length
  const overdueTasks = tasks.filter(t => {
    const deadline = new Date(t.deadline)
    return deadline < new Date() && t.status !== "BAJARILDI" && t.status !== "NAZORATDAN_YECHILDI"
  }).length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Status distribution
  const statusCounts = tasks.reduce((acc: Record<string, number>, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {})

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: taskStatusLabels[status as TaskStatus] || status,
    value: count,
    status,
  }))

  // Sector statistics
  const sectors = Array.from(new Set(tasks.map((t) => t.sector)))
  const sectorStats = sectors
    .map((sector) => {
      const sTasks = tasks.filter((t) => t.sector === sector)
      const completed = sTasks.filter((t) => t.status === "BAJARILDI" || t.status === "NAZORATDAN_YECHILDI").length
      return {
        sector,
        total: sTasks.length,
        completed,
        completionRate: sTasks.length > 0 ? Math.round((completed / sTasks.length) * 100) : 0,
      }
    })
    .sort((a, b) => b.total - a.total)

  // Organization statistics
  const orgStats = organizations
    .map((org) => {
      const orgTasks = tasks.filter((t) => t.organizationId === org.id)
      const completed = orgTasks.filter((t) => t.status === "BAJARILDI" || t.status === "NAZORATDAN_YECHILDI").length
      return {
        name: org.name,
        total: orgTasks.length,
        completed,
        completionRate: orgTasks.length > 0 ? Math.round((completed / orgTasks.length) * 100) : 0,
        sector: org.sector,
      }
    })
    .filter((org) => org.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  // Time series data (mock data for demonstration)
  const timeSeriesData = [
    { month: "Январ", bajarildi: 20, yaratildi: 25, jami: 45 },
    { month: "Феврал", bajarildi: 25, yaratildi: 28, jami: 53 },
    { month: "Март", bajarildi: 32, yaratildi: 35, jami: 67 },
    { month: "Апрел", bajarildi: 28, yaratildi: 30, jami: 58 },
    { month: "Май", bajarildi: 22, yaratildi: 25, jami: 47 },
    { month: "Июн", bajarildi: 35, yaratildi: 38, jami: 73 },
  ]

  if (isLoading) {
    return (
      <>
        <Header title="Тизим аналитикаси" description="Юкланмоқда..." />
        <div className="min-h-screen bg-background pt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 py-8">
              <div className="animate-pulse">
                <div className="h-32 bg-muted rounded-2xl mb-8"></div>
                <div className="grid gap-6 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Тизим аналитикаси" description="Топшириқлар, ташкилотлар ва фойдаланувчилар бўйича батафсил таҳлил" />
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 py-8">

            {/* Header Section */}
            <section className="animate-slide-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">📊</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Тизим аналитикаси</h1>
                  <p className="text-lg text-muted-foreground">Топшириқлар, ташкилотлар ва фойдаланувчилар бўйича батафсил таҳлил</p>
                </div>
              </div>
              
              {/* Controls */}
              <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-md p-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Вақт оралиғи:</span>
                    </div>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[150px] bg-background/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Ой</SelectItem>
                        <SelectItem value="month">Чорак</SelectItem>
                        <SelectItem value="year">Йил</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="outline" className="hover:bg-muted/20">
                    <Download className="mr-2 h-4 w-4" />
                    Экспорт қилиш
                  </Button>
                </div>
              </div>
            </section>

            {/* Overview Cards */}
            <section className="animate-slide-up">
              <div className="grid gap-6 lg:grid-cols-4">
                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Жами топшириқлар</p>
                        <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Бажарилган</p>
                        <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Ижро қилинмоқда</p>
                        <p className="text-2xl font-bold text-amber-600">{inProgressTasks}</p>
                      </div>
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Муддати ўтган</p>
                        <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Charts */}
            <section className="animate-slide-up">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50 border-border/50">
                  <TabsTrigger value="overview" className="rounded-lg">Умумий кўриниш</TabsTrigger>
                  <TabsTrigger value="sector" className="rounded-lg">Сўҳа бўйича</TabsTrigger>
                  <TabsTrigger value="organizations" className="rounded-lg">Ташкилотлар</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md">
                      <CardHeader>
                        <CardTitle>Топшириқлар ҳолати</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={statusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md">
                      <CardHeader>
                        <CardTitle>Вақт бўйича динамика</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={timeSeriesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="bajarildi" stackId="1" stroke="#8884d8" fill="#8884d8" />
                            <Area type="monotone" dataKey="yaratildi" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="sector" className="space-y-6">
                  <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md">
                    <CardHeader>
                      <CardTitle>Сўҳалар бўйича таҳлил</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={sectorStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="sector" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="total" fill="#8884d8" name="Жами" />
                          <Bar dataKey="completed" fill="#82ca9d" name="Бажарилган" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="organizations" className="space-y-6">
                  <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md">
                    <CardHeader>
                      <CardTitle>Ташкилотлар бўйича кўрсаткичлар</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orgStats.map((org, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{org.name}</h4>
                              <p className="text-sm text-muted-foreground">{org.sector}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Топшириқлар</p>
                                <p className="font-semibold">{org.total}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Бажарилган</p>
                                <p className="font-semibold text-green-600">{org.completed}</p>
                              </div>
                              <Badge className={`${org.completionRate >= 80 ? 'bg-green-500' : org.completionRate >= 60 ? 'bg-amber-500' : 'bg-red-500'} text-white`}>
                                {org.completionRate}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
