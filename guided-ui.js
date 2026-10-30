/* The production guided workspace uses CharacterApp's existing state, tools and history. */
(function(){
'use strict';
const A=window.CharacterApp,B=window.GuidedBuilder,C=window.CharacterCore,$=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const api=()=>A.builderAPI(),state=()=>A.getState(),guided=()=>state().guided;
const exploreTopics=[
 {label:'Quick snapshot',tab:'quick'},
 {label:'All character details',tab:'full',description:'Browse every module together',help:'Browse all the character details together and keep anything that helps you picture them.'},
 ...window.CharacterCanvas.pages.map(({id:tab,label,description,help})=>({tab,label,description,help})),
 {label:'Connections',tab:'connections',description:'People who shape their story',help:'Introduce an ally, a rival, or someone who remembers their past.'},
 {label:'Pressure situations',tab:'pressure',description:'A choice that tests them',help:'Put their desire and obstacle into a difficult situation, then decide how they respond.'},
 {label:'Character sheet',tab:'sheet',description:'Review the details you kept',help:'Read the details you have kept together and see what else you want to discover.'},
 {label:'Undo & roll history',tab:'history'},
 {label:'Add one detail at a time',tab:'single',description:'Build with one possibility at a time',help:'Choose a module or let Surprise me offer a detail. Keep the possibilities that belong to your character.'}
];
const excludedSuggestions=new Set(['quick','history']),developmentSelections=new WeakMap(),sketchFeedback=new WeakMap();
function developmentSuggestions(reroll=false){
 const g=guided(),available=topic=>!excludedSuggestions.has(topic.tab)&&window.Affinities.topicAvailable(state(),topic.tab);
 if(reroll||!developmentSelections.has(g)||developmentSelections.get(g).some(topic=>!available(topic))){
  const previous=new Set((developmentSelections.get(g)||[]).map(topic=>topic.tab));
  const choices=exploreTopics.filter(available);
  for(let i=choices.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
  const ordered=reroll?[...choices.filter(topic=>!previous.has(topic.tab)),...choices.filter(topic=>previous.has(topic.tab))]:choices;
  developmentSelections.set(g,ordered.slice(0,4));
 }
 return developmentSelections.get(g);
}
function renderDevelopmentChoices(){$('developmentChoices').innerHTML=developmentSuggestions().map(topic=>`<button data-explore="${topic.tab}">${esc(topic.label)}<small>${esc(topic.description)}</small></button>`).join('');}
const motion=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches;
let dialogOrigin=null,settingsParent=null,settingsNext=null,settingsNode=null,addingUntil=0;
const reveal=()=>{if(motion())$('suggestionText').animate([{opacity:.2,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'});};
function persist(){const saved=A.persistDraft();$('draftStatus').textContent=saved?'Draft saved on this device':'Saving unavailable · export a backup';}
function restoreSettings(){if(settingsParent&&settingsNode){settingsParent.insertBefore(settingsNode,settingsNext?.parentNode===settingsParent?settingsNext:null);settingsNode.open=false;}settingsParent=null;settingsNext=null;settingsNode=null;}
function openDialog(title,html,origin=document.activeElement){
 const dialog=$('builderDialog');if(dialog.open)dialog.close();dialogOrigin=origin;
 restoreSettings();
 $('builderDialogTitle').textContent=title;$('builderDialogContent').innerHTML=html;dialog.showModal();
 requestAnimationFrame(()=>($('builderDialogContent').querySelector('textarea,input,select,button')||dialog.querySelector('[data-close]')).focus());
}
$('builderDialog').addEventListener('close',()=>{
 if($('builderDialog').open)return;
 restoreSettings();
 const name=dialogOrigin?.getAttribute('aria-label');
 const replacement=name?[...document.querySelectorAll('button[aria-label]')].find(el=>el.getAttribute('aria-label')===name):null;
 const target=dialogOrigin?.isConnected?dialogOrigin:(replacement||$('addDetail'));if(!target.closest('[hidden]'))target.focus({preventScroll:true});
});
function sourceLabel(item){return B.field(api(),item.fieldId)?.label||item.fieldId;}
function showIngredients(focusSlot){
 $('ingredientDetails').open=true;guided().ingredientsOpen=true;persist();
 if(focusSlot){const button=$('ingredientRows').querySelector(`[data-edit-ingredient="${focusSlot}"]`);button?.focus({preventScroll:true});}
}
function renderIngredients(prompt){
 const rows=prompt.ingredients.map(item=>{
  const fixed=state().values[item.fieldId],locked=!!fixed?.locked;
  const choices=B.recipes[guided().chapter].find(([slot])=>slot===item.slot)[1];
  const select=choices.length>1?`<label class="ingredient-pool"><span class="sr-only">Pool for ${esc(item.slot)}</span><select data-ingredient-pool="${item.slot}" ${locked?'disabled':''}>${choices.map(id=>`<option value="${esc(id)}" ${item.fieldId===id?'selected':''}>${esc(B.field(api(),id)?.label||id)}</option>`).join('')}</select></label>`:'';
  const flags=locked?'Locked in generator':fixed?.kept?'Kept detail':item.custom?'Your wording':'';
  return `<div class="ingredient-row" data-slot="${item.slot}"><div class="ingredient-value"><label>${esc(sourceLabel(item))}</label><p>${esc(item.slot==='age'?C.ageAt(item.value,state().settings.storyYear,state().settings.storyDate)+' years · '+item.value:B.ingredientValue(api(),item))}</p>${flags?`<small>${flags}</small>`:''}${select}</div><div class="ingredient-actions"><button data-edit-ingredient="${item.slot}" aria-label="Edit ${esc(sourceLabel(item))}" ${locked?'disabled':''}>Edit</button><button data-reroll-ingredient="${item.slot}" aria-label="Reroll ${esc(sourceLabel(item))}" ${locked||fixed?.kept||item.held?'disabled':''}>↻</button><button data-hold-ingredient="${item.slot}" aria-label="Hold ${esc(sourceLabel(item))}" aria-pressed="${item.held}" ${locked?'disabled':''}>${item.held?'Held':'Hold'}</button></div></div>`;
 }).join('');
 $('ingredientRows').innerHTML=(prompt.customText!==null?'<p class="ingredient-hint">This sentence uses your own wording. Changing an ingredient returns to the composed version. Kept facts change only when you add the updated sentence.</p>':'')+rows;
}
function renderSketch(){
 const g=guided(),sentences=B.keys.filter(k=>g.accepted[k]),used=new Set(sentences.flatMap(k=>g.accepted[k].customText===null?g.accepted[k].ingredients.map(i=>i.fieldId):[]));
 const others=A.keptEntries().filter(e=>!used.has(e.id));
 $('guidedSketchContent').innerHTML=sentences.map(key=>`<article class="sketch-composition" data-sketch="${key}"><div><h3>${B.labels[key]}</h3><button data-edit-composition="${key}" aria-label="Edit ${B.labels[key]}">Edit</button></div><p>${esc(B.sentence(g.accepted[key],key,state().settings,state()))}</p><div class="sketch-composition-actions"><button data-copy-composition="${key}">Copy</button><button data-remove-composition="${key}">Remove</button></div></article>`).join('')+(others.length?'<details class="other-kept"><summary>'+others.length+' other kept '+(others.length===1?'detail':'details')+'</summary>'+others.map(e=>`<div class="other-kept-row"><h3>${esc(e.label)}</h3><p>${esc(e.value)}</p>${e.id===window.Clothing.FIELD&&state().values[e.id]?.focused&&window.Clothing.url(state(),{kept:true})?`<a class="clothing-select" href="${esc(window.Clothing.url(state(),{kept:true}))}" target="_blank" rel="noopener noreferrer">Select clothing ↗</a>`:''}<button data-edit-kept="${esc(e.id)}">Edit</button></div>`).join('')+'</details>':'')+(!sentences.length&&!others.length?'<p class="canvas-empty">One possibility at a time.<br>Add what belongs and watch a person take shape.</p>':'');
 const count=sentences.length+others.length,entries=new Map([...sentences.map(key=>['sentence:'+key,B.sentence(g.accepted[key],key,state().settings,state())]),...others.map(entry=>['field:'+entry.id,entry.value])]);
 let feedback=sketchFeedback.get(g);
 if(!feedback){feedback={entries,unread:false};sketchFeedback.set(g,feedback);}
 else{
  const changed=[...entries].some(([id,value])=>feedback.entries.get(id)!==value);
  if(changed){feedback.unread=!g.sketchOpen;$('sketchFeedback').textContent='Your sketch updated. '+count+' '+(count===1?'detail':'details')+' kept.';}
  feedback.entries=entries;
 }
 if(g.sketchOpen||!count)feedback.unread=false;
 if(!count)$('sketchFeedback').textContent='';
 $('toggleSketch').innerHTML='<span class="sketch-toggle-copy"><span class="sketch-toggle-title">Your sketch</span><small class="sketch-toggle-meta">'+count+' '+(count===1?'detail':'details')+(feedback.unread?' · Updated':'')+'</small></span><span class="sketch-chevron" aria-hidden="true">'+(g.sketchOpen?'⌃':'⌄')+'</span>';
 $('toggleSketch').classList.toggle('sketch-ready',count>0);
 $('toggleSketch').classList.toggle('sketch-unread',feedback.unread);
 $('toggleSketch').setAttribute('aria-label','Your sketch, '+count+' '+(count===1?'detail':'details')+(feedback.unread?', updated':''));
 $('toggleSketch').setAttribute('aria-expanded',String(g.sketchOpen));
 $('sketchBody').classList.toggle('sketch-collapsed',!g.sketchOpen);
}
function render(){
 const s=state(),g=guided(),build=s.tab==='build';
 $('toolsView').hidden=s.tab!=='tools';
 const main=s.tab==='saved'?'saved':build||['quick','full','sheet',...window.CharacterCanvas.pages.filter(p=>!['dialogue','now'].includes(p.id)).map(p=>p.id)].includes(s.tab)?'build':'tools';
 for(const button of document.querySelectorAll('[data-main]')){const selected=button.dataset.main===main;button.classList.toggle('selected',selected);button.setAttribute('aria-current',selected?'page':'false');}
 $('builderUndo').disabled=A.getHistory().index===0;
 $('iterationActions').hidden=!B.keys.every(key=>g.accepted[key]);
 if(!build)return;
 const prompt=B.ensure(api());
 $('questionTitle').textContent=B.titles[g.chapter];
 $('suggestionText').innerHTML=B.parts(prompt,g.chapter,s.settings,s).map(part=>part.slot?`<span class="sentence-ingredient" role="button" tabindex="0" data-sentence-ingredient="${part.slot}" aria-label="Edit ${esc(sourceLabel(prompt.ingredients.find(i=>i.slot===part.slot)))}">${esc(part.text)}</span>`:esc(part.text)).join('');
 $('addDetail').textContent=g.accepted[g.chapter]?'✓ Update character':'+ Add to character';
 for(const button of document.querySelectorAll('[data-chapter]')){const key=button.dataset.chapter;button.classList.toggle('active',key===g.chapter);button.classList.toggle('complete',!!g.accepted[key]);button.setAttribute('aria-current',key===g.chapter?'step':'false');}
 $('ingredientDetails').open=g.ingredientsOpen;renderIngredients(prompt);renderSketch();
 $('deeperDevelopment').hidden=!B.keys.every(k=>g.visited.includes(k));
 if(!$('deeperDevelopment').hidden)renderDevelopmentChoices();
 // Initial suggestions are cached once. Browsing does not create undo entries.
 persist();
}
function switchChapter(key){if(!B.keys.includes(key))return;guided().chapter=key;A.render();persist();reveal();}
function tryAnother(){
 const g=guided(),old=B.ensure(api()),next=B.generate(api(),g.chapter,old);
 if(B.sentence(old,g.chapter,state().settings)===B.sentence(next,g.chapter,state().settings)){A.notify('These ingredients are kept, held or locked. Edit an element to explore a change.');return;}
 g.pending[g.chapter]=next;A.render();A.record('Try another '+B.labels[g.chapter],'roll');reveal();
}
function editIngredient(slot,origin=document.activeElement){
 const g=guided(),chapter=g.chapter,prompt=B.ensure(api()),item=prompt.ingredients.find(i=>i.slot===slot);if(!item||state().values[item.fieldId]?.locked)return;
 const values=B.pool(api(),item.fieldId),birthday=item.fieldId==='birthday',settings=state().settings,maxAge=(C.parseDate(settings.storyDate)?.y||settings.storyYear)-2;
 openDialog('Edit '+sourceLabel(item),`<p class="hint">${state().values[item.fieldId]?.kept?'This is a kept fact. Your edit applies when you add the updated sentence.':'Choose an existing entry or write your own version.'}</p>${item.fieldId==='birthday'?`<label class="editor-label">Age in years<input id="ingredientEditAge" type="number" min="0" max="${maxAge}" step="1" value="${C.ageAt(item.value,settings.storyYear,settings.storyDate)}"></label><p class="hint">Suggestions draw from every age range. Set an age or choose a birth date.</p><label class="editor-label">Birth date<input id="ingredientEditValue" type="date" min="0001-01-01" max="9999-12-31" value="${esc(item.value)}"></label>`:`<label class="editor-label">Choose from the pool<select id="ingredientPoolChoice"><option value="">Your current wording</option>${values.map((value,index)=>`<option value="${index}">${esc(value)}</option>`).join('')}</select></label><label class="editor-label">Your version<textarea id="ingredientEditValue" rows="4" maxlength="20000">${esc(B.ingredientValue(api(),item))}</textarea></label>`}<div class="modal-actions"><button class="primary" id="applyIngredient">Use this ingredient</button><button data-builder-cancel>Cancel</button></div>`,origin);
 if(birthday){
  $('ingredientEditAge').oninput=()=>{const input=$('ingredientEditAge'),age=Number(input.value);if(input.value!==''&&input.checkValidity()&&Number.isInteger(age))$('ingredientEditValue').value=C.birthForAge(age,settings.storyYear,settings.storyDate);};
  $('ingredientEditValue').oninput=()=>{const value=$('ingredientEditValue').value;$('ingredientEditAge').value=C.parseDate(value)?C.ageAt(value,settings.storyYear,settings.storyDate):'';};
 }
 const poolChoice=$('ingredientPoolChoice');if(poolChoice)poolChoice.onchange=()=>{if(poolChoice.value!=='')$('ingredientEditValue').value=values[Number(poolChoice.value)];};
 $('applyIngredient').onclick=()=>{
  if(state().guided!==g||g.chapter!==chapter){$('builderDialog').close();return;}
  if(birthday&&(!$('ingredientEditAge').value||!$('ingredientEditAge').reportValidity()))return;
  const value=$('ingredientEditValue').value;
  if(item.fieldId==='birthday'&&(!C.parseDate(value)||C.ageAt(value,state().settings.storyYear,state().settings.storyDate)<0)){A.notify('Choose a valid birth date before the story date.');return;}
  if(!value.trim()){A.notify('Enter a value for this ingredient.');return;}
  item.value=value;item.custom=item.fieldId!=='birthday'&&!values.includes(value);prompt.customText=null;A.render();A.record('Edit sentence ingredient: '+sourceLabel(item),'guided-edit');$('builderDialog').close();reveal();
 };
}
$('ingredientRows').addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.dataset.editIngredient){editIngredient(button.dataset.editIngredient,button);return;}
 const slot=button.dataset.rerollIngredient||button.dataset.holdIngredient;
 const prompt=B.ensure(api()),item=prompt.ingredients.find(i=>i.slot===slot);if(!item||button.disabled)return;
 if(button.dataset.holdIngredient)item.held=!item.held;
 else{item.value=B.draw(api(),item.fieldId,item.value);item.custom=false;prompt.customText=null;}
 A.render();A.record(button.dataset.holdIngredient?'Hold sentence ingredient':'Reroll sentence ingredient',button.dataset.holdIngredient?'guided-edit':'roll');
 const replacement=$('ingredientRows').querySelector(`[${button.dataset.holdIngredient?'data-hold-ingredient':'data-reroll-ingredient'}="${slot}"]`);replacement?.focus({preventScroll:true});reveal();
});
$('ingredientRows').addEventListener('change',event=>{
 const select=event.target.closest('[data-ingredient-pool]');if(!select)return;
 const prompt=B.ensure(api()),item=prompt.ingredients.find(i=>i.slot===select.dataset.ingredientPool);
 if(state().values[item.fieldId]?.locked)return;
 const allowed=B.recipes[guided().chapter].find(([slot])=>slot===item.slot)[1];if(!allowed.includes(select.value))return;
 item.fieldId=select.value;item.value=B.draw(api(),item.fieldId);item.custom=false;prompt.customText=null;A.render();A.record('Choose sentence ingredient pool','roll');reveal();
});
$('ingredientDetails').addEventListener('toggle',()=>{guided().ingredientsOpen=$('ingredientDetails').open;persist();});
$('suggestionText').addEventListener('click',event=>{const button=event.target.closest('[data-sentence-ingredient]');if(button){showIngredients();editIngredient(button.dataset.sentenceIngredient,button);}});
function continueToDevelopment(wasComplete){
 if(wasComplete||!B.keys.every(key=>guided().accepted[key])||!matchMedia('(max-width:767px)').matches)return;
 const completed=guided();
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if(guided()!==completed||state().tab!=='build'||$('deeperDevelopment').hidden)return;
  $('developmentTitle').focus({preventScroll:true});
  $('deeperDevelopment').scrollIntoView({block:'start',behavior:motion()?'smooth':'auto'});
 }));
}
$('addDetail').onclick=()=>{
 if(performance.now()<addingUntil)return;addingUntil=performance.now()+280;
 const g=guided(),key=g.chapter,prompt=B.clone(B.ensure(api())),wasComplete=B.keys.every(key=>g.accepted[key]);
 if(A.acceptGuided(key,prompt)){A.notify('✓ Added to your character');reveal();const row=$('guidedSketchContent').querySelector(`[data-sketch="${key}"]`);if(row&&motion())row.animate([{background:'#e4b45a24',transform:'translateY(5px)'},{background:'transparent',transform:'none'}],{duration:280,easing:'ease-out'});continueToDevelopment(wasComplete);}
};
$('tryAnother').onclick=tryAnother;
$('skipStep').onclick=()=>{B.next(guided(),guided().chapter);A.render();persist();reveal();};
$('writeOwn').onclick=()=>{
 const chapter=guided().chapter,prompt=B.clone(B.ensure(api()));
 openDialog(B.titles[chapter],`<label class="editor-label">Your sentence<textarea id="customSentence" rows="5" maxlength="20000">${esc(B.sentence(prompt,chapter,state().settings,state()))}</textarea></label><p class="hint">Your wording will be kept as a sentence. It won't assign the generated ingredients as facts.</p><div class="modal-actions"><button id="keepCustomSentence" class="primary">Add to character</button><button data-builder-cancel>Cancel</button></div>`);
 $('keepCustomSentence').onclick=()=>{const text=$('customSentence').value.trim();if(!text){A.notify('Write a sentence first.');return;}prompt.customText=text;const wasComplete=B.keys.every(key=>guided().accepted[key]);if(!A.acceptGuided(chapter,prompt))return;$('builderDialog').close();A.notify('Your sentence was added.');continueToDevelopment(wasComplete);};
};
$('builderDialogContent').addEventListener('click',event=>{if(event.target.closest('[data-builder-cancel]'))$('builderDialog').close();});
for(const button of document.querySelectorAll('[data-chapter]'))button.onclick=()=>switchChapter(button.dataset.chapter);
for(const button of document.querySelectorAll('[data-main]'))button.onclick=()=>{document.querySelectorAll('details.app-menu').forEach(d=>d.open=false);A.setView(button.dataset.main);};
for(const button of document.querySelectorAll('[data-go]'))button.onclick=()=>A.setView(button.dataset.go);
function explore(value){if(value!=='single'){A.setView(value);return;}A.setView('build');$('singleDetailBuilder').hidden=false;$('guidedQuestion').hidden=true;$('singleDetailBuilder').scrollIntoView({block:'start'});$('candidateCategory').focus({preventScroll:true});}
$('rerollModules').onclick=()=>{const choices=developmentSuggestions(true);renderDevelopmentChoices();$('developmentFeedback').textContent='New modules: '+choices.map(topic=>topic.label).join(', ')+'.';};
$('developmentChoices').addEventListener('click',event=>{const button=event.target.closest('[data-explore]');if(button)explore(button.dataset.explore);});
$('helpDecide').onclick=()=>{
 const choices=developmentSuggestions();let index=0;
 const show=()=>{
  const choice=choices[index];
  openDialog('Help me decide',`<h3>${esc(choice.label)}</h3><p>${esc(choice.help)}</p><div class="modal-actions"><button id="tryDevelopment" class="primary">Open ${esc(choice.label)}</button><button id="anotherDevelopment">Suggest another</button></div>`,$('helpDecide'));
  $('tryDevelopment').onclick=()=>{$('builderDialog').close();explore(choice.tab);};
  $('anotherDevelopment').onclick=()=>{index=(index+1)%choices.length;show();};
 };
 show();
};
$('saveAndStartAnother').onclick=()=>{
 if(!A.saveAndStartAnother())return;
 $('singleDetailBuilder').hidden=true;$('guidedQuestion').hidden=false;
 A.setView('build');$('questionTitle').focus({preventScroll:true});window.scrollTo({top:0,behavior:motion()?'smooth':'auto'});
};
$('toggleSketch').onclick=()=>{guided().sketchOpen=!guided().sketchOpen;renderSketch();persist();};
$('builderUndo').onclick=()=>A.undo();$('previewExport').onclick=()=>A.setView('brief');
$('guidedSketchContent').addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.dataset.copyComposition){const key=button.dataset.copyComposition,text=B.sentence(guided().accepted[key],key,state().settings,state());A.copy(B.labels[key]+'\n\n'+text,'<h3>'+esc(B.labels[key])+'</h3><p>'+esc(text)+'</p>','Sentence copied.');}
 if(button.dataset.removeComposition)A.removeGuided(button.dataset.removeComposition);
 if(button.dataset.editComposition){const key=button.dataset.editComposition;guided().chapter=key;guided().pending[key]=B.clone(guided().accepted[key]);guided().ingredientsOpen=true;A.render();$('guidedQuestion').scrollIntoView({block:'nearest',behavior:motion()?'smooth':'auto'});$('ingredientDetails').querySelector('summary').focus({preventScroll:true});persist();}
 if(button.dataset.editKept){const original=$('acceptedContent').querySelector(`[data-canvas-action="edit"][data-id="${CSS.escape(button.dataset.editKept)}"]`);original?.click();}
});
$('browseDetails').onclick=()=>{
 openDialog('Explore your character',`<label class="editor-label">Find a topic<input id="topicSearch" type="search" placeholder="Try voice, appearance, or history"></label><div id="topicChoices" class="topic-choices">${exploreTopics.map(({label,tab})=>`<button data-browse-tab="${tab}" class="${window.Affinities.topicAvailable(state(),tab)?'':'topic-inactive'}">${label}${window.Affinities.topicAvailable(state(),tab)?'':'<small>Inactive · optional</small>'}</button>`).join('')}</div><p class="hint">Your character stays the same as you explore.</p><button data-open-settings>Story &amp; roll settings</button>`);
 $('topicSearch').oninput=()=>{for(const button of $('topicChoices').children)button.hidden=!button.textContent.toLowerCase().includes($('topicSearch').value.toLowerCase());};
 $('topicChoices').onclick=event=>{const button=event.target.closest('[data-browse-tab]');if(!button)return;$('builderDialog').close();explore(button.dataset.browseTab);};
};
$('closeSingleDetail').onclick=()=>{$('singleDetailBuilder').hidden=true;$('guidedQuestion').hidden=false;};
document.addEventListener('click',event=>{
 if(!event.target.closest('[data-open-settings]'))return;
 if($('builderDialog').open)$('builderDialog').close();
 openDialog('Story & roll settings','');const node=$('rollSettings');settingsParent=node.parentNode;settingsNext=node.nextSibling;settingsNode=node;$('builderDialogContent').append(node);node.open=true;
});
document.addEventListener('keydown',event=>{if((event.key===' '||event.key==='Enter')&&event.target instanceof HTMLButtonElement&&!event.repeat)event.target.classList.add('button-pressed');});
document.addEventListener('keydown',event=>{if((event.key===' '||event.key==='Enter')&&event.target.matches('.sentence-ingredient')){event.preventDefault();if(!event.repeat)event.target.click();}});
document.addEventListener('keyup',()=>document.querySelectorAll('.button-pressed').forEach(b=>b.classList.remove('button-pressed')));
document.addEventListener('focusout',event=>event.target.classList?.remove('button-pressed'));
const menu=document.querySelector('.app-menu>div');menu.append($('draftActions').querySelector('.roll-actions'));document.addEventListener('click',event=>{if(event.target.closest('.app-menu button'))document.querySelector('.app-menu').open=false;});
function placeSketch(){const sketch=$('guidedSketch');if(matchMedia('(max-width:767px)').matches)$('builderChapters').before(sketch);else document.querySelector('.builder-grid').append(sketch);}
addEventListener('resize',placeSketch);placeSketch();
window.GuidedUI={render};A.render();
})();
