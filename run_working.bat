@echo off
chcp 65001 >nul
title E-Hokimiyat Frontend

echo 🚀 E-Hokimiyat Frontend ishga tushirilmoqda...
echo 📁 Papka: %CD%
echo ⏰ Vaqt: %date% %time%
echo.

echo 📂 Frontend papkasiga o'tilmoqda...
cd frotend
echo 📂 Yangi papka: %CD%
echo.

echo 📋 Node.js versiyasi:
node --version
echo.

echo 📦 npm versiyasi:
npm --version
echo.

if not exist "node_modules" (
    echo 📥 Dependencies o'rnatilmoqda...
    npm install
    echo.
)

echo 🌐 Development server ishga tushirilmoqda...
echo 🔗 URL: http://localhost:3000
echo ⚠️  Server to'xtatish uchun: Ctrl+C
echo.

npm run dev

pause
