export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001"

export async function getNotifications() {
  const res = await fetch(`${API_BASE}/api/notifications`)
  if (!res.ok) throw new Error("Failed to fetch notifications")
  return res.json()
}

export async function getUnreadNotificationsCount() {
  const res = await fetch(`${API_BASE}/api/notifications/unread-count`)
  if (!res.ok) throw new Error("Failed to fetch unread count")
  const data = await res.json()
  return data.unread ?? 0
}

export async function getUsers() {
  const res = await fetch(`${API_BASE}/api/users`)
  if (!res.ok) throw new Error("Failed to fetch users")
  return res.json()
}

export async function getUserById(id: string) {
  const res = await fetch(`${API_BASE}/api/users/${id}`)
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json()
}

export async function getOrganizations() {
  const res = await fetch(`${API_BASE}/api/organizations`)
  if (!res.ok) throw new Error("Failed to fetch organizations")
  return res.json()
}

export async function getTasks() {
  const res = await fetch(`${API_BASE}/api/tasks`)
  if (!res.ok) throw new Error("Failed to fetch tasks")
  return res.json()
}

export async function getTaskById(id: string) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`)
  if (!res.ok) throw new Error("Failed to fetch task")
  return res.json()
}

export async function getTaskChat(taskId: string) {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}/chat`)
  if (!res.ok) throw new Error("Failed to fetch chat messages")
  return res.json()
}

export async function postTaskChat(taskId: string, body: any) {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Failed to post chat message")
  return res.json()
}

export async function getAuditLogs() {
  const res = await fetch(`${API_BASE}/api/audit`)
  if (!res.ok) throw new Error("Failed to fetch audit logs")
  return res.json()
}

export async function getSettings() {
  const res = await fetch(`${API_BASE}/api/settings`)
  if (!res.ok) throw new Error("Failed to fetch settings")
  return res.json()
}

export async function getTaskExecutions(taskId: string) {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}/executions`)
  if (!res.ok) throw new Error("Failed to fetch task executions")
  return res.json()
}

export async function postTaskExecution(taskId: string, body: any) {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}/executions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Failed to post task execution")
  return res.json()
}

export async function createUser(body: any) {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Failed to create user")
  return res.json()
}

export async function updateUser(id: string, body: any) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Failed to update user")
  return res.json()
}

export async function markNotificationRead(id: string) {
  const res = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
    method: "PATCH",
  })
  if (!res.ok) throw new Error("Failed to mark notification read")
  return res.json()
}

export async function updateTask(id: string, body: any) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Failed to update task")
  return res.json()
}

export async function postSettings(body: any) {
  const res = await fetch(`${API_BASE}/api/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Failed to update settings")
  return res.json()
}

// Analytics endpoints
export async function getAnalyticsDashboard() {
  const res = await fetch(`${API_BASE}/api/analytics/dashboard`)
  if (!res.ok) throw new Error("Failed to fetch dashboard analytics")
  return res.json()
}

export async function getAnalyticsOrganizations() {
  const res = await fetch(`${API_BASE}/api/analytics/organizations`)
  if (!res.ok) throw new Error("Failed to fetch organization analytics")
  return res.json()
}

export async function getAnalyticsUsers() {
  const res = await fetch(`${API_BASE}/api/analytics/users`)
  if (!res.ok) throw new Error("Failed to fetch user analytics")
  return res.json()
}

export async function getAnalyticsTrends() {
  const res = await fetch(`${API_BASE}/api/analytics/trends`)
  if (!res.ok) throw new Error("Failed to fetch task trends")
  return res.json()
}

// Appeals endpoints
export async function getAppeals(params?: {
  search?: string
  status?: string
  category?: string
  priority?: string
  district?: string
  page?: number
  limit?: number
}) {
  const query = new URLSearchParams()
  if (params?.search) query.append('search', params.search)
  if (params?.status) query.append('status', params.status)
  if (params?.category) query.append('category', params.category)
  if (params?.priority) query.append('priority', params.priority)
  if (params?.district) query.append('district', params.district)
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())

  const res = await fetch(`${API_BASE}/api/appeals?${query}`)
  if (!res.ok) throw new Error("Failed to fetch appeals")
  return res.json()
}

export async function getAppealById(id: string) {
  const res = await fetch(`${API_BASE}/api/appeals/${id}`)
  if (!res.ok) throw new Error("Failed to fetch appeal")
  return res.json()
}

export async function getAppealStats() {
  const res = await fetch(`${API_BASE}/api/appeals/stats/summary`)
  if (!res.ok) throw new Error("Failed to fetch appeal stats")
  return res.json()
}

export async function getAppealOptions() {
  const res = await fetch(`${API_BASE}/api/appeals/options/lists`)
  if (!res.ok) throw new Error("Failed to fetch appeal options")
  return res.json()
}
