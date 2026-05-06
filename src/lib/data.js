import parqueRaw from '../db/Parque Generador SENI.json'
import resumenRaw from '../db/Resumen por Tecnología.json'
import hidrosRaw from '../db/EGEHID — Hidros.json'
import notasRaw from '../db/Notas Metodológicas.json'

const toNum = (v) => {
  if (v === null || v === undefined || v === '—') return null
  const n = parseFloat(String(v).replace(/,/g, ''))
  return isNaN(n) ? null : n
}

export function loadParqueGenerador() {
  return parqueRaw
    .filter(r => r['CENTRAL \/ UNIDAD'] !== 'TOTAL PARQUE GENERADOR' && r['CENTRAL \/ UNIDAD'] !== null)
    .map(r => ({
      central: r['CENTRAL \/ UNIDAD'],
      agente: r['AGENTE GENERADOR'],
      fechaEntrada: r['FECHA ENTRADA EN\nOP. COMERCIAL'],
      ci: toNum(r['CAP. INSTALADA\n(MW)']),
      pen: toNum(r['POT. EFECTIVA NETA\n(MW)']),
      margen: toNum(r['MARGEN DE\nREGULACIÓN (MW)']),
      tecnologia: r['TECNOLOGÍA'],
      fuente: r['FUENTE PRIMARIA\nDE ENERGÍA'],
    }))
}

export function loadResumen() {
  return resumenRaw
    .filter(r => r['TECNOLOGÍA'] !== 'TOTAL SENI' && r['TECNOLOGÍA'] !== null)
    .map(r => ({
      tecnologia: r['TECNOLOGÍA'],
      nCentrales: toNum(r['N° CENTRALES']),
      ci: toNum(r['CAP. INSTALADA TOTAL (MW)']),
      pen: toNum(r['PEN TOTAL (MW)']),
      margen: toNum(r['MARGEN TOTAL (MW)']),
      pctCI: toNum(r['% DE CAP. INSTALADA']),
      potFirme: toNum(r['POT. FIRME TOTAL\n(MW) — HIDROS']),
    }))
}

export function loadHidros() {
  return hidrosRaw
    .filter(r => r['CÓDIGO DE UNIDAD'] !== null)
    .map(r => ({
      nombre: r['NOMBRE DE UNIDAD'],
      codigo: r['CÓDIGO DE UNIDAD'],
      subtipo: r['SUBTIPO\nHIDRO'],
      pen: toNum(r['POT. EFECT. NETA\n(MW)']),
      potMedia: toNum(r['POTENCIA MEDIA\n(MW)']),
      potFirme: toNum(r['POTENCIA FIRME\nFINAL (MW)']),
    }))
}

export function loadNotas() {
  return notasRaw.map(r => ({
    termino: r['Tabla Unificada del Parque Generador SENI'],
    definicion: r['Unnamed: 1'],
  }))
}
