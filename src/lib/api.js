const URL_CI = 'https://apps.oc.org.do/wsoc/serviceextended.asmx/GetCapacidadInstaladaFuenteJSon?Ano=2026&Usuario=MEM&Clave=M1n15t3r10'

export async function fetchCapacidadInstalada() {
  const res = await fetch(URL_CI)
  if (!res.ok) throw new Error(`OC API HTTP ${res.status}`)
  const json = await res.json()
  return json.GetCapacidadInstaladaFuente ?? []
}
