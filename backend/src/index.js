// backend/src/index.js
require('dotenv').config()

const express    = require('express')
const cors       = require('cors')
const itemsRouter = require('./routes/items')

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}))

app.use(express.json())

// ── Rutas ─────────────────────────────────────────────────────────────────────
app.use('/api/items', itemsRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` })
})

// ── Arrancar servidor ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║  Mi Entrenamiento — Backend          ║
  ║  Puerto : ${PORT}                       ║
  ║  Endpoints disponibles:              ║
  ║   GET    /api/items                  ║
  ║   POST   /api/items                  ║
  ║   PUT    /api/items/:id              ║
  ║   DELETE /api/items/:id              ║
  ║   POST   /api/items/:id/registro     ║
  ║   GET    /health                     ║
  ╚══════════════════════════════════════╝
  `)
})
