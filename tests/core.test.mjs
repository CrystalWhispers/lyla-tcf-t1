import assert from 'node:assert/strict';
import {TITLES,SAMPLE_RECORDS,parseParagraphs,prepareParagraph,inspectProfile,makeCloze,practiceGroups,compareAnswer,eligible,stripGreetings} from '../src/core.js';
const {profile:p,warnings}=parseParagraphs(SAMPLE_RECORDS,'Claire');
assert.equal(p.modules.length,6);assert.equal(p.questions.length,2);assert.equal(inspectProfile(p).errors.length,0);assert(warnings.some(s=>s.includes('开场问候')));
assert(!p.modules.some(m=>m.paragraphs.some(a=>a.text.includes('Bonjour'))));
for(const m of p.modules)for(const a of m.paragraphs)for(const k of a.keywords)assert.equal(a.text.slice(k.start,k.end),k.text);
for(const g of ['Bonjour Madame /Monsieur,','Bonjour Madame/Monsieur,','Bonjour Madame ou Monsieur,','Bonjour Monsieur, Madame,','Bonjour !','Bonsoir Madame,']){
 const text=g+'\nJe m’appelle Claire.';const start=text.indexOf('Claire');const a=prepareParagraph({text,ranges:[{start:0,end:g.length},{start,end:start+6}]});assert.equal(a.text,'Je m’appelle Claire.');assert.deepEqual(a.keywords,[{start:13,end:19,text:'Claire'}]);assert.equal(stripGreetings(g),'');
}
const repeated=prepareParagraph({text:'Je fais du sport. Le sport me détend.',ranges:[{start:11,end:16},{start:21,end:26}]});assert.equal(repeated.keywords.length,2);assert.equal(repeated.keywords[0].text,'sport');assert.equal(repeated.keywords[1].text,'sport');
const split=prepareParagraph({text:'Je vais au Canada.',ranges:[{start:11,end:13},{start:13,end:17}]});assert.equal(split.keywords[0].text,'Canada');
const phrases=prepareParagraph({text:'Je joue trois fois par semaine.',ranges:[{start:8,end:13},{start:14,end:18},{start:19,end:30}]});assert.equal(phrases.keywords[0].text,'trois fois par semaine');
assert.equal(prepareParagraph({text:'Bonjour Monsieur,',ranges:[{start:0,end:17}]}),null);
assert.equal(prepareParagraph({text:'Une phrase sans mots en gras.',ranges:[]}).issue,'missing');
assert.equal(prepareParagraph({text:'Tout est en gras.',ranges:[{start:0,end:17}]}).issue,'allbold');
const bad=structuredClone(p);bad.modules[0].paragraphs.forEach(a=>{a.keywords=[];a.issue='missing'});assert(inspectProfile(bad).errors.some(s=>s.includes('第 1 模块')));assert(inspectProfile(bad).warnings.some(s=>s.includes('未标粗体')));
const withExtra=parseParagraphs([...SAMPLE_RECORDS.slice(0,22),{text:'7. 完整全文'},{text:'1. 基本信息'},{text:'重复内容，必须忽略。'},{text:'考官追问'},{text:'问题 1：Pourquoi apprenez-vous le français ?'},{text:'中文题意：为什么学习法语？'},{text:'回答：Je souhaite parler français.',ranges:[{start:11,end:27}]}]).profile;
assert(!withExtra.modules.some(m=>m.paragraphs.some(a=>a.text.includes('重复'))));
const notes=parseParagraphs([{text:'1. 基本信息'},{text:'记忆锚点：姓名 → 城市'},{text:'中文说明 Bonjour'},{text:'Je m’appelle Claire.',ranges:[{start:13,end:19}]}]);assert.equal(notes.profile.modules[0].paragraphs.length,1);assert.equal(notes.profile.modules[0].paragraphs[0].keywords[0].text,'Claire');
assert.throws(()=>parseParagraphs([{text:'Aucune structure.'}]),/没有识别/);
let seed=42;const rng=()=>((seed=seed*16807%2147483647)/2147483647);const groups=practiceGroups(p);
const light=makeCloze(groups,.35,rng),hard=makeCloze(groups,1,rng);let n=0;for(const g of hard){let end=-1;for(const k of g.blanks){assert.equal(g.text.slice(k.start,k.end),k.answer);assert(k.start>=end);end=k.end;n++}}assert.equal(n,groups.reduce((n,g)=>n+g.keywords.length,0));assert(light.reduce((n,g)=>n+g.blanks.length,0)<n);assert.equal(new Set(hard.flatMap(g=>g.blanks.map(k=>k.id))).size,n);
const ignored=structuredClone(p);ignored.modules[0].paragraphs.push(prepareParagraph({text:'Ce passage reste dans le texte mais sans trou.',ranges:[]}));assert(practiceGroups(ignored)[0].text.includes('sans trou'));assert(!makeCloze(practiceGroups(ignored),1).flatMap(g=>g.blanks).some(k=>k.answer.includes('sans trou')));
assert.equal(practiceGroups(p,'questions').length,2);assert.equal(practiceGroups(p,'m4').length,1);assert.equal(practiceGroups(p,'q0')[0].label,p.questions[0].q);
assert.deepEqual(compareAnswer('ÉTUDES','études'),{correct:true,accent:false});assert.deepEqual(compareAnswer('etudes','études'),{correct:true,accent:true});assert.equal(compareAnswer('etudes','études',false).correct,false);assert.equal(compareAnswer('  trois   fois, par semaine!','trois fois par semaine').correct,true);
console.log('Verified paragraph-bound keyword offsets, merged Word runs, greeting removal, repeated words, module parsing, skipped translations and duplicate text, no-bold/all-bold checks, phrase cloze coverage and accent-aware answers.');
