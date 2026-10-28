'use strict';
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const server=http.createServer((req,res)=>{
  const file=path.resolve(__dirname,'.'+(req.url==='/'?'/index.html':decodeURIComponent(req.url.split('?')[0])));
  if(!file.startsWith(__dirname+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,body)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'}[path.extname(file)]||'application/octet-stream'));res.end(body);});
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
  for(const width of [1440,390,320]){
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.GuidedUI);
   await page.evaluate(()=>{const s=CharacterApp.getState();s.settings.storyDate='2026-10-27';s.values.birthday.value='1990-01-01';s.settings.adultEnabled=true;Object.assign(s.values['trait.0'],{kept:true,keptValue:'A deliberately kept trait',locked:true});CharacterApp.render();});
   const before=await page.evaluate(()=>CharacterApp.getState().values),pages=await page.evaluate(()=>CharacterCanvas.pages.map(({id,label})=>({id,label})));
   for(const {id,label}of pages){
    await page.locator('#browseDetails').click();await page.locator('[data-browse-tab="'+id+'"]').click();
    assert.equal(await page.locator('.detail-page-heading h2').textContent(),label);
    assert.equal(await page.locator('#viewMenu').inputValue(),id);
    const rendered=await page.locator('#results [data-field]').evaluateAll(cards=>cards.map(card=>card.dataset.field));
    const expected=await page.evaluate(id=>CharacterApp.getFields().filter(CharacterCanvas.pages.find(p=>p.id===id).matches).filter(f=>CharacterLife.available(f,CharacterApp.getState())&&(!f.wildcard||CharacterApp.getState().settings.dialogueWildcards)).map(f=>f.id),id);
    assert.deepEqual(rendered.slice().sort(),expected.slice().sort());assert.equal(new Set(rendered).size,rendered.length);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow on '+id+' at '+width);
    assert.deepEqual(await page.evaluate(()=>CharacterApp.getState().values),before);
    await page.locator('#floatingActions summary').click();assert(await page.locator('#floatingBackToCharacter').isVisible());
    assert.equal(await page.locator('#floatingActions .roll-actions button').first().getAttribute('id'),'floatingBackToCharacter');
    await page.locator('#floatingBackToCharacter').click();assert.equal(await page.evaluate(()=>CharacterApp.getState().tab),'build');assert(!await page.locator('#floatingActions').evaluate(el=>el.open));assert(await page.locator('#floatingActions').isHidden());
   }
   // Automatic snapshots mix six modules and keep actual character facts unchanged.
   await page.locator('#browseDetails').click();await page.locator('[data-browse-tab="quick"]').click();
   const snapshot=async()=>page.locator('#results [data-field]').evaluateAll(cards=>cards.map(card=>card.dataset.field));
   const checkSnapshot=async()=>{const ids=await snapshot();assert.equal(ids.length,6);assert.equal(await page.evaluate(ids=>new Set(ids.map(id=>CharacterCanvas.pageFor(CharacterApp.getFields().find(f=>f.id===id)).id)).size,ids),6);assert.deepEqual(await page.evaluate(()=>CharacterApp.getState().values),before);return ids;};
   const first=await checkSnapshot();await page.evaluate(()=>CharacterApp.render());assert.deepEqual(await snapshot(),first);await page.locator('#quickRandomize').click();assert.notDeepEqual(await checkSnapshot(),first);
   const shuffled=await snapshot();await page.reload();await page.waitForFunction(()=>window.GuidedUI);assert.deepEqual(await snapshot(),shuffled);
   await page.screenshot({path:'/tmp/character-quick-snapshot-'+width+'.png',fullPage:false});
   await page.locator('#quickCustomize').click();for(const id of await page.locator('#sketchOptions input:checked').evaluateAll(inputs=>inputs.map(input=>input.value)))await page.locator('#sketchOptions input[value="'+id+'"]').uncheck();await page.locator('#sketchOptions input[value="birthday"]').check();await page.locator('#applySketch').click();assert.deepEqual(await snapshot(),['birthday']);
   await page.locator('#backToCharacter').click();await page.locator('#browseDetails').click();await page.locator('[data-browse-tab="quick"]').click();assert.deepEqual(await snapshot(),['birthday']);await page.locator('#quickRandomize').click();await checkSnapshot();
   // Related measurements navigate to the same character; the new tab survives reload.
   await page.evaluate(()=>CharacterApp.setView('appearance'));await page.locator('[data-detail-page="medical"]').click();assert.equal(await page.evaluate(()=>CharacterApp.getState().tab),'medical');
   await page.locator('[data-detail-page="appearance"]').click();await page.reload();await page.waitForFunction(()=>window.GuidedUI);assert.equal(await page.evaluate(()=>CharacterApp.getState().tab),'appearance');assert.deepEqual(await page.evaluate(()=>CharacterApp.getState().values),before);
   // A kept field and a candidate open their specific page and reveal the target card.
   await page.evaluate(()=>{CharacterApp.setView('build');document.querySelector('#singleDetailBuilder').hidden=false;document.querySelector('#guidedQuestion').hidden=true;});
   await page.locator('[data-canvas-action="explore"][data-id="trait.0"]').click();assert.equal(await page.evaluate(()=>CharacterApp.getState().tab),'personality');assert(await page.locator('#results [data-field="trait.0"]').isVisible());
   await page.evaluate(()=>{CharacterApp.setView('build');document.querySelector('#singleDetailBuilder').hidden=false;document.querySelector('#guidedQuestion').hidden=true;const s=CharacterApp.getState();s.canvas.category='background';for(const v of Object.values(s.values))v.focused=true;CharacterApp.offerCandidate();CharacterApp.render();});
   const candidate=await page.evaluate(()=>CharacterApp.getState().canvas.candidateId);await page.locator('[data-candidate-action="explore"]').click();assert.equal(await page.evaluate(()=>CharacterApp.getState().tab),'background');assert(await page.locator('#results [data-field="'+candidate+'"]').isVisible());
   await page.screenshot({path:'/tmp/character-detail-pages-'+width+'.png',fullPage:false});
   if(width===390){await page.locator('#floatingActions summary').click();await page.screenshot({path:'/tmp/character-detail-actions-mobile.png',fullPage:false});}
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log('PASS: random six-module snapshots, preserved values, manual and automatic selection, snapshot reloads; all 12 pages through Browse, exact field coverage, mobile floating return, stable character data, related links, restored tabs, kept/candidate Explore targets, and overflow at 1440/390/320px.');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
