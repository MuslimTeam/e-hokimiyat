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
        <div className="flex flex-wrap gap-4 bg-card p-6 rounded-2xl border">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Қидириш..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Соҳа" />
            </SelectTrigger>
            <SelectContent>
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
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Янги ташкилот
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Янги ташкилот</DialogTitle>
                <DialogDescription>
                  Ташкилот маълумотларини киритинг
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Номи</Label>
                  <Input
                    value={newOrg.name}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Соҳа</Label>
                  <Select
                    value={newOrg.sector}
                    onValueChange={(v) =>
                      setNewOrg({ ...newOrg, sector: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Танланг" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Туман</Label>
                  <Input
                    value={newOrg.region}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, region: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Директор</Label>
                  <Input
                    value={newOrg.director}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, director: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <Label>Манзил</Label>
                  <Input
                    value={newOrg.address}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, address: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Телефон</Label>
                  <Input
                    value={newOrg.phone}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newOrg.email}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, email: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <Label>Масъул шахс</Label>
                  <Input
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
            <Card key={org.id} className="hover:shadow-lg transition">
              <Link href={`/dashboard/organizations/${org.id}`}>
                <CardHeader className="cursor-pointer">
                  <CardTitle className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-cyan-600" />
                    {org.name}
                  </CardTitle>
                </CardHeader>
              </Link>

              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4" />
                    {org.region}
                  </div>
                  <div className="flex gap-2">
                    <Phone className="h-4 w-4" />
                    {org.phone}
                  </div>
                  <div className="flex gap-2">
                    <Mail className="h-4 w-4" />
                    {org.email}
                  </div>
                </div>

                <div className="flex justify-between pt-2 border-t">
                  <span className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    {org.employeeCount || 0}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    {org.rating || 0}%
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  Ижро: {org.performance || 0}%
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Таҳрирлаш
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Ўчириш
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
