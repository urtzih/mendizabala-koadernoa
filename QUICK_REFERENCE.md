# 🚀 Quick Reference — Comandos comunes

Cheatsheet de comandos para desarrollo local.

## 📂 Navegación

```powershell
# Ir a carpeta del proyecto
cd C:\xampp\htdocs\personal\mendizabala

# Ver estructura
tree /F /L 2

# Ir a backend desde proyecto
cd backend

# Volver a proyecto desde backend
cd ..
```

## 📦 Instalación

```powershell
# Instalar dependencias (frontend)
npm install

# Instalar una librería nueva
npm install nombre-libreria

# Instalar devDependency
npm install -D nombre-libreria

# Instalar específicamente en backend
cd backend
npm install nombre-libreria
cd ..
```

## ▶️ Desarrollo

```powershell
# Frontend (Terminal 1)
npm run dev
# Abre http://localhost:5173

# Backend (Terminal 2)
cd backend
npm run dev
# Escucha en http://localhost:3000

# Ambos (no recomendado, usa 2 terminales)
npm run dev & cd backend && npm run dev
```

## 🔨 Build

```powershell
# Compilar frontend
npm run build

# Ver resultado
ls dist/

# Servir localmente lo compilado (testing)
npm run preview
```

## 🐘 PostgreSQL

```powershell
# Conectar a la BD
psql -U postgres -h localhost -d mendizabala_db

# Dentro de psql:
\dt                              # Ver tablas
SELECT * FROM teachers;          # Ver profesores
SELECT * FROM companies;         # Ver empresas
\q                              # Salir

# Ejecutar script SQL
psql -U postgres -h localhost -d mendizabala_db -f backend/schema.sql

# Backup de la BD
pg_dump -U postgres mendizabala_db > backup.sql

# Restaurar backup
psql -U postgres -d mendizabala_db < backup.sql

# Resetear (borrar todo)
DROP DATABASE mendizabala_db;
CREATE DATABASE mendizabala_db;
psql -U postgres -d mendizabala_db -f backend/schema.sql
```

## 🔑 Git

```powershell
# Ver estado
git status

# Agregar todos los cambios
git add .

# Commit
git commit -m "Tu mensaje"

# Subir cambios
git push

# Ver historial
git log --oneline -10

# Ver cambios no commiteados
git diff

# Deshacer cambios (cuidado!)
git checkout -- archivo.tsx
```

## 📝 Edición de archivos

```powershell
# Abrir proyecto en VS Code
code .

# Ver contenido de archivo
type archivo.tsx

# Crear archivo
New-Item -Path .\archivo.txt -ItemType File

# Editar .env
notepad .\.env
```

## 🔍 Debugging

```powershell
# Ver logs en tiempo real
# Mantén la terminal abierta mientras npm run dev

# Ver errores TypeScript
npm run build  # Valida tipos sin empaquetar

# Limpiar caché de Node
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm install
```

## 🌐 Network

```powershell
# Verificar puerto en uso
netstat -ano | findstr :3000
# Para terminar un proceso usando puerto:
taskkill /PID <PID> /F

# Testear conexión a BD
Test-NetConnection -ComputerName localhost -Port 5432

# Testear PostgreSQL
pg_isready -h localhost -p 5432
```

## 🧹 Limpieza

```powershell
# Limpiar caché npm
npm cache clean --force

# Limpiar carpeta dist
Remove-Item -Recurse dist

# Limpiar todo y reinstalar
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm install
```

## 📋 Variables de entorno

```powershell
# Ver variable de entorno
$env:PGPASSWORD

# Establecer variable temporalmente
$env:NODE_ENV = "development"

# Ver todas las variables
Get-ChildItem Env: | Select-Object Name, Value
```

## 🆘 Troubleshooting rápido

```powershell
# Puerto 3000 en uso
# Opción 1: Cambiar puerto en backend/.env (PORT=3001)
# Opción 2: Terminar proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# npm install falla
npm cache clean --force
npm install

# TypeScript error desconocido
# Reinicia VS Code: Ctrl+Shift+P → Developer: Reload Window

# Frontend no ve cambios
# Ctrl+Shift+R (hard refresh) o Ctrl+F5

# Backend se queda colgado
# Ctrl+C en la terminal
# npm run dev de nuevo
```

## 📱 Testing

```powershell
# Abrir DevTools
F12

# Chrome DevTools:
# Network tab: ver peticiones API
# Console: ver errores JavaScript
# Application → Local Storage: ver token JWT
# Performance: analizar velocidad

# Emails en desarrollo (sin SMTP real):
# Revisa logs del backend: npm run dev muestra el OTP
```

## 💾 Guardar cambios

```powershell
# En VS Code
Ctrl+S        # Guardar archivo actual

# Git
git add .
git commit -m "Descripción del cambio"
git push

# AutoSave en VS Code:
# File → Preferences → Settings
# Busca: Auto Save → Cambiar a "afterDelay"
```

## 🚨 Errores comunes y soluciones

| Error | Solución |
|-------|----------|
| `ECONNREFUSED` | Inicia PostgreSQL en XAMPP |
| `EADDRINUSE` | Puerto ya en uso, cambia en .env |
| `CORS error` | Verifica `FRONTEND_URL` en backend/.env |
| `Module not found` | `npm install`, verifica imports |
| `Invalid token` | Haz login de nuevo |
| `psql not found` | Agrega PostgreSQL al PATH o usa ruta completa |

---

**💡 Pro tip:** Crea alias en PowerShell para comandos comunes:

```powershell
# Edita tu perfil
notepad $PROFILE

# Agrega:
function dev { npm run dev }
function backend { cd backend; npm run dev }
function psql-db { psql -U postgres -h localhost -d mendizabala_db }

# Reinicia PowerShell y usa:
dev          # en lugar de npm run dev
psql-db      # acceso rápido a BD
```
