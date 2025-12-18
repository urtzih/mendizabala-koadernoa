import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../auth.js'

const router = express.Router()

/**
 * GET /teachers
 * Obtener lista de todos los profesores
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, substitute_name FROM teachers ORDER BY name'
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener profesores' })
  }
})

/**
 * POST /teachers
 * Crear nuevo profesor
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, substituteName } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y email requeridos' })
    }

    const result = await pool.query(
      'INSERT INTO teachers (name, email, substitute_name) VALUES ($1, $2, $3) RETURNING *',
      [name, email, substituteName || null]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear profesor' })
  }
})

/**
 * PUT /teachers/:id
 * Actualizar profesor
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, substituteName } = req.body

    const result = await pool.query(
      'UPDATE teachers SET name = COALESCE($1, name), email = COALESCE($2, email), substitute_name = COALESCE($3, substitute_name) WHERE id = $4 RETURNING *',
      [name || null, email || null, substituteName || null, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al actualizar profesor' })
  }
})

/**
 * DELETE /teachers/:id
 * Eliminar profesor
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM teachers WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' })
    }

    res.json({ message: 'Profesor eliminado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al eliminar profesor' })
  }
})

export default router
