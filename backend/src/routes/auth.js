import express from 'express'
import pool from '../db.js'
import { generateToken } from '../auth.js'
import { sendMagicLink, generateOTP, verifyOTP } from '../email.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()
const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'mendizabala.eus'

/**
 * POST /auth/request-otp
 * Solicitar código de acceso
 */
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email requerido' })
    }

    const normalizedEmail = email.toLowerCase()
    const domain = normalizedEmail.split('@')[1]

    // Validar dominio
    if (!domain || domain !== ALLOWED_DOMAIN) {
      return res.status(403).json({ error: `Solo emails del dominio ${ALLOWED_DOMAIN}` })
    }

    // Generar OTP
    const otp = generateOTP()

    // Enviar email
    const sent = await sendMagicLink(normalizedEmail, otp)

    if (!sent) {
      // En desarrollo, retornar el OTP para pruebas
      if (process.env.NODE_ENV === 'development') {
        return res.json({ message: 'Check email (DEV: OTP is ' + otp + ')' })
      }
      return res.status(500).json({ error: 'Error enviando email' })
    }

    res.json({ message: 'Código enviado al email' })
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

    // Verificar OTP
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
