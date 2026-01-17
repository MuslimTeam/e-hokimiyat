"use client"

import React from "react"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getNotifications, getUnreadNotificationsCount } from "@/lib/api"

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const [unreadCount, setUnreadCount] = React.useState<number>(0)
  const [recentNotifications, setRecentNotifications] = React.useState<any[]>([])

  React.useEffect(() => {
    let mounted = true
    getUnreadNotificationsCount()
      .then((c) => mounted && setUnreadCount(c))
      .catch(() => {})
    getNotifications()
      .then((list) => mounted && setRecentNotifications(list.slice(0, 5)))
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Qidirish..." className="w-64 bg-secondary pl-9" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Bildirishnomalar</span>
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary/80">
                  Barchasini ko'rish
                </Button>
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentNotifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                <div className="flex items-center gap-2 w-full">
                  <span className={`font-medium ${notification.type === "task_overdue" ? "text-destructive" : ""}`}>
                    {notification.title}
                  </span>
                  {!notification.read && <span className="h-2 w-2 rounded-full bg-primary ml-auto" />}
                </div>
                <span className="text-xs text-muted-foreground">{notification.description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
