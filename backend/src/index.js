// backend/src/index.js
require('dotenv').config()

const express     = require('express')
const cors        = require('cors')
const itemsRouter = require('./routes/items')

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}))

app.use(express.json())

app.use('/api/items', itemsRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` })
})

app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`)
})
