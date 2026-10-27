'use strict';
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const server=http.createServer((req,res)=>{const name=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(__dirname,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(__dirname+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png'}[path.extname(file)]||'application/octet-stream'));res.end(data);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
  const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url='http://127.0.0.1:'+server.address().port;await page.goto(url);await page.waitForFunction(()=>window.GuidedUI);assert.deepEqual(errors,[]);
  const read=()=>page.evaluate(()=>JSON.parse(JSON.stringify(CharacterApp.getState())));
  const sentence=()=>page.locator('#suggestionText').innerText();
  assert.equal(await page.locator('#questionTitle').innerText(),'Who are they?');
  assert.equal(await page.locator('#ingredientDetails summary').innerText(),'See ingredients');
  const first=await read(),firstSentence=await sentence();assert.equal(first.guided.pending.identity.ingredients.length,6);assert.equal(Object.keys(first.guided.accepted).length,0);
  // Candidate generation draws from actual pools, without changing background or accepted values.
  await page.locator('#tryAnother').click();const after=await read();assert.deepEqual(after.values,first.values);assert.notEqual(await sentence(),firstSentence);
  const valid=await page.evaluate(()=>{const api=CharacterApp.builderAPI(),p=api.state.guided.pending.identity;return p.ingredients.every(i=>i.fieldId==='birthday'?!!CharacterCore.parseDate(i.value):GuidedBuilder.pool(api,i.fieldId).includes(i.value));});assert(valid);
  await page.locator('#ingredientDetails summary').click();
  const trait=page.locator('[data-slot="trait"]');await trait.locator('[data-hold-ingredient]').click();const held=(await read()).guided.pending.identity.ingredients.find(i=>i.slot==='trait').value;
  await page.locator('#tryAnother').click();assert.equal((await read()).guided.pending.identity.ingredients.find(i=>i.slot==='trait').value,held);
  await trait.locator('[data-edit-ingredient]').click();await page.locator('#ingredientEditValue').fill('patient <script>unsafe()</script>');await page.locator('#applyIngredient').click();assert((await sentence()).includes('patient <script>unsafe()</script>'));assert.equal(await page.locator('#suggestionText script').count(),0);
  // The age token opens a direct years input, synchronized with its underlying birthday.
  await page.locator('[data-sentence-ingredient="age"]').click();await page.locator('#ingredientEditAge').fill('75');
  assert.equal(await page.evaluate(()=>CharacterCore.ageAt(document.getElementById('ingredientEditValue').value,CharacterApp.getState().settings.storyYear,CharacterApp.getState().settings.storyDate)),75);
  await page.locator('#applyIngredient').click();assert((await sentence()).includes('75-year-old'));
  await page.locator('[data-sentence-ingredient="age"]').click();await page.locator('#ingredientEditValue').fill('1980-01-01');assert.equal(await page.locator('#ingredientEditAge').inputValue(),'46');await page.locator('#applyIngredient').click();
  assert((await sentence()).includes('46-year-old'));assert.equal((await read()).settings.ageRange,'Young Adult');
  const identity=await sentence();await page.locator('#addDetail').click();await page.waitForTimeout(300);
  assert.equal(await page.locator('#questionTitle').innerText(),'What do they want?');assert.equal(await page.locator('[data-sketch="identity"] p').innerText(),identity);
  const keptIdentity=await read();assert(keptIdentity.values['background.occupation'].kept);assert.equal(keptIdentity.values['trait.0'].keptValue,'patient <script>unsafe()</script>');
  // Undo/redo restores the accepted sentence and all its dependent fields together.
  await page.locator('#builderUndo').click();assert.equal(Object.keys((await read()).guided.accepted).length,0);await page.evaluate(()=>CharacterApp.redo());assert.equal((await read()).guided.accepted.identity.ingredients.length,6);
  // Switch the causal pool and edit just one ingredient, preserving identity.
  if(!await page.locator('#ingredientDetails').evaluate(d=>d.open))await page.locator('#ingredientDetails summary').click();
  await page.locator('[data-ingredient-pool="influence"]').selectOption('relationships.enemies');assert.equal((await read()).guided.pending.motivation.ingredients.find(i=>i.slot==='influence').fieldId,'relationships.enemies');
  await page.locator('#tryAnother').click();assert.equal(await page.locator('[data-sketch="identity"] p').innerText(),identity);
  await page.locator('#addDetail').click();await page.waitForTimeout(300);assert.equal(await page.locator('#questionTitle').innerText(),'What gets in their way?');
  await page.locator('#addDetail').click();await page.waitForTimeout(300);assert.equal(Object.keys((await read()).guided.accepted).length,3);assert(await page.locator('#deeperDevelopment').isVisible());
  await page.locator('#characterName').fill('Guided regression character');await page.locator('#save').click();const beforeReload=await read(),historyIndex=await page.evaluate(()=>CharacterApp.getHistory().index);await page.reload();await page.waitForFunction(()=>window.GuidedUI);const reloaded=await read();assert.deepEqual(reloaded.guided.accepted,beforeReload.guided.accepted);assert.equal(await page.evaluate(()=>CharacterApp.getHistory().index),historyIndex,'Reload discarded the journal after browsing or opening ingredients');
  await page.locator('#previewExport').click();assert(await page.locator('#briefPreview').innerText().then(t=>t.includes(identity)));assert.equal(await page.locator('#workshopView').getByRole('heading',{name:'Character sketch',exact:true}).count(),1);
  const download=page.waitForEvent('download');await page.locator('[data-workshop-action="downloadBrief"]').click();const output=await download;assert(fs.readFileSync(await output.path(),'utf8').includes('patient &lt;script&gt;unsafe()&lt;/script&gt;'));
  await page.locator('#backToCharacter').click();await page.screenshot({path:'/tmp/character-redesign-desktop.png',fullPage:true});
  // The full set of existing tools remains reachable through the simplified shell.
  await page.locator('[data-main="tools"]:visible').click();assert(await page.locator('#toolsView').isVisible());await page.locator('[data-go="connections"]').click();assert(await page.locator('#connectionRole').isVisible());await page.locator('#backToCharacter').click();
  await page.locator('#browseDetails').click();await page.locator('[data-browse-tab="medical"]').click();assert.equal(await page.locator('#results .card').count(),8);await page.locator('#backToCharacter').click();
  await page.locator('[data-main="saved"]:visible').click();assert(await page.locator('#savedContent').innerText().then(t=>t.includes('Guided regression character')));await page.locator('#savedContent [data-load]').first().click();
  await page.setViewportSize({width:375,height:812});await page.evaluate(()=>scrollTo(0,0));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/character-redesign-mobile.png',fullPage:true});
  await page.locator('#toggleSketch').click();assert(await page.locator('#sketchBody').isVisible());await page.locator('#toggleSketch').click();
  await page.locator('#writeOwn').click();await page.locator('#customSentence').fill('A custom sentence from the writer.');await page.locator('#keepCustomSentence').click();assert(Object.values((await read()).guided.accepted).some(p=>p.customText==='A custom sentence from the writer.'));
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#tryAnother').focus();await page.keyboard.down(' ');assert.equal(await page.locator('#tryAnother').evaluate(el=>getComputedStyle(el).transform),'none');await page.keyboard.up(' ');
  await context.setOffline(true);await page.reload();await page.waitForFunction(()=>window.GuidedUI);assert(Object.values((await read()).guided.accepted).some(p=>p.customText==='A custom sentence from the writer.'));
  const fresh=await browser.newContext({viewport:{width:1440,height:1000}}),start=await fresh.newPage();start.on('pageerror',e=>errors.push(e.message));await start.goto(url);await start.waitForFunction(()=>window.GuidedUI);
  assert.equal(await start.locator('#ingredientDetails').evaluate(el=>el.open),false);
  await start.screenshot({path:'/tmp/character-redesign-start-desktop.png',fullPage:true});
  await start.setViewportSize({width:375,height:812});assert(await start.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert((await start.locator('#characterName').boundingBox()).width>100);
  await start.screenshot({path:'/tmp/character-redesign-start-mobile.png',fullPage:true});
  await start.locator('.app-menu summary').click();await start.locator('.app-menu [data-open-settings]').click();await start.locator('#storyYear').fill('2030');await start.locator('#storyYear').press('Tab');assert.equal(await start.evaluate(()=>CharacterApp.getState().settings.storyYear),2030);await start.locator('#builderDialog [data-close]').click();assert.equal(await start.locator('#rollSettings').isVisible(),false);
  await start.locator('[data-sentence-ingredient="trait"]').focus();await start.keyboard.press('Enter');assert(await start.locator('#ingredientEditValue').isVisible());await start.keyboard.press('Escape');
  const saves=await start.evaluate(()=>localStorage.getItem('character-maker.saved.v1'));await start.evaluate(()=>{window.realSetItem=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('Storage full');};});await start.locator('#save').click();assert.match(await start.locator('#toast').innerText(),/Could not save/);assert.equal(await start.evaluate(()=>localStorage.getItem('character-maker.saved.v1')),saves);await start.evaluate(()=>Storage.prototype.setItem=window.realSetItem);
  assert.deepEqual(errors,[]);console.log('PASS: production composed prompts, real array provenance, ingredient edits/holds/pool choices, acceptance, atomic undo/redo, versions, reload, brief/HTML export, tools, mobile, reduced motion, offline reload, settings, keyboard ingredient editing and storage-failure handling.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
