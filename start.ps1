# 🚀 Inicio rápido para desarrollo local

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Mendizabala LHII - Inicio rapido            " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar PostgreSQL
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
try {
    $pgTest = psql -U postgres -h localhost -d mendizabala_db -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  PostgreSQL OK" -ForegroundColor Green
    } else {
        Write-Host "  Base de datos no encontrada. Creando..." -ForegroundColor Yellow
        psql -U postgres -h localhost -c "CREATE DATABASE mendizabala_db;" 2>$null
        $schemaPath = "backend\schema.sql"
        psql -U postgres -h localhost -d mendizabala_db -f $schemaPath 2>$null
        Write-Host "  Base de datos creada" -ForegroundColor Green
    }
} catch {
    Write-Host "  PostgreSQL no esta corriendo" -ForegroundColor Red
    Write-Host "  Inicia PostgreSQL desde XAMPP" -ForegroundColor Yellow
    Read-Host "Presiona Enter cuando este listo"
}

# 2. Verificar dependencias backend
Write-Host ""
Write-Host "Verificando backend..." -ForegroundColor Yellow
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "  Instalando dependencias backend..." -ForegroundColor Cyan
    cd backend
    npm install
    cd ..
    Write-Host "  Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "  Backend OK" -ForegroundColor Green
}

# 3. Verificar dependencias frontend
Write-Host ""
Write-Host "Verificando frontend..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "  Instalando dependencias frontend..." -ForegroundColor Cyan
    npm install
    Write-Host "  Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "  Frontend OK" -ForegroundColor Green
}

# 4. Instrucciones
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "             Todo listo                        " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Abre 2 terminales PowerShell:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "   > cd backend" -ForegroundColor Gray
Write-Host "   > npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "   > npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Luego abre: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login: asiersoto@mendizabala.eus" -ForegroundColor White
Write-Host "El codigo OTP aparecera en Terminal 1 (backend)" -ForegroundColor White
Write-Host ""
