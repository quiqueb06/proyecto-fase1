# Mi Entrenamiento — Bitácora de Sesiones

**Proyecto Final · Sistemas y Tecnologías Web · UVG 2026**  
**Fase 1:** useState · useEffect · Backend Express

---

## Descripción

Aplicación full-stack para gestionar mi bitácora personal de entrenamiento físico.
Registro sesiones de gym con tipo de entrenamiento, duración, ejercicios realizados e intensidad.

---

## Stack

| Capa      | Tecnología                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + Vite                     |
| Estado    | useState + useEffect + LocalStorage |
| Backend   | Node.js + Express 4                 |
| Base de datos | SQLite (better-sqlite3)         |
| CORS      | Configurado con variable FRONTEND_URL |

---

## Cómo correr el proyecto localmente

### Backend

```bash
cd backend
npm install
# Crear .env a partir del ejemplo:
cp .env.example .env
npm run dev
# → http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Estructura del proyecto

```
proyecto-fase1/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormularioItem.jsx   ← inputs controlados con useState
│   │   │   ├── ListaItems.jsx       ← mapea items con .map() + filtros
│   │   │   ├── ItemCard.jsx         ← card individual con acciones
│   │   │   └── ModalEditar.jsx      ← modal de edición
│   │   ├── utils/
│   │   │   └── categorias.js        ← CATEGORIAS y ESTADOS del tema
│   │   ├── App.jsx                  ← useState lazy init + useEffect sync
│   │   ├── index.css                ← variables CSS + estilos
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js          ← inicialización SQLite
│   │   ├── routes/
│   │   │   └── items.js             ← 5 endpoints REST
│   │   └── index.js                 ← servidor Express + CORS
│   └── package.json
└── .gitignore
```

---

## Endpoints del Backend

| Verbo  | Ruta                        | Descripción                        |
|--------|-----------------------------|------------------------------------|
| GET    | /api/items                  | Devuelve todos los items activos   |
| POST   | /api/items                  | Crea una nueva sesión              |
| PUT    | /api/items/:id              | Actualiza una sesión               |
| DELETE | /api/items/:id              | Archiva (soft-delete, activo=0)    |
| POST   | /api/items/:id/registro     | Registra minutos de actividad      |
| GET    | /health                     | Health check del servidor          |

---

## Modelo de datos — Item

| Campo           | Tipo        | Descripción                          |
|-----------------|-------------|--------------------------------------|
| id              | string UUID | crypto.randomUUID()                  |
| nombre          | string      | Nombre de la sesión                  |
| categoriaId     | string      | fuerza / cardio / flexibilidad / ... |
| estado          | string      | activo / completado / pausa          |
| puntuacion      | number/null | Intensidad 0-10                      |
| fechaRegistro   | string ISO  | Cuándo se creó el item               |
| fechaActividad  | string ISO  | Última interacción                   |
| notas           | string      | Observaciones libres                 |
| atributos       | JSON object | duracionMinutos, ejercicios, volumenTotal |
| activo          | boolean     | false = archivado                    |

---

## Mis primeros Items

> **Reemplaza esta sección con una captura de pantalla real tuya mostrando 3+ sesiones de entrenamiento propias (no placeholders).**

Ejemplo de sesiones reales que deberías registrar:
- Tu sesión de pecho del lunes
- Tu rutina de cardio favorita
- Un día de piernas específico

---

## Patrón clave implementado

```javascript
// useState con lazy initializer — se ejecuta UNA vez al montar
const [items, setItems] = useState(() => {
  try {
    const guardado = localStorage.getItem('items')
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
})

// useEffect sincroniza items → LocalStorage en cada cambio
useEffect(() => {
  localStorage.setItem('items', JSON.stringify(items))
}, [items])
```

---

## Categorías de entrenamiento

| ID           | Nombre       |
|--------------|--------------|
| fuerza       | Fuerza       |
| cardio       | Cardio       |
| flexibilidad | Flexibilidad |
| deportes     | Deportes     |
| hiit         | HIIT         |

---

*UVG · STW 2026 · Fase 1 de 4*
