export default function ChartCard({ title, sub, legend, children }) {
  return (
    <div style={s.card}>
      <div style={s.head}>
        <div>
          <h3 style={s.title}>{title}</h3>
          {sub && <span style={s.sub}>{sub}</span>}
        </div>
        {legend && (
          <div style={s.legend}>
            {legend.map(l => (
              <span key={l.label} style={s.legendItem}>
                <span style={{ ...s.legendDot, background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: '0 8px 12px' }}>{children}</div>
    </div>
  )
}

const s = {
  card: { background: '#fff', border: '1px solid #EEF1F4', borderRadius: 12, boxShadow: '0 1px 3px rgba(15,35,50,0.06)' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 16px 8px', gap: 12, flexWrap: 'wrap' },
  title: { margin: 0, fontSize: 15, fontWeight: 600, color: '#343A40' },
  sub: { fontSize: 12, color: '#6C757D', display: 'block', marginTop: 2 },
  legend: { display: 'flex', gap: 12, fontSize: 11, color: '#495057', fontWeight: 600, flexWrap: 'wrap' },
  legendItem: { display: 'inline-flex', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 999, display: 'inline-block' },
}
