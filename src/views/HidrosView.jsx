import ChartCard from '../components/ChartCard'
import HidroFirmeBar from '../components/charts/HidroFirmeBar'
import { fmtNumber } from '../lib/format'

const th = { background: '#e6eef2', color: '#004e68', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #cfdde4' }
const td = { padding: '11px 14px', fontSize: 13, color: '#495057', borderBottom: '1px solid #EEF1F4' }

const SUBTIPOS = ['Embalse', 'Pasada', 'Filo de agua']
const SUBTIPO_COLORS = { 'Embalse': '#004e68', 'Pasada': '#4F81BD', 'Filo de agua': '#E46C0A' }

export default function HidrosView({ hidros, hidroParque }) {
  const totalCI  = hidroParque.reduce((s, d) => s + (d.ci  || 0), 0)
  const totalPEN = hidroParque.reduce((s, d) => s + (d.pen || 0), 0)

  const bySubtipo = SUBTIPOS.map(st => ({
    subtipo: st,
    items: hidros.filter(d => d.subtipo === st),
  })).filter(g => g.items.length > 0)

  const otherSubtipos = hidros.filter(d => !SUBTIPOS.includes(d.subtipo))
  if (otherSubtipos.length > 0) bySubtipo.push({ subtipo: 'Otro', items: otherSubtipos })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 style={s.h1}>Centrales hidroeléctricas · EGEHID</h1>
        <p style={s.sub}>Capacidad instalada por central · Datos OC-SENI / Parque Generador</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        <div style={s.statCard}>
          <span style={s.statLabel}>Centrales hidroeléctricas</span>
          <span style={s.statValue} className="vme-num">{hidroParque.length}</span>
        </div>
        <div style={s.statCard}>
          <span style={s.statLabel}>Capacidad instalada total</span>
          <span style={s.statValue} className="vme-num">{fmtNumber(totalCI, 0)} <span style={{ fontSize: 14, fontWeight: 500, color: '#6C757D' }}>MW</span></span>
        </div>
        <div style={s.statCard}>
          <span style={s.statLabel}>PEN total declarada</span>
          <span style={s.statValue} className="vme-num">{fmtNumber(totalPEN, 0)} <span style={{ fontSize: 14, fontWeight: 500, color: '#6C757D' }}>MW</span></span>
        </div>
      </div>

      <ChartCard
        title="Capacidad instalada por central hidroeléctrica"
        sub="MW · ordenado por central · Fuente: Parque Generador SENI"
      >
        <HidroFirmeBar data={hidroParque} />
      </ChartCard>

      {bySubtipo.map(group => (
        <div key={group.subtipo} style={s.tableWrap}>
          <div style={s.tableHead}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: SUBTIPO_COLORS[group.subtipo] || '#ADB5BD', display: 'inline-block' }} />
              <h3 style={s.tableTitle}>{group.subtipo}</h3>
            </div>
            <span style={s.tableSub}>{group.items.length} unidades · EGEHID</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Nombre de unidad</th>
                <th style={th}>Código</th>
                <th style={{ ...th, textAlign: 'right' }}>PEN (MW)</th>
                <th style={{ ...th, textAlign: 'right' }}>Pot. media (MW)</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((r, i) => (
                <tr key={r.codigo} style={{ background: i % 2 ? '#F8F9FA' : '#fff' }}>
                  <td style={{ ...td, fontWeight: 600, color: '#343A40' }}>{r.nombre}</td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: 12 }}>{r.codigo}</td>
                  <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.pen !== null ? fmtNumber(r.pen, 3) : '—'}</td>
                  <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.potMedia !== null ? fmtNumber(r.potMedia, 3) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

const s = {
  h1: { margin: '0 0 4px', fontSize: 22, fontWeight: 600, color: '#343A40', letterSpacing: '-0.01em' },
  sub: { margin: 0, fontSize: 13, color: '#6C757D' },
  statCard: { background: '#fff', border: '1px solid #EEF1F4', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 1px 3px rgba(15,35,50,0.06)' },
  statLabel: { fontSize: 13, color: '#6C757D', fontWeight: 500 },
  statValue: { fontSize: 26, fontWeight: 700, color: '#004e68', lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  tableWrap: { background: '#fff', border: '1px solid #EEF1F4', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,35,50,0.06)' },
  tableHead: { padding: '14px 16px 10px', borderBottom: '1px solid #EEF1F4' },
  tableTitle: { margin: 0, fontSize: 15, fontWeight: 600, color: '#343A40', display: 'inline' },
  tableSub: { fontSize: 12, color: '#6C757D', display: 'block', marginTop: 4 },
}
