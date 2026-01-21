"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Building2,
  Edit,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Star,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react"

import { getOrganizations } from "@/lib/api"
import { sectorLabels } from "@/lib/mock-data"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sectors = Object.entries(sectorLabels).map(([value, label]) => ({
  value,
  label,
}))

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
    getOrganizations().then(setOrganizations).catch(console.error)
  }, [])

  const handleCreateOrg = () => {
    console.log("Create:", newOrg)
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

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSector =
      sectorFilter === "all" || org.sector === sectorFilter
    return matchesSearch && matchesSector
  })

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Building2 className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Ташкилотлар</h1>
            <p className="text-muted-foreground">
              Барча ташкилотлар рўйхати
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-md p-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all"
              placeholder="Қидириш..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-[200px] bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
              <SelectValue placeholder="Соҳа" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
              <SelectItem value="all">Барча соҳалар</SelectItem>
              {sectors.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Create dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Янги ташкилот
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">Янги ташкилот</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Ташкилот маълумотларини киритинг
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Номи</Label>
                  <Input
                    className="bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all"
                    value={newOrg.name}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Соҳа</Label>
                  <Select
                    value={newOrg.sector}
                    onValueChange={(v) =>
                      setNewOrg({ ...newOrg, sector: v })
                    }
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
                      <SelectValue placeholder="Танланг" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                      {sectors.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Туман</Label>
                  <Input
                    className="bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all"
                    value={newOrg.region}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, region: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Директор</Label>
                  <Input
                    className="bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all"
                    value={newOrg.director}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, director: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label className="text-sm font-medium text-foreground">Манзил</Label>
                  <Input
                    className="bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all"
                    value={newOrg.address}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, address: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Телефон</Label>
                  <Input
                    className="bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all"
                    value={newOrg.phone}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Email</Label>
                  <Input
                    type="email"
                    className="bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all"
                    value={newOrg.email}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, email: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label className="text-sm font-medium text-foreground">Масъул шахс</Label>
                  <Input
                    className="bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all"
                    value={newOrg.contactPerson}
                    onChange={(e) =>
                      setNewOrg({
                        ...newOrg,
                        contactPerson: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Бекор қилиш
                </Button>
                <Button onClick={handleCreateOrg}>Қўшиш</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrganizations.map((org) => (
            <Card key={org.id} className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl group">
              <Link href={`/dashboard/organizations/${org.id}`}>
                <CardHeader className="cursor-pointer pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground group-hover:text-cyan-600 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    {org.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs bg-background/50 border-border/50">
                      {sectors.find((s) => s.value === org.sector)?.label || org.sector}
                    </Badge>
                    {org.isActive && (
                      <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                        Актив
                      </Badge>
                    )}
                  </div>
                </CardHeader>
              </Link>

              <CardContent className="space-y-4 pt-0">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {org.region}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {org.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {org.email}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {org.employeeCount || 0} ходим
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    {org.rating || 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Ижро: {org.performance || 0}%
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/20 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border-border/50">
                      <DropdownMenuItem className="hover:bg-muted/20 transition-colors">
                        <Edit className="mr-2 h-4 w-4" />
                        Таҳрирлаш
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Ўчириш
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
