'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const scope={Date,Intl,Math,JSON};scope.window=scope;vm.createContext(scope);
for(const name of ['core.js','criminal-history.js'])vm.runInContext(fs.readFileSync(name,'utf8'),scope,{filename:name});
const H=scope.CriminalHistory,clone=x=>JSON.parse(JSON.stringify(x));
let seed=10627;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const state=(age=35)=>H.migrate({settings:{storyYear:2026,storyDate:'2026-10-27'},values:{birthday:{value:String(2026-age).padStart(4,'0')+'-10-27'}}});
const field=(s,key)=>H.definitions(s).find(f=>f.id==='criminal.'+key),read=(s,key)=>s.values['criminal.'+key].value;
function edit(s,key,value){H.edit(field(s,key),s,value);H.reconcile(s,'criminal.'+key);}
function roll(s){for(const f of H.definitions(s))H.roll(f,s,random);H.reconcile(s,'all');}
for(const age of [0,7,8,13,17,18,35,80,120]){
 const s=state(age);
 for(let i=0;i<300;i++){
  roll(s);const history=read(s,'history');
  if(history===H.NO_HISTORY)assert(H.definitions(s).filter(f=>f.incident).every(f=>s.values[f.id].value===H.NONE));
  else if(history===H.UNKNOWN)assert(H.definitions(s).every(f=>s.values[f.id].value===H.UNKNOWN));
  else{assert(Number(read(s,'incident1.age'))<=age);const record=H.records.find(r=>r.name===read(s,'incident1.record'));if(record){assert(record.consequence.includes(read(s,'incident1.consequence')));assert(record.status.includes(read(s,'incident1.status')));}}
  assert.equal(H.warnings(s).length,0);
 }
}
const s=state();edit(s,'history','Isolated incident');
for(const record of H.records){edit(s,'incident1.record',record.name);assert(record.consequence.includes(read(s,'incident1.consequence')));assert(record.status.includes(read(s,'incident1.status')));}
edit(s,'incident1.record','Convicted');edit(s,'incident1.truth','Innocent of the accusation');assert.equal(read(s,'incident1.record'),'Convicted');assert.equal(read(s,'incident1.motive'),H.NONE);
edit(s,'incident1.record','No official record');edit(s,'incident1.truth','Responsible for the act');assert.equal(read(s,'incident1.record'),'No official record');
for(const motive of ['Desperation','Loyalty','Profit','Revenge','Ideology','Coercion','Recklessness'])assert(H.pools.motive.includes(motive));
for(const pattern of ['One bad decision','Occasional opportunism','Former way of life','Current livelihood'])assert(H.pools.pattern.includes(pattern));
for(const key of ['justified','refuse','return','accomplice','harmed','investigator','lawyer','informant','helper','knows','thread'])assert(field(s,'incident1.'+key));
for(const key of Object.keys(H.pools))assert(H.pools[key].includes(H.UNKNOWN));
for(const bad of ['-1','36','3 years','1.5','<script>bad()</script>'])assert.throws(()=>edit(s,'incident1.age',bad),/age/);
edit(s,'incident1.age','35');s.settings.storyDate='';s.values.birthday.value='1991-12-31';assert.throws(()=>edit(s,'incident1.age','35'));H.reconcile(s,'birthday');assert(Number(read(s,'incident1.age'))<=34);
Object.assign(s.values['criminal.incident1.age'],{value:'35',locked:true,kept:true,keptValue:'Accepted age 35'});H.reconcile(s,'birthday');assert.equal(read(s,'incident1.age'),'35');assert(H.warnings(s).some(w=>w.includes('timeline')));
Object.assign(s.values['criminal.incident1.consequence'],{value:'Incarceration',locked:true,kept:true,keptValue:'Original sentence'});edit(s,'incident1.record','Acquitted');assert.equal(read(s,'incident1.consequence'),'Incarceration');assert(H.warnings(s).some(w=>w.includes('consequence')));assert.equal(s.values['criminal.incident1.consequence'].keptValue,'Original sentence');
edit(s,'history',H.NO_HISTORY);assert(H.warnings(s).some(w=>w.includes('preserved')));assert.equal(s.values['criminal.incident1.age'].keptValue,'Accepted age 35');
const before=clone(s);H.migrate(s);assert.deepEqual(clone(s),before);delete s.values['criminal.incident1.thread'];const existing=clone(s.values);H.migrate(s);for(const [id,value]of Object.entries(existing))assert.deepEqual(clone(s.values[id]),value);assert.equal(read(s,'incident1.thread'),H.UNKNOWN);
assert.throws(()=>H.remove(s,1),/Unlock/);const second=H.add(s);assert.equal(second,2);assert.equal(read(s,'incident2.offense'),H.UNKNOWN);s.quickFields=['criminal.incident2.offense','birthday'];H.remove(s,2);assert(!s.values['criminal.incident2.offense']);assert.deepEqual(clone(s.quickFields),['birthday']);
for(const f of H.definitions(s))s.values[f.id].locked=false;H.remove(s,1);assert.equal(H.definitions(s).length,2);assert.equal(H.add(s),1);
while(s.criminalHistory.incidents.length<20)H.add(s);assert.throws(()=>H.add(s),/20/);assert.equal(new Set(H.definitions(s).map(f=>f.id)).size,H.definitions(s).length);
assert.deepEqual(clone(H.metadata({incidents:[1,1,-1,0,'2',null,{},2,Infinity]})),{incidents:[1,2]});
const multiple=state();H.add(multiple);for(let i=0;i<300;i++)assert.notEqual(H.generate(field(multiple,'history'),multiple,random),'Isolated incident');
edit(multiple,'history','Isolated incident');edit(multiple,'incident1.offense','Theft');edit(multiple,'incident2.offense','Forgery');assert(H.warnings(multiple).some(w=>w.includes('multiple incidents')));
const high=state();high.criminalHistory.incidents=[1000000];H.migrate(high);assert.equal(H.add(high),1);
// Demographics, occupation and personality do not affect generated histories.
const first=state(),other=clone(first);other.values.CHARACTER_NATIONAL_HERITAGE={value:'Different background'};other.values['trait.0']={value:'Different personality'};
for(const f of H.definitions(first)){H.roll(f,first,()=>.6);H.roll(f,other,()=>.6);assert.equal(first.values[f.id].value,other.values[f.id].value);}
console.log('PASS: criminal history pools, independent truth/record/account, linked outcomes, age/date rules, locks and kept snapshots, unknown migration, stable incident IDs, removal and limits, metadata sanitation, and demographic independence.');
