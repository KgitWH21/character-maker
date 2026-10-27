# Shared UI primitives

Vanilla JavaScript template functions in `app.js`; no framework or component library. Styling is in `style.css`.

## copyButton
Source: `app.js`. Shared rendering function.

```js
function copyButton(id,label,kept=false){return `<button type="button" data-copy-field="${esc(id)}" data-copy-label="${esc(label)}" ${kept?'data-copy-kept="true"':''} aria-label="Copy ${esc(label)}">Copy</button>`;}
```

## card
Source: `app.js`. Shared rendering function.

```js
function card(f,mode='field'){const v=fieldState(f.id),unavailable=f.kind==='adult'&&!adultAllowed(),id=esc(f.id);return `<article class="card ${v.focused?'focused':'faded'}" data-field="${id}" data-mode="${mode}"><div class="card-top"><h3 class="card-label">${esc(f.label)}</h3><span class="status">${f.kind==='rightNow'&&v.information&&v.information!=='Available'?esc(v.information)+' · ':''}${v.locked?'LOCKED ':''}${v.kept?'KEPT':''}</span></div>${valueMarkup(f)}<div class="card-actions">${copyButton(f.id,f.label)}<button data-action="focus" aria-pressed="${v.focused}" aria-label="Toggle focus: ${esc(f.label)}">${v.focused?'In focus':'Focus'}</button><button data-action="lock" aria-pressed="${v.locked}" ${readOnly(f)||unavailable?'disabled':''}>${v.locked&&mode==='candidate'?'Unlock':v.locked?'Locked':'Lock'}</button><button data-action="keep" aria-pressed="${v.kept}" ${unavailable?'disabled':''}>${mode==='candidate'?'KEEP':v.kept?'Kept':'Keep'}</button><button class="reroll" data-action="reroll" aria-label="Reroll ${esc(f.label)}" ${v.locked||readOnly(f)||unavailable?'disabled':''}>${mode==='candidate'?'REROLL VALUE':'↻ Reroll'}</button></div>${f.kind==='medicalDerived'?'<p class="hint">Calculated from height, weight, age, and species / kind. Change those fields to update this category.</p>':f.kind==='derived'?'<details><summary>Calendar notes</summary><p>Western sun signs use common approximate date ranges. Chinese zodiac follows Lunar New Year, using your browser’s Chinese calendar. Ancient and distant future dates are extrapolations. Birthstones and flowers are common modern associations; traditions vary.</p><p><a href="https://www.hko.gov.hk/en/gts/time/stemsandbranches.htm" target="_blank" rel="noopener">Chinese calendar reference</a></p></details>':unavailable?'':`<details class="edit-details"><summary>${f.kind==='rightNow'?'Edit / choose · author details':'Edit / choose an entry'}</summary><div class="editor">${f.kind==='dialogue'?`<div class="dialogue-param-fields">${dialogueParameters(f,v)}</div>`:''}${f.numeric?medicalEditor(f,v):f.kind==='birthday'?`<label>Birth date<input class="birthday-editor" type="date" value="${esc(v.value)}" min="0001-01-01" max="9999-12-31"></label>`:f.kind==='arc'?'<p>Reroll for a new layout and three cards, or edit the arc below.</p>':f.pool?`<label>Selection pool<select class="pool-select">${selectionOptions(f)}</select></label>`:''}${f.kind!=='birthday'&&!f.numeric?`<label>Your version<textarea class="custom-value" rows="3">${esc(v.value)}</textarea></label>`:''}<button data-action="applyEdit">Apply edit</button></div></details>`}</article>`;}
```

## valueMarkup
Source: `app.js`. Shared rendering function.

```js
function valueMarkup(f,text=display(f)){if(f.kind!=='dialogue')return `<p class="value">${esc(text)}</p>`;const lines=text.split('\n'),label=lines.shift(),at=lines.findIndex(line=>line.startsWith('Example: ')),body=at<0?lines:lines.slice(0,at),example=at<0?'':lines.slice(at).join('\n').replace(/^Example: /,'');return `<div class="value dialogue-value"><strong>${esc(label)}</strong>${body.map(line=>`<p class="${line.startsWith('Scope:')?'dialogue-scope':''}">${esc(line)}</p>`).join('')}${example?`<blockquote><span class="example-label">Example</span>${esc(example).replace(/\*([^*\n]+)\*/g,'<em>$1</em>')}</blockquote>`:''}</div>`;}
```

## medicalEditor
Source: `app.js`. Shared rendering function.

```js
function medicalEditor(f,v){const height=f.numeric==='height',weight=f.numeric==='weight',raw=height?v.value.split(' · ')[0]:weight?M.weight(state):parseFloat(v.value);return `<label>${height?'Height':weight?'Weight':'Hours since last eating'}<input class="medical-number" ${height?'type="text" placeholder="5&#39;7&quot;"':`type="number" min="${weight ? 0.1 : 0}" step="any"`} value="${esc(raw)}"></label>${height||weight?`<label>Unit<select class="medical-unit">${(height?[['us','Feet and inches'],['in','Inches'],['cm','Centimeters']]:[['lb','Pounds'],['kg','Kilograms']]).map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select></label>`:''}<p class="hint">${height?'Choose a unit, then enter its value. All three height formats update together. Unlocked Appearance height follows your edit.':weight?'Pounds and kilograms update together.':'Use decimal hours, for example 0.5 for half an hour.'}</p>`;}
```

## dialogueParameters
Source: `app.js`. Shared rendering function.

```js
function dialogueParameters(f,v){const entry=f.pool.find(o=>o.id===v.optionId);if(!entry)return '<p>Custom text. Choose a pool entry to configure its rule.</p>';const p=v.parameters||{},select=(key,label,choices)=>`<label>${label}<select data-dialogue-param="${key}">${choices.map(([val,text])=>`<option value="${esc(val)}" ${p[key]===val?'selected':''}>${esc(text)}</option>`).join('')}</select></label>`,input=(key,label,type='text',attrs='')=>`<label>${label}<input data-dialogue-param="${key}" type="${type}" ${attrs} value="${esc(p[key]??'')}"></label>`;
 const languageInputs=()=>select('languageOverride','Language reference',[[false,'Use character’s language fields'],[true,'Use manual override']])+input('languages','Established languages · type to override','text','maxlength="1000"');
 let html=f.wildcard?select('scope','Challenge scope',window.DialogueData.wildcard_scopes.map(x=>[x,x]))+select('reason','Optional fictional reason',window.DialogueData.wildcard_reasons.map(x=>[x,x])):'';
 for(const key of entry.parameters||[]){if(key==='words')html+=input(key,'Word count (English)','number','min="1" max="12"');if(key==='letter')html+=input(key,'Forbidden letter (English)','text','maxlength="1"');if(key==='word')html+=input(key,'Mandatory word (English)','text','maxlength="40"');if(key==='subject')html+=input(key,'Forbidden subject','text','maxlength="80"');if(key==='languages')html+=languageInputs();}
 if(f.id==='dialogue.multilingual')html+=languageInputs();
 if(f.id==='dialogue.situation')html+=select('target','Habit that changes',G.definitions().filter(x=>!x.wildcard&&x.id!==f.id).map(x=>[x.id,x.label]));
 return html+'<p>Changing parameters updates the draft rule and example. Apply edit to save. You can also rewrite the text below.</p>';
}
```

## historyCard
Source: `app.js`. Shared rendering function.

```js
function historyCard(e,active=false){const s=e.character,kept=Object.values(s.values).filter(v=>v.kept).length;return `<article class="workshop-card history-card ${active?'history-current':''}"><div><h3>${esc(e.label)}${active?' · current':''}</h3><p>${esc(s.name||'Unnamed character')} · ${kept} kept details · ${esc(new Date(e.at).toLocaleString())}</p></div><button data-workshop-action="restore" data-id="${esc(e.id)}" ${active?'disabled':''}>Restore</button></article>`;}
```

## connectionCard
Source: `app.js`. Shared rendering function.

```js
function connectionCard(c){const a=C.ageAt(c.character.values.birthday?.value,c.character.settings.storyYear,c.character.settings.storyDate),read=id=>c.character.values[id]?.kept?c.character.values[id].keptValue:c.character.values[id]?.value||'Not established';return `<article class="workshop-card connected-card"><p class="eyebrow">${esc(c.role)}</p><h3>${esc(c.character.name||'Unnamed character')}</h3><p>${esc(a===null?'Age not established':'Age '+a)} · ${esc(read('CHARACTER_NATIONAL_HERITAGE'))}</p><dl class="connection-profile"><div><dt>Personality</dt><dd>${esc(read('trait.0'))}</dd></div><div><dt>Occupation</dt><dd>${esc(read('background.occupation'))}</dd></div><div><dt>Motivation</dt><dd>${esc(read('personality.motivations'))}</dd></div></dl>${c.anchor?`<p class="workshop-anchor">Shared thread · ${esc(c.anchor.label)}: ${esc(c.anchor.value)}</p>`:''}<details><summary>Shared history &amp; two perspectives</summary><div class="editor">${[['name','Their name',c.character.name],['sharedHistory','What happened',c.sharedHistory],['characterView',(state.name||'Your character')+' remembers',c.characterView],['theirView','They remember',c.theirView],['tension','Current tension',c.tension]].map(([key,label,value])=>`<label>${esc(label)}<textarea data-connection-edit="${key}" data-id="${esc(c.id)}" rows="${key==='name'?1:2}" maxlength="${key==='name'?150:10000}">${esc(value)}</textarea></label>`).join('')}</div></details><div class="workshop-actions"><button data-workshop-action="openConnection" data-id="${esc(c.id)}">Save current &amp; open</button><button data-workshop-action="copyConnection" data-id="${esc(c.id)}">Copy relationship</button><button data-workshop-action="removeConnection" data-id="${esc(c.id)}">Remove</button></div></article>`;}
```

## sceneCard
Source: `app.js`. Shared rendering function.

```js
function sceneCard(p,candidate=false){return `<article class="workshop-card pressure-card"><p class="eyebrow">${candidate?'ONE POSSIBLE TEST':'KEPT SCENE'}</p><h3>${esc(p.title)}</h3><p>${esc(p.setup)}</p><h4>The choice</h4><p>${esc(p.choice)}</p><h4>What is at stake</h4><p>${esc(p.stakes)}</p>${p.anchors.length?`<details><summary>Kept details this tests</summary>${p.anchors.map(a=>`<p><strong>${esc(a.label)}:</strong> ${esc(a.value)}</p>`).join('')}</details>`:'<p class="moment-note">Keep traits, motivations, flaws, or immediate goals to give the next situation a personal anchor.</p>'}<p class="pressure-question">${esc(p.question)}</p><label>Their response / your scene notes<textarea rows="4" data-scene-edit="${esc(p.id)}" maxlength="20000">${esc(p.response)}</textarea></label><div class="workshop-actions">${candidate?`<button class="primary" data-workshop-action="keepScene" ${workshopState().scenes.some(x=>x.id===p.id)?'disabled':''}>${workshopState().scenes.some(x=>x.id===p.id)?'Kept':'Keep situation'}</button>`:`<button data-workshop-action="removeScene" data-id="${esc(p.id)}">Remove</button>`}<button data-workshop-action="copyScene" data-id="${esc(p.id)}">Copy situation</button></div></article>`;}
```

