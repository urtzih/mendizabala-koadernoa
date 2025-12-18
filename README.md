# Mendizabala LHII — Kudeaketa App (EU/ES)

Aplicación para gestión de contactos (profesorado), empresas colaboradoras y asignación de tutoría mediante Kanban. Stack **100% open source** con React + Node.js + PostgreSQL.

## � Tabla de contenidos
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Guía de instalación](#-guía-de-instalación)
- [Autenticación](#-autenticación)
- [APIs disponibles](#-apis-disponibles)
- [Troubleshooting](#-troubleshooting)
- [Sincronización](#-sincronización)
- [Despliegue](#-despliegue)
- [Documentación completa](#-documentación-completa)

## �📋 Características
- ✅ Autenticación por OTP (código de un solo uso vía email)
- ✅ Drag & drop para asignación de empresas a profesores
- ✅ Gestión CRUD: profesores, empresas
- ✅ Interfaz limpia y moderna (responsive, accesible)
- ✅ Bilingüe: Español + Euskera
- ✅ Sincronización en tiempo real (polling + WebSocket-ready)

## 🛠 Tecnologías
| Componente | Tecnología |
|-----------|-----------|
| **Frontend** | React 18 + TypeScript + Vite 5 |
| **Backend** | Node.js + Express 4 |
| **Base de datos** | PostgreSQL 13+ |
| **Autenticación** | Magic link OTP → JWT tokens |
| **Email** | Nodemailer (SMTP) |
| **Drag & Drop** | dnd-kit |
| **i18n** | JSON sencillo (ES/EU) |

## 📁 Estructura del proyecto
```
├── src/                          # Código frontend (React + TypeScript)
│   ├── components/              # Componentes reutilizables
│   ├── pages/                   # Dashboard, Login
│   ├── lib/                     # apiClient.ts, supabaseClient.ts
│   ├── i18n/                    # Traducciones
│   └── main.tsx
├── backend/                      # Código backend (Node.js + Express) **NEW**
│   ├── src/
│   │   ├── index.js            # Servidor Express
│   │   ├── db.js               # Pool de PostgreSQL
│   │   ├── auth.js             # JWT + middleware
│   │   ├── email.js            # OTP + Nodemailer
│   │   └── routes/
│   │       ├── auth.js         # /auth/request-otp, /auth/verify-otp, /auth/me
│   │       ├── teachers.js     # CRUD profesores
│   │       └── companies.js    # CRUD empresas
│   ├── schema.sql              # Esquema PostgreSQL
│   ├── package.json
│   └── .env.example
├── package.json                # Frontend
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Guía de instalación y ejecución

### Requisitos previos
- **Node.js** 16+ y npm 8+
- **PostgreSQL** 13+ (local o remoto)
- **Servidor SMTP** para envío de OTP (Gmail, SendGrid, tu propio servidor, etc.)

### 1️⃣ Clonar y preparar el entorno

```bash
# Navega a la carpeta del proyecto
cd mendizabala

# Instala dependencias frontend
npm install

# Instala dependencias backend
cd backend
npm install
cd ..
```

### 2️⃣ Configurar PostgreSQL

#### En Windows (si tienes XAMPP):
```powershell
# Abre PostgreSQL desde XAMPP (o usa psql.exe directamente)
psql -U postgres -h localhost

# Dentro de psql:
CREATE DATABASE mendizabala_db;
\c mendizabala_db
\i 'C:/ruta/a/backend/schema.sql'
\q
```

#### O en terminal (línea de comandos):
```bash
psql -U postgres -h localhost -f backend/schema.sql -d mendizabala_db
```

✅ Esto crea tablas `teachers`, `companies`, índices y datos de ejemplo.

### 3️⃣ Configurar variables de entorno

#### Backend (`backend/.env`)
Copia `backend/.env.example` a `backend/.env` y actualiza:

```bash
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mendizabala_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres

# JWT
JWT_SECRET=tu_secreto_muy_seguro_aqui_cambiar_en_produccion
JWT_EXPIRY=7d

# Email (SMTP)
# Ejemplo con Gmail:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password  # NO tu contraseña normal, usa "app password"
SMTP_FROM=noreply@mendizabala.eus

# Servidor
PORT=3000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173
ALLOWED_EMAIL_DOMAIN=mendizabala.eus
LOG_LEVEL=debug
```

**⚠️ Nota sobre Gmail:**
1. Activa [2FA](https://myaccount.google.com/security) en tu cuenta
2. Genera una [app password](https://myaccount.google.com/apppasswords)
3. Usa esa contraseña en `SMTP_PASS` (no tu contraseña normal)

#### Frontend (`.env`)
Copia `.env.example` a `.env`:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_ALLOWED_EMAIL_DOMAIN=mendizabala.eus
```

### 4️⃣ Iniciar desarrollo local

Abre **2 terminales** (PowerShell en Windows):

**Terminal 1 — Backend:**
```powershell
cd backend
npm run dev
# Deberías ver: "Server listening on port 3000"
```

**Terminal 2 — Frontend:**
```powershell
npm run dev
# Deberías ver: "VITE v5.x.x  ready in xxx ms"
# Accede a: http://localhost:5173
```

### 5️⃣ Prueba la aplicación

1. Abre [http://localhost:5173](http://localhost:5173) en el navegador
2. Login:
   - Email: `profesor1@mendizabala.eus` (existe en datos de ejemplo)
   - Se enviará un OTP a tu servidor SMTP configurado
   - Si es desarrollo sin email real, revisa logs del backend para el código
3. Accede al Dashboard y prueba:
   - ✅ Drag & drop en Kanban
   - ✅ Crear/editar profesores
   - ✅ Crear/editar empresas
   - ✅ Cambio de idioma (🌐)

## 📝 Autenticación

### Flujo de login
1. Usuario entra email (`profesor@mendizabala.eus`)
2. Backend valida dominio y genera OTP (código 6 dígitos)
3. Nodemailer envía OTP por email
4. Usuario introduce OTP en frontend
5. Backend valida OTP y devuelve **JWT token**
6. Token se guarda en `localStorage` y se usa en todas las requests

### Endpoints de autenticación

```http
POST /api/auth/request-otp
Content-Type: application/json

{ "email": "profesor@mendizabala.eus" }

# Response:
{ "message": "OTP enviado a tu email" }
```

```http
POST /api/auth/verify-otp
Content-Type: application/json

{ "email": "profesor@mendizabala.eus", "code": "123456" }

# Response:
{ "token": "eyJhbGciOiJIUzI1NiIs...", "teacher": { "id": "...", "name": "Juan Pérez", "email": "..." } }
```

```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

# Response:
{ "id": "...", "name": "Juan Pérez", "email": "profesor@mendizabala.eus" }
```

## 🏗 APIs disponibles

### Profesores
- `GET /api/teachers` — Listar todos
- `POST /api/teachers` — Crear nuevo
- `PUT /api/teachers/:id` — Actualizar
- `DELETE /api/teachers/:id` — Eliminar

### Empresas
- `GET /api/companies` — Listar todas
- `POST /api/companies` — Crear nueva
- `PUT /api/companies/:id` — Actualizar (incluyendo asignación a profesor)
- `DELETE /api/companies/:id` — Eliminar

Todas excepto `request-otp` y `verify-otp` requieren header `Authorization: Bearer <token>`.

## 🐛 Troubleshooting

| Problema | Solución |
|---------|---------|
| `ECONNREFUSED` en backend | PostgreSQL no está ejecutándose. Inicia `psql` o el servicio |
| "OTP no se envía" | Verifica variables SMTP en `.env`. Revisa logs: `npm run dev` mostrará errores |
| "Invalid token" en frontend | Token expirado. Haz login de nuevo |
| CORS error | Asegúrate que `FRONTEND_URL` en `backend/.env` coincide con tu puerto Vite |
| Componentes no cargan datos | Backend no está ejecutándose en puerto 3000. Revisa `npm run dev` en terminal 1 |

## 🔄 Sincronización en tiempo real

Actualmente usa **polling cada 5 segundos**. Para implementar WebSocket:

1. En `backend/src/websocket.js`: crear servidor WebSocket
2. En componentes: reemplazar `setInterval(load, 5000)` con listeners WebSocket
3. Mejora: reducir latencia, menor carga de red

*(Implementación en próxima fase)*

## 📦 Despliegue en producción

### Frontend (Vercel/Netlify/Heroku)
```bash
npm run build
# Sube la carpeta `dist/` a tu plataforma
# Configura variable `VITE_API_URL` con la URL de tu backend
```

### Backend (Heroku/Railway/DigitalOcean/VPS)
1. Crea base de datos PostgreSQL en la nube
2. Ejecuta `schema.sql` en la BD remota
3. Configura variables en `.env` (o en la plataforma)
4. Deploy:
   ```bash
   git push heroku main  # Si usas Heroku
   # O deploy con docker/systemd en tu VPS
   ```

## 📄 Licencia
## 📄 Licencia
Código abierto para uso educativo e institucional.

## 📚 Documentación completa

Este proyecto incluye documentación exhaustiva:

| Documento | Descripción |
|-----------|-----------|
| [INDEX.md](INDEX.md) | 📚 Índice de toda la documentación |
| [SETUP_LOCAL.md](SETUP_LOCAL.md) | 🔧 Setup paso a paso (recomendado para comenzar) |
| [setup.ps1](setup.ps1) | ⚙️ Script automatizado de instalación (Windows) |
| [TESTING.md](TESTING.md) | ✅ Checklist de tests y validación |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | 🔑 Comandos comunes y troubleshooting rápido |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | 🎨 Sistema de diseño y especificación visual |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | 📊 Estado actual y estadísticas del proyecto |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 🌐 Guía de despliegue en producción (múltiples opciones) |
| [WEBSOCKET_ROADMAP.md](WEBSOCKET_ROADMAP.md) | 🔄 Plan para implementar real-time con WebSocket |

**🚀 ¿Primer viaje?** Comienza con [SETUP_LOCAL.md](SETUP_LOCAL.md) o ejecuta `.\setup.ps1` en PowerShell.

## 🎓 Funcionalidades

- **UC-01**: Autenticación por OTP (magic link sin contraseñas)
- **UC-02**: Gestión de profesores (CRUD con validación, edición inline)
- **UC-03**: CRUD de empresas (crear, editar, eliminar, búsqueda, enlaces)
- **UC-04**: Asignación de tutoría (Kanban drag & drop con persistencia)
- **UC-05**: Demanda y estado (semáforo: verde/naranja/rojo, campos de demanda)
- **UC-06**: Persistencia y seguridad (JWT, proteción de rutas, validación de datos)
- **UC-07**: Multiidioma (Español y Euskera)
- **UC-08**: Responsivo (mobile, tablet, desktop)
- i18n 100% en JSON.

## Notas
- Roles: Profesor/Coordinador con permisos equivalentes.
- RLS: usuarios autenticados pueden leer/escribir.
- Ajustar `VITE_ALLOWED_EMAIL_DOMAIN` al dominio corporativo real.
