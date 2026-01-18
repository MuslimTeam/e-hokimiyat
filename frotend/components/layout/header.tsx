"use client"

import React, { useState, useEffect } from "react"
import { Bell, Search, User, Settings, Sparkles, Menu, X } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { getNotifications, getUnreadNotificationsCount } from "@/lib/api"
import { cn } from "@/lib/utils"

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [recentNotifications, setRecentNotifications] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    let isMounted = true
    getUnreadNotificationsCount()
      .then((c) => isMounted && setUnreadCount(c))
      .catch(() => {})
    getNotifications()
      .then((list) => isMounted && setRecentNotifications(list.slice(0, 5)))
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-border bg-background/90 backdrop-blur-xl transition-all duration-500">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-30 animate-gradient-shift" />
      
      {/* Left section - Title */}
      <div className="flex items-center gap-6 animate-slide-up">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-modern shadow-lg">
            <Sparkles className="w-6 h-6 text-white animate-rotate-slow" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-bounce-subtle"></div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gradient-animated animate-slide-up">{title}</h1>
          {description && (
            <p className="text-sm text-foreground/80 animate-fade-in" style={{ animationDelay: "200ms" }}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Center section - Search */}
      <div className="relative hidden md:block flex-1 max-w-lg mx-8">
        <div className={cn(
          "relative group transition-all duration-300",
          isSearchFocused ? "scale-105" : ""
        )}>
          <Search className={cn(
            "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-all duration-200",
            isSearchFocused ? "text-foreground scale-110" : "group-hover:text-foreground"
          )} />
          <Input 
            placeholder="Қидириш..." 
            className={cn(
              "w-full h-12 bg-background/80 backdrop-blur-lg border-2 border-border rounded-2xl px-12 pr-4 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-4 transition-all duration-300",
              "focus:bg-background focus:border-primary"
            )}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {/* Animated border */}
          <div className={cn(
            "absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 transition-opacity duration-300 pointer-events-none",
            isSearchFocused ? "from-primary/20 to-secondary/20" : ""
          )} />
          
          {/* Glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 transition-opacity duration-300 pointer-events-none",
            isSearchFocused ? "from-blue-500/20 to-purple-600/20" : ""
          )} />
        </div>
      </div>

      {/* Right section - Notifications and User */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden relative z-20 h-10 w-10 transition-all duration-300 hover:scale-110 hover:bg-accent rounded-xl"
        >
          <Menu className="h-5 w-5 text-foreground" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </Button>

        {/* Notifications */}
        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative z-20 h-10 w-10 transition-all duration-300 hover:scale-110 hover:bg-accent rounded-xl hidden md:flex"
              >
                <Bell className={cn(
                  "h-5 w-5 text-foreground transition-all duration-300",
                  unreadCount > 0 ? "animate-pulse-modern" : ""
                )} />
                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-6 w-6 rounded-full p-0 text-[10px] flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-600 text-white animate-bounce-subtle shadow-lg">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 glass">
            <DropdownMenuLabel className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-foreground">Билдиришномалар</span>
              </div>
              <Link href="/dashboard/notifications">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-xs text-blue-500 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                >
                  Барчасини кўриш
                </Button>
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {recentNotifications.map((notification, index) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className="flex flex-col items-start gap-3 p-3 transition-all duration-200 hover:bg-white/10 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      notification.type === "task_overdue" ? "bg-red-500" : "bg-blue-500"
                    )} />
                    <span className={cn(
                      "font-medium text-sm",
                      notification.type === "task_overdue" ? "text-red-600" : "text-foreground"
                    )}>
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto animate-pulse-modern"></div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{notification.description}</span>
                </DropdownMenuItem>
              ))}
            </div>
            
            {recentNotifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mb-4 animate-float" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Янги билдиришномалар йўқ</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Ҳозирча ҳеч қандай билдиришномалар мавжуд эмас.
                </p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        )}

        {/* User Menu */}
        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative z-20 h-10 w-10 transition-all duration-300 hover:scale-110 hover:bg-accent rounded-xl"
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/50 ring-offset-2 ring-offset-transparent">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold animate-pulse-modern">
                    АК
                  </AvatarFallback>
                </Avatar>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 glass">
            <DropdownMenuLabel className="flex items-center gap-3 p-4">
              <User className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-foreground">Абдулла Каримов</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3 p-3 transition-all duration-200 hover:bg-accent">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span>Созламалар</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 p-3 transition-all duration-200 hover:bg-accent">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Профил</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 p-3 transition-all duration-200 hover:bg-destructive/10">
              <X className="w-4 h-4 text-destructive" />
              <span>Чиқиш</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        )}
      </div>
    </header>
  )
}
