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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true)
      } else {
        setCollapsed(false)
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
    <div
      className={cn(
        "relative flex h-screen flex-col bg-white border-r border-gray-200 transition-all duration-250",
        collapsed ? "w-20" : "w-72"
      )}
    >
      
      {/* Header */}
      <div className="relative z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white transition-all duration-250">
        {!collapsed && (
          <div className="flex items-center gap-3 px-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ЭХ</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">e-hokimiyat</h1>
              <p className="text-xs text-gray-500">Электрон ҳокимият платформаси</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 transition-all duration-250 hover:bg-emerald-50 hover:text-emerald-600 rounded-md mx-2"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-250 text-gray-600",
            collapsed ? "rotate-180" : ""
          )} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 p-4 space-y-3">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-250 ease-in-out",
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700",
                  collapsed && "justify-center px-3"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors duration-250",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-emerald-700"
                )} />
                
                {!collapsed && (
                  <span className={cn(
                    "truncate transition-colors duration-250",
                    isActive ? "text-white font-semibold" : "text-gray-600 group-hover:text-emerald-700"
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
      <div className="border-t border-gray-200 bg-white p-4">
        {/* User Profile */}
        <div className={cn(
          "group relative flex items-center gap-3 rounded-lg p-3 bg-emerald-50 transition-all duration-250 hover:bg-emerald-100",
          collapsed && "justify-center"
        )}>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-emerald-600 text-white text-sm font-semibold">
              АК
            </AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Абдулла Каримов
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@ehokimiyat.uz
              </p>
            </div>
          )}
        </div>

        {/* Settings */}
        <Link href="/dashboard/settings" className="block mt-3">
          <div
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-250 hover:bg-emerald-50 hover:text-emerald-700",
              collapsed && "justify-center px-3"
            )}
          >
            <Settings className="h-4 w-4 transition-transform duration-250 group-hover:rotate-90" />
            
            {!collapsed && (
              <span className="transition-colors duration-250">
                Созламалар
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}
