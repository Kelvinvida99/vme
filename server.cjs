/**
 * Servidor de producción — Panel SENI
 * Sirve el build estático (dist/) y actúa como proxy para la API del OC
 * en /wsoc/ → https://apps.oc.org.do/wsoc/ (evita CORS)
 *
 * Uso: node server.cjs
 *      PORT=8080 node server.cjs
 */
const http  = require('http')
const https = require('https')
const fs    = require('fs')
const path  = require('path')

const PORT = parseInt(process.env.PORT || '3000', 10)
const DIST  = path.join(__dirname, 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
}

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://localhost:${PORT}`)

  // ── Proxy: /wsoc/ → https://apps.oc.org.do/wsoc/ ──────────────────────────
  if (urlObj.pathname.startsWith('/wsoc/')) {
    const opts = {
      hostname: 'apps.oc.org.do',
      path:     urlObj.pathname + urlObj.search,
      method:   req.method,
      headers:  { host: 'apps.oc.org.do', accept: 'application/json' },
    }
    const proxy = https.request(opts, (upstream) => {
      res.writeHead(upstream.statusCode, {
        'content-type':                'application/json',
        'access-control-allow-origin': '*',
      })
      upstream.pipe(res)
    })
    proxy.on('error', (err) => {
      console.error('[proxy error]', err.message)
      res.writeHead(502)
      res.end(JSON.stringify({ error: err.message }))
    })
    req.pipe(proxy)
    return
  }

  // ── Archivos estáticos desde dist/ ─────────────────────────────────────────
  let filePath = path.join(DIST, urlObj.pathname === '/' ? 'index.html' : urlObj.pathname)

  // Si no existe o es directorio → SPA fallback → index.html
  try {
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST, 'index.html')
    }
  } catch {
    filePath = path.join(DIST, 'index.html')
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    const ext  = path.extname(filePath)
    const mime = MIME[ext] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': mime })
    res.end(data)
  })
})

server.listen(PORT, () => {
  console.log(`\n✓ Panel SENI corriendo en http://localhost:${PORT}`)
  console.log(`  Proxy activo: /wsoc/ → https://apps.oc.org.do/wsoc/\n`)
})
