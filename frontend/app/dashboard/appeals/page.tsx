"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// Mock data for appeals
const mockAppeals = [
  {
    id: "1",
    title: "Иш сўрови ҳақида",
    content: "Мен туман ҳокимлигидан иш сўравини олмоқчиман. Керакли ҳужжатлар рўйхати қайердан олиш мумкин?",
    applicant: "Абдулла Каримов",
    email: "abdulla.karimov@email.com",
    phone: "+998901234567",
    status: "pending" as const,
    priority: "medium" as const,
    category: "employment" as const,
    createdAt: "2024-01-15T10:30:00Z",
    response: null,
    department: "Иш билан таъминлаш бўлими",
    district: "1"
  },
  {
    id: "2",
    title: "Таълит сифати тўғрисида",
    content: "Мактабда таълим сифати пасаётган борми? Бу ҳақда қандай чора кўрилади?",
    applicant: "Зарина Тошматова",
    email: "zarina.toshmatova@email.com",
    phone: "+998902345678",
    status: "in_progress" as const,
    priority: "high" as const,
    category: "education" as const,
    createdAt: "2024-01-14T14:20:00Z",
    response: null,
    department: "Таълим бўлими",
    district: "2"
  },
  {
    id: "3",
    title: "Йўл ҳолати",
    content: "Маҳалламизда йўл ҳолати ёмон, тозаланмаган. Илтимос ёрдам беринг.",
    applicant: "Бекзод Раҳимов",
    email: "bekzod.rahimov@email.com",
    phone: "+998903456789",
    status: "resolved" as const,
    priority: "low" as const,
    category: "infrastructure" as const,
    createdAt: "2024-01-13T09:15:00Z",
    response: "Сизнинг мурожаатингиз қабул қилинди. Йўл тозаланиши ишлари бошланди.",
    department: "Коммуналь хизматлар бўлими",
    district: "1"
  },
  {
    id: "4",
    title: "Тибий ёрдам",
    content: "Маҳалламизда тибий ёрдам кўрсатиш муаммолари бор. Шошлич ёрдам керак.",
    applicant: "Дилноза Азимова",
    email: "dilnoza.azimova@email.com",
    phone: "+998904567890",
    status: "pending" as const,
    priority: "high" as const,
    category: "health" as const,
    createdAt: "2024-01-12T16:45:00Z",
    response: null,
    department: "Соғлиқни сақлаш бўлими",
    district: "3"
  }
]

const statusLabels = {
  pending: "Кутилмоқда",
  in_progress: "Жараёнда",
  resolved: "Ҳал этилган"
}

const priorityLabels = {
  low: "Паст",
  medium: "Ўрта",
  high: "Юқори"
}

const categoryLabels = {
  employment: "Иш билан таъминлаш",
  education: "Таълим",
  infrastructure: "Инфраструктура",
  health: "Соғлиқни сақлаш",
  social: "Ижтимоий",
  utilities: "Коммуналь хизматлар",
  other: "Бошқа"
}

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  in_progress: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  resolved: "bg-green-500/20 text-green-600 border-green-500/30"
}

const priorityColors = {
  low: "bg-gray-500/20 text-gray-600 border-gray-500/30",
  medium: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  high: "bg-red-500/20 text-red-600 border-red-500/30"
}

const districts = [
  { id: "1", name: "Тошкент шаҳри" },
  { id: "2", name: "Самарқанд вилояти" },
  { id: "3", name: "Бухоро вилояти" }
]

export default function AppealsPage() {
  const [appeals, setAppeals] = useState(mockAppeals)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [districtFilter, setDistrictFilter] = useState("all")
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null)

  const filteredAppeals = appeals.filter(appeal => {
    const matchesSearch = appeal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appeal.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appeal.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || appeal.status === statusFilter
    const matchesCategory = categoryFilter === "all" || appeal.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || appeal.priority === priorityFilter
    const matchesDistrict = districtFilter === "all" || appeal.district === districtFilter
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesDistrict
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Calendar className="h-4 w-4" />
      case "in_progress":
        return <MessageSquare className="h-4 w-4" />
      case "resolved":
        return <Eye className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const stats = {
    total: appeals.length,
    pending: appeals.filter(a => a.status === "pending").length,
    inProgress: appeals.filter(a => a.status === "in_progress").length,
    resolved: appeals.filter(a => a.status === "resolved").length
  }

  return (
    <>
      <Header title="Мурожаатлар" description="Фуқаролар мурожаатлари бошқаруви тизими" />
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full animate-float" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-blue-500/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-32 left-40 w-20 h-20 bg-pink-500/10 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        </div>
        
        <div className="relative z-10 p-6 space-y-8">
          {/* Stats Cards */}
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse-modern">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{stats.total}</h3>
                    <p className="text-sm text-muted-foreground">Жами мурожаатлар</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center animate-pulse-modern">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{stats.pending}</h3>
                    <p className="text-sm text-muted-foreground">Кутилмоқда</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center animate-pulse-modern">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{stats.inProgress}</h3>
                    <p className="text-sm text-muted-foreground">Жараёнда</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center animate-pulse-modern">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{stats.resolved}</h3>
                    <p className="text-sm text-muted-foreground">Ҳал этилган</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Filters */}
          <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center flex-wrap">
                    <div className="relative flex-1 md:max-w-sm">
                      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Мурожаат қидириш..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-modern pl-12"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-[140px] input-modern">
                        <SelectValue placeholder="Ҳолат" />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        <SelectItem value="all">Барча ҳолатлар</SelectItem>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full md:w-[160px] input-modern">
                        <SelectValue placeholder="Туркум" />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        <SelectItem value="all">Барча туркумлар</SelectItem>
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-full md:w-[140px] input-modern">
                        <SelectValue placeholder="Устуворлик" />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        <SelectItem value="all">Барча устуворликлар</SelectItem>
                        {Object.entries(priorityLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={districtFilter} onValueChange={setDistrictFilter}>
                      <SelectTrigger className="w-full md:w-[140px] input-modern">
                        <SelectValue placeholder="Туман" />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                    {filteredAppeals.map((appeal) => (
                      <TableRow key={appeal.id} className="border-white/10 hover:bg-white/5 transition-colors duration-200">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{appeal.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{appeal.content}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4" />
                            <span>{appeal.applicant}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-white/20">
                            {categoryLabels[appeal.category]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("border", statusColors[appeal.status])}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(appeal.status)}
                              {statusLabels[appeal.status]}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("border", priorityColors[appeal.priority])}>
                            {priorityLabels[appeal.priority]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(appeal.createdAt).toLocaleDateString("uz-UZ")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass">
                              <DropdownMenuItem className="hover:bg-white/10" onClick={() => setSelectedAppeal(appeal)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Кўриш
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-white/10">
                                <Archive className="mr-2 h-4 w-4" />
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
        </div>
      </div>
    </>
  )
}
