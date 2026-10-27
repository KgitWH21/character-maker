'use strict';
// Build preview options directly from the app's current sources, without rewriting entries.
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const original=JSON.parse(read('character_elements.json'));
const scope={};scope.window=scope;scope.globalThis=scope;vm.createContext(scope);
for(const name of ['additions.js','core.js','right-now-data.js','right-now.js','dialogue-data.js','dialogue.js','medical.js'])vm.runInContext(read(name),scope,{filename:name});
vm.runInContext(read('character-tools.js').replace('root.CharacterTools={','root.__previewScenes=scenes;root.CharacterTools={'),scope,{filename:'character-tools.js'});
const fields=scope.CharacterCore.definitions(original,scope.EXTRA_ELEMENTS,2);
const byId=id=>{const f=fields.find(f=>f.id===id);if(!f||!Array.isArray(f.pool))throw Error('No pool: '+id);return f;};
const source=(file,arrayPath,length)=>({file,arrayPath,length});
const topic=(question,label,field,refs)=>({question,label,fieldId:field.id,fieldLabel:field.label,values:[...field.pool],sources:refs});
const jsonTopic=(question,label,id,arrayPath)=>topic(question,label,byId(id),[source('character_elements.json',arrayPath,byId(id).pool.length)]);
const content={
 identity:jsonTopic('Who are they?','Who they are','background.occupation','background.occupation'),
 motivation:jsonTopic('What do they want?','What they want','personality.motivations','personality.motivations'),
 obstacle:jsonTopic('What gets in their way?','What gets in their way','personality.flaws','personality.flaws'),
 personality:jsonTopic('What are they like?','Their personality','trait.0','personality.traits'),
 appearance:topic('What makes them recognizable?','A distinctive detail',byId('appearance.distinctive_features'),[
  source('character_elements.json','appearance.distinctive_features',original.appearance.distinctive_features.length),
  source('additions.js','EXTRA_ELEMENTS.human_distinctive_features',scope.EXTRA_ELEMENTS.human_distinctive_features.length)]),
 hair:jsonTopic('How do they wear their hair?','Hair style','appearance.hair_style','appearance.hair_style'),
 voice:jsonTopic('How do they sound?','Their voice','CHARACTER_SPEECH','CHARACTER_SPEECH'),
 background:topic('What stayed with them?','Their past',byId('extra.formative_joy'),[source('additions.js','EXTRA_ELEMENTS.formative_joy',scope.EXTRA_ELEMENTS.formative_joy.length)]),
 relationship:jsonTopic('Who is on their side?','A connection','relationships.allies','relationships.allies'),
 symbolism:topic('What do they carry with them?','A story spark',byId('extra.signature_possession'),[source('additions.js','EXTRA_ELEMENTS.signature_possession',scope.EXTRA_ELEMENTS.signature_possession.length)])
};
const activity=scope.RightNow.definitions(original).find(f=>f.id==='now.activity');
content.scene=topic('What are they doing right now?','Right now',activity,[source('right-now-data.js','RightNowData.locations → activity arrays',activity.pool.length)]);
const lastAte=scope.Medical.definitions().find(f=>f.id==='medical.lastAte');
content.medical=topic('What did they last eat?','Their last meal',lastAte,[source('medical.js','pools.lastAte',lastAte.pool.length)]);
content.pressure={question:'What will they do under pressure?',label:'A possible scene',fieldId:'workshop.pressure',fieldLabel:'Pressure situation',values:scope.__previewScenes.map(s=>[s.title,s.setup,s.choice,s.stakes,s.question].join('\n\n')),sources:[source('character-tools.js','scenes',scope.__previewScenes.length)]};
// Dialogue instructions are exact properties of the existing structured entries.
const dialogue=scope.Dialogue.definitions().find(f=>f.id==='dialogue.sentence');
content.dialogue={question:'How do they shape a sentence?',label:'Their dialogue',fieldId:dialogue.id,fieldLabel:dialogue.label,values:dialogue.pool.map(entry=>entry.instruction),sources:[source('dialogue-data.js','DialogueData pools → dialogue.sentence → instruction',dialogue.pool.length)]};
for(const [key,pool]of Object.entries(content))if(!pool.values.length||!pool.values.every(v=>typeof v==='string'&&v))throw Error('Invalid source pool: '+key);
const files=['character_elements.json','additions.js','core.js','right-now-data.js','right-now.js','dialogue-data.js','dialogue.js','medical.js','character-tools.js'];
const bundle={schemaVersion:1,content,sourceFingerprints:Object.fromEntries(files.map(file=>[file,crypto.createHash('sha256').update(read(file)).digest('hex')])),foundation:{gender:[...original.basic.gender],heritage:[...original.CHARACTER_NATIONAL_HERITAGE]}};
fs.writeFileSync(path.join(__dirname,'array-pools.json'),JSON.stringify(bundle,null,2)+'\n');
console.log(JSON.stringify({topics:Object.keys(content).length,entries:Object.values(content).reduce((sum,p)=>sum+p.values.length,0),core:Object.fromEntries(['identity','motivation','obstacle'].map(key=>[key,content[key].values.length])),sources:files}));
