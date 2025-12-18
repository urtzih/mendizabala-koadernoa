# ✅ Testing & Verificación

Checklist para verificar que todo funciona correctamente.

## 🧪 Test 1: Compilación

```powershell
npm run build
```

**Resultado esperado:**
```
✓ built in xxxx ms

dist/
  ├── index.html
  ├── assets/
  │   ├── index-xxxxx.js    (bundle React)
  │   ├── index-xxxxx.css   (estilos)
  │   └── ...
```

**Si falla:**
- `npm install` de nuevo
- Asegúrate de tener Node.js 16+
- Revisa que no haya errores TypeScript en `src/`

---

## 🔌 Test 2: Conexión a PostgreSQL

En PowerShell:

```powershell
psql -U postgres -h localhost -d mendizabala_db -c "SELECT COUNT(*) FROM teachers;"
```

**Resultado esperado:**
```
 count
-------
     3
(1 fila)
```

**Si falla:**
- PostgreSQL no está corriendo (revisa XAMPP)
- BD no existe (ejecuta `backend/schema.sql`)
- Contraseña incorrecta (por defecto `postgres`)

---

## 🚀 Test 3: Backend inicia correctamente

```powershell
cd backend
npm run dev
```

**Resultado esperado en los primeros 5 segundos:**
```
[HH:MM:SS] Server listening on http://localhost:3000
[HH:MM:SS] Database connected ✓
```

**Si falla con "ECONNREFUSED":**
- PostgreSQL no está corriendo
- Credenciales en `backend/.env` incorrectas
- Puerto 3000 ya está en uso

**Si falla con "ENOTFOUND smtp...":**
- Configuración SMTP es opcional para desarrollo
- Revisa logs del OTP en la consola en lugar de email

---

## 🎨 Test 4: Frontend inicia correctamente

En otra terminal:

```powershell
npm run dev
```

**Resultado esperado:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

**Si falla:**
- Puerto 5173 en uso
- Variables `.env` incorrectas
- Error TypeScript (revisa consola)

---

## 🔐 Test 5: Flujo de autenticación

1. Abre [http://localhost:5173](http://localhost:5173) en navegador
2. Login con email: `profesor1@mendizabala.eus`
3. Haz clic en "Enviar enlace"

**Resultado esperado:**

En la **consola del backend** (Terminal 1) deberías ver:
```
[13:45:22] Generating OTP for profesor1@mendizabala.eus
[13:45:22] OTP: 123456
[13:45:22] Sending OTP via SMTP...
[13:45:23] Email sent successfully (or error if SMTP no configurado)
```

O en la **interfaz frontend**:
- Mensaje: "Se ha enviado un código a tu email"
- Campo para introducir OTP aparece

**Introduce el OTP en el formulario:**
- Si no tienes email configurado, revisa los logs del backend para el código
- El código es válido durante 10 minutos

**Después de verificar OTP:**
- Deberías ver: Dashboard con Kanban/Empresas/Profesores
- Token guardado en `localStorage` (DevTools → Application → Local Storage → `token`)

---

## 📊 Test 6: CRUD Profesores

1. En Dashboard, haz clic en **"Profesores"** (sidebar izquierdo)
2. Haz clic en **"➕ Añadir profesor"**
3. Rellena los campos (mínimo: nombre y email)
4. Abre DevTools (F12) → Network

**Resultado esperado:**
- Petición `POST http://localhost:3000/api/teachers` → 201
- Nuevo profesor aparece en la tabla
- Token en header: `Authorization: Bearer eyJ...`

**Tests adicionales:**
- Edita un profesor: cambia nombre en el input
- Elimina un profesor: haz clic en 🗑️

---

## 🏢 Test 7: CRUD Empresas

1. Haz clic en **"Empresas"**
2. Haz clic en **"➕ Añadir empresa"**
3. Modal: rellena nombre, ubicación, etc.
4. Haz clic en "Guardar"

**Resultado esperado:**
- Petición `POST http://localhost:3000/api/companies` → 201
- Empresa aparece en lista
- Botones de email/web funcionan

**Tests adicionales:**
- Busca una empresa
- Haz clic en email/web (abre en nueva pestaña)
- Elimina una empresa

---

## 🔀 Test 8: Kanban Drag & Drop

1. Haz clic en **"Kanban"**
2. Arrastra una empresa (columna "Sin asignar") a un profesor

**Resultado esperado:**
- Empresa se mueve visualmente
- Petición `PUT http://localhost:3000/api/companies/:id` → 200
- Recarga de la página mantiene el cambio

---

## 🌐 Test 9: Cambio de idioma

1. Haz clic en **"🌐"** (arriba a la derecha)
2. Selecciona **"Euskera"** o **"Español"**

**Resultado esperado:**
- Todos los textos cambian
- LocalStorage actualizado: `LANGUAGE=eu` o `LANGUAGE=es`

---

## 🔑 Test 10: Logout

1. Haz clic en **"Salir"** (abajo en sidebar)

**Resultado esperado:**
- Redirigido a login
- Token eliminado de localStorage
- No puedes acceder a `/dashboard` sin login

---

## 🐛 Test 11: Error Handling

### Backend no disponible
1. Cierra la terminal del backend (Ctrl+C)
2. Intenta cargar empresas en el frontend
3. Deberías ver error en consola (F12)

**Resultado esperado:**
```
Error: Failed to fetch
GET http://localhost:3000/api/companies
```

### Token expirado (simular)
1. Login normalmente
2. Abre DevTools → Application → Local Storage
3. Elimina el token
4. Intenta cargar datos
5. Deberías ser redirigido a login

**Resultado esperado:**
- 401 error en network
- Redirección a `/` (login)

---

## 📈 Test 12: Performance

### Network
1. Abre DevTools (F12)
2. Tab "Network"
3. Carga la página
4. Verifica tiempos:
   - `index.html` < 500ms
   - `index-xxxxx.js` < 2s
   - API requests < 500ms

### Performance
1. Tab "Performance"
2. Haz clic en record
3. Interactúa (abrir modals, drag & drop)
4. Detén recording

**Resultado esperado:**
- Interacciones suaves (>60 FPS)
- Sin memory leaks evidentes
- CPU < 30% en operaciones normales

---

## ✅ Checklist Final

- [ ] Build compila sin errores
- [ ] PostgreSQL conecta correctamente
- [ ] Backend inicia y conecta a BD
- [ ] Frontend inicia en http://localhost:5173
- [ ] Login funciona con OTP
- [ ] CRUD Profesores: Create, Read, Update, Delete ✓
- [ ] CRUD Empresas: Create, Read, Update, Delete ✓
- [ ] Kanban drag & drop funciona
- [ ] Cambio de idioma funciona
- [ ] Logout funciona
- [ ] Errores se manejan gracefully
- [ ] DevTools Network muestra requests correctas

---

## 🎉 ¡Listo para producción!

Si todos los tests pasan, el sistema está listo para:
1. Cambiar usuarios/emails reales
2. Configurar email SMTP en producción
3. Deploy en servidor

Ver `SETUP_LOCAL.md` para despliegue.
