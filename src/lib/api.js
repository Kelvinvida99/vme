import raw from '../db/CapacidadInstaladaFuente.json'

export function fetchCapacidadInstalada() {
  return Promise.resolve(
    (raw.GetCapacidadInstaladaFuente ?? []).filter(d => d.VALOR > 0)
  )
}
