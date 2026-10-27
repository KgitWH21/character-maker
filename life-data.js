/* Editable story pools. Education weights and individual histories are fictional conventions. */
(function(root){
'use strict';
const list=text=>text.split('|');
const educationLevels=[
 {name:'No formal schooling',min:0,rank:0,weight:2},
 {name:'Early childhood education',min:3,max:6,rank:0,weight:6},
 {name:'Primary school in progress',min:5,max:12,rank:0,weight:20},
 {name:'Primary school completed',min:11,rank:0,weight:2},
 {name:'Secondary school in progress',min:12,max:19,rank:0,weight:20},
 {name:'High school dropout',min:16,rank:0,weight:6},
 {name:'High school diploma',min:17,rank:0,weight:20},
 {name:'GED / secondary-equivalency credential',min:17,rank:0,weight:5},
 {name:'Some college, no completed degree',min:18,rank:0,weight:16},
 {name:'Trade / vocational certificate',min:18,rank:0,weight:10},
 {name:'Completed apprenticeship',min:18,rank:0,weight:8},
 {name:'Associate degree',min:20,rank:1,weight:8},
 {name:'Bachelor’s degree',min:21,rank:2,weight:18},
 {name:'Graduate certificate / diploma',min:22,rank:3,weight:4},
 {name:'Master’s degree',min:23,rank:3,weight:9},
 {name:'Professional degree',min:24,rank:3,weight:3},
 {name:'Doctoral degree',min:26,rank:4,weight:3}
];
const subjects={
 college:list('Accounting|Agriculture|Anthropology|Architecture|Art history|Biology|Business administration|Chemistry|Civil engineering|Communications|Computer science|Criminal justice|Culinary arts|Early childhood education|Economics|Electrical engineering|English literature|Environmental science|Film studies|Fine arts|Graphic design|History|Hospitality management|Information technology|Journalism|Linguistics|Mathematics|Mechanical engineering|Music|Nursing|Philosophy|Physics|Political science|Psychology|Public health|Religious studies|Social work|Sociology|Theatre|Urban planning|Veterinary technology'),
 graduate:list('Applied mathematics|Architecture|Artificial intelligence|Biomedical engineering|Business administration|Chemistry|Clinical psychology|Computer science|Creative writing|Data science|Education|Environmental policy|Finance|Fine arts|History|International relations|Law|Library and information science|Linguistics|Medicine|Music performance|Nursing|Philosophy|Physics|Public administration|Public health|Social work|Statistics|Urban planning'),
 doctoral:list('Anthropology|Applied mathematics|Astrophysics|Biochemistry|Biomedical engineering|Chemical engineering|Clinical psychology|Computer science|Ecology|Economics|Education|English literature|History|Linguistics|Materials science|Molecular biology|Musicology|Neuroscience|Philosophy|Physics|Political science|Public health|Religious studies|Sociology|Statistics')
};
const studentStatus=list('Not currently studying|Current full-time student|Current part-time student|Taking a break|On an approved leave of absence|Admission pending|Waiting for funding|Enrollment deferred|Administrative hold — unresolved paperwork|Readmission pending|Transferring between institutions|Thesis / dissertation in progress|Awaiting degree conferral|Continuing education while working|Studying independently');
const trades=list('None|Electrician|Plumber|Carpenter|Welder|HVAC technician|Automotive mechanic|Diesel mechanic|Appliance repair|CNC machinist|Cabinetmaker|Solar-panel installer|Network cabling technician|Baker|Cook|Barber|Hair stylist|Tailor / dressmaker|Dental assistant|Emergency medical technician|Firefighter training|Commercial driving|Building maintenance|Locksmith|Jewelry repair|Photography|Bookkeeping|Self-taught software development|Audio engineering|Heavy-equipment operation');
const educationFeelings=list('Proud of what they achieved|Content with the path they took|Regrets leaving school early|Wishes they had studied something else|Frustrated by the cost|Grateful for a teacher who believed in them|Embarrassed by gaps in their education|Resents academic gatekeeping|Feels their practical skills are undervalued|Excited to keep learning|Burned out by formal education|Uncertain whether the degree was worth it|Determined to return someday|Quietly proud of being self-taught|Feels overqualified for their current work|Feels underprepared despite their qualifications|At peace with an unconventional path|Competitive about credentials|Treats learning as a lifelong habit|Prefers practical experience to classrooms');
const sexViews=list('Abstains for religious reasons|Abstains for personal reasons|Waiting for marriage|Chooses celibacy|Sex-averse|Sex-indifferent|Values emotional connection before sex|Views sex as private and deeply personal|Views sex as playful and affectionate|Comfortable discussing boundaries openly|Prefers an established committed relationship|Open to casual relationships with clear mutual consent|Curious but cautious|Treats sex as a spiritual connection|Separates sexual attraction from romantic attachment|Wants intimacy but feels uncertain about it|Has a high desire for sex|Frequently seeks sexual novelty|Compulsively pursues sex and feels out of control');
const tiers=list('F|D|C|B|A|S-tier');
root.LifeData={educationLevels,subjects,studentStatus,trades,educationFeelings,sexViews,tiers,
 marriageSource:{title:'ONS: Marital status by age, England, 2025 (all persons; published 31 July 2026)',url:'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/datasets/populationestimatesbymaritalstatusandlivingarrangementsengland/current',workbook:'maritalstatuslivingarrangements2002to2025england.xlsx',sheet:'1',note:'One minus the observed never-married-or-civil-partnered share. Includes civil partnerships. This is an England reference, not a worldwide probability. Suppressed young-adult divorce/widow cells make the 18–24 estimate a lower bound.'},
 marriage:[{"minAge":18,"maxAge":24,"never":4812716,"married":73560,"civilPartnered":14344,"divorced":null,"widowed":null,"everPartneredProbability":0.017937322216372623,"divorcedAmongEverPartnered":0.0,"lowerBound":true},{"minAge":25,"maxAge":44,"never":7983045,"married":7406972,"civilPartnered":161668,"divorced":392259,"widowed":29991,"everPartneredProbability":0.5002455562765217,"divorcedAmongEverPartnered":0.04908827427232761,"lowerBound":false},{"minAge":45,"maxAge":64,"never":2851538,"married":9698602,"civilPartnered":163443,"divorced":1759900,"widowed":294781,"everPartneredProbability":0.8069144755267105,"divorcedAmongEverPartnered":0.1476831807662608,"lowerBound":false},{"minAge":65,"maxAge":9999,"never":801946,"married":6459125,"civilPartnered":54330,"divorced":1551679,"widowed":2367312,"everPartneredProbability":0.9286168757508194,"divorcedAmongEverPartnered":0.14873587651448184,"lowerBound":false}],
 fertility:{value:2.25,year:2024,title:'UN World Population Prospects / World Fertility 2024',url:'https://www.un.org/development/desa/pd/node/4354',note:'Period total fertility is births per woman under a synthetic age-specific schedule, not an individual child-count distribution. The generator uses an explicitly fictional age-adjusted Poisson model anchored to this value, for all character genders; unknown counts are a separate authoring choice.'}
};
})(typeof window==='undefined'?globalThis:window);
