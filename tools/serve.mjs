import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.md':'text/plain','.json':'application/json'};
const allowed=/^\/(?:index\.html|README\.md|styles\.css|service\.css|app\.js|service\.js|fixtures\.js|visuals\.js|lucide\.min\.js|workloads\/(iot|gaming|social)\.js)$/;
http.createServer((req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}
 if(name==='/')name='/index.html';
 if(!allowed.test(name)){res.writeHead(404);return res.end();}
 try{const data=fs.readFileSync(path.join(root,name));res.writeHead(200,{'Content-Type':types[path.extname(name)]+'; charset=utf-8','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(404);res.end();}
}).listen(8796,'127.0.0.1',()=>console.log('OCI NoSQL showcase: http://127.0.0.1:8796/'));
