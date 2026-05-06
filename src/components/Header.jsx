export default function Header({ filterTech, onFilterTech, techOptions = [] }) {
  return (
    <header style={s.wrap}>
      <div style={s.left}>
        <img src="/escudo.svg" width="40" height="40" alt="Escudo nacional" />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={s.title}>Parque Generador del Sistema Eléctrico Nacional</span>
          <span style={s.sub}>Viceministerio de Energía Eléctrica · Datos consolidados mayo 2026</span>
        </div>
      </div>
      <div style={s.right}>
        {techOptions.length > 0 && (
          <label style={s.filterLabel}>
            <span style={s.filterCap}>Tecnología</span>
            <select
              value={filterTech}
              onChange={e => onFilterTech(e.target.value)}
              style={s.select}
            >
              <option value="all">Todas</option>
              {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        )}
        <div style={s.pill}>
          <span style={s.dot} />
          EN LÍNEA · MAYO 2026
        </div>
      </div>
    </header>
  )
}

const s = {
  wrap: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: '#fff', borderBottom: '1px solid #EEF1F4', gap: 16, flexWrap: 'wrap', flexShrink: 0 },
  left: { display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 },
  title: { fontSize: 15, fontWeight: 700, color: '#343A40' },
  sub: { fontSize: 12, color: '#6C757D' },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  filterLabel: { display: 'flex', flexDirection: 'column', gap: 3 },
  filterCap: { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6C757D', fontWeight: 700 },
  select: { font: 'inherit', fontSize: 13, padding: '6px 10px', border: '1px solid #CED4DA', borderRadius: 8, background: '#fff', color: '#343A40', minWidth: 160 },
  pill: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: '#e8f3e9', color: '#2E7D32' },
  dot: { width: 6, height: 6, borderRadius: 999, background: '#2E7D32', boxShadow: '0 0 0 3px rgba(46,125,50,0.2)', display: 'inline-block' },
}
