/* Local dialogue generation and parameter rules; shared field state belongs to app.js. */
(function(root){
'use strict';
const D=root.DialogueData,pick=a=>a[Math.floor(Math.random()*a.length)];
const defaults={dialogueWildcards:false,dialogueCombine:false};
function settings(s){for(const key of Object.keys(defaults))if(s[key]!==undefined&&typeof s[key]!=='boolean')throw Error('Invalid dialogue settings.');return {...defaults,...s};}
function definitions(){const fields=[];
 const add=(key,label,pool,scope='Spoken dialogue and written messages')=>fields.push({id:'dialogue.'+key,label,kind:'dialogue',group:'Dialogue Style',pool,scope,quick:false});
 add('amount','Amount of speech',D.dialogue_amount);add('sentence','Sentence shape',D.dialogue_sentence_shape);add('register','Register',D.dialogue_register);add('words','Word choice',D.dialogue_word_choice);add('profanity','Profanity · frequency & purpose',[...D.dialogue_profanity,...D.dialogue_constant_profanity]);
 add('speechPresentation','Emphasis & presentation · speech',D.dialogue_speech_presentation,'Spoken dialogue');add('messagePresentation','Emphasis & presentation · messages',D.dialogue_message_presentation,'Written messages');add('multilingual','Multilingual behavior',D.dialogue_multilingual);add('conversation','Conversational behavior',D.dialogue_conversational_behavior);add('thinking','Thought-to-speech habit',D.dialogue_thought_to_speech,'Spoken dialogue');add('unsaid','What they leave unsaid',D.dialogue_leave_unsaid);add('situation','Situational change',D.dialogue_situational_change);
 for(let i=1;i<=2;i++)fields.push({id:'dialogue.wildcard'+i,label:'Dialogue Wildcard '+i,kind:'dialogue',group:'Dialogue Wildcards',pool:D.dialogue_wildcards,wildcard:true,quick:false});
 return fields;
}
const defs=definitions(),field=id=>defs.find(f=>f.id===id),option=(f,id)=>f.pool.find(o=>o.id===id);
const clean=s=>String(s??'').slice(0,1000),wordCount=s=>s.trim().split(/\s+/).filter(Boolean).length;
function parameters(f,o,s,input={},random=false){
 const p={};
 const languageContext=()=>{p.languageOverride=input.languageOverride??!!input.languages;if(typeof p.languageOverride!=='boolean')throw Error('Invalid language-reference setting.');p.languages=clean((p.languageOverride?input.languages:root.Languages.context(s))||'No language established');};
 if(f.wildcard){p.scope=D.wildcard_scopes.includes(input.scope)?input.scope:'One conversation';p.reason=D.wildcard_reasons.includes(input.reason)?input.reason:D.wildcard_reasons[0];}
 for(const key of o.parameters||[]){
  if(key==='languages'){languageContext();continue;}
  const raw=input[key]??(random?pick(D.wildcard_parameters[key]):o.defaults?.[key]);
  if(key==='words'){p.words=Number(raw);if(!Number.isInteger(p.words)||p.words<1||p.words>D.counted_examples.length)throw Error('Use a word count from 1 to '+D.counted_examples.length+'.');}
  if(key==='letter'){p.letter=String(raw).toLowerCase();if(!/^[a-z]$/.test(p.letter))throw Error('Choose one English letter (a–z).');}
  if(key==='word'){p.word=String(raw).trim();if(!/^[a-z]+$/i.test(p.word))throw Error('Enter one English word using letters only.');}
  if(key==='subject'){p.subject=clean(raw).trim();if(!p.subject||p.subject.length>80||!/[\p{L}\p{N}]/u.test(p.subject))throw Error('Enter a subject of 1–80 characters.');}
 }
 if(f.id==='dialogue.multilingual')languageContext();
 if(f.id==='dialogue.situation'){
  const targets=defs.filter(x=>!x.wildcard&&x.id!=='dialogue.situation');const target=targets.find(x=>x.id===input.target)|| (random?pick(targets):targets[0]);
  p.target=target.id;p.baseline=clean(input.baseline||s.values[target.id]?.value.split('\n')[0]||target.label);p.targetLabel=target.label;
 }
 return p;
}
function example(o,p){
 if(o.id==='forbidden-letter')return '“'+(['Go.','Run.'].find(text=>!text.toLowerCase().includes(p.letter)))+'”';
 if(o.id==='word-budget'||o.id==='exact-length')return '“'+D.counted_examples[p.words-1]+'”';
 if(o.id==='mandatory-word')return '“'+p.word.charAt(0).toUpperCase()+p.word.slice(1)+'.'+'”';
 if(o.id==='forbidden-subject')return '“'+(['That matter can wait.','Later, perhaps.','Go.'].find(text=>!text.toLowerCase().includes(p.subject.toLowerCase())))+'”';
 return o.example;
}
function prepare(f,s,o,input={},random=false){const p=parameters(f,o,s,input,random);let instruction=o.instruction||o.rule;for(const [key,val] of Object.entries(p))instruction=instruction.replaceAll('{'+key+'}',String(val));
 const lines=[o.label,instruction];
 if(f.id==='dialogue.situation')lines.splice(1,0,'Selected habit: '+p.targetLabel+' — '+p.baseline+'. This is a situational exception to that generated habit; the baseline is preserved.');
 lines.push('Scope: '+(f.wildcard?p.scope:f.scope));
 if(p.languages){lines.push('Established language context: '+p.languages);lines.push('Use only languages the author has established. A second language must be specified before switching.');}
 if(f.id==='dialogue.multilingual'&&o.id!=='switch.none')lines.push('Bracketed phrases in the example are author-fillable slots, not assigned languages.');
 if(o.id==='one-switch')lines.push('The English → Spanish example is illustrative only; adapt it after establishing two languages.');
 if(p.reason&&p.reason!==D.wildcard_reasons[0])lines.push('Optional fictional reason: '+p.reason);
 lines.push('Example: '+example(o,p));
 return {optionId:o.id,parameters:p,value:lines.join('\n')};
}
function conflict(a,b){if(!a?.optionId||!b?.optionId||a.optionId==='none'||b.optionId==='none')return null;
 if(a.optionId===b.optionId)return 'Both slots contain the same challenge; choose a different second challenge.';
 const pair=D.wildcard_incompatibilities.find(([x,y])=>[a.optionId,b.optionId].includes(x)&&[a.optionId,b.optionId].includes(y));if(pair)return pair[2];
 const byId=Object.fromEntries([a,b].map(v=>[v.optionId,v.parameters||{}]));
 const checks={
  'length-budget':()=>byId['exact-length'].words>byId['word-budget'].words,
  'word-letter':()=>byId['mandatory-word'].word.toLowerCase().includes(byId['forbidden-letter'].letter),
  'word-subject':()=>byId['mandatory-word'].word.toLowerCase()===byId['forbidden-subject'].subject.toLowerCase(),
  'word-syllables':()=>!D.wildcard_checked_single_syllable_words.includes(byId['mandatory-word'].word.toLowerCase()),
  'word-pronoun':()=>D.wildcard_pronoun_words.includes(byId['mandatory-word'].word.toLowerCase()),
  'word-emotion':()=>D.wildcard_emotion_words.includes(byId['mandatory-word'].word.toLowerCase())
 };
 for(const rule of D.wildcard_parameter_rules)if(rule.ids.every(id=>byId[id])&&checks[rule.check]?.())return rule.reason;
 return null;
}
function roll(f,s,{force=false}={}){const v=s.values[f.id];if(v.locked)return;if(f.wildcard&&!force&&(!s.settings.dialogueWildcards||(f.id.endsWith('2')&&!s.settings.dialogueCombine)))return;
 let input={};if(v.parameters?.languageOverride){input.languages=v.parameters.languages;input.languageOverride=true;}
 let choices=f.pool.map(o=>prepare(f,s,o,input,true));
 if(f.wildcard&&s.settings.dialogueCombine){const other=s.values[f.id.endsWith('1')?'dialogue.wildcard2':'dialogue.wildcard1'];choices=choices.filter(choice=>!conflict(choice,other));}
 Object.assign(v,pick(choices));v.focused=Math.random()<s.settings.focusDensity;
}
function refreshLanguages(s){for(const f of defs){const v=s.values[f.id],o=option(f,v?.optionId);if(!v||v.locked||v.parameters?.languageOverride||!o||!(f.id==='dialogue.multilingual'||o.parameters?.includes('languages')))continue;Object.assign(v,prepare(f,s,o,{...v.parameters,languageOverride:false}));}}
function metadata(f,v){const o=option(f,v.optionId);if(!o)return {optionId:'',parameters:{}};
 // Parameter validation is independent of current profile details; never rebuild a saved value.
 const dummy={values:{'extra.languages':{value:v.parameters?.languages}}};return {optionId:o.id,parameters:parameters(f,o,dummy,v.parameters||{})};
}
function migrate(s){s.settings=settings(s.settings);for(const f of defs)if(!s.values[f.id]){s.values[f.id]={value:'',focused:Math.random()<s.settings.focusDensity,locked:false,kept:false,keptValue:'',optionId:'',parameters:{}};if(f.wildcard)Object.assign(s.values[f.id],prepare(f,s,f.pool[0]));else roll(f,s);}return s;}
function conflicts(s){const result=[];
 if(s.settings.dialogueWildcards&&s.settings.dialogueCombine){const reason=conflict(s.values['dialogue.wildcard1'],s.values['dialogue.wildcard2']);if(reason)result.push('Selections preserved: '+reason);}
 const custom=defs.filter(f=>f.wildcard&&s.settings.dialogueWildcards&&(!f.id.endsWith('2')||s.settings.dialogueCombine)&&s.values[f.id]?.optionId==='');if(custom.length)result.push('Custom wildcard text: check compatibility manually.');
 if(s.settings.dialogueWildcards&&[s.values['dialogue.wildcard1'],...(s.settings.dialogueCombine?[s.values['dialogue.wildcard2']]:[])].some(v=>v.optionId==='one-switch'))result.push('Establish two languages before using a language-switch challenge; the illustrative pair does not add proficiency.');
 return result;
}
function recipeEntries(s){return defs.filter(f=>s.values[f.id]?.kept).map(f=>({id:f.id,label:f.label,value:s.values[f.id].keptValue})).concat(s.values.CHARACTER_SPEECH?.kept?[{id:'CHARACTER_SPEECH',label:'Voice Sound',value:s.values.CHARACTER_SPEECH.keptValue}]:[]);}
function recipeText(s){const entries=recipeEntries(s);return entries.length?(s.name||'Unnamed character')+' — Dialogue recipe\n\n'+entries.map(x=>x.label+': '+x.value.split('\nExample: ')[0].split('\n').filter(line=>!line.startsWith('Use only languages')&&!line.startsWith('Bracketed phrases')&&!line.startsWith('The English → Spanish')).join(' ')).join('\n\n'):'';}
root.Dialogue={refreshLanguages,defaults,settings,definitions,prepare,roll,migrate,metadata,conflict,conflicts,recipeEntries,recipeText,wordCount};
})(typeof window==='undefined'?globalThis:window);
