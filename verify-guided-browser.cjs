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
  assert(await page.locator('#iterationActions').isHidden());
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
  assert(await page.locator('#saveAndStartAnother').isVisible());
  const beforeDecision=await read(),suggestions=()=>page.locator('#developmentChoices [data-explore]').evaluateAll(items=>items.map(item=>({id:item.dataset.explore,label:item.firstChild.textContent})));
  const excluded=['quick','full','history','single'],allowed=['dialogue','medical','education','relationship-details','now','connections','pressure','sheet'];
  const firstChoices=await suggestions();assert.equal(firstChoices.length,4);assert.equal(new Set(firstChoices.map(t=>t.id)).size,4);assert(firstChoices.every(t=>allowed.includes(t.id)));
  await page.locator('#browseDetails').click();const menuTopics=await page.locator('#topicChoices [data-browse-tab]').evaluateAll(items=>items.map(item=>({id:item.dataset.browseTab,label:item.textContent})));assert.deepEqual(menuTopics.filter(t=>!excluded.includes(t.id)).map(t=>t.id).sort(),allowed.slice().sort());for(const choice of firstChoices)assert(menuTopics.some(t=>t.id===choice.id&&t.label===choice.label));await page.keyboard.press('Escape');
  // A seeded sequence verifies all eight eligible categories can appear without duplicates.
  const sampled=await page.evaluate(()=>{
   const s=CharacterApp.getState(),original=s.guided,random=Math.random,sets=[];let seed=20421;
   Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
   try{for(let i=0;i<32;i++){s.guided=JSON.parse(JSON.stringify(original));CharacterApp.render();sets.push([...document.querySelectorAll('#developmentChoices [data-explore]')].map(b=>b.dataset.explore));}}
   finally{Math.random=random;s.guided=original;CharacterApp.render();}
   return sets;
  });
  for(const set of sampled){assert.equal(set.length,4);assert.equal(new Set(set).size,4);assert(set.every(id=>allowed.includes(id)));}assert.deepEqual([...new Set(sampled.flat())].sort(),allowed.slice().sort());assert(new Set(sampled.map(set=>set.join(','))).size>1);assert.deepEqual(await suggestions(),firstChoices);
  for(const topic of allowed){await page.evaluate(tab=>CharacterApp.setView(tab),topic);assert.equal((await read()).tab,topic);assert.deepEqual((await read()).values,beforeDecision.values);await page.locator('#backToCharacter').click();assert.deepEqual(await suggestions(),firstChoices);}
  await page.locator('#helpDecide').click();assert.equal(await page.locator('#builderDialogTitle').textContent(),'Help me decide');assert.equal(await page.locator('#builderDialogContent h3').count(),1);assert.equal(await page.locator('#builderDialogContent h3').textContent(),firstChoices[0].label);
  await page.locator('#anotherDevelopment').click();assert.equal(await page.locator('#builderDialogContent h3').count(),1);assert.equal(await page.locator('#builderDialogContent h3').textContent(),firstChoices[1].label);
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'helpDecide');assert.deepEqual((await read()).values,beforeDecision.values);
  await page.locator('#helpDecide').click();await page.locator('#tryDevelopment').click();assert.equal((await read()).tab,firstChoices[0].id);assert(await page.locator('#saveAndStartAnother').isVisible());assert.deepEqual((await read()).values,beforeDecision.values);await page.locator('#backToCharacter').click();assert.deepEqual(await suggestions(),firstChoices);
  for(const topic of firstChoices){await page.locator('#developmentChoices [data-explore="'+topic.id+'"]').click();assert.equal((await read()).tab,topic.id);assert.deepEqual((await read()).values,beforeDecision.values);await page.locator('#backToCharacter').click();assert.deepEqual(await suggestions(),firstChoices);}
  assert(await page.locator('#helpDecide').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)<parseFloat(getComputedStyle(el.previousElementSibling).fontSize)));
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
  // Completed sketches can be saved and restarted in one click, including on a phone.
  const iterationContext=await browser.newContext({viewport:{width:375,height:812}}),iteration=await iterationContext.newPage();iteration.on('pageerror',e=>errors.push(e.message));let dialogs=0;iteration.on('dialog',async dialog=>{dialogs++;await dialog.dismiss();});
  await iterationContext.addInitScript(snapshot=>{if(!localStorage.getItem('character-maker.workspace.v1'))localStorage.setItem('character-maker.workspace.v1',JSON.stringify(snapshot));},beforeReload);
  await iteration.goto(url);await iteration.waitForFunction(()=>window.GuidedUI);assert(await iteration.locator('#saveAndStartAnother').isVisible());assert(await iteration.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await iteration.locator('#helpDecide').click();assert(await iteration.locator('#tryDevelopment').isVisible());assert(await iteration.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await iteration.keyboard.press('Escape');
  const completed=await iteration.evaluate(()=>JSON.parse(JSON.stringify(CharacterApp.getState())));
  await iteration.evaluate(()=>{window.savedSetItem=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('Storage full');};});await iteration.locator('#saveAndStartAnother').click();assert.match(await iteration.locator('#toast').textContent(),/Could not save/);assert.deepEqual(await iteration.evaluate(()=>CharacterApp.getState().guided.accepted),completed.guided.accepted);assert.equal(await iteration.locator('#questionTitle').textContent(),'What gets in their way?');
  await iteration.evaluate(()=>Storage.prototype.setItem=window.savedSetItem);await iteration.locator('#saveAndStartAnother').click();assert.equal(dialogs,0);assert.equal(await iteration.locator('#questionTitle').textContent(),'Who are they?');assert(await iteration.locator('#iterationActions').isHidden());assert.equal(await iteration.evaluate(()=>document.activeElement.id),'questionTitle');assert.equal(await iteration.evaluate(()=>CharacterApp.getState().name),'');assert.equal(await iteration.evaluate(()=>Object.keys(CharacterApp.getState().guided.accepted).length),0);
  const captured=await iteration.evaluate(()=>JSON.parse(localStorage.getItem('character-maker.saved.v1')));assert.equal(captured.length,1);assert.equal(captured[0].character.name,completed.name);assert.deepEqual(captured[0].character.guided.accepted,completed.guided.accepted);assert.deepEqual(captured[0].character.values,completed.values);
  await iteration.evaluate(()=>CharacterApp.undo());assert.deepEqual(await iteration.evaluate(()=>CharacterApp.getState().guided.accepted),completed.guided.accepted);await iteration.evaluate(()=>CharacterApp.redo());assert.equal(await iteration.evaluate(()=>Object.keys(CharacterApp.getState().guided.accepted).length),0);
  await iteration.reload();await iteration.waitForFunction(()=>window.GuidedUI);assert.equal(await iteration.locator('#questionTitle').textContent(),'Who are they?');await iteration.locator('[data-main="saved"]:visible').click();await iteration.locator('#savedContent [data-load]').first().click();assert.deepEqual(await iteration.evaluate(()=>CharacterApp.getState().guided.accepted),completed.guided.accepted);assert(await iteration.locator('#saveAndStartAnother').isVisible());
  await iteration.screenshot({path:'/tmp/character-iteration-mobile.png',fullPage:false});await iterationContext.close();
  assert.deepEqual(errors,[]);console.log('PASS: production composed prompts, real array provenance, ingredient edits/holds/pool choices, acceptance, atomic undo/redo, versions, reload, brief/HTML export, tools, mobile, reduced motion, offline reload, settings, keyboard ingredient editing and storage-failure handling.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
