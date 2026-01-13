import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config({ path: '../../.env' })

// Almacenamiento temporal de OTP (en producción usar Redis)
const otpStore = new Map()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

/**
 * Generar OTP de 6 dígitos
 */
export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString()
}

/**
 * Enviar email con código de acceso
 */
export async function sendMagicLink(email, otp) {
  // Almacenar OTP (válido por 10 minutos)
  otpStore.set(email, {
    otp,
    expires: Date.now() + 10 * 60 * 1000,
  })

  // En desarrollo, mostrar OTP en consola
  if (process.env.NODE_ENV === 'development') {
    console.log('\n========================================')
    console.log(`🔐 OTP para ${email}: ${otp}`)
    console.log('📋 Copia este código y úsalo en el login')
    console.log('⏰ Válido por 10 minutos')
    console.log('========================================\n')
    return true
  }

  // En producción, enviar email
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@mendizabala.eus',
    to: email,
    subject: 'Tu código de acceso a Mendizabala LHII',
    html: `
      <h2>Acceso a Mendizabala LHII</h2>
      <p>Usa este código para iniciar sesión (válido por 10 minutos):</p>
      <h1 style="color: #1e5a96; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
      <p style="color: #666; font-size: 12px;">Si no solicitaste este código, ignora este email.</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`✉️ Email enviado a ${email}`)
    return true
  } catch (err) {
    console.error('❌ Error sending email:', err)
    return false
  }
}

/**
 * Verificar OTP
 */
export function verifyOTP(email, otp) {
  const stored = otpStore.get(email)
  
  if (!stored) {
    return false
  }

  if (Date.now() > stored.expires) {
    otpStore.delete(email)
    return false
  }

  if (stored.otp !== otp) {
    return false
  }

  otpStore.delete(email)
  return true
}
