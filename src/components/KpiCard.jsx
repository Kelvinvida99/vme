export default function KpiCard({ label, value, unit, sub }) {
  return (
    <div style={s.card}>
      <span style={s.label}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={s.value} className="vme-num">{value}</span>
        {unit && <span style={s.unit}>{unit}</span>}
      </div>
      {sub && <span style={s.sub}>{sub}</span>}
    </div>
  )
}

const s = {
  card: { background: '#fff', border: '1px solid #EEF1F4', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 1px 3px rgba(15,35,50,0.06)' },
  label: { fontSize: 13, color: '#6C757D', fontWeight: 500 },
  value: { fontSize: 28, fontWeight: 700, color: '#004e68', lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  unit: { fontSize: 13, color: '#6C757D', fontWeight: 500 },
  sub: { fontSize: 11, color: '#6C757D' },
}
