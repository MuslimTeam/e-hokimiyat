"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  Calendar, 
  MoreHorizontal,
  Eye,
  Archive
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getAppeals } from "@/lib/api"

export default function AppealsPage() {
  const [appeals, setAppeals] = useState<any[]>([])
  const [stats, setStats] = useState<any>({ total: 0, pending: 0, inProgress: 0, resolved: 0 })
  const [options, setOptions] = useState<any>({ status: {}, priority: {}, category: {}, districts: [] })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [districtFilter, setDistrictFilter] = useState("all")
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadAppeals()
  }, [searchQuery, statusFilter, categoryFilter, priorityFilter, districtFilter])

  const loadData = async () => {
    try {
      // Mock stats and options data
      const mockStats = { total: 0, pending: 0, inProgress: 0, resolved: 0 }
      const mockOptions = { status: {}, priority: {}, category: {}, districts: [] }
      setStats(mockStats)
      setOptions(mockOptions)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAppeals = async () => {
    try {
      const data = await getAppeals()
      setAppeals(data || [])
    } catch (error) {
      console.error('Failed to load appeals:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "KUTILMOQDA":
        return <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      case "JARAYONDA":
        return <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      case "HAL_ETILGAN":
        return <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      default:
        return <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
    }
  }

  const statusColors = {
    KUTILMOQDA: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
    JARAYONDA: "bg-blue-500/20 text-blue-600 border-blue-500/30",
    HAL_ETILGAN: "bg-green-500/20 text-green-600 border-green-500/30"
  }

  const priorityColors = {
    PAST: "bg-gray-500/20 text-gray-600 border-gray-500/30",
    ORTA: "bg-orange-500/20 text-orange-600 border-orange-500/30",
    YUQORI: "bg-red-500/20 text-red-600 border-red-500/30"
  }

  return (
    <>
      <Header title="Мурожаатлар" description="Фуқаролар мурожаатлари бошқаруви тизими" />
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-purple-500/10 rounded-full animate-float" />
          <div className="absolute top-20 right-16 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-blue-500/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-16 left-20 w-10 h-10 sm:w-12 sm:h-12 lg:w-20 lg:h-20 bg-pink-500/10 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        </div>
        
        <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Stats Cards */}
          <section className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 animate-slide-up">
            <Card className="card-modern">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center animate-pulse-modern">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{stats.total}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Жами мурожаатлар</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center animate-pulse-modern">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{stats.pending}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Кутилмоқда</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center animate-pulse-modern">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{stats.inProgress}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Жараёнда</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center animate-pulse-modern">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{stats.resolved}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Ҳал этилган</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Filters */}
          <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-md p-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Мурожаатни қидириш..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
                    <SelectValue placeholder="Ҳолат" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                    <SelectItem value="all">Барча ҳолатлар</SelectItem>
                    {Object.entries(options.status || {}).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{String(label)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px] bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
                    <SelectValue placeholder="Туркум" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                    <SelectItem value="all">Барча туркумлар</SelectItem>
                    {Object.entries(options.category || {}).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{String(label)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px] bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
                    <SelectValue placeholder="Устуворлик" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                    <SelectItem value="all">Барча устуворликлар</SelectItem>
                    {Object.entries(options.priority || {}).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{String(label)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={districtFilter} onValueChange={setDistrictFilter}>
                  <SelectTrigger className="w-[180px] bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
                    <SelectValue placeholder="Туман" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                    <SelectItem value="all">Барча туманлар</SelectItem>
                    {(options.districts || []).map((district: any) => (
                      <SelectItem key={district.id} value={district.id}>{district.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Appeals Table */}
          <section className="animate-slide-up" style={{ animationDelay: "400ms" }}>
            <Card className="card-modern">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Сарлавҳа</TableHead>
                      <TableHead className="text-muted-foreground">Аризачи</TableHead>
                      <TableHead className="text-muted-foreground">Туркум</TableHead>
                      <TableHead className="text-muted-foreground">Ҳолат</TableHead>
                      <TableHead className="text-muted-foreground">Устуворлик</TableHead>
                      <TableHead className="text-muted-foreground">Сана</TableHead>
                      <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appeals.map((appeal) => (
                      <TableRow key={appeal.id} className="border-white/10 hover:bg-white/5 transition-colors duration-200">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{appeal.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{appeal.content}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span>{appeal.applicant}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-white/20">
                            {String(options.category[appeal.category])}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("border", statusColors[appeal.status])}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(appeal.status)}
                              {String(options.status[appeal.status])}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("border", priorityColors[appeal.priority])}>
                            {String(options.priority[appeal.priority])}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            {new Date(appeal.createdAt).toLocaleDateString('en-GB')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                                <MoreHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass">
                              <DropdownMenuItem className="hover:bg-white/10" onClick={() => setSelectedAppeal(appeal)}>
                                <Eye className="mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                Кўриш
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-white/10">
                                <Archive className="mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                Архивлаш
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

          {/* Appeal Detail Modal */}
          {selectedAppeal && (
            <Dialog open={!!selectedAppeal} onOpenChange={() => setSelectedAppeal(null)}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-foreground">{selectedAppeal.title}</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Мурожаат тафсилотлари
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Applicant Info */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Аризачи маълумотлари</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">ФИО</p>
                        <p className="font-medium text-foreground">{selectedAppeal.applicant}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Телефон</p>
                        <p className="font-medium text-foreground">{selectedAppeal.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{selectedAppeal.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Туман</p>
                        <p className="font-medium text-foreground">{(options.districts || []).find(d => d.id === selectedAppeal.district)?.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Appeal Content */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Мурожаат матни</h4>
                    <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg border border-border/50">
                      {selectedAppeal.content}
                    </p>
                  </div>

                  {/* Appeal Details */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Мурожаат тафсилотлари</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Туркум</p>
                        <Badge variant="outline" className="border-border/50 bg-background/50">
                          {String(options.category[selectedAppeal.category])}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Ҳолат</p>
                        <Badge className={cn("border", statusColors[selectedAppeal.status])}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(selectedAppeal.status)}
                            {String(options.status[selectedAppeal.status])}
                          </div>
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Устуворлик</p>
                        <Badge className={cn("border", priorityColors[selectedAppeal.priority])}>
                          {String(options.priority[selectedAppeal.priority])}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Response */}
                  {selectedAppeal.response && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Жавоб</h4>
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm leading-relaxed">{selectedAppeal.response}</p>
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Саналар</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Яратилган сана</p>
                        <p className="font-medium">{new Date(selectedAppeal.createdAt).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Масъул бўлим</p>
                        <p className="font-medium">{selectedAppeal.department}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedAppeal(null)}>
                    Ёпиш
                  </Button>
                  {selectedAppeal.status === 'KUTILMOQDA' && (
                    <Button>
                      Жавоб бериш
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </>
  )
}
