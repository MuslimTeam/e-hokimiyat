"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Building2, MapPin, Phone, Mail, Star, TrendingUp, Users } from "lucide-react"
import { getOrganizations } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { sectorLabels } from "@/lib/mock-data"

const sectors = Object.entries(sectorLabels).map(([value, label]) => ({ value, label }))

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newOrg, setNewOrg] = useState({
    name: "",
    sector: "",
    region: "",
    address: "",
    phone: "",
    email: "",
    director: "",
    contactPerson: "",
  })

  useEffect(() => {
    getOrganizations()
      .then(setOrganizations)
      .catch(console.error)
  }, [])

  const handleCreateOrg = () => {
    // In real app, this would call API
    console.log("Creating organization:", newOrg)
    setIsCreateOpen(false)
    setNewOrg({
      name: "",
      sector: "",
      region: "",
      address: "",
      phone: "",
      email: "",
      director: "",
      contactPerson: "",
    })
  }

  return (
    <>
      <Header title="Ташкилотлар бошқаруви" description="Тумандаги барча ташкилотларнинг рўйхати, маълумотлари ва бошқаруви" />
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 py-8">

            {/* Header Section */}
            <section className="animate-slide-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">🏢</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Ташкилотлар</h1>
                  <p className="text-lg text-muted-foreground">Тумандаги барча ташкилотларнинг рўйхати ва бошқаруви</p>
                </div>
              </div>
              
              {/* Search and Filters */}
              <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-md p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Ташкилотни қидириш..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50"
                      />
                    </div>
                  </div>
                  
                  <Select value={sectorFilter} onValueChange={setSectorFilter}>
                    <SelectTrigger className="w-[180px] bg-background/50 border-border/50">
                      <SelectValue placeholder="Соҳа" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Барча соҳалар</SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.value} value={sector.value}>
                          {sector.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg">
                        <Plus className="mr-2 h-4 w-4" />
                        Янги ташкилот
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background/95 backdrop-blur-xl border-border/50 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Янги ташкилот қўшиш</DialogTitle>
                        <DialogDescription>
                          Янги ташкилот маълумотларини киритинг
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Ташкилот номи</Label>
                          <Input
                            id="name"
                            value={newOrg.name}
                            onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="sector">Соҳа</Label>
                          <Select value={newOrg.sector} onValueChange={(value) => setNewOrg({...newOrg, sector: value})}>
                            <SelectTrigger className="bg-background/50 border-border/50">
                              <SelectValue placeholder="Соҳани танланг" />
                            </SelectTrigger>
                            <SelectContent>
                              {sectors.map((sector) => (
                                <SelectItem key={sector.value} value={sector.value}>
                                  {sector.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="region">Туман/Шаҳар</Label>
                          <Input
                            id="region"
                            value={newOrg.region}
                            onChange={(e) => setNewOrg({...newOrg, region: e.target.value})}
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="director">Директор</Label>
                          <Input
                            id="director"
                            value={newOrg.director}
                            onChange={(e) => setNewOrg({...newOrg, director: e.target.value})}
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Label htmlFor="address">Манзил</Label>
                          <Input
                            id="address"
                            value={newOrg.address}
                            onChange={(e) => setNewOrg({...newOrg, address: e.target.value})}
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Телефон</Label>
                          <Input
                            id="phone"
                            value={newOrg.phone}
                            onChange={(e) => setNewOrg({...newOrg, phone: e.target.value})}
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newOrg.email}
                            onChange={(e) => setNewOrg({...newOrg, email: e.target.value})}
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Label htmlFor="contactPerson">Масъул шахс</Label>
                          <Input
                            id="contactPerson"
                            value={newOrg.contactPerson}
                            onChange={(e) => setNewOrg({...newOrg, contactPerson: e.target.value})}
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                          Бекор қилиш
                        </Button>
                        <Button onClick={handleCreateOrg} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                          Қўшиш
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </section>

            {/* Organizations Grid */}
            <section className="animate-slide-up">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {organizations.map((org, index) => (
                  <Card key={org.id} className="bg-card/80 backdrop-blur-xl border border-border shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-cyan-600 transition-colors">
                              {org.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {sectors.find(s => s.value === org.sector)?.label || org.sector}
                              </Badge>
                              {org.isActive && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  Актив
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/20">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border-border/50">
                            <DropdownMenuItem className="hover:bg-muted/20">
                              <Edit className="mr-2 h-4 w-4" />
                              Таҳрирлаш
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Ўчириш
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{org.region}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{org.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{org.email}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {org.employeeCount || 0} ходим
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-foreground">
                            {org.rating || 0}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          Ижро кўрсаткичи: {org.performance || 0}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
