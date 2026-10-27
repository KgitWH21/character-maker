/* Canvas selection uses existing field values and Keep flags. No generator data lives here. */
(function(root){
'use strict';
const foundation=['birthday','basic.gender','CHARACTER_NATIONAL_HERITAGE'];
// Each eligible group receives one ticket in Surprise me, regardless of its field count.
const categories=[
 {id:'personality',label:'Personality & background',matches:f=>['Personality','Background','Formative experiences','Relationships','Voice & behavior'].includes(f.group)},
 {id:'appearance',label:'Appearance',matches:f=>f.group==='Appearance'},
 {id:'education',label:'Education & Training',matches:f=>f.group==='Education & Training'},
 {id:'relationship-details',label:'Relationship details',matches:f=>f.group==='Relationship details'},
 {id:'criminal-history',label:'Criminal history',matches:f=>f.kind==='criminal'},
 {id:'medical',label:'Medical',matches:f=>f.group==='Medical'},
 {id:'dialogue',label:'Dialogue',matches:f=>f.kind==='dialogue'&&!f.wildcard||f.id==='CHARACTER_SPEECH'},
 {id:'right-now',label:'Right Now',matches:f=>f.kind==='rightNow'},
 {id:'symbolism',label:'Symbolism & wildcards',matches:f=>['Birthday & symbolism','Tarot & story sparks'].includes(f.group)||f.wildcard},
 {id:'other',label:'Other character details',matches:f=>!categories.slice(0,-1).some(c=>c.matches(f))}
];
function availableCategories(fields){return categories.filter(c=>fields.some(f=>!foundation.includes(f.id)&&c.matches(f)));}
function defaults(category='surprise'){return {category,seen:[],includeFaded:false,candidateId:null,suggesting:false};}
function migrate(s,fields){const old=s.canvas||{},ids=new Set(fields.map(f=>f.id));s.canvas={
 category:['surprise',...availableCategories(fields).map(c=>c.id)].includes(old.category)?old.category:'surprise',
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
root.CharacterCanvas={foundation,categories,availableCategories,defaults,migrate,eligible,categoryFor,status,offer,validateCandidate,resetCycle};
})(typeof window==='undefined'?globalThis:window);
