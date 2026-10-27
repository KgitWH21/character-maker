/* Editable fictional story prompts; weights are authoring choices, not crime statistics. */
(function(root){
'use strict';
const UNKNOWN='Unknown / not established',NONE='None',NO_HISTORY='No criminal history',GROUP='Criminal history';
const list=text=>text.split('|'),choices=text=>[NONE,UNKNOWN,...list(text)];
const pools={
 history:[NO_HISTORY,'Isolated incident','Repeated involvement','Ongoing activity',UNKNOWN],
 pattern:choices('One bad decision|Occasional opportunism|Former way of life|Current livelihood'),
 offense:choices('Theft|Fraud|Forgery|Trespassing|Smuggling|Bribery|Vandalism|Assault|Robbery|Extortion|Obstruction of an investigation|Possession of prohibited goods|Political dissent criminalized by the authorities|Violation of a fictional local prohibition'),
 place:choices('Their hometown|Another town|A workplace|A border crossing|A public gathering|A private residence|An institution|A place they refuse to name'),
 role:choices('Acted alone|Accomplice|Organizer|Reluctant participant|Unknowing intermediary|Falsely identified suspect|Bystander drawn into the case'),
 truth:choices('Responsible for the act|Complicit in part of it|Acted under coercion|Unknowingly involved|Innocent of the accusation|Deliberately ambiguous'),
 account:choices('Admits what happened|Minimizes their involvement|Claims it was a misunderstanding|Insists they were framed|Tells different people different versions|Refuses to discuss it|Has never told anyone'),
 motive:choices('Desperation|Loyalty|Profit|Revenge|Ideology|Coercion|Recklessness'),
 feeling:choices('Regret|Pride|Shame|Resentment|Denial|Indifference|Determination to make amends|Conflicted feelings'),
 effects:choices('Lost an opportunity|Damaged a relationship|Still owes a debt|Retains useful contacts|Changed their daily habits|Has a damaged reputation|Has an unfinished obligation|Found support and a new direction'),
 justified:choices('Believed they had no other choice|Believed loyalty mattered more than the rules|Believed the gain outweighed the harm|Believed revenge was deserved|Believed the cause justified it|Told themselves they were only following orders|Assumed nobody would be hurt|Never believed it was justified'),
 refuse:choices('Will not hurt a bystander|Will not betray a friend|Will not involve children|Will not steal from someone struggling|Will not act for money again|Will not keep protecting the organizer|Has not established a firm boundary'),
 return:choices('A loved one is threatened|A debt becomes impossible to ignore|An old associate asks for help|A chance to make amends|A promise of financial security|The same cause calls again|Insists nothing could draw them back'),
 accomplice:choices('An old friend who shared responsibility|A former partner who knows the truth|An associate who took a different path'),
 harmed:choices('Someone still waiting for restitution|A stranger whose life was disrupted|Someone they already knew|Someone who has accepted an apology'),
 investigator:choices('An investigator who doubts the official story|An investigator who remembers them|An investigator still pursuing the case'),
 lawyer:choices('A lawyer who helped them through the case|A former representative they still trust|A representative with unfinished questions'),
 informant:choices('An associate who supplied information|Someone whose identity remains unknown|Someone they wrongly suspect of informing'),
 helper:choices('A relative who offered a place to stay|A friend who helped them rebuild|A mentor who offered a second chance|A stranger who believed their account'),
 knows:choices('Public knowledge|Close family only|Employer unaware|Someone knows a distorted version|Only the character knows|A small circle knows the truth'),
 thread:choices('Restitution unfinished|Evidence resurfaces|Someone seeks an apology|An old associate returns|A witness challenges the accepted story|An obligation they thought was settled returns')
};
const records=[
 {name:'No official record',consequence:[NONE],status:['No active proceedings']},
 {name:'Suspected; never arrested',consequence:[NONE],status:['No active proceedings','Investigation unresolved']},
 {name:'Arrested; never charged',consequence:[NONE],status:['Released; no active proceedings']},
 {name:'Charged; awaiting proceedings',consequence:['No sentence imposed'],status:['Awaiting proceedings']},
 {name:'Charges dropped',consequence:['No sentence imposed'],status:['Case resolved']},
 {name:'Acquitted',consequence:['No sentence imposed'],status:['Case resolved']},
 {name:'Convicted',consequence:['Fine','Restitution','Community service','Supervision','Incarceration','Exile','Loss of position'],status:['Serving a sentence','Sentence completed','Recently released']},
 {name:'Record sealed',consequence:[UNKNOWN,'Fine','Restitution','Community service','Supervision','Incarceration'],status:['Case resolved']},
 {name:'Wanted by the authorities',consequence:['No sentence established'],status:['Wanted; unresolved case']}
];
pools.record=[NONE,UNKNOWN,...records.map(r=>r.name)];
pools.consequence=[...new Set([NONE,UNKNOWN,...records.flatMap(r=>r.consequence)])];
pools.status=[...new Set([NONE,UNKNOWN,...records.flatMap(r=>r.status)])];
function metadata(raw){
 const ids=raw?.incidents;
 return {incidents:Array.isArray(ids)?[...new Set(ids.filter(id=>Number.isInteger(id)&&id>0&&id<=1000000))].slice(0,20):[1]};
}
function definitions(s){
 const out=[],add=(key,label,pool,extra={})=>out.push({id:'criminal.'+key,label,group:GROUP,kind:'criminal',quick:false,pool,...extra});
 add('history','History overview',pools.history);add('pattern','Pattern of involvement',pools.pattern);
 for(const n of metadata(s?.criminalHistory).incidents){
  const incident=(key,label,pool,extra)=>add(`incident${n}.${key}`,`Incident ${n} · ${label}`,pool,{incident:n,key,...extra});
  for(const [key,label]of [['offense','Offense / accusation'],['age','Age when it happened'],['place','Location'],['role','Their role'],['truth','What actually happened'],['record','Official record'],['account','What they tell people'],['consequence','Sentence / official consequence'],['status','Present situation'],['motive','Motive and circumstances'],['feeling','How they feel about it'],['effects','Lasting effects'],['justified','What they justified then'],['refuse','What they refuse to do now'],['return','What could draw them back'],['accomplice','Accomplice'],['harmed','Person harmed'],['investigator','Investigator'],['lawyer','Lawyer'],['informant','Informant'],['helper','Someone who helped afterward'],['knows','Who knows'],['thread','Unresolved thread']])incident(key,label,key==='age'?[NONE,UNKNOWN]:pools[key]);
 }
 return out;
}
const read=(s,id)=>s.values[id]?.value||'';
const slot=(s,id)=>s.values[id]||(s.values[id]={value:'',focused:true,locked:false,kept:false,keptValue:''});
const choose=(pool,random)=>pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];
function maxAge(s){const a=root.CharacterCore.ageAt(read(s,'birthday'),s.settings.storyYear,s.settings.storyDate);return a===null||a<0?null:Math.max(0,a-(s.settings.storyDate?0:1));}
function generate(f,s,random=Math.random){
 const history=read(s,'criminal.history'),a=maxAge(s);
 if(f.id==='criminal.history')return a===null?UNKNOWN:a<8?NO_HISTORY:choose([NO_HISTORY,NO_HISTORY,NO_HISTORY,...(metadata(s.criminalHistory).incidents.length>1?['Repeated involvement','Repeated involvement']:['Isolated incident','Isolated incident']),'Repeated involvement','Ongoing activity',UNKNOWN],random);
 if(history===UNKNOWN||!history)return UNKNOWN;
 if(history===NO_HISTORY)return NONE;
 if(f.id==='criminal.pattern')return ({'Isolated incident':'One bad decision','Repeated involvement':choose(['Occasional opportunism','Former way of life'],random),'Ongoing activity':'Current livelihood'})[history]||choose(pools.pattern,random);
 const base=`criminal.incident${f.incident}.`,record=records.find(r=>r.name===read(s,base+'record'));
 if(f.key==='age')return a===null?UNKNOWN:String(Math.min(8,a)+Math.floor(random()*(a-Math.min(8,a)+1)));
 if(f.key==='consequence'||f.key==='status')return record?choose(record[f.key],random):read(s,base+'record')===NONE?NONE:UNKNOWN;
 if(['truth','motive','justified'].includes(f.key)&&['Falsely identified suspect','Bystander drawn into the case'].includes(read(s,base+'role')))return f.key==='truth'?'Innocent of the accusation':NONE;
 if(['motive','justified'].includes(f.key)&&read(s,base+'truth')==='Innocent of the accusation')return NONE;
 return choose(['offense','role','truth','record'].includes(f.key)?f.pool.filter(v=>v!==NONE&&v!==UNKNOWN):f.pool,random);
}
function roll(f,s,random=Math.random){if(!slot(s,f.id).locked)slot(s,f.id).value=generate(f,s,random);}
function reconcile(s,changed){
 if(!changed.startsWith('criminal.')&&!['birthday','all'].includes(changed))return;
 const defs=definitions(s),reroll=id=>{const f=defs.find(f=>f.id===id);if(f)roll(f,s);};
 if(changed==='criminal.history')for(const f of defs)if(f.id!==changed)roll(f,s);
 const match=changed.match(/^(criminal\.incident\d+\.)(record|role|truth)$/);
 if(match){const [ ,base,key]=match;for(const suffix of key==='record'?['consequence','status']:key==='role'?['truth','motive','justified']:['motive','justified'])reroll(base+suffix);}
 const a=maxAge(s);
 for(const f of defs.filter(f=>f.key==='age')){const value=read(s,f.id);if(/^\d+$/.test(value)&&a!==null&&Number(value)>a)roll(f,s);}
}
function edit(f,s,value){
 if(f.key==='age'&&![NONE,UNKNOWN].includes(value)){
  const a=maxAge(s);if(!/^\d+$/.test(value)||a===null||Number(value)>a)throw Error('Use None, Unknown / not established, or an age from 0 to '+(a??'the established character age')+'.');
 }
 slot(s,f.id).value=value;
}
function migrate(s){s.criminalHistory=metadata(s.criminalHistory);for(const f of definitions(s))if(!s.values[f.id])slot(s,f.id).value=UNKNOWN;return s;}
function add(s){migrate(s);if(s.criminalHistory.incidents.length>=20)throw Error('Keep up to 20 incidents per character.');let id=Math.max(0,...s.criminalHistory.incidents)+1;if(id>1000000){id=1;while(s.criminalHistory.incidents.includes(id))id++;}s.criminalHistory.incidents.push(id);migrate(s);return id;}
function remove(s,id){
 const defs=definitions(s).filter(f=>f.incident===id);if(defs.some(f=>s.values[f.id]?.locked))throw Error('Unlock this incident’s fields before removing it.');
 s.criminalHistory.incidents=s.criminalHistory.incidents.filter(n=>n!==id);for(const f of defs)delete s.values[f.id];
 s.quickFields=s.quickFields?.filter(id=>!defs.some(f=>f.id===id))??null;
}
function warnings(s){
 const out=[],a=maxAge(s),defs=definitions(s);
 if(read(s,'criminal.history')==='Isolated incident'&&metadata(s.criminalHistory).incidents.filter(id=>![NONE,UNKNOWN,''].includes(read(s,`criminal.incident${id}.offense`))).length>1)out.push('An isolated incident is selected, but multiple incidents have an offense or accusation. Review the overview or incident details.');
 if(read(s,'criminal.history')===NO_HISTORY&&defs.some(f=>f.incident&&![NONE,UNKNOWN,''].includes(read(s,f.id))))out.push('No criminal history is selected, but incident details remain. Review the preserved details.');
 for(const id of metadata(s.criminalHistory).incidents){const base=`criminal.incident${id}.`,value=read(s,base+'age'),record=records.find(r=>r.name===read(s,base+'record'));
  if(/^\d+$/.test(value)&&(a===null||Number(value)>a))out.push(`Incident ${id}: the preserved age is outside the established character timeline.`);
  if(record)for(const key of ['consequence','status'])if(![NONE,UNKNOWN,'',...record[key]].includes(read(s,base+key)))out.push(`Incident ${id}: the official record and ${key==='status'?'present situation':'consequence'} differ. Review custom or locked details.`);
 }
 return out;
}
root.CriminalHistory={UNKNOWN,NONE,NO_HISTORY,GROUP,pools,records,metadata,definitions,maxAge,generate,roll,reconcile,edit,migrate,add,remove,warnings};
})(typeof window==='undefined'?globalThis:window);
