"use client"

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full animate-float" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-32 left-40 w-20 h-20 bg-pink-500/10 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        </div>
        
        <div className="relative z-10 p-6 space-y-8">
          {/* Header Section */}
          <section className="animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-modern shadow-lg">
                <span className="text-white font-bold text-lg">🏢</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient-animated">Ташкилотлар</h2>
                <p className="text-sm text-muted-foreground">Туман ташкилотлари ва уларнинг кўрсаткичлари</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:max-w-sm">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Ташкилот қидириш..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-modern pl-12"
                  />
                </div>
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="w-full sm:w-[200px] input-modern">
                    <Layers className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Сўҳа" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="all">Барча сўҳалар</SelectItem>
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
                  <Button className="btn-modern">
                    <Plus className="mr-2 h-4 w-4" />
                    Янги ташкилот
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] glass">
                  <DialogHeader>
                    <DialogTitle className="text-gradient-animated">Янги ташкилот яратиш</DialogTitle>
                    <DialogDescription>
                      Ташкилот маълумотларини киритинг
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Номи</Label>
                      <Input id="name" placeholder="Ташкилот номи" className="input-modern" />
                    </div>
                    <div className="space-y-2">
                      <Label>Сўҳа</Label>
                      <Select value={newOrgSector} onValueChange={setNewOrgSector}>
                        <SelectTrigger className="input-modern">
                          <SelectValue placeholder="Сўҳа танланг" />
                        </SelectTrigger>
                        <SelectContent className="glass">
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
                      Бекор қилиш
                    </Button>
                    <Button onClick={() => setIsCreateOpen(false)}>Яратиш</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>

          {/* Organizations Grid */}
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
            {filteredOrgs.map((org, index) => (
              <Card key={org.id} className="card-modern group hover-lift" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse-modern shadow-lg">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                          {org.name}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1 border-white/20">
                          {sectorLabels[org.sector as Sector]}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        <Link href={`/dashboard/organizations/${org.id}`}>
                          <DropdownMenuItem className="hover:bg-white/10">
                            <Eye className="mr-2 h-4 w-4" />
                            Кўриш
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="hover:bg-white/10">
                          <Edit className="mr-2 h-4 w-4" />
                          Таҳрирлаш
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Ўчириш
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gradient-animated">
                        <TrendingUp className="h-5 w-5" />
                        {org.completionRate}%
                      </div>
                      <p className="text-xs text-muted-foreground">Ижро</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                        <ClipboardList className="h-5 w-5" />
                        {org.totalTasks}
                      </div>
                      <p className="text-xs text-muted-foreground">Топшириқ</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                        <Users className="h-5 w-5" />
                        {getUserCountByOrg(org.id)}
                      </div>
                      <p className="text-xs text-muted-foreground">Ходим</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ижро кўрсаткичи</span>
                      <span className="font-medium text-foreground">{org.completionRate}%</span>
                    </div>
                    <Progress 
                      value={org.completionRate} 
                      className="h-2 bg-white/20"
                      style={{ 
                        background: `linear-gradient(90deg, ${org.completionRate > 70 ? '#10b981' : org.completionRate > 40 ? '#f59e0b' : '#ef4444'} ${org.completionRate}%, rgba(255,255,255,0.2) ${org.completionRate}%)`
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-pulse-modern",
                      org.isActive ? "bg-green-500" : "bg-gray-400"
                    )} />
                    <span className="text-sm text-muted-foreground">
                      {org.isActive ? "Фаол" : "Фаол эмас"}
                    </span>
                  </div>
                </CardContent>
                
                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </Card>
            ))}
          </section>
        </div>
      </div>
    </>
  )
}
