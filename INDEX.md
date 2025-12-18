# 📚 Índice de documentación

Guía rápida para encontrar la información que necesitas.

## 🚀 Primeros pasos

**¿Quiero empezar ahora mismo?**
1. Lee [SETUP_LOCAL.md](SETUP_LOCAL.md) — Guía paso a paso para setup local
2. O ejecuta `.\setup.ps1` — Script automático (Windows PowerShell)
3. Luego ve a "Desarrollo" abajo

## 📖 Documentos principales

### 📋 [README.md](README.md)
- Descripción general del proyecto
- Características y tecnologías
- Estructura de carpetas
- Guía de instalación resumida

**Para quién:** Todos (overview general)

### 🔧 [SETUP_LOCAL.md](SETUP_LOCAL.md)
- Checklist de requisitos
- Paso a paso detallado para Windows
- Configuración de variables de entorno
- Solución de problemas comunes

**Para quién:** Nuevos desarrolladores (instalación inicial)

### ▶️ [setup.ps1](setup.ps1)
- Script automatizado de instalación (Windows PowerShell)
- Instala dependencias
- Crea base de datos
- Configura variables de entorno

**Para quién:** Usuarios que prefieren automatización

### 🎨 [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- Especificación completa del design system
- Paleta de colores (8 colores)
- Tipografía y espaciado
- Componentes y variaciones
- Ejemplos de uso

**Para quién:** Diseñadores, desarrolladores frontend

### ✅ [TESTING.md](TESTING.md)
- Checklist de tests (12 test cases)
- Procedimiento por funcionalidad
- Resultados esperados
- Debugging de errores comunes

**Para quién:** QA, desarrolladores (validación)

### 🔑 [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- Comandos npm, npm run, git
- Comandos PostgreSQL
- Debugging rápido
- Alias útiles

**Para quién:** Desarrolladores en el día a día

### 📊 [PROJECT_STATUS.md](PROJECT_STATUS.md)
- Estado actual del proyecto
- Qué está completo
- Qué falta (roadmap)
- Checklist de verificación

**Para quién:** Product managers, team leads

### 🌐 [DEPLOYMENT.md](DEPLOYMENT.md)
- Opciones de despliegue
- Setup para producción
- Configuración nginx
- Monitoreo y escalado

**Para quién:** DevOps, sysadmins, deployment

### 🔄 [WEBSOCKET_ROADMAP.md](WEBSOCKET_ROADMAP.md)
- Arquitectura para real-time (WebSocket)
- Plan de implementación
- Código de ejemplo
- Beneficios vs polling actual

**Para quién:** Desarrolladores backend (future)

## 🗂️ Estructura del proyecto

```
mendizabala/
├── src/                          # Código frontend (React + TypeScript)
│   ├── components/              # Componentes reutilizables
│   │   ├── AuthGate.tsx
│   │   ├── Companies.tsx
│   │   ├── CompanyCard.tsx
│   │   ├── CompanyModal.tsx
│   │   ├── Contacts.tsx
│   │   ├── Kanban.tsx
│   │   ├── LanguageSwitch.tsx
│   │   └── StatusBadge.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   └── Login.tsx
│   ├── lib/
│   │   ├── apiClient.ts        # Cliente API (nuevo - reemplaza Supabase)
│   │   └── supabaseClient.ts   # (deprecated)
│   ├── i18n/
│   │   ├── index.tsx
│   │   └── locales/
│   │       ├── es.json         # Español
│   │       └── eu.json         # Euskera
│   ├── types.ts
│   ├── index.css
│   ├── main.tsx
│   └── App.tsx
├── backend/                      # Código backend (Node.js + Express) **NEW**
│   ├── src/
│   │   ├── index.js            # Servidor Express
│   │   ├── db.js               # Pool PostgreSQL
│   │   ├── auth.js             # JWT + middleware
│   │   ├── email.js            # OTP + Nodemailer
│   │   └── routes/
│   │       ├── auth.js         # /auth/request-otp, /verify-otp, /me
│   │       ├── teachers.js     # CRUD profesores
│   │       └── companies.js    # CRUD empresas
│   ├── schema.sql              # Schema PostgreSQL
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── public/                      # Assets estáticos
├── dist/                        # Build output
├── node_modules/               # Dependencias frontend
│
├── package.json                # Frontend
├── vite.config.ts             # Configuración Vite
├── tsconfig.json              # Configuración TypeScript
├── index.html                 # HTML principal
│
├── .env                        # Variables (frontend)
├── .env.example               # Template variables
├── .gitignore
│
├── 📚 DOCUMENTACIÓN:
├── README.md                  # Overview general
├── SETUP_LOCAL.md            # Setup paso a paso
├── setup.ps1                 # Script automático
├── TESTING.md                # Test checklist
├── QUICK_REFERENCE.md        # Comandos comunes
├── PROJECT_STATUS.md         # Estado actual
├── DEPLOYMENT.md             # Despliegue producción
├── WEBSOCKET_ROADMAP.md      # Future real-time
├── DESIGN_SYSTEM.md          # Sistema de diseño
└── INDEX.md                  # Este archivo
```

## 🎯 Rutas de aprendizaje

### 👤 Soy administrador del instituto
1. [README.md](README.md) — Entender qué es
2. [SETUP_LOCAL.md](SETUP_LOCAL.md) — Instalar localmente o [DEPLOYMENT.md](DEPLOYMENT.md) en servidor
3. [TESTING.md](TESTING.md) — Verificar que funciona
4. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) — Comandos útiles

### 👨‍💻 Soy desarrollador
1. [SETUP_LOCAL.md](SETUP_LOCAL.md) — Setup environment
2. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Entender estilos
3. [PROJECT_STATUS.md](PROJECT_STATUS.md) — Qué está hecho
4. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) — Comandos
5. [TESTING.md](TESTING.md) — Validar cambios
6. [WEBSOCKET_ROADMAP.md](WEBSOCKET_ROADMAP.md) — Próximas features

### 🚀 Soy DevOps/SysAdmin
1. [DEPLOYMENT.md](DEPLOYMENT.md) — Todas las opciones de deploy
2. [QUICK_REFERENCE.md](QUICK_REFERENCE.md#-postresql) — PostgreSQL commands
3. [SETUP_LOCAL.md](SETUP_LOCAL.md#-paso-2-crear-la-base-de-datos) — DB setup

### 🎨 Soy diseñador
1. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Especificación completa
2. [README.md](README.md) → Características — Entender flujo
3. [TESTING.md](TESTING.md) → Test 9-10 — Ver en acción

## 🔍 Búsqueda rápida

**Tengo un error:**
- Backend: [QUICK_REFERENCE.md#-troubleshooting-rápido](QUICK_REFERENCE.md#-troubleshooting-rápido) o [SETUP_LOCAL.md#-troubleshooting-común](SETUP_LOCAL.md#-troubleshooting-común)
- Frontend: [TESTING.md#-test-11-error-handling](TESTING.md#-test-11-error-handling)

**Quiero agregar una feature:**
- Nuevo endpoint: Ver estructura en `backend/src/routes/`
- Nuevo componente: Ver estilos en [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- Nuevo idioma: Ver `src/i18n/locales/`

**Quiero desplegar en producción:**
- Todo en [DEPLOYMENT.md](DEPLOYMENT.md)

**Quiero mejorar el rendimiento:**
- Real-time: [WEBSOCKET_ROADMAP.md](WEBSOCKET_ROADMAP.md)
- Frontend: [TESTING.md#-test-12-performance](TESTING.md#-test-12-performance)

**Quiero entender la arquitectura:**
- [PROJECT_STATUS.md](PROJECT_STATUS.md) y [README.md](README.md)

## 📞 Soporte

**Pregunta frecuente → Documentación:**

| Pregunta | Documento |
|----------|-----------|
| ¿Cómo empiezo? | [SETUP_LOCAL.md](SETUP_LOCAL.md) |
| ¿Qué tecnologías usa? | [README.md](README.md) |
| ¿Cómo lanzo a producción? | [DEPLOYMENT.md](DEPLOYMENT.md) |
| ¿Qué comandos npm hay? | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) |
| ¿Cómo se ve completado? | [TESTING.md](TESTING.md) |
| ¿Qué está pendiente? | [PROJECT_STATUS.md](PROJECT_STATUS.md) |
| ¿Cómo diseño componentes? | [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) |
| ¿Cómo mejorar real-time? | [WEBSOCKET_ROADMAP.md](WEBSOCKET_ROADMAP.md) |

## 🚀 Quick Start (TL;DR)

```powershell
# Windows PowerShell
cd C:\xampp\htdocs\personal\mendizabala

# Opción 1: Automatizado
.\setup.ps1

# Opción 2: Manual
npm install
cd backend && npm install && cd ..
psql -U postgres -h localhost -d mendizabala_db -f backend/schema.sql

# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev

# Abre http://localhost:5173
# Login: profesor1@mendizabala.eus
```

## 📅 Última actualización

- **Fecha:** 18 de diciembre de 2025
- **Versión:** 1.0 (Producción)
- **Estado:** ✅ Completo y funcional

---

**¿No sabes por dónde empezar?** → Lee [SETUP_LOCAL.md](SETUP_LOCAL.md) 🚀
