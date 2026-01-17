"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_1 = require("./data");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const API_PREFIX = "/api";
app.get(`${API_PREFIX}/users`, (req, res) => {
    res.json(data_1.users);
});
app.get(`${API_PREFIX}/users/:id`, (req, res) => {
    const u = data_1.users.find((x) => x.id === req.params.id);
    if (!u)
        return res.status(404).json({ message: "User not found" });
    res.json(u);
});
app.get(`${API_PREFIX}/organizations`, (req, res) => {
    res.json(data_1.organizations);
});
app.get(`${API_PREFIX}/tasks`, (req, res) => {
    res.json(data_1.tasks);
});
app.get(`${API_PREFIX}/tasks/:id`, (req, res) => {
    const t = data_1.tasks.find((x) => x.id === req.params.id);
    if (!t)
        return res.status(404).json({ message: "Task not found" });
    res.json(t);
});
app.post(`${API_PREFIX}/tasks`, (req, res) => {
    const body = req.body;
    const id = String(data_1.tasks.length + 1);
    const newTask = { id, ...body };
    data_1.tasks.push(newTask);
    res.status(201).json(newTask);
});
app.get(`${API_PREFIX}/tasks/:id/chat`, (req, res) => {
    const msgs = data_1.chatMessages.filter((m) => m.taskId === req.params.id);
    res.json(msgs);
});
app.post(`${API_PREFIX}/tasks/:id/chat`, (req, res) => {
    const { senderId, type, content } = req.body;
    const id = String(data_1.chatMessages.length + 1);
    const msg = { id, taskId: req.params.id, senderId, type, content, createdAt: new Date().toISOString() };
    data_1.chatMessages.push(msg);
    res.status(201).json(msg);
});
app.get(`${API_PREFIX}/tasks/:id/executions`, (req, res) => {
    const ex = data_1.taskExecutions.filter((e) => e.taskId === req.params.id);
    res.json(ex);
});
app.post(`${API_PREFIX}/tasks/:id/executions`, (req, res) => {
    const { executedBy, actionType, comment } = req.body;
    const id = String(data_1.taskExecutions.length + 1);
    const ex = { id, taskId: req.params.id, executedBy, actionType, comment, createdAt: new Date().toISOString() };
    data_1.taskExecutions.push(ex);
    // add audit log
    const aId = String(data_1.auditLogs.length + 1);
    data_1.auditLogs.push({ id: aId, userId: executedBy, action: actionType || "TASK_EXECUTED", details: comment || "", targetType: "task", targetId: req.params.id, createdAt: new Date().toISOString() });
    res.status(201).json(ex);
});
app.get(`${API_PREFIX}/notifications`, (req, res) => {
    res.json(data_1.notifications);
});
app.get(`${API_PREFIX}/notifications/unread-count`, (req, res) => {
    const count = data_1.notifications.filter((n) => !n.read).length;
    res.json({ unread: count });
});
app.get(`${API_PREFIX}/audit`, (req, res) => {
    res.json(data_1.auditLogs);
});
app.get(`${API_PREFIX}/settings`, (req, res) => {
    res.json(data_1.systemSettings);
});
app.post(`${API_PREFIX}/settings`, (req, res) => {
    const body = req.body || {};
    Object.assign(data_1.systemSettings, body);
    const aId = String(data_1.auditLogs.length + 1);
    data_1.auditLogs.push({ id: aId, userId: body.userId || "system", action: "SETTINGS_UPDATED", details: JSON.stringify(body), targetType: "settings", targetId: "", createdAt: new Date().toISOString() });
    res.json(data_1.systemSettings);
});
// Users create / update
app.post(`${API_PREFIX}/users`, (req, res) => {
    const body = req.body;
    const id = String(data_1.users.length + 1);
    const u = { id, ...body };
    data_1.users.push(u);
    res.status(201).json(u);
});
app.put(`${API_PREFIX}/users/:id`, (req, res) => {
    const idx = data_1.users.findIndex((u) => u.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ message: "User not found" });
    data_1.users[idx] = { ...data_1.users[idx], ...req.body };
    res.json(data_1.users[idx]);
});
// mark notification read
app.patch(`${API_PREFIX}/notifications/:id/read`, (req, res) => {
    const n = data_1.notifications.find((x) => x.id === req.params.id);
    if (!n)
        return res.status(404).json({ message: "Notification not found" });
    n.read = true;
    res.json(n);
});
// update task
app.put(`${API_PREFIX}/tasks/:id`, (req, res) => {
    const idx = data_1.tasks.findIndex((t) => t.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ message: "Task not found" });
    data_1.tasks[idx] = { ...data_1.tasks[idx], ...req.body };
    const aId = String(data_1.auditLogs.length + 1);
    data_1.auditLogs.push({ id: aId, userId: req.body.updatedBy || "system", action: "TASK_UPDATED", details: JSON.stringify(req.body), targetType: "task", targetId: req.params.id, createdAt: new Date().toISOString() });
    res.json(data_1.tasks[idx]);
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend API listening on http://localhost:${port}${API_PREFIX}`);
});
