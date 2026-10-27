/* Editable country-language defaults and character language generation. */
(function(root){
'use strict';
const primary='extra.languages',second='extra.language2',third='extra.language3',heritage='CHARACTER_NATIONAL_HERITAGE',none='None';
// One widely used national language / lingua franca per country, not a claim of exclusivity.
// US diaspora entries use the US default. Specific heritage does not require ancestry-language fluency.
const groups={
 English:'White American|Black Texan|White British|Japanese American|Black Washington DC|Australian|Canadian|Native American - Navajo|Chinese American|American|Antiguan|Bahamian|Barbadian|Belizean|British|Gambian|Ghanaian|Grenadian|Guyanese|Irish|Jamaican|Kittitian and Nevisian|Liberian|New Zealander|Nigerian|Northern Irish|Saint Lucian|Scottish|Sierra Leonean|Singaporean|South Sudanese|Trinidadian and Tobagonian|Ugandan|Zambian|Zimbabwean',
 Japanese:'Japanese|Japanese - Ainu',
 'Mandarin Chinese':'Chinese|Taiwanese',
 Mongolian:'Mongolian',Italian:'Italian|San Marinese',
 Spanish:'Mexican|Spanish|Nicaraguan|Argentine|Bolivian|Chilean|Colombian|Costa Rican|Cuban|Dominican|Ecuadorian|Equatorial Guinean|Guatemalan|Hispanic|Honduran|Panamanian|Paraguayan|Peruvian|Salvadoran|Uruguayan|Venezuelan',
 Hindi:'Indian',Dhivehi:'Maldivian',Burmese:'Burmese',
 French:'French|Beninese|Burkinabe|Cameroonian|Central African|Chadian|Congolese|Gabonese|Guinean|Ivorian|Monacan|Nigerien|Senegalese|Togolese',
 Malay:'Bruneian|Malaysian',Dari:'Afghan',Albanian:'Albanian',
 Arabic:'Algerian|Bahraini|Egyptian|Emirati|Iraqi|Jordanian|Kuwaiti|Lebanese|Libyan|Mauritanian|Moroccan|Omani|Palestinian|Qatari|Saudi|Sudanese|Syrian|Tunisian|Yemeni',
 Catalan:'Andorran',Portuguese:'Angolan|Brazilian|Mozambican|Portuguese|Sao Tomean',
 Armenian:'Armenian',German:'Austrian|German|Liechtensteiner|Swiss',Azerbaijani:'Azerbaijani',Bengali:'Bangladeshi',Russian:'Belarusian|Russian',Croatian:'Croatian',Dutch:'Belgian|Dutch|Surinamese',Dzongkha:'Bhutanese',Bosnian:'Bosnian',Setswana:'Botswanan|Motswana',Bulgarian:'Bulgarian',Kirundi:'Burundian',Khmer:'Cambodian',
 'Cape Verdean Creole':'Cape Verdean',Shikomori:'Comorian',Greek:'Cypriot|Greek',Czech:'Czech',Danish:'Danish',Somali:'Djiboutian|Somali',Tigrinya:'Eritrean',Estonian:'Estonian',Amharic:'Ethiopian',Fijian:'Fijian',Filipino:'Filipino',Finnish:'Finnish',Georgian:'Georgian',
 'Haitian Creole':'Haitian',Hungarian:'Hungarian',Icelandic:'Icelander',Indonesian:'Indonesian',Persian:'Iranian',Hebrew:'Israeli',Kazakh:'Kazakhstani',Swahili:'Kenyan|Tanzanian',Kyrgyz:'Kyrgyz',Lao:'Lao',Latvian:'Latvian',Lithuanian:'Lithuanian',Luxembourgish:'Luxembourger',Macedonian:'Macedonian',Malagasy:'Malagasy',Chichewa:'Malawian',Bambara:'Malian',Maltese:'Maltese',Marshallese:'Marshallese',
 'Mauritian Creole':'Mauritian',Chuukese:'Micronesian',Romanian:'Moldovan|Romanian',Montenegrin:'Montenegrin',Sesotho:'Mosotho',Oshiwambo:'Namibian',Nauruan:'Nauruan',Nepali:'Nepalese',Bislama:'Ni-Vanuatu',Korean:'North Korean|South Korean',Norwegian:'Norwegian',Urdu:'Pakistani',Palauan:'Palauan',
 'Tok Pisin':'Papua New Guinean',Polish:'Polish',Kinyarwanda:'Rwandan',Samoan:'Samoan',Serbian:'Serbian',
 'Seychellois Creole':'Seychellois',Slovak:'Slovak',Slovenian:'Slovenian',Pijin:'Solomon Islander',Zulu:'South African',Sinhala:'Sri Lankan',Swati:'Eswatini',Swedish:'Swedish',Tajik:'Tajik',Thai:'Thai',Tetum:'Timorese',Tongan:'Tongan',Turkish:'Turkish',Turkmen:'Turkmen',Tuvaluan:'Tuvaluan',Ukrainian:'Ukrainian',Uzbek:'Uzbek',Vietnamese:'Vietnamese',Welsh:'Welsh'
};
const defaults=Object.fromEntries(Object.entries(groups).flatMap(([language,entries])=>entries.split('|').map(entry=>[entry,language])));
const unset='Not established — choose a main language';
const ids=[primary,second,third],isLanguage=id=>ids.includes(id),isPresent=value=>!!value&&value!==none&&value!==unset;
const value=(s,id)=>s.values[id]?.value||'';
function slot(s,id){return s.values[id]||(s.values[id]={value:'',focused:true,locked:false,kept:false,keptValue:''});}
function pool(extra=root.EXTRA_ELEMENTS){return [...new Set([...extra.languages.filter(x=>!/^A |^An /.test(x)),...Object.keys(groups)])];}
function definitions(extra){const choices=pool(extra);return [{id:primary,label:'Main language',pool:choices},{id:second,label:'Second language',pool:[none,...choices]},{id:third,label:'Third language',pool:[none,...choices]}].map(f=>({group:'Identity',kind:'language',quick:false,...f}));}
function choose(s,excluded=[],random=Math.random){const choices=pool().filter(x=>!excluded.includes(x));return choices[Math.floor(random()*choices.length)];}
function syncPrimary(s){const v=slot(s,primary);if(!v.locked)v.value=(Object.hasOwn(defaults,value(s,heritage))?defaults[value(s,heritage)]:unset);}
function normalize(s,changed){
 // Keep manual/locked counterparts and repair only unlocked generated dependencies.
 const a=slot(s,primary),b=slot(s,second),c=slot(s,third);
 if(changed===second&&!isPresent(b.value)&&!c.locked)c.value=none;
 if(isPresent(c.value)&&!isPresent(b.value)&&!b.locked&&changed!==second)b.value=choose(s,[a.value,c.value]);
 if(isPresent(b.value)&&b.value===a.value&&!b.locked)b.value=choose(s,[a.value,c.value]);
 if(isPresent(c.value)&&[a.value,b.value].includes(c.value)&&!c.locked)c.value=choose(s,[a.value,b.value]);
}
// A single draw gives 55% one language, 32% two, 13% three: 45% have a second.
function rollPair(s,random=Math.random){const n=random(),count=n<.13?3:n<.45?2:1,b=slot(s,second),c=slot(s,third),a=value(s,primary);
 if(!b.locked)b.value=count>=2||isPresent(c.value)&&c.locked?choose(s,[a,c.locked?c.value:''],random):none;
 if(!c.locked)c.value=count===3&&isPresent(b.value)?choose(s,[a,b.value],random):none;
 normalize(s);
}
function roll(f,s){if(slot(s,f.id).locked)return;if(f.id===primary){syncPrimary(s);normalize(s);}else if(f.id===second)rollPair(s);else{const c=slot(s,third),b=slot(s,second);c.value=Math.random()<.13&&(!b.locked||isPresent(b.value))?choose(s,[value(s,primary),b.value]):none;normalize(s);}}
function reconcile(s,changed){if(changed===heritage)syncPrimary(s);if(changed===heritage||isLanguage(changed))normalize(s,changed);}
function migrate(s){const missing=ids.filter(id=>!s.values[id]);if(!missing.length)return s;
 const oldSecond=!!s.values[second],oldThird=!!s.values[third];for(const id of missing)slot(s,id);
 if(missing.includes(primary)||!oldSecond&&!oldThird)syncPrimary(s);
 if(!oldSecond&&!oldThird)rollPair(s);
 else if(!oldSecond)slot(s,second).value=isPresent(value(s,third))?choose(s,[value(s,primary),value(s,third)]):none;
 else if(!oldThird)slot(s,third).value=none;
 return s;
}
function context(s){return ids.map(id=>value(s,id)).filter(isPresent).join('; ')||'No language established';}
function warnings(s){const out=[],a=value(s,primary),b=value(s,second),c=value(s,third),expected=Object.hasOwn(defaults,value(s,heritage))?defaults[value(s,heritage)]:null;
 if(expected&&a!==expected)out.push('Main language differs from the heritage default. Your custom or locked language is preserved.');
 if(!expected)out.push('Choose a main language for this custom heritage / background.');
 if(isPresent(c)&&!isPresent(b))out.push('A third language needs a second language. A locked or custom value has been preserved for review.');
 if(isPresent(b)&&b===a||isPresent(c)&&[a,b].includes(c))out.push('Language fields contain duplicates. Unlock or edit the repeated language.');return out;}
root.Languages={primary,second,third,heritage,none,defaults,ids,isLanguage,isPresent,pool,definitions,syncPrimary,rollPair,roll,reconcile,migrate,context,warnings};
})(typeof window==='undefined'?globalThis:window);
