import express from 'express'
import pool from '../db.js'
import { generateToken } from '../auth.js'
import bcrypt from 'bcryptjs'

// import { sendMagicLink, generateOTP, verifyOTP } from '../email.js'
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' })

const router = express.Router()
const ALLOWED_DOMAINS = (process.env.ALLOWED_EMAIL_DOMAIN || 'mendizabala.eus').split(',').map(d => d.trim())


/**
 * POST /auth/register
 * Registrar nuevo usuario
 * body: { email, password, name, roles: ["admin", "teacher", ...] }
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, roles } = req.body
    if (!email || !password || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ error: 'Email, password y roles requeridos' })
    }
    const normalizedEmail = email.toLowerCase()
    // Validar dominio
    const domain = normalizedEmail.split('@')[1]
    if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
      return res.status(403).json({ error: `Solo emails de los dominios: ${ALLOWED_DOMAINS.join(', ')}` })
    }
    // Comprobar si ya existe
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail])
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Usuario ya existe' })
    }
    // Hash password
    const password_hash = await bcrypt.hash(password, 10)
    // Crear usuario
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id',
      [normalizedEmail, password_hash, name || normalizedEmail.split('@')[0]]
    )
    const userId = userResult.rows[0].id
    // Asignar roles
    for (const roleName of roles) {
      const roleRes = await pool.query('SELECT id FROM roles WHERE name = $1', [roleName])
      if (roleRes.rows.length > 0) {
        await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, roleRes.rows[0].id])
      }
    }
    res.json({ message: 'Usuario registrado', userId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

/**
 * POST /auth/login
 * Login estándar con email y password
 * body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password requeridos' })
    }
    const normalizedEmail = email.toLowerCase()
    const userRes = await pool.query('SELECT id, password_hash, name FROM users WHERE email = $1', [normalizedEmail])
    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }
    const user = userRes.rows[0]
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }
    // Obtener roles
    const rolesRes = await pool.query(
      'SELECT r.name FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = $1',
      [user.id]
    )
    const roles = rolesRes.rows.map(r => r.name)
    // Generar JWT con roles
    const token = generateToken(user.id, normalizedEmail, roles)
    res.json({
      message: 'Sesión iniciada',
      token,
      userId: user.id,
      email: normalizedEmail,
      name: user.name,
      roles
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

/**
 * POST /auth/verify-otp
 * Verificar código e iniciar sesión
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email y OTP requeridos' })
    }

    const normalizedEmail = email.toLowerCase()


    // Login rápido por código en entorno local
    if (process.env.NODE_ENV === 'development') {
      if (otp === process.env.LOGIN_CODE_ADMIN) {
        // Usuario admin
        const token = generateToken('admin', normalizedEmail)
        return res.json({
          message: 'Sesión iniciada (admin)',
          token,
          userId: 'admin',
          email: normalizedEmail,
          role: 'admin',
        })
      }
      if (otp === process.env.LOGIN_CODE_TEACHER) {
        // Usuario teacher
        const token = generateToken('teacher', normalizedEmail)
        return res.json({
          message: 'Sesión iniciada (teacher)',
          token,
          userId: 'teacher',
          email: normalizedEmail,
          role: 'teacher',
        })
      }
      if (otp === process.env.LOGIN_CODE_COMPANY) {
        // Usuario company
        const token = generateToken('company', normalizedEmail)
        return res.json({
          message: 'Sesión iniciada (company)',
          token,
          userId: 'company',
          email: normalizedEmail,
          role: 'company',
        })
      }
    }

    // Verificar OTP normal
    if (!verifyOTP(normalizedEmail, otp)) {
      return res.status(401).json({ error: 'Código inválido o expirado' })
    }

    // Buscar o crear usuario
    let result = await pool.query(
      'SELECT id FROM teachers WHERE email = $1',
      [normalizedEmail]
    )

    let userId
    if (result.rows.length === 0) {
      // Crear nuevo usuario (profesor)
      const createResult = await pool.query(
        'INSERT INTO teachers (email, name) VALUES ($1, $2) RETURNING id',
        [normalizedEmail, normalizedEmail.split('@')[0]]
      )
      userId = createResult.rows[0].id
    } else {
      userId = result.rows[0].id
    }

    // Generar JWT
    const token = generateToken(userId, normalizedEmail)

    res.json({
      message: 'Sesión iniciada',
      token,
      userId,
      email: normalizedEmail,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

/**
 * GET /auth/me
 * Obtener datos del usuario actual
 */
router.get('/me', async (req, res) => {
  try {
    // El authMiddleware debería haber validado y puesto req.user
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const result = await pool.query(
      'SELECT id, email, name, substitute_name FROM teachers WHERE id = $1',
      [req.user.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
