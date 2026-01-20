"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Trash2, Settings, Filter, Search, Info, AlertTriangle, CheckCircle, XCircle, Calendar } from "lucide-react"
import { getNotifications } from "@/lib/api"
import { Header } from "@/components/layout/header"

const notificationTypes = {
  task_new: { icon: Info, color: "bg-blue-500", label: "Янги топшириқ" },
  task_completed: { icon: CheckCircle, color: "bg-green-500", label: "Топшириқ бажарилди" },
  task_updated: { icon: AlertTriangle, color: "bg-amber-500", label: "Топшириқ ўзгартирилди" },
  user_created: { icon: CheckCircle, color: "bg-green-500", label: "Фойдаланувчи яратилди" },
  user_updated: { icon: AlertTriangle, color: "bg-amber-500", label: "Фойдаланувчи ўзгартирилди" },
  system: { icon: Info, color: "bg-blue-500", label: "Тизим" },
  info: { icon: Info, color: "bg-blue-500", label: "Маълумот" },
  warning: { icon: AlertTriangle, color: "bg-amber-500", label: "Огоҳлантириш" },
  success: { icon: CheckCircle, color: "bg-green-500", label: "Муваффақият" },
  error: { icon: XCircle, color: "bg-red-500", label: "Хатолик" },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const data = await getNotifications()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Ҳозиргина"
    if (diffMins < 60) return `${diffMins} дақиқа олдин`
    if (diffHours < 24) return `${diffHours} соат олдин`
    if (diffDays < 7) return `${diffDays} кун олдин`
    return date.toLocaleDateString('en-GB')
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter = filter === "all" || notification.type === filter
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <>
      <Header title="Билдиришномалар" description="Тизимдаги барча билдиришномалар, огоҳлантиришлар ва хабарлар" />
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
                  <p className="text-lg text-muted-foreground">Тизимдаги барча билдиришномалар ва огоҳлантиришлар</p>
                </div>
                {unreadCount > 0 && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-3 py-1">
                    {unreadCount} ўқилмаган
                  </Badge>
                )}
              </div>
              
              {/* Controls */}
              <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-md p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="relative flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Билдиришномаларни қидириш..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-1 items-center">
                    {Object.entries(notificationTypes).map(([type, config]) => (
                      <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                          filter === type
                            ? `${config.color} text-white`
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {config.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                        filter === "all"
                          ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        Барчаси
                      </button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                      className="hover:bg-muted/20"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Барчасини ўқилган деб белгилаш
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearAllNotifications}
                      disabled={notifications.length === 0}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Барчасини тозалаш
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Notifications List */}
            <section className="animate-slide-up">
              <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Билдиришномалар рўйхати
                    <Badge variant="secondary" className="ml-auto">
                      {filteredNotifications.length} та
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Билдиришномалар йўқ</h3>
                      <p className="text-muted-foreground">
                        {searchQuery || filter !== "all" 
                          ? "Сизнинг қидирушингиз бўйича билдиришномалар топилмади"
                          : "Сизда ҳозирча билдиришномалар йўқ"
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => {
                        const typeConfig = notificationTypes[notification.type as keyof typeof notificationTypes] || notificationTypes.info
                        const Icon = typeConfig.icon
                        
                        return (
                          <div
                            key={notification.id}
                            className={`p-4 rounded-xl border transition-all duration-200 ${
                              notification.read
                                ? "bg-muted/20 border-border/50"
                                : "bg-gradient-to-r from-orange-50/50 to-amber-50/50 border-orange-200/50 shadow-sm"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-full ${typeConfig.color} flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <h3 className={`font-semibold text-foreground ${!notification.read ? "text-orange-600" : ""}`}>
                                      {notification.title}
                                    </h3>
                                    <p className="text-muted-foreground mt-1">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatTime(notification.createdAt)}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        {typeConfig.label}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => markAsRead(notification.id)}
                                        className="hover:bg-orange-100 hover:text-orange-600"
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteNotification(notification.id)}
                                      className="hover:bg-destructive/10 hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
