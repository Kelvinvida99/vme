import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'

const TECH_COLORS = {
  'Ciclo Combinado':          '#004e68',
  'Hidroeléctrica':           '#4F81BD',
  'Solar':                    '#FFCC00',
  'Eólica':                   '#E46C0A',
  'Motor combustión interna': '#495057',
  'Turbina a Vapor':          '#6C757D',
  'Turbina a Gas':            '#ADB5BD',
}

export default function TopCentralesBar({ data, n = 10 }) {
  const wrapRef = useRef(null)
  const svgRef  = useRef(null)
  const [tooltip, setTooltip] = useState(null)

  const top = [...data]
    .filter(d => d.ci !== null)
    .sort((a, b) => b.ci - a.ci)
    .slice(0, n)

  useEffect(() => {
    const draw = () => {
      if (!top.length || !svgRef.current || !wrapRef.current) return
      const W = wrapRef.current.clientWidth || 500
      const pad = { l: 160, r: 56, t: 10, b: 10 }
      const H = top.length * 32 + pad.t + pad.b
      const el = svgRef.current

      d3.select(el).selectAll('*').remove()
      const svg = d3.select(el).attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

      const xMax = d3.max(top, d => d.ci)
      const x = d3.scaleLinear().domain([0, xMax]).range([pad.l, W - pad.r]).nice()
      const y = d3.scaleBand().domain(top.map(d => d.central)).range([pad.t, H - pad.b]).padding(0.25)

      svg.selectAll('.bar')
        .data(top)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', pad.l)
        .attr('y', d => y(d.central))
        .attr('width', d => x(d.ci) - pad.l)
        .attr('height', y.bandwidth())
        .attr('rx', 4)
        .attr('fill', d => TECH_COLORS[d.tecnologia] || '#ADB5BD')
        .style('cursor', 'pointer')
        .on('mouseenter', (event, d) => setTooltip({ x: event.offsetX, y: event.offsetY, d }))
        .on('mousemove',  (event, d) => setTooltip({ x: event.offsetX, y: event.offsetY, d }))
        .on('mouseleave', () => setTooltip(null))

      svg.selectAll('.label-name')
        .data(top)
        .join('text')
        .attr('class', 'label-name')
        .attr('x', pad.l - 8)
        .attr('y', d => y(d.central) + y.bandwidth() / 2 + 4)
        .attr('text-anchor', 'end')
        .attr('font-size', 11)
        .attr('font-family', 'Inter, sans-serif')
        .attr('fill', '#495057')
        .text(d => d.central.length > 18 ? d.central.slice(0, 17) + '…' : d.central)

      svg.selectAll('.label-val')
        .data(top)
        .join('text')
        .attr('class', 'label-val')
        .attr('x', d => x(d.ci) + 6)
        .attr('y', d => y(d.central) + y.bandwidth() / 2 + 4)
        .attr('font-size', 11)
        .attr('font-weight', 700)
        .attr('font-family', 'Inter, sans-serif')
        .attr('fill', '#004e68')
        .text(d => d3.format(',')(Math.round(d.ci)))
    }

    draw()
    const ro = new ResizeObserver(draw)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [top])

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      {tooltip && (
        <div style={{
          position: 'absolute', left: tooltip.x + 12, top: tooltip.y - 8,
          background: '#fff', border: '1px solid #EEF1F4', borderRadius: 8,
          padding: '6px 10px', fontSize: 12, color: '#343A40',
          pointerEvents: 'none', boxShadow: '0 4px 12px rgba(15,35,50,0.08)', zIndex: 10, whiteSpace: 'nowrap',
        }}>
          <strong>{tooltip.d.central}</strong><br />
          {tooltip.d.agente}<br />
          CI: {d3.format(',')(Math.round(tooltip.d.ci))} MW · {tooltip.d.tecnologia}
        </div>
      )}
    </div>
  )
}
