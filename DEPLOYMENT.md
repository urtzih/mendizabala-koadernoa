# 🌍 Guía de despliegue en PRODUCCIÓN

Instrucciones para desplegar la aplicación en servidores reales.

## 🎯 Opciones de despliegue

### Opción 1: Despliegue local en XAMPP (Recomendado para inicio)

**Ideal para:** Pequeñas instituciones, redes locales, intranet

```powershell
# 1. Backend en port 3000
cd C:\xampp\htdocs\personal\mendizabala\backend
npm install --production
npm start  # O usa pm2

# 2. Frontend en htdocs
npm run build
# Copia dist/* a C:\xampp\htdocs\

# 3. PostgreSQL
# XAMPP ya lo incluye, asegúrate de iniciarlo

# 4. Acceso
# http://localhost/
```

### Opción 2: Vercel (Frontend) + Heroku/Railway (Backend)

**Ideal para:** SaaS, acceso desde internet, escalable

#### Frontend en Vercel

1. Sube tu repo a GitHub
2. Conecta en [vercel.com](https://vercel.com)
3. Variables de entorno:
   ```
   VITE_API_URL=https://tu-api-produccion.com/api
   VITE_ALLOWED_EMAIL_DOMAIN=mendizabala.eus
   ```
4. Deploy automático con cada push

#### Backend en Railway

1. Conecta tu repo GitHub
2. Crea PostgreSQL plugin
3. Variables de entorno:
   ```
   DB_HOST=railway postgres host
   DB_NAME=mendizabala_db
   DB_USER=...
   DB_PASSWORD=...
   JWT_SECRET=cambiar_cambiar_cambiar
   SMTP_HOST=...
   SMTP_PORT=...
   ... etc
   ```
4. Deploy automático

### Opción 3: VPS Propio (DigitalOcean, Linode, AWS EC2)

**Ideal para:** Control total, seguridad máxima, datos sensibles

```bash
# En servidor Ubuntu 20.04+

# 1. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Instalar PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# 3. Crear base de datos
sudo -u postgres psql
CREATE DATABASE mendizabala_db;
\q

# 4. Ejecutar schema
sudo -u postgres psql mendizabala_db < /ruta/a/schema.sql

# 5. Clonar repo
cd /opt
git clone https://github.com/tu-usuario/mendizabala.git
cd mendizabala

# 6. Instalar dependencias
npm install
cd backend
npm install
cd ..

# 7. Configurar .env
nano backend/.env
# Edita con valores de producción

# 8. Iniciar con PM2
npm install -g pm2
pm2 start backend/index.js --name "mendizabala-api"
pm2 startup
pm2 save

# 9. Build frontend
npm run build

# 10. Servir con nginx
sudo apt-get install -y nginx
# Configurar nginx (ver sección abajo)
```

### Opción 4: Docker (Contenedores)

**Ideal para:** Portabilidad, consistencia, scaling

Crear `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src ./src
EXPOSE 3000
CMD ["npm", "start"]
```

Crear `docker-compose.yml`:
```yaml
version: '3.9'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mendizabala_db
      POSTGRES_PASSWORD: tu_contraseña
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DB_HOST: postgres
      DB_NAME: mendizabala_db
      JWT_SECRET: cambiar_en_produccion
      SMTP_HOST: ${SMTP_HOST}
      # ... más variables
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  frontend:
    build: .
    # Servir dist/ con nginx
    ports:
      - "80:80"

volumes:
  postgres_data:
```

Ejecutar:
```bash
docker-compose up -d
```

## 🔧 Configuración de producción

### Backend `.env` (Producción)

```bash
# Database (usar PostgreSQL en la nube)
DB_HOST=db.produccion.com
DB_PORT=5432
DB_NAME=mendizabala_prod
DB_USER=mendizabala_user
DB_PASSWORD=contraseña_muy_segura_aqui

# JWT (cambiar a secreto aleatorio de 32 caracteres)
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRY=7d

# Email (usar servicio profesional)
SMTP_HOST=smtp.sendgrid.net  # O AWS SES, Mailgun, etc.
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxx
SMTP_FROM=noreply@mendizabala.eus

# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://mendizabala.eus
ALLOWED_EMAIL_DOMAIN=mendizabala.eus
LOG_LEVEL=info
```

### Frontend `.env` (Producción)

```bash
VITE_API_URL=https://api.mendizabala.eus/api
VITE_ALLOWED_EMAIL_DOMAIN=mendizabala.eus
```

### Nginx Configuration

Crear `/etc/nginx/sites-available/mendizabala`:

```nginx
upstream backend {
    server localhost:3000;
}

server {
    listen 80;
    server_name mendizabala.eus www.mendizabala.eus;
    
    # Redirigir a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mendizabala.eus www.mendizabala.eus;
    
    # SSL (usar Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/mendizabala.eus/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mendizabala.eus/privkey.pem;
    
    # Frontend (dist/)
    root /opt/mendizabala/dist;
    
    # SPA: servir index.html para rutas desconocidas
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend proxy
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

Activar:
```bash
sudo ln -s /etc/nginx/sites-available/mendizabala /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

### SSL con Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d mendizabala.eus -d www.mendizabala.eus
# Auto-renew:
sudo systemctl enable certbot.timer
```

## 📊 Checklist pre-producción

### Seguridad
- [ ] JWT_SECRET es aleatorio (32+ caracteres)
- [ ] HTTPS/SSL configurado
- [ ] CORS solo permite frontend
- [ ] Rate limiting en endpoints públicos
- [ ] Validación de input en todas las APIs
- [ ] Credenciales SMTP aseguradas
- [ ] Backups automáticos de BD

### Performance
- [ ] Frontend minificado y bundles optimizados
- [ ] Caché de assets estáticos
- [ ] Gzip habilitado
- [ ] CDN para assets (opcional)
- [ ] Database indexes verificados
- [ ] Conexión pool de PostgreSQL optimizada

### Monitoreo
- [ ] Logs centralizados (ELK, Datadog, etc.)
- [ ] Error tracking (Sentry, Rollbar)
- [ ] Uptime monitoring
- [ ] CPU/Memoria alerts
- [ ] Disk space alerts
- [ ] Database connection pool alerts

### Backups
- [ ] Backups diarios de PostgreSQL
- [ ] Retención de 30 días
- [ ] Prueba de restauración mensual
- [ ] Almacenamiento off-site

## 📈 Escalado futuro

Si la aplicación crece:

1. **Base de datos**
   - Pasar de PostgreSQL single a replica
   - Read replicas para queries
   - Connection pooling (PgBouncer)

2. **Backend**
   - Horizontal scaling (múltiples instancias)
   - Load balancer (nginx, HAProxy)
   - Cache (Redis) para OTPs y sesiones

3. **Frontend**
   - CDN (Cloudflare, AWS CloudFront)
   - Image optimization
   - Lazy loading

4. **Real-time**
   - WebSocket servidor independiente
   - Message queue (RabbitMQ, Redis)
   - Event broadcasting

## 🔍 Monitoreo en producción

```bash
# Ver logs backend
pm2 logs mendizabala-api

# Ver estado
pm2 status

# Estadísticas
pm2 monit

# Ver conexiones
sudo netstat -tlnp | grep 3000

# Ver procesos PostgreSQL
sudo -u postgres psql -c "SELECT * FROM pg_stat_statements;"
```

## 🆘 Troubleshooting producción

### "Port 3000 in use"
```bash
lsof -i :3000
kill -9 <PID>
pm2 restart mendizabala-api
```

### "Database connection error"
```bash
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
# Verificar firewall:
sudo ufw allow 5432
```

### "SMTP error"
```bash
# Testear SMTP
telnet smtp.sendgrid.net 587
# Verificar credenciales en .env
```

---

**Resumen:** Elige la opción de despliegue según tus necesidades:
- **Local XAMPP** → Rápido, simple, intranet
- **Vercel + Heroku** → Escalable, gratis/bajo costo
- **VPS propio** → Control total, datos sensibles
- **Docker** → Portabilidad, consistencia
