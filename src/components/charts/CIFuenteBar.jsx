import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'

const FUENTE_COLORS = {
  'Biomasa':          '#2E7D32',
  'Eólica':           '#E46C0A',
  'Hidroeléctrica':   '#4F81BD',
  'Solar':            '#FFCC00',
  'Gas Natural':      '#004e68',
  'Fuel Oil':         '#495057',
  'Carbón':           '#6C757D',
  'Gas Licuado':      '#ADB5BD',
  'Gas Licuado (LP)': '#ADB5BD',
}

export default function CIFuenteBar({ data }) {
  const svgRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    if (!data?.length || !svgRef.current) return
    const el = svgRef.current
    const W = el.clientWidth || 700
    const pad = { l: 52, r: 16, t: 16, b: 80 }
    const H = 300

    d3.select(el).selectAll('*').remove()
    const svg = d3.select(el).attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const sorted = [...data].sort((a, b) => b.VALOR - a.VALOR)

    const x = d3.scaleBand().domain(sorted.map(d => d.FUENTE)).range([pad.l, W - pad.r]).padding(0.2)
    const yMax = d3.max(sorted, d => d.VALOR)
    const y = d3.scaleLinear().domain([0, yMax]).range([H - pad.b, pad.t]).nice()

    const gridTicks = y.ticks(5)
    svg.selectAll('.grid')
      .data(gridTicks)
      .join('line')
      .attr('x1', pad.l).attr('x2', W - pad.r)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', '#EEF1F4')

    svg.selectAll('.tick')
      .data(gridTicks)
      .join('text')
      .attr('x', pad.l - 6).attr('y', d => y(d) + 3)
      .attr('text-anchor', 'end').attr('font-size', 10)
      .attr('fill', '#6C757D').attr('font-family', 'Inter, sans-serif')
      .text(d => d3.format(',')(d))

    svg.selectAll('.bar')
      .data(sorted)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.FUENTE))
      .attr('y', d => y(d.VALOR))
      .attr('width', x.bandwidth())
      .attr('height', d => (H - pad.b) - y(d.VALOR))
      .attr('rx', 3)
      .attr('fill', d => FUENTE_COLORS[d.FUENTE] || '#CED4DA')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => setTooltip({ x: event.offsetX, y: event.offsetY, d }))
      .on('mousemove',  (event, d) => setTooltip({ x: event.offsetX, y: event.offsetY, d }))
      .on('mouseleave', () => setTooltip(null))

    svg.selectAll('.val-label')
      .data(sorted)
      .join('text')
      .attr('x', d => x(d.FUENTE) + x.bandwidth() / 2)
      .attr('y', d => y(d.VALOR) - 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', 9)
      .attr('font-weight', 600)
      .attr('fill', '#343A40')
      .attr('font-family', 'Inter, sans-serif')
      .text(d => d3.format(',')(d.VALOR))

    svg.selectAll('.x-label')
      .data(sorted)
      .join('text')
      .attr('transform', d => `translate(${x(d.FUENTE) + x.bandwidth() / 2},${H - pad.b + 8}) rotate(-40)`)
      .attr('text-anchor', 'end')
      .attr('font-size', 10)
      .attr('fill', '#6C757D')
      .attr('font-family', 'Inter, sans-serif')
      .text(d => d.FUENTE)
  }, [data])

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      {tooltip && (
        <div style={{
          position: 'absolute', left: tooltip.x + 12, top: tooltip.y - 8,
          background: '#fff', border: '1px solid #EEF1F4', borderRadius: 8,
          padding: '6px 10px', fontSize: 12, color: '#343A40',
          pointerEvents: 'none', boxShadow: '0 4px 12px rgba(15,35,50,0.08)', zIndex: 10, whiteSpace: 'nowrap',
        }}>
          <strong>{tooltip.d.FUENTE}</strong><br />
          Cap. instalada: {d3.format(',')(tooltip.d.VALOR)} MW
        </div>
      )}
    </div>
  )
}

export { FUENTE_COLORS }
