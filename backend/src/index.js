import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import teachersRoutes from './routes/teachers.js'
import companiesRoutes from './routes/companies.js'
import { authMiddleware } from './auth.js'

dotenv.config({ path: '../../.env' })

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:5174').split(',')
app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (como herramientas de prueba o apps móviles)
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mendizabala Backend running' })
})

// Rutas públicas
app.use('/api/auth', authRoutes)

// Rutas protegidas
app.use('/api/teachers', authMiddleware, teachersRoutes)
app.use('/api/companies', authMiddleware, companiesRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Mendizabala Backend listening on http://localhost:${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
})
