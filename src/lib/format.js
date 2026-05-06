const intFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const decFmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export const fmtMW = (v) => v === null ? '—' : `${intFmt.format(v)} MW`
export const fmtNumber = (v, decimals = 0) =>
  v === null ? '—' : decimals > 0 ? decFmt.format(v) : intFmt.format(v)
export const fmtPct = (v) => v === null ? '—' : `${(v * 100).toFixed(1)}%`
export const fmtPctRaw = (v) => v === null ? '—' : `${v.toFixed(1)}%`
