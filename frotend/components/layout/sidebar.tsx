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
  const [isHovered, setIsHovered] = useState(false)

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
      gradient: {
        from: "#3b82f6",
        to: "#9333ea"
      },
    },
    {
      title: "Топшириқлар",
      href: "/dashboard/tasks",
      icon: ClipboardList,
      gradient: {
        from: "#10b981",
        to: "#059669"
      },
    },
    {
      title: "Фойдаланувчилар",
      href: "/dashboard/users",
      icon: Users,
      gradient: {
        from: "#f97316",
        to: "#dc2626"
      },
    },
    {
      title: "Ташкилотлар",
      href: "/dashboard/organizations",
      icon: Building2,
      gradient: {
        from: "#a855f7",
        to: "#ec4899"
      },
    },
    {
      title: "Билдиришномалар",
      href: "/dashboard/notifications",
      icon: Bell,
      gradient: {
        from: "#ec4899",
        to: "#f43f5e"
      },
    },
    {
      title: "Мурожаатлар",
      href: "/dashboard/appeals",
      icon: MessageSquare,
      gradient: {
        from: "#8b5cf6",
        to: "#6366f1"
      },
    },
    {
      title: "Аналитика",
      href: "/dashboard/analytics",
      icon: BarChart3,
      gradient: {
        from: "#06b6d4",
        to: "#2563eb"
      },
    },
    {
      title: "Аудит журнали",
      href: "/dashboard/audit",
      icon: FileText,
      gradient: {
        from: "#6366f1",
        to: "#9333ea"
      },
    },
  ]

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col transition-all duration-500 bg-background",
        collapsed ? "w-20" : "w-72"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 transition-opacity duration-500" 
           style={{ opacity: isHovered ? 1 : 0 }} />
      
      {/* Header */}
      <div className="relative z-10 flex h-20 items-center justify-between border-b border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-500">
        {!collapsed && (
          <div className="flex items-center gap-3 animate-slide-up">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse-modern shadow-lg">
                <span className="text-white font-bold text-lg">ЭХ</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-bounce-subtle"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-animated">e-hokimiyat</h1>
              <p className="text-xs text-foreground/80">Электрон ҳокимият платформаси</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="relative z-20 h-10 w-10 transition-all duration-300 hover:scale-110 hover:bg-white/20 rounded-xl"
        >
          <ChevronLeft className={cn(
            "h-5 w-5 transition-transform duration-300",
            collapsed ? "rotate-180" : ""
          )} />
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 p-4 space-y-6">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 hover-lift",
                  isActive
                    ? "text-white shadow-lg"
                    : "text-foreground hover:text-white",
                  collapsed && "justify-center"
                )}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  background: isActive ? `linear-gradient(135deg, ${item.gradient.from}, ${item.gradient.to})` : 'transparent'
                }}
              >
                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                     style={{ backgroundImage: `linear-gradient(135deg, ${item.gradient.from}, ${item.gradient.to})` }} />
                
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-300 z-10",
                  isActive ? "text-white animate-pulse-modern" : "text-muted-foreground group-hover:text-white"
                )} />
                
                {!collapsed && (
                  <>
                    <span className={cn(
                      "transition-all duration-300 z-10",
                      isActive ? "text-white font-bold" : "text-foreground group-hover:text-white"
                    )}>
                      {item.title}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="ml-auto z-10">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse-modern"></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="relative z-10 border-t border-border bg-background/95 backdrop-blur-xl p-4 transition-all duration-500">
        {/* User Profile */}
        <div className={cn(
          "group relative flex items-center gap-4 rounded-2xl p-4 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl transition-all duration-300 hover-lift mb-4",
          collapsed && "justify-center"
        )}>
          <Avatar className="h-12 w-12 ring-4 ring-primary/50 ring-offset-4 ring-offset-transparent transition-all duration-300 group-hover:ring-primary/80 group-hover:scale-110">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold animate-pulse-modern">
              АК
            </AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate group-hover:text-foreground transition-colors duration-300">
                Абдулла Каримов
              </p>
              <p className="text-xs text-muted-foreground truncate group-hover:text-muted-foreground/80 transition-colors duration-300">
                admin@ehokimiyat.uz
              </p>
            </div>
          )}
          
          {/* Hover glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        </div>

        {/* Settings */}
        <Link href="/dashboard/settings">
          <div
            className={cn(
              "group relative flex items-center justify-end gap-4 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 hover-lift",
              collapsed && "justify-center"
            )}
          >
            {!collapsed && (
              <span className="transition-all duration-300 text-foreground group-hover:text-foreground">
                Созламалар
              </span>
            )}
            
            <Settings className={cn(
              "h-5 w-5 transition-all duration-300 text-foreground",
              "group-hover:rotate-90 group-hover:scale-110 group-hover:text-foreground"
            )} />
            
            {/* Hover background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          </div>
        </Link>
      </div>
    </div>
  )
}
