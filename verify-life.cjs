'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let seed=10627;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const math=Object.create(Math);math.random=random;
const scope={Math:math,Date,Intl,JSON};scope.window=scope;vm.createContext(scope);
for(const file of ['original-data.js','additions.js','core.js','life-data.js','character-life.js','guided-builder.js'])vm.runInContext(fs.readFileSync(file,'utf8'),scope,{filename:file});
const C=scope.CharacterCore,F=scope.CharacterLife,D=scope.LifeData,O=scope.ORIGINAL_ELEMENTS,B=scope.GuidedBuilder,defs=F.definitions(O),field=id=>defs.find(f=>f.id===id),clone=x=>JSON.parse(JSON.stringify(x));
function state(age){const s={settings:{storyYear:2026,storyDate:'2026-10-27',ageRange:'Adult'},values:{birthday:{value:String(2026-age).padStart(4,'0')+'-01-01'}}};return F.migrate(s,O);}
function edit(s,id,value){F.edit(field(id),s,value);F.reconcile(s,id,O);}
function reroll(s){for(const f of defs)F.roll(f,s,O);F.reconcile(s,'all',O);}
const species={};for(let i=0;i<10000;i++){const value=C.speciesValue(O,()=>(i+.5)/10000);species[value]=(species[value]||0)+1;}
assert.equal(species.Human,9000);for(const value of O.basic.race.filter(v=>v!=='Human'))assert.equal(species[value],500);
const api={state:state(35),fields:C.definitions(O,scope.EXTRA_ELEMENTS),original:O};B.migrate(api.state);
for(let i=0;i<100;i++)assert.equal(B.generate(api,'identity',null,()=>.5).ingredients.find(x=>x.fieldId==='basic.race').value,'Human');
assert.equal(defs.filter(f=>f.group==='Education & Training').length,7);assert.equal(new Set(defs.map(f=>f.id)).size,defs.length);
assert.deepEqual(clone(field('relationshipDetails.status').pool),clone(O.background.family_status));
for(const age of [0,5,12,13,16,17,18,19,25,45,80,120]){
 const s=state(age);
 for(let i=0;i<100;i++){
  reroll(s);const level=D.educationLevels.find(x=>x.name===s.values['education.level'].value);
  assert(level.min<=age&&(level.max===undefined||age<=level.max));
  for(const [key,rank]of [['college',1],['graduate',3],['doctoral',4]])assert(level.rank>=rank?D.subjects[key].includes(s.values['education.'+key].value):s.values['education.'+key].value==='None');
  for(const f of defs){
   const value=s.values[f.id].value;
   if(!F.available(f,s)){assert.equal(value,'','Unavailable field '+f.id+' at age '+age);continue;}
   if(f.historyAge&&F.historyAge(value)!==null)assert(F.historyAge(value)>=f.historyAge&&F.historyAge(value)<=age);
   if(f.score)assert(Number(value)>=0&&Number(value)<=10);
  }
  const m=F.historyAge(s.values['relationshipDetails.firstMarriage'].value),d=F.historyAge(s.values['relationshipDetails.firstDivorce'].value);
  if(d!==null)assert(m!==null&&m<=d);
  const current=F.durationHours(s.values['relationshipDetails.currentLength'].value),longest=F.durationHours(s.values['relationshipDetails.longest'].value);
  if(current!==null)assert(longest!==null&&longest>=current);
  if(age>=18&&s.values['relationshipDetails.firstSex'].value==='No sexual experience')assert.equal(s.values['relationshipDetails.partners'].value,'0');
  if(age>=13&&age<18)assert(F.pool(s,O).includes(s.values['relationshipDetails.status'].value));
 }
}
const s=state(40);
edit(s,'education.level','Doctoral degree');for(const key of ['college','graduate','doctoral'])assert(D.subjects[key].includes(s.values['education.'+key].value));
edit(s,'education.level','High school dropout');for(const key of ['college','graduate','doctoral'])assert.equal(s.values['education.'+key].value,'None');
edit(s,'education.graduate','Public health');assert.equal(D.educationLevels.find(x=>x.name===s.values['education.level'].value).rank,3);
edit(s,'education.graduate',F.UNKNOWN);assert.equal(s.values['education.graduate'].value,F.UNKNOWN);
Object.assign(s.values['education.doctoral'],{value:'History',locked:true,kept:true,keptValue:'Original accepted History'});edit(s,'education.level','High school diploma');assert.equal(s.values['education.doctoral'].value,'History');assert(F.warnings(s).some(w=>w.includes('doctoral')));assert.equal(s.values['education.doctoral'].keptValue,'Original accepted History');
edit(s,'relationshipDetails.firstMarriage','25');edit(s,'relationshipDetails.firstDivorce','30');assert.throws(()=>edit(s,'relationshipDetails.firstDivorce','24'),/before/);edit(s,'relationshipDetails.firstMarriage','Never married');assert.equal(s.values['relationshipDetails.firstDivorce'].value,'Never divorced');
edit(s,'relationshipDetails.status','Married (happily)');assert(F.historyAge(s.values['relationshipDetails.firstMarriage'].value)>=18);
edit(s,'relationshipDetails.currentLength','10 years');assert(F.durationHours(s.values['relationshipDetails.longest'].value)>=F.durationHours('10 years'));
for(const value of ['-1 years','100 years','0 hours','banana'])assert.throws(()=>edit(s,'relationshipDetails.currentLength',value));
edit(s,'relationshipDetails.firstSex','No sexual experience');assert.equal(s.values['relationshipDetails.partners'].value,'0');edit(s,'relationshipDetails.partners','Too many to count');assert(F.historyAge(s.values['relationshipDetails.firstSex'].value)>=18);edit(s,'relationshipDetails.partners','0');assert.equal(s.values['relationshipDetails.firstSex'].value,'No sexual experience');
for(const [id,value]of [['actual','11'],['partners','100'],['children','-1'],['firstSex','17'],['firstMarriage','50']])assert.throws(()=>edit(s,'relationshipDetails.'+id,value));
for(const key of ['values','communication','financial','sexual','stay'])edit(s,'relationshipDetails.rating.'+key,'S-tier');assert.equal(s.values['relationshipDetails.rating.overall'].value,'S-tier');
edit(s,'relationshipDetails.status','Single (happy)');assert.match(s.values['relationshipDetails.rating.overall'].value,/Not applicable/);assert.equal(s.values['relationshipDetails.currentLength'].value,'Not currently in a relationship');
const teenager=state(17);edit(teenager,'relationshipDetails.status','In a relationship (just started dating)');for(let i=0;i<2000;i++){const value=F.generate(field('relationshipDetails.view'),teenager,O,random);assert(!/\blust\b|seduc/i.test(value));}
assert.throws(()=>edit(teenager,'relationshipDetails.status','Sex only relationship'),/age-appropriate/);assert.throws(()=>edit(teenager,'relationshipDetails.firstSex','18'),/not available/);assert.equal(F.available({kind:'adult'},teenager),false);
teenager.values.birthday.value='2008-10-28';assert.equal(F.adult(teenager),false);teenager.values.birthday.value='2008-10-27';assert.equal(F.adult(teenager),true);teenager.settings.storyDate='';assert.equal(F.adult(teenager),false);teenager.values.birthday.value='2007-10-27';assert.equal(F.adult(teenager),true);
const before=clone(s);F.migrate(s,O);assert.deepEqual(clone(s),before);delete s.values['education.current'];const preserved=clone(s.values);F.migrate(s,O);for(const [id,value]of Object.entries(preserved))assert.deepEqual(clone(s.values[id]),value);assert(s.values['education.current'].value);
for(const row of D.marriage){const ever=row.married+row.civilPartnered+(row.divorced||0)+(row.widowed||0);assert(Math.abs(row.everPartneredProbability-ever/(ever+row.never))<1e-12);assert(Math.abs(row.divorcedAmongEverPartnered-(row.divorced||0)/ever)<1e-12);}
let total=0,known=0,unknown=0;const mature=state(55),children=field('relationshipDetails.children');for(let i=0;i<30000;i++){const v=F.generate(children,mature,O,random);if(v===F.UNKNOWN){unknown++;continue;}total+=v==='11 or more'?11:Number(v);known++;}assert(Math.abs(total/known-2.25)<.05);assert(Math.abs(unknown/30000-.04)<.01);
for(const [age,draw,expected]of [[20,.01,true],[20,.03,false],[35,.49,true],[35,.51,false],[55,.8,true],[55,.82,false],[80,.92,true],[80,.94,false]]){const value=F.generate(field('relationshipDetails.firstMarriage'),state(age),O,()=>draw);assert.equal(value!=='Never married',expected);}
console.log('PASS: 90/5/5 species weighting; guided identity weighting; education progression and subjects; source-backed marriage probability boundaries; fictional child-count distribution; age and duration consistency; edits/locks/kept snapshots; adult-only gating and birthday boundaries; safe teen status pools; migration preservation.');
