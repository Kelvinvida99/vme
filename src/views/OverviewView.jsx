import KpiCard from '../components/KpiCard'
import ChartCard from '../components/ChartCard'
import TechDonut, { TECH_COLORS } from '../components/charts/TechDonut'
import TopCentralesBar from '../components/charts/TopCentralesBar'
import TechGroupedBar, { TECH_SERIES } from '../components/charts/TechGroupedBar'
import CIFuenteBar, { FUENTE_COLORS } from '../components/charts/CIFuenteBar'
import { fmtNumber, fmtPct } from '../lib/format'

export default function OverviewView({ parque, resumen, ciApi }) {
  const totalCI = resumen.reduce((s, d) => s + (d.ci || 0), 0)
  const totalPEN = parque.reduce((s, d) => s + (d.pen || 0), 0)
  const totalMargen = resumen.reduce((s, d) => s + (d.margen || 0), 0)
  const totalCentrales = parque.length
  const erncCI = resumen.filter(d => d.tecnologia === 'Solar' || d.tecnologia === 'Eólica').reduce((s, d) => s + (d.ci || 0), 0)
  const pctERNC = erncCI / totalCI

  const kpis = [
    { label: 'Capacidad instalada total',   value: fmtNumber(totalCI, 0),    unit: 'MW',    sub: 'SENI completo' },
    { label: 'Potencia efectiva neta',       value: fmtNumber(totalPEN, 0),   unit: 'MW',    sub: `PEN declarada al OC-SENI` },
    { label: 'Centrales en el parque',       value: fmtNumber(totalCentrales), unit: '',     sub: 'Unidades registradas' },
    { label: 'Margen de regulación',         value: fmtNumber(totalMargen, 0), unit: 'MW',  sub: 'CI − PEN' },
    { label: 'Participación ERNC',           value: fmtPct(pctERNC),           unit: '',    sub: 'Solar + Eólica / total CI' },
  ]

  const ciLoading = ciApi.loading
  const ciError   = ciApi.error
  const ciData    = ciApi.data ?? []
  const ciActualizado = ciData[0]?.ACTUALIZADO
    ? new Date(ciData[0].ACTUALIZADO).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={s.pageTitle}>
        <div>
          <h1 style={s.h1}>Resumen ejecutivo del SENI</h1>
          <div style={s.crumbs}>Parque generador · <strong style={{ color: '#004e68' }}>Resumen</strong> · Mayo 2026</div>
        </div>
        <span style={s.pillLive}>
          <span style={s.pillDot} />
          DATOS CONSOLIDADOS · MAYO 2026
        </span>
      </div>

      <div style={s.rowKpis}>
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div style={s.rowCharts}>
        <ChartCard
          title="Mix de capacidad instalada por tecnología"
          sub={`MW · total ${fmtNumber(totalCI, 0)} MW`}
          legend={resumen.map(d => ({ label: d.tecnologia, color: TECH_COLORS[d.tecnologia] || '#ADB5BD' }))}
        >
          <TechDonut data={resumen} />
        </ChartCard>

        <ChartCard
          title="Top 10 centrales por capacidad instalada"
          sub="MW · clasificadas de mayor a menor"
        >
          <TopCentralesBar data={parque} n={10} />
        </ChartCard>
      </div>

      <ChartCard
        title="Capacidad instalada vs PEN vs margen por tecnología"
        sub="MW · tecnologías con PEN registrada"
        legend={TECH_SERIES.map(s => ({ label: s.label, color: s.color }))}
      >
        <TechGroupedBar data={resumen} />
      </ChartCard>

      <ChartCard
        title="Capacidad instalada por fuente primaria · OC-SENI"
        sub={ciActualizado ? `MW · actualizado ${ciActualizado} · Fuente: OC apps.oc.org.do` : 'MW · Fuente: Organismo Coordinador SENI'}
        legend={ciData.map(d => ({ label: d.FUENTE, color: FUENTE_COLORS[d.FUENTE] || '#CED4DA' }))}
      >
        {ciLoading && <div style={s.apiState}>Cargando datos del OC…</div>}
        {ciError   && <div style={{ ...s.apiState, color: '#DC3545' }}>Error al cargar datos del OC: {ciError}</div>}
        {!ciLoading && !ciError && ciData.length === 0 && (
          <div style={s.apiState}>Sin datos disponibles. Verifique las credenciales en el archivo <code>.env</code>.</div>
        )}
        {!ciLoading && !ciError && ciData.length > 0 && <CIFuenteBar data={ciData} />}
      </ChartCard>
    </div>
  )
}

const s = {
  pageTitle: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  h1: { margin: '0 0 4px', fontSize: 22, fontWeight: 600, color: '#343A40', letterSpacing: '-0.01em' },
  crumbs: { fontSize: 12, color: '#6C757D' },
  pillLive: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: '#e8f3e9', color: '#2E7D32', whiteSpace: 'nowrap' },
  pillDot: { width: 6, height: 6, borderRadius: 999, background: '#2E7D32', boxShadow: '0 0 0 3px rgba(46,125,50,0.2)', display: 'inline-block' },
  rowKpis: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 },
  rowCharts: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  apiState: { padding: '32px 0', textAlign: 'center', fontSize: 13, color: '#6C757D' },
}
