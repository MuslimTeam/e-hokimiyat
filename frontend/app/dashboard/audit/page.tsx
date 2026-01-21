"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  History, 
  Search, 
  Filter, 
  User, 
  Building2, 
  ClipboardList, 
  Plus, 
  Edit, 
  Trash2,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data
const auditLogs = [
  {
    id: 1,
    userId: "user1",
    userName: "Admin User",
    userAvatar: "",
    action: "create",
    targetType: "user",
    targetName: "John Doe",
    details: "Created new user account",
    timestamp: "2024-01-20T10:30:00Z"
  },
  {
    id: 2,
    userId: "user2",
    userName: "Manager",
    userAvatar: "",
    action: "update",
    targetType: "task",
    targetName: "Website Development",
    details: "Updated task priority to high",
    timestamp: "2024-01-20T11:15:00Z"
  },
  {
    id: 3,
    userId: "user1",
    userName: "Admin User",
    userAvatar: "",
    action: "delete",
    targetType: "organization",
    targetName: "Old Company",
    details: "Deleted organization record",
    timestamp: "2024-01-20T12:00:00Z"
  }
]

const actionLabels = {
  create: "Yaratish",
  update: "Yangilash",
  delete: "O'chirish"
}

const targetLabels = {
  user: "Foydalanuvchi",
  task: "Topshiriq",
  organization: "Tashkilot"
}

function AuditLogContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [targetFilter, setTargetFilter] = useState("all")

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch = searchQuery === "" || 
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesAction = actionFilter === "all" || log.action === actionFilter
      const matchesTarget = targetFilter === "all" || log.targetType === targetFilter
      
      return matchesSearch && matchesAction && matchesTarget
    })
  }, [searchQuery, actionFilter, targetFilter])

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-500/20 text-green-600 border-green-500/30"
      case "update":
        return "bg-amber-500/20 text-amber-600 border-amber-500/30"
      case "delete":
        return "bg-red-500/20 text-red-600 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Plus className="h-3 w-3" />
      case "update":
        return <Edit className="h-3 w-3" />
      case "delete":
        return <Trash2 className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case "user":
        return <User className="h-4 w-4 text-muted-foreground" />
      case "task":
        return <ClipboardList className="h-4 w-4 text-muted-foreground" />
      case "organization":
        return <Building2 className="h-4 w-4 text-muted-foreground" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return (
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
              <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{auditLogs.length}</p>
                      <p className="text-sm text-muted-foreground">Жами қайдлар</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{new Set(auditLogs.map(l => l.userId)).size}</p>
                      <p className="text-sm text-muted-foreground">Фаол фойдаланувчилар</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {auditLogs.filter(l => l.targetType === 'organization').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Ташкилот амаллари</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-md">
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
          <section className="animate-slide-up">
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-md p-6">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Қайд ёки фойдаланувчи бўйича қидирув..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all"
                  />
                </div>

                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[180px] bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
                    <SelectValue placeholder="Амал тури" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                    <SelectItem value="all">Барча амаллар</SelectItem>
                    <SelectItem value="create">Яратиш</SelectItem>
                    <SelectItem value="update">Янгилаш</SelectItem>
                    <SelectItem value="delete">Ўчириш</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={targetFilter} onValueChange={setTargetFilter}>
                  <SelectTrigger className="w-[180px] bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
                    <SelectValue placeholder="Объект тури" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                    <SelectItem value="all">Барча объектлар</SelectItem>
                    <SelectItem value="user">Фойдаланувчи</SelectItem>
                    <SelectItem value="task">Топшириқ</SelectItem>
                    <SelectItem value="organization">Ташкилот</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Audit Logs Table */}
          <section className="animate-slide-up">
            <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-md">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-muted-foreground">Сана</TableHead>
                      <TableHead className="text-muted-foreground">Фойдаланувчи</TableHead>
                      <TableHead className="text-muted-foreground">Амал</TableHead>
                      <TableHead className="text-muted-foreground">Объект</TableHead>
                      <TableHead className="text-muted-foreground">Тафсилотлар</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="border-border/50 hover:bg-muted/20 transition-colors">
                        <TableCell className="font-medium">{formatDate(log.timestamp)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={log.userAvatar} />
                              <AvatarFallback>{log.userName.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <span>{log.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("border", getActionColor(log.action))}>
                            <div className="flex items-center gap-1">
                              {getActionIcon(log.action)}
                              {actionLabels[log.action as keyof typeof actionLabels]}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTargetIcon(log.targetType)}
                            {targetLabels[log.targetType as keyof typeof targetLabels]}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function AuditLogPage() {
  return (
    <>
      <Header title="Audit Log" description="Тизим амаллари тарихи ва мониторинг" />
      <Suspense fallback={null}>
        <AuditLogContent />
      </Suspense>
    </>
  )
}
