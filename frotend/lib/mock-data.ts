// Mock data for the government task management system

export type UserStatus = "DRAFT" | "KUTILMOQDA" | "FAOL" | "BLOKLANGAN" | "ARXIV"
export type TaskStatus =
  | "YANGI"
  | "IJRODA"
  | "BAJARILDI"
  | "QAYTA_IJROGA_YUBORILDI"
  | "MUDDATI_KECH"
  | "BAJARILMADI"
  | "NAZORATDAN_YECHILDI"
export type TaskPriority = "MUHIM_SHOSHILINCH" | "MUHIM" | "ODDIY"
export type UserRole = "TUMAN_HOKIMI" | "HOKIMLIK_MASUL" | "TASHKILOT_RAHBAR" | "TASHKILOT_MASUL" | "ADMIN"
export type CabinetType = "HOKIMLIK" | "TASHKILOT" | "ADMIN"

export type Sector =
  | "SOGLIQNI_SAQLASH"
  | "BANDLIK_MEHNAT"
  | "TALIM"
  | "IJTIMOIY_HIMOYA"
  | "ADLIYA"
  | "EKOLOGIYA"
  | "SUBSIDIYA"
  | "OILA_BOLALAR"
  | "KOCHMAS_MULK"
  | "FUQAROLIK"
  | "DAVLAT_AKTIVLARI"
  | "IQTISODIYOT_BIZNES"
  | "YOSHLAR"
  | "TRANSPORT"
  | "AXBOROT_ALOQA"
  | "GEOLOGIYA"
  | "PENSIYA"
  | "MADANIYAT_TURIZM_SPORT"
  | "KOMMUNAL_SOHA"
  | "SOLIQLAR"

export interface User {
  id: string
  pnfl: string
  firstName: string
  lastName: string
  middleName: string
  phone?: string
  role: UserRole
  organizationId?: string
  position: string
  status: UserStatus
  oneidConnected: boolean
  createdAt: string
  activatedAt?: string
}

export interface Organization {
  id: string
  name: string
  sector: Sector // Added sector field
  parentOrgId?: string
  isActive: boolean
  tasksCount: number
  completedTasks: number
  rating: number
}

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  sector: Sector // Added sector field
  deadline: string
  createdAt: string
  createdBy: string
  organizations: string[]
  location?: { lat: number; lng: number }
  attachments?: string[]
}

export interface TaskExecution {
  id: string
  taskId: string
  executedBy: string
  actionType:
    | "IJROGA_OLINDI"
    | "HISOBOT_TOPSHIRILDI"
    | "QAYTA_YUBORILDI"
    | "NAZORATDAN_YECHILDI"
    | "MUDDAT_UZAYTIRISH_SOROVI"
  comment?: string
  attachments?: string[]
  createdAt: string
}

export interface ChatMessage {
  id: string
  taskId: string
  senderId: string
  type: "text" | "file" | "audio" | "system"
  content: string
  attachments?: string[]
  createdAt: string
}

export interface Notification {
  id: string
  type: "task_new" | "task_deadline" | "task_completed" | "task_overdue" | "user_added" | "system"
  title: string
  description: string
  read: boolean
  createdAt: string
  taskId?: string
  userId?: string
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  details: string
  targetType: "user" | "task" | "organization"
  targetId: string
  createdAt: string
}

export interface SystemSettings {
  telegramBotToken: string
  telegramBotUsername: string
  emailSmtpHost: string
  emailSmtpPort: number
  emailSenderAddress: string
}

export const roleLabels: Record<UserRole, string> = {
  TUMAN_HOKIMI: "Tuman hokimi",
  HOKIMLIK_MASUL: "Hokimlik mas'uli",
  TASHKILOT_RAHBAR: "Tashkilot rahbari",
  TASHKILOT_MASUL: "Tashkilot mas'uli",
  ADMIN: "Administrator",
}

export const roleCabinet: Record<UserRole, CabinetType> = {
  TUMAN_HOKIMI: "HOKIMLIK",
  HOKIMLIK_MASUL: "HOKIMLIK",
  TASHKILOT_RAHBAR: "TASHKILOT",
  TASHKILOT_MASUL: "TASHKILOT",
  ADMIN: "ADMIN",
}

export const sectorLabels: Record<Sector, string> = {
  SOGLIQNI_SAQLASH: "Sog'liqni saqlash",
  BANDLIK_MEHNAT: "Bandlik va mehnat",
  TALIM: "Ta'lim",
  IJTIMOIY_HIMOYA: "Ijtimoiy himoya",
  ADLIYA: "Adliya",
  EKOLOGIYA: "Ekologiya",
  SUBSIDIYA: "Subsidiya",
  OILA_BOLALAR: "Oila va bolalar",
  KOCHMAS_MULK: "Ko'chmas mulk",
  FUQAROLIK: "Fuqarolik",
  DAVLAT_AKTIVLARI: "Davlat aktivlari",
  IQTISODIYOT_BIZNES: "Iqtisodiyot va biznes",
  YOSHLAR: "Yoshlar",
  TRANSPORT: "Transport",
  AXBOROT_ALOQA: "Axborot va aloqa",
  GEOLOGIYA: "Geologiya",
  PENSIYA: "Pensiya",
  MADANIYAT_TURIZM_SPORT: "Madaniyat, turizm va sport",
  KOMMUNAL_SOHA: "Kommunal soha",
  SOLIQLAR: "Soliqlar",
}

export const sectorColors: Record<Sector, string> = {
  SOGLIQNI_SAQLASH: "hsl(0, 70%, 50%)",
  BANDLIK_MEHNAT: "hsl(25, 80%, 55%)",
  TALIM: "hsl(45, 85%, 50%)",
  IJTIMOIY_HIMOYA: "hsl(85, 60%, 50%)",
  ADLIYA: "hsl(160, 60%, 45%)",
  EKOLOGIYA: "hsl(120, 50%, 45%)",
  SUBSIDIYA: "hsl(180, 60%, 45%)",
  OILA_BOLALAR: "hsl(200, 70%, 50%)",
  KOCHMAS_MULK: "hsl(220, 60%, 55%)",
  FUQAROLIK: "hsl(240, 60%, 50%)",
  DAVLAT_AKTIVLARI: "hsl(260, 55%, 55%)",
  IQTISODIYOT_BIZNES: "hsl(280, 50%, 55%)",
  YOSHLAR: "hsl(300, 50%, 50%)",
  TRANSPORT: "hsl(320, 55%, 50%)",
  AXBOROT_ALOQA: "hsl(340, 60%, 50%)",
  GEOLOGIYA: "hsl(30, 50%, 45%)",
  PENSIYA: "hsl(60, 50%, 45%)",
  MADANIYAT_TURIZM_SPORT: "hsl(150, 55%, 45%)",
  KOMMUNAL_SOHA: "hsl(190, 60%, 50%)",
  SOLIQLAR: "hsl(210, 65%, 50%)",
}

export const statusLabels: Record<UserStatus, string> = {
  DRAFT: "Qoralama",
  KUTILMOQDA: "Kutilmoqda",
  FAOL: "Faol",
  BLOKLANGAN: "Bloklangan",
  ARXIV: "Arxiv",
}

export const taskStatusLabels: Record<TaskStatus, string> = {
  YANGI: "Yangi",
  IJRODA: "Ijroda",
  BAJARILDI: "Bajarildi",
  QAYTA_IJROGA_YUBORILDI: "Qayta ijroga",
  MUDDATI_KECH: "Muddati kech",
  BAJARILMADI: "Bajarilmadi",
  NAZORATDAN_YECHILDI: "Nazoratdan yechildi",
}

export const priorityLabels: Record<TaskPriority, string> = {
  MUHIM_SHOSHILINCH: "Muhim va shoshilinch",
  MUHIM: "Muhim",
  ODDIY: "Oddiy",
}

export const mockUsers: User[] = [
  {
    id: "1",
    pnfl: "31234567890123",
    firstName: "Abdulla",
    lastName: "Karimov",
    middleName: "Rustamovich",
    phone: "+998901234567",
    role: "TUMAN_HOKIMI",
    position: "Tuman hokimi",
    status: "FAOL",
    oneidConnected: true,
    createdAt: "2024-01-15",
    activatedAt: "2024-01-15",
  },
  {
    id: "2",
    pnfl: "32345678901234",
    firstName: "Dilshod",
    lastName: "Rahimov",
    middleName: "Shavkatovich",
    phone: "+998902345678",
    role: "HOKIMLIK_MASUL",
    position: "Hokimlik bosh mutaxassisi",
    status: "FAOL",
    oneidConnected: true,
    createdAt: "2024-01-20",
    activatedAt: "2024-01-21",
  },
  {
    id: "3",
    pnfl: "33456789012345",
    firstName: "Sardor",
    lastName: "Aliyev",
    middleName: "Bahodirovich",
    phone: "+998903456789",
    role: "TASHKILOT_RAHBAR",
    organizationId: "1",
    position: "Kommunal xo'jalik boshlig'i",
    status: "FAOL",
    oneidConnected: true,
    createdAt: "2024-02-01",
    activatedAt: "2024-02-02",
  },
  {
    id: "4",
    pnfl: "34567890123456",
    firstName: "Jamshid",
    lastName: "Toshmatov",
    middleName: "Ilhomovich",
    role: "TASHKILOT_MASUL",
    organizationId: "1",
    position: "Katta mutaxassis",
    status: "FAOL",
    oneidConnected: true,
    createdAt: "2024-02-10",
    activatedAt: "2024-02-11",
  },
  {
    id: "5",
    pnfl: "35678901234567",
    firstName: "Nodira",
    lastName: "Qodirova",
    middleName: "Anvarovna",
    role: "TASHKILOT_RAHBAR",
    organizationId: "2",
    position: "Ta'lim bo'limi boshlig'i",
    status: "KUTILMOQDA",
    oneidConnected: false,
    createdAt: "2024-03-01",
  },
  {
    id: "6",
    pnfl: "36789012345678",
    firstName: "Bekzod",
    lastName: "Mamatov",
    middleName: "Sherzodovich",
    role: "TASHKILOT_MASUL",
    organizationId: "3",
    position: "Mutaxassis",
    status: "BLOKLANGAN",
    oneidConnected: true,
    createdAt: "2024-01-25",
    activatedAt: "2024-01-26",
  },
  {
    id: "7",
    pnfl: "37890123456789",
    firstName: "Shoxrux",
    lastName: "Normatov",
    middleName: "Ulug'bekovich",
    phone: "+998904567890",
    role: "ADMIN",
    position: "Tizim administratori",
    status: "FAOL",
    oneidConnected: true,
    createdAt: "2024-01-01",
    activatedAt: "2024-01-01",
  },
]

export const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Kommunal xo'jalik bo'limi",
    sector: "KOMMUNAL_SOHA",
    isActive: true,
    tasksCount: 45,
    completedTasks: 38,
    rating: 84,
  },
  {
    id: "2",
    name: "Ta'lim bo'limi",
    sector: "TALIM",
    isActive: true,
    tasksCount: 32,
    completedTasks: 30,
    rating: 94,
  },
  {
    id: "3",
    name: "Sog'liqni saqlash bo'limi",
    sector: "SOGLIQNI_SAQLASH",
    isActive: true,
    tasksCount: 28,
    completedTasks: 22,
    rating: 79,
  },
  {
    id: "4",
    name: "Moliya bo'limi",
    sector: "IQTISODIYOT_BIZNES",
    isActive: true,
    tasksCount: 18,
    completedTasks: 17,
    rating: 94,
  },
  {
    id: "5",
    name: "Yoshlar ishlari bo'limi",
    sector: "YOSHLAR",
    isActive: true,
    tasksCount: 12,
    completedTasks: 10,
    rating: 83,
  },
  {
    id: "6",
    name: "Bandlik markazi",
    sector: "BANDLIK_MEHNAT",
    isActive: true,
    tasksCount: 25,
    completedTasks: 20,
    rating: 80,
  },
  {
    id: "7",
    name: "Ijtimoiy himoya markazi",
    sector: "IJTIMOIY_HIMOYA",
    isActive: true,
    tasksCount: 35,
    completedTasks: 28,
    rating: 80,
  },
  {
    id: "8",
    name: "Ekologiya inspeksiyasi",
    sector: "EKOLOGIYA",
    isActive: true,
    tasksCount: 15,
    completedTasks: 12,
    rating: 80,
  },
  {
    id: "9",
    name: "Transport bo'limi",
    sector: "TRANSPORT",
    isActive: true,
    tasksCount: 22,
    completedTasks: 18,
    rating: 82,
  },
  {
    id: "10",
    name: "Soliq inspeksiyasi",
    sector: "SOLIQLAR",
    isActive: true,
    tasksCount: 30,
    completedTasks: 27,
    rating: 90,
  },
]

export const mockTasks: Task[] = [
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
    location: { lat: 40.123, lng: 67.456 },
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
  {
    id: "3",
    title: "Suv ta'minoti tizimini yangilash",
    description: "Janubiy mahallada suv quvurlari almashtirish va yangi nasoslar o'rnatish",
    priority: "MUHIM_SHOSHILINCH",
    status: "MUDDATI_KECH",
    sector: "KOMMUNAL_SOHA",
    deadline: "2026-01-15",
    createdAt: "2026-01-01",
    createdBy: "2",
    organizations: ["1", "3"],
  },
  {
    id: "4",
    title: "Tibbiyot punkti jihozlash",
    description: "Qishloq tibbiyot punktiga zamonaviy tibbiy jihozlar yetkazib berish",
    priority: "ODDIY",
    status: "NAZORATDAN_YECHILDI",
    sector: "SOGLIQNI_SAQLASH",
    deadline: "2026-01-20",
    createdAt: "2025-12-20",
    createdBy: "1",
    organizations: ["3"],
  },
  {
    id: "5",
    title: "Yoshlar markazi ochish",
    description: "Yangi yoshlar markazi binosi qurilishini yakunlash va jihozlash",
    priority: "MUHIM",
    status: "YANGI",
    sector: "YOSHLAR",
    deadline: "2026-03-01",
    createdAt: "2026-01-17",
    createdBy: "1",
    organizations: ["5", "4"],
  },
  {
    id: "6",
    title: "Elektr tarmog'ini kuchaytirish",
    description: "Shimoliy tumanda elektr tarmoqlarini modernizatsiya qilish",
    priority: "MUHIM",
    status: "IJRODA",
    sector: "KOMMUNAL_SOHA",
    deadline: "2026-02-15",
    createdAt: "2026-01-12",
    createdBy: "2",
    organizations: ["1"],
  },
  {
    id: "7",
    title: "Ishsizlarni ro'yxatga olish",
    description: "Bandlik markazida ishsiz fuqarolarni qayta ro'yxatga olish va treninglar tashkil etish",
    priority: "ODDIY",
    status: "IJRODA",
    sector: "BANDLIK_MEHNAT",
    deadline: "2026-02-20",
    createdAt: "2026-01-15",
    createdBy: "2",
    organizations: ["6"],
  },
  {
    id: "8",
    title: "Ijtimoiy yordam ko'rsatish",
    description: "Kam ta'minlangan oilalarga ijtimoiy yordam paketlarini yetkazish",
    priority: "MUHIM",
    status: "BAJARILDI",
    sector: "IJTIMOIY_HIMOYA",
    deadline: "2026-01-18",
    createdAt: "2026-01-08",
    createdBy: "1",
    organizations: ["7"],
  },
  {
    id: "9",
    title: "Ekologik tekshiruv o'tkazish",
    description: "Sanoat korxonalarida ekologik monitoring o'tkazish",
    priority: "ODDIY",
    status: "YANGI",
    sector: "EKOLOGIYA",
    deadline: "2026-02-28",
    createdAt: "2026-01-16",
    createdBy: "2",
    organizations: ["8"],
  },
  {
    id: "10",
    title: "Transport yo'nalishlarini optimallashtirish",
    description: "Jamoat transporti marshrutlarini qayta ko'rib chiqish va yangilash",
    priority: "MUHIM",
    status: "IJRODA",
    sector: "TRANSPORT",
    deadline: "2026-02-10",
    createdAt: "2026-01-14",
    createdBy: "1",
    organizations: ["9"],
  },
]

export const mockTaskExecutions: TaskExecution[] = [
  {
    id: "1",
    taskId: "1",
    executedBy: "3",
    actionType: "IJROGA_OLINDI",
    comment: "Topshiriq qabul qilindi, materiallar buyurtma qilindi",
    createdAt: "2026-01-11T09:00:00",
  },
  {
    id: "2",
    taskId: "2",
    executedBy: "5",
    actionType: "HISOBOT_TOPSHIRILDI",
    comment: "Ta'mirlash ishlari yakunlandi",
    attachments: ["hisobot.pdf", "rasimlar.zip"],
    createdAt: "2026-01-24T16:30:00",
  },
  {
    id: "3",
    taskId: "2",
    executedBy: "1",
    actionType: "NAZORATDAN_YECHILDI",
    comment: "Ishlar qoniqarli bajarilgan",
    createdAt: "2026-01-25T10:00:00",
  },
]

export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    taskId: "1",
    senderId: "1",
    type: "system",
    content: "Topshiriq yaratildi",
    createdAt: "2026-01-10T09:00:00",
  },
  {
    id: "2",
    taskId: "1",
    senderId: "3",
    type: "text",
    content: "Topshiriq qabul qilindi. Materiallar buyurtma qilindi, 3 kun ichida yetkazib beriladi.",
    createdAt: "2026-01-11T09:15:00",
  },
  {
    id: "3",
    taskId: "1",
    senderId: "1",
    type: "text",
    content: "Yaxshi, ish jarayonini kuzatib boring va har kuni hisobot bering.",
    createdAt: "2026-01-11T10:30:00",
  },
  {
    id: "4",
    taskId: "1",
    senderId: "3",
    type: "file",
    content: "Materiallar yetkazib berildi",
    attachments: ["material-qabul-akti.pdf"],
    createdAt: "2026-01-14T14:00:00",
  },
  {
    id: "5",
    taskId: "1",
    senderId: "4",
    type: "text",
    content: "Ta'mirlash ishlari boshlandi. 200 metr qoplama yotqizildi.",
    createdAt: "2026-01-15T16:45:00",
  },
  {
    id: "6",
    taskId: "2",
    senderId: "1",
    type: "system",
    content: "Topshiriq yaratildi",
    createdAt: "2026-01-05T08:00:00",
  },
  {
    id: "7",
    taskId: "2",
    senderId: "5",
    type: "text",
    content: "Sport zali ta'mirlash ishlari yakunlandi. Oshxona ishlari davom etmoqda.",
    createdAt: "2026-01-20T11:00:00",
  },
  {
    id: "8",
    taskId: "2",
    senderId: "5",
    type: "file",
    content: "Yakuniy hisobot",
    attachments: ["hisobot.pdf", "rasmlar.zip"],
    createdAt: "2026-01-24T16:30:00",
  },
  {
    id: "9",
    taskId: "2",
    senderId: "1",
    type: "system",
    content: "Nazoratdan yechildi: Ishlar qoniqarli bajarilgan",
    createdAt: "2026-01-25T10:00:00",
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "task_new",
    title: "Yangi topshiriq",
    description: "Ichki yo'llarni ta'mirlash - muddat: 01.02.2026",
    read: false,
    createdAt: "2026-01-17T08:00:00",
    taskId: "1",
  },
  {
    id: "2",
    type: "task_completed",
    title: "Hisobot topshirildi",
    description: "Maktab binosi ta'mirlash - tekshiring",
    read: false,
    createdAt: "2026-01-17T07:30:00",
    taskId: "2",
  },
  {
    id: "3",
    type: "task_overdue",
    title: "Muddat o'tdi",
    description: "Suv ta'minoti tizimi - 2 kun kechikish",
    read: false,
    createdAt: "2026-01-17T06:00:00",
    taskId: "3",
  },
  {
    id: "4",
    type: "user_added",
    title: "Yangi foydalanuvchi",
    description: "Nodira Qodirova tizimga qo'shildi",
    read: true,
    createdAt: "2026-01-16T14:00:00",
    userId: "5",
  },
  {
    id: "5",
    type: "task_new",
    title: "Yangi topshiriq",
    description: "Yoshlar markazi ochish - muddat: 01.03.2026",
    read: true,
    createdAt: "2026-01-16T10:00:00",
    taskId: "5",
  },
  {
    id: "6",
    type: "system",
    title: "Tizim yangilandi",
    description: "Yangi funksiyalar qo'shildi: Chat va Muddat uzaytirish",
    read: true,
    createdAt: "2026-01-15T09:00:00",
  },
]

export const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    userId: "1",
    action: "USER_CREATED",
    details: "Tashkilot rahbari qo'shildi",
    targetType: "user",
    targetId: "5",
    createdAt: "2026-01-16T14:00:00",
  },
  {
    id: "2",
    userId: "1",
    action: "TASK_CREATED",
    details: "Yangi topshiriq yaratildi",
    targetType: "task",
    targetId: "5",
    createdAt: "2026-01-17T08:00:00",
  },
  {
    id: "3",
    userId: "1",
    action: "TASK_CLOSED",
    details: "Topshiriq nazoratdan yechildi",
    targetType: "task",
    targetId: "2",
    createdAt: "2026-01-25T10:00:00",
  },
]

export const mockSystemSettings: SystemSettings = {
  telegramBotToken: "",
  telegramBotUsername: "",
  emailSmtpHost: "smtp.gov.uz",
  emailSmtpPort: 587,
  emailSenderAddress: "noreply@hokimlik.uz",
}

export function getOrganizationById(id: string) {
  return mockOrganizations.find((org) => org.id === id)
}

export function getUserById(id: string) {
  return mockUsers.find((user) => user.id === id)
}

export function maskPnfl(pnfl: string) {
  return `***${pnfl.slice(-4)}`
}

export function getChatMessagesByTaskId(taskId: string) {
  return mockChatMessages.filter((msg) => msg.taskId === taskId)
}

export function getUnreadNotificationsCount() {
  return mockNotifications.filter((n) => !n.read).length
}

export function canUserAddRole(currentUserRole: UserRole, targetRole: UserRole): boolean {
  const hierarchy: Record<UserRole, UserRole[]> = {
    ADMIN: ["TUMAN_HOKIMI", "HOKIMLIK_MASUL", "TASHKILOT_RAHBAR", "TASHKILOT_MASUL"],
    TUMAN_HOKIMI: ["HOKIMLIK_MASUL", "TASHKILOT_RAHBAR", "TASHKILOT_MASUL"],
    HOKIMLIK_MASUL: ["TASHKILOT_RAHBAR", "TASHKILOT_MASUL"],
    TASHKILOT_RAHBAR: ["TASHKILOT_MASUL"],
    TASHKILOT_MASUL: [],
  }
  return hierarchy[currentUserRole]?.includes(targetRole) || false
}

export function canUserPerformAction(
  userRole: UserRole,
  action:
    | "create_task"
    | "close_task"
    | "reassign_task"
    | "extend_deadline"
    | "create_org"
    | "add_user"
    | "admin_settings",
): boolean {
  const permissions: Record<string, UserRole[]> = {
    create_task: ["ADMIN", "TUMAN_HOKIMI", "HOKIMLIK_MASUL"],
    close_task: ["ADMIN", "TUMAN_HOKIMI"],
    reassign_task: ["ADMIN", "TUMAN_HOKIMI"],
    extend_deadline: ["ADMIN", "TUMAN_HOKIMI"],
    create_org: ["ADMIN", "TUMAN_HOKIMI", "HOKIMLIK_MASUL"],
    add_user: ["ADMIN", "TUMAN_HOKIMI", "HOKIMLIK_MASUL", "TASHKILOT_RAHBAR"],
    admin_settings: ["ADMIN"],
  }
  return permissions[action]?.includes(userRole) || false
}

export function getTasksBySector(): Record<Sector, number> {
  const result = {} as Record<Sector, number>
  for (const sector of Object.keys(sectorLabels) as Sector[]) {
    result[sector] = mockTasks.filter((t) => t.sector === sector).length
  }
  return result
}

export function getSectorStatistics() {
  const sectors = Object.keys(sectorLabels) as Sector[]
  return sectors
    .map((sector) => {
      const tasks = mockTasks.filter((t) => t.sector === sector)
      const completed = tasks.filter((t) => t.status === "BAJARILDI" || t.status === "NAZORATDAN_YECHILDI").length
      const late = tasks.filter((t) => t.status === "MUDDATI_KECH").length
      return {
        sector,
        label: sectorLabels[sector],
        total: tasks.length,
        completed,
        late,
        inProgress: tasks.length - completed - late,
        completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
      }
    })
    .filter((s) => s.total > 0)
}
