// backend/src/routes/items.js
const express = require('express')
const { randomUUID } = require('crypto')
const db = require('../db/database')

const router = express.Router()

function parsearItem(row) {
  if (!row) return null
  return {
    ...row,
    activo:    Boolean(row.activo),
    atributos: JSON.parse(row.atributos || '{}'),
  }
}

// ─── GET /api/items ──────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const rows = db
      .prepare('SELECT * FROM items WHERE activo = 1 ORDER BY fechaRegistro DESC')
      .all()
    res.json(rows.map(parsearItem))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/items ─────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  const { nombre, categoriaId, estado = 'activo', puntuacion = null, notas = '', atributos = {} } = req.body

  if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
    return res.status(400).json({ error: 'El campo "nombre" debe tener al menos 3 caracteres.' })
  }
  if (!categoriaId) {
    return res.status(400).json({ error: 'El campo "categoriaId" es obligatorio.' })
  }

  try {
    const ahora = new Date().toISOString()
    const nuevo = {
      id:             randomUUID(),
      nombre:         nombre.trim(),
      categoriaId,
      estado,
      puntuacion,
      fechaRegistro:  req.body.fechaRegistro  || ahora,
      fechaActividad: req.body.fechaActividad || ahora,
      notas:          notas.trim(),
      atributos:      JSON.stringify(atributos),
      activo:         1,
    }
    db.prepare(`
      INSERT INTO items
        (id, nombre, categoriaId, estado, puntuacion,
         fechaRegistro, fechaActividad, notas, atributos, activo)
      VALUES
        (@id, @nombre, @categoriaId, @estado, @puntuacion,
         @fechaRegistro, @fechaActividad, @notas, @atributos, @activo)
    `).run(nuevo)
    res.status(201).json(parsearItem({ ...nuevo, activo: 1 }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── PUT /api/items/:id ──────────────────────────────────────────────────────
router.put('/:id', (req, res) => {
  const { id } = req.params
  const existe = db.prepare('SELECT id FROM items WHERE id = ?').get(id)
  if (!existe) return res.status(404).json({ error: 'Item no encontrado' })

  const { nombre, categoriaId, estado, puntuacion, notas, atributos } = req.body

  try {
    const campos  = []
    const valores = {}

    if (nombre      !== undefined) { campos.push('nombre = @nombre');           valores.nombre      = nombre.trim() }
    if (categoriaId !== undefined) { campos.push('categoriaId = @categoriaId'); valores.categoriaId = categoriaId }
    if (estado      !== undefined) { campos.push('estado = @estado');           valores.estado      = estado }
    if (puntuacion  !== undefined) { campos.push('puntuacion = @puntuacion');   valores.puntuacion  = puntuacion }
    if (notas       !== undefined) { campos.push('notas = @notas');             valores.notas       = notas }
    if (atributos   !== undefined) { campos.push('atributos = @atributos');     valores.atributos   = JSON.stringify(atributos) }

    campos.push('fechaActividad = @fechaActividad')
    valores.fechaActividad = new Date().toISOString()
    valores.id = id

    db.prepare(`UPDATE items SET ${campos.join(', ')} WHERE id = @id`).run(valores)
    const actualizado = db.prepare('SELECT * FROM items WHERE id = ?').get(id)
    res.json(parsearItem(actualizado))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── DELETE /api/items/:id ───────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  try {
    const info = db.prepare('UPDATE items SET activo = 0 WHERE id = ?').run(req.params.id)
    if (info.changes === 0) return res.status(404).json({ error: 'Item no encontrado' })
    res.json({ mensaje: 'Archivado correctamente', id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/items/:id/registro ────────────────────────────────────────────
router.post('/:id/registro', (req, res) => {
  const { id } = req.params
  const { valor, notas = '', fecha } = req.body

  const item = db.prepare('SELECT id FROM items WHERE id = ? AND activo = 1').get(id)
  if (!item) return res.status(404).json({ error: 'Item no encontrado o archivado' })

  if (valor === undefined || isNaN(Number(valor)) || Number(valor) < 0) {
    return res.status(400).json({ error: '"valor" debe ser un número positivo (minutos).' })
  }

  try {
    const registro = {
      id:     randomUUID(),
      itemId: id,
      fecha:  fecha || new Date().toISOString().split('T')[0],
      valor:  Number(valor),
      notas:  notas.trim(),
    }
    db.prepare(`
      INSERT INTO registros (id, itemId, fecha, valor, notas)
      VALUES (@id, @itemId, @fecha, @valor, @notas)
    `).run(registro)
    db.prepare('UPDATE items SET fechaActividad = ? WHERE id = ?').run(new Date().toISOString(), id)
    res.status(201).json(registro)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
