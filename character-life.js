/* Local education and relationship prompts. References calibrate fictional defaults, not personal predictions. */
(function(root){
'use strict';
const C=root.CharacterCore,D=root.LifeData;
const NONE='None',UNKNOWN='Unknown / not established',NO_CURRENT='Not currently in a relationship';
const sexualText=/\b(?:sex(?:ual)?|lust|erotic|seduc\w*|intercourse|orgasm\w*|fetish\w*|kink\w*|virginity|prostitut\w*)\b/i;
const ratings=['values','communication','financial','sexual','stay'];
const choose=(array,random=Math.random)=>array[Math.min(array.length-1,Math.floor(random()*array.length))];
const int=(lo,hi,random=Math.random)=>lo+Math.floor(random()*(Math.max(lo,hi)-lo+1));
const slot=(s,id)=>s.values[id]||(s.values[id]={value:'',focused:true,locked:false,kept:false,keptValue:''});
const read=(s,id)=>s.values[id]?.value||'';
function age(s){return C.ageAt(read(s,'birthday'),s.settings.storyYear,s.settings.storyDate);}
function ageFloor(s){const value=age(s);return value===null||value<0?null:Math.max(0,value-(s.settings.storyDate?0:1));}
function adult(s){const value=ageFloor(s);return value!==null&&value>=18;}
function available(f,s){if(f.adultOnly||f.kind==='adult')return adult(s);if(f.id==='relationshipDetails.view'&&!adult(s)&&[read(s,f.id),s.values[f.id]?.kept?s.values[f.id].keptValue:''].some(value=>sexualText.test(value||'')))return false;return !f.minAge||(ageFloor(s)!==null&&ageFloor(s)>=f.minAge);}
function definitions(original){
 const result=[],add=(id,label,group,pool,options={})=>result.push({id,label,group,pool,kind:'life',quick:false,...options});
 const edu=(key,label,pool,options)=>add('education.'+key,label,'Education & Training',pool,options);
 edu('level','Overall education',D.educationLevels.map(x=>x.name));
 for(const [key,label]of [['college','College degree subject'],['graduate','Graduate degree subject'],['doctoral','Doctoral degree subject']])edu(key,label,[NONE,UNKNOWN,...D.subjects[key]]);
 edu('current','Current education status',D.studentStatus);edu('trade','Trade / specialty training',D.trades);edu('feeling','How they feel about their education',[...D.educationFeelings,...original.personality.traits]);
 const rel=(key,label,pool,options={})=>add('relationshipDetails.'+key,label,'Relationship details',pool,{minAge:13,...options});
 rel('longest','Longest relationship',null,{duration:true});
 rel('firstSex','Age of first sexual experience',['No sexual experience',UNKNOWN,...Array.from({length:103},(_,i)=>String(i+10))],{historyAge:10});
 rel('firstSerious','Age of first serious relationship',['No serious relationship yet',UNKNOWN,...Array.from({length:108},(_,i)=>String(i+10))],{historyAge:10});
 rel('firstMarriage','Age of first marriage',['Never married',UNKNOWN,...Array.from({length:103},(_,i)=>String(i+18))],{historyAge:18});
 rel('firstDivorce','Age of first divorce',['Never divorced',UNKNOWN,...Array.from({length:103},(_,i)=>String(i+18))],{historyAge:18});
 rel('partners','Number of sexual partners (body count)',[...Array.from({length:11},(_,i)=>String(i)),'Too many to count',UNKNOWN],{adultOnly:true});
 rel('status','Current relationship status',original.background.family_status);
 rel('currentLength','Length of current relationship',null,{duration:true});
 rel('children','Number of children',[...Array.from({length:11},(_,i)=>String(i)),'11 or more',UNKNOWN],{adultOnly:true});
 rel('sexView','Mentality toward sex',D.sexViews,{adultOnly:true});
 rel('perceived','Perceived attractiveness',[...Array.from({length:11},(_,i)=>String(i))],{adultOnly:true,score:true});
 rel('actual','Actual attractiveness (author’s rating)',[...Array.from({length:11},(_,i)=>String(i))],{adultOnly:true,score:true});
 rel('behavior','In relationships, they are',original.personality.traits);
 rel('view','How they view their current relationship',null);
 for(const [key,label]of [['values','Shared values'],['communication','Overall communication'],['financial','Financial compatibility'],['sexual','Sexual compatibility'],['stay','Willingness to stay']])rel('rating.'+key,'Relationship rating · '+label,D.tiers,{adultOnly:key==='sexual'});
 rel('rating.overall','Relationship rating · Overall',null,{kind:'lifeDerived'});
 return result;
}
function level(s){return D.educationLevels.find(x=>x.name===read(s,'education.level'));}
function weighted(rows,random=Math.random){let draw=random()*rows.reduce((sum,x)=>sum+x.weight,0);for(const row of rows){draw-=row.weight;if(draw<0)return row;}return rows[rows.length-1];}
function isNone(value){return !value||value===NONE||value===UNKNOWN;}
function historyAge(value){return /^\d+(?: years?)?$/.test(value)?Number(value.split(' ')[0]):null;}
function reference(s){const a=ageFloor(s);return D.marriage.find(row=>a>=row.minAge&&a<=row.maxAge)||null;}
function maritalKind(value){if(/divorc/i.test(value))return 'divorced';if(/widow/i.test(value))return 'widowed';if(/married|newlywed|marriage/i.test(value))return 'married';return 'other';}
function currentKind(value){if(/^(?:in a (?:long term )?relationship|fracturing relationship|sex only relationship|engaged|married|newlyweds|re-married|arranged marriage)/i.test(value))return 'partnered';if(/^(?:single|ex-partners|divorced|widow)/i.test(value))return 'single';return 'unknown';}
function statusPool(s,original){
 let values=original.background.family_status;
 if(adult(s))values=values.filter(value=>currentKind(value)!=='unknown');
 else values=values.filter(value=>/^(?:single \((?:happy|searching|cynical|heartbroken)\)|in a relationship \(just started dating\)|in a long term relationship|fracturing relationship|ex-partners|friends|childhood friends|best friends)$/i.test(value));
 if(read(s,'relationshipDetails.firstMarriage')==='Never married')values=values.filter(value=>maritalKind(value)==='other');
 return values;
}
const unitHours={hour:1,hours:1,day:24,days:24,week:168,weeks:168,month:730.5,months:730.5,year:8766,years:8766};
function durationHours(value){const match=String(value).match(/^(\d+(?:\.\d+)?)\s+(hours?|days?|weeks?|months?|years?)$/i);return match?Number(match[1])*unitHours[match[2].toLowerCase()]:null;}
function duration(s,units,random=Math.random){const max=Math.max(1,(ageFloor(s)-13)*8766);const choices=units.filter(unit=>unitHours[unit]<=max),unit=choose(choices,random),limit=Math.floor(max/unitHours[unit]);return int(1,Math.min(limit,unit==='hours'?72:unit==='days'?365:unit==='weeks'?104:unit==='months'?120:limit),random)+' '+unit;}
function poisson(mean,random=Math.random){let product=1,n=0;const threshold=Math.exp(-mean);do{n++;product*=Math.max(.000001,random());}while(product>threshold&&n<30);return n-1;}
function generate(f,s,original,random=Math.random){
 if(!available(f,s))return '';
 const a=ageFloor(s);
 if(f.id.startsWith('education.')){
  const key=f.id.slice(10),l=level(s);
  if(a===null)return UNKNOWN;
  if(key==='level')return weighted(D.educationLevels.filter(x=>a>=x.min&&(x.max===undefined||a<=x.max)),random).name;
  if(['college','graduate','doctoral'].includes(key))return l&&l.rank>=({college:1,graduate:3,doctoral:4}[key])?choose(D.subjects[key],random):NONE;
  if(key==='current')return a<18?'Current full-time student':choose(D.studentStatus,random);
  if(key==='trade')return a<16?NONE:random()<.55?NONE:choose(D.trades.filter(x=>x!==NONE),random);
  if(key==='feeling')return random()<.8?choose(D.educationFeelings,random):choose(original.personality.traits,random);
 }
 const key=f.id.slice('relationshipDetails.'.length),first=historyAge(read(s,'relationshipDetails.firstMarriage')),ref=reference(s);
 if(key==='firstSex')return random()<.2?'No sexual experience':String(int(10,Math.min(a,25),random));
 if(key==='firstSerious')return random()<.2?'No serious relationship yet':String(int(13,Math.min(a,30),random));
 if(key==='firstMarriage')return ref&&random()<ref.everPartneredProbability?String(int(18,Math.min(a,45),random)):'Never married';
 if(key==='firstDivorce')return first!==null&&ref&&random()<ref.divorcedAmongEverPartnered?String(int(first,a,random)):'Never divorced';
 if(key==='partners')return read(s,'relationshipDetails.firstSex')==='No sexual experience'?'0':random()<.04?'Too many to count':String(int(1,10,random));
 if(key==='status')return choose(statusPool(s,original),random)||UNKNOWN;
 if(key==='longest')return random()<.12?'No previous relationship':duration(s,['hours','days','years'],random);
 if(key==='currentLength')return currentKind(read(s,'relationshipDetails.status'))==='partnered'?duration(s,['hours','days','weeks','months','years'],random):currentKind(read(s,'relationshipDetails.status'))==='single'?NO_CURRENT:UNKNOWN;
 if(key==='children'){if(random()<.04)return UNKNOWN;const progress=Math.max(0,Math.min(1,(a-18)/27));const count=poisson(D.fertility.value*progress,random);return count>10?'11 or more':String(count);}
 if(key==='sexView')return choose(D.sexViews,random);
 if(f.score)return String(int(0,10,random));
 if(key==='behavior')return choose(original.personality.traits,random);
 if(key==='view')return currentKind(read(s,'relationshipDetails.status'))==='partnered'?choose(original.STORY_DESCRIPTOR.filter(value=>adult(s)||!sexualText.test(value)),random)+' '+choose(original.BASIC_EVENT.filter(value=>adult(s)||!sexualText.test(value)),random):currentKind(read(s,'relationshipDetails.status'))==='single'?NO_CURRENT:UNKNOWN;
 if(key.startsWith('rating.'))return currentKind(read(s,'relationshipDetails.status'))==='partnered'?choose(D.tiers,random):currentKind(read(s,'relationshipDetails.status'))==='single'?'Not applicable — no current relationship':UNKNOWN;
 return choose(f.pool||[UNKNOWN],random);
}
function set(s,id,value){const v=slot(s,id);if(!v.locked)v.value=value;}
function roll(f,s,original){if(slot(s,f.id).locked||f.kind==='lifeDerived')return;slot(s,f.id).value=generate(f,s,original);}
function refresh(s){
 const id='relationshipDetails.rating.overall';if(!s.values[id])return;
 if(ageFloor(s)===null||ageFloor(s)<13){s.values[id].value='';return;}
 if(currentKind(read(s,'relationshipDetails.status'))!=='partnered'){s.values[id].value=currentKind(read(s,'relationshipDetails.status'))==='single'?'Not applicable — no current relationship':UNKNOWN;return;}
 const values=ratings.filter(key=>key!=='sexual'||adult(s)).map(key=>D.tiers.indexOf(read(s,'relationshipDetails.rating.'+key))).filter(value=>value>=0);
 s.values[id].value=values.length?D.tiers[Math.round(values.reduce((sum,value)=>sum+value,0)/values.length)]:UNKNOWN;
}
function reconcile(s,changed,original){
 if(!changed.startsWith('education.')&&!changed.startsWith('relationshipDetails.')&&changed!=='birthday'&&changed!=='all')return;
 const a=ageFloor(s),all=changed==='birthday'||changed==='all',defs=definitions(original);
 const regen=id=>{const f=defs.find(x=>x.id===id);if(f)roll(f,s,original);};
 if(all){for(const f of defs){if(!available(f,s))set(s,f.id,'');else if(!read(s,f.id))regen(f.id);}const l=level(s);if(a!==null&&l&&(a<l.min||(l.max!==undefined&&a>l.max)))regen('education.level');}
 if(/^education\.(college|graduate|doctoral)$/.test(changed)&&!isNone(read(s,changed))){const rank={college:1,graduate:3,doctoral:4}[changed.split('.')[1]];if((level(s)?.rank??-1)<rank)set(s,'education.level',D.educationLevels.find(x=>x.rank===rank).name);}
 if(all||changed.startsWith('education.')){
  const l=level(s);
  if(l)for(const [key,required]of [['college',1],['graduate',3],['doctoral',4]]){
   const id='education.'+key;
   if(changed===id)continue;
   if(l.rank<required)set(s,id,NONE);else if(isNone(read(s,id)))regen(id);
  }
 }
 if(all&&a!==null){for(const f of defs.filter(f=>f.historyAge)){const value=historyAge(read(s,f.id));if(value!==null&&(value>a||value<f.historyAge))regen(f.id);}}
 const marriage='relationshipDetails.firstMarriage',divorce='relationshipDetails.firstDivorce',status='relationshipDetails.status';
 if(changed===marriage||all){const first=historyAge(read(s,marriage)),d=historyAge(read(s,divorce));if(read(s,marriage)==='Never married')set(s,divorce,'Never divorced');else if(first!==null&&d!==null&&d<first)set(s,divorce,String(first));if(read(s,marriage)==='Never married'&&maritalKind(read(s,status))!=='other')regen(status);}
 if(changed===divorce){const d=historyAge(read(s,divorce)),m=historyAge(read(s,marriage));if(d!==null&&(m===null||m>d))set(s,marriage,String(Math.max(18,Math.min(d,25))));}
 if(changed===status||all){
  const kind=maritalKind(read(s,status));if(kind!=='other'&&adult(s)&&historyAge(read(s,marriage))===null)set(s,marriage,String(int(18,Math.min(a,45))));
  if(kind==='divorced'&&adult(s)&&historyAge(read(s,divorce))===null)set(s,divorce,String(int(historyAge(read(s,marriage))||18,a)));
  for(const id of ['currentLength','view',...ratings.map(key=>'rating.'+key)])if(changed===status||currentKind(read(s,status))!=='partnered')regen('relationshipDetails.'+id);
 }
 if(changed==='relationshipDetails.firstSex'||all){
  if(read(s,'relationshipDetails.firstSex')==='No sexual experience')set(s,'relationshipDetails.partners','0');else if(read(s,'relationshipDetails.partners')==='0')set(s,'relationshipDetails.partners',String(int(1,10)));
 }
 if(changed==='relationshipDetails.partners'){
  if(read(s,changed)==='0')set(s,'relationshipDetails.firstSex','No sexual experience');else if(read(s,changed)!==UNKNOWN&&read(s,'relationshipDetails.firstSex')==='No sexual experience'&&adult(s))set(s,'relationshipDetails.firstSex',String(int(18,Math.min(a,25))));
 }
 const max=a===null?0:Math.max(1,(a-13)*8766);
 if(all){for(const id of ['currentLength','longest']){const hours=durationHours(read(s,'relationshipDetails.'+id));if(hours!==null&&hours>max)regen('relationshipDetails.'+id);}}
 const current=durationHours(read(s,'relationshipDetails.currentLength')),longest=durationHours(read(s,'relationshipDetails.longest'));
 if(current!==null&&(longest===null||longest<current))set(s,'relationshipDetails.longest',read(s,'relationshipDetails.currentLength'));
 refresh(s);
}
function edit(f,s,value){
 if(!available(f,s))throw Error('This field is not available for this character’s confirmed age.');
 if(f.id==='relationshipDetails.view'&&!adult(s)&&sexualText.test(value))throw Error('Use a nonsexual relationship viewpoint for a teenage character.');
 if(f.id==='relationshipDetails.status'&&!adult(s)&&!statusPool(s,root.ORIGINAL_ELEMENTS).includes(value))throw Error('Choose an age-appropriate relationship status from the list.');
 if(f.historyAge){const n=historyAge(value);if(n===null&&!f.pool.includes(value))throw Error('Use a listed history state or an age in years.');if(n!==null&&(n<f.historyAge||n>ageFloor(s)))throw Error('Use an age from '+f.historyAge+' to '+ageFloor(s)+'.');}
 if(f.score&&(!/^\d+$/.test(value)||Number(value)>10))throw Error('Use a rating from 0 to 10.');
 if(f.duration){const hours=durationHours(value);if(hours===null&&![NONE,UNKNOWN,NO_CURRENT,'No previous relationship'].includes(value))throw Error('Use a duration such as 3 hours, 2 days, 6 months or 4 years.');if(hours!==null&&(hours<=0||hours>Math.max(1,(ageFloor(s)-13)*8766)))throw Error('That duration exceeds the character’s available relationship timeline.');}
 if(f.id==='relationshipDetails.firstDivorce'){const m=historyAge(read(s,'relationshipDetails.firstMarriage')),d=historyAge(value);if(m!==null&&d!==null&&d<m)throw Error('The first divorce cannot be before the first marriage.');}
 if(f.id==='relationshipDetails.partners'&&!f.pool.includes(value))throw Error('Choose 0–10, Too many to count, or Unknown.');
 if(f.id==='relationshipDetails.children'&&!f.pool.includes(value))throw Error('Choose a listed child count or Unknown.');
 slot(s,f.id).value=value;
}
function warnings(s,group){
 const messages=[],m=historyAge(read(s,'relationshipDetails.firstMarriage')),d=historyAge(read(s,'relationshipDetails.firstDivorce')),a=ageFloor(s);
 if(d!==null&&(m===null||d<m))messages.push('Kept or locked history has a divorce without an earlier marriage. Review these fields.');
 if(a!==null&&[m,d,historyAge(read(s,'relationshipDetails.firstSerious')),adult(s)?historyAge(read(s,'relationshipDetails.firstSex')):null].some(value=>value!==null&&value>a))messages.push('A locked history age is later than the current character age.');
 if(m===null&&maritalKind(read(s,'relationshipDetails.status'))!=='other')messages.push('Current marital status and locked marriage history differ.');
 if(durationHours(read(s,'relationshipDetails.currentLength'))>durationHours(read(s,'relationshipDetails.longest')))messages.push('A locked current relationship is longer than the recorded longest relationship.');
 const l=level(s);if(l)for(const [key,rank]of [['college',1],['graduate',3],['doctoral',4]])if(l.rank<rank&&!isNone(read(s,'education.'+key)))messages.push('A locked '+key+' subject differs from the recorded education level.');
 return group?messages.filter(message=>/subject|education/.test(message)===(group==='Education & Training')):messages;
}
function migrate(s,original){const missing=[],existing={};for(const f of definitions(original))if(!s.values[f.id]){slot(s,f.id);missing.push(f);}else existing[f.id]={...s.values[f.id]};for(const f of missing)roll(f,s,original);if(missing.length){reconcile(s,'all',original);for(const [id,value]of Object.entries(existing))s.values[id]=value;}refresh(s);return s;}
root.CharacterLife={definitions,age,ageFloor,adult,available,pool:statusPool,generate,roll,refresh,reconcile,edit,warnings,migrate,reference,durationHours,historyAge,currentKind,NONE,UNKNOWN};
})(typeof window==='undefined'?globalThis:window);
