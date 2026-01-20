"use client"

import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getUsers, getAuditLogs } from "@/lib/api"
import React from "react"
import { Search, Filter, History, User, ClipboardList, Building2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const extendedAuditLogs = [
  {
    id: "1",
    userId: "1",
    action: "USER_CREATED",
    details: "Tashkilot rahbari qo'shildi",
    targetType: "user" as const,
    targetId: "5",
    createdAt: "2026-01-16T14:00:00",
  },
  {
    id: "2",
    userId: "1",
    action: "TASK_CREATED",
    details: "Yangi topshiriq yaratildi",
    targetType: "task" as const,
    targetId: "5",
    createdAt: "2026-01-17T08:00:00",
  },
  {
    id: "3",
    userId: "1",
    action: "TASK_CLOSED",
    details: "Topshiriq nazoratdan yechildi",
    targetType: "task" as const,
    targetId: "2",
    createdAt: "2026-01-25T10:00:00",
  },
  {
    id: "4",
    userId: "1",
    action: "USER_BLOCKED",
    details: "Foydalanuvchi bloklandi: Bekzod Mamatov",
    targetType: "user" as const,
    targetId: "6",
    createdAt: "2026-01-14T11:30:00",
  },
  {
    id: "5",
    userId: "2",
    action: "TASK_EXTENDED",
    details: "Topshiriq muddati uzaytirildi: 7 kun",
    targetType: "task" as const,
    targetId: "3",
    createdAt: "2026-01-13T14:00:00",
  },
  {
    id: "6",
    userId: "1",
    action: "ORG_CREATED",
    details: "Yangi tashkilot yaratildi: Ekologiya bo'limi",
    targetType: "organization" as const,
    targetId: "6",
    createdAt: "2026-01-10T09:00:00",
  },
  {
    id: "7",
    userId: "3",
    action: "TASK_REPORT",
    details: "Hisobot topshirildi: Yo'l ta'mirlash ishlari",
    targetType: "task" as const,
    targetId: "1",
    createdAt: "2026-01-16T15:45:00",
  },
  {
    id: "8",
    userId: "1",
    action: "USER_ROLE_CHANGED",
    details: "Rol o'zgartirildi: Tashkilot mas'uli → Tashkilot rahbari",
    targetType: "user" as const,
    targetId: "4",
    createdAt: "2026-01-12T10:20:00",
  },
]

const actionLabels: Record<string, string> = {
  USER_CREATED: "Foydalanuvchi qo'shildi",
  USER_BLOCKED: "Foydalanuvchi bloklandi",
  USER_ARCHIVED: "Foydalanuvchi arxivlandi",
  USER_ROLE_CHANGED: "Rol o'zgartirildi",
  TASK_CREATED: "Topshiriq yaratildi",
  TASK_CLOSED: "Nazoratdan yechildi",
  TASK_EXTENDED: "Muddat uzaytirildi",
  TASK_REPORT: "Hisobot topshirildi",
  TASK_REASSIGNED: "Qayta ijroga yuborildi",
  ORG_CREATED: "Tashkilot yaratildi",
  ORG_UPDATED: "Tashkilot yangilandi",
  ORG_DELETED: "Tashkilot o'chirildi",
}

const targetTypeIcons = {
  user: User,
  task: ClipboardList,
  organization: Building2,
}

const targetTypeColors = {
  user: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  task: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  organization: "bg-purple-500/10 text-purple-500 border-purple-500/30",
}

function AuditLogContent() {
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [targetFilter, setTargetFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [logs, setLogs] = useState<any[]>(extendedAuditLogs)
  const [usersMap, setUsersMap] = useState<Record<string, any>>({})

  React.useEffect(() => {
    let mounted = true
    Promise.all([getAuditLogs(), getUsers()])
      .then(([fetchedLogs, users]) => {
        if (!mounted) return
        setLogs((prev) => [...extendedAuditLogs, ...(fetchedLogs || [])])
        const map: Record<string, any> = {}
        users.forEach((u: any) => (map[u.id] = u))
        setUsersMap(map)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter === "all" || log.action.startsWith(actionFilter)
    const matchesTarget = targetFilter === "all" || log.targetType === targetFilter
    const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesAction && matchesTarget && matchesSearch
  })

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return (
    <>
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 py-8">

            {/* Header Section */}
            <section className="animate-slide-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <History className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Аудит журнали</h1>
                  <p className="text-lg text-muted-foreground">Тизимдаги барча амалларнинг батафсил қайдлари</p>
                </div>
              </div>
            </section>

            {/* Stats Cards */}
            <section className="animate-slide-up">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <ClipboardList className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{extendedAuditLogs.length}</p>
                        <p className="text-sm text-muted-foreground">Жами қайдлар</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{new Set(extendedAuditLogs.map(l => l.userId)).size}</p>
                        <p className="text-sm text-muted-foreground">Фаол фойдаланувчилар</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {extendedAuditLogs.filter(l => l.targetType === 'organization').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Ташкилот амаллари</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <Filter className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {Object.keys(actionLabels).length}
                        </p>
                        <p className="text-sm text-muted-foreground">Амал турлари</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Filters Section */}
            <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center flex-wrap">
                      <div className="relative flex-1 lg:max-w-sm">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Қайд ёки фойдаланувчи бўйича қидирув..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-12 h-12 bg-background/50 border-2 border-border/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        />
                      </div>
                      <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-full lg:w-[200px] h-11 bg-background/50 border-2 border-border/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300">
                          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Амал тури" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl">
                          <SelectItem value="all">Барча амаллар</SelectItem>
                          <SelectItem value="USER">Фойдаланувчи амаллари</SelectItem>
                          <SelectItem value="TASK">Топшириқ амаллари</SelectItem>
                          <SelectItem value="ORG">Ташкилот амаллари</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={targetFilter} onValueChange={setTargetFilter}>
                        <SelectTrigger className="w-full lg:w-[200px] h-11 bg-background/50 border-2 border-border/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300">
                          <SelectValue placeholder="Обект тури" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl">
                          <SelectItem value="all">Барча обектлар</SelectItem>
                          <SelectItem value="user">Фойдаланувчи</SelectItem>
                          <SelectItem value="task">Топшириқ</SelectItem>
                          <SelectItem value="organization">Ташкилот</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Audit Logs Table */}
            <section className="animate-slide-up" style={{ animationDelay: "400ms" }}>
              <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-muted/20 transition-colors duration-300 bg-muted/10">
                        <TableHead className="text-foreground font-semibold px-6 py-4">Сана</TableHead>
                        <TableHead className="text-foreground font-semibold px-6 py-4">Фойдаланувчи</TableHead>
                        <TableHead className="text-foreground font-semibold px-6 py-4">Амал</TableHead>
                        <TableHead className="text-foreground font-semibold px-6 py-4">Тафсилотлар</TableHead>
                        <TableHead className="text-foreground font-semibold px-6 py-4">Обект</TableHead>
                      </TableRow>
                    </TableHeader>
            <TableBody>
              {filteredLogs
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((log, i) => {
                  const user = usersMap[log.userId]
                  const TargetIcon = targetTypeIcons[log.targetType as keyof typeof targetTypeIcons] || History
                  return (
                    <TableRow key={`${log.id}-${i}`} className="border-border">
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDateTime(log.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {user?.firstName?.[0]}
                              {user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {user?.lastName} {user?.firstName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{actionLabels[log.action] || log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{log.details}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={targetTypeColors[log.targetType as keyof typeof targetTypeColors]}>
                          <TargetIcon className="mr-1 h-3 w-3" />
                          {log.targetType === "user"
                            ? "Foydalanuvchi"
                            : log.targetType === "task"
                              ? "Topshiriq"
                              : "Tashkilot"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <History className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{extendedAuditLogs.length}</p>
                <p className="text-sm text-muted-foreground">Jami amallar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {extendedAuditLogs.filter((l) => l.targetType === "user").length}
                </p>
                <p className="text-sm text-muted-foreground">Foydalanuvchi amallari</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <ClipboardList className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {extendedAuditLogs.filter((l) => l.targetType === "task").length}
                </p>
                <p className="text-sm text-muted-foreground">Topshiriq amallari</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Building2 className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {extendedAuditLogs.filter((l) => l.targetType === "organization").length}
                </p>
                <p className="text-sm text-muted-foreground">Tashkilot amallari</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuditLogPage() {
  return (
    <>
      <Header title="Audit Log" description="Tizim amallari tarixi va monitoring" />
      <Suspense fallback={null}>
        <AuditLogContent />
      </Suspense>
    </>
  )
}
