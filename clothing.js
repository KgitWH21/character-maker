/* Occasion labels match the linked wardrobe picker's native select options.
 * Source index.html blob: 2444e5065304c201e090896e7ee8a0c70dcd8bfc.
 */
(function(root){
'use strict';
const FIELD='appearance.clothingStyle',PICKER='https://kgitwh21.github.io/clothing-picker/';
const occasions=[
 {id:'casual',label:'Casual / everyday'},
 {id:'work',label:'Work / professional'},
 {id:'formal',label:'Formal / evening'},
 {id:'outdoor',label:'Outdoor / travel'},
 {id:'active',label:'Activewear / sports'},
 {id:'sleep',label:'Sleepwear / loungewear'},
 {id:'fantasy',label:'Fantasy / armor'}
];
function definitions(){return [{id:FIELD,label:'Preferred clothing style',group:'Appearance',pool:occasions.map(o=>o.label),kind:'pool',quick:false}];}
const normalized=value=>String(value??'').trim().toLowerCase();
function occasion(value){return occasions.find(o=>normalized(o.label)===normalized(value)||o.id===normalized(value))?.id||null;}
function presentation(value){const gender=normalized(value);return gender==='male'?'m':gender==='female'?'f':'any';}
function gender(s){const v=s.values['basic.gender'];return v?.kept?v.keptValue:v?.value||'';}
function url(s,{kept=false}={}){const v=s.values[FIELD],value=kept?v?.keptValue:v?.value,selected=occasion(value);if(!selected)return null;return PICKER+'?occasion='+encodeURIComponent(selected)+'&presentation='+presentation(gender(s));}
function migrate(s){
 if(!s.values[FIELD]){
  let seed=2166136261;for(const c of [s.name||'',s.values.birthday?.value||'',FIELD].join('|')){seed^=c.codePointAt(0);seed=Math.imul(seed,16777619);}seed>>>=0;
  s.values[FIELD]={value:occasions[seed%occasions.length].label,focused:((seed>>>8)/16777216)<(s.settings.focusDensity??.6),locked:false,kept:false,keptValue:''};
 }
 return s;
}
root.Clothing={FIELD,PICKER,occasions,definitions,occasion,presentation,gender,url,migrate};
})(typeof window==='undefined'?globalThis:window);
