import { useState, useMemo } from 'react'
import Icon from '../components/Icon'
import { fmtNumber } from '../lib/format'

const PAGE_SIZE = 50

const th = { background: '#e6eef2', color: '#004e68', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #cfdde4' }
const td = { padding: '11px 14px', fontSize: 13, color: '#495057', borderBottom: '1px solid #EEF1F4' }

export default function CentralesView({ parque }) {
  const [search, setSearch] = useState('')
  const [filterTech, setFilterTech] = useState('all')
  const [page, setPage] = useState(0)

  const techs = useMemo(() => [...new Set(parque.map(d => d.tecnologia).filter(Boolean))].sort(), [parque])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return parque.filter(d => {
      const matchSearch = !q || d.central?.toLowerCase().includes(q) || d.agente?.toLowerCase().includes(q)
      const matchTech = filterTech === 'all' || d.tecnologia === filterTech
      return matchSearch && matchTech
    })
  }, [parque, search, filterTech])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleSearch = (v) => { setSearch(v); setPage(0) }
  const handleTech = (v) => { setFilterTech(v); setPage(0) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 style={s.h1}>Centrales del parque generador</h1>
        <p style={s.sub}>Listado completo de unidades generadoras registradas en el SENI · Mayo 2026</p>
      </div>

      <div style={s.controls}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}><Icon name="search" size={15} /></span>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Buscar central o agente…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <label style={s.filterLabel}>
          <span style={s.filterCap}>Tecnología</span>
          <select style={s.select} value={filterTech} onChange={e => handleTech(e.target.value)}>
            <option value="all">Todas</option>
            {techs.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <span style={s.count}>{filtered.length} centrales</span>
      </div>

      <div style={s.tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Central / Unidad</th>
              <th style={th}>Agente generador</th>
              <th style={th}>Tecnología</th>
              <th style={th}>Fuente primaria</th>
              <th style={{ ...th, textAlign: 'right' }}>CI (MW)</th>
              <th style={{ ...th, textAlign: 'right' }}>PEN (MW)</th>
              <th style={{ ...th, textAlign: 'right' }}>Margen (MW)</th>
              <th style={th}>Entrada comercial</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.central}-${i}`} style={{ background: i % 2 ? '#F8F9FA' : '#fff' }}>
                <td style={{ ...td, fontWeight: 600, color: '#343A40' }}>{r.central}</td>
                <td style={td}>{r.agente ?? '—'}</td>
                <td style={td}>
                  {r.tecnologia ? (
                    <span style={s.techPill}>{r.tecnologia}</span>
                  ) : '—'}
                </td>
                <td style={td}>{r.fuente ?? '—'}</td>
                <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#004e68' }}>
                  {r.ci !== null ? fmtNumber(r.ci, r.ci < 10 ? 3 : 1) : '—'}
                </td>
                <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {r.pen !== null ? fmtNumber(r.pen, r.pen < 10 ? 3 : 1) : '—'}
                </td>
                <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: r.margen !== null && r.margen < 0 ? '#FF0000' : '#495057' }}>
                  {r.margen !== null ? fmtNumber(r.margen, r.margen < 10 ? 3 : 1) : '—'}
                </td>
                <td style={td}>
                  {r.fechaEntrada === 'Pendiente' ? (
                    <span style={{ ...s.statusPill, background: '#fff7d1', color: '#7a5b00' }}>Pendiente</span>
                  ) : r.fechaEntrada === 'Sin registros' ? (
                    <span style={{ color: '#ADB5BD', fontSize: 12 }}>Sin registro</span>
                  ) : (
                    <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.fechaEntrada}</span>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ ...td, textAlign: 'center', color: '#ADB5BD', padding: '32px 14px' }}>
                  Sin resultados para la búsqueda actual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={s.pagination}>
          <button style={s.pageBtn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            <Icon name="chevron-left" size={15} />
          </button>
          <span style={s.pageInfo}>Página {page + 1} de {totalPages}</span>
          <button style={s.pageBtn} disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
            <Icon name="chevron-right" size={15} />
          </button>
        </div>
      )}
    </div>
  )
}

const s = {
  h1: { margin: '0 0 4px', fontSize: 22, fontWeight: 600, color: '#343A40', letterSpacing: '-0.01em' },
  sub: { margin: 0, fontSize: 13, color: '#6C757D' },
  controls: { display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' },
  searchWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 10, color: '#6C757D', display: 'flex' },
  searchInput: { font: 'inherit', fontSize: 13, padding: '8px 12px 8px 32px', border: '1px solid #CED4DA', borderRadius: 8, background: '#fff', color: '#343A40', minWidth: 240, outline: 'none' },
  filterLabel: { display: 'flex', flexDirection: 'column', gap: 3 },
  filterCap: { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6C757D', fontWeight: 700 },
  select: { font: 'inherit', fontSize: 13, padding: '8px 12px', border: '1px solid #CED4DA', borderRadius: 8, background: '#fff', color: '#343A40', minWidth: 180 },
  count: { fontSize: 13, color: '#6C757D', fontWeight: 500, paddingBottom: 8 },
  tableWrap: { background: '#fff', border: '1px solid #EEF1F4', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,35,50,0.06)' },
  techPill: { fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#e6eef2', color: '#004e68', fontWeight: 600, display: 'inline-block' },
  statusPill: { fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600, display: 'inline-block' },
  pagination: { display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' },
  pageBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, border: '1px solid #CED4DA', borderRadius: 8, background: '#fff', color: '#495057', cursor: 'pointer', font: 'inherit' },
  pageInfo: { fontSize: 13, color: '#6C757D' },
}
