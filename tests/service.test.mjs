import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const files=['visuals.js','fixtures.js','service.js','sections.js','workloads/iot.js','workloads/gaming.js','workloads/social.js'];
const ctx={window:{}};vm.createContext(ctx);for(const p of files)vm.runInContext(read(p),ctx,{filename:p});
const S=ctx.window.SERVICE,all=[...Object.values(S.pages),...Object.values(S.workloads)],fixtures=all.flatMap(m=>Object.values(m.scenarios||{}));
const {original,overview}=JSON.parse(read('tests/content-baseline.json'));
const plain=value=>JSON.parse(JSON.stringify(value));
test('All non-overview page copy and help match the first iteration',()=>{
 assert.equal(Object.keys(S.pages).length,7);assert.equal(Object.keys(S.workloads).length,3);
 for(const [key,p] of Object.entries(original.pageData)){
  if(key==='overview')continue;const current=S.pages[key];
  assert.equal(current.hero,p.heroTitle);assert.equal(current.summary,p.summary);assert.equal(current.title,p.title);
  assert.deepEqual(plain(current.help),Object.fromEntries(p.help));assert.deepEqual(plain(current.sources),p.references);
 }
 for(const m of all)for(const key of m.sources)assert.match(S.sources[key][1],/^https:\/\/docs\.oracle\.com\//);
});
test('Original recovery and migration stages, statuses and runbooks survive the port',()=>{
 assert.equal(fixtures.length,11);assert.equal(new Set(fixtures.map(f=>f.id)).size,11);
 for(const [key,f] of Object.entries(original.scenarios)){
  const owner=key==='regional'||key==='export'?'recovery':'migration';const current=S.pages[owner].scenarios[key];
  assert.equal(current.title,f.title);assert.equal(current.summary,f.summary);assert.deepEqual(plain(current.stages),f.stages);
  assert.deepEqual(plain(current.runbook),f.runbook);assert.deepEqual(plain(current.steps),f.stages.map(s=>[s.title,s.text]));
  assert.equal(typeof current.renderVisual,'function');
 }
 assert.equal(S.pages.migration.scenarios.phased.stages.length,4);
});
test('Original workload stories, results and synthetic output match exactly',()=>{
 for(const [key,workload] of Object.entries(original.workloads)){
  assert.deepEqual(Object.keys(S.workloads[key].scenarios),workload.options.map(([id])=>id));
  for(const [id,label] of workload.options){const f=workload[id],current=S.workloads[key].scenarios[id];
   assert.equal(current.label,label);assert.equal(current.title,f.title);assert.equal(current.summary,f.summary);
   assert.equal(current.note,f.result);assert.deepEqual(JSON.parse(current.json.text),f.output);assert.equal(current.steps,undefined);
  }
  assert.deepEqual(plain(S.workloads[key].benefits),original.workloadMetadata[key].benefits);
  assert.deepEqual(plain(S.workloads[key].considerations),original.workloadMetadata[key].considerations);
 }
});
test('Operating loop and migration samples retain original units and prerequisites',()=>{
 assert.deepEqual(plain(ctx.window.FIRST_ITERATION.operationData),original.operationData);
 assert.deepEqual(plain(ctx.window.FIRST_ITERATION.observationSamples),original.observationSamples);
 assert.deepEqual(plain(ctx.window.FIRST_ITERATION.samples),original.samples);
 assert.match(original.samples.import,/runMigrator --config/);
 assert.equal(original.samples.records.length,2);
});
test('Corrected Overview metadata and shared footer are preserved',()=>{
 const before=overview;
 assert.deepEqual(plain(S.pages.overview),before.page);assert.deepEqual(plain(S.glance),before.glance);
 assert.deepEqual(plain(S.overviewFlow),before.flow);assert.deepEqual(plain(S.footerSources),before.footerSources);
 assert.equal(S.footerReviewDate,before.footerReviewDate);
 for(const [key,p] of Object.entries(S.overviewJourneys))for(const field of ['title','summary','icon','pillar','tone','tags'])assert.deepEqual(plain(p[field]),before.journeys[key][field]);
});
test('Direct, invalid and legacy routes remain canonical and prototype safe',()=>{
 const script=read('app.js'),scope={S,own:(o,k)=>Object.hasOwn(o,k)};vm.createContext(scope);vm.runInContext(script.slice(script.indexOf('function resolve('),script.indexOf('function render(')),scope);
 for(const hash of ['#patterns','#patterns/nope','#patterns/toString','#workloads'])assert.equal(scope.resolve(hash).workload,'iot');
 for(const key of ['iot','gaming','social']){assert.equal(scope.resolve('#'+key).workload,key);assert.equal(scope.resolve('#patterns/'+key).workload,key);}
 for(const hash of ['#toString','#__proto__','#missing'])assert.equal(scope.resolve(hash).page,'overview');
});
test('Runtime uses local assets without requests or execution controls',()=>{
 for(const match of read('index.html').matchAll(/(?:src|href)="([^"#]+)"/g)){if(match[1].startsWith('data:'))continue;assert.ok(fs.existsSync(path.join(root,match[1])),match[1]);}
 for(const file of [...files,'app.js'])assert.doesNotMatch(read(file),/\bfetch\s*\(|XMLHttpRequest|WebSocket|\beval\s*\(|new Function/);
 assert.match(read('.gitignore'),/^\*\.\[mM\]\[dD\]$/m);
 assert.match(read('.gitignore'),/^!\/README\.md$/m);
});
test('Workload rendering and initialization stay separately owned',()=>{
 for(const key of ['iot','gaming','social']){assert.equal(S.workloads[key].renderer,key);assert.equal(typeof S.renderers[key],'function');assert.equal(typeof S.initializers[key],'function');}
});
test('Hidden-document notification stops playback and cleanup removes listeners',()=>{
 const script=read('app.js'),elements=new Map(),timers=new Set(),listeners=new Map();
 const get=s=>{if(!elements.has(s))elements.set(s,{innerHTML:'',textContent:'',disabled:false});return elements.get(s);};
 const wrap={querySelector:get,classList:{add(){},remove(){}}};
 const doc={hidden:false,addEventListener:(key,fn)=>listeners.set(key,fn),removeEventListener:key=>listeners.delete(key)};
 const scope={document:doc,reduce:{matches:false,addEventListener(){},removeEventListener(){}},escape:String,icons(){},flow(){return '';},setInterval:fn=>{timers.add(fn);return fn;},clearInterval:fn=>timers.delete(fn)};
 vm.createContext(scope);vm.runInContext(script.slice(script.indexOf('function simulate('),script.indexOf('const simulation =')),scope);
 const cleanup=scope.simulate({querySelector:()=>wrap},{nodes:[],steps:[['Start','start'],['Finish','finish']]});
 get('[data-play]').onclick();assert.equal(timers.size,1);doc.hidden=true;listeners.get('visibilitychange')();assert.equal(timers.size,0);assert.equal(get('[data-play]').textContent,'Play');cleanup();assert.equal(listeners.size,0);
});
