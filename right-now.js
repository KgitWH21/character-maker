(function(root){
'use strict';
const D=root.RightNowData,P=D.pools,pick=a=>a[Math.floor(Math.random()*a.length)],integer=(lo,hi)=>lo+Math.floor(Math.random()*(hi-lo+1));
const defaults={footprint:'No preset / unrestricted',perspective:'Author',momentMode:'Independent',resolvedFootprint:'No preset / unrestricted'};
function settings(s){const out={...defaults,...s};if(![...Object.keys(D.archetypes),'Random archetype'].includes(out.footprint))throw Error('Invalid footprint archetype.');if(!['Author','The character','Another person / observer'].includes(out.perspective))throw Error('Invalid perspective.');if(!['Independent','Connected moment'].includes(out.momentMode))throw Error('Invalid moment mode.');if(!D.archetypes[out.resolvedFootprint])out.resolvedFootprint=defaults.resolvedFootprint;return out;}
function definitions(original){
 const fields=[];
 const add=(key,label,group,pool,options={})=>fields.push({id:'now.'+key,label,group,kind:'rightNow',pool:typeof pool==='string'?P[pool]:pool,...options});
 const privateField={private:true};
 add('setting','Current location · broad setting','Here & Now',Object.keys(D.locations));
 add('spot','Current location · specific spot','Here & Now',Object.values(D.locations).flat().map(r=>r[0]),{quick:true});
 add('activity','Current activity','Here & Now',Object.values(D.locations).flat().flatMap(r=>r[1]),{quick:true});
 add('circumstance','Immediate circumstance','Here & Now','circumstance');
 add('locationImpression','Location · their perception','Here & Now',null,{perception:'location',...privateField});
 for(const [key,label,pool] of [['thoughtType','Thought · type','thought_type'],['thoughtSubject','Thought · subject','thought_subject'],['thoughtForm','Thought · form','thought_form'],['thought','Latest thought · fragment','thought_fragment'],['goal','Immediate goal','goal'],['next','Next intended action','next_action'],['when','Next action · when','next_when'],['obstacle','Next action · possible obstacle','obstacle'],['impulse','Competing impulse','impulse']])add(key,label,'Here & Now',pool,{...privateField,quick:['goal','next'].includes(key)});
 add('obligationImpression','Upcoming obligation · their perception','Here & Now',null,{perception:'obligation',...privateField});
 add('completed','Action just completed','Here & Now','completed');
 add('device','Device situation','Body & Device','device');
 for(const [key,label] of [['heart','Heart rate'],['sleep','Recent sleep duration'],['steps','Steps today'],['movement','Time since meaningful movement'],['battery','Battery remaining'],['freshness','Reading age / freshness']])add(key,'Fictional reading · '+label,'Body & Device',key==='freshness'?'freshness':null,{telemetry:true,source:'digital'});
 add('sensation','Bodily sensation · independent of device','Body & Device','sensation',privateField);
 for(let i=1;i<=2;i++)for(const [key,label,pool] of [['format','Format','media_format'],['extent','Extent','media_extent'],['subject','Subject','media_subject'],['elapsed','Time since consumption','elapsed'],['impression','Their impression',null],['effect','Emotional effect','effect'],['lingered','What lingered','lingered']])add('media'+i+'.'+key,'Media '+i+' · '+label,'Media',pool,{source:'media',private:['impression','effect','lingered'].includes(key),...(key==='impression'?{perception:'media'}:{})});
 for(const [key,label,pool] of [['partner','Partner / relationship','partner'],['method','Communication method','method'],['elapsed','Time since conversation','elapsed'],['subject','Subject','conversation_subject'],['impression','Their impression',null],['ending','How it ended','ending']])add('conversation.'+key,'Conversation · '+label,'Conversation',pool,{source:'conversation',private:key==='impression',...(key==='impression'?{perception:'conversation'}:{})});
 for(let i=1;i<=2;i++)for(const [key,label,pool] of [['observer','Observer','observer'],['location','Observed location','sight_location'],['elapsed','Time ago','elapsed'],['activity','Observed activity','sight_activity'],['recording','Record / source','recording'],['noticed','Observed detail','noticed'],['missed','Outside the observation','missed'],['interpretation','Observer’s interpretation','interpretation'],['reliability','Reliability / uncertainty','reliability']])add('sighting'+i+'.'+key,'Sighting '+i+' · '+label,'Last Seen',pool,{source:'sighting'});
 add('status.type','Stated status · type','Stated Status','status_type',{source:'status'});
 add('status.words','Stated status · their words','Stated Status',Object.keys(P).filter(k=>k.startsWith('stated_status_')).flatMap(k=>P[k]),{quick:true,source:'status'});
 for(const [key,label,pool] of [['channel','Where / how stated','status_channel'],['audience','Audience','audience'],['elapsed','Time since statement','elapsed'],['delivery','Author-only delivery / intention','delivery']])add('status.'+key,'Stated status · '+label,'Stated Status',pool,{source:'status',private:key==='delivery',authorOnly:key==='delivery'});
 for(const [key,label,pool] of [['unanswered','Unanswered communication','unanswered'],['object','Object in hand, pocket, or bag','object'],['constraint','Time constraint','constraint'],['interruption','Recent interruption','interruption'],['attention','What keeps attracting their attention','attention']])add(key,label,'Immediate Context',pool,{private:key==='attention',...(key==='unanswered'?{source:'digital'}:{})});
 return fields;
}
const value=(s,key)=>s.values['now.'+key]?.value;
function rule(s){return D.archetypes[s.settings.footprint==='Random archetype'?s.settings.resolvedFootprint:s.settings.footprint]||D.archetypes[defaults.footprint];}
function begin(s){s.settings=settings(s.settings);s.settings.resolvedFootprint=s.settings.footprint==='Random archetype'?pick(Object.keys(D.archetypes).filter(k=>k!==defaults.footprint)):s.settings.footprint;}
function deviceState(s){const d=value(s,'device');return d==='No device'?'No device':d==='Device off'?'Unavailable':d==='Battery depleted'?'Unavailable':null;}
function sourceProbability(f,s){const r=rule(s);if(f.source==='digital')return r.digital;if(f.source==='conversation')return /call|Text|message|chat/i.test(value(s,'conversation.method'))?r.digital:r.human;if(f.source==='sighting'){const base=f.id.split('.').slice(1,2)[0];return /camera/i.test(value(s,base+'.observer'))?r.digital:r.human;}if(f.source==='status')return /text|chat|profile|voicemail|call|post/i.test(value(s,'status.channel'))?r.digital:r.human;if(f.source==='media'){const base=f.id.split('.')[1];return /video|Web|Livestream|Social|Voice/i.test(value(s,base+'.format'))?r.digital:Math.max(r.human,.65);}return 1;}
function perception(kind,original){
 // Draw from the untouched arrays: duplicate entries keep their original odds.
 const roll=Math.random();
 if(roll<.45)return 'They found it '+pick(P['descriptor_'+kind])+'.';
 if(roll<.75&&kind==='location')return 'The place reminded them of someone they would call “'+pick(original.personality.traits)+'”.';
 if(roll<.75)return 'To them, the '+({media:'voice behind it',conversation:'other voice',location:'atmosphere recalled someone',obligation:'person behind the request'}[kind])+' felt “'+pick(original.personality.traits)+'”.';
 return 'Their private story-label for it: “'+pick(original.STORY_DESCRIPTOR)+'”.';
}
function generate(f,s,original){
 const key=f.id.slice(4),r=rule(s),connected=s.settings.momentMode==='Connected moment';let result;
 if(key==='device')result=Math.random()<r.device?pick(P.device.slice(0,2)):pick(P.device.slice(2));
 else if(f.telemetry){const absent=deviceState(s);if(absent)result=key==='battery'&&value(s,'device')==='Battery depleted'?'0%':absent;else result=({heart:()=>integer(38,175)+' bpm',sleep:()=> (integer(0,140)/10).toFixed(1)+' hours',steps:()=>integer(0,r.lowMovement?1800:26000)+' steps',movement:()=>integer(r.lowMovement?60:0,360)+' minutes',battery:()=>integer(1,100)+'%',freshness:()=>pick(P.freshness)})[key]();}
 else if(key==='spot'&&connected)result=pick(D.locations[value(s,'setting')]||Object.values(D.locations).flat())[0];
 else if(key==='activity'&&connected){const row=Object.values(D.locations).flat().find(row=>row[0]===value(s,'spot'));result=pick(row?row[1]:f.pool);}
 else if(key==='next'&&connected)result=pick(D.goalActions[value(s,'goal')]||P.next_action);
 else if(key==='conversation.method'&&connected)result=value(s,'conversation.partner')==='Self / self-talk'?'Self-talk':pick(P.method.filter(m=>m!=='Self-talk'));
 else if(key==='status.words')result=pick(P['stated_status_'+String(value(s,'status.type')).toLowerCase()]||f.pool);
 else if(/sighting\d.recording/.test(key)&&/camera/i.test(value(s,key.split('.')[0]+'.observer')))result=pick(['A timestamped clip','A blurry still image']);
 else if(/sighting\d.interpretation/.test(key)&&/camera/i.test(value(s,key.split('.')[0]+'.observer')))result='No interpretation — camera records observable behavior only';
 else if(f.perception)result=perception(f.perception,original);
 else if(key.endsWith('.elapsed'))result=pick(Math.random()<r.recent?P.elapsed.slice(0,4):P.elapsed.slice(4));
 else result=pick(f.pool);
 const info=f.source&&!f.private&&Math.random()>sourceProbability(f,s)?pick(r.missing||D.informationStates):'Available';
 return {value:result,information:info};
}
function roll(f,s,original){const v=s.values[f.id];if(v.locked)return;Object.assign(v,generate(f,s,original));v.focused=Math.random()<s.settings.focusDensity;}
function reconcile(s,fields,original,changed){
 const connected=s.settings.momentMode==='Connected moment';const reroll=key=>{const f=fields.find(f=>f.id==='now.'+key);if(f)roll(f,s,original);};
 if(changed==='now.device')for(const f of fields.filter(f=>f.telemetry))roll(f,s,original);
 if(changed==='now.status.type')reroll('status.words');
 if(/^now.sighting\d.observer$/.test(changed)){const base=changed.slice(4).split('.')[0];reroll(base+'.recording');reroll(base+'.interpretation');}
 if(!connected)return;
 if(changed==='now.setting'){const rows=D.locations[value(s,'setting')];if(rows&&!rows.some(r=>r[0]===value(s,'spot')))reroll('spot');}
 if(['now.setting','now.spot'].includes(changed)){const row=Object.values(D.locations).flat().find(r=>r[0]===value(s,'spot'));if(row&&!row[1].includes(value(s,'activity')))reroll('activity');}
 if(changed==='now.goal')reroll('next');
 if(changed==='now.conversation.partner')reroll('conversation.method');
}
function migrate(s,original){s.settings=settings(s.settings);const defs=definitions(original);if(!s.values['now.setting'])begin(s);for(const f of defs)if(!s.values[f.id]){s.values[f.id]={value:'',focused:true,locked:false,kept:false,keptValue:''};roll(f,s,original);}return s;}
function projection(f,s){const v=s.values[f.id],perspective=s.settings.perspective;
 if(f.telemetry&&deviceState(s))return value(s,'device')==='Battery depleted'&&f.id==='now.battery'?'0%':deviceState(s);
 if(perspective!=='Author'&&f.authorOnly)return 'Unavailable — author-only intention';
 if(perspective==='Another person / observer'&&!f.source&&!f.private)return 'Unavailable — no observation source for this detail';
 if(perspective==='Another person / observer'&&f.private)return 'Unavailable — private experience, not observed evidence';
 if(v.information&&v.information!=='Available'&&(perspective!=='Author'||!f.private))return v.information+(v.information==='Outdated'?' — source is not current':'');
 if(/now\.sighting\d\.interpretation/.test(f.id)&&/camera/i.test(value(s,f.id.split('.')[1]+'.observer')))return 'No interpretation — camera records observable behavior only';
 return v.value;
}
function warnings(s){const issues=[];if(s.settings.momentMode==='Connected moment'){
 const rows=D.locations[value(s,'setting')],row=Object.values(D.locations).flat().find(r=>r[0]===value(s,'spot'));
 if(rows&&!rows.some(r=>r[0]===value(s,'spot')))issues.push('Setting and spot differ');
 if(row&&!row[1].includes(value(s,'activity')))issues.push('Spot and activity differ');
 const actions=D.goalActions[value(s,'goal')];if(actions&&!actions.includes(value(s,'next')))issues.push('Goal and next action differ');
 if((value(s,'conversation.partner')==='Self / self-talk')!==(value(s,'conversation.method')==='Self-talk'))issues.push('Partner and method differ');
 }if(deviceState(s)&&Object.entries(s.values).some(([id,v])=>/^now\.(heart|sleep|steps|movement|battery|freshness)$/.test(id)&&v.locked&&!['No device','Unavailable','0%'].includes(v.value)))issues.push('Locked readings retained as author details; no current device readings available');
 return issues;
}
root.RightNow={defaults,settings,definitions,begin,roll,reconcile,migrate,projection,warnings,deviceState};
})(typeof window==='undefined'?globalThis:window);
