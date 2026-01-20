const express = require('express')
const cors = require('cors')
const { users, organizations, tasks, chatMessages, notifications, taskExecutions, auditLogs, systemSettings } = require('./data')

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

app.get(`${API_PREFIX}/organizations/:id`, (req, res) => {
  const org = organizations.find((x) => x.id === req.params.id)
  if (!org) return res.status(404).json({ message: "Organization not found" })
  res.json(org)
})

app.get(`${API_PREFIX}/tasks`, (req, res) => {
  res.json(tasks)
})

app.get(`${API_PREFIX}/tasks/:id`, (req, res) => {
  const task = tasks.find((x) => x.id === req.params.id)
  if (!task) return res.status(404).json({ message: "Task not found" })
  res.json(task)
})

app.get(`${API_PREFIX}/chat-messages`, (req, res) => {
  res.json(chatMessages)
})

app.get(`${API_PREFIX}/notifications`, (req, res) => {
  res.json(notifications)
})

app.get(`${API_PREFIX}/task-executions`, (req, res) => {
  res.json(taskExecutions)
})

app.get(`${API_PREFIX}/audit-logs`, (req, res) => {
  res.json(auditLogs)
})

app.get(`${API_PREFIX}/system-settings`, (req, res) => {
  res.json(systemSettings)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
