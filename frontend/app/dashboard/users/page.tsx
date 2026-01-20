"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Shield, Users, Building2, Phone, Mail, Calendar } from "lucide-react"
import { getUsers, getOrganizations } from "@/lib/api"
import { Header } from "@/components/layout/header"

const roles = [
  { value: "admin", label: "Администратор", color: "bg-red-500" },
  { value: "moderator", label: "Модератор", color: "bg-blue-500" },
  { value: "operator", label: "Оператор", color: "bg-green-500" },
  { value: "viewer", label: "Кўрувчи", color: "bg-gray-500" },
]

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  
  // Multi-step form states
  const [newUserPnfl, setNewUserPnfl] = useState("")
  const [newUserStep, setNewUserStep] = useState<"pnfl" | "loading" | "not_found" | "form">("pnfl")
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    role: "",
    organizationId: "",
    position: "",
    phone: "",
  })

  useEffect(() => {
    Promise.all([getUsers(), getOrganizations()])
      .then(([usersData, orgsData]) => {
        setUsers(usersData)
        setOrganizations(orgsData)
      })
      .catch(console.error)
  }, [])

  const handlePnflSearch = () => {
    if (!newUserPnfl || newUserPnfl.length !== 14) {
      return
    }

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
      <Header title="Фойдаланувчилар бошқаруви" description="Тизим фойдаланувчиларининг рўйхати, роллари ва бошқаруви" />
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 py-8">

            {/* Header Section */}
            <section className="animate-slide-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">👥</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Фойдаланувчилар</h1>
                  <p className="text-lg text-muted-foreground">Тизим фойдаланувчиларининг рўйхати ва бошқаруви</p>
                </div>
              </div>
              
              {/* Search and Filters */}
              <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-md p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Фойдаланувчини қидириш..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50"
                      />
                    </div>
                  </div>
                  
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px] bg-background/50 border-border/50">
                      <SelectValue placeholder="Роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Барча роллар</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                        <Plus className="mr-2 h-4 w-4" />
                        Янги фойдаланувчи
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background/95 backdrop-blur-xl border-border/50">
                      <DialogHeader>
                        <DialogTitle>Янги фойдаланувчи қўшиш</DialogTitle>
                        <DialogDescription>
                          OneID тизими орқали фойдаланувчини қидириш ва қўшиш
                        </DialogDescription>
                      </DialogHeader>
                      
                      {newUserStep === "pnfl" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="pnfl">ПНФЛ рақами</Label>
                            <Input
                              id="pnfl"
                              placeholder="14 хонали ПНФЛ рақамини киритинг"
                              value={newUserPnfl}
                              onChange={(e) => setNewUserPnfl(e.target.value.replace(/\D/g, ""))}
                              maxLength={14}
                              className="bg-background/50 border-border/50"
                            />
                          </div>
                          <Button 
                            onClick={handlePnflSearch}
                            disabled={newUserPnfl.length !== 14}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            Қидириш
                          </Button>
                        </div>
                      )}
                      
                      {newUserStep === "loading" && (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                          <p className="mt-4 text-muted-foreground">OneID тизимидан қидирилмоқда...</p>
                        </div>
                      )}
                      
                      {newUserStep === "not_found" && (
                        <div className="space-y-4">
                          <div className="text-center py-4">
                            <p className="text-muted-foreground">Фойдаланувчи OneID тизимида топилмади</p>
                            <p className="text-sm text-muted-foreground mt-2">Илтимос, ПНФЛ рақамини текшириб, қайта уриниб кўринг</p>
                          </div>
                          <Button 
                            onClick={() => setNewUserStep("pnfl")}
                            variant="outline"
                            className="w-full"
                          >
                            Қайта уриниш
                          </Button>
                        </div>
                      )}
                      
                      {newUserStep === "form" && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">Исм</Label>
                              <Input
                                id="firstName"
                                value={newUserData.firstName}
                                onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                                className="bg-background/50 border-border/50"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Фамилия</Label>
                              <Input
                                id="lastName"
                                value={newUserData.lastName}
                                onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                                className="bg-background/50 border-border/50"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="middleName">Шариф</Label>
                            <Input
                              id="middleName"
                              value={newUserData.middleName}
                              onChange={(e) => setNewUserData({...newUserData, middleName: e.target.value})}
                              className="bg-background/50 border-border/50"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="role">Роль</Label>
                            <Select value={newUserData.role} onValueChange={(value) => setNewUserData({...newUserData, role: value})}>
                              <SelectTrigger className="bg-background/50 border-border/50">
                                <SelectValue placeholder="Рольни танланг" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="organization">Ташкилот</Label>
                            <Select value={newUserData.organizationId} onValueChange={(value) => setNewUserData({...newUserData, organizationId: value})}>
                              <SelectTrigger className="bg-background/50 border-border/50">
                                <SelectValue placeholder="Ташкилотни танланг" />
                              </SelectTrigger>
                              <SelectContent>
                                {organizations.map((org) => (
                                  <SelectItem key={org.id} value={org.id}>
                                    {org.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="position">Лавозим</Label>
                            <Input
                              id="position"
                              value={newUserData.position}
                              onChange={(e) => setNewUserData({...newUserData, position: e.target.value})}
                              className="bg-background/50 border-border/50"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="phone">Телефон</Label>
                            <Input
                              id="phone"
                              value={newUserData.phone}
                              onChange={(e) => setNewUserData({...newUserData, phone: e.target.value})}
                              className="bg-background/50 border-border/50"
                            />
                          </div>
                        </div>
                      )}
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={resetCreateDialog}>
                          Бекор қилиш
                        </Button>
                        {newUserStep === "form" && (
                          <Button onClick={createUser} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            Қўшиш
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </section>

            {/* Users Table */}
            <section className="animate-slide-up">
              <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Фойдаланувчилар рўйхати
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Фойдаланувчи</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Ташкилот</TableHead>
                        <TableHead>Лавозим</TableHead>
                        <TableHead>Телефон</TableHead>
                        <TableHead className="text-right">Ҳаракатлар</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => {
                        const role = roles.find(r => r.value === user.role)
                        const org = organizations.find(o => o.id === user.organizationId)
                        
                        return (
                          <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${role?.color} text-white`}>
                                <Shield className="mr-1 h-3 w-3" />
                                {role?.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                {org?.name || "Номаълум"}
                              </div>
                            </TableCell>
                            <TableCell>{user.position}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                {user.phone}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted/20">
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
                            </TableCell>
                          </TableRow>
                        )
                      })}
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
