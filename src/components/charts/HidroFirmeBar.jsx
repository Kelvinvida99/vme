import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'

const SUBTIPO_COLORS = {
  'Embalse':      '#004e68',
  'Pasada':       '#4F81BD',
  'Filo de agua': '#E46C0A',
}

export default function HidroFirmeBar({ data }) {
  const wrapRef = useRef(null)
  const svgRef  = useRef(null)
  const [tooltip, setTooltip] = useState(null)

  const filtered = data.filter(d => d.ci !== null && d.ci > 0)

  useEffect(() => {
    const draw = () => {
      if (!filtered.length || !svgRef.current || !wrapRef.current) return
      const W = wrapRef.current.clientWidth || 700
      const pad = { l: 52, r: 16, t: 16, b: 80 }
      const H = 300
      const el = svgRef.current

      d3.select(el).selectAll('*').remove()
      const svg = d3.select(el).attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

      const x = d3.scaleBand().domain(filtered.map(d => d.central)).range([pad.l, W - pad.r]).padding(0.18)
      const yMax = d3.max(filtered, d => d.ci)
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
        .data(filtered)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.central))
        .attr('y', d => y(d.ci))
        .attr('width', x.bandwidth())
        .attr('height', d => (H - pad.b) - y(d.ci))
        .attr('rx', 3)
        .attr('fill', '#4F81BD')
        .style('cursor', 'pointer')
        .on('mouseenter', (event, d) => setTooltip({ x: event.offsetX, y: event.offsetY, d }))
        .on('mousemove',  (event, d) => setTooltip({ x: event.offsetX, y: event.offsetY, d }))
        .on('mouseleave', () => setTooltip(null))

      svg.selectAll('.x-label')
        .data(filtered)
        .join('text')
        .attr('transform', d => `translate(${x(d.central) + x.bandwidth() / 2},${H - pad.b + 8}) rotate(-45)`)
        .attr('text-anchor', 'end')
        .attr('font-size', 9)
        .attr('fill', '#6C757D')
        .attr('font-family', 'Inter, sans-serif')
        .text(d => d.central.length > 14 ? d.central.slice(0, 13) + '…' : d.central)
    }

    draw()
    const ro = new ResizeObserver(draw)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [filtered])

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
          Cap. instalada: {tooltip.d.ci} MW · PEN: {tooltip.d.pen ?? '—'} MW
        </div>
      )}
    </div>
  )
}

export { SUBTIPO_COLORS }
