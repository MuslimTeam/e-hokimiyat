"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  roleLabels,
  type UserRole,
} from "@/lib/mock-data"
import { getUserById, getTasks, getAuditLogs, getOrganizations } from "@/lib/api"
import { UserStatusBadge } from "@/components/ui/status-badge"
import {
  ArrowLeft,
  Building2,
  Phone,
  Calendar,
  Shield,
  Edit,
  Lock,
  Unlock,
  Archive,
  UserCheck,
  ClipboardList,
  History,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"

export default function UserDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [isEditOpen, setIsEditOpen] = useState(false)

  const [user, setUser] = useState<any | null>(null)
  const [organization, setOrganization] = useState<any | null>(null)
  const [userTasks, setUserTasks] = useState<any[]>([])
  const [userAuditLogs, setUserAuditLogs] = useState<any[]>([])
  const [allOrgs, setAllOrgs] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    Promise.all([getUserById(id), getTasks(), getAuditLogs(), getOrganizations()])
      .then(([u, tasks, audits, orgs]) => {
        if (!mounted) return
        setUser(u)
        setUserTasks(tasks.filter((t: any) => (t.organizations || []).some((orgId: string) => orgId === u.organizationId) || t.createdBy === u.id))
        setUserAuditLogs(audits.filter((log: any) => log.userId === u.id || log.targetId === u.id))
        setAllOrgs(orgs)
        setOrganization(orgs.find((o: any) => o.id === u.organizationId) || null)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [id])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) {
    return (
      <>
        <Header title="Foydalanuvchi ma'lumotlari" />
        <div className="p-6">Yuklanmoqda...</div>
      </>
    )
  }

  const canBlock = user.status === "FAOL" && user.role !== "HOKIM"
  const canUnblock = user.status === "BLOKLANGAN"
  const canArchive = user.status !== "ARXIV" && user.role !== "HOKIM"

  return (
    <>
      <Header title="Foydalanuvchi ma'lumotlari" />
      <div className="p-6 space-y-6">
        {/* Back button and actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/dashboard/users">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Orqaga
            </Button>
          </Link>

          <div className="flex flex-wrap gap-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Tahrirlash
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Foydalanuvchini tahrirlash</DialogTitle>
                  <DialogDescription>{"Foydalanuvchi ma'lumotlarini yangilang"}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ism</Label>
                      <Input defaultValue={user.firstName} />
                    </div>
                    <div className="space-y-2">
                      <Label>Familiya</Label>
                      <Input defaultValue={user.lastName} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Otasining ismi</Label>
                    <Input defaultValue={user.middleName} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <Input defaultValue={user.phone || ""} placeholder="+998 XX XXX XX XX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Lavozim</Label>
                    <Input defaultValue={user.position} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rol</Label>
                    <Select defaultValue={user.role || "USER"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                          <SelectItem key={role} value={role} disabled={role === "HOKIM"}>
                            {roleLabels[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tashkilot</Label>
                    <Select defaultValue={user.organizationId || "NO_ORGANIZATION"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tashkilot tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NO_ORGANIZATION">Tashkilot yo'q</SelectItem>
                        {allOrgs.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button onClick={() => setIsEditOpen(false)}>Saqlash</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {canBlock && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-orange-500 border-orange-500/30 hover:bg-orange-500/10 bg-transparent"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Bloklash
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Foydalanuvchini bloklash</AlertDialogTitle>
                    <AlertDialogDescription>
                      {user.lastName} {user.firstName} ni bloklashni xohlaysizmi? Bloklangan foydalanuvchi tizimga kira
                      olmaydi.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                    <AlertDialogAction className="bg-orange-500 hover:bg-orange-600">Bloklash</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {canUnblock && (
              <Button variant="outline" className="text-accent border-accent/30 hover:bg-accent/10 bg-transparent">
                <Unlock className="mr-2 h-4 w-4" />
                Blokdan chiqarish
              </Button>
            )}

            {canArchive && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Arxivlash
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Foydalanuvchini arxivlash</AlertDialogTitle>
                    <AlertDialogDescription>
                      {user.lastName} {user.firstName} ni arxivlashni xohlaysizmi? Arxivlangan foydalanuvchini qayta
                      faollashtirish mumkin emas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90">Arxivlash</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Info Card */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-foreground">
                  {user.lastName} {user.firstName} {user.middleName}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{user.position}</p>
                <div className="flex items-center gap-2 mt-3">
                  <UserStatusBadge status={user.status} />
                  <Badge variant="secondary">{roleLabels[user.role]}</Badge>
                </div>

                {user.oneidConnected ? (
                  <Badge variant="outline" className="mt-3 bg-accent/10 text-accent border-accent/30">
                    <UserCheck className="mr-1 h-3 w-3" />
                    OneID ulangan
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-3 bg-muted text-muted-foreground">
                    OneID kutilmoqda
                  </Badge>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">PNFL</p>
                    <p className="font-mono font-medium">***{user.pnfl.slice(-4)}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Telefon</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}

                {organization && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tashkilot</p>
                      <p className="font-medium">{organization.name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Qo'shilgan sana</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                {user.activatedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Faollashgan sana</p>
                      <p className="font-medium">{formatDate(user.activatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tasks and Activity */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <Tabs defaultValue="tasks" className="w-full">
                <CardHeader className="border-b border-border pb-0">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tasks" className="gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Topshiriqlar
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2">
                      <History className="h-4 w-4" />
                      Faoliyat tarixi
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <TabsContent value="tasks" className="m-0">
                  <CardContent className="p-0">
                    {userTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <ClipboardList className="h-12 w-12 mb-4 opacity-20" />
                        <p>Topshiriqlar yo'q</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {userTasks.slice(0, 5).map((task) => (
                          <Link
                            key={task.id}
                            href={`/dashboard/tasks/${task.id}`}
                            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium text-foreground">{task.title}</p>
                              <p className="text-sm text-muted-foreground">Muddat: {formatDate(task.deadline)}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                task.status === "BAJARILDI" && "bg-green-500/10 text-green-500 border-green-500/30",
                                task.status === "IJRODA" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
                                task.status === "MUDDATI_KECH" && "bg-red-500/10 text-red-500 border-red-500/30",
                              )}
                            >
                              {task.status.replace(/_/g, " ")}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </TabsContent>
                <TabsContent value="activity" className="m-0">
                  <CardContent className="p-4">
                    {userAuditLogs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <History className="h-12 w-12 mb-4 opacity-20" />
                        <p>Faoliyat tarixi yo'q</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userAuditLogs.map((log) => (
                          <div key={log.id} className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <History className="h-4 w-4 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground">{log.action.replace(/_/g, " ")}</p>
                              <p className="text-sm text-muted-foreground">{log.details}</p>
                              <p className="text-xs text-muted-foreground">{formatDateTime(log.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
