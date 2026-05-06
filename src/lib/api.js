const USUARIO    = import.meta.env.VITE_OC_USER ?? ''
const CLAVE      = import.meta.env.VITE_OC_CLAVE ?? ''
const ANO_DEFAULT = import.meta.env.VITE_OC_ANO ?? new Date().getFullYear()

export async function fetchCapacidadInstalada(ano = ANO_DEFAULT) {
  const params = new URLSearchParams({ Ano: String(ano), Usuario: USUARIO, Clave: CLAVE })
  const res = await fetch(
    `/wsoc/serviceextended.asmx/GetCapacidadInstaladaFuenteJSon?${params}`,
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
