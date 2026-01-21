import { mockUsers, mockOrganizations, mockTasks, mockNotifications, mockAppeals } from "./mock-data"

export { mockAppeals }

export async function getNotifications() {
  // For demo, return mock data
  return Promise.resolve(mockNotifications)
}

export async function getUnreadNotificationsCount() {
  // For demo, return mock count
  return Promise.resolve(mockNotifications.filter(n => !n.read).length)
}

export async function getUsers() {
  // For demo, return mock data
  return Promise.resolve(mockUsers)
}

export async function getUserById(id: string) {
  // For demo, return mock data
  return Promise.resolve(mockUsers.find(user => user.id === id))
}

export async function getOrganizations() {
  // For demo, return mock data
  return Promise.resolve(mockOrganizations)
}

export async function getTasks() {
  // For demo, return mock data
  return Promise.resolve(mockTasks)
}

export async function getTaskById(id: string) {
  // For demo, return mock data
  return Promise.resolve(mockTasks.find(task => task.id === id))
}

export async function getTaskChat(taskId: string) {
  // For demo, return empty chat
  return Promise.resolve([])
}

export async function getAppeals() {
  // For demo, return mock data
  return Promise.resolve(mockAppeals)
}

export async function getAppealById(id: string) {
  // For demo, return mock data
  return Promise.resolve(mockAppeals.find(appeal => appeal.id === id))
}

export async function getNotificationById(id: string) {
  // For demo, return mock data
  return Promise.resolve(mockNotifications.find(notification => notification.id === id))
}

export async function postTaskChat(taskId: string, body: any) {
  // For demo, just return success
  return Promise.resolve({ success: true })
}

export async function updateTaskStatus(taskId: string, status: string) {
  // For demo, just return success
  return Promise.resolve({ success: true })
}

export async function createTask(task: any) {
  // For demo, just return success
  return Promise.resolve({ success: true, id: Date.now().toString() })
}

export async function createUser(user: any) {
  // For demo, just return success
  return Promise.resolve({ success: true, id: Date.now().toString() })
}

export async function updateUser(id: string, user: any) {
  // For demo, just return success
  return Promise.resolve({ success: true })
}

export async function deleteUser(id: string) {
  // For demo, just return success
  return Promise.resolve({ success: true })
}

export async function createOrganization(org: any) {
  // For demo, just return success
  return Promise.resolve({ success: true, id: Date.now().toString() })
}

export async function updateOrganization(id: string, org: any) {
  // For demo, just return success
  return Promise.resolve({ success: true })
}

export async function deleteOrganization(id: string) {
  // For demo, just return success
  return Promise.resolve({ success: true })
}
