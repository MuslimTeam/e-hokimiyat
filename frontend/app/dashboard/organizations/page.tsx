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
      <div className="min-h-screen bg-gray-50">
        
        <div className="relative z-10 p-6 space-y-8">
          {/* Header Section */}
          <section className="animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">🏢</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Ташкилотлар</h2>
                <p className="text-sm text-gray-500">Туман ташкилотлари ва уларнинг кўрсаткичлари</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:max-w-sm">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Ташкилот қидириш..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 bg-white border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-250"
                  />
                </div>
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-white border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-250">
                    <Layers className="mr-2 h-4 w-4 text-gray-400" />
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
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-250">
                    <Plus className="mr-2 h-4 w-4" />
                    Янги ташкилот
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] bg-white border border-gray-200 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900">Янги ташкилот яратиш</DialogTitle>
                    <DialogDescription>
                      Ташкилот маълумотларини киритинг
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Номи</Label>
                      <Input id="name" placeholder="Ташкилот номи" className="bg-white border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-250" />
                    </div>
                    <div className="space-y-2">
                      <Label>Сўҳа</Label>
                      <Select value={newOrgSector} onValueChange={setNewOrgSector}>
                        <SelectTrigger className="bg-white border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-250">
                          <SelectValue placeholder="Сўҳа танланг" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
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
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-250">
                      Бекор қилиш
                    </Button>
                    <Button onClick={() => setIsCreateOpen(false)} className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-250">Яратиш</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>

          {/* Organizations Grid */}
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
            {filteredOrgs.map((org, index) => (
              <Card key={org.id} className="bg-white border border-gray-200 rounded-xl shadow-sm group hover:border-emerald-300 hover:shadow-md transition-all duration-250" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900 group-hover:text-emerald-600 transition-colors duration-250">
                          {org.name}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1 border-gray-300 text-gray-700 bg-gray-50">
                          {sectorLabels[org.sector as Sector]}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-250">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                        <Link href={`/dashboard/organizations/${org.id}`}>
                          <DropdownMenuItem className="hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-250">
                            <Eye className="mr-2 h-4 w-4" />
                            Кўриш
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-250">
                          <Edit className="mr-2 h-4 w-4" />
                          Таҳрирлаш
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 hover:bg-red-50 transition-all duration-250">
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
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-emerald-600">
                        <TrendingUp className="h-5 w-5" />
                        {org.completionRate}%
                      </div>
                      <p className="text-xs text-gray-500">Ижро</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                        <ClipboardList className="h-5 w-5" />
                        {org.totalTasks}
                      </div>
                      <p className="text-xs text-gray-500">Топшириқ</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                        <Users className="h-5 w-5" />
                        {getUserCountByOrg(org.id)}
                      </div>
                      <p className="text-xs text-gray-500">Ходим</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Ижро кўрсаткичи</span>
                      <span className="font-medium text-gray-900">{org.completionRate}%</span>
                    </div>
                    <Progress 
                      value={org.completionRate} 
                      className="h-2 bg-gray-200"
                      style={{ 
                        background: `linear-gradient(90deg, ${org.completionRate > 70 ? '#10b981' : org.completionRate > 40 ? '#f59e0b' : '#ef4444'} ${org.completionRate}%, #e5e7eb ${org.completionRate}%)`
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      org.isActive ? "bg-emerald-600" : "bg-gray-400"
                    )} />
                    <span className="text-sm text-gray-600">
                      {org.isActive ? "Фаол" : "Фаол эмас"}
                    </span>
                  </div>
                </CardContent>
                
              </Card>
            ))}
          </section>
        </div>
      </div>
    </>
  )
}
