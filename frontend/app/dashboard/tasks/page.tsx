"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { taskStatusLabels, priorityLabels, sectorLabels, type TaskStatus, type TaskPriority, type Sector, priorityDeadlines } from "@/lib/mock-data"
import { getTasks, getOrganizations } from "@/lib/api"
import { TaskStatusBadge, PriorityBadge } from "@/components/ui/status-badge"
import { Plus, Search, Filter, Calendar, Building2, MoreHorizontal, Eye, Edit, Trash2, Layers } from "lucide-react"
import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TasksPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const [deadlineFilter, setDeadlineFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([])
  const [selectedSector, setSelectedSector] = useState<string>("")
  const [selectedPriority, setSelectedPriority] = useState<string>("")
  const [taskDeadline, setTaskDeadline] = useState<string>("")

  const [tasks, setTasks] = useState<any[]>([])
  const [orgsMap, setOrgsMap] = useState<Record<string, any>>({})

  // Auto-calculate deadline based on priority
  const handlePriorityChange = (priority: string) => {
    console.log("Priority changed to:", priority)
    setSelectedPriority(priority)
    
    // Always auto-calculate when priority changes
    if (priority) {
      const today = new Date()
      const deadlineDays = priorityDeadlines[priority as TaskPriority] || 7
      
      const deadline = new Date(today)
      deadline.setDate(today.getDate() + deadlineDays)
      setTaskDeadline(deadline.toISOString().split('T')[0])
    }
  }

  const handleCreateTask = () => {
    // Create task logic here
    console.log("Creating task with:", {
      selectedOrgs,
      selectedSector,
      selectedPriority,
      taskDeadline
    })
    
    // Reset form and close dialog
    setSelectedOrgs([])
    setSelectedSector("")
    setSelectedPriority("")
    setTaskDeadline("")
    setIsCreateOpen(false)
  }

  useEffect(() => {
    let mounted = true
    Promise.all([getTasks(), getOrganizations()])
      .then(([t, orgs]) => {
        if (!mounted) return
        setTasks(t)
        const map: Record<string, any> = {}
        orgs.forEach((o: any) => (map[o.id] = o))
        setOrgsMap(map)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 py-8">

            {/* Header Section */}
            <section className="animate-slide-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">📋</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Топшириқлар</h1>
                  <p className="text-lg text-muted-foreground">Барча топшириқларни бошқариш ва кузатув</p>
                </div>
              </div>
              
              {/* Filters */}
              <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-md p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Топшириқни қидириш..."
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
                      {Object.entries(taskStatusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[180px] bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
                      <SelectValue placeholder="Муҳимлик" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                      <SelectItem value="all">Барча муҳимликлар</SelectItem>
                      {Object.entries(priorityLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sectorFilter} onValueChange={setSectorFilter}>
                    <SelectTrigger className="w-[180px] bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
                      <SelectValue placeholder="Соҳа" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                      <SelectItem value="all">Барча соҳалар</SelectItem>
                      {Object.entries(sectorLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                        <Plus className="mr-2 h-4 w-4" />
                        Янги топшириқ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-foreground">Янги топшириқ яратиш</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Янги топшириқ маълумотларини киритинг
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sector" className="text-sm font-medium text-foreground">Соҳа</Label>
                          <Select value={selectedSector} onValueChange={setSelectedSector}>
                            <SelectTrigger className="bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
                              <SelectValue placeholder="Соҳани танланг" />
                            </SelectTrigger>
                            <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                              {Object.entries(sectorLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="priority" className="text-sm font-medium text-foreground">Муҳимлик</Label>
                          <Select value={selectedPriority} onValueChange={handlePriorityChange}>
                            <SelectTrigger className="bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all">
                              <SelectValue placeholder="Муҳимликни танланг" />
                            </SelectTrigger>
                            <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                              {Object.entries(priorityLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="deadline" className="text-sm font-medium text-foreground">Муддат</Label>
                          <Input
                            type="date"
                            value={taskDeadline}
                            onChange={(e) => setTaskDeadline(e.target.value)}
                            className="bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">Ташкилотлар</Label>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {Object.values(orgsMap).map((org: any) => (
                              <div key={org.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={org.id}
                                  checked={selectedOrgs.includes(org.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedOrgs([...selectedOrgs, org.id])
                                    } else {
                                      setSelectedOrgs(selectedOrgs.filter(id => id !== org.id))
                                    }
                                  }}
                                />
                                <Label htmlFor={org.id} className="text-sm text-foreground">
                                  {org.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="border-border/50 bg-background/50">
                          Бекор қилиш
                        </Button>
                        <Button onClick={handleCreateTask} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          Яратиш
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </section>

            {/* Tasks Table */}
            <section className="animate-slide-up">
              <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-md">
                <CardContent className="p-0">
                  <div className="w-full overflow-hidden">
                    <Table className="w-full table-fixed">
                      <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="px-4 py-4 font-semibold text-foreground w-[30%]">Топшириқ</TableHead>
                        <TableHead className="px-4 py-4 font-semibold text-foreground w-[18%]">Ташкилот</TableHead>
                        <TableHead className="px-4 py-4 font-semibold text-foreground w-[12%]">Ҳолат</TableHead>
                        <TableHead className="px-4 py-4 font-semibold text-foreground w-[20%]">Муҳимлик</TableHead>
                        <TableHead className="px-4 py-4 font-semibold text-foreground w-[19%]">Муддат</TableHead>
                        <TableHead className="px-4 py-4 font-semibold text-foreground text-right w-[1%]">Ҳаракатлар</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task: any) => (
                        <TableRow key={task.id} className="hover:bg-muted/20 transition-colors duration-200">
                          <TableCell className="px-4 py-4 w-[30%]">
                            <Link href={`/dashboard/tasks/${task.id}`} className="block hover:text-primary transition-colors duration-200">
                              <div className="font-medium text-foreground hover:text-primary line-clamp-2 leading-5" title={task.title}>{task.title}</div>
                            </Link>
                          </TableCell>
                          <TableCell className="px-4 py-4 w-[18%]">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-foreground truncate" title={orgsMap[task.organizationId]?.name || 'Номаълум'}>{orgsMap[task.organizationId]?.name || 'Номаълум'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4 w-[12%]">
                            <TaskStatusBadge status={task.status} />
                          </TableCell>
                          <TableCell className="px-4 py-4 w-[20%]">
                            <PriorityBadge priority={task.priority} />
                          </TableCell>
                          <TableCell className="px-4 py-4 w-[19%]">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm text-foreground">{task.deadline}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4 w-[1%]">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted/20 hover:text-primary transition-all duration-300 rounded-lg">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl rounded-xl">
                                <Link href={`/dashboard/tasks/${task.id}`}>
                                  <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-lg">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Батафсил кўриш
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-lg">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Таҳрирлаш
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive hover:bg-destructive/10 transition-all duration-300 rounded-lg">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Ўчириш
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
