import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../auth.js'

const router = express.Router()

/**
 * GET /companies
 * Obtener lista de todas las empresas
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, name, location, contact_person, email, phone, website,
        assigned_teacher_id, status,
        demand_dual1, demand_dual_general, demand_dual_intensive
       FROM companies
       ORDER BY name`
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener empresas' })
  }
})

/**
 * POST /companies
 * Crear nueva empresa
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, location, contactPerson, email, phone, website } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nombre requerido' })
    }

    const result = await pool.query(
      `INSERT INTO companies (name, location, contact_person, email, phone, website, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'orange')
       RETURNING *`,
      [name, location || null, contactPerson || null, email || null, phone || null, website || null]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear empresa' })
  }
})

/**
 * PUT /companies/:id
 * Actualizar empresa
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { 
      name, location, contactPerson, email, phone, website,
      assignedTeacherId, status,
      demandDual1, demandDualGeneral, demandDualIntensive
    } = req.body

    const result = await pool.query(
      `UPDATE companies 
       SET 
        name = COALESCE($1, name),
        location = COALESCE($2, location),
        contact_person = COALESCE($3, contact_person),
        email = COALESCE($4, email),
        phone = COALESCE($5, phone),
        website = COALESCE($6, website),
        assigned_teacher_id = COALESCE($7, assigned_teacher_id),
        status = COALESCE($8, status),
        demand_dual1 = COALESCE($9, demand_dual1),
        demand_dual_general = COALESCE($10, demand_dual_general),
        demand_dual_intensive = COALESCE($11, demand_dual_intensive),
        updated_at = NOW()
       WHERE id = $12
       RETURNING *`,
      [
        name || null, location || null, contactPerson || null,
        email || null, phone || null, website || null,
        assignedTeacherId || null, status || null,
        demandDual1 || null, demandDualGeneral || null, demandDualIntensive || null,
        id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa no encontrada' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al actualizar empresa' })
  }
})

/**
 * DELETE /companies/:id
 * Eliminar empresa
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM companies WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa no encontrada' })
    }

    res.json({ message: 'Empresa eliminada' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al eliminar empresa' })
  }
})

export default router
