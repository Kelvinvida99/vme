const USUARIO    = "MEM"
const CLAVE      = "M1n15t3r10"
const ANO_DEFAULT = "2026"

// En dev el proxy de Vite reescribe /wsoc → https://apps.oc.org.do/wsoc
// En producción (archivos estáticos) no hay proxy, hay que usar la URL completa
const API_BASE = import.meta.env.DEV ? '' : 'https://apps.oc.org.do'

export async function fetchCapacidadInstalada(ano = ANO_DEFAULT) {
  const params = new URLSearchParams({ Ano: String(ano), Usuario: USUARIO, Clave: CLAVE })
  const res = await fetch(
    `${API_BASE}/wsoc/serviceextended.asmx/GetCapacidadInstaladaFuenteJSon?${params}`,
    { headers: { Accept: 'application/json, text/plain, */*' } },
  )
  if (!res.ok) throw new Error(`OC API HTTP ${res.status}`)
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`Respuesta no es JSON: ${text.slice(0, 120)}`)
  }
  // Las ASMX devuelven {"GetCapacidadInstaladaFuente":[...]} o {"d":[...]}
  return json.GetCapacidadInstaladaFuente ?? json.d ?? []
}
