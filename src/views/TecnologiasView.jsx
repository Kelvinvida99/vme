import ChartCard from '../components/ChartCard'
import TechCIBar from '../components/charts/TechCIBar'
import { TECH_COLORS } from '../components/charts/TechDonut'
import { fmtNumber, fmtPct } from '../lib/format'

const th = { background: '#e6eef2', color: '#004e68', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #cfdde4' }
const td = { padding: '12px 14px', fontSize: 13, color: '#495057', borderBottom: '1px solid #EEF1F4' }

export default function TecnologiasView({ resumen }) {
  const total = resumen.reduce((s, d) => s + (d.ci || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 style={s.h1}>Resumen por tecnología</h1>
        <p style={s.sub}>Capacidad instalada y potencia efectiva neta por tipo de central · Mayo 2026</p>
      </div>

      <ChartCard title="Capacidad instalada por tecnología" sub="MW · ordenado de mayor a menor">
        <TechCIBar data={resumen} />
      </ChartCard>

      <div style={s.tableWrap}>
        <div style={s.tableHead}>
          <h3 style={s.tableTitle}>Detalle por tecnología</h3>
          <span style={s.tableSub}>Datos consolidados al cierre de mayo 2026</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Tecnología</th>
              <th style={{ ...th, textAlign: 'right' }}>N° centrales</th>
              <th style={{ ...th, textAlign: 'right' }}>Cap. instalada (MW)</th>
              <th style={{ ...th, textAlign: 'right' }}>% del total</th>
              <th style={{ ...th, textAlign: 'right' }}>PEN (MW)</th>
              <th style={{ ...th, textAlign: 'right' }}>Margen (MW)</th>
              <th style={{ ...th, textAlign: 'right' }}>Pot. firme hidros (MW)</th>
            </tr>
          </thead>
          <tbody>
            {resumen.map((r, i) => (
              <tr key={r.tecnologia} style={{ background: i % 2 ? '#F8F9FA' : '#fff' }}>
                <td style={td}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: TECH_COLORS[r.tecnologia] || '#ADB5BD', marginRight: 10, verticalAlign: 'middle' }} />
                  <strong style={{ color: '#343A40' }}>{r.tecnologia}</strong>
                </td>
                <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtNumber(r.nCentrales)}</td>
                <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtNumber(r.ci, 0)}</td>
                <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtPct(r.pctCI)}</td>
                <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.pen !== null ? fmtNumber(r.pen, 0) : '—'}</td>
                <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.margen !== null ? fmtNumber(r.margen, 0) : '—'}</td>
                <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.potFirme !== null ? fmtNumber(r.potFirme, 0) : '—'}</td>
              </tr>
            ))}
            <tr style={{ background: '#e6eef2', fontWeight: 700 }}>
              <td style={{ ...td, color: '#004e68', fontWeight: 700 }}>TOTAL SENI</td>
              <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#004e68', fontWeight: 700 }}>{resumen.reduce((s, d) => s + (d.nCentrales || 0), 0)}</td>
              <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#004e68', fontWeight: 700 }}>{fmtNumber(total, 0)}</td>
              <td style={{ ...td, textAlign: 'right', color: '#004e68', fontWeight: 700 }}>100.0%</td>
              <td style={{ ...td, textAlign: 'right', color: '#6C757D' }}>—</td>
              <td style={{ ...td, textAlign: 'right', color: '#6C757D' }}>—</td>
              <td style={{ ...td, textAlign: 'right', color: '#6C757D' }}>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const s = {
  h1: { margin: '0 0 4px', fontSize: 22, fontWeight: 600, color: '#343A40', letterSpacing: '-0.01em' },
  sub: { margin: 0, fontSize: 13, color: '#6C757D' },
  tableWrap: { background: '#fff', border: '1px solid #EEF1F4', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,35,50,0.06)' },
  tableHead: { padding: '14px 16px 10px', borderBottom: '1px solid #EEF1F4' },
  tableTitle: { margin: '0 0 2px', fontSize: 15, fontWeight: 600, color: '#343A40' },
  tableSub: { fontSize: 12, color: '#6C757D' },
}
