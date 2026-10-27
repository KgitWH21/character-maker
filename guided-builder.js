/* Composed story prompts. Ingredients retain their field IDs and original pool text. */
(function(root){
'use strict';
const keys=['identity','motivation','obstacle'];
const titles={identity:'Who are they?',motivation:'What do they want?',obstacle:'What gets in their way?'};
const labels={identity:'Who they are',motivation:'What they want',obstacle:'What gets in their way'};
const influence=['background.homeland','background.family_status','relationships.allies','relationships.enemies','relationships.organizations','PRIMARY_TRAUMATIC_EVENT','SECONDARY_TRAUMATIC_EVENT'];
const resistance=['BASIC_EVENT','relationships.organizations','relationships.enemies','abilities.special_abilities','abilities.skills','mother','father','background.occupation','personality.motivations','personality.flaws'];
const recipes={identity:[['age',['birthday']],['heritage',['CHARACTER_NATIONAL_HERITAGE']],['trait',['trait.0']],['gender',['basic.gender']],['species',['basic.race']],['occupation',['background.occupation']]],motivation:[['motivation',['personality.motivations']],['trait',['trait.1']],['influence',influence],['event',['BASIC_EVENT']]],obstacle:[['descriptor',['STORY_DESCRIPTOR']],['trait',['trait.2']],['resistance',resistance]]};
const clone=x=>JSON.parse(JSON.stringify(x));
const clean=x=>String(x??'').slice(0,20000);
const defaults=()=>({chapter:'identity',pending:{},accepted:{},visited:[],ingredientsOpen:false,sketchOpen:false});
function validPrompt(raw,key){
 if(!raw||!Array.isArray(raw.ingredients))return null;
 const recipe=recipes[key];
 const ingredients=recipe.map(([slot,ids])=>{const item=raw.ingredients.find(x=>x&&x.slot===slot&&ids.includes(x.fieldId));if(!item)return null;return {slot,fieldId:item.fieldId,value:clean(item.value),held:!!item.held,custom:!!item.custom,wasKept:!!item.wasKept};});
 if(ingredients.some(x=>!x))return null;
 return {ingredients,customText:typeof raw.customText==='string'?clean(raw.customText):null};
}
function migrate(s,raw=s.guided){
 const g=defaults();if(raw&&typeof raw==='object'){
  if(keys.includes(raw.chapter))g.chapter=raw.chapter;
  g.visited=Array.isArray(raw.visited)?keys.filter(k=>raw.visited.includes(k)):[];
  g.ingredientsOpen=raw.ingredientsOpen===true;g.sketchOpen=raw.sketchOpen===true;
  for(const key of keys)for(const type of ['pending','accepted']){const prompt=validPrompt(raw[type]?.[key],key);if(prompt)g[type][key]=prompt;}
 }
 s.guided=g;return s;
}
function field(api,id){return api.fields.find(f=>f.id===id);}
function pool(api,id){
 // The requested family_status array is available alongside the newer family-connection pool.
 if(id==='background.family_status')return api.original.background.family_status;
 return field(api,id)?.pool||[];
}
function pick(list,random=Math.random){return list[Math.min(list.length-1,Math.floor(random()*list.length))];}
function different(list,previous,random){const alternatives=list.filter(value=>value!==previous);return pick(alternatives.length?alternatives:list,random);}
function protectedValue(api,id){const v=api.state.values[id];return v?.kept?(id==='birthday'?v.value:v.keptValue):v?.locked?v.value:null;}
function draw(api,id,previous,random=Math.random){
 const fixed=protectedValue(api,id);if(fixed!==null)return fixed;
 if(id==='birthday'){
  const settings=api.state.settings;
  const year=root.CharacterCore.parseDate(settings.storyDate)?.y||settings.storyYear;
  const ranges=api.original.basic.age_ranges.filter(range=>range.min<=Math.min(range.max,year-2));
  if(!ranges.length)return api.state.values.birthday?.value||'';
  const range=pick(ranges,random),max=Math.min(range.max,year-2);
  return root.CharacterCore.birthForAge(range.min+Math.floor(random()*(max-range.min+1)),settings.storyYear,settings.storyDate);
 }
 if(id==='basic.race')return root.CharacterCore.speciesValue(api.original,random);
 const values=pool(api,id);return values.length?different(values,previous,random):api.state.values[id]?.value||'';
}
function generate(api,key,previous=null,random=Math.random){
 const ingredients=recipes[key].map(([slot,ids])=>{
  const old=previous?.ingredients.find(x=>x.slot===slot);
  if(old&&(old.held||protectedValue(api,old.fieldId)!==null))return {...old,value:protectedValue(api,old.fieldId)??old.value};
  const available=ids.filter(id=>id==='birthday'||pool(api,id).length);
  const fieldId=pick(available,random);
  return {slot,fieldId,value:draw(api,fieldId,old?.fieldId===fieldId?old.value:undefined,random),held:false,custom:false};
 });
 return {ingredients,customText:null};
}
function ensure(api){const g=api.state.guided;const key=g.chapter;if(!g.pending[key])g.pending[key]=g.accepted[key]?clone(g.accepted[key]):generate(api,key);return g.pending[key];}
function next(g,key){if(!g.visited.includes(key))g.visited.push(key);const at=keys.indexOf(key);for(let n=1;n<=keys.length;n++){const candidate=keys[(at+n)%keys.length];if(!g.visited.includes(candidate)){g.chapter=candidate;return;}}}
const article=value=>/^(?:honest|honor|hour|heir|8|11|18)/i.test(value)?'an':/^(?:uni[^nmd]|use|user|euro|one\b)/i.test(value)?'a':/^[aeiou]/i.test(value)?'an':'a';
function lower(value){const s=clean(value).trim();return /^[A-Z][a-z]/.test(s)?s[0].toLowerCase()+s.slice(1):s;}
const verbs=/^(?:to\s+|be\b|become\b|find\b|get\b|gain\b|protect\b|help\b|save\b|seek\b|win\b|prove\b|escape\b|avoid\b|discover\b|learn\b|make\b|build\b|create\b|destroy\b|control\s|take\b|give\b|keep\b|restore\b|avenge\b|earn\b|explore\b|understand\b|survive\b|hide\b|defend\b|serve\b|lead\b|follow\b|entertain\b|gamble\b|bargain\b|acquire\b|accumulate\b|achieve\s|impress\b|secure\b|establish\b|maintain\b|reunite\b|reconnect\b|challenge\b|experience\s|travel\b|satisfy\b|fulfill\b|resolve\b|overcome\b)/i;
function parts(prompt,key,settings){
 if(prompt.customText!==null)return [{text:prompt.customText}];
 const get=slot=>prompt.ingredients.find(x=>x.slot===slot);
 const raw=slot=>get(slot)?.value||'not established';
 const token=(slot,value=raw(slot))=>({slot,text:clean(value).trim().replace(/\s+/g,' ')});
 const text=value=>({text:value});
 if(key==='identity'){
  const age=root.CharacterCore.ageAt(raw('age'),settings.storyYear,settings.storyDate);
  const years=age===null?'age-unestablished':age+'-year-old';
  return [text(article(years)[0].toUpperCase()+article(years).slice(1)+' '),token('age',years),text(' '),token('heritage'),text(' '),token('trait',lower(raw('trait'))),text(' '),token('gender',lower(raw('gender'))),text(' '),token('species',lower(raw('species'))),text(' who works as '+article(raw('occupation'))+' '),token('occupation',lower(raw('occupation'))),text('.')];
 }
 if(key==='motivation'){
  const motive=raw('motivation'),action=verbs.test(motive),influence=get('influence');
  let cause='their ties to ';
  if(influence.fieldId==='background.homeland')cause='their homeland, ';
  if(influence.fieldId==='background.family_status')cause='a family connection described as ';
  if(influence.fieldId==='relationships.allies')cause='an ally described as ';
  if(influence.fieldId==='relationships.enemies')cause='an enemy described as ';
  if(/TRAUMATIC_EVENT/.test(influence.fieldId))cause='an experience of ';
  return [text(action?'They want to ':'They seek '),token('motivation',action?lower(motive).replace(/^to\s+/i,''):lower(motive)),text(', shaped by their '),token('trait',lower(raw('trait'))),text(' side, '+cause+'“'),token('influence'),text('”, and '+article(raw('event'))+' '),token('event',lower(raw('event'))),text('.')];
 }
 const context={mother:'their maternal figure, described as ',father:'their paternal figure, described as ','relationships.organizations':'an organization, ','relationships.enemies':'an enemy, ','abilities.special_abilities':'an ability, ','abilities.skills':'a skill, ','background.occupation':'an occupation, ','personality.motivations':'a motivation, ','personality.flaws':'a flaw, ',BASIC_EVENT:'an event, '}[get('resistance').fieldId]||'';
 return [text(article(raw('descriptor'))[0].toUpperCase()+article(raw('descriptor')).slice(1)+' '),token('descriptor',lower(raw('descriptor'))),text(' complication involving '+context+'“'),token('resistance'),text('” challenges their '),token('trait',lower(raw('trait'))),text(' side.')];
}
function sentence(prompt,key,settings){return parts(prompt,key,settings).map(p=>p.text).join('');}
function sync(s,id,value){
 for(const key of keys)for(const type of ['accepted','pending']){
  const p=s.guided[type][key];if(!p||p.customText!==null)continue;
  if(id==='birthday'&&!root.CharacterCore.parseDate(value))continue;
  for(const item of p.ingredients)if(item.fieldId===id)item.value=value;
 }
}
root.GuidedBuilder={keys,titles,labels,recipes,defaults,migrate,pool,field,draw,generate,ensure,next,parts,sentence,article,sync,clone};
})(typeof window==='undefined'?globalThis:window);
