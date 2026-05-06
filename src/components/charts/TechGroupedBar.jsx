import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'

const SERIES = [
  { key: 'ci',     label: 'Cap. instalada', color: '#004e68' },
  { key: 'pen',    label: 'PEN',            color: '#4F81BD' },
  { key: 'margen', label: 'Margen',         color: '#E46C0A' },
]

export default function TechGroupedBar({ data }) {
  const svgRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)

  const filtered = data.filter(d => d.pen !== null)

  useEffect(() => {
    if (!filtered.length || !svgRef.current) return
    const el = svgRef.current
    const W = el.clientWidth || 700
    const pad = { l: 44, r: 16, t: 20, b: 68 }
    const H = 280

    d3.select(el).selectAll('*').remove()
    const svg = d3.select(el).attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const x0 = d3.scaleBand().domain(filtered.map(d => d.tecnologia)).range([pad.l, W - pad.r]).paddingInner(0.22)
    const x1 = d3.scaleBand().domain(SERIES.map(s => s.key)).range([0, x0.bandwidth()]).padding(0.08)
    const yMax = d3.max(filtered, d => Math.max(d.ci || 0, d.pen || 0))
    const y = d3.scaleLinear().domain([0, yMax]).range([H - pad.b, pad.t]).nice()

    const gridTicks = y.ticks(5)
    svg.selectAll('.grid')
      .data(gridTicks)
      .join('line')
      .attr('class', 'grid')
      .attr('x1', pad.l).attr('x2', W - pad.r)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', '#EEF1F4')

    svg.selectAll('.tick-label')
      .data(gridTicks)
      .join('text')
      .attr('class', 'tick-label')
      .attr('x', pad.l - 6)
      .attr('y', d => y(d) + 3)
      .attr('text-anchor', 'end')
      .attr('font-size', 10)
      .attr('fill', '#6C757D')
      .attr('font-family', 'Inter, sans-serif')
      .text(d => d3.format(',')(d))

    const groups = svg.selectAll('.group')
      .data(filtered)
      .join('g')
      .attr('class', 'group')
      .attr('transform', d => `translate(${x0(d.tecnologia)},0)`)

    SERIES.forEach(({ key, color }) => {
      groups.append('rect')
        .attr('x', x1(key))
        .attr('y', d => d[key] !== null ? y(d[key]) : H - pad.b)
        .attr('width', x1.bandwidth())
        .attr('height', d => d[key] !== null ? (H - pad.b) - y(d[key]) : 0)
        .attr('rx', 3)
        .attr('fill', color)
        .style('cursor', 'pointer')
        .on('mouseenter', (event, d) => setTooltip({ x: event.offsetX, y: event.offsetY, d, key }))
        .on('mousemove', (event, d) => setTooltip({ x: event.offsetX, y: event.offsetY, d, key }))
        .on('mouseleave', () => setTooltip(null))
    })

    svg.selectAll('.x-label')
      .data(filtered)
      .join('text')
      .attr('class', 'x-label')
      .attr('x', d => x0(d.tecnologia) + x0.bandwidth() / 2)
      .attr('y', H - pad.b + 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', '#495057')
      .attr('font-family', 'Inter, sans-serif')
      .each(function(d) {
        const words = d.tecnologia.split(' ')
        const el = d3.select(this)
        if (words.length > 1) {
          el.append('tspan').attr('x', x0(d.tecnologia) + x0.bandwidth() / 2).attr('dy', 0).text(words.slice(0, 2).join(' '))
          if (words.length > 2) el.append('tspan').attr('x', x0(d.tecnologia) + x0.bandwidth() / 2).attr('dy', 12).text(words.slice(2).join(' '))
        } else {
          el.text(d.tecnologia)
        }
      })
  }, [filtered])

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
          <strong>{tooltip.d.tecnologia}</strong><br />
          {SERIES.find(s => s.key === tooltip.key)?.label}: {d3.format(',')(Math.round(tooltip.d[tooltip.key] ?? 0))} MW
        </div>
      )}
    </div>
  )
}

export { SERIES as TECH_SERIES }
