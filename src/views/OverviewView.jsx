import KpiCard from '../components/KpiCard'
import ChartCard from '../components/ChartCard'
import TechDonut, { TECH_COLORS } from '../components/charts/TechDonut'
import TopCentralesBar from '../components/charts/TopCentralesBar'
import TechGroupedBar, { TECH_SERIES } from '../components/charts/TechGroupedBar'
import { fmtNumber, fmtPct } from '../lib/format'

export default function OverviewView({ parque, resumen }) {
  const totalCI = resumen.reduce((s, d) => s + (d.ci || 0), 0)
  // PEN se suma desde las filas individuales del parque porque Resumen marca
  // Solar y Eólica como '—' (no desglosadas en la hoja PEN de la fuente),
  // pero cada central sí tiene su PEN declarada individualmente.
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
}
