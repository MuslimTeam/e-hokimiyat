// Types for E-Hokimiyat platform

export interface User {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phone: string
  pnfl: string
  position: string
  role: 'ADMIN' | 'MODERATOR' | 'OPERATOR' | 'USER'
  status: 'ACTIVE' | 'INACTIVE'
  organization?: Organization
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: string
  name: string
  type: string
  region: string
  district: string
  address: string
  phone: string
  email: string
  directorName: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: string
  assignedTo?: User
  createdBy: User
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface Appeal {
  id: string
  citizenName: string
  citizenPhone: string
  citizenEmail: string
  subject: string
  description: string
  category: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
  assignedTo?: User
  organization?: Organization
  district: string
  address: string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  read: boolean
  userId: string
  createdAt: string
}

export interface ApiResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  success: boolean
  message?: string
}

export interface FilterOptions {
  status: Record<string, string>
  priority: Record<string, string>
  category: Record<string, string>
  districts: string[]
}

export interface Stats {
  total: number
  pending: number
  inProgress: number
  resolved: number
  completed?: number
}

export interface DashboardStats {
  users: number
  tasks: number
  appeals: number
  organizations: number
  notifications: number
}
