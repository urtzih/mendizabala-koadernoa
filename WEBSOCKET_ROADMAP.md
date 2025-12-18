# 🔄 WebSocket Real-Time — Roadmap

Actualmente el sistema usa **polling (5 segundos)** para sincronización. Este documento describe cómo implementar **WebSockets para sincronización verdadera en tiempo real**.

## 📊 Comparativa: Polling vs WebSocket

| Aspecto | Polling (actual) | WebSocket (future) |
|--------|------------------|-------------------|
| **Latencia** | ~5 segundos | <100ms |
| **Carga servidor** | Alta (muchas requests) | Baja (conexión persistente) |
| **Uso ancho banda** | Mucho (headers repetidos) | Eficiente |
| **Complejidad** | Simple | Media |
| **Escalabilidad** | Mala (N*5s requests) | Buena (conexión 1:1) |

## 🎯 Objetivo

Reemplazar:
```javascript
// Actual (5 segundos)
const interval = setInterval(load, 5000)
```

Con:
```javascript
// Futuro (tiempo real)
ws.on('companies:update', (data) => setItems(data))
```

## 🏗️ Arquitectura propuesta

### Backend (`backend/src/websocket.js`)
```javascript
const WebSocket = require('ws')
const jwt = require('jsonwebtoken')

const wss = new WebSocket.Server({ port: 3001 })

// Almacenar conexiones activas
const clients = new Map()

wss.on('connection', (ws, req) => {
  // Verificar JWT del cliente
  const token = getTokenFromUrl(req.url)
  if (!token) {
    ws.close(1008, 'Unauthorized')
    return
  }

  const userId = verifyToken(token).id
  clients.set(userId, ws)
  console.log(`User ${userId} connected`)

  // Escuchar mensajes
  ws.on('message', (data) => {
    const msg = JSON.parse(data)
    handleMessage(msg, userId)
  })

  ws.on('close', () => {
    clients.delete(userId)
    console.log(`User ${userId} disconnected`)
  })
})

// Función para broadcast a todos
function broadcast(event, data) {
  clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event, data }))
    }
  })
}

// Cuando se crea/actualiza una empresa:
app.put('/api/companies/:id', (req, res) => {
  // ... actualizar BD ...
  broadcast('companies:update', updatedCompanies)
  res.json(updated)
})
```

### Frontend (adaptar componentes)

**Antes (polling):**
```tsx
useEffect(() => {
  load()
  const interval = setInterval(load, 5000)
  return () => clearInterval(interval)
}, [])
```

**Después (WebSocket):**
```tsx
useEffect(() => {
  const ws = new WebSocket('ws://localhost:3001', token)

  ws.on('companies:update', (data) => {
    setItems(data)
  })

  ws.on('error', () => {
    // Fallback a polling si WebSocket falla
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  })

  return () => ws.close()
}, [])
```

## 📋 Pasos de implementación

### Fase 1: Servidor WebSocket (backend)
1. Crear `backend/src/websocket.js` con servidor WebSocket
2. Integrar en `backend/src/index.js` (escuchar en puerto 3001)
3. Agregar JWT verification en conexión
4. Implementar broadcast para eventos CRUD

### Fase 2: Cliente WebSocket (frontend)
1. Crear `src/lib/websocket.ts` con clase `WebSocketClient`
2. Método `connect()`: conectar con JWT
3. Método `on()`: escuchar eventos
4. Método `send()`: enviar mensajes
5. Auto-reconnect con exponential backoff

### Fase 3: Integración en componentes
1. Reemplazar polling en `Kanban.tsx`
2. Reemplazar polling en `Companies.tsx`
3. Reemplazar polling en `Contacts.tsx`
4. Actualizar `apiClient.ts` para avisar a WebSocket en cambios

### Fase 4: Testing
1. Abrir 2 navegadores
2. Crear empresa en navegador 1
3. Verificar que aparece en navegador 2 al instante
4. Drag & drop: sincronización instant

## 📦 Dependencias necesarias

```json
{
  "ws": "^8.14.0",
  "reconnecting-websocket": "^4.4.0"
}
```

```bash
cd backend
npm install ws reconnecting-websocket
```

## 🔐 Seguridad

- ✅ Verificar JWT en la URL (`ws://localhost:3001?token=...`)
- ✅ Validar permisos: usuario solo ve sus datos
- ✅ Rate limiting: máximo 10 mensajes/segundo por cliente
- ✅ Validación: mensaje debe tener `event` y `data` válidos
- ✅ HTTPS/WSS en producción (ws → wss)

## 🐛 Error handling

```javascript
// Reconexión automática
let reconnectAttempts = 0
const maxReconnectAttempts = 5

function reconnect() {
  if (reconnectAttempts < maxReconnectAttempts) {
    setTimeout(() => {
      ws = new WebSocket(...)
      reconnectAttempts++
    }, Math.pow(2, reconnectAttempts) * 1000)
  } else {
    // Fallback a polling
    setInterval(load, 5000)
  }
}

ws.onerror = () => {
  console.log('WebSocket error, attempting reconnect...')
  reconnect()
}
```

## 📊 Eventos propuestos

```
# Profesor creado/actualizado
teachers:update → { teachers: [...] }

# Empresa creada/actualizada
companies:update → { companies: [...] }

# Asignación cambió (drag & drop)
assignment:changed → { companyId, teacherId }

# Empresa eliminada
companies:deleted → { id }

# Alerta general
notification → { message, type }
```

## 🎯 Beneficios finales

- ✅ 100% sincronización en tiempo real
- ✅ Drag & drop reflejado al instante en otros usuarios
- ✅ Menos carga en servidor
- ✅ Mejor UX (sin delay de 5 segundos)
- ✅ Escalable (soporta muchos usuarios)

## 📝 Estimación de esfuerzo

- Backend WebSocket: **2-3 horas**
- Frontend cliente: **1-2 horas**
- Integración componentes: **1-2 horas**
- Testing: **1 hora**
- **Total: 5-8 horas**

---

## 🔗 Referencias

- [ws library](https://github.com/websockets/ws)
- [WebSocket MDN](https://developer.mozilla.org/es/docs/Web/API/WebSocket)
- [Socket.IO](https://socket.io/) (alternativa con fallback)

---

**Próximo paso:** Cuando el sistema esté en producción y se necesite mejor experiencia real-time, implementar este roadmap.
