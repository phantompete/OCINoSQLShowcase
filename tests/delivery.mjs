import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=['README.md','PROJECT_PLAN.md','GENERATION_MANIFEST.md','SECTION_INVENTORY.md','SOURCE_REVIEW.md','FIXTURE_CONTRACT.md','COVERAGE_REPORT.md','CHANGELOG.md','ITERATIVE_IMPROVEMENT.md'];
for(const file of files){if(!fs.existsSync(path.join(root,file))&&file!=='README.md')continue;const text=fs.readFileSync(path.join(root,file),'utf8');assert.ok(text.length>100,file);for(const match of text.matchAll(/\]\(([^)]+)\)/g)){const link=match[1];if(/^(https?:|#)/.test(link))continue;assert.ok(fs.existsSync(path.join(root,link.split('#')[0])),file+': '+link);}}
const readme=fs.readFileSync(path.join(root,'README.md'),'utf8');assert.doesNotMatch(readme,/blueprint|assistant|Live Lab|COVERAGE_REPORT|GENERATION_MANIFEST|PROJECT_PLAN|SOURCE_REVIEW|FIXTURE_CONTRACT|SECTION_INVENTORY|CHANGELOG|improvement-guide/i);
const ignore=fs.readFileSync(path.join(root,'.gitignore'),'utf8');assert.match(ignore,/^\*\.\[mM\]\[dD\]$/m);assert.match(ignore,/^!\/README\.md$/m);
const server=spawn(process.execPath,[path.join(root,'tools/serve.mjs')],{windowsHide:true,stdio:['ignore','pipe','pipe']});
try{
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(new Error('Preview exited '+code)));});
 for(const file of ['','index.html','README.md','app.js','service.js','fixtures.js','visuals.js','lucide.min.js','workloads/iot.js','workloads/gaming.js','workloads/social.js','styles.css','service.css']){const r=await fetch('http://127.0.0.1:8796/'+file);assert.equal(r.status,200,file);assert.ok((await r.text()).length>0);}
 for(const file of ['.env','PROJECT_PLAN.md','improvement-guide.html','artifacts/browser-results.json','../CoreBlueprint/SERVICE_BRIEF.md'])assert.equal((await fetch('http://127.0.0.1:8796/'+file)).status,404,file);
 assert.equal((await fetch('http://127.0.0.1:8796/',{method:'POST'})).status,405);
 const result={date:new Date().toISOString(),documentationLinks:'Pass (local documents checked when present)',publicReadme:'Pass',markdownIgnore:'Pass',previewRuntime:'Pass',maintenanceNotServed:'Pass',unsupportedMethods:'Pass'};
 fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});fs.writeFileSync(path.join(root,'artifacts/delivery-results.json'),JSON.stringify(result,null,2));console.log('Delivery links, README boundary, ignore policy and local preview checks passed.');
}finally{server.kill();}
