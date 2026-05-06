import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { TECH_COLORS } from './TechDonut'

export default function TechCIBar({ data }) {
  const svgRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)

  const sorted = [...data].sort((a, b) => b.ci - a.ci)

  useEffect(() => {
    if (!sorted.length || !svgRef.current) return
    const el = svgRef.current
    const W = el.clientWidth || 620
    const pad = { l: 44, r: 60, t: 16, b: 68 }
    const H = 280

    d3.select(el).selectAll('*').remove()
    const svg = d3.select(el).attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const x = d3.scaleBand().domain(sorted.map(d => d.tecnologia)).range([pad.l, W - pad.r]).padding(0.28)
    const yMax = d3.max(sorted, d => d.ci)
    const y = d3.scaleLinear().domain([0, yMax]).range([H - pad.b, pad.t]).nice()

    y.ticks(5).forEach(t => {
      svg.append('line').attr('x1', pad.l).attr('x2', W - pad.r)
        .attr('y1', y(t)).attr('y2', y(t)).attr('stroke', '#EEF1F4')
      svg.append('text').attr('x', pad.l - 6).attr('y', y(t) + 3)
        .attr('text-anchor', 'end').attr('font-size', 10).attr('fill', '#6C757D').attr('font-family', 'Inter, sans-serif')
        .text(d3.format(',')(t))
    })

    svg.selectAll('.bar')
      .data(sorted)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.tecnologia))
      .attr('y', d => y(d.ci))
      .attr('width', x.bandwidth())
      .attr('height', d => (H - pad.b) - y(d.ci))
      .attr('rx', 4)
      .attr('fill', d => TECH_COLORS[d.tecnologia] || '#ADB5BD')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => setTooltip({ x: event.offsetX, y: event.offsetY, d }))
      .on('mousemove', (event, d) => setTooltip({ x: event.offsetX, y: event.offsetY, d }))
      .on('mouseleave', () => setTooltip(null))

    svg.selectAll('.val-label')
      .data(sorted)
      .join('text')
      .attr('x', d => x(d.tecnologia) + x.bandwidth() / 2)
      .attr('y', d => y(d.ci) - 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('font-weight', 700)
      .attr('fill', '#004e68')
      .attr('font-family', 'Inter, sans-serif')
      .text(d => d3.format(',')(Math.round(d.ci)))

    svg.selectAll('.x-label')
      .data(sorted)
      .join('text')
      .attr('transform', d => `translate(${x(d.tecnologia) + x.bandwidth() / 2},${H - pad.b + 8}) rotate(-35)`)
      .attr('text-anchor', 'end')
      .attr('font-size', 10)
      .attr('fill', '#495057')
      .attr('font-family', 'Inter, sans-serif')
      .text(d => d.tecnologia.length > 14 ? d.tecnologia.slice(0, 13) + '…' : d.tecnologia)
  }, [sorted])

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
          CI: {d3.format(',')(Math.round(tooltip.d.ci))} MW · {tooltip.d.nCentrales} centrales
        </div>
      )}
    </div>
  )
}
