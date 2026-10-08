'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const clone=x=>JSON.parse(JSON.stringify(x));
const source=f=>fs.readFileSync(require('node:path').join(__dirname,f),'utf8');
const elements=new Map(),storage=new Map();
function element(id){if(!elements.has(id))elements.set(id,{value:'',checked:false,hidden:false,textContent:'',innerHTML:'',dataset:{},classList:{add(){},remove(){},toggle(){}},listeners:{},addEventListener(k,fn){this.listeners[k]=fn;},setAttribute(){},querySelectorAll(){return [];},showModal(){},close(){}});return elements.get(id);}
const tabs=['build','quick','full','dialogue','now','sheet','saved'].map(tab=>{const e=element('tab-'+tab);e.dataset.tab=tab;return e;});
const context=vm.createContext({console,Intl,Date,Math,JSON,document:{body:{classList:{toggle(){}}},getElementById:element,querySelectorAll:s=>s==='[data-tab]'?tabs:[]},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},navigator:{},location:{protocol:'file:'},setTimeout(){},clearTimeout(){},confirm:()=>true,crypto:{randomUUID:()=>crypto.randomUUID()}});
context.window=context;context.addEventListener=()=>{};
for(const f of ['original-data.js','additions.js','core.js','right-now-data.js','right-now.js','dialogue-data.js','dialogue.js','character-canvas.js','app.js'])vm.runInContext(source(f),context,{filename:f});
const A=context.CharacterApp,R=context.RightNow,D=context.RightNowData,O=context.ORIGINAL_ELEMENTS,C=context.CharacterCore;
let s=A.getState();const defs=A.getFields(),now=defs.filter(f=>f.kind==='rightNow'),f=k=>defs.find(x=>x.id==='now.'+k),v=k=>s.values['now.'+k];
for(const [name,hash] of Object.entries({'character_elements.json':'cb07c790b8a01117c69a2c8c0b72aeddfbdb1f10b4f550a672d2e8672462a776','original-data.js':'1d71c6bf2c7371b9e40a8a37dff864e78add59aa4f86a325f50aec4dffbbe914'}))assert.equal(crypto.createHash('sha256').update(source(name)).digest('hex'),hash);
assert.deepEqual(clone(O),JSON.parse(source('character_elements.json')));
assert.equal(new Set(defs.map(f=>f.id)).size,defs.length);
assert(now.length>70);assert(now.every(f=>f.pool===undefined||f.pool===null||f.pool.length));
assert(['now.spot','now.activity','now.goal','now.next','now.status.words'].every(id=>s.quickFields.includes(id)));
const values=()=>Object.fromEntries(Object.entries(s.values).map(([id,v])=>[id,[v.value,v.information,v.locked,v.kept,v.keptValue]]));
const before=clone(values());for(let i=0;i<10;i++)A.focusShuffle();assert.deepEqual(clone(values()),before);
for(const density of [.35,.6,.85,1]){s.settings.focusDensity=density;A.focusShuffle();if(density===1)assert(now.every(f=>s.values[f.id].focused));}
s.settings.focusDensity=.6;
v('thought').locked=true;v('thought').value='An exact locked thought';v('goal').kept=true;v('goal').keptValue='A previously kept goal';
A.rollAll();A.rollField(f('thought'));assert.equal(v('thought').value,'An exact locked thought');assert.equal(v('goal').keptValue,'A previously kept goal');
const shared=clone(values());for(const tab of tabs)tab.onclick();assert.deepEqual(clone(values()),shared);
s.tab='now';A.render();assert(element('results').innerHTML.includes('data-field="now.thought"'));assert(element('results').innerHTML.includes('author details'));
v('object').focused=false;A.render();const card=element('results').innerHTML.split('data-field="now.object"')[1].split('</article>')[0];assert(card.includes('data-action="reroll"'));assert(!card.includes('disabled'));assert(card.includes('custom-value'));
// Device gating applies in both modes, including preserved locked readings.
for(const mode of ['Independent','Connected moment']){s.settings.momentMode=mode;v('device').value='No device';v('device').locked=true;v('heart').locked=false;R.roll(f('heart'),s,O);assert.equal(v('heart').value,'No device');v('heart').value='90 bpm';v('heart').locked=true;R.reconcile(s,defs,O,'now.device');assert.equal(v('heart').value,'90 bpm');assert.equal(R.projection(f('heart'),s),'No device');}
v('heart').locked=false;v('device').locked=false;
s.settings.perspective='Another person / observer';assert.match(R.projection(f('thought'),s),/Unavailable.*private/);const secret=v('thought').value;s.settings.perspective='Author';assert.equal(R.projection(f('thought'),s),secret);
v('sighting1.observer').value='A doorbell camera';v('sighting1.interpretation').value='They knew a secret';v('sighting1.interpretation').information='Available';assert.match(R.projection(f('sighting1.interpretation'),s),/No interpretation/);
// Connected parent/child consistency over many complete and individual rolls.
for(const x of now)s.values[x.id].locked=false;
s.settings.momentMode='Connected moment';
for(let i=0;i<120;i++){
 R.begin(s);for(const x of now)R.roll(x,s,O);
 assert.equal(R.warnings(s).length,0);
 for(const key of ['setting','spot','goal','conversation.partner']){R.roll(f(key),s,O);R.reconcile(s,defs,O,'now.'+key);assert.equal(R.warnings(s).length,0);}
 if(!R.deviceState(s)){assert.match(v('heart').value,/^\d+ bpm$/);assert(+v('heart').value.split(' ')[0]>=38);assert(+v('heart').value.split(' ')[0]<=175);assert(parseFloat(v('sleep').value)<=14);assert(parseInt(v('steps').value)<=26000);assert(parseInt(v('battery').value)<=100);}
 assert(now.every(x=>typeof s.values[x.id].value==='string'));
}
v('spot').value='Custom locked place';v('spot').locked=true;R.roll(f('setting'),s,O);R.reconcile(s,defs,O,'now.setting');assert.equal(v('spot').value,'Custom locked place');assert(R.warnings(s).length);v('spot').locked=false;
// Archetypes affect source availability, never overwrite focus during projection.
function available(footprint){s.settings.footprint=footprint;R.begin(s);let n=0;for(let i=0;i<1500;i++){R.roll(f('unanswered'),s,O);if(v('unanswered').information==='Available')n++;}return n;}
assert(available('Constantly online')>available('Off-grid')+900);
const focused=v('unanswered').focused;R.projection(f('unanswered'),s);assert.equal(v('unanswered').focused,focused);
// Old backups migrate once; all preexisting values, including empty edits, survive.
const legacy=clone(s);for(const key of Object.keys(legacy.values))if(key.startsWith('now.'))delete legacy.values[key];for(const key of Object.keys(R.defaults))delete legacy.settings[key];legacy.quickFields=['birthday','CHARACTER_NAME_TYPE'];legacy.notes='Original notes';legacy.values['CHARACTER_NAME_TYPE'].value='';
const migrated=A.validSnapshot(legacy);assert.equal(migrated.settings.momentMode,'Independent');assert.deepEqual(clone(migrated.quickFields),legacy.quickFields);assert.equal(migrated.notes,legacy.notes);for(const [id,x] of Object.entries(legacy.values))assert.deepEqual(clone(migrated.values[id]),x);
assert.deepEqual(clone(A.validSnapshot(clone(migrated))),clone(migrated));assert.throws(()=>A.validSnapshot({...clone(s),settings:{...s.settings,perspective:'invalid'}}));
element('save').onclick();element('save').onclick();let saves=JSON.parse(storage.get('character-maker.saved.v1'));assert.equal(saves.length,2);assert.notEqual(saves[0].id,saves[1].id);assert.deepEqual(clone(A.validSnapshot(saves[0].character)),clone(saves[0].character));
assert.equal(C.ageAt('2008-10-09',2026,'2026-10-08'),17);assert.equal(C.ageAt('2008-10-09',2026,'2026-10-09'),18);assert.equal(C.parseDate('2025-02-29'),null);assert(C.parseDate('2024-02-29'));assert(C.birthDetails('2000-01-01').stone);
s.settings.adultEnabled=true;s.settings.storyYear=2026;s.settings.storyDate='2026-10-08';s.values.birthday.value='2008-10-09';assert.equal(A.adultAllowed(),false);s.settings.storyDate='2026-10-09';assert.equal(A.adultAllowed(),true);assert(defs.some(f=>f.id==='extra.name_initial'));
const sw=source('sw.js');assert(sw.includes("PREFIX+'v9'"));assert(sw.includes('k.startsWith(PREFIX)'));for(const name of ['right-now-data.js','right-now.js','dialogue-data.js','dialogue.js','character-canvas.js'])assert(sw.includes("'./"+name+"'"));
console.log('PASS: original JSON equivalence; shared views; focus; locks; Keep; device gating; perspective; camera limits; connected rerolls; archetype probability; migration; save round trips; birthday/adult/naming; offline cache list. '+now.length+' Right Now fields.');

// Dialogue state, curation, migration, and declared compatibility.
const G=context.Dialogue,DD=context.DialogueData,gd=defs.filter(f=>f.kind==='dialogue'),gf=key=>gd.find(f=>f.id==='dialogue.'+key);
assert.equal(gd.length,14);assert(gd.filter(f=>!f.wildcard&&f.id!=='dialogue.profanity').every(f=>f.pool.length>=12&&f.pool.length<=20));
assert.equal(defs.find(f=>f.id==='CHARACTER_SPEECH').label,'Voice Sound');assert.equal(defs.find(f=>f.id==='CHARACTER_SPEECH').pool,O.CHARACTER_SPEECH);assert(!s.quickFields.some(id=>id.startsWith('dialogue.')));
const optionIds=gd.filter(f=>!f.wildcard).flatMap(f=>f.pool.map(o=>o.id));assert.equal(new Set(optionIds).size,optionIds.length);for(const f of gd)for(const o of f.pool)assert(o.id&&o.label&&(o.instruction||o.rule)&&o.example);
const beforeDialogue=clone(s.values);A.focusShuffle();for(const f of gd){assert.equal(s.values[f.id].value,beforeDialogue[f.id].value);assert.deepEqual(clone(s.values[f.id].parameters),beforeDialogue[f.id].parameters);}
for(const f of gd){const state=s.values[f.id];state.locked=true;const snapshot=clone(state);G.roll(f,s,{force:true});assert.deepEqual(clone(state),snapshot);state.locked=false;}
for(const f of defs){s.values[f.id].kept=false;s.values[f.id].keptValue='';}assert.equal(G.recipeText(s),'');
const amount=s.values['dialogue.amount'];amount.kept=true;amount.keptValue='Chosen amount\nReply once and stop.\nScope: Spoken dialogue\nExample: “Yes.”';const recipe=G.recipeText(s);assert(recipe.includes('Reply once and stop.'));assert(!recipe.includes('Example:'));const notKept=s.values['dialogue.words'].value;G.roll(gf('amount'),s);assert.equal(G.recipeText(s),recipe);assert(!recipe.includes(notKept));
const old=clone(s);for(const id of Object.keys(old.values))if(id.startsWith('dialogue.'))delete old.values[id];delete old.settings.dialogueWildcards;delete old.settings.dialogueCombine;old.quickFields=['birthday','CHARACTER_SPEECH'];const restored=A.validSnapshot(old);for(const [id,entry] of Object.entries(old.values))assert.deepEqual(clone(restored.values[id]),entry);assert.deepEqual(clone(restored.quickFields),old.quickFields);assert.equal(restored.settings.dialogueWildcards,false);assert.deepEqual(clone(A.validSnapshot(clone(restored))),clone(restored));
const multi=gf('multilingual');s.values['extra.languages'].value='English';s.values.CHARACTER_NATIONAL_HERITAGE.value='French';const multiResult=G.prepare(multi,s,multi.pool.find(o=>o.id==='switch.affection'));assert.equal(multiResult.parameters.languages,'English');assert(!multiResult.value.includes('French'));assert(!multiResult.value.includes('Spanish'));assert(multiResult.value.includes('second language must be specified'));assert.equal(G.prepare(multi,s,multi.pool[0],{languages:'English; French'}).parameters.languages,'English; French');
const wildcard=gf('wildcard1'),second=gf('wildcard2'),challenge=id=>wildcard.pool.find(o=>o.id===id),make=(id,p={})=>G.prepare(wildcard,s,challenge(id),p);
for(const letter of 'abcdefghijklmnopqrstuvwxyz'){const made=make('forbidden-letter',{letter}),example=made.value.split('Example: ')[1];assert(!example.toLowerCase().includes(letter));}
for(let words=1;words<=12;words++)for(const id of ['exact-length','word-budget'])assert.equal(G.wordCount(make(id,{words}).value.split('Example: ')[1]),words);
for(const word of DD.wildcard_parameters.word)assert(new RegExp('\\b'+word+'\\b','i').test(make('mandatory-word',{word}).value.split('Example: ')[1]));
assert.throws(()=>make('exact-length',{words:0}));assert.throws(()=>make('forbidden-letter',{letter:'ab'}));
for(const [a,b] of DD.wildcard_incompatibilities){assert(G.conflict(make(a),make(b)));assert(G.conflict(make(b),make(a)));}
assert(G.conflict(make('exact-length',{words:6}),make('word-budget',{words:3})));assert.equal(G.conflict(make('exact-length',{words:3}),make('word-budget',{words:6})),null);assert(G.conflict(make('mandatory-word',{word:'here'}),make('forbidden-letter',{letter:'e'})));
s.settings.dialogueWildcards=true;s.settings.dialogueCombine=true;
for(const o of second.pool){Object.assign(s.values[second.id],G.prepare(second,s,o),{locked:true});for(let i=0;i<25;i++){G.roll(wildcard,s);assert.equal(G.conflict(s.values[wildcard.id],s.values[second.id]),null);assert.equal(s.values[second.id].optionId,o.id);}}
s.values[second.id].locked=false;
Object.assign(s.values[wildcard.id],make('questions-only'));Object.assign(s.values[second.id],make('no-questions'));const incompatible=clone([s.values[wildcard.id],s.values[second.id]]);assert(G.conflicts(s).some(x=>x.includes('Selections preserved')));assert.deepEqual(clone([s.values[wildcard.id],s.values[second.id]]),incompatible);
const fullRoundTrip=A.validSnapshot(clone(s));for(const f of gd)assert.deepEqual(clone(fullRoundTrip.values[f.id]),clone(s.values[f.id]));
console.log('PASS: 156 dialogue options; original Voice Sound pool; independent locks/focus/Keep; kept-only recipe; old and new backups; language reference and override; parameter validation; counted/forbidden-letter examples; every declared incompatible pair; compatible random rolls and preserved manual conflicts.');

// The default language reference follows new rolls; a deliberate override stays put.
s.values['extra.languages'].value='English';s.values[multi.id].parameters={languages:'Old reference',languageOverride:false};G.roll(multi,s);assert.equal(s.values[multi.id].parameters.languages,'English');s.values['extra.languages'].value='French';G.roll(multi,s);assert.equal(s.values[multi.id].parameters.languages,'French');Object.assign(s.values[multi.id],G.prepare(multi,s,multi.pool[1],{languages:'English; Japanese',languageOverride:true}));s.values['extra.languages'].value='German';G.roll(multi,s);assert.equal(s.values[multi.id].parameters.languages,'English; Japanese');assert.deepEqual(clone(A.validSnapshot(clone(s)).values[multi.id]),clone(s.values[multi.id]));
console.log('PASS: default multilingual references follow the Language field; manual overrides survive rerolls and import.');

// Canvas selection is separate from background generation and from acceptance.
const K=context.CharacterCanvas;
const canvasOld=clone(s);delete canvasOld.canvas;canvasOld.tab='full';const canvasMigrated=A.validSnapshot(canvasOld);assert.equal(canvasMigrated.tab,'full');assert.equal(canvasMigrated.canvas.category,'surprise');for(const [id,value] of Object.entries(canvasOld.values))assert.deepEqual(clone(canvasMigrated.values[id]),value);
const testState=clone(s);testState.canvas=K.defaults('appearance');for(const v of Object.values(testState.values)){v.kept=false;v.focused=true;}
const beforeCandidates=clone(testState.values),seenCandidates=[];
for(let i=0;i<defs.filter(f=>f.group==='Appearance').length;i++){const result=K.offer(testState,defs,()=>true);assert.equal(result.kind,'candidate');assert.equal(result.field.group,'Appearance');assert(!seenCandidates.includes(result.field.id));assert(!K.foundation.includes(result.field.id));seenCandidates.push(result.field.id);}
assert.equal(K.status(testState,defs,()=>true).kind,'cycle');assert.deepEqual(clone(testState.values),beforeCandidates);
K.resetCycle(testState);for(const f of defs.filter(f=>f.group==='Appearance'))testState.values[f.id].focused=false;assert.equal(K.offer(testState,defs,()=>true).kind,'focus');assert.equal(testState.canvas.candidateId,null);testState.canvas.includeFaded=true;const faded=K.offer(testState,defs,()=>true);assert.equal(faded.kind,'candidate');assert.equal(testState.values[faded.field.id].focused,false);testState.values[faded.field.id].kept=true;testState.values[faded.field.id].keptValue='Accepted old value';assert.equal(K.validateCandidate(testState,defs,()=>true),null);assert.equal(testState.values[faded.field.id].keptValue,'Accepted old value');
for(const f of defs.filter(f=>f.group==='Appearance'))testState.values[f.id].kept=true;assert.equal(K.status(testState,defs,()=>true).kind,'empty');
// Each category has equal probability even though Right Now has many more fields.
const balanced=clone(s);balanced.canvas=K.defaults();for(const v of Object.values(balanced.values)){v.kept=false;v.focused=true;}balanced.settings.dialogueWildcards=true;balanced.settings.dialogueCombine=true;
const groups=K.availableCategories(defs);assert.equal(groups.length,6);for(let i=0;i<groups.length;i++){K.resetCycle(balanced);let n=0;const result=K.offer(balanced,defs,()=>true,()=>n++===0?(i+.1)/groups.length:0);assert.equal(K.categoryFor(result.field).id,groups[i].id);}
const restricted=defs.find(f=>f.kind==='adult');assert.equal(K.eligible(restricted,balanced,()=>false),false);assert(K.foundation.every(id=>!K.eligible(defs.find(f=>f.id===id),balanced,()=>true)));
balanced.canvas.category='dialogue';balanced.canvas.seen=[];const structured=K.offer(balanced,defs,()=>true);assert(structured.field.kind==='dialogue'||structured.field.id==='CHARACTER_SPEECH');assert.equal(balanced.values[structured.field.id].value,s.values[structured.field.id].value);
const corrupt=clone(balanced);corrupt.canvas={category:'dead',candidateId:'does-not-exist',seen:['bad','birthday','birthday'],includeFaded:true,suggesting:true};K.migrate(corrupt,defs);assert.equal(corrupt.canvas.category,'surprise');assert.equal(corrupt.canvas.candidateId,null);assert.deepEqual(clone(corrupt.canvas.seen),['birthday']);
// Keep entries with reduced trait counts remain available in old backups and on the canvas.
const olderTraits=clone(s);olderTraits.settings.traitCount=1;olderTraits.values['trait.5']={value:'Original sixth trait',focused:false,locked:true,kept:true,keptValue:'Sixth kept trait'};const restoredTraits=A.validSnapshot(olderTraits);assert.deepEqual(clone(restoredTraits.values['trait.5']),olderTraits.values['trait.5']);
console.log('PASS: canvas migration, preserved views and inactive kept traits, balanced category sampling, no repeat within a cycle, focus/faded exhaustion, foundation/adult eligibility, and browsing without value mutation.');

// An age restriction masks accepted adult details without discarding their snapshot or lock.
const priorAdult=clone(s.values.SEX_KINK),priorStory=s.settings.storyDate;Object.assign(s.values.SEX_KINK,{value:'Previously curated adult-only detail',kept:true,keptValue:'Earlier adult snapshot',locked:true});s.values.birthday.value='2008-10-09';s.settings.storyDate='2026-10-08';A.render();assert.equal(s.values.SEX_KINK.value,'Previously curated adult-only detail');assert.equal(s.values.SEX_KINK.keptValue,'Earlier adult snapshot');assert.equal(s.values.SEX_KINK.kept,true);assert(!A.keptEntries().find(x=>x.id==='SEX_KINK').value.includes('Earlier adult snapshot'));assert.equal(K.eligible(restricted,s,A.candidateAllowed),false);s.values.SEX_KINK=priorAdult;s.settings.storyDate=priorStory;
console.log('PASS: age-ineligible accepted snapshots stay stored and locked, remain masked in the sheet, and cannot be suggested.');
