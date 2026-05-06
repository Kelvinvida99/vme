const USUARIO = import.meta.env.VITE_OC_USER ?? ''
const CLAVE   = import.meta.env.VITE_OC_CLAVE ?? ''
const ANO_DEFAULT = import.meta.env.VITE_OC_ANO ?? new Date().getFullYear()

export async function fetchCapacidadInstalada(ano = ANO_DEFAULT) {
  const params = new URLSearchParams({ Ano: ano, Usuario: USUARIO, Clave: CLAVE })
  const res = await fetch(`/wsoc/serviceextended.asmx/GetCapacidadInstaladaFuenteJSon?${params}`)
  if (!res.ok) throw new Error(`OC API ${res.status}`)
  const json = await res.json()
  return json.GetCapacidadInstaladaFuente ?? []
}
