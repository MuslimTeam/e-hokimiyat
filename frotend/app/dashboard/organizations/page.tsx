"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sectorLabels, type Sector } from "@/lib/mock-data"
import { getOrganizations, getUsers } from "@/lib/api"
import {
  Plus,
  Search,
  Building2,
  Users,
  ClipboardList,
  TrendingUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Layers,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import Link from "next/link"

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const [newOrgSector, setNewOrgSector] = useState<string>("")
  const [orgs, setOrgs] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  const filteredOrgs = orgs.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSector = sectorFilter === "all" || org.sector === sectorFilter
    return matchesSearch && matchesSector
  })

  const getUserCountByOrg = (orgId: string) => {
    return users.filter((user) => user.organizationId === orgId).length
  }

  useEffect(() => {
    let mounted = true
    Promise.all([getOrganizations(), getUsers()])
      .then(([orgsList, usersList]) => {
        if (!mounted) return
        setOrgs(orgsList)
        setUsers(usersList)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      <Header title="Tashkilotlar" description="Tuman tashkilotlari va ularning ko'rsatkichlari" />
      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tashkilot qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary"
              />
            </div>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-secondary">
                <Layers className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Soha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha sohalar</SelectItem>
                {(Object.keys(sectorLabels) as Sector[]).map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sectorLabels[sector]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Yangi tashkilot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yangi tashkilot yaratish</DialogTitle>
                <DialogDescription>{"Yangi tashkilot ma'lumotlarini kiriting"}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Tashkilot nomi</Label>
                  <Input id="orgName" placeholder="Tashkilot nomi" />
                </div>
                <div className="space-y-2">
                  <Label>Soha</Label>
                  <Select value={newOrgSector} onValueChange={setNewOrgSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="Soha tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(sectorLabels) as Sector[]).map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sectorLabels[sector]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Bekor qilish
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>Yaratish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Organizations Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrgs.map((org) => (
            <Card key={org.id} className="bg-card border-border">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">{org.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs font-normal">
                        {sectorLabels[org.sector]}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          org.isActive ? "bg-accent/10 text-accent border-accent/30" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {org.isActive ? "Faol" : "Nofaol"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/dashboard/organizations/${org.id}`}>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ko'rish
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Tahrirlash
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {"O'chirish"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{getUserCountByOrg(org.id)}</p>
                    <p className="text-xs text-muted-foreground">Xodimlar</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{org.tasksCount}</p>
                    <p className="text-xs text-muted-foreground">Topshiriqlar</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <p
                      className={cn(
                        "text-2xl font-bold",
                        org.rating >= 90 ? "text-accent" : org.rating >= 70 ? "text-warning" : "text-destructive",
                      )}
                    >
                      {org.rating}%
                    </p>
                    <p className="text-xs text-muted-foreground">Reyting</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ijro darajasi</span>
                    <span className="font-medium text-foreground">
                      {org.completedTasks}/{org.tasksCount}
                    </span>
                  </div>
                  <Progress value={(org.completedTasks / org.tasksCount) * 100} className="h-2" />
                </div>

                <Link href={`/dashboard/organizations/${org.id}`}>
                  <Button variant="outline" className="w-full mt-2 bg-transparent">
                    Batafsil ko'rish
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
