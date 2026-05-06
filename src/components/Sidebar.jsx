import Icon from './Icon'

const NAV = [
  { id: 'overview',    label: 'Resumen ejecutivo', icon: 'grid' },
  { id: 'tecnologias', label: 'Tecnologías',        icon: 'activity' },
  { id: 'centrales',   label: 'Centrales',          icon: 'zap' },
  { id: 'hidros',      label: 'Hidroeléctricas',    icon: 'droplets' },
]

export default function Sidebar({ active, onChange }) {
  return (
    <aside style={s.aside}>
      <div style={s.brand}>
        <img src="/mark.svg" width="36" height="36" alt="" />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={s.brandTitle}>Panel SENI</span>
          <span style={s.brandSub}>Viceministerio de Energía</span>
        </div>
      </div>

      <div style={s.section}>PARQUE GENERADOR</div>
      <nav style={s.nav}>
        {NAV.map(item => {
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              style={{ ...s.item, ...(isActive ? s.itemActive : {}) }}
            >
              <span style={s.itemIcon}><Icon name={item.icon} /></span>
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div style={s.foot}>
        <div style={s.footMeta}>Sistema en línea</div>
        <div style={s.footStamp}>Mayo 2026 · MEM-RD</div>
      </div>
    </aside>
  )
}

const s = {
  aside: { width: 248, background: '#fff', borderRight: '1px solid #EEF1F4', display: 'flex', flexDirection: 'column', padding: '16px 12px', flexShrink: 0, minHeight: '100vh' },
  brand: { display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 16px', borderBottom: '1px solid #EEF1F4' },
  brandTitle: { fontSize: 14, fontWeight: 700, color: '#004e68' },
  brandSub: { fontSize: 11, color: '#6C757D', fontWeight: 500 },
  section: { fontSize: 11, fontWeight: 700, color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '16px 12px 8px' },
  nav: { display: 'flex', flexDirection: 'column', gap: 2 },
  item: { display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', padding: '9px 12px', borderRadius: 10, cursor: 'pointer', font: 'inherit', fontSize: 13, fontWeight: 500, color: '#495057', textAlign: 'left', transition: 'background 180ms cubic-bezier(0.2,0.6,0.2,1)' },
  itemActive: { background: '#e6eef2', color: '#004e68', fontWeight: 600 },
  itemIcon: { display: 'inline-flex', width: 18, height: 18, color: 'inherit' },
  foot: { marginTop: 'auto', padding: '12px', borderTop: '1px solid #EEF1F4', display: 'flex', flexDirection: 'column', gap: 2 },
  footMeta: { fontSize: 12, color: '#2E7D32', fontWeight: 600 },
  footStamp: { fontSize: 11, color: '#6C757D', fontFamily: 'monospace' },
}
