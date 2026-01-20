"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { type Notification } from "@/lib/mock-data"
import { getNotifications } from "@/lib/api"
import { Bell, CheckCircle2, ClipboardList, AlertTriangle, UserPlus, Settings, Check, Trash2 } from "lucide-react"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const notificationIcons: Record<Notification["type"], typeof Bell> = {
  task_new: ClipboardList,
  task_deadline: AlertTriangle,
  task_completed: CheckCircle2,
  task_overdue: AlertTriangle,
  user_added: UserPlus,
  system: Settings,
}

const notificationColors: Record<Notification["type"], string> = {
  task_new: "bg-primary/10 text-primary",
  task_deadline: "bg-warning/10 text-warning",
  task_completed: "bg-accent/10 text-accent",
  task_overdue: "bg-destructive/10 text-destructive",
  user_added: "bg-blue-500/10 text-blue-500",
  system: "bg-muted text-muted-foreground",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<"all" | "unread">("all")

  React.useEffect(() => {
    let mounted = true
    getNotifications()
      .then((list) => mounted && setNotifications(list))
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const filteredNotifications = filter === "all" ? notifications : notifications.filter((n) => !n.read)

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} daqiqa oldin`
    if (diffHours < 24) return `${diffHours} soat oldin`
    if (diffDays < 7) return `${diffDays} kun oldin`
    return date.toLocaleDateString("uz-UZ")
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <>
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 py-8">

            {/* Header Section */}
            <section className="animate-slide-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Билдиришномалар</h1>
                  <p className="text-lg text-muted-foreground">Барча хабарлар ва огоҳлантиришлар</p>
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
                        <Bell className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
                        <p className="text-sm text-muted-foreground">Жами билдиришномалар</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{notifications.filter(n => n.read).length}</p>
                        <p className="text-sm text-muted-foreground">Ўқилган билдиришномалар</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{notifications.filter(n => !n.read).length}</p>
                        <p className="text-sm text-muted-foreground">Ўқилмаган билдиришномалар</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <ClipboardList className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {Object.keys(notificationIcons).length}
                        </p>
                        <p className="text-sm text-muted-foreground">Билдиришнома турлари</p>
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
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")} className="w-full sm:w-auto">
                      <TabsList className="grid w-full grid-cols-2 bg-muted/20 rounded-xl p-1">
                        <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          Барча билдиришномалар
                          <Badge variant="secondary" className="ml-2 bg-background/50">
                            {notifications.length}
                          </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="unread" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          Ўқилмаганлар
                          {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {unreadCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={markAllAsRead}
                        className="bg-background/50 border-border/50 hover:bg-background hover:border-primary/30 rounded-xl transition-all duration-300"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Бarchasini o'qilgan deb belgilash
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

        {/* Notifications List */}
        <Card className="bg-card border-border">
          <CardContent className="p-0 divide-y divide-border">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mb-4 opacity-20" />
                <p>Bildirishnomalar yo'q</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = notificationIcons[notification.type]
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50",
                      !notification.read && "bg-primary/5",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        notificationColors[notification.type],
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "font-medium text-foreground",
                            notification.type === "task_overdue" && "text-destructive",
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {notification.taskId && (
                        <Link href={`/dashboard/tasks/${notification.taskId}`}>
                          <Button variant="ghost" size="sm">
                            Ko'rish
                          </Button>
                        </Link>
                      )}
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
