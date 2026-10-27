(function(root){
'use strict';
const C=root.CharacterCore,pick=C.pick;
// Fiction-writing references, not prevalence estimates or treatment plans.
const conditions=[
 {name:'No known ongoing condition',type:'None',medications:['No regular medication']},
 {name:'Unknown / not established',type:'Unknown',medications:['Medication history unknown']},
 {name:'Seasonal allergies',type:'Common',medications:['Cetirizine — for allergy symptoms']},
 {name:'Asthma',type:'Common',medications:['Albuterol inhaler — for asthma symptoms; other maintenance treatment not established']},
 {name:'Type 2 diabetes',type:'Common',minAge:20,medications:['Metformin — for type 2 diabetes']},
 {name:'Hypothyroidism',type:'Common',medications:['Levothyroxine — thyroid hormone replacement']},
 {name:'Sickle cell disease',type:'Rare',medications:['Hydroxyurea — to reduce sickling and complications']},
 {name:'Cystic fibrosis',type:'Rare',medications:['CFTR modulator — only if eligible for the character’s CFTR variant; exact medicine not established']},
 {name:'Wilson disease',type:'Rare',medications:['Trientine — copper chelation for Wilson disease']},
 {name:'Myasthenia gravis',type:'Rare',medications:['Pyridostigmine — for myasthenia gravis symptoms']}
];
const pools={
 lastAte:['Oatmeal with fruit','Eggs and toast','Rice and beans','A bowl of noodle soup','A cheese sandwich','Grilled fish and vegetables','Pasta with tomato sauce','Lentil curry and rice','A slice of pizza','Yogurt and a banana','An apple and a handful of nuts','A packet of crackers','Leftovers eaten cold','A shared meal made by someone they love','A hurried snack between obligations','A meal they could barely taste','Unknown / not established'],
 foodFeeling:['Satisfied and comfortably full','Still hungry; it was not enough','Pleasantly reminded of home','Grateful someone made it for them','Disappointed by the taste','Pleased they tried something new','Indifferent; it was simply fuel','Uncomfortably full','A little nauseated','Annoyed they had to eat in a hurry','Worried about when they will eat again','Looking forward to eating the same thing again','Wishing they had chosen something else','Relieved to have finally eaten','Unknown / not established']
};
function definitions(){return [
 {id:'medical.height',label:'Precise height',numeric:'height'},
 {id:'medical.weight',label:'Weight',numeric:'weight'},
 {id:'medical.weightStatus',label:'Weight category',kind:'medicalDerived'},
 {id:'medical.condition',label:'Condition / medical history',pool:conditions.map(c=>c.name)},
 {id:'medical.medications',label:'Medications',pool:null},
 {id:'medical.lastAte',label:'Last ate',pool:pools.lastAte},
 {id:'medical.hoursSinceFood',label:'Hours since last eating',numeric:'hours'},
 {id:'medical.foodFeeling',label:'How they feel about what they ate',pool:pools.foodFeeling}
 ].map(f=>({group:'Medical',kind:'medical',quick:false,...f}));}
const read=(s,id)=>s.values[id]?.value||'';
function slot(s,id){return s.values[id]||(s.values[id]={value:'',focused:true,locked:false,kept:false,keptValue:''});}
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
function heightText(inches){const total=round(inches),feet=Math.floor(total/12);return `${feet}'${round(total-feet*12)}" · ${total} inches · ${round(total*2.54)} cm`;}
function weightText(lb){return `${round(lb)} lb · ${round(lb*.45359237)} kg`;}
function height(s){const m=read(s,'medical.height').match(/· ([\d.]+) inches/);return m?Number(m[1]):NaN;}
function weight(s){return Number(read(s,'medical.weight').match(/^([\d.]+) lb/)?.[1]||NaN);}
function age(s){return C.ageAt(read(s,'birthday'),s.settings.storyYear,s.settings.storyDate);}
// Broad narrative ranges, scaled for young characters; these are not growth charts.
const bands=[['Very Short',48,57.99],['Short',58,61.99],['Below Average',62,64.99],['Average',65,69.99],['Above Average',70,72.99],['Tall',73,76.99],['Very Tall',77,84]];
function scale(s){const a=age(s);return a!==null&&a>=0&&a<18? a<=12?(32+2.5*a)/67:.94+(a-13)*.012:1;}
function descriptor(s,inches=height(s)){const n=inches/scale(s);return bands.find((b,i)=>n<(bands[i+1]?.[1]||Infinity))?.[0];}
function condition(s){return conditions.find(c=>c.name===read(s,'medical.condition'));}
function medications(s){return condition(s)?.medications||['Not established — add medication details for this custom condition'];}
function refresh(s){const h=height(s)*.0254,kg=weight(s)*.45359237,a=age(s);let text;
 if(a===null||a<0)text='Not classified — age not established';
 else if(a<20||(!s.settings.storyDate&&a===20))text='Not classified — adult BMI reference requires a confirmed age of 20+';
 else if(read(s,'basic.race')!=='Human')text='Not classified — adult human BMI reference does not cover this species / kind';
 else if(!(h>0&&kg>0))text='Not classified — enter a precise height and weight';
 else{const bmi=kg/(h*h),label=bmi<18.5?'Underweight':bmi<25?'At ideal weight':bmi<30?'Overweight':'Obese';text=`${label}\nBMI ${bmi.toFixed(1)} · adult human reference; “ideal” means the BMI reference range, not an individual health assessment.`;}
 slot(s,'medical.weightStatus').value=text;
}
function roll(f,s){const v=slot(s,f.id);if(v.locked||f.kind==='medicalDerived')return;
 if(f.numeric==='height'){const band=bands.find(b=>b[0]===read(s,'appearance.height'))||bands[3];const lo=Math.ceil(band[1]*scale(s)*10),hi=Math.floor(band[2]*scale(s)*10);v.value=heightText((lo+Math.floor(Math.random()*(hi-lo+1)))/10);}
 else if(f.numeric==='weight'){const a=age(s),bmi=pick(a!==null&&a<20?[15,16,17,18,19,20]:[17,18,20,21,22,23,24,26,28,31,34,38]);v.value=weightText(Math.round(bmi*Math.pow((height(s)||67)*.0254,2)/.45359237));}
 else if(f.numeric==='hours')v.value=pick([0,.25,.5,1,1.5,2,3,4,5,6,8,10,12,16,24])+' hours';
 else if(f.id==='medical.condition'){const a=age(s),available=conditions.filter(c=>!c.minAge||a!==null&&a>=c.minAge);const group=pick(['None','None','Unknown','Common','Common','Common','Rare']);v.value=pick(available.filter(c=>c.type===group)).name;}
 else if(f.id==='medical.medications')v.value=pick(medications(s));
 else v.value=pick(f.pool);
 refresh(s);
}
function reconcile(s,changed){
 if(changed==='appearance.height')roll(definitions()[0],s);
 if(changed==='medical.height'&&!slot(s,'appearance.height').locked)slot(s,'appearance.height').value=descriptor(s);
 if(changed==='medical.condition')roll(definitions().find(f=>f.id==='medical.medications'),s);
 refresh(s);
}
function rollAppearance(s,f){const v=slot(s,f.id);if(v.locked)return;v.value=slot(s,'medical.height').locked&&Number.isFinite(height(s))?descriptor(s):pick(f.pool);}
function migrate(s){for(const f of definitions())if(!s.values[f.id]){slot(s,f.id);roll(f,s);}refresh(s);return s;}
function edit(f,s,raw,unit){let n;
 if(f.numeric==='height'){
  if(unit==='us'){const m=raw.trim().match(/^(\d+)\s*['′]\s*(\d+(?:\.\d+)?)\s*["″]?$/);if(!m||Number(m[2])>=12)throw Error('Use feet and inches, such as 5\'7", with inches below 12.');n=Number(m[1])*12+Number(m[2]);}
  else{if(!raw.trim())throw Error('Enter a height.');n=Number(raw)/(unit==='cm'?2.54:1);}
  if(!Number.isFinite(n)||n<1||n>1200)throw Error('Enter a positive height from 1 to 1200 inches.');
  slot(s,f.id).value=heightText(n);
 }else if(f.numeric==='weight'){
  n=raw.trim()?Number(raw)/(unit==='kg'?.45359237:1):NaN;if(!Number.isFinite(n)||n<.1||n>100000)throw Error('Enter a positive weight from 0.1 to 100000 pounds.');slot(s,f.id).value=weightText(n);
 }else if(f.numeric==='hours'){
  n=raw.trim()?Number(raw):NaN;if(!Number.isFinite(n)||n<0||n>100000)throw Error('Enter hours as a number from 0 to 100000.');slot(s,f.id).value=round(n)+' hours';
 }else slot(s,f.id).value=raw;
 reconcile(s,f.id);
}
function warnings(s){const out=[];if(Number.isFinite(height(s))&&bands.some(b=>b[0]===read(s,'appearance.height'))&&read(s,'appearance.height')!==descriptor(s))out.push('Appearance height and precise height differ. A locked value has been preserved; edit or unlock it to align them.');
 const c=condition(s),med=read(s,'medical.medications');if(c&&!c.medications.includes(med))out.push('Medication details differ from the condition’s reference prompt. Review custom details or unlock and reroll medications.');return out;}
root.Medical={conditions,pools,definitions,heightText,weightText,height,weight,descriptor,age,refresh,roll,reconcile,rollAppearance,migrate,edit,warnings};
})(typeof window==='undefined'?globalThis:window);
