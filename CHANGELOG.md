# 📝 CHANGELOG

Historial de cambios y versiones del proyecto.

## [1.0.0] - 18 de diciembre de 2025

### ✨ Características completadas

#### Frontend (React + TypeScript + Vite)
- [x] Sistema de diseño (CSS variables, 8 colores, tipografía)
- [x] Componentes modernos y responsivos
  - Login con OTP (2-step)
  - Dashboard con sidebar navigation
  - Kanban drag & drop
  - Companies CRUD + search
  - Contacts/Teachers CRUD
  - Language switcher
  - Auth guard
- [x] Internacionalización (ES/EU)
- [x] Build y compilación TypeScript sin errores

#### Backend (Node.js + Express) - NEW
- [x] Servidor Express completo
- [x] Autenticación OTP → JWT
- [x] Rutas CRUD para Teachers
- [x] Rutas CRUD para Companies
- [x] Nodemailer para envío de OTP
- [x] Middleware de protección (authMiddleware)
- [x] Validación de datos y email domain

#### Base de datos (PostgreSQL)
- [x] Schema completo (teachers, companies, relationships)
- [x] Índices para optimizar queries
- [x] Views y triggers automáticos
- [x] Datos de ejemplo para testing

#### Documentación
- [x] README.md actualizado
- [x] SETUP_LOCAL.md (setup paso a paso)
- [x] TESTING.md (checklist de tests)
- [x] QUICK_REFERENCE.md (comandos comunes)
- [x] PROJECT_STATUS.md (estado del proyecto)
- [x] DEPLOYMENT.md (guía de producción)
- [x] DESIGN_SYSTEM.md (especificación visual)
- [x] WEBSOCKET_ROADMAP.md (plan futuro)
- [x] INDEX.md (índice de documentación)
- [x] setup.ps1 (script de automatización)

### 🔄 Migraciones completadas

- [x] **Login.tsx** — De Supabase magic link a OTP + JWT
- [x] **AuthGate.tsx** — De Supabase session a apiClient.getMe()
- [x] **Dashboard.tsx** — Removidas funciones de exportación Supabase
- [x] **Kanban.tsx** — De Supabase realtime a polling + apiClient
- [x] **Companies.tsx** — De Supabase queries a apiClient + polling
- [x] **Contacts.tsx** — De Supabase queries a apiClient + polling
- [x] **apiClient.ts** — Nuevo cliente API reemplazando supabaseClient

### 🏗️ Arquitectura

**De:**
```
React (Frontend) → Supabase (Auth + BD + Realtime)
```

**A:**
```
React (Frontend) → Node.js/Express (Backend) → PostgreSQL
                   ↓
              Nodemailer (SMTP)
```

### 🔒 Seguridad

- [x] JWT tokens (stateless)
- [x] Email domain validation
- [x] CORS configurado
- [x] Protected routes
- [x] Parameterized SQL queries
- [ ] Rate limiting (TODO: producción)
- [ ] HTTPS/TLS (TODO: producción)

### 📊 Sincronización

- [x] Polling cada 5 segundos (funcional)
- [ ] WebSocket real-time (roadmap en WEBSOCKET_ROADMAP.md)

### 📦 Despliegue

- [x] Build frontend optimizado (`npm run build`)
- [x] Backend ready para producción (`npm start`)
- [x] Múltiples opciones de deploy documentadas
  - Local XAMPP
  - Vercel + Heroku/Railway
  - VPS propio
  - Docker

## 🚀 Cómo empezar

```powershell
# Opción 1: Automático
.\setup.ps1

# Opción 2: Manual (ver SETUP_LOCAL.md)
npm install
cd backend && npm install && cd ..
psql -U postgres -h localhost -d mendizabala_db -f backend/schema.sql

# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev

# Browser: http://localhost:5173
# Login: profesor1@mendizabala.eus
```

## 📈 Estadísticas

| Métrica | Valor |
|---------|-------|
| Archivos frontend | 15 |
| Archivos backend | 7 |
| Líneas código frontend | ~1,200 |
| Líneas código backend | ~600 |
| Líneas SQL | ~400 |
| Documentación | ~2,000 líneas |
| **Total** | **~4,200 líneas** |

## ✅ Tests completados

- [x] Build compilation
- [x] PostgreSQL connection
- [x] Backend startup
- [x] Frontend startup
- [x] Authentication flow (OTP)
- [x] CRUD operations (Teachers)
- [x] CRUD operations (Companies)
- [x] Kanban drag & drop
- [x] Language switching
- [x] Logout functionality
- [x] Error handling
- [x] Performance

## 🐛 Bugs conocidos / Limitaciones

- **Polling en lugar de WebSocket** — Solución: Ver WEBSOCKET_ROADMAP.md
- **OTP en memoria** — En producción usar Redis
- **Sin rate limiting** — Agregar en producción
- **Sin HTTPS local** — Agregar en producción

## 🔮 Próximos pasos (Fase 2)

### Corto plazo
- [ ] Implementar WebSocket para real-time
- [ ] Rate limiting en endpoints públicos
- [ ] Agregar tests automatizados

### Mediano plazo
- [ ] Roles de usuario (admin, teacher, manager)
- [ ] Audit logs
- [ ] Bulk import (CSV)
- [ ] Email notifications

### Largo plazo
- [ ] Dark mode
- [ ] Advanced reporting
- [ ] Mobile app (React Native)
- [ ] API pública (GraphQL)

## 📝 Notas

- El código está comentado y es fácil de entender
- La arquitectura es escalable y modular
- Todos los endpoints tienen validación
- La documentación es exhaustiva y en español

## 🙏 Créditos

Desarrollado como solución open source para Mendizabala LHII.

---

**Versión:** 1.0.0  
**Fecha:** 18 de diciembre de 2025  
**Estado:** ✅ Producción  
**Licencia:** MIT (código abierto)
