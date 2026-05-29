import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts'
import { CATEGORIAS } from '../utils/categorias'
function GraficaActividad({ items }) {
  const datos = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dia = d.toISOString().split('T')[0]
    return {
      fecha: d.toLocaleDateString('es', { weekday: 'short', day: 'numeric' }),
      sesiones: items.filter(item =>
        item.fechaActividad?.startsWith(dia)
      ).length,
    }
  })
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 12, fontSize: '1rem' }}>Actividad ultimos 7 dias</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos}>
          <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="sesiones" name="Sesiones" fill="var(--color-acento)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
function GraficaCategorias({ items }) {
  const datos = CATEGORIAS.map(cat => ({
    name: cat.nombre,
    value: items.filter(i => i.categoriaId === cat.id).length,
    color: cat.color,
  })).filter(d => d.value > 0)
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 12, fontSize: '1rem' }}>Distribucion por categoria</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={datos}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {datos.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
function GraficaVolumen({ items }) {
  const datos = items
    .filter(i => i.atributos?.volumenTotal)
    .sort((a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro))
    .map(i => ({
      sesion: i.nombre.length > 15 ? i.nombre.slice(0, 15) + '…' : i.nombre,
      volumen: i.atributos.volumenTotal,
    }))
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 12, fontSize: '1rem' }}>Volumen total por sesion (kg)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={datos}>
          <XAxis dataKey="sesion" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="volumen"
            name="Volumen (kg)"
            stroke="var(--color-acento)"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
export default function Graficas({ items }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ marginBottom: 20, fontSize: '1.1rem' }}>Graficas</h2>
      <GraficaActividad   items={items} />
      <GraficaCategorias  items={items} />
      <GraficaVolumen     items={items} />
    </section>
  )
}
