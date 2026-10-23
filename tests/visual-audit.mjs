import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]||'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),artifacts=path.join(root,'artifacts');
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({reducedMotion:'reduce'});
const site=pathToFileURL(path.join(root,'index.html')).href,starter=pathToFileURL(path.resolve(root,'../../CoreBlueprint/starter/index.html')).href;
const records=[];
try{
 for(const width of [1280,900,390]){
  await page.setViewportSize({width,height:width===390?844:900});
  const pair={width};
  for(const [label,base] of [['starter',starter],['output',site]]){
   await page.goto(base+'#overview');
   pair[label]=await page.evaluate(()=>Object.fromEntries(['.sidebar','.topbar','main','.hero','.panel','.icon-tile','.nav-separator'].map(sel=>{const el=document.querySelector(sel),r=el.getBoundingClientRect(),s=getComputedStyle(el);return [sel,{x:r.x,width:r.width,padding:s.padding,borderRadius:s.borderRadius,fontFamily:s.fontFamily}]})));
   await page.screenshot({style:'.skip:not(:focus){visibility:hidden}',path:path.join(artifacts,`${label}-${width}-overview-viewport.png`)});
  }
  for(const selector of Object.keys(pair.starter))assert.deepEqual(pair.output[selector],pair.starter[selector],`${width} ${selector} shell geometry/style`);
  records.push(pair);
  await page.goto(site+'#availability');await page.screenshot({style:'.skip:not(:focus){visibility:hidden}',path:path.join(artifacts,`${width}-availability-regional-initial.png`),fullPage:true});
  await page.locator('#scenario-global').click();await page.locator('[data-visual]').screenshot({style:'.skip:not(:focus){visibility:hidden}',path:path.join(artifacts,`${width}-global-diagram-initial.png`)});
  await page.locator('[data-next]').click();await page.locator('[data-visual]').screenshot({style:'.skip:not(:focus){visibility:hidden}',path:path.join(artifacts,`${width}-global-diagram-pending.png`)});
  await page.locator('[data-next]').click();await page.locator('[data-visual]').screenshot({style:'.skip:not(:focus){visibility:hidden}',path:path.join(artifacts,`${width}-global-diagram-final.png`)});
  const upright=await page.locator('.flow-connector small').evaluateAll(es=>es.every(el=>getComputedStyle(el).transform==='none'));assert.ok(upright,'Connector text upright');
  await page.goto(site+'#security');await page.locator('.layers').screenshot({style:'.skip:not(:focus){visibility:hidden}',path:path.join(artifacts,`${width}-security-layers.png`)});
 }
 await page.setViewportSize({width:390,height:844});await page.goto(site+'#overview');await page.screenshot({path:path.join(artifacts,'390-drawer-closed-viewport.png')});await page.locator('#menu-button').click();await page.screenshot({path:path.join(artifacts,'390-drawer-open-viewport.png')});await page.evaluate(()=>{const a=document.querySelector('nav a[aria-current]');a.href=location.hash;});await page.locator('nav a[aria-current]').click();await page.waitForFunction(()=>document.activeElement===document.querySelector('main'));assert.ok(await page.locator('#sidebar').evaluate(el=>el.inert),'Exact current-route click closes drawer');
 // Font identity comes from Chrome, not from the CSS fallback list.
 const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const dom=await cdp.send('DOM.getDocument');const node=await cdp.send('DOM.querySelector',{nodeId:dom.root.nodeId,selector:'.hero h2'});const fonts=await cdp.send('CSS.getPlatformFontsForNode',{nodeId:node.nodeId});
 fs.writeFileSync(path.join(artifacts,'visual-audit.json'),JSON.stringify({date:'2026-10-12',browser:browser.version(),fonts:fonts.fonts,records,geometry:'Pass',uprightLabels:'Pass',exactSameRoute:'Pass'},null,2));
 console.log('Shared geometry/style matched the current starter at all three widths; upright labels and exact-route dismissal passed.');
}finally{await browser.close();}
