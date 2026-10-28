/* Canvas selection uses existing field values and Keep flags. No generator data lives here. */
(function(root){
'use strict';
const foundation=['birthday','basic.gender','CHARACTER_NATIONAL_HERITAGE'];
const family=['background.family_status','mother','father'];
const personalityTexture=['contradiction','specific_dislike','recurring_dream','tiny_ritual','unexpected_pleasure'].map(id=>'extra.'+id);
const possessions=['useless_expertise','collection','signature_possession'].map(id=>'extra.'+id);
// One shared map drives detail pages, Explore links, and equally weighted candidate categories.
const pages=[
 {id:'identity',label:'Identity & Naming',description:'Their name, origins, languages, and identity',help:'Explore who they are, where they come from, and the languages they use.',matches:f=>['Identity','Naming'].includes(f.group)&&f.id!=='basic.attracted to'},
 {id:'appearance',label:'Physical Appearance',description:'Their visible features',help:'Choose a physical detail that makes them recognizable.',matches:f=>f.group==='Appearance'},
 {id:'personality',label:'Personality & Behavior',description:'Traits, values, habits, and reactions',help:'Explore what matters to them and how it shows in their everyday behavior.',matches:f=>['Personality','Voice & behavior'].includes(f.group)||personalityTexture.includes(f.id)},
 {id:'background',label:'Background & Past',description:'Work, upbringing, and formative experiences',help:'Discover an experience or circumstance that helped shape who they are.',matches:f=>f.group==='Background'&&!family.includes(f.id)||f.group==='Formative experiences'||f.id==='extra.childhood_belief'},
 {id:'skills',label:'Skills & Possessions',description:'What they can do and what they carry',help:'Choose a skill, ability, or possession that matters in their story.',matches:f=>f.group==='Abilities & equipment'||possessions.includes(f.id)},
 {id:'symbolism',label:'Symbolism & Story Sparks',description:'Beliefs, birthdays, tarot, and story ideas',help:'Explore a symbol, superstition, or story seed that resonates with them.',matches:f=>['Birthday & symbolism','Tarot & story sparks'].includes(f.group)},
 {id:'relationship-details',label:'Relationships & Family',description:'Family, connections, romance, and history',sectionOrder:['Family & parental figures','Allies, enemies & organizations','Current relationship','Relationship history & milestones','Compatibility ratings','Attraction & intimacy'],help:'Explore their family, allies, enemies, or intimate relationship history.',matches:f=>['Relationship details','Relationships'].includes(f.group)||family.includes(f.id)||f.id==='basic.attracted to'},
 {id:'medical',label:'Medical',description:'Health, measurements, and meals',help:'Explore a physical detail that could affect their daily routines, choices, or comfort.',matches:f=>f.group==='Medical'},
 {id:'education',label:'Education & Training',description:'Learning and practical training',help:'Discover what they learned, how they learned it, and how they feel about that path.',matches:f=>f.group==='Education & Training'},
 {id:'criminal-history',label:'Criminal History',description:'Events, records, and consequences',help:'Explore what happened, what is on the record, and what still follows them.',matches:f=>f.kind==='criminal'},
 {id:'dialogue',label:'Voice & Dialogue',description:'Voice, speech habits, and optional challenges',help:'Choose a voice or conversational habit. Imagine how they would ask someone for what they want.',matches:f=>f.kind==='dialogue'||f.id==='CHARACTER_SPEECH'},
 {id:'now',label:'Right Now',description:'A moment in their life',help:'Picture them somewhere specific. Choose what they are doing, thinking, or about to do.',matches:f=>f.kind==='rightNow'}
];
const categories=pages;
function pageFor(f){return pages.find(page=>page.matches(f));}
function snapshot(s,fields,isAllowed=()=>true,random=Math.random){
 const available=fields.filter(f=>s.values[f.id]&&isAllowed(f)&&(!f.wildcard||(s.settings.dialogueWildcards&&(!f.id.endsWith('2')||s.settings.dialogueCombine))));
 const modules=pages.map(page=>available.filter(page.matches)).filter(pool=>pool.length),selected=[];
 while(modules.length&&selected.length<6){const pool=modules.splice(Math.floor(random()*modules.length),1)[0];selected.push(pool[Math.floor(random()*pool.length)].id);}
 return selected;
}
function sectionFor(f){
 const page=pageFor(f)?.id;
 if(page==='identity')return f.group==='Naming'?'Naming':'Identity & origins';
 if(page==='appearance')return 'Physical appearance';
 if(page==='personality')return f.group==='Personality'?'Traits, values & motivations':f.group==='Voice & behavior'?'Social behavior & reactions':'Habits & personal texture';
 if(page==='background')return f.group==='Background'?'Background & circumstances':'Formative experiences';
 if(page==='skills')return f.group==='Abilities & equipment'?'Skills, abilities & equipment':'Expertise & personal possessions';
 if(page==='relationship-details'){
  if(family.includes(f.id))return 'Family & parental figures';
  if(f.group==='Relationships')return 'Allies, enemies & organizations';
  if(['longest','firstSerious','firstMarriage','firstDivorce','children'].some(key=>f.id==='relationshipDetails.'+key))return 'Relationship history & milestones';
  if(f.id.startsWith('relationshipDetails.rating.'))return 'Compatibility ratings';
  if(['basic.attracted to','SEX_KINK',...['firstSex','partners','sexView','perceived','actual'].map(key=>'relationshipDetails.'+key)].includes(f.id))return 'Attraction & intimacy';
  return 'Current relationship';
 }
 return f.group;
}
function availableCategories(fields){return categories.filter(c=>fields.some(f=>!foundation.includes(f.id)&&c.matches(f)));}
function defaults(category='surprise'){return {category,seen:[],includeFaded:false,candidateId:null,suggesting:false};}
function migrate(s,fields){const old=s.canvas||{},ids=new Set(fields.map(f=>f.id));let category=old.category==='right-now'?'now':old.category;
 const candidate=fields.find(f=>f.id===old.candidateId);
 if(category==='other')category=candidate?pageFor(candidate)?.id:'identity';
 if(candidate&&category!=='surprise'&&pages.some(page=>page.id===category)&&!pages.find(page=>page.id===category).matches(candidate))category=pageFor(candidate)?.id;
 s.canvas={
 category:['surprise',...availableCategories(fields).map(c=>c.id)].includes(category)?category:'surprise',
 seen:Array.isArray(old.seen)?[...new Set(old.seen.filter(id=>typeof id==='string'&&ids.has(id)))].slice(0,fields.length):[],
 includeFaded:old.includeFaded===true,candidateId:ids.has(old.candidateId)?old.candidateId:null,suggesting:old.suggesting===true
 };return s;}
function eligible(f,s,isAllowed=()=>true){return !foundation.includes(f.id)&&!!s.values[f.id]&&!s.values[f.id].kept&&isAllowed(f)&&(!f.wildcard||(s.settings.dialogueWildcards&&(!f.id.endsWith('2')||s.settings.dialogueCombine)));}
function categoryFor(f){return categories.find(c=>c.matches(f));}
function status(s,fields,isAllowed){const c=s.canvas,pool=fields.filter(f=>eligible(f,s,isAllowed)&&(c.category==='surprise'||categoryFor(f)?.id===c.category));
 if(!pool.length)return {kind:'empty',fields:[],message:'No eligible characteristics remain in this category. Choose another category or explore the section.'};
 const remaining=pool.filter(f=>!c.seen.includes(f.id));
 if(!remaining.length)return {kind:'cycle',fields:[],message:'You’ve considered every eligible field in this suggestion cycle. Start a new cycle, shuffle focus, or choose another category.'};
 const preferred=remaining.filter(f=>c.includeFaded||s.values[f.id].focused);
 if(!preferred.length)return {kind:'focus',fields:[],message:'The remaining candidates are faded. Shuffle focus or include the remaining faded candidates.'};
 return {kind:'ready',fields:preferred};
}
function offer(s,fields,isAllowed,random=Math.random){const result=status(s,fields,isAllowed);s.canvas.suggesting=true;s.canvas.candidateId=null;if(result.kind!=='ready')return result;
 const groups=availableCategories(result.fields).filter(c=>result.fields.some(f=>c.matches(f))),group=s.canvas.category==='surprise'?groups[Math.floor(random()*groups.length)]:categories.find(c=>c.id===s.canvas.category);
 const pool=result.fields.filter(f=>group.matches(f)),f=pool[Math.floor(random()*pool.length)];s.canvas.candidateId=f.id;s.canvas.seen.push(f.id);return {kind:'candidate',field:f};
}
function validateCandidate(s,fields,isAllowed){const previous=s.canvas.candidateId,f=fields.find(f=>f.id===previous);if(!f||!eligible(f,s,isAllowed)||(s.canvas.category!=='surprise'&&categoryFor(f)?.id!==s.canvas.category)){s.canvas.candidateId=null;if(previous)s.canvas.suggesting=false;return null;}return f;}
function resetCycle(s){s.canvas.seen=[];s.canvas.includeFaded=false;}
root.CharacterCanvas={foundation,pages,pageFor,snapshot,sectionFor,categories,availableCategories,defaults,migrate,eligible,categoryFor,status,offer,validateCandidate,resetCycle};
})(typeof window==='undefined'?globalThis:window);
