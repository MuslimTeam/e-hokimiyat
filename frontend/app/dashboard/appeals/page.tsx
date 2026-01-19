"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  Calendar, 
  Reply, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  MoreHorizontal,
  Eye,
  Archive
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
    district: "center"
  },
  {
    id: "2", 
    title: "Сув таъминоти муаммоси",
    content: "Маҳалламизда сув таъминоти кунда 2 соатдан кам ишлаяпти. Илтимос муаммони кўриб чиқинг.",
    applicant: "Ойбек Тошев",
    email: "oybek.toshev@email.com", 
    phone: "+998912345678",
    status: "in_progress" as const,
    priority: "high" as const,
    category: "utilities" as const,
    createdAt: "2024-01-14T14:20:00Z",
    response: "Мурожаатингиз қабул қилинди. Мутахассислар томонидан ўрганиш бошланди.",
    department: "Коммуналь хизматлар бўлими",
    district: "north"
  },
  {
    id: "3",
    title: "Маърифат бўйича таклиф",
    content: "Мактабларда қўшимча дарс ташкилотлари ташкиш таклифини киритаман. Бу ўқувчиларнинг ривожланишига ёрдам беради.",
    applicant: "Дилора Норматова",
    email: "dilora.normatova@email.com",
    phone: "+998933456789", 
    status: "resolved" as const,
    priority: "low" as const,
    category: "education" as const,
    createdAt: "2024-01-13T09:15:00Z",
    response: "Таклифингиз ҳисобга олинди. Маълумотлар маърифат бўлимига юборилди.",
    department: "Маърифат бўлими",
    district: "south"
  },
  {
    id: "4",
    title: "Yo'l қурилиши муаммоси",
    content: "Маҳалламиздаги асфолт йўллар ёмон ҳолатда. Қатнаф хавфсизлигига таъсир қилмоқда.",
    applicant: "Ботир Алиев",
    email: "botir.aliev@email.com",
    phone: "+998945678901",
    status: "pending" as const,
    priority: "high" as const,
    category: "infrastructure" as const,
    createdAt: "2024-01-12T16:45:00Z",
    response: null,
    department: "Йўл қурилиши бўлими",
    district: "east"
  },
  {
    id: "5",
    title: "Соғлиқни сақлаш тўғрисида",
    content: "Маҳалламизда тиббий пункт йўқ. Энг яқин шифобона 5 км масофада жойлашган.",
    applicant: "Зухра Салимова",
    email: "zuhra.salimova@email.com",
    phone: "+998956789012",
    status: "in_progress" as const,
    priority: "medium" as const,
    category: "health" as const,
    createdAt: "2024-01-11T11:30:00Z",
    response: "Мурожаатингиз тиббий бўлимга юборилди. Мутахассислар томонидан ўрганилмоқда.",
    department: "Соғлиқни сақлаш бўлими",
    district: "west"
  }
]

const statusLabels = {
  pending: "Кутилмоқда",
  in_progress: "Жараёнда", 
  resolved: "Ҳал этилган",
  archived: "Архивланган"
}

const priorityLabels = {
  low: "Паст",
  medium: "Ўртача",
  high: "Юқори"
}

const categoryLabels = {
  employment: "Иш билан таъминлаш",
  utilities: "Коммуналь хизматлар",
  education: "Маърифат",
  infrastructure: "Инфраструктура",
  health: "Соғлиқни сақлаш",
  social: "Ижтимоий муаммолар",
  other: "Бошқа"
}

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  in_progress: "bg-blue-500/20 text-blue-600 border-blue-500/30", 
  resolved: "bg-green-500/20 text-green-600 border-green-500/30",
  archived: "bg-gray-500/20 text-gray-600 border-gray-500/30"
}

const priorityColors = {
  low: "bg-gray-500/20 text-gray-600 border-gray-500/30",
  medium: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  high: "bg-red-500/20 text-red-600 border-red-500/30"
}

export default function AppealsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [districtFilter, setDistrictFilter] = useState<string>("all")
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [appeals, setAppeals] = useState(mockAppeals)

  const districts = [
    { id: "all", name: "Барча туманлар" },
    { id: "center", name: "Марказий туман" },
    { id: "north", name: "Шимолий туман" },
    { id: "south", name: "Жанубий туман" },
    { id: "east", name: "Шарқий туман" },
    { id: "west", name: "Ғарбий туман" },
  ]

  const filteredAppeals = appeals.filter((appeal) => {
    const matchesSearch = 
      appeal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.applicant.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || appeal.status === statusFilter
    const matchesCategory = categoryFilter === "all" || appeal.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || appeal.priority === priorityFilter
    const matchesDistrict = districtFilter === "all" || appeal.district === districtFilter
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesDistrict
  })

  const handleSendResponse = () => {
    if (selectedAppeal && responseText.trim()) {
      setAppeals(prev => prev.map(appeal => 
        appeal.id === selectedAppeal.id 
          ? { ...appeal, response: responseText, status: "resolved" as const }
          : appeal
      ))
      setResponseText("")
      setIsResponseDialogOpen(false)
      setSelectedAppeal(null)
    }
  }

  const handleConvertToTask = () => {
    if (selectedAppeal) {
      // Convert appeal to task logic here
      console.log("Converting appeal to task:", selectedAppeal)
      setIsConvertDialogOpen(false)
      setSelectedAppeal(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in_progress":
        return <AlertTriangle className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
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
                    <Clock className="h-6 w-6 text-white" />
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
                    <AlertTriangle className="h-6 w-6 text-white" />
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
                    <CheckCircle className="h-6 w-6 text-white" />
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

          {/* Appeals List */}
          <section className="space-y-4 animate-slide-up" style={{ animationDelay: "400ms" }}>
            {filteredAppeals.map((appeal, index) => (
              <Card key={appeal.id} className="card-modern group hover-lift" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {appeal.title}
                        </h3>
                        <Badge className={cn("border", statusColors[appeal.status])}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(appeal.status)}
                            {statusLabels[appeal.status]}
                          </div>
                        </Badge>
                        <Badge className={cn("border", priorityColors[appeal.priority])}>
                          {priorityLabels[appeal.priority]}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {appeal.content}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{appeal.applicant}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(appeal.createdAt).toLocaleDateString("uz-UZ")}</span>
                        </div>
                        <Badge variant="outline" className="border-white/20">
                          {categoryLabels[appeal.category]}
                        </Badge>
                        <span className="text-xs">{appeal.department}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass">
                          <DropdownMenuItem 
                            className="hover:bg-white/10"
                            onClick={() => setSelectedAppeal(appeal)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Батафсил
                          </DropdownMenuItem>
                          {appeal.status === "pending" && (
                            <DropdownMenuItem 
                              className="hover:bg-white/10"
                              onClick={() => {
                                setSelectedAppeal(appeal)
                                setIsResponseDialogOpen(true)
                              }}
                            >
                              <Reply className="mr-2 h-4 w-4" />
                              Жавоб бериш
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="hover:bg-white/10"
                            onClick={() => {
                              setSelectedAppeal(appeal)
                              setIsConvertDialogOpen(true)
                            }}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Топшириққа айлантириш
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-white/10">
                            <Archive className="mr-2 h-4 w-4" />
                            Архивлаш
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {appeal.response && (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Жавоб берилган</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{appeal.response}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {filteredAppeals.length === 0 && (
              <Card className="card-modern">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Мурожаатлар топилмади</h3>
                  <p className="text-sm text-muted-foreground">
                    Берилган фильтрлар бўйича ҳеч қандай мурожаатлар топилмади.
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>

      {/* Convert to Task Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="sm:max-w-[600px] glass">
          <DialogHeader>
            <DialogTitle className="text-gradient-animated">Мурожаатни топшириққа айлантириш</DialogTitle>
            <DialogDescription>
              {selectedAppeal?.title} мурожаатини топшириқ сифатида яратиш
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppeal && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{selectedAppeal.applicant}</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedAppeal.email}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedAppeal.content}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Badge variant="outline" className="border-white/20">
                    {categoryLabels[selectedAppeal.category]}
                  </Badge>
                  <Badge variant="outline" className="border-white/20">
                    {districts.find(d => d.id === selectedAppeal.district)?.name}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taskTitle">Топшириқ сарлавҳаси</Label>
                <Input
                  id="taskTitle"
                  defaultValue={selectedAppeal.title}
                  className="input-modern"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taskDescription">Топшириқ тавсифи</Label>
                <Textarea
                  id="taskDescription"
                  defaultValue={selectedAppeal.content}
                  className="input-modern min-h-[120px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taskPriority">Устуворлик</Label>
                  <Select defaultValue="MUHIM">
                    <SelectTrigger className="input-modern">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass">
                      <SelectItem value="MUHIM_SHOSHILINCH">1. MUHIM VA SHOSHILINCH</SelectItem>
                      <SelectItem value="MUHIM">2. MUHIM, LEKIN SHOSHILINCH EMAS</SelectItem>
                      <SelectItem value="SHOSHILINCH_EMAS">3. SHOSHILINCH, LEKIN MUHIM EMAS</SelectItem>
                      <SelectItem value="ODDIY">4. MUHIM EMAS VA SHOSHILINCH EMAS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taskSector">Сўҳа</Label>
                  <Select defaultValue={selectedAppeal.category === "health" ? "SOGLIQNI_SAQLASH" : "KOMMUNAL_SOHA"}>
                    <SelectTrigger className="input-modern">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass">
                      <SelectItem value="SOGLIQNI_SAQLASH">Соғлиқни сақлаш</SelectItem>
                      <SelectItem value="KOMMUNAL_SOHA">Коммуналь хизматлар</SelectItem>
                      <SelectItem value="TALIM">Таълим</SelectItem>
                      <SelectItem value="IJTIMOIY_HIMOYA">Ижтимоий ҳимоя</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConvertDialogOpen(false)}>
              Бекор қилиш
            </Button>
            <Button onClick={handleConvertToTask} className="btn-modern">
              <Send className="mr-2 h-4 w-4" />
              Топшириқ яратиш
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="sm:max-w-[600px] glass">
          <DialogHeader>
            <DialogTitle className="text-gradient-animated">Мурожаатга жавоб бериш</DialogTitle>
            <DialogDescription>
              {selectedAppeal?.title} мурожаатига жавоб киритинг
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppeal && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{selectedAppeal.applicant}</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedAppeal.email}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedAppeal.content}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="response">Жавоб матни</Label>
                <Textarea
                  id="response"
                  placeholder="Мурожаатга жавобингизни киритинг..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="input-modern min-h-[120px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Бекор қилиш
            </Button>
            <Button onClick={handleSendResponse} className="btn-modern">
              <Send className="mr-2 h-4 w-4" />
              Жавоб юбориш
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
