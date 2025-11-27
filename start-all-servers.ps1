# Script para iniciar todos los servidores necesarios
# Backend Spring Boot + Transbank Proxy + Frontend React

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Iniciando Aplicación HuertoHogar Completa" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Rutas
$baseDir = "c:\Users\Franco\Downloads\fullstack api terminada"
$backendDir = "$baseDir\demo"
$frontendDir = "$baseDir\HuertoHogarReact-FINAL"

Write-Host "1️⃣  Iniciando Backend Spring Boot (Puerto 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; Write-Host '🚀 Backend Spring Boot' -ForegroundColor Green; .\mvnw spring-boot:run"

Write-Host "   Esperando 8 segundos para que el backend inicie..." -ForegroundColor Gray
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "2️⃣  Iniciando Servidor Transbank Proxy (Puerto 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; Write-Host '💳 Transbank Proxy Server' -ForegroundColor Magenta; npm run transbank-proxy"

Write-Host "   Esperando 3 segundos para que el proxy inicie..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "3️⃣  Iniciando Frontend React (Puerto 3000)..." -ForegroundColor Yellow
Write-Host ""

cd $frontendDir
npm start

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ Todos los servidores iniciados" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor White
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:   http://localhost:8080" -ForegroundColor Cyan
Write-Host "  Transbank: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
