# 🚀 Guía de configuración LOCAL paso a paso

Esta guía te ayuda a configurar el proyecto **localmente en tu máquina Windows** para desarrollo.

## ✅ Checklist de requisitos

Antes de empezar, asegúrate de tener instalado:

- [ ] **Node.js 16+** — Descarga de [nodejs.org](https://nodejs.org)
  ```powershell
  node --version  # Deberías ver v16.x.x o superior
  npm --version   # Deberías ver 8.x.x o superior
  ```

- [ ] **PostgreSQL 13+** — Opciones:
  - Descarga de [postgresql.org](https://www.postgresql.org/download/windows/)
  - O usa XAMPP que incluye PostgreSQL
  - O usa Docker (avanzado)

- [ ] **Git** (opcional pero recomendado)
  ```powershell
  git --version
  ```

---

## 📋 Paso 1: Verificar que PostgreSQL está corriendo

### En Windows con XAMPP:
1. Abre XAMPP Control Panel
2. Haz clic en **Start** junto a "PostgreSQL"
3. Espera a que ponga "Running" (con fondo verde)

### O si instalaste PostgreSQL directamente:
```powershell
# Abre PowerShell como administrador
pg_isready -h localhost -p 5432
# Deberías ver: "accepting connections"
```

---

## 🗄️ Paso 2: Crear la base de datos

Abre **PowerShell** en la carpeta del proyecto:

```powershell
# Navega a tu carpeta
cd C:\xampp\htdocs\personal\mendizabala

# Conecta a PostgreSQL (será el comando más largo 😄)
# Reemplaza "tu_contraseña" con tu contraseña de postgres
psql -U postgres -h localhost -d postgres

# Dentro del prompt psql>, ejecuta:
CREATE DATABASE mendizabala_db;
\c mendizabala_db
\i 'backend/schema.sql'
\q
```

✅ Acabas de crear la BD e importar todas las tablas.

**Si obtienes error `"could not open file"`:**
```powershell
# Usa la ruta absoluta:
psql -U postgres -h localhost -d mendizabala_db -f "C:\xampp\htdocs\personal\mendizabala\backend\schema.sql"
```

---

## 🔑 Paso 3: Configurar variables de entorno

### Frontend (`.env`)

En la **raíz del proyecto** (`C:\xampp\htdocs\personal\mendizabala\.env`):

```bash
VITE_API_URL=http://localhost:3000/api
VITE_ALLOWED_EMAIL_DOMAIN=mendizabala.eus
```

**⚠️ Si el archivo `.env.example` no existe:**
```powershell
# Crea el archivo manualmente
New-Item -Path ".\.env" -ItemType File
```

### Backend (`backend/.env`)

En la carpeta `backend\` (`C:\xampp\htdocs\personal\mendizabala\backend\.env`):

```bash
# === BASE DE DATOS ===
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mendizabala_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres

# === JWT ===
JWT_SECRET=mi_secreto_super_seguro_cambiar_en_produccion_12345
JWT_EXPIRY=7d

# === EMAIL (NODEMAILER) ===
# Opción 1: Gmail (recomendado para testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
SMTP_FROM=noreply@mendizabala.eus

# Opción 2: Mailtrap (servicio gratuito de testing)
# SMTP_HOST=smtp.mailtrap.io
# SMTP_PORT=2525
# SMTP_USER=tu_mailtrap_user
# SMTP_PASS=tu_mailtrap_pass

# Opción 3: Tu servidor SMTP local/corporativo
# SMTP_HOST=tu.servidor.local
# SMTP_PORT=587
# SMTP_USER=usuario
# SMTP_PASS=contraseña

# === SERVIDOR ===
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ALLOWED_EMAIL_DOMAIN=mendizabala.eus
LOG_LEVEL=debug
```

**⚠️ IMPORTANTE: Credenciales de email**

Si usas **Gmail**:
1. Activa [2-Step Verification](https://myaccount.google.com/security)
2. Ve a [App Passwords](https://myaccount.google.com/apppasswords)
3. Selecciona Mail y Windows Computer
4. Copia la contraseña generada en `SMTP_PASS`

**Si usas testing sin email real:**
- Usa [Mailtrap.io](https://mailtrap.io) (gratuito, 500 emails/mes)
- O simplemente revisa los logs del backend para ver el OTP

---

## 📦 Paso 4: Instalar dependencias

```powershell
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

Esto descargará todos los paquetes necesarios (puede tardar 1-2 minutos).

---

## ▶️ Paso 5: Iniciar el servidor (2 terminales)

**Abre 2 PowerShell en la misma carpeta** (`C:\xampp\htdocs\personal\mendizabala`):

### Terminal 1️⃣ — Backend

```powershell
cd backend
npm run dev
```

Deberías ver:
```
Server listening on http://localhost:3000
Database connected ✓
```

**Déjalo corriendo.**

### Terminal 2️⃣ — Frontend

```powershell
npm run dev
```

Deberías ver:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## 🌐 Paso 6: Prueba la aplicación

1. **Abre el navegador** y ve a [http://localhost:5173](http://localhost:5173)
2. **Login:**
   - Email: `profesor1@mendizabala.eus` (existe en los datos de ejemplo)
   - Haz clic en "Enviar enlace"
   
3. **Verifica el OTP:**
   - Si configuraste email: revisa tu bandeja de entrada
   - Si NO configuraste email: revisa la **Terminal 1 (Backend)**
     - Deberías ver algo como:
       ```
       [13:45:22] OTP enviado: 123456
       ```

4. **Introduce el OTP** en el formulario y haz clic en "Verificar"

5. **¡Ya estás dentro!** 🎉
   - Drag & drop en Kanban
   - Crea/edita profesores y empresas
   - Cambia idioma (🌐)

---

## 🐛 Troubleshooting común

### "Connection refused" en backend
```powershell
# PostgreSQL no está corriendo. En XAMPP:
# 1. Abre XAMPP Control Panel
# 2. Haz Start en PostgreSQL
# 3. O en PowerShell (como admin):
Get-Service postgresql-x64-13  # Verifica el nombre exacto
Start-Service postgresql-x64-13
```

### "ENOENT: no such file or directory" en backend
```powershell
# Asegúrate de estar en la carpeta backend cuando ejecutes npm run dev
cd backend
npm run dev  # Aquí
```

### "CORS error" en consola
```
Access to XMLHttpRequest at 'http://localhost:3000/api/...'
has been blocked by CORS policy
```
**Solución:**
- Verifica que `FRONTEND_URL=http://localhost:5173` en `backend/.env`
- Reinicia el backend: Ctrl+C y `npm run dev` de nuevo

### "Invalid token" después de login
```
Token expired or invalid
```
**Solución:**
- El token expira después de 7 días (configurado en `JWT_EXPIRY`)
- Haz login de nuevo: ve a [http://localhost:5173](http://localhost:5173)

### "OTP no se envía"
```
Error: getaddrinfo ENOTFOUND smtp.gmail.com
```
**Soluciones:**
1. Verifica credenciales SMTP en `backend/.env`
2. Si usas Gmail, asegúrate de usar **App Password** (no contraseña normal)
3. Prueba con Mailtrap (servicio de testing)
4. Revisa los logs del backend para más detalles

### Componentes no cargan datos
```
GET http://localhost:3000/api/teachers 404
```
**Solución:**
- ¿Backend está corriendo? Revisa Terminal 1
- ¿Variables `.env` correctas?
- Abre DevTools (F12) → Network para ver peticiones

---

## 📝 Próximos pasos

- **Cambiar dominio de email:** Edita `VITE_ALLOWED_EMAIL_DOMAIN` en frontend `.env` y `ALLOWED_EMAIL_DOMAIN` en backend `.env`
- **Agregar más profesores:** Ve a Dashboard → Profesores → Añadir profesor
- **Agregar empresas:** Dashboard → Empresas → Añadir empresa
- **Real-time mejorado:** TODO WebSocket (próxima versión)

---

## 🆘 ¿Necesitas ayuda?

Si algo no funciona:
1. Revisa los **logs** en ambas terminales (copialos si son largos)
2. Asegúrate de que PostgreSQL está corriendo
3. Verifica que `.env` tiene las credenciales correctas
4. Intenta parar todo (Ctrl+C) y vuelve a empezar desde Paso 5
