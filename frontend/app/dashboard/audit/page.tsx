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
        setLogs((prev) => [...extendedAuditLogs, ...(fetchedLogs?.logs || [])])
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
      <Header title="Аудит журнали" description="Тизимдаги барча амалларнинг батафсил қайдлари" />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 py-8">

            {/* Stats Cards */}
            <section className="animate-slide-up">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <ClipboardList className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{logs.length}</p>
                        <p className="text-sm text-muted-foreground">Жами қайдлар</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{new Set(logs.map(l => l.userId)).size}</p>
                        <p className="text-sm text-muted-foreground">Фаол фойдаланувчилар</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {logs.filter(l => l.targetType === 'organization').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Ташкилот амаллари</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
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
                      {filteredLogs.slice(0, 50).map((log, index) => {
                        const user = usersMap[log.userId]
                        const TargetIcon = targetTypeIcons[log.targetType as keyof typeof targetTypeIcons] || History
                        return (
                          <TableRow key={`${log.id}-${index}`} className="border-border hover:bg-muted/10 transition-colors duration-300">
                            <TableCell className="px-6 py-4">
                              <div className="text-sm text-muted-foreground whitespace-nowrap font-medium">
                                {formatDateTime(log.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-semibold">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="text-sm font-semibold text-foreground">
                                    {user?.lastName} {user?.firstName}
                                  </span>
                                  <div className="text-xs text-muted-foreground">
                                    {user?.position}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge variant="outline" className={`font-normal border-border/50 ${
                                log.action.includes('CREATED') ? 'bg-green-500/10 text-green-700 border-green-500/30' :
                                log.action.includes('BLOCKED') || log.action.includes('ARCHIVED') ? 'bg-red-500/10 text-red-700 border-red-500/30' :
                                log.action.includes('UPDATED') ? 'bg-blue-500/10 text-blue-700 border-blue-500/30' :
                                'bg-muted/20 text-foreground border-muted/50'
                              } transition-colors duration-200`}>
                                {actionLabels[log.action as keyof typeof actionLabels] || log.action}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <div className="text-sm text-foreground max-w-md truncate" title={log.details}>
                                {log.details}
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <TargetIcon className="h-4 w-4 text-muted-foreground/70" />
                                <Badge variant="secondary" className="font-normal bg-muted/20 text-foreground hover:bg-muted/30 transition-colors duration-200">
                                  {log.targetType}
                                </Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}

export default function AuditLogPage() {
  return (
    <Suspense fallback={<div>Yuklanmoqda...</div>}>
      <AuditLogContent />
    </Suspense>
  )
}
