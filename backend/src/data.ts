export type User = {
  id: string
  pnfl?: string
  firstName: string
  lastName: string
  role?: string
  organizationId?: string
}

export type Organization = {
  id: string
  name: string
  sector?: string
}

export type Task = {
  id: string
  title: string
  description?: string
  priority?: string
  status?: string
  sector?: string
  deadline?: string
  createdAt?: string
  createdBy?: string
  organizations?: string[]
}

export const users: User[] = [
  { id: "1", pnfl: "31234567890123", firstName: "Abdulla", lastName: "Karimov", role: "TUMAN_HOKIMI" },
  { id: "2", pnfl: "32345678901234", firstName: "Dilshod", lastName: "Rahimov", role: "HOKIMLIK_MASUL" },
]

export const organizations: Organization[] = [
  { id: "1", name: "Kommunal xo'jalik bo'limi", sector: "KOMMUNAL_SOHA" },
  { id: "2", name: "Ta'lim bo'limi", sector: "TALIM" },
]

export const tasks: Task[] = [
  {
    id: "1",
    title: "Ichki yo'llarni ta'mirlash",
    description: "Markaziy ko'chada 500 metr masofada yo'l qoplamasi ta'mirlash ishlari",
    priority: "MUHIM_SHOSHILINCH",
    status: "IJRODA",
    sector: "KOMMUNAL_SOHA",
    deadline: "2026-02-01",
    createdAt: "2026-01-10",
    createdBy: "1",
    organizations: ["1"],
  },
  {
    id: "2",
    title: "Maktab binosi ta'mirlash",
    description: "15-sonli maktab sport zali va oshxona binosi kapital ta'mirlash",
    priority: "MUHIM",
    status: "BAJARILDI",
    sector: "TALIM",
    deadline: "2026-01-25",
    createdAt: "2026-01-05",
    createdBy: "1",
    organizations: ["2"],
  },
]

export const chatMessages = [
  { id: "1", taskId: "1", senderId: "1", type: "system", content: "Topshiriq yaratildi", createdAt: "2026-01-10T09:00:00" },
  { id: "2", taskId: "1", senderId: "3", type: "text", content: "Topshiriq qabul qilindi.", createdAt: "2026-01-11T09:15:00" },
]

export const notifications = [
  { id: "1", type: "task_new", title: "Yangi topshiriq", description: "Ichki yo'llarni ta'mirlash - muddat: 01.02.2026", read: false, createdAt: "2026-01-17T08:00:00", taskId: "1" },
]

export const taskExecutions = [
  {
    id: "1",
    taskId: "1",
    executedBy: "3",
    actionType: "IJROGA_OLINDI",
    comment: "Topshiriq qabul qilindi, materiallar buyurtma qilindi",
    createdAt: "2026-01-11T09:00:00",
  },
]

export const auditLogs = [
  {
    id: "1",
    userId: "1",
    action: "TASK_CREATED",
    details: "Yangi topshiriq yaratildi",
    targetType: "task",
    targetId: "1",
    createdAt: "2026-01-17T08:00:00",
  },
]

export const systemSettings = {
  telegramBotToken: "",
  telegramBotUsername: "",
  emailSmtpHost: "smtp.gov.uz",
  emailSmtpPort: 587,
  emailSenderAddress: "noreply@hokimlik.uz",
}

