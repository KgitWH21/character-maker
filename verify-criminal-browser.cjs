'use strict';
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const server=http.createServer((req,res)=>{const file=path.resolve(__dirname,'.'+(req.url==='/'?'/index.html':decodeURIComponent(req.url.split('?')[0])));if(!file.startsWith(__dirname+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,body)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'}[path.extname(file)]||'application/octet-stream'));res.end(body);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
  const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url='http://127.0.0.1:'+server.address().port;await page.goto(url);await page.waitForFunction(()=>window.GuidedUI);
  const values=()=>page.evaluate(()=>CharacterApp.getState().values),card=id=>page.locator('#results [data-field="'+id+'"]');
  async function edit(id,value){const c=card(id);await c.locator('.edit-details').evaluate(el=>el.open=true);await c.locator('.custom-value').fill(value);await c.locator('[data-action="applyEdit"]').click();}
  const read=()=>page.evaluate(()=>JSON.parse(JSON.stringify(CharacterApp.getState())));
  await page.evaluate(()=>{const s=CharacterApp.getState();s.settings.storyDate='2026-10-27';s.settings.storyYear=2026;s.values.birthday.value='1991-01-01';CharacterApp.render();});
  await page.locator('#browseDetails').click();await page.locator('[data-browse-tab="criminal-history"]').click();assert(await page.locator('#results').isVisible());assert(await page.locator('#workshopView').isHidden());
  assert.equal(await page.locator('.criminal-incident').count(),1);assert.equal(await page.locator('.criminal-incident').evaluate(el=>el.open),false);
  await edit('criminal.history','Isolated incident');await page.locator('.criminal-incident>summary').click();
  assert.equal(await page.locator('#results [data-field]').count(),25);
  await edit('criminal.incident1.age','22');await edit('criminal.incident1.age','40');assert.match(await page.locator('#toast').textContent(),/age/);assert.equal((await values())['criminal.incident1.age'].value,'22');
  await edit('criminal.incident1.record','Convicted');await edit('criminal.incident1.truth','Innocent of the accusation');assert.equal((await values())['criminal.incident1.record'].value,'Convicted');assert.equal((await values())['criminal.incident1.motive'].value,'None');
  await edit('criminal.incident1.truth','Responsible for the act');await edit('criminal.incident1.motive','Loyalty');
  for(const key of ['justified','refuse','return','accomplice','harmed','investigator','lawyer','informant','helper','knows','thread'])await edit('criminal.incident1.'+key,'Custom '+key+' <script>unsafe()</script>');
  assert.equal(await page.locator('.criminal-incident script').count(),0);
  const motive=card('criminal.incident1.motive');await motive.locator('[data-action="keep"]').click();await motive.locator('[data-action="lock"]').click();assert(await page.locator('.criminal-incident').evaluate(el=>el.open));
  const focused=(await values())['criminal.incident1.motive'].focused;await motive.locator('[data-action="focus"]').click();assert.equal((await values())['criminal.incident1.motive'].focused,!focused);
  await page.locator('[data-criminal-action="roll"]').click();assert.equal((await values())['criminal.incident1.motive'].value,'Loyalty');assert.equal((await values())['criminal.incident1.motive'].keptValue,'Loyalty');
  const first=await values();await page.locator('[data-criminal-action="add"]').click();assert.equal(await page.locator('.criminal-incident').count(),2);assert(await page.locator('[data-criminal-incident="2"]').evaluate(el=>el.open));
  for(const [id,value]of Object.entries(first))assert.deepEqual((await values())[id],value);
  await edit('criminal.incident2.offense','Theft');await edit('criminal.incident2.age','30');await edit('criminal.incident2.thread','An old associate returns');await card('criminal.incident2.thread').locator('[data-action="keep"]').click();
  await page.locator('[data-criminal-action="remove"][data-incident="1"]').click();assert.match(await page.locator('#toast').textContent(),/Unlock/);assert.equal(await page.locator('.criminal-incident').count(),2);
  await page.locator('[data-criminal-action="remove"][data-incident="2"]').click();assert.equal(await page.locator('.criminal-incident').count(),1);assert(!(await values())['criminal.incident2.offense']);
  await page.evaluate(()=>CharacterApp.undo());assert.equal(await page.locator('.criminal-incident').count(),2);assert.equal((await values())['criminal.incident2.offense'].value,'Theft');assert.equal((await values())['criminal.incident2.thread'].keptValue,'An old associate returns');
  await page.evaluate(()=>CharacterApp.redo());assert.equal(await page.locator('.criminal-incident').count(),1);await page.evaluate(()=>CharacterApp.undo());
  // Snapshot validation, legacy migration, saves and actual downloadable JSON preserve each incident.
  const before=await read();const roundTrip=await page.evaluate(s=>CharacterApp.validSnapshot(s),before);assert.deepEqual(roundTrip.criminalHistory,before.criminalHistory);for(const [id,value]of Object.entries(before.values).filter(([id])=>id.startsWith('criminal.')))assert.deepEqual(roundTrip.values[id],value);
  const legacy=await page.evaluate(s=>{delete s.criminalHistory;for(const id of Object.keys(s.values))if(id.startsWith('criminal.'))delete s.values[id];return CharacterApp.validSnapshot(s);},before);assert.equal(legacy.values['criminal.history'].value,'Unknown / not established');assert.deepEqual(legacy.values['trait.0'],before.values['trait.0']);
  await page.locator('#characterName').fill('Criminal history regression');await page.evaluate(()=>CharacterApp.saveVersion());
  const download=page.waitForEvent('download');await page.evaluate(()=>document.getElementById('exportCharacter').click());const file=await download,data=JSON.parse(fs.readFileSync(await file.path(),'utf8'));assert.deepEqual(data.criminalHistory.incidents,[1,2]);assert.equal(data.values['criminal.incident2.offense'].value,'Theft');
  await page.evaluate(()=>CharacterApp.setView('sheet'));assert.match(await page.locator('#sheetContent').textContent(),/Loyalty/);assert.match(await page.locator('#sheetContent').textContent(),/An old associate returns/);
  await page.evaluate(()=>{CharacterApp.getState().workshop.brief.compact=false;CharacterApp.setView('brief');});assert.match(await page.locator('#briefPreview').textContent(),/Criminal history/);
  await page.evaluate(()=>CharacterApp.setView('criminal-history'));await page.reload();await page.waitForFunction(()=>window.GuidedUI);assert.equal(await page.locator('.criminal-incident').count(),2);assert.equal((await values())['criminal.incident1.motive'].locked,true);
  await page.locator('.criminal-incident>summary').first().click();await page.screenshot({path:'/tmp/character-criminal-history-desktop.png',fullPage:false});
  // Quick Snapshot can include one incident field without duplicating the whole module.
  await page.evaluate(()=>{const s=CharacterApp.getState();s.quickFields=['criminal.incident2.thread'];CharacterApp.setView('quick');});assert.equal(await page.locator('#results [data-field]').count(),1);assert.equal(await page.locator('.criminal-incident').count(),0);
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>CharacterApp.setView('criminal-history'));await page.locator('.criminal-incident>summary').first().click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/character-criminal-history-mobile.png',fullPage:false});
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.waitForFunction(()=>window.GuidedUI);assert.equal((await read()).criminalHistory.incidents.length,2);assert.equal((await values())['criminal.incident2.offense'].value,'Theft');await context.setOffline(false);
  // Actual import control accepts the exported file and opening the save restores both incidents.
  await page.evaluate(()=>CharacterApp.setView('saved'));await page.locator('#importFile').setInputFiles({name:'criminal.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await page.waitForFunction(()=>document.getElementById('toast').textContent==='Character imported.');await page.locator('#savedContent [data-load]').first().click();assert.deepEqual((await read()).criminalHistory.incidents,[1,2]);
  assert.deepEqual(errors,[]);console.log('PASS: Criminal history navigation, all prompts, safe custom text, age validation, truth/record separation, focus/keep/locks/rerolls, multiple incidents, undo/redo, save/export/import, legacy migration, sheet/brief, mobile layout, and offline reload.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
