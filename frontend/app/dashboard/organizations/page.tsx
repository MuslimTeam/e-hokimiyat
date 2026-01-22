"use client"

import React from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { sectorLabels, roleLabels, statusLabels, maskPnfl, roleCabinet, type UserRole, type UserStatus } from "@/lib/mock-data"
import { getOrganizations, getUsers } from "@/lib/api"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Lock,
  Archive,
  UserCheck,
  AlertCircle,
  Loader2,
  Building,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { UserStatusBadge } from "@/components/ui/status-badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function OrganizationsPage() {
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cabinetFilter, setCabinetFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [users, setUsers] = useState<any[]>([])
  const [orgsMap, setOrgsMap] = useState<Record<string, any>>({})

  useEffect(() => {
    let mounted = true
    Promise.all([getUsers(), getOrganizations()])
      .then(([usersList, orgs]) => {
        if (!mounted) return
        setUsers(usersList)
        const map: Record<string, any> = {}
        orgs.forEach((o: any) => (map[o.id] = o))
        setOrgsMap(map)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  // New user form state
  const [newUserPnfl, setNewUserPnfl] = useState("")
  const [newUserStep, setNewUserStep] = useState<"pnfl" | "loading" | "form" | "not_found">("pnfl")
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    role: "",
    organizationId: "",
    position: "",
    phone: "",
  })

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesCabinet = cabinetFilter === "all" || roleCabinet[user.role] === cabinetFilter
    const matchesSearch =
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.position || "").toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRole && matchesStatus && matchesCabinet && matchesSearch
  })

  const checkPnfl = () => {
    if (newUserPnfl.length !== 14) return

    setNewUserStep("loading")

    setTimeout(() => {
      // Simulate OneID lookup - random success/fail for demo
      if (Math.random() > 0.3) {
        // Found in OneID - pre-fill data
        setNewUserData({
          ...newUserData,
          firstName: "Yangi",
          lastName: "Foydalanuvchi",
          middleName: "O'g'li",
        })
        setNewUserStep("form")
      } else {
        setNewUserStep("not_found")
      }
    }, 1500)
  }

  const resetCreateDialog = () => {
    setNewUserPnfl("")
    setNewUserStep("pnfl")
    setNewUserData({
      firstName: "",
      lastName: "",
      middleName: "",
      role: "",
      organizationId: "",
      position: "",
      phone: "",
    })
    setIsCreateOpen(false)
  }

  const createUser = () => {
    // In real app, this would call API
    resetCreateDialog()
  }

  return (
    <>
      <Header title="Ташкилотлар бошқаруви" description="Тизимдаги барча ташкилотларнинг рўйхати, маълумотлари ва бошқаруви" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50">
        {/* Modern geometric background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-200/15 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-tr from-purple-200/10 to-transparent rounded-full blur-xl" />
          <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-gradient-to-br from-cyan-200/8 to-transparent rounded-full blur-lg" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 py-8">

            {/* Filters and Actions */}
            <section className="animate-slide-up">
              <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center flex-wrap">
                      <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Фойдаланувчи номи ёки лавозими бўйича қидирув..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-12 h-12 bg-background/50 border-2 border-border/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        />
                      </div>
                      <Select value={cabinetFilter} onValueChange={setCabinetFilter}>
                        <SelectTrigger className="w-full md:w-[180px] h-11 bg-background/50 border-2 border-border/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300">
                          <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Кабинет тури" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl">
                          <SelectItem value="all">Барча кабинетлар</SelectItem>
                          <SelectItem value="HOKIMLIK">Ҳокимлик кабинети</SelectItem>
                          <SelectItem value="TASHKILOT">Ташкилот кабинети</SelectItem>
                          <SelectItem value="ADMIN">Админ кабинети</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full md:w-[200px] h-11 bg-background/50 border-2 border-border/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300">
                          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Роль" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl">
                          <SelectItem value="all">Барча роллар</SelectItem>
                          {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                            <SelectItem key={role} value={role}>
                              {roleLabels[role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px] h-11 bg-background/50 border-2 border-border/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300">
                          <SelectValue placeholder="Ҳолат" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl">
                          <SelectItem value="all">Барча ҳолатлар</SelectItem>
                          {(Object.keys(statusLabels) as UserStatus[]).map((status) => (
                            <SelectItem key={status} value={status}>
                              {statusLabels[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Dialog
                      open={isCreateOpen}
                      onOpenChange={(open) => {
                        if (!open) resetCreateDialog()
                        else setIsCreateOpen(true)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                          <Plus className="mr-2 h-5 w-5" />
                          Янги фойдаланувчи қўшиш
                        </Button>
                      </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Yangi foydalanuvchi qo'shish</DialogTitle>
                    <DialogDescription>
                      {newUserStep === "pnfl" && "PNFL orqali foydalanuvchini OneID dan tekshiring"}
                      {newUserStep === "loading" && "OneID dan ma'lumotlar tekshirilmoqda..."}
                      {newUserStep === "form" && "Foydalanuvchi ma'lumotlarini to'ldiring"}
                      {newUserStep === "not_found" && "Foydalanuvchi OneID da topilmadi"}
                    </DialogDescription>
                  </DialogHeader>

                  {newUserStep === "pnfl" && (
                    <div className="grid gap-4 py-4">
                      <Alert className="border-primary/30 bg-primary/5">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-sm">
                          Foydalanuvchi PNFL raqamini kiriting. OneID dan avtomatik ma'lumotlar olinadi.
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <Label htmlFor="pnfl">PNFL (JSHSHR)</Label>
                        <Input
                          id="pnfl"
                          placeholder="14 raqamli PNFL"
                          maxLength={14}
                          value={newUserPnfl}
                          onChange={(e) => setNewUserPnfl(e.target.value.replace(/\D/g, "").slice(0, 14))}
                          className="font-mono"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                          Bekor qilish
                        </Button>
                        <Button onClick={checkPnfl} disabled={newUserPnfl.length !== 14}>
                          Tekshirish
                        </Button>
                      </DialogFooter>
                    </div>
                  )}

                  {newUserStep === "loading" && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">OneID dan tekshirilmoqda...</p>
                    </div>
                  )}

                  {newUserStep === "not_found" && (
                    <div className="py-4 space-y-4">
                      <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Ushbu PNFL bilan foydalanuvchi OneID tizimida topilmadi. Iltimos, PNFL ni tekshiring.
                        </AlertDescription>
                      </Alert>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewUserStep("pnfl")}>
                          Qaytadan urinish
                        </Button>
                      </DialogFooter>
                    </div>
                  )}

                  {newUserStep === "form" && (
                    <div className="grid gap-4 py-4">
                      <div className="rounded-lg border border-border bg-muted/50 p-3 space-y-1">
                        <p className="text-xs text-muted-foreground">PNFL (OneID dan tasdiqlangan)</p>
                        <p className="font-mono font-medium">{maskPnfl(newUserPnfl)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Ism</Label>
                          <Input
                            id="firstName"
                            placeholder="Ism"
                            value={newUserData.firstName}
                            onChange={(e) => setNewUserData({ ...newUserData, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Familiya</Label>
                          <Input
                            id="lastName"
                            placeholder="Familiya"
                            value={newUserData.lastName}
                            onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middleName">Otasining ismi</Label>
                        <Input
                          id="middleName"
                          placeholder="Otasining ismi"
                          value={newUserData.middleName}
                          onChange={(e) => setNewUserData({ ...newUserData, middleName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rol</Label>
                        <Select
                          value={newUserData.role}
                          onValueChange={(v) => setNewUserData({ ...newUserData, role: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Rol tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TUMAN_HOKIMI">Tuman hokimi</SelectItem>
                            <SelectItem value="HOKIMLIK_MASUL">{"Hokimlik mas'uli"}</SelectItem>
                            <SelectItem value="TASHKILOT_RAHBAR">Tashkilot rahbari</SelectItem>
                            <SelectItem value="TASHKILOT_MASUL">{"Tashkilot mas'uli"}</SelectItem>
                            <SelectItem value="ADMIN">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                        {newUserData.role && (
                          <p className="text-xs text-muted-foreground">
                            Kabinet:{" "}
                            {roleCabinet[newUserData.role as UserRole] === "HOKIMLIK"
                              ? "Hokimlik"
                              : roleCabinet[newUserData.role as UserRole] === "TASHKILOT"
                                ? "Tashkilot"
                                : "Admin"}
                          </p>
                        )}
                      </div>
                      {(newUserData.role === "TASHKILOT_RAHBAR" || newUserData.role === "TASHKILOT_MASUL") && (
                        <div className="space-y-2">
                          <Label>Tashkilot</Label>
                          <Select
                            value={newUserData.organizationId}
                            onValueChange={(v) => setNewUserData({ ...newUserData, organizationId: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tashkilot tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(orgsMap).map((org: any) => (
                                <SelectItem key={org.id} value={org.id}>
                                  {org.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="position">Lavozim</Label>
                        <Input
                          id="position"
                          placeholder="Lavozim nomi"
                          value={newUserData.position}
                          onChange={(e) => setNewUserData({ ...newUserData, position: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon (ixtiyoriy)</Label>
                        <Input
                          id="phone"
                          placeholder="+998 XX XXX XX XX"
                          value={newUserData.phone}
                          onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                        />
                      </div>
                      <Alert className="border-accent/30 bg-accent/5">
                        <UserCheck className="h-4 w-4 text-accent" />
                        <AlertDescription className="text-sm">
                          Foydalanuvchi qo'shilgandan so'ng, u OneID orqali birinchi marta kirganda avtomatik
                          faollashadi.
                        </AlertDescription>
                      </Alert>
                      <DialogFooter>
                        <Button variant="outline" onClick={resetCreateDialog}>
                          Bekor qilish
                        </Button>
                        <Button onClick={createUser}>{"Qo'shish"}</Button>
                      </DialogFooter>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </section>

            {/* Users Table */}
            <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md rounded-2xl">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-muted/20 transition-colors duration-300 bg-muted/10">
                        <TableHead className="text-foreground font-semibold px-6 py-4">Фойдаланувчи</TableHead>
                        <TableHead className="text-foreground font-semibold px-6 py-4">PNFL</TableHead>
                        <TableHead className="text-foreground font-semibold px-6 py-4">Кабинет</TableHead>
                        <TableHead className="text-foreground font-semibold px-6 py-4">Роль</TableHead>
                        <TableHead className="text-foreground font-semibold px-6 py-4">Ташкилот</TableHead>
                        <TableHead className="text-foreground font-semibold px-6 py-4">Ҳолат</TableHead>
                        <TableHead className="text-foreground font-semibold px-6 py-4">OneID</TableHead>
                        <TableHead className="text-foreground font-semibold px-6 py-4 w-[70px]">Амаллар</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user, index) => (
                        <TableRow key={user.id} className="border-border hover:bg-muted/10 transition-colors duration-300 group">
                          <TableCell className="px-6 py-4">
                            <Link href={`/dashboard/users/${user.id}`} className="flex items-center gap-4 hover:underline transition-colors duration-300">
                              <Avatar className="h-11 w-11 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-semibold group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                                  {user.firstName[0]}{user.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                  {user.lastName} {user.firstName}
                                </p>
                                <p className="text-sm text-muted-foreground">{user.position}</p>
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <code className="rounded-lg bg-muted/30 px-3 py-2 text-sm font-mono text-muted-foreground border border-border/50">
                              {maskPnfl(user.pnfl)}
                            </code>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={`font-normal border-border/50 ${
                                roleCabinet[user.role] === "HOKIMLIK"
                                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                                  : roleCabinet[user.role] === "ADMIN"
                                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                    : "bg-accent/10 text-accent hover:bg-accent/20"
                              } transition-colors duration-200`}
                            >
                              {roleCabinet[user.role] === "HOKIMLIK"
                                ? "Ҳокимлик"
                                : roleCabinet[user.role] === "ADMIN"
                                  ? "Админ"
                                  : "Ташкилот"}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge variant="secondary" className="font-normal bg-muted/20 text-foreground hover:bg-muted/30 transition-colors duration-200">
                              {roleLabels[user.role]}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="text-sm text-muted-foreground font-medium">
                              {user.organizationId ? orgsMap[user.organizationId]?.name ?? "—" : "—"}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <UserStatusBadge status={user.status} />
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {user.oneidConnected ? (
                              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 transition-colors duration-200">
                                <UserCheck className="mr-1 h-3 w-3" />
                                Уланган
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted/20 text-muted-foreground border-muted/50">
                                Кутимоқда
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted/20 hover:text-primary transition-all duration-300 rounded-lg">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl rounded-xl">
                                <Link href={`/dashboard/users/${user.id}`}>
                                  <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-lg">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Батафсил кўриш
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-lg">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Таҳрирлаш
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="hover:bg-amber/10 hover:text-amber-600 transition-all duration-300 rounded-lg">
                                  <Lock className="mr-2 h-4 w-4" />
                                  Блоклаш
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive hover:bg-destructive/10 transition-all duration-300 rounded-lg">
                                  <Archive className="mr-2 h-4 w-4" />
                                  Арxivлаш
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
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
    </>
  )
}
