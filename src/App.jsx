import { useState, useMemo, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import OverviewView from './views/OverviewView'
import TecnologiasView from './views/TecnologiasView'
import CentralesView from './views/CentralesView'
import HidrosView from './views/HidrosView'
import { loadParqueGenerador, loadResumen, loadHidros } from './lib/data'
import { fetchCapacidadInstalada } from './lib/api'

const parque  = loadParqueGenerador()
const resumen = loadResumen()
const hidros  = loadHidros()

const hidroParque = parque.filter(d =>
  typeof d.tecnologia === 'string' && d.tecnologia.toLowerCase().includes('hidro')
)

const techs = [...new Set(parque.map(d => d.tecnologia).filter(Boolean))].sort()

export default function App() {
  const [active, setActive] = useState('overview')
  const [filterTech, setFilterTech] = useState('all')
  const [ciApi, setCiApi] = useState({ loading: true, data: [], error: null })

  useEffect(() => {
    fetchCapacidadInstalada()
      .then(data => setCiApi({ loading: false, data, error: null }))
      .catch(err  => setCiApi({ loading: false, data: [], error: err.message }))
  }, [])

  const showTechFilter = active === 'overview' || active === 'centrales'

  const filteredParque = useMemo(() => (
    filterTech === 'all' ? parque : parque.filter(d => d.tecnologia === filterTech)
  ), [filterTech])

  const filteredResumen = useMemo(() => (
    filterTech === 'all' ? resumen : resumen.filter(d => d.tecnologia === filterTech)
  ), [filterTech])

  const view = (() => {
    switch (active) {
      case 'overview':    return <OverviewView parque={filteredParque} resumen={filteredResumen} ciApi={ciApi} />
      case 'tecnologias': return <TecnologiasView resumen={resumen} />
      case 'centrales':   return <CentralesView parque={filteredParque} />
      case 'hidros':      return <HidrosView hidros={hidros} hidroParque={hidroParque} />
      default:            return null
    }
  })()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      <Sidebar active={active} onChange={(id) => { setActive(id); setFilterTech('all') }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          filterTech={filterTech}
          onFilterTech={setFilterTech}
          techOptions={showTechFilter ? techs : []}
        />
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          {view}
        </div>
      </div>
    </div>
  )
}
