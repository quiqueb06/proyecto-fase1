require('dotenv').config()
const express = require('express')
const cors = require('cors')
const itemsRouter = require('./routes/items')
const app = express()
const PORT = process.env.PORT || 3001
app.use(cors({
  origin: '*'
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
  console.log(`

Mi Entrenamiento — Backend      
Puerto : ${PORT}                       
Endpoints disponibles:              
GET    /api/items                  
POST   /api/items                  
PUT    /api/items/:id              
DELETE /api/items/:id              
POST   /api/items/:id/registro     
GET    /health                     
  `)
})
