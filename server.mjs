import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 8788);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
// Only public presentation files are served. There is no OCI API or credential loader.
const publicFile = /^(index\.html|styles\.css|nosql\.css|app\.js|content\.js|assets\/[\w.-]+|modules\/[\w.-]+\.js|fixtures\/[\w.-]+\.js)$/;
export function createShowcaseServer() {
  return createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    let path;
    try { path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\//, '') || 'index.html'; }
    catch { res.writeHead(400).end('Bad request'); return; }
    const file = resolve(root, path);
    if (!publicFile.test(path) || !file.startsWith(resolve(root) + sep)) { res.writeHead(404).end('Not found'); return; }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': `${types[extname(file)] || 'text/plain'}; charset=utf-8`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch { res.writeHead(404).end('Not found'); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createShowcaseServer().listen(port, '127.0.0.1', () => console.log(`OCI NoSQL Showcase: http://localhost:${port}`));
}
