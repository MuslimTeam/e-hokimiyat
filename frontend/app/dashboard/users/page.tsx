"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { roleLabels, statusLabels, maskPnfl, roleCabinet, type UserRole, type UserStatus } from "@/lib/mock-data"
import { getUsers, getOrganizations } from "@/lib/api"
import { UserStatusBadge } from "@/components/ui/status-badge"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function UsersPage() {
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
      <Header title="Foydalanuvchilar" description="Tizim foydalanuvchilari va ularning huquqlari" />
      <div className="p-6 space-y-6">
        {/* Filters and Actions */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center flex-wrap">
                <div className="relative flex-1 md:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Foydalanuvchi qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary"
                  />
                </div>
                <Select value={cabinetFilter} onValueChange={setCabinetFilter}>
                  <SelectTrigger className="w-full md:w-[160px] bg-secondary">
                    <Building className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Kabinet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha kabinetlar</SelectItem>
                    <SelectItem value="HOKIMLIK">Hokimlik</SelectItem>
                    <SelectItem value="TASHKILOT">Tashkilot</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-secondary">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha rollar</SelectItem>
                    {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                      <SelectItem key={role} value={role}>
                        {roleLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[160px] bg-secondary">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha statuslar</SelectItem>
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
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Yangi foydalanuvchi
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

        {/* Users Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Foydalanuvchi</TableHead>
                  <TableHead className="text-muted-foreground">PNFL</TableHead>
                  <TableHead className="text-muted-foreground">Kabinet</TableHead>
                  <TableHead className="text-muted-foreground">Rol</TableHead>
                  <TableHead className="text-muted-foreground">Tashkilot</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">OneID</TableHead>
                  <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-border">
                    <TableCell>
                      <Link href={`/dashboard/users/${user.id}`} className="flex items-center gap-3 hover:underline">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.lastName} {user.firstName}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.position}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 text-sm font-mono">{maskPnfl(user.pnfl)}</code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-normal ${
                          roleCabinet[user.role] === "HOKIMLIK"
                            ? "bg-primary/10 text-primary border-primary/30"
                            : roleCabinet[user.role] === "ADMIN"
                              ? "bg-destructive/10 text-destructive border-destructive/30"
                              : "bg-accent/10 text-accent border-accent/30"
                        }`}
                      >
                        {roleCabinet[user.role] === "HOKIMLIK"
                          ? "Hokimlik"
                          : roleCabinet[user.role] === "ADMIN"
                            ? "Admin"
                            : "Tashkilot"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.organizationId ? orgsMap[user.organizationId]?.name ?? "—" : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <UserStatusBadge status={user.status} />
                    </TableCell>
                    <TableCell>
                      {user.oneidConnected ? (
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                          <UserCheck className="mr-1 h-3 w-3" />
                          Ulangan
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          Kutilmoqda
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/dashboard/users/${user.id}`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {"Ko'rish"}
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Tahrirlash
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Lock className="mr-2 h-4 w-4" />
                            Bloklash
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Archive className="mr-2 h-4 w-4" />
                            Arxivlash
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
      </div>
    </>
  )
}
