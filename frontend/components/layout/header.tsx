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
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-gray-200 bg-white transition-all duration-250">
      
      {/* Left section - Title */}
      <div className="flex items-center gap-6 animate-slide-up">
        <div className="relative">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500">
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
            "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-all duration-250",
            isSearchFocused ? "text-emerald-600 scale-110" : "group-hover:text-gray-600"
          )} />
          <Input 
            placeholder="Қидириш..." 
            className={cn(
              "w-full h-12 bg-white border-2 border-emerald-200 rounded-xl px-12 pr-4 text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:border-emerald-500 transition-all duration-250"
            )}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      {/* Right section - Notifications and User */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden relative z-20 h-10 w-10 transition-all duration-250 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg"
        >
          <Menu className="h-5 w-5 text-gray-600" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </Button>

        {/* Notifications */}
        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative z-20 h-10 w-10 transition-all duration-250 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg hidden md:flex"
              >
                <Bell className={cn(
                  "h-5 w-5 text-gray-600 transition-all duration-250",
                  unreadCount > 0 ? "animate-pulse" : ""
                )} />
                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-6 w-6 rounded-full p-0 text-[10px] flex items-center justify-center bg-emerald-600 text-white shadow-sm">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 bg-white border border-gray-200 shadow-lg">
            <DropdownMenuLabel className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-gray-900">Билдиришномалар</span>
              </div>
              <Link href="/dashboard/notifications">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-xs text-emerald-600 hover:text-emerald-700 transition-all duration-250"
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
                  className="flex flex-col items-start gap-3 p-3 transition-all duration-250 hover:bg-emerald-50"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      notification.type === "task_overdue" ? "bg-red-500" : "bg-emerald-600"
                    )} />
                    <span className={cn(
                      "font-medium text-sm",
                      notification.type === "task_overdue" ? "text-red-600" : "text-gray-900"
                    )}>
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-emerald-600 rounded-full ml-auto animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{notification.description}</span>
                </DropdownMenuItem>
              ))}
            </div>
            
            {recentNotifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Янги билдиришномалар йўқ</h3>
                <p className="text-sm text-gray-500 max-w-md">
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
                className="relative z-20 h-10 w-10 transition-all duration-250 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg"
              >
                <Avatar className="h-8 w-8 ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-transparent">
                  <AvatarFallback className="bg-emerald-600 text-white text-sm font-semibold">
                    АК
                  </AvatarFallback>
                </Avatar>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-white border border-gray-200 shadow-lg">
            <DropdownMenuLabel className="flex items-center gap-3 p-4">
              <User className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-gray-900">Абдулла Каримов</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3 p-3 transition-all duration-250 hover:bg-emerald-50">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Созламалар</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 p-3 transition-all duration-250 hover:bg-emerald-50">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Профил</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 p-3 transition-all duration-250 hover:bg-red-50">
              <X className="w-4 h-4 text-red-500" />
              <span className="text-red-600">Чиқиш</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        )}
      </div>
    </header>
  )
}
