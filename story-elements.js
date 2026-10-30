/* Personality, social context, and story framing share the existing character state. */
(function(root){
'use strict';
const D=root.StoryData,M=root.StoryMetadata,C=root.CharacterCore;
const ISSUE='story.socialIssue',GAME='personality.lifeGameGenre';
const contexts={follow:'Follow character',general:'General',men:"Men's issues",women:"Women's issues",boys:"Boys' issues",girls:"Girls' issues",all:'All issues'};
const clone=x=>JSON.parse(JSON.stringify(x)),text=x=>String(x??'').slice(0,20000);
const pick=(a,random=Math.random)=>a[Math.min(a.length-1,Math.floor(random()*a.length))];
const slot=(s,id)=>s.values[id]||(s.values[id]={value:'',focused:true,locked:false,kept:false,keptValue:''});
const issues=D.plot.social_issues.map(value=>({value,audience:value.startsWith("men's issue:")?'men':value.startsWith("boy's issue:")?'boys':'general',source:'upstream'})).concat(D.additions.womens_issues.map(value=>({value,audience:'women',source:'local'})),D.additions.girls_issues.map(value=>({value,audience:'girls',source:'local'}))).map(o=>({...o,id:M.id('issue',o.value),...M.issueRule(o.value,o.audience)}));
const genres=root.GameGenres.map(o=>({...o,id:M.id('game',o.name)}));
function definitions(){
 const list=[],add=(id,label,group,pool,section)=>list.push({id,label,group,pool,section,kind:'story',quick:false});
 add('personality.archetype','Personal archetype','Personality',D.plot.archetypes,'Self-image & inner narrative');
 add('personality.perspective','Personal narrative perspective','Personality',D.plot.perspectives,'Self-image & inner narrative');
 add('personality.controlTheory','What makes them feel safe','Personality',D.character.theories_of_control.map(o=>o.title+'\n'+o.statement),'Security & control');
 add('personality.descriptor','Descriptive quality','Personality',D.character.descriptors,'Traits, values & motivations');
 add(GAME,'Life game genre','Personality',null,'Life game genre');
 add(ISSUE,'Social issue affecting them','Social context',issues.map(o=>o.value),'Social context');
 add('story.universalQuestion','Question their life explores','Tarot & story sparks',D.plot.universal_human_questions,'Questions & themes');
 add('story.genre','Story genre','Tarot & story sparks',D.plot.genres,'Story framing');
 return list;
}
function gender(s){const v=s.values['basic.gender'];const value=(v?.kept?v.keptValue:v?.value||'').trim().toLowerCase();return ['male','transgender (woman to man)','man','trans man'].includes(value)?'man':['female','transgender (man to woman)','woman','trans woman'].includes(value)?'woman':'general';}
function audience(s){const age=root.CharacterLife.ageFloor(s);if(age===null)return 'general';const g=gender(s);return g==='man'?age>=18?'men':'boys':g==='woman'?age>=18?'women':'girls':'general';}
function ageEligible(o,s){const age=root.CharacterLife.ageFloor(s);return (age===null?o.minAge===0:age>=o.minAge&&(o.maxAge===null||age<=o.maxAge))&&(!o.adultOnly||s.settings.adultEnabled===true);}
function eligibleIssues(s,v=slot(s,ISSUE)){
 const context=contexts[v.issueContext]?v.issueContext:'follow',target=context==='follow'?audience(s):context;
 return issues.filter(o=>ageEligible(o,s)&&(target==='all'||o.audience==='general'||o.audience===target)&&(v.includeSpecific||!o.contexts.length));
}
function optionId(f,value){return M.id(f.id,value);}
function options(f,s,v=slot(s,f.id)){return f.id===ISSUE?eligibleIssues(s,v).map(o=>({id:o.id,label:o.value,value:o.value})):f.pool?.map(value=>({id:optionId(f,value),label:value,value}))||[];}
function defaultGame(){return {source:'story',descriptor:'',genre1:'',genre2:'',mode:'auto',chance:M.secondGenreChance,held:{descriptor:false,genre1:false,genre2:false}};}
function gameMetadata(raw){const g=raw&&typeof raw==='object'?raw:{},d=defaultGame();return {...d,source:g.source==='character'?'character':'story',descriptor:text(g.descriptor),genre1:text(g.genre1),genre2:text(g.genre2),mode:['auto','one','two'].includes(g.mode)?g.mode:'auto',chance:Number.isFinite(g.chance)?Math.max(0,Math.min(1,g.chance)):d.chance,held:Object.fromEntries(['descriptor','genre1','genre2'].map(k=>[k,g.held?.[k]===true]))};}
function metadata(f,v){return {optionId:text(v.optionId),custom:v.custom===true, ...(f.id===ISSUE?{issueContext:contexts[v.issueContext]?v.issueContext:'follow',includeSpecific:v.includeSpecific===true}:{}),...(f.id===GAME?{game:gameMetadata(v.game)}:{})};}
function descriptorPool(g){return g.source==='character'?D.character.descriptors:root.ORIGINAL_ELEMENTS.STORY_DESCRIPTOR;}
function editableGame(raw){const g=gameMetadata(raw);if(!descriptorPool(g).includes(g.descriptor))g.descriptor=descriptorPool(g)[0];if(!genres.some(o=>o.id===g.genre2))g.genre2='';if(!genres.some(o=>o.id===g.genre1)||g.genre1===g.genre2)g.genre1=genres.find(o=>o.id!==g.genre2).id;return g;}
function gameText(g){const name=id=>{const name=genres.find(o=>o.id===id)?.name||'';return name.replace(/\s+game$/i,'');};return [g.descriptor,name(g.genre1),name(g.genre2),'game'].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();}
function rollGame(v,random=Math.random,only=null){
 const g=editableGame(v.game),wants=k=>(!only||only===k)&&!g.held[k];
 if(wants('descriptor'))g.descriptor=pick(descriptorPool(g),random);
 if(wants('genre1'))g.genre1=pick(genres.filter(o=>o.id!==g.genre2),random).id;
 if(wants('genre2')){const include=only==='genre2'||g.mode==='two'||g.mode==='auto'&&random()<g.chance;g.genre2=include&&g.mode!=='one'?pick(genres.filter(o=>o.id!==g.genre1),random).id:'';}
 return {...v,game:g,value:gameText(g),custom:false,optionId:''};
}
function roll(f,s,random=Math.random){const v=slot(s,f.id);if(v.locked)return;if(f.id===GAME){Object.assign(v,rollGame(v,random));return;}const o=pick(options(f,s,v),random);if(o)Object.assign(v,{value:o.value,optionId:o.id,custom:false});}
function canShow(f,s,value){if(f.id!==ISSUE)return true;const o=issues.find(o=>o.value===value);return o?ageEligible(o,s):!M.explicit.test(value)||(root.CharacterLife.adult(s)&&s.settings.adultEnabled===true);}
function projection(f,s,value=slot(s,f.id).value){return canShow(f,s,value)?value:'This saved issue is outside the current age or adult-content settings. Unlock and reroll, or choose another issue.';}
function warnings(f,s){if(f.id!==ISSUE)return [];const v=slot(s,ISSUE),messages=[];if(v.value&&!canShow(f,s,v.value))messages.push('A preserved issue is outside the current age or adult-content settings. Its wording is hidden.');else if(v.value&&!v.custom&&!eligibleIssues(s,v).some(o=>o.value===v.value))messages.push('This preserved issue differs from the current suggestion context.');if(v.kept&&!canShow(f,s,v.keptValue))messages.push('The accepted issue is outside the current age or adult-content settings and is omitted from the sheet and brief.');return messages;}
function reconcile(s,changed){
 if(!['all','birthday','basic.gender',ISSUE,'adultEnabled'].includes(changed))return;
 const f=definitions().find(f=>f.id===ISSUE),v=slot(s,ISSUE);
 if(!v.locked&&!v.kept&&!v.custom&&!eligibleIssues(s,v).some(o=>o.value===v.value))roll(f,s);
}
function migrate(s){for(const f of definitions()){if(!s.values[f.id]){slot(s,f.id);Object.assign(s.values[f.id],metadata(f,s.values[f.id]));roll(f,s);}else{const v=s.values[f.id];Object.assign(v,metadata(f,v));if(f.id===GAME&&!v.custom&&(!genres.some(o=>o.id===v.game.genre1)||v.game.genre2&&!genres.some(o=>o.id===v.game.genre2)||v.game.genre1===v.game.genre2||!descriptorPool(v.game).includes(v.game.descriptor)||gameText(v.game)!==v.value))v.custom=true;else if(f.id!==GAME&&!v.custom&&!f.pool.includes(v.value))v.custom=true;}}return s;}
function edit(f,s,value,draft){
 const v=slot(s,f.id);value=text(value);if(!canShow(f,s,value))throw Error('Choose an issue appropriate to the confirmed age and adult-content settings.');
 if(draft&&value===draft.value){if(f.id===GAME&&!draft.custom)validateGame(draft.game);Object.assign(v,metadata(f,draft),{value});}
 else if(value!==v.value)Object.assign(v,{value,custom:true,optionId:''});
}
function validateGame(g){if(!genres.some(o=>o.id===g.genre1))throw Error('Choose a primary game genre.');if(g.genre2&&!genres.some(o=>o.id===g.genre2))throw Error('Choose a valid second genre.');if(g.genre1===g.genre2)throw Error('Choose two different game genres.');if(!g.descriptor.trim())throw Error('Choose a descriptor.');}
const esc=s=>text(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function select(key,label,entries,value){return `<label>${esc(label)}<select data-story-param="${key}">${entries.map(([id,label])=>`<option value="${esc(id)}" ${id===value?'selected':''}>${esc(label)}</option>`).join('')}</select></label>`;}
function genreSelect(key,value){const families=[...new Set(genres.map(o=>o.family))];return `<label>${key==='genre1'?'Genre 1':'Genre 2 · optional'}<select data-story-param="${key}">${key==='genre2'?`<option value="" ${!value?'selected':''}>None</option>`:''}${families.map(family=>`<optgroup label="${esc(family)}">${genres.filter(o=>o.family===family).map(o=>`<option value="${esc(o.id)}" ${o.id===value?'selected':''}>${esc(o.name)}</option>`).join('')}</optgroup>`).join('')}</select></label>`;}
function editor(f,s,v){
 let html='';if(f.id===GAME){
  const g=editableGame(v.game),choice=key=>`<div class="story-ingredient">${key==='descriptor'?select(key,'Descriptor',descriptorPool(g).map(x=>[x,x]),g[key]):genreSelect(key,g[key])}<div class="story-ingredient-actions"><button type="button" data-story-hold="${key}" aria-pressed="${g.held[key]}">${g.held[key]?'Held':'Hold'}</button><button type="button" data-story-roll="${key}" ${g.held[key]?'disabled':''}>Reroll ingredient</button></div></div>`;
  html=select('source','Descriptor pool',[['story','Story descriptors'],['character','Character descriptors']],g.source)+select('mode','Second genre',[['auto','Automatic'],['one','One genre'],['two','Two genres']],g.mode)+`<label>Second genre chance (%)<input type="number" min="0" max="100" data-story-param="chance" value="${Math.round(g.chance*100)}"></label>`+['descriptor','genre1','genre2'].map(choice).join('');
  const selected=[g.genre1,g.genre2].map(id=>genres.find(o=>o.id===id)).filter(Boolean);html+='<details class="game-inspiration"><summary>Game mechanics as inspiration</summary>'+selected.map(o=>`<p><strong>${esc(o.name)}</strong><br>Goal: ${esc(o.goal)}<br>Twist: ${esc(o.twist)}</p>`).join('')+'</details><p class="hint">Their own metaphor for life. Hold ingredients to preserve them on rerolls. Apply edit saves the phrase and ingredient settings.</p>';
 }else{
  if(f.id===ISSUE)html=select('issueContext','Issue suggestions',Object.entries(contexts),v.issueContext||'follow')+`<label class="story-check"><input type="checkbox" data-story-param="includeSpecific" ${v.includeSpecific?'checked':''}> Include situation-specific prompts</label><p class="hint">Suggestions follow gender and confirmed age. Situation-specific prompts may mention parenthood, identity, disability, or life events; choosing one does not establish those facts.</p>`;
  html+=select('option','Selection pool',[['','Choose an entry…'],...options(f,s,v).map(o=>[o.id,o.label])],v.optionId||'');
  if(f.id==='personality.archetype')html+='<p class="hint">The recurring role or pattern they see in their own life.</p>';
  if(f.id==='personality.perspective')html+='<p class="hint">How their inner story is framed. This is separate from Right Now’s “Known to whom?” setting.</p>';
 }
 return (v.custom?'<p class="hint">Your custom wording is saved. Choose an entry or change ingredients to compose a new result.</p>':'')+html;
}
function change(f,s,raw,key,value){
 let v={...raw,...metadata(f,raw)};
 if(f.id===GAME){const g=editableGame(v.game);if(key==='chance'){const n=Number(value);if(!Number.isFinite(n)||n<0||n>100)throw Error('Use a percentage from 0 to 100.');g.chance=n/100;}else if(key==='source'){g.source=value==='character'?'character':'story';if(!descriptorPool(g).includes(g.descriptor))g.descriptor=descriptorPool(g)[0];}else if(key==='mode'){g.mode=value;if(value==='one')g.genre2='';else if(value==='two'&&!g.genre2)g.genre2=genres.find(o=>o.id!==g.genre1).id;}else if(['descriptor','genre1','genre2'].includes(key)){g[key]=value;if(key==='genre2')g.mode=value?'two':'one';}else throw Error('Unknown game setting.');validateGame(g);return {...v,game:g,value:gameText(g),custom:false,optionId:''};}
 if(key==='option'){const o=options(f,s,v).find(o=>o.id===value);if(o)return {...v,value:o.value,optionId:o.id,custom:false};return v;}
 if(f.id===ISSUE){if(key==='issueContext')v.issueContext=contexts[value]?value:'follow';if(key==='includeSpecific')v.includeSpecific=!!value;const available=options(f,s,v);if(!available.some(o=>o.value===v.value)){const o=available[0];if(o)Object.assign(v,{value:o.value,optionId:o.id,custom:false});}return v;}
 return v;
}
function note(f,s){return warnings(f,s).map(x=>`<p class="hint" role="status">${esc(x)}</p>`).join('');}
root.StoryElements={definitions,issues,genres,contexts,ISSUE,GAME,slot,gender,audience,ageEligible,eligibleIssues,options,metadata,defaultGame,gameMetadata,gameText,rollGame,roll,canShow,projection,warnings,reconcile,migrate,edit,editor,change,note,clone};
})(typeof window==='undefined'?globalThis:window);
