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

export default function TechDonut({ data }) {
  const svgRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    if (!data?.length || !svgRef.current) return
    const el = svgRef.current
    const W = el.clientWidth || 340
    const H = 260
    const R = Math.min(W, H) / 2 - 20
    const innerR = R * 0.55

    d3.select(el).selectAll('*').remove()
    const svg = d3.select(el)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .attr('width', '100%')
      .attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${W / 2},${H / 2})`)

    const pie = d3.pie().value(d => d.ci).sort(null)
    const arc = d3.arc().innerRadius(innerR).outerRadius(R)
    const arcHover = d3.arc().innerRadius(innerR).outerRadius(R + 6)

    const arcs = pie(data)
    g.selectAll('path')
      .data(arcs)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => TECH_COLORS[d.data.tecnologia] || '#CED4DA')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('transition', 'all 180ms cubic-bezier(0.2,0.6,0.2,1)')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('d', arcHover)
        setTooltip({ x: event.offsetX, y: event.offsetY, d })
      })
      .on('mousemove', (event, d) => setTooltip({ x: event.offsetX, y: event.offsetY, d }))
      .on('mouseleave', function (event, d) {
        d3.select(this).attr('d', arc)
        setTooltip(null)
      })

    const totalCI = d3.sum(data, d => d.ci)
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.3em')
      .attr('font-size', 22)
      .attr('font-weight', 700)
      .attr('fill', '#004e68')
      .attr('font-family', 'Inter, sans-serif')
      .text(d3.format(',')(Math.round(totalCI)))
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .attr('font-size', 11)
      .attr('fill', '#6C757D')
      .attr('font-family', 'Inter, sans-serif')
      .text('MW instalados')
  }, [data])

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 12,
          top: tooltip.y - 8,
          background: '#fff',
          border: '1px solid #EEF1F4',
          borderRadius: 8,
          padding: '6px 10px',
          fontSize: 12,
          color: '#343A40',
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(15,35,50,0.08)',
          zIndex: 10,
          whiteSpace: 'nowrap',
        }}>
          <strong>{tooltip.d.data.tecnologia}</strong><br />
          {d3.format(',')(Math.round(tooltip.d.data.ci))} MW · {(tooltip.d.data.pctCI * 100).toFixed(1)}%
        </div>
      )}
    </div>
  )
}

export { TECH_COLORS }
