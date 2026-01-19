"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { taskStatusLabels, priorityLabels, sectorLabels, type TaskStatus, type TaskPriority, type Sector } from "@/lib/mock-data"
import { getTasks, getOrganizations } from "@/lib/api"
import { TaskStatusBadge, PriorityBadge } from "@/components/ui/status-badge"
import { Plus, Search, Filter, Calendar, Building2, MoreHorizontal, Eye, Edit, Trash2, Layers } from "lucide-react"
import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function TasksPage() {
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
      const deadline = new Date(today)
      switch (priority) {
        case "MUHIM_SHOSHILINCH":
          deadline.setDate(today.getDate() + 1)
          console.log("Setting deadline to +1 day:", deadline)
          break
        case "MUHIM":
          deadline.setDate(today.getDate() + 3)
          console.log("Setting deadline to +3 days:", deadline)
          break
        case "SHOSHILINCH_EMAS":
          deadline.setDate(today.getDate() + 5)
          console.log("Setting deadline to +5 days:", deadline)
          break
        case "ODDIY":
          deadline.setDate(today.getDate() + 7)
          console.log("Setting deadline to +7 days:", deadline)
          break
      }
      // Format date as YYYY-MM-DD
      const year = deadline.getFullYear()
      const month = String(deadline.getMonth() + 1).padStart(2, '0')
      const day = String(deadline.getDate()).padStart(2, '0')
      const deadlineString = `${year}-${month}-${day}`
      console.log("Final deadline string:", deadlineString)
      setTaskDeadline(deadlineString)
    }
  }

  // Handle manual deadline change
  const handleDeadlineChange = (date: string) => {
    console.log("Manual deadline change to:", date)
    
    // Validate and format date
    if (date) {
      // Ensure the date is in YYYY-MM-DD format
      const dateObj = new Date(date)
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        const formattedDate = `${year}-${month}-${day}`
        console.log("Formatted date:", formattedDate)
        setTaskDeadline(formattedDate)
      } else {
        console.log("Invalid date format")
        setTaskDeadline("")
      }
    } else {
      setTaskDeadline("")
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesSector = sectorFilter === "all" || task.sector === sectorFilter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    
    // Deadline filtering
    let matchesDeadline = true
    if (deadlineFilter !== "all") {
      const today = new Date()
      const deadlineDate = new Date(task.deadline)
      const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (deadlineFilter) {
        case "overdue":
          matchesDeadline = diffDays < 0
          break
        case "today":
          matchesDeadline = diffDays === 0
          break
        case "3days":
          matchesDeadline = diffDays > 0 && diffDays <= 3
          break
        case "week":
          matchesDeadline = diffDays > 0 && diffDays <= 7
          break
        case "month":
          matchesDeadline = diffDays > 0 && diffDays <= 30
          break
      }
    }
    
    return matchesStatus && matchesPriority && matchesSector && matchesSearch && matchesDeadline
  })

  const toggleOrg = (orgId: string) => {
    setSelectedOrgs((prev) => (prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]))
  }

  // Reset form when dialog closes
  const resetForm = () => {
    setSelectedPriority("")
    setTaskDeadline("")
    setSelectedSector("")
    setSelectedOrgs([])
  }

  const handleCreateTask = () => {
    // Get form values
    const titleInput = document.getElementById('taskTitle') as HTMLInputElement
    const descriptionInput = document.getElementById('taskDescription') as HTMLTextAreaElement
    
    if (!titleInput?.value || !descriptionInput?.value || !selectedPriority || !taskDeadline || !selectedSector || selectedOrgs.length === 0) {
      alert('Илтимос, барча мажбурий майдонларни тўлдиринг!')
      return
    }

    // Create new task object
    const newTask = {
      id: Date.now().toString(),
      title: titleInput.value,
      description: descriptionInput.value,
      priority: selectedPriority,
      deadline: taskDeadline,
      sector: selectedSector,
      organizations: selectedOrgs,
      status: "YANGI",
      createdAt: new Date().toISOString(),
      createdBy: "1"
    }

    // Add to tasks list
    setTasks(prev => [...prev, newTask])
    
    // Reset form and close dialog
    resetForm()
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full animate-float" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="relative z-10 p-6 space-y-8">
          {/* Filters Section */}
          <section className="animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-modern shadow-lg">
                <span className="text-white font-bold text-lg">📋</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient-animated">Топшириқлар</h2>
                <p className="text-sm text-muted-foreground">Барча топшириқлар рўйхати ва бошқаруви</p>
              </div>
            </div>
            
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center flex-wrap">
                    <div className="relative flex-1 md:max-w-sm">
                      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Топшириқ қидириш..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-modern pl-12"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-[160px] input-modern">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Ҳолат" />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        <SelectItem value="all">Барча ҳолатлар</SelectItem>
                        {(Object.keys(taskStatusLabels) as TaskStatus[]).map((status) => (
                          <SelectItem key={status} value={status}>
                            {taskStatusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-full md:w-[160px] input-modern">
                        <SelectValue placeholder="Устуворлик" />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        <SelectItem value="all">Барча устуворликлар</SelectItem>
                        {(Object.keys(priorityLabels) as TaskPriority[]).map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priorityLabels[priority]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sectorFilter} onValueChange={setSectorFilter}>
                      <SelectTrigger className="w-full md:w-[180px] input-modern">
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
                    <Select value={deadlineFilter} onValueChange={setDeadlineFilter}>
                      <SelectTrigger className="w-full md:w-[160px] input-modern">
                        <Calendar className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Муддат" />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        <SelectItem value="all">Барча муддатлар</SelectItem>
                        <SelectItem value="overdue">Кечикган</SelectItem>
                        <SelectItem value="today">Бугун</SelectItem>
                        <SelectItem value="3days">3 кунгача</SelectItem>
                        <SelectItem value="week">Ҳафтагача</SelectItem>
                        <SelectItem value="month">Ойгача</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Dialog open={isCreateOpen} onOpenChange={(open) => {
    setIsCreateOpen(open)
    if (!open) {
      resetForm()
    }
  }}>
                    <DialogTrigger asChild>
                      <Button className="btn-modern">
                        <Plus className="mr-2 h-4 w-4" />
                        Янги топшириқ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[75vh] overflow-y-auto glass my-4">
                      <DialogHeader>
                        <DialogTitle className="text-gradient-animated">Янги топшириқ яратиш</DialogTitle>
                        <DialogDescription>
                          Топшириқ маълумотларини киритинг ва ташкилотларни танланг
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="taskTitle">Топшириқ сарлавҳаси *</Label>
                          <Input
                            id="taskTitle"
                            placeholder="Топшириқ сарлавҳасини киритинг..."
                            className="input-modern"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="taskDescription">Топшириқ тавсифи *</Label>
                          <Textarea
                            id="taskDescription"
                            placeholder="Топшириқ ҳақида тўлиқ маълумот..."
                            className="input-modern min-h-[100px]"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="taskPriority">Устуворлик *</Label>
                            <Select value={selectedPriority} onValueChange={handlePriorityChange}>
                              <SelectTrigger className="input-modern text-xs h-10">
                                <SelectValue placeholder="Устуворликни танланг" />
                              </SelectTrigger>
                              <SelectContent className="glass" position="popper" sideOffset={10} avoidCollisions={true}>
                                {(Object.keys(priorityLabels) as TaskPriority[]).map((priority) => (
                                  <SelectItem key={priority} value={priority}>
                                    {priorityLabels[priority]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="taskDeadline">Муддат *</Label>
                            <Input
                              id="taskDeadline"
                              type="date"
                              value={taskDeadline}
                              onChange={(e) => handleDeadlineChange(e.target.value)}
                              className="input-modern z-10"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="taskSector">Сохалар *</Label>
                          <Select value={selectedSector} onValueChange={setSelectedSector}>
                            <SelectTrigger className="input-modern">
                              <SelectValue placeholder="Сохаларни танланг" />
                            </SelectTrigger>
                            <SelectContent className="glass" position="popper" sideOffset={10} avoidCollisions={true}>
                              {(Object.keys(sectorLabels) as Sector[]).map((sector) => (
                                <SelectItem key={sector} value={sector}>
                                  {sectorLabels[sector]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Ташкилотлар *</Label>
                          <div className="space-y-3 max-h-[200px] overflow-y-auto p-2 border border-border/50 rounded-lg bg-muted/30">
                            {Object.values(orgsMap).map((org) => (
                              <div key={org.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`org-${org.id}`}
                                  checked={selectedOrgs.includes(org.id)}
                                  onCheckedChange={() => toggleOrg(org.id)}
                                />
                                <Label 
                                  htmlFor={`org-${org.id}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {org.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            resetForm()
                            setIsCreateOpen(false)
                          }}
                        >
                          Бекор қилиш
                        </Button>
                        <Button 
                          onClick={handleCreateTask}
                          className="btn-modern"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Топшириқ яратиш
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Tasks Table */}
          <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Card className="card-modern">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Сарлавҳа</TableHead>
                      <TableHead className="text-muted-foreground">Сўҳа</TableHead>
                      <TableHead className="text-muted-foreground">Устуворлик</TableHead>
                      <TableHead className="text-muted-foreground">Ҳолат</TableHead>
                      <TableHead className="text-muted-foreground">Ташкилот</TableHead>
                      <TableHead className="text-muted-foreground">Муддат</TableHead>
                      <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id} className="border-white/10 hover:bg-white/5 transition-colors duration-200">
                        <TableCell>
                          <Link href={`/dashboard/tasks/${task.id}`} className="block hover:text-primary transition-colors">
                            <p className="font-medium text-foreground">{task.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal border-white/20">
                            {sectorLabels[task.sector]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={task.priority} />
                        </TableCell>
                        <TableCell>
                          <TaskStatusBadge status={task.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span className="truncate max-w-[150px]">{(task.organizations || []).map((id: string) => orgsMap[id]?.name).filter(Boolean).join(", ")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(task.deadline).toLocaleDateString("uz-UZ")}
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
                              <Link href={`/dashboard/tasks/${task.id}`}>
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
