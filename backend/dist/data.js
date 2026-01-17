"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemSettings = exports.auditLogs = exports.taskExecutions = exports.notifications = exports.chatMessages = exports.tasks = exports.organizations = exports.users = void 0;
exports.users = [
    { id: "1", pnfl: "31234567890123", firstName: "Abdulla", lastName: "Karimov", role: "TUMAN_HOKIMI" },
    { id: "2", pnfl: "32345678901234", firstName: "Dilshod", lastName: "Rahimov", role: "HOKIMLIK_MASUL" },
];
exports.organizations = [
    { id: "1", name: "Kommunal xo'jalik bo'limi", sector: "KOMMUNAL_SOHA" },
    { id: "2", name: "Ta'lim bo'limi", sector: "TALIM" },
];
exports.tasks = [
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
];
exports.chatMessages = [
    { id: "1", taskId: "1", senderId: "1", type: "system", content: "Topshiriq yaratildi", createdAt: "2026-01-10T09:00:00" },
    { id: "2", taskId: "1", senderId: "3", type: "text", content: "Topshiriq qabul qilindi.", createdAt: "2026-01-11T09:15:00" },
];
exports.notifications = [
    { id: "1", type: "task_new", title: "Yangi topshiriq", description: "Ichki yo'llarni ta'mirlash - muddat: 01.02.2026", read: false, createdAt: "2026-01-17T08:00:00", taskId: "1" },
];
exports.taskExecutions = [
    {
        id: "1",
        taskId: "1",
        executedBy: "3",
        actionType: "IJROGA_OLINDI",
        comment: "Topshiriq qabul qilindi, materiallar buyurtma qilindi",
        createdAt: "2026-01-11T09:00:00",
    },
];
exports.auditLogs = [
    {
        id: "1",
        userId: "1",
        action: "TASK_CREATED",
        details: "Yangi topshiriq yaratildi",
        targetType: "task",
        targetId: "1",
        createdAt: "2026-01-17T08:00:00",
    },
];
exports.systemSettings = {
    telegramBotToken: "",
    telegramBotUsername: "",
    emailSmtpHost: "smtp.gov.uz",
    emailSmtpPort: 587,
    emailSenderAddress: "noreply@hokimlik.uz",
};
