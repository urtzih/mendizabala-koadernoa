#!/usr/bin/env pwsh
# 🚀 Script de instalación y configuración inicial
# Uso: .\setup.ps1

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       Mendizabala LHII - Script de instalación inicial       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Node.js
Write-Host "✓ Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "  ✓ Node.js $nodeVersion" -ForegroundColor Green
    Write-Host "  ✓ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js no está instalado" -ForegroundColor Red
    Write-Host "  Descarga desde https://nodejs.org" -ForegroundColor Red
    exit 1
}

# 2. Verificar PostgreSQL
Write-Host ""
Write-Host "✓ Verificando PostgreSQL..." -ForegroundColor Yellow
try {
    $pgReady = pg_isready -h localhost -p 5432 2>&1
    if ($pgReady -like "*accepting*") {
        Write-Host "  ✓ PostgreSQL está corriendo" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ PostgreSQL no parece estar corriendo" -ForegroundColor Yellow
        Write-Host "  → Inicia PostgreSQL desde XAMPP o ejecuta: Start-Service postgresql-x64-13" -ForegroundColor Yellow
        Read-Host "  Presiona Enter cuando PostgreSQL esté listo"
    }
} catch {
    Write-Host "  ⚠ No se puede conectar a PostgreSQL" -ForegroundColor Yellow
    Write-Host "  → Inicia PostgreSQL desde XAMPP" -ForegroundColor Yellow
    Read-Host "  Presiona Enter cuando PostgreSQL esté listo"
}

# 3. Instalar dependencias frontend
Write-Host ""
Write-Host "✓ Instalando dependencias frontend..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Error al instalar dependencias frontend" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Dependencias frontend instaladas" -ForegroundColor Green

# 4. Instalar dependencias backend
Write-Host ""
Write-Host "✓ Instalando dependencias backend..." -ForegroundColor Yellow
cd backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Error al instalar dependencias backend" -ForegroundColor Red
    cd ..
    exit 1
}
Write-Host "  ✓ Dependencias backend instaladas" -ForegroundColor Green
cd ..

# 5. Verificar/crear archivos .env
Write-Host ""
Write-Host "✓ Verificando archivos de configuración..." -ForegroundColor Yellow

if (-not (Test-Path ".\.env")) {
    Write-Host "  → Creando .env (frontend)..." -ForegroundColor Cyan
    @"
VITE_API_URL=http://localhost:3000/api
VITE_ALLOWED_EMAIL_DOMAIN=mendizabala.eus
"@ | Out-File -FilePath ".\.env" -Encoding UTF8
    Write-Host "  ✓ .env creado" -ForegroundColor Green
} else {
    Write-Host "  ✓ .env ya existe" -ForegroundColor Green
}

if (-not (Test-Path ".\backend\.env")) {
    Write-Host "  → Creando backend/.env..." -ForegroundColor Cyan
    @"
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mendizabala_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=cambiar_este_secreto_en_produccion_12345
JWT_EXPIRY=7d

# Email (SMTP) - Configura antes de ejecutar
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
SMTP_FROM=noreply@mendizabala.eus

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ALLOWED_EMAIL_DOMAIN=mendizabala.eus
LOG_LEVEL=debug
"@ | Out-File -FilePath ".\backend\.env" -Encoding UTF8
    Write-Host "  ✓ backend/.env creado" -ForegroundColor Green
    Write-Host "  ⚠ IMPORTANTE: Edita backend/.env con tus credenciales SMTP" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ backend/.env ya existe" -ForegroundColor Green
}

# 6. Crear base de datos
Write-Host ""
Write-Host "✓ Configurando base de datos..." -ForegroundColor Yellow
Write-Host "  ⚠ Se pedirá la contraseña de PostgreSQL (default: 'postgres')" -ForegroundColor Yellow

$createDB = @"
CREATE DATABASE IF NOT EXISTS mendizabala_db;
\c mendizabala_db
\i 'backend/schema.sql'
"@

Write-Host "  → Ejecutando schema.sql..." -ForegroundColor Cyan
$env:PGPASSWORD = "postgres"
psql -U postgres -h localhost -d postgres -c "CREATE DATABASE mendizabala_db;" 2>$null
$exitCode = $LASTEXITCODE

if ($exitCode -eq 0 -or $exitCode -eq 1) {
    # 1 = BD ya existe, 0 = creada
    psql -U postgres -h localhost -d mendizabala_db -f "backend/schema.sql" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Base de datos configurada" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Error al ejecutar schema.sql" -ForegroundColor Red
        Write-Host "  → Intenta manualmente: psql -U postgres -h localhost -d mendizabala_db -f backend/schema.sql" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ Error al crear base de datos" -ForegroundColor Red
    Write-Host "  → Verifica que PostgreSQL está corriendo y la contraseña es correcta" -ForegroundColor Yellow
}

# 7. Compilar frontend
Write-Host ""
Write-Host "✓ Compilando frontend..." -ForegroundColor Yellow
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Frontend compilado exitosamente" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Error en compilación (puedes ignorar esto ahora)" -ForegroundColor Yellow
}

# 8. Resumen final
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    ✓ Setup completado                         ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Edita backend/.env con tus credenciales SMTP:" -ForegroundColor White
Write-Host "   • Gmail: activa 2FA y genera app password (https://myaccount.google.com/apppasswords)" -ForegroundColor Gray
Write-Host "   • O usa Mailtrap (https://mailtrap.io) para testing" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Abre 2 terminales PowerShell:" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 1 (Backend):" -ForegroundColor Cyan
Write-Host "   > cd backend" -ForegroundColor Gray
Write-Host "   > npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   Terminal 2 (Frontend):" -ForegroundColor Cyan
Write-Host "   > npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Abre http://localhost:5173 en tu navegador" -ForegroundColor White
Write-Host ""
Write-Host "4. Login con: profesor1@mendizabala.eus" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentación completa: ver SETUP_LOCAL.md" -ForegroundColor Cyan
Write-Host ""
