"use client"

import { Header } from "@/components/layout/header"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([])
  const [selectedSector, setSelectedSector] = useState<string>("")

  const [tasks, setTasks] = useState<any[]>([])
  const [orgsMap, setOrgsMap] = useState<Record<string, any>>({})

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesSector = sectorFilter === "all" || task.sector === sectorFilter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesPriority && matchesSector && matchesSearch
  })

  const toggleOrg = (orgId: string) => {
    setSelectedOrgs((prev) => (prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]))
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
      <Header title="Topshiriqlar" description="Barcha topshiriqlar ro'yxati va boshqaruvi" />
      <div className="p-6 space-y-6">
        {/* Filters and Actions */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center flex-wrap">
                <div className="relative flex-1 md:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Topshiriq qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[160px] bg-secondary">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha statuslar</SelectItem>
                    {(Object.keys(taskStatusLabels) as TaskStatus[]).map((status) => (
                      <SelectItem key={status} value={status}>
                        {taskStatusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full md:w-[160px] bg-secondary">
                    <SelectValue placeholder="Ustuvorlik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha ustuvorliklar</SelectItem>
                    {(Object.keys(priorityLabels) as TaskPriority[]).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priorityLabels[priority]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-secondary">
                    <Layers className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Soha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha sohalar</SelectItem>
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
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Yangi topshiriq
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Yangi topshiriq yaratish</DialogTitle>
                    <DialogDescription>
                      {"Topshiriq ma'lumotlarini kiriting va tashkilotlarni tanlang"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Sarlavha</Label>
                      <Input id="title" placeholder="Topshiriq sarlavhasi" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Tavsif</Label>
                      <Textarea id="description" placeholder="Batafsil ma'lumot..." rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ustuvorlik</Label>
                        <Select defaultValue="ODDIY">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(priorityLabels) as TaskPriority[]).map((priority) => (
                              <SelectItem key={priority} value={priority}>
                                {priorityLabels[priority]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deadline">Muddat</Label>
                        <Input id="deadline" type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Soha</Label>
                      <Select value={selectedSector} onValueChange={setSelectedSector}>
                        <SelectTrigger>
                          <SelectValue placeholder="Soha tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(sectorLabels) as Sector[]).map((sector) => (
                            <SelectItem key={sector} value={sector}>
                              {sectorLabels[sector]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tashkilotlar</Label>
                      <div className="grid grid-cols-1 gap-2 rounded-lg border border-border p-3 max-h-[200px] overflow-y-auto">
                        {Object.values(orgsMap)
                          .filter((org: any) => org.isActive)
                          .map((org: any) => (
                            <div key={org.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`org-${org.id}`}
                                checked={selectedOrgs.includes(org.id)}
                                onCheckedChange={() => toggleOrg(org.id)}
                              />
                              <label
                                htmlFor={`org-${org.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                              >
                                {org.name}
                              </label>
                              <Badge variant="outline" className="text-xs">
                                {sectorLabels[org.sector]}
                              </Badge>
                            </div>
                          ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{selectedOrgs.length} ta tashkilot tanlandi</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Bekor qilish
                    </Button>
                    <Button onClick={() => setIsCreateOpen(false)}>Yaratish</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Sarlavha</TableHead>
                  <TableHead className="text-muted-foreground">Soha</TableHead>
                  <TableHead className="text-muted-foreground">Ustuvorlik</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Tashkilot</TableHead>
                  <TableHead className="text-muted-foreground">Muddat</TableHead>
                  <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                          {filteredTasks.map((task) => (
                  <TableRow key={task.id} className="border-border">
                    <TableCell>
                      <Link href={`/dashboard/tasks/${task.id}`} className="block hover:underline">
                        <p className="font-medium text-foreground">{task.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
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
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/dashboard/tasks/${task.id}`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {"Ko'rish"}
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Tahrirlash
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {"O'chirish"}
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
      </div>
    </>
  )
}
