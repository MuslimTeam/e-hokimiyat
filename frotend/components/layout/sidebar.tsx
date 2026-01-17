"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { useTranslation } from "@/lib/i18n/context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getUnreadNotificationsCount } from "@/lib/api"

export function Sidebar() {
  const t = useTranslation()
  
  const navItems = [
    { href: "/dashboard", label: t.navigation.dashboard, icon: LayoutDashboard },
    { href: "/dashboard/tasks", label: t.navigation.tasks, icon: ClipboardList },
    { href: "/dashboard/users", label: t.navigation.users, icon: Users },
    { href: "/dashboard/organizations", label: t.navigation.organizations, icon: Building2 },
    { href: "/dashboard/notifications", label: t.navigation.notifications, icon: Bell, badge: true },
    { href: "/dashboard/analytics", label: t.navigation.analytics, icon: BarChart3 },
    { href: "/dashboard/audit", label: t.navigation.auditLog, icon: History },
  ]
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [unreadCount, setUnreadCount] = useState<number>(0)

  React.useEffect(() => {
    let mounted = true
    getUnreadNotificationsCount()
      .then((c) => mounted && setUnreadCount(c))
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
      style={{ backgroundColor: "var(--sidebar)", color: "var(--sidebar-foreground)", borderColor: "var(--sidebar-border)" }}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Shield className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">E-Ҳокимият</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.badge && unreadCount > 0 && (
                <Badge
                  className={cn(
                    "h-5 min-w-5 rounded-full p-0 text-[10px] flex items-center justify-center bg-destructive text-destructive-foreground",
                    collapsed ? "absolute -right-1 -top-1" : "ml-auto",
                  )}
                >
                  {unreadCount}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors",
            pathname === "/dashboard/settings" && "bg-sidebar-accent text-sidebar-accent-foreground",
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Созламалар</span>}
        </Link>

        <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">AK</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">Абдулла Каримов</p>
              <p className="truncate text-xs text-sidebar-foreground/60">Ҳоким</p>
            </div>
          )}
          {!collapsed && (
            <Link href="/login">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}
