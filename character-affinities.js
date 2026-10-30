/* Independent topic relevance and ordinary field-level focus share the same draft. */
(function(root){
'use strict';
const D=root.AffinityData,keys=['animals','supernatural'],pages={animals:'animal-affinity',supernatural:'supernatural-affinity'},labels={animals:'Animal Affinity',supernatural:'Supernatural Affinity'};
const petLimit=8;
function ids(raw){const values=Array.isArray(raw)?raw:[];return [...new Set(values.filter(n=>Number.isInteger(n)&&n>0&&n<=1000000))].slice(0,petLimit);}
function metadata(raw){
 const source=raw&&typeof raw==='object'?raw:{},result={};
 for(const key of keys){const old=source[key]&&typeof source[key]==='object'?source[key]:{};result[key]={active:old.active===true,locked:old.locked===true};}
 const a=source.animals||{};
 for(const period of ['current','childhood']){const list=ids(a[period+'Pets']);result.animals[period+'Pets']=list.length?list:[1];const next=a['next'+period];result.animals['next'+period]=Number.isInteger(next)&&next>Math.max(...result.animals[period+'Pets'])&&next<=1000001?next:Math.max(...result.animals[period+'Pets'])+1;}
 return result;
}
const defaults=()=>metadata();
const slot=(s,id)=>s.values[id]||(s.values[id]={value:'',focused:true,locked:false,kept:false,keptValue:''});
function definitions(s={}){
 const a=metadata(s.affinities).animals,fields=[];
 const add=(id,label,section,pool,options={})=>fields.push({id,label,group:labels[section],kind:'affinity',affinitySection:section,pool,quick:false,...options});
 for(const [key,label]of [['affinity','Animal affinity'],['comfort','Practical comfort around animals'],['basis','What shaped their animal affinity'],['favored','Animal they gravitate toward'],['avoided','Animal they avoid'],['response','How animals tend to respond'],['encounter','Defining animal encounter'],['mindChange','What could change their mind'],['reincarnatedKind','Animal they believe they were'],['currentStatus','Current pet status'],['noPetReason','Why they have no current pet'],['childhoodStatus','Pet growing up / earlier childhood'],['childhoodInfluence','How a childhood pet shaped them']])add('animals.'+key,label,'animals',D.pools['animals.'+key]);
 for(const period of ['current','childhood'])for(const number of a[period+'Pets']){
  const label=period==='current'?'Current pet '+number:'Childhood pet '+number;
  for(const [part,title,pool]of [['kind','Animal / species',D.animalKinds],['name','Name',D.petNames],['bond','Their bond',D.bonds],...(period==='childhood'?[['outcome','What happened afterward',D.childhoodOutcomes]]:[])])add(`animals.${period}Pet${number}.${part}`,label+' · '+title,'animals',pool,{period,pet:number});
 }
 for(const [key,label]of [['affinity','Supernatural affinity'],['focus','Phenomena they think about'],['basis','Basis for their belief or skepticism'],['experience','Their claimed or unexplained experience'],['emotion','How the supernatural makes them feel'],['publicStance','Public versus private stance'],['practice','Practices or precautions'],['identity','What they believe they may be'],['identityMeaning','What that identity means to them'],['truth','Author’s truth'],['mindChange','What could change their mind']])add('supernatural.'+key,label,'supernatural',D.pools['supernatural.'+key]);
 return fields;
}
function active(s,key){return s.affinities?.[key]?.active===true;}
function topicAvailable(s,tab){const key=keys.find(key=>pages[key]===tab);return !key||active(s,key);}
const read=(s,id)=>s.values[id]?.value||'';
function hasPet(s,period){const value=read(s,'animals.'+(period==='current'?'currentStatus':'childhoodStatus'));return !!value&&!/^(?:No current pets|Never had a pet|Unknown|Does not remember)/.test(value);}
function relevant(f,s){
 if(f.kind!=='affinity')return true;
 if(f.period)return hasPet(s,f.period);
 if(f.id==='animals.noPetReason')return read(s,'animals.currentStatus')==='No current pets';
 if(f.id==='animals.childhoodInfluence')return hasPet(s,'childhood');
 if(f.id==='animals.reincarnatedKind')return /reincarnat/i.test(read(s,'animals.affinity'));
 if(['supernatural.identity','supernatural.identityMeaning'].includes(f.id))return D.supernaturalLevels.slice(6).includes(read(s,'supernatural.affinity'))||/origin|past existence|temporary flesh|being/i.test(read(s,'supernatural.affinity'));
 return true;
}
function available(f,s){return f.kind!=='affinity'||active(s,f.affinitySection)&&relevant(f,s);}
function shuffle(s,random=Math.random){s.affinities=metadata(s.affinities);const density=s.settings.focusDensity;for(const key of keys)if(!s.affinities[key].locked)s.affinities[key].active=random()<density;}
function roll(f,s,random=Math.random){const v=slot(s,f.id);if(!v.locked)v.value=f.pool[Math.min(f.pool.length-1,Math.floor(random()*f.pool.length))];}
// Stable initialization lets an older draft and its matching undo entry migrate alike.
// Actual character generation and explicit rerolls still use Math.random().
function initialRandom(s,id){let seed=2166136261;for(const c of [s.name||'',read(s,'birthday'),s.settings.storyDate||s.settings.storyYear,id].join('|')){seed^=c.codePointAt(0);seed=Math.imul(seed,16777619);}return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function migrate(s,random=null){s.affinities=metadata(s.affinities);for(const f of definitions(s))if(!s.values[f.id]){const draw=random||initialRandom(s,f.id);slot(s,f.id);roll(f,s,draw);s.values[f.id].focused=draw()<(s.settings.focusDensity??.6);}return s;}
function toggle(s,key){if(!keys.includes(key))throw Error('Unknown affinity section.');s.affinities=metadata(s.affinities);s.affinities[key].active=!s.affinities[key].active;}
function lock(s,key){if(!keys.includes(key))throw Error('Unknown affinity section.');s.affinities=metadata(s.affinities);s.affinities[key].locked=!s.affinities[key].locked;}
function addPet(s,period){
 if(!['current','childhood'].includes(period))throw Error('Choose current or childhood pets.');
 migrate(s);const a=s.affinities.animals,list=a[period+'Pets'];if(list.length>=petLimit)throw Error('Keep up to eight '+period+' pets.');
 const parent=slot(s,'animals.'+(period==='current'?'currentStatus':'childhoodStatus'));
 if(!hasPet(s,period)){if(parent.locked)throw Error('Unlock the pet status before adding a pet.');parent.value=period==='current'?'Has a pet / pets':'Had a pet / pets growing up';}
 let id=a['next'+period];if(id>1000000){id=1;while(list.includes(id))id++;}list.push(id);a['next'+period]=id+1;migrate(s);return id;
}
function removePet(s,period,id){
 if(!['current','childhood'].includes(period))throw Error('Choose current or childhood pets.');
 const a=s.affinities.animals,list=a[period+'Pets'];if(!list.includes(id))return;if(list.length===1)throw Error('Keep one pet record, or change the pet status to None.');
 const fields=definitions(s).filter(f=>f.period===period&&f.pet===id);if(fields.some(f=>s.values[f.id]?.locked))throw Error('Unlock this pet’s details before removing the record.');
 a[period+'Pets']=list.filter(n=>n!==id);for(const f of fields)delete s.values[f.id];
}
function fieldSection(f){if(f.period)return f.period==='current'?'Current pets':'Growing up with pets';return f.id==='animals.currentStatus'||f.id==='animals.noPetReason'?'Current pets':f.id==='animals.childhoodStatus'||f.id==='animals.childhoodInfluence'?'Growing up with pets':f.affinitySection==='animals'?'Animal outlook':['supernatural.identity','supernatural.identityMeaning','supernatural.truth'].includes(f.id)?'Identity & story truth':'Belief & experience';}
root.Affinities={keys,pages,labels,petLimit,defaults,metadata,definitions,slot,active,topicAvailable,hasPet,relevant,available,shuffle,roll,migrate,toggle,lock,addPet,removePet,fieldSection};
})(typeof window==='undefined'?globalThis:window);
