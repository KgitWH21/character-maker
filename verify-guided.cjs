'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const scope={Date,Intl,Math,JSON};scope.window=scope;vm.createContext(scope);
for(const name of ['original-data.js','additions.js','core.js','guided-builder.js'])vm.runInContext(fs.readFileSync(name,'utf8'),scope,{filename:name});
const B=scope.GuidedBuilder,C=scope.CharacterCore,O=scope.ORIGINAL_ELEMENTS,plain=x=>JSON.parse(JSON.stringify(x));
const fields=C.definitions(O,scope.EXTRA_ELEMENTS,6),state={settings:{storyYear:2026,storyDate:'',ageRange:'Young Adult'},values:Object.fromEntries(fields.map(f=>[f.id,{value:f.id==='birthday'?'2000-01-01':'',kept:false,locked:false,keptValue:''}])),guided:B.defaults()},api={state,fields,original:O};
for(const key of B.keys)for(let run=0;run<150;run++){
 const p=B.generate(api,key);assert.equal(p.ingredients.length,B.recipes[key].length);
 for(const item of p.ingredients){assert(B.recipes[key].find(([slot])=>slot===item.slot)[1].includes(item.fieldId));if(item.fieldId==='birthday'){const age=C.ageAt(item.value,2026,'');assert(O.basic.age_ranges.some(range=>age>=range.min&&age<=range.max));}else assert(B.pool(api,item.fieldId).includes(item.value));}
 assert(B.sentence(p,key,state.settings).length>20);assert(!B.sentence(p,key,state.settings).includes('undefined'));
 const restored=B.migrate({...state}, {chapter:key,pending:{[key]:p}}).guided;
 assert.deepEqual(plain(B.migrate({...state},plain(restored)).guided),plain(restored));
}
// Suggestions sample every age band, independently of the full-roll age setting.
for(const setting of O.basic.age_ranges){
 state.settings.ageRange=setting.name;
 for(let i=0;i<O.basic.age_ranges.length;i++){
  let n=0;const band=O.basic.age_ranges[i],date=B.draw(api,'birthday',null,()=>n++===0?(i+.5)/O.basic.age_ranges.length:.5),age=C.ageAt(date,2026,'');
  assert(age>=band.min&&age<=band.max,'Suggestion ignored age band '+band.name);
 }
}
state.settings.ageRange='Young Adult';
state.settings.storyYear=10;for(let i=0;i<20;i++){const date=B.draw(api,'birthday');assert(C.parseDate(date));assert(C.ageAt(date,10,'')<=8);}
state.settings.storyYear=2026;
state.values.birthday.locked=true;assert.equal(B.draw(api,'birthday'),'2000-01-01');state.values.birthday.locked=false;
// Kept snapshots, generator locks and per-candidate holds have distinct protective behavior.
state.values['trait.0']={value:'new background',kept:true,keptValue:'accepted trait',locked:false};
state.values['background.occupation']={value:'Locked occupation',kept:false,locked:true,keptValue:''};
const first=B.generate(api,'identity');assert.equal(first.ingredients.find(i=>i.slot==='trait').value,'accepted trait');assert.equal(first.ingredients.find(i=>i.slot==='occupation').value,'Locked occupation');
const heritage=first.ingredients.find(i=>i.slot==='heritage');heritage.held=true;heritage.value='Custom held heritage';
const rolled=B.generate(api,'identity',first);assert.equal(rolled.ingredients.find(i=>i.slot==='heritage').value,'Custom held heritage');
assert.deepEqual(plain(B.pool(api,'background.family_status')),plain(O.background.family_status));
// Every influence/resistance choice remains available, including both parental pools in the existing parent fields.
state.values['background.occupation'].locked=false;
for(const key of ['motivation','obstacle']){
 const choices=B.recipes[key].find(([slot])=>['influence','resistance'].includes(slot))[1].filter(id=>id!=='story.socialIssue');
 for(let index=0;index<choices.length;index++){
  const generated=B.generate(api,key,null,()=>((index+.1)/choices.length));
  const item=generated.ingredients.find(i=>i.slot===(key==='motivation'?'influence':'resistance'));
  assert.equal(item.fieldId,choices[index]);assert(B.pool(api,item.fieldId).includes(item.value));
 }
}
const old={...state};delete old.guided;const before=plain(old.values);B.migrate(old);assert.deepEqual(plain(old.values),before);assert.equal(old.guided.chapter,'identity');
const malicious={ingredients:first.ingredients.map(i=>({...i,fieldId:'SEX_KINK'})),customText:'<script>not markup</script>'};B.migrate(old,{accepted:{identity:malicious}});assert.equal(old.guided.accepted.identity,undefined);
const authored={...first,customText:'The author wrote this.'};old.guided.accepted.identity=authored;B.sync(old,'trait.0','Changed trait');assert.equal(authored.customText,'The author wrote this.');
assert.equal(B.article('Archaeologist'),'an');assert.equal(B.article('University lecturer'),'a');assert.equal(B.article('18-year-old'),'an');
console.log('PASS: multi-array recipes, all influence/resistance pools, verbatim ingredients, age ranges, kept snapshots, locks, holds, legacy migration and malformed-prompt rejection.');
