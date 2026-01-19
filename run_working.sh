#!/bin/bash

# E-Hokimiyat Frontend Run Script
# This script starts the development server

echo "🚀 E-Hokimiyat Frontend ishga tushirilmoqda..."
echo "📁 Papka: $(pwd)"
echo "⏰ Vaqt: $(date)"
echo ""

# Go to frontend directory
cd frotend
echo "📂 Frontend papkasiga o'tildi: $(pwd)"
echo ""

# Node.js version check
echo "📋 Node.js versiyasi:"
node --version
echo ""

# npm version check  
echo "📦 npm versiyasi:"
npm --version
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📥 Dependencies o'rnatilmoqda..."
    npm install
    echo ""
fi

# Start development server
echo "🌐 Development server ishga tushirilmoqda..."
echo "🔗 URL: http://localhost:3000"
echo "⚠️  Server to'xtatish uchun: Ctrl+C"
echo ""

npm run dev
