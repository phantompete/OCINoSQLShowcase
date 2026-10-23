// Optional developer validation: pass the path to an installed Playwright package.
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.argv[2]||'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const artifacts=path.join(root,'artifacts');fs.mkdirSync(artifacts,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],requests=[],checks=[],scenarios=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
const base=pathToFileURL(path.join(root,'index.html')).href;
const check=(name,value,details)=>{assert.ok(value,name);checks.push({name,status:'Pass',details});};
async function go(route){await page.goto(base+'#'+route);await page.locator('h1').waitFor();}
async function capture(name){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(artifacts,name+'.png'),fullPage:true});}
async function noOverflow(label){check(label,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
try{
 for(const width of [1280,900,390]){
  await page.setViewportSize({width,height:width===390?844:900});
  for(const route of ['overview','availability','recovery','migration','observability','security','patterns/iot','patterns/gaming','patterns/social']){
   await go(route);await noOverflow(`${width} ${route}: page width`);
   check(`${width} ${route}: sources`,await page.locator('footer a[href^="https://docs.oracle.com"]').count()>0);
   await page.locator('#help-button').click();check(`${width} ${route}: contextual help`,await page.locator('dialog').evaluate(d=>d.open));check(`${width} ${route}: help definitions`,await page.locator('dialog dt').count()>0);await page.keyboard.press('Escape');
   if(await page.locator('#scenario-panel').count()){
    const keys=await page.locator('[role=tablist][aria-label="scenario"] [role=tab]').evaluateAll(bs=>bs.map(b=>b.dataset.value));
    for(const key of keys){
     await page.locator('#scenario-'+key).click();
     check(`${width} ${route}/${key}: reduced motion`,await page.locator('[data-play]').isDisabled());
     await noOverflow(`${width} ${route}/${key}: initial width`);
     const initial=await page.locator('[data-message]').innerText();let steps=1;
     while(await page.locator('[data-next]').isEnabled()){await page.locator('[data-next]').click();steps++;assert.ok(steps<=6);await noOverflow(`${width} ${route}/${key}: step ${steps} width`);}
     check(`${width} ${route}/${key}: final narrative`,(await page.locator('[data-message]').innerText())!==initial);
     scenarios.push({width,route,key,steps,status:'Pass'});
     if(width!==900||route==='availability')await capture(`${width}-${route.replace('/','-')}-${key}-final`);
     await page.locator('[data-reset]').click();check(`${width} ${route}/${key}: reset`,await page.locator('[data-message]').innerText()===initial);
    }
   }
   if(['overview','security'].includes(route))await capture(`${width}-${route}`);
  }
 }
 await page.setViewportSize({width:1280,height:900});await go('patterns/iot');
 await page.locator('#workload-iot').focus();await page.keyboard.press('ArrowRight');await page.waitForURL('**#patterns/gaming');
 check('Workload keyboard preserves focus',await page.locator('#workload-gaming').evaluate(el=>el===document.activeElement));
 await page.locator('#scenario-local').focus();await page.keyboard.press('End');check('Scenario End selects conflict',await page.locator('#scenario-conflict').getAttribute('aria-selected')==='true');await page.keyboard.press('Home');check('Scenario Home selects local',await page.locator('#scenario-local').getAttribute('aria-selected')==='true');
 await page.locator('#workload-social').click();await page.waitForURL('**#patterns/social');await page.goBack();await page.waitForURL('**#patterns/gaming');check('Back restores workload',await page.locator('#workload-gaming').getAttribute('aria-selected')==='true');await page.goForward();await page.waitForURL('**#patterns/social');await page.reload();check('Reload restores workload',await page.locator('#workload-social').getAttribute('aria-selected')==='true');
 for(const [alias,canonical] of [['workloads','patterns/iot'],['gaming','patterns/gaming'],['patterns/nope','patterns/iot'],['toString','overview']]){await go(alias);check('Canonical '+alias,page.url().endsWith('#'+canonical));}
 await go('overview');const before=await page.evaluate(()=>history.length);await page.evaluate(()=>{location.hash='social'});await page.waitForURL('**#patterns/social');check('Alias replaces without extra history entry',await page.evaluate(()=>history.length)===before+1);
 await page.setViewportSize({width:390,height:844});await go('patterns/iot');
 check('Closed drawer inert',await page.locator('#sidebar').evaluate(el=>el.inert));await capture('390-mobile-closed');
 await page.locator('#menu-button').click();check('Drawer open/inert background',await page.locator('.workspace').evaluate(el=>el.inert));check('Drawer current-link focus',await page.locator('nav [aria-current]').evaluate(el=>el===document.activeElement));await capture('390-mobile-open');
 await page.locator('nav a').last().focus();await page.keyboard.press('Tab');check('Drawer focus wraps',await page.locator('#close-menu').evaluate(el=>el===document.activeElement));await page.keyboard.press('Shift+Tab');check('Drawer reverse focus wraps',await page.locator('nav a').last().evaluate(el=>el===document.activeElement));
 await page.keyboard.press('Escape');check('Escape restores menu focus',await page.locator('#menu-button').evaluate(el=>el===document.activeElement));
 await page.locator('#menu-button').click();await page.locator('#close-menu').click();check('Close button closes drawer',await page.locator('#sidebar').evaluate(el=>el.inert));
 await page.locator('#menu-button').click();await page.locator('#menu-backdrop').click({position:{x:370,y:400}});check('Backdrop closes drawer',await page.locator('#sidebar').evaluate(el=>el.inert));
 await page.locator('#menu-button').click();await page.locator('nav a[data-route="patterns"]').click();check('Current section navigation focuses main',await page.locator('main').evaluate(el=>el===document.activeElement));
 await page.locator('#menu-button').click();await page.locator('nav a[data-route="security"]').click();await page.waitForURL('**#security');await page.waitForFunction(()=>document.activeElement===document.querySelector('main'));check('New route focuses main',await page.locator('main').evaluate(el=>el===document.activeElement));
 await page.locator('#menu-button').click();await page.setViewportSize({width:900,height:900});await page.waitForFunction(()=>!document.querySelector('#sidebar').inert);check('Desktop resize clears inert',await page.locator('#sidebar').evaluate(el=>!el.inert));check('Desktop resize clears backdrop',await page.locator('#menu-backdrop').isHidden());await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.querySelector('#sidebar').inert);check('Return mobile starts closed',await page.locator('#sidebar').evaluate(el=>el.inert));
 await go('availability');await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('[data-play]').click();check('Play starts',await page.locator('.simulation').evaluate(el=>el.classList.contains('playing')));await page.locator('[data-play]').click();check('Pause stops',await page.locator('[data-play]').innerText()==='Play');await page.locator('[data-play]').click();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('[data-play]').disabled);check('Motion change stops playback',await page.locator('[data-play]').isDisabled());
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('[data-play]').click();await page.locator('#scenario-global').click();await page.waitForTimeout(2400);check('Scenario switch stops departed timer',await page.locator('[data-count]').innerText()==='Step 1 of 3');await page.locator('[data-play]').click();await page.evaluate(()=>location.hash='patterns/social');await page.waitForURL('**#patterns/social');await page.waitForTimeout(2400);check('Route departure stops timer',await page.locator('[data-count]').innerText()==='Step 1 of 3');
 await page.emulateMedia({reducedMotion:'reduce'});await context.setOffline(true);for(const route of ['overview','availability','recovery','migration','observability','security','patterns/iot','patterns/gaming','patterns/social']){await go(route);check('Offline '+route,await page.locator('h1').innerText()!=='');}
 check('No external runtime requests',requests.length===0,requests);check('No browser exceptions',errors.length===0,errors);
 const cdp=await context.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const dom=await cdp.send('DOM.getDocument');const textNode=await cdp.send('DOM.querySelector',{nodeId:dom.root.nodeId,selector:'.hero h2'});const actualFonts=await cdp.send('CSS.getPlatformFontsForNode',{nodeId:textNode.nodeId});const fonts=await page.evaluate(()=>({family:getComputedStyle(document.body).fontFamily,interAvailable:document.fonts.check('16px Inter')}));
 const baseline=pathToFileURL(path.resolve(root,'../../CoreBlueprint/starter/index.html')).href;
 for(const width of [1280,900,390]){await page.setViewportSize({width,height:width===390?844:900});await page.goto(baseline+'#overview');await capture(`baseline-${width}-overview`);await page.goto(baseline+'#availability');while(await page.locator('[data-next]').isEnabled())await page.locator('[data-next]').click();await capture(`baseline-${width}-scenario-final`);}
 const report={date:'2026-10-12',browser:browser.version(),font:{...fonts,actual:actualFonts.fonts},checks,scenarios,errors,externalRequests:requests};fs.writeFileSync(path.join(artifacts,'browser-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({checks:checks.length,scenarioRuns:scenarios.length,browser:report.browser,status:'Pass'}));
}catch(e){fs.writeFileSync(path.join(artifacts,'browser-failure.json'),JSON.stringify({error:e.stack,checks,scenarios,errors},null,2));await capture('failure');throw e;}finally{await browser.close();}
