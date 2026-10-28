import assert from 'node:assert/strict';
import {profileFacts,questionApplies} from '../src/question-relevance.js';
import {ITEMS} from '../src/listening-data.js';
const profile=(current='',intro='',past='',future='',leisure='')=>({id:'student',modules:[intro,past,current,leisure,"J’apprends le français depuis trois mois.",future].map(text=>({paragraphs:[{text}]}))});
const allowed=(p,id)=>questionApplies(ITEMS.find(x=>x.id===id),profileFacts(p));
const worker=profile('Actuellement, je travaille dans une entreprise de logistique.','','J’étais étudiante à Pékin.','Je voudrais travailler dans le soutien informatique.');
for(const id of ['12-0','13-0','15-0','27-0','28-0','32-0'])assert.equal(allowed(worker,id),false,id);
for(const id of ['14-0','13-2','15-1','11-0'])assert.equal(allowed(worker,id),true,id);
const student=profile('Je suis étudiante en éducation à la petite enfance.','','Avant, j’étais enseignante.','J’aimerais travailler dans une garderie.');
for(const id of ['14-0','13-2','15-1','32-0'])assert.equal(allowed(student,id),false,id);
for(const id of ['12-0','13-0','15-0','27-0','28-0'])assert.equal(allowed(student,id),true,id);
const both=profile('Je travaille à temps partiel et j’étudie en informatique.');
assert.equal(profileFacts(both).working,true);assert.equal(profileFacts(both).studying,true);
assert.equal(allowed(both,'14-0'),true);assert.equal(allowed(both,'27-0'),true);
for(const text of ['Je suis des cours de français.','J’étudie le français avec une professeure.','Je travaille mon français chaque jour.']){const f=profileFacts(profile(text));assert.equal(f.studying,false,text);assert.equal(f.working,false,text)}
for(const text of ['Je ne travaille plus.','Je suis à la retraite.','Je voudrais travailler dans une entreprise.','Je travaillais comme enseignante.'])assert.equal(profileFacts(profile(text)).working,false,text);
for(const text of ['Je ne suis plus étudiante.','J’ai terminé mes études.','Je voudrais reprendre mes études.'])assert.equal(profileFacts(profile(text)).studying,false,text);
assert.equal(profileFacts(profile('Je termine mes études cette année.')).studying,true);
assert.equal(profileFacts(profile('Je suis enseignante à l’université.')).working,true);
assert.equal(profileFacts(profile('Je fais du soutien informatique.')).working,true);
for(const intro of ['J’habite avec mon mari et ma fille.','Nous avons deux enfants.','Je suis maman de deux enfants.'])assert.equal(allowed(profile('',intro),'32-0'),true,intro);
for(const p of [profile('Je travaille avec des enfants.'),profile('','Je n’ai pas d’enfants.'),profile('','','','J’aimerais avoir des enfants.')])assert.equal(allowed(p,'32-0'),false);
assert.equal(allowed(profile('','','','','J’aime cuisiner.'),'19-0'),true);
assert.equal(allowed(profile('','','','','J’aime lire.'),'19-0'),false);
assert.equal(allowed(profile('','','','','Je joue au tennis trois fois par semaine.'),'18-1'),true);
assert.equal(allowed(profile('','','','','Je ne fais pas de sport.'),'18-1'),false);
for(const item of ITEMS)assert.equal(questionApplies(item,profileFacts(null)),true);
// All equivalent formulations and contextual follow-ups obey the same requirements.
const wf=profileFacts(worker),sf=profileFacts(student);
for(const item of ITEMS){if(['27','28','12'].includes(item.group))assert.equal(questionApplies(item,wf),false);if(item.group==='14')assert.equal(questionApplies(item,sf),false);if(item.group==='short'&&item.intent.includes('毕业'))assert.equal(questionApplies(item,wf),false)}
console.log('Passed: current work/study, dual status, past/future, language courses, children, dependent topics, equivalent forms, and generic mode.');
// Exercise the actual controller: profile changes must invalidate an in-progress
// quiz, and learn/quiz/review must all draw from the personalized pool.
const nodes=new Map();
const node=id=>{if(!nodes.has(id))nodes.set(id,{value:id==='earRate'?'0.85':'all',textContent:'',innerHTML:'',hidden:false,addEventListener(type,fn){this[type]=fn}});return nodes.get(id)};
globalThis.document={getElementById:node,querySelectorAll:()=>[]};
globalThis.window={addEventListener(){},speechSynthesis:null};
globalThis.localStorage={getItem:()=>null,setItem(){}};
let spoken='';globalThis.speechSynthesis={cancel(){},getVoices:()=>[{lang:'fr-FR',name:'French'}],speak(u){spoken=u.text;u.onend?.()}};window.speechSynthesis=speechSynthesis;
globalThis.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
const {initListening,refreshListening}=await import('../src/listening.js');
let selected=worker;initListening(()=>selected);
const click=(key,value)=>node('listening').click({target:{closest:()=>({dataset:{[key]:value}})}});
const speakAndCheck=p=>{click('ear','play');const item=ITEMS.find(x=>(x.context?x.context+'. ':'')+x.fr===spoken);assert.ok(item,'Question must come from the bank');assert.equal(questionApplies(item,profileFacts(p)),true,spoken)};
for(let n=0;n<12;n++){click('ear','draw');speakAndCheck(worker)}
click('ear','start');speakAndCheck(worker);
selected=student;refreshListening();assert.ok(node('earStage').innerHTML.includes('开始听音练习'),'Old quiz must be cleared on profile change');
click('ear','start');for(let n=0;n<8;n++){speakAndCheck(student);click('ear','unknown');click('ear','next')}
click('ear','review');speakAndCheck(student);
click('earPane','learn');for(let n=0;n<12;n++){click('ear','draw');speakAndCheck(student)}
selected=null;refreshListening();assert.ok(node('earPersonalization').textContent.includes('通用题库'));
console.log('Passed: learn, quiz, weak review, profile switching, stale quiz reset, and generic fallback.');
