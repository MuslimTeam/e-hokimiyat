// @ts-nocheck
"use client"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  Bell,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true)
        setIsMobileOpen(false)
      } else {
        setCollapsed(false)
        setIsMobileOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navItems = [
    {
      title: "Бош саҳифа",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Топшириқлар",
      href: "/dashboard/tasks",
      icon: ClipboardList,
    },
    {
      title: "Фойдаланувчилар",
      href: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Ташкилотлар",
      href: "/dashboard/organizations",
      icon: Building2,
    },
    {
      title: "Билдиришномалар",
      href: "/dashboard/notifications",
      icon: Bell,
    },
    {
      title: "Мурожаатлар",
      href: "/dashboard/appeals",
      icon: MessageSquare,
    },
    {
      title: "Аналитика",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <div
        className={cn(
          "relative flex h-screen flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 shadow-sm z-50",
          collapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
      
      {/* Header */}
      <div className="relative z-10 flex h-20 items-center justify-between border-b border-sidebar-border bg-sidebar transition-all duration-300">
        {!collapsed && (
          <div className="flex items-center gap-3 px-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-primary-foreground shadow-sm">
              <span className="font-bold text-sm">ЭХ</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">e-hokimiyat</h1>
              <p className="text-xs text-muted-foreground">Электрон ҳокимият платформаси</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex mx-2 h-8 w-8 rounded-md transition-all duration-200 hover:bg-muted hover:text-primary"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            collapsed ? "rotate-180" : ""
          )} />
        </Button>
        
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(false)}
          className="flex md:hidden mx-2 h-8 w-8 rounded-md transition-all duration-200 hover:bg-muted hover:text-primary"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Navigation */}
      <nav
        className="relative z-10 flex-1 space-y-3 px-4 py-8"
        role="navigation"
        aria-label="Асосий меню"
      >
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group relative flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-150 ease-in-out",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-3"
                )}
                role="menuitem"
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors duration-150",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} />
                
                {!collapsed && (
                  <span className={cn(
                    "truncate transition-colors duration-150",
                    isActive ? "font-semibold" : "text-sm"
                  )}>
                    {item.title}
                  </span>
                )}
                
                {/* Active indicator */}
                {isActive && !collapsed && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full opacity-90"></div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border bg-sidebar/95 px-4 py-4">
        {/* User Profile */}
        <div className={cn(
          "group relative flex items-center gap-3 rounded-lg p-4 bg-muted/70 transition-all duration-150 hover:bg-muted",
          collapsed && "justify-center"
        )}>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              АК
            </AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">
                Абдулла Каримов
              </p>
              <p className="truncate text-xs text-muted-foreground">
                admin@ehokimiyat.uz
              </p>
            </div>
          )}
        </div>

        {/* Settings */}
        <Link href="/dashboard/settings" className="block mt-3">
          <div
            className={cn(
              "group relative flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground",
              collapsed && "justify-center px-3"
            )}
          >
            <Settings className="h-4 w-4 transition-transform duration-150 group-hover:rotate-90" />
            
            {!collapsed && (
              <span className="transition-colors duration-250">
                Созламалар
              </span>
            )}
          </div>
        </Link>
      </div>
      </div>
      
      {/* Mobile menu toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-30 flex md:hidden h-10 w-10 rounded-lg bg-background/80 backdrop-blur-sm border border-border shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  )
}
