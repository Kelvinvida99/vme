import Icon from '../components/Icon'

export default function NotasView({ notas }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 style={s.h1}>Notas metodológicas</h1>
        <p style={s.sub}>Fuentes, definiciones de indicadores y aclaraciones sobre la compilación de datos</p>
      </div>

      <div style={s.infoBox}>
        <span style={s.infoIcon}><Icon name="info" size={18} /></span>
        <p style={s.infoText}>
          Tabla elaborada por el Ministerio de Energía y Minas (MEM-RD), Dirección de Planificación y Desarrollo del Sector Energético. Mayo 2026.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {notas.map((n, i) => (
          <div key={i} style={s.card}>
            <div style={s.cardTag}>{n.termino}</div>
            <p style={s.cardBody}>{n.definicion}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const s = {
  h1: { margin: '0 0 4px', fontSize: 22, fontWeight: 600, color: '#343A40', letterSpacing: '-0.01em' },
  sub: { margin: 0, fontSize: 13, color: '#6C757D' },
  infoBox: { display: 'flex', gap: 12, padding: 14, background: '#fff', border: '1px solid #EEF1F4', borderLeft: '4px solid #004e68', borderRadius: 12, alignItems: 'flex-start' },
  infoIcon: { color: '#004e68', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 999, background: '#e6eef2', flexShrink: 0 },
  infoText: { margin: 0, fontSize: 13, color: '#495057', lineHeight: 1.5 },
  card: { background: '#fff', border: '1px solid #EEF1F4', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 1px 3px rgba(15,35,50,0.06)' },
  cardTag: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#004e68', background: '#e6eef2', padding: '3px 8px', borderRadius: 6, display: 'inline-block', alignSelf: 'flex-start' },
  cardBody: { margin: 0, fontSize: 13, color: '#495057', lineHeight: 1.55 },
}
