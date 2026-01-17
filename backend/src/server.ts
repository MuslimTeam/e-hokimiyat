import express from "express"
import cors from "cors"
import { users, organizations, tasks, chatMessages, notifications, taskExecutions, auditLogs, systemSettings } from "./data"

const app = express()
app.use(cors())
app.use(express.json())

const API_PREFIX = "/api"

app.get(`${API_PREFIX}/users`, (req, res) => {
  res.json(users)
})

app.get(`${API_PREFIX}/users/:id`, (req, res) => {
  const u = users.find((x) => x.id === req.params.id)
  if (!u) return res.status(404).json({ message: "User not found" })
  res.json(u)
})

app.get(`${API_PREFIX}/organizations`, (req, res) => {
  res.json(organizations)
})

app.get(`${API_PREFIX}/tasks`, (req, res) => {
  res.json(tasks)
})

app.get(`${API_PREFIX}/tasks/:id`, (req, res) => {
  const t = tasks.find((x) => x.id === req.params.id)
  if (!t) return res.status(404).json({ message: "Task not found" })
  res.json(t)
})

app.post(`${API_PREFIX}/tasks`, (req, res) => {
  const body = req.body
  const id = String(tasks.length + 1)
  const newTask = { id, ...body }
  tasks.push(newTask)
  res.status(201).json(newTask)
})

app.get(`${API_PREFIX}/tasks/:id/chat`, (req, res) => {
  const msgs = chatMessages.filter((m) => m.taskId === req.params.id)
  res.json(msgs)
})

app.post(`${API_PREFIX}/tasks/:id/chat`, (req, res) => {
  const { senderId, type, content } = req.body
  const id = String(chatMessages.length + 1)
  const msg = { id, taskId: req.params.id, senderId, type, content, createdAt: new Date().toISOString() }
  chatMessages.push(msg)
  res.status(201).json(msg)
})

app.get(`${API_PREFIX}/tasks/:id/executions`, (req, res) => {
  const ex = taskExecutions.filter((e) => e.taskId === req.params.id)
  res.json(ex)
})

app.post(`${API_PREFIX}/tasks/:id/executions`, (req, res) => {
  const { executedBy, actionType, comment } = req.body
  const id = String(taskExecutions.length + 1)
  const ex = { id, taskId: req.params.id, executedBy, actionType, comment, createdAt: new Date().toISOString() }
  taskExecutions.push(ex)
  // add audit log
  const aId = String(auditLogs.length + 1)
  auditLogs.push({ id: aId, userId: executedBy, action: actionType || "TASK_EXECUTED", details: comment || "", targetType: "task", targetId: req.params.id, createdAt: new Date().toISOString() })
  res.status(201).json(ex)
})

app.get(`${API_PREFIX}/notifications`, (req, res) => {
  res.json(notifications)
})

app.get(`${API_PREFIX}/notifications/unread-count`, (req, res) => {
  const count = notifications.filter((n) => !n.read).length
  res.json({ unread: count })
})

app.get(`${API_PREFIX}/audit`, (req, res) => {
  res.json(auditLogs)
})

app.get(`${API_PREFIX}/settings`, (req, res) => {
  res.json(systemSettings)
})

app.post(`${API_PREFIX}/settings`, (req, res) => {
  const body = req.body || {}
  Object.assign(systemSettings, body)
  const aId = String(auditLogs.length + 1)
  auditLogs.push({ id: aId, userId: body.userId || "system", action: "SETTINGS_UPDATED", details: JSON.stringify(body), targetType: "settings", targetId: "", createdAt: new Date().toISOString() })
  res.json(systemSettings)
})

// Users create / update
app.post(`${API_PREFIX}/users`, (req, res) => {
  const body = req.body
  const id = String(users.length + 1)
  const u = { id, ...body }
  users.push(u)
  res.status(201).json(u)
})

app.put(`${API_PREFIX}/users/:id`, (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: "User not found" })
  users[idx] = { ...users[idx], ...req.body }
  res.json(users[idx])
})

// mark notification read
app.patch(`${API_PREFIX}/notifications/:id/read`, (req, res) => {
  const n = notifications.find((x) => x.id === req.params.id)
  if (!n) return res.status(404).json({ message: "Notification not found" })
  n.read = true
  res.json(n)
})

// update task
app.put(`${API_PREFIX}/tasks/:id`, (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: "Task not found" })
  tasks[idx] = { ...tasks[idx], ...req.body }
  const aId = String(auditLogs.length + 1)
  auditLogs.push({ id: aId, userId: req.body.updatedBy || "system", action: "TASK_UPDATED", details: JSON.stringify(req.body), targetType: "task", targetId: req.params.id, createdAt: new Date().toISOString() })
  res.json(tasks[idx])
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend API listening on http://localhost:${port}${API_PREFIX}`)
})
