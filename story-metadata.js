/* Editable suggestion rules. Source arrays stay unchanged in their JSON files. */
(function(root){
'use strict';
function id(prefix,text){let hash=2166136261;for(const c of String(text)){hash^=c.codePointAt(0);hash=Math.imul(hash,16777619);}return prefix+'-'+(hash>>>0).toString(36);}
const explicit=/\b(?:porn(?:ography)?|masturbation|sex addiction|thinking about sex)\b/i;
// Reviewed all-ages general prompts, identified by their exact source text.
const allAges=new Set([
 'Social isolation despite online connectivity','Environmental concerns and climate anxiety',
 'Digital divide and unequal tech access','Food insecurity and access','Healthcare inequality',
 'Fixing the broken education system','Loss of traditional community',
 'Interacting with simulated personalities','Interacting with robotic entities',
 'Belief and faith in a secular age','Evolving and non-traditional family structures',
 'Loss of personal agency and control','Intergenerational conflicts',
 'Discrimination and systemic prejudice','Declining empathy in society'
]);
function issueRule(text,audience){
 let minAge=audience==='men'||audience==='women'?18:audience==='general'?allAges.has(text)?0:13:8;
 let maxAge=audience==='boys'||audience==='girls'?17:null;
 if(/puberty|period at school|develop earlier|body changes/i.test(text))minAge=Math.max(minAge,10);
 if(/crush|romantic|dating|pressure to date|relationship rivalry|thinking about drugs|gambling|substances|journey away|independent future|relying on your parents|rite of passage/i.test(text))minAge=Math.max(minAge,13);
 const adultOnly=explicit.test(text);if(adultOnly){minAge=18;maxAge=null;}
 const contexts=[];
 if(/fatherhood|motherhood|raising children|co-parenting|postpartum|after childbirth|pregnancy|fertility|loss of a child/i.test(text))contexts.push('parenthood / fertility');
 if(/divorce|co-parenting|after a separation/i.test(text))contexts.push('separation / divorce');
 if(/loss of a spouse|death of a partner/i.test(text))contexts.push('partner bereavement');
 if(/trans woman|trans girl/i.test(text))contexts.push('trans identity');
 if(/queer relationship|feelings for another girl/i.test(text))contexts.push('queer relationships');
 if(/disabilit/i.test(text))contexts.push('disability');
 if(/Blackness|racism|her race/i.test(text))contexts.push('racial identity / prejudice');
 if(/menopause/i.test(text)){minAge=40;contexts.push('menopause');}
 if(/after illness or injury/i.test(text))contexts.push('illness / injury');
 if(/after a controlling relationship/i.test(text))contexts.push('past controlling relationship');
 return {minAge,maxAge,adultOnly,contexts};
}
root.StoryMetadata={id,issueRule,allAges,secondGenreChance:.35,explicit};
})(typeof window==='undefined'?globalThis:window);
