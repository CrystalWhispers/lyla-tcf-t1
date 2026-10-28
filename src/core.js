export const TITLES=['基本信息','过去经历','现在的学习/工作','兴趣与日常','法语学习','未来计划'];
export const uid=()=>globalThis.crypto?.randomUUID?.()||'p-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
export const clean=s=>String(s??'').replace(/\u00a0/g,' ').trim();
export const compact=s=>clean(s).replace(/\s+/g,' ').replace(/[’‘]/g,"'");
export function normalizeAnswer(s,accents=false){let t=compact(s).toLocaleLowerCase('fr').normalize('NFC').replace(/[.,;:!?«»“”()]/g,'').replace(/[-–—]/g,' ').replace(/\s+/g,' ').trim();return accents?t.normalize('NFD').replace(/\p{M}/gu,''):t}
export function compareAnswer(value,answer,allowAccents=true){if(normalizeAnswer(value)===normalizeAnswer(answer))return{correct:true,accent:false};if(allowAccents&&normalizeAnswer(value,true)===normalizeAnswer(answer,true))return{correct:true,accent:true};return{correct:false,accent:false}}
const welcome=/^\s*(?:bonjour|bonsoir|salut)\b(?:[\s,/]+(?:(?:et|ou)\s+)?(?:madame|monsieur|mesdames|messieurs)\b)*\s*[,!.:;]?\s*/i;
export function stripGreetings(text){let t=String(text??'');while(welcome.test(t))t=t.replace(welcome,'');return t.trim()}
// Controlled heading aliases: numbering, punctuation and common synonyms may vary.
// Whole-label matching avoids interpreting an ordinary French sentence as a heading.
export function identifyModuleHeading(line){let l=clean(line).normalize('NFKC').replace(/^#{1,6}\s*/,'').replace(/^(?:第\s*)?(?:模块\s*)?(?:[1-6一二三四五六]|I{1,3}|IV|VI?)(?:\s*(?:个?模块|部分|章|节))?[.、）)\s:：｜|·-]+/i,'').replace(/^第[一二三四五六1-6](?:个?模块|部分|章|节)\s*/,'').replace(/^模块\s*[一二三四五六1-6]\s*/,'');if(l.length>150||/[。！？!?]/.test(l))return -1;
 const cn=(l.match(/[\u3400-\u9fff]/g)||[]).join('');
 if(cn){const aliases=[
 /^(?:基本|个人|自身)(?:信息|资料|情况|简介|介绍)$|^自我介绍$/,
 /^(?:过去|过往|以往|之前|以前|个人)(?:的)?(?:经历|背景|学习经历|工作经历|学习与工作经历|学习或工作经历|学习工作经历|学习与工作|学习或工作|学习工作)$|^来加前(?:的)?(?:经历|学习|工作)$/,
 /^(?:(?:现在|目前|当前|现阶段)(?:的)?(?:情况|状况|状态|学习|学业|工作|学习与工作|学习或工作|学习工作|学习及工作|学业与工作|学业或工作|学业工作)(?:学习或工作|学习与工作|学习工作|学业或工作|学业与工作|学业工作)?|学习与工作|学习或工作|学习工作|学习目前状态|学习现在状态)$/,
 /^(?:兴趣与日常|兴趣和日常|兴趣及日常|兴趣爱好|个人爱好|兴趣|爱好|休闲活动|日常生活|日常与兴趣|日常生活与兴趣|兴趣爱好与日常生活|兴趣爱好和日常生活)$/,
 /^(?:法语学习|学习法语|我的法语学习|法语学习经历|法语学习情况|学习法语的情况|法语学习与目标|法语学习和目标)$/,
 /^(?:未来|今后|将来)(?:的)?(?:计划|规划|打算|目标|安排)$|^(?:个人未来计划|毕业后计划|未来生活与工作计划)$/
 ];const hits=aliases.flatMap((r,i)=>r.test(cn)?[i]:[]);return hits.length===1?hits[0]:-1}
 const fr=l.toLocaleLowerCase('fr').normalize('NFD').replace(/\p{M}/gu,'').replace(/[^a-z]/g,'');const aliases=[['informationspersonnelles','presentationpersonnelle','informationsdebase','mapresentation'],['parcourspersonnel','mesexperiencespassees','experiencespassees','monparcours'],['etudesetsituationactuelle','masituationactuelle','situationactuelle','etudesettravail','travailouetudes','etudesoutravail'],['centresdinteret','centresdinteretetquotidien','loisirs','loisirsetviequotidienne'],['apprentissagedufrancais','lefrancaisetmoi','mesetudesdefrancais'],['projetsdavenir','mesprojetsdavenir','projetsfuturs']];return aliases.findIndex(a=>a.includes(fr))}
export const moduleText=m=>(m.paragraphs||[]).map(p=>p.text).join('\n\n');
export const eligible=p=>p.keywords?.length>0&&!p.issue;
export function emptyProfile(name='我的 Tâche 1'){return{id:uid(),formatVersion:3,name,modules:TITLES.map(title=>({title,paragraphs:[]})),questions:[],createdAt:Date.now(),stats:{rounds:0,timed:0}}}
// Keywords are source offsets within ONE Word paragraph. No meaning or sentence-index matching.
export function prepareParagraph(record){const raw=String(record.text||'');let start=0;while(welcome.test(raw.slice(start))){start+=raw.slice(start).match(welcome)[0].length}while(/\s/.test(raw[start]||'')&&start<raw.length)start++;let end=raw.length;while(end>start&&/\s/.test(raw[end-1]))end--;if(start>=end)return null;const text=raw.slice(start,end);let ranges=(record.ranges||[]).filter(r=>Number.isInteger(r.start)&&Number.isInteger(r.end)&&r.end>r.start).map(r=>({start:Math.max(start,r.start)-start,end:Math.min(end,r.end)-start})).filter(r=>r.end>r.start).sort((a,b)=>a.start-b.start);const merged=[];for(const r of ranges){const last=merged.at(-1);if(last&&r.start<=last.end)last.end=Math.max(last.end,r.end);else if(last&&/^\s*$/.test(text.slice(last.end,r.start)))last.end=r.end;else merged.push({...r})}
 const keywords=[];for(const range of merged){let{start:a,end:b}=range;while(a<b&&/[\s.,;:!?«»“”()]/.test(text[a]))a++;while(b>a&&/[\s.,;:!?«»“”()]/.test(text[b-1]))b--;const word=text.slice(a,b);if(/[A-Za-zÀ-ÿŒœ0-9]/.test(word))keywords.push({start:a,end:b,text:word})}
 const letters=s=>(s.match(/[A-Za-zÀ-ÿŒœ0-9]/g)||[]).length;const total=letters(text),bold=keywords.reduce((n,k)=>n+letters(k.text),0);const issue=!keywords.length?'missing':total&&bold/total>.9?'allbold':keywords.some(k=>k.text.length>160)?'long':'';return{id:uid(),text,keywords,issue};}
// Slice Word text together with its bold offsets, including soft line breaks in Q&A.
function sliceRecord(record,start=0,end=String(record.text||'').length){return{text:String(record.text||'').slice(start,end),ranges:(record.ranges||[]).map(r=>({start:Math.max(start,r.start)-start,end:Math.min(end,r.end)-start})).filter(r=>r.end>r.start)}}
const questionNumber=/^\s*(?:(?:[\d０-９]+\uFE0F?\u20E3?|[①-⑳一二三四五六七八九十]+)[.．、)）\]:：\s-]+|[（(][\d０-９一二三四五六七八九十]+[）)]\s*|[\d０-９]+\uFE0F?\u20E3\s*|[①-⑳]\s*)/;
// Q is a label only before a separator or number; never strip it from Qu’est / Quel.
function unlabelQuestion(text){let s=clean(text).replace(/^(?:#{1,6}|[•●▪▶►])\s*/,'').replace(questionNumber,'');const label=s.match(/^(?:问题|追问|Question(?=\s|[\d０-９:：.．、)）-]|$)|Q(?=\s|[\d０-９:：.．、)）-]|$))\s*(?:[\d０-９一二三四五六七八九十]+)?\s*[.．、)）:：-]?\s*/i);if(label)s=s.slice(label[0].length);return{text:s,labelled:!!label||s!==clean(text)}}
function questionHeading(text){const s=clean(text).replace(/^(?:#{1,6}|[•●▪▶►])\s*/,'').replace(questionNumber,'').normalize('NFKC');return s.length<130&&!/[?？]/.test(s)&&/^(?:考官(?:可能)?(?:追问|提问|问的问题)|追问(?:问题|回答|准备)?|问题准备|相关问答|问题与回答|Questions?\s+(?:de\s+suivi|possibles?|et\s+r[eé]ponses)|Follow[ -]?up\s+questions?|Q\s*&\s*A)(?:\b|[\s:：（(]|$|的|问题|回答|准备|参考)/i.test(s)}
function readQuestion(text){const {text:s,labelled}=unlabelQuestion(text);const fr=/^(?:Pourquoi\b|Comment\b|Que\b|Qu[’']|Quel|Avez\b|Êtes\b|Etes\b|Est[ -]ce\b|Pouvez\b|Pourriez\b|Où\b|Ou\b|Depuis\b|Quand\b|Combien\b|Parlez\b|Vous\b|Avec\b|Dans\b|De\b|Du\b|Des\b|Pour\b|À\s|A\s|En\b|Faites\b|Pensez\b|Travaillez\b|Aimez\b|Habitez\b|Étudiez\b|Etudiez\b)/i;if(!fr.test(s))return null;const mark=s.search(/[?？]/);if(mark<0&&!labelled)return null;const question=mark>=0?s.slice(0,mark+1):s;if(/[\u3400-\u9fff]/.test(question))return null;return{question,rest:mark>=0?s.slice(mark+1):'',end:mark>=0?text.indexOf(s)+mark+1:text.length}}
export function parseParagraphs(records,name='导入的 Tâche 1'){
 if(!Array.isArray(records)||records.length>3000)throw Error('文档段落过多，请只保留六模块和追问。');const p=emptyProfile(name),seen=new Set(),warnings=[];let current=-1,mode='intro',q=null,ignoredGreetings=0,ignoredChinese=0,duplicate=false,questionSection=false;
 const queue=[...records];
 for(let ri=0;ri<queue.length;ri++){const record=queue[ri],raw=String(record.text||'');const l=clean(raw);if(!l)continue;
 if(/[\r\n]/.test(raw)&&(mode==='questions'||raw.split(/\r?\n/).some(t=>questionHeading(t)||readQuestion(t)))){const parts=[];const lines=/[^\r\n]+/g;let m;while((m=lines.exec(raw)))parts.push(sliceRecord(record,m.index,m.index+m[0].length));queue.splice(ri,1,...parts);ri--;continue;}
 if(questionHeading(l)){mode='questions';questionSection=true;current=-1;q=null;continue}
 const detected=readQuestion(l);
 // A French question can start the bank even when its section title differs.
 if(detected){mode='questions';current=-1;q={q:detected.question,cn:'',paragraphs:[]};p.questions.push(q);if(detected.rest.trim()){const off=raw.indexOf(l)+detected.end;queue.splice(ri+1,0,sliceRecord(record,off))}continue}
 if(/^(?:7[.、)\s]+)?(?:模块连贯完整全文|连贯完整全文|完整全文|全文连贯版|Texte continu)/i.test(l)){mode='duplicate';current=-1;duplicate=true;continue}if(mode==='duplicate')continue;
 if(mode==='intro'){const hi=identifyModuleHeading(l);if(hi>=0){if(seen.has(hi)){current=-1;warnings.push('重复的“'+TITLES[hi]+'”模块已忽略。')}else{current=hi;seen.add(hi)}continue}if(/^(?:第\s*)?(?:模块\s*)?[1-6一二三四五六][.、)）\s:：-]/.test(l)&&/[\u3400-\u9fff]/.test(l)&&l.length<70){current=-1;warnings.push('无法明确识别模块标题“'+l+'”，请改用六模块中的对应名称。');continue}}
 if(mode==='questions'){
  if(!q)continue;
  if(/^(?:记忆锚点|锚点|关键词|Mots.clés|Anchors?)\s*[:：]/i.test(l))continue;
  if(/^(?:中文题意|中文|题意)\s*[:：]/.test(l)){q.cn=l.replace(/^[^:：]+[:：]\s*/,'');continue}
  if(/^(?:回答|参考回答|示范回答|答案|R[eé]ponse(?:\s+(?:possible|mod[eè]le|de r[eé]f[eé]rence))?|Answer|[AR])\s*[:：]?\s*$/i.test(l))continue;
  if(/[\u3400-\u9fff]/.test(l)&&!/[A-Za-zÀ-ÿ]/.test(l)){q.cn+=(q.cn?' ':'')+l;continue}
  let r=record;const prefix=raw.match(/^\s*(?:参考回答|示范回答|回答|答案|R[eé]ponse(?:\s+(?:possible|mod[eè]le|de r[eé]f[eé]rence))?|Answer|[AR])\s*[:：]\s*/i);if(prefix)r=sliceRecord(record,prefix[0].length);
  if(/[\u3400-\u9fff]/.test(r.text)){// A trailing translation or reference note must not discard the French answer.
   const firstChinese=r.text.search(/[\u3400-\u9fff]/);const before=r.text.slice(0,firstChinese).replace(/[\s（(【\[]+$/,'');if(!/[A-Za-zÀ-ÿ]/.test(before)){ignoredChinese++;continue}r=sliceRecord(r,0,before.length);ignoredChinese++;
  }const para=prepareParagraph(r);if(para)q.paragraphs.push(para);else ignoredGreetings++;continue;
 }
 if(current<0)continue;if(/^(?:记忆锚点|锚点|关键词|Mots.clés|Anchors?|法语正文|正文|锚点对应|对应句)\s*[:：]/i.test(l)){// Labels are not exercise paragraphs; a same-line French body can still be imported.
   const prefix=raw.match(/^\s*(?:法语正文|正文)\s*[:：]\s*/);if(!prefix)continue;
   const n=prefix[0].length;const para=prepareParagraph({text:raw.slice(n),ranges:(record.ranges||[]).map(k=>({start:k.start-n,end:k.end-n}))});if(para&&!/[\u3400-\u9fff]/.test(para.text))p.modules[current].paragraphs.push(para);continue}
 if(/=>|⇒/.test(l)||/^[\d\s]+$/.test(l))continue;if(/[\u3400-\u9fff]/.test(l)){ignoredChinese++;continue}const para=prepareParagraph(record);if(para)p.modules[current].paragraphs.push(para);else ignoredGreetings++;
 }
 if(questionSection&&!p.questions.length)warnings.push('检测到追问板块，但未识别出法语问题。请让每个问题单独成段，并以问号结尾。');
 if(p.questions.length)warnings.push('已识别 '+p.questions.length+' 个考官追问，请在下方核对问题和回答。');
 if(!seen.size)throw Error('没有识别到六模块标题。请下载 Word 模板，按六模块组织材料。');
 if(ignoredGreetings)warnings.push('已自动忽略 '+ignoredGreetings+' 段开场问候。');if(ignoredChinese)warnings.push('已忽略 '+ignoredChinese+' 段中文说明或中法混排文字；法语正文请单独成段。');if(duplicate)warnings.push('已忽略重复的完整全文，只使用前六模块。');
 return{profile:p,warnings};
}
export function inspectProfile(p){const errors=[],warnings=[];if(!clean(p.name))errors.push('请填写材料名称。');if(p.formatVersion!==3||p.modules?.length!==6)return{errors:['请重新上传带粗体关键词的六模块 Word 文档。'],warnings};let usable=0,missing=0,broad=0;
 for(const [i,m]of p.modules.entries()){if(!m.paragraphs?.length){errors.push('第 '+(i+1)+' 模块“'+TITLES[i]+'”缺少法语正文。');continue}if(!m.paragraphs.some(eligible))errors.push('第 '+(i+1)+' 模块没有可练习的粗体关键词，请在 Word 中补标后重新上传。');for(const para of m.paragraphs){if(eligible(para))usable++;else if(para.issue==='missing')missing++;else broad++}}
 for(const [i,q]of p.questions.entries())if(!clean(q.q)||!q.paragraphs?.length)errors.push('追问 '+(i+1)+' 缺少问题或完整法语回答。');
 if(missing)warnings.push(missing+' 段未标粗体：保留在熟读全文中，不进入填空或关键词复述。请在 Word 补标后重新上传，以练到这些内容。');if(broad)warnings.push(broad+' 段整段加粗或关键词过长：暂不进入关键词练习，请只加粗重点词或短语。');return{errors,warnings,usable,missing,broad};}
// Select source spans only. Automatic answer practice never rewrites the student's text.
export function answerPhrases(text){
 const tokens=[...text.matchAll(/[\p{L}]+(?:[’'][\p{L}]+)*|\d+/gu)].map(m=>({word:m[0],start:m.index,end:m.index+m[0].length,low:m[0].toLocaleLowerCase('fr').replace(/’/g,"'")}));
 const det=new Set(['le','la','les','un','une','des','du','mon','ma','mes','son','sa','ses','notre','nos','leur','leurs','ce','cet','cette','ces','plusieurs','quelques']);
 const stops=new Set(('et ou mais car donc puis parce que qui quand comment pourquoi où dont pour avec sans chez dans sur sous avant après depuis pendant lorsque alors aussi surtout vraiment très assez encore déjà toujours souvent parfois beaucoup plus moins bien mieux ici là ne pas je tu il elle on nous vous ils elles me te se lui y en ai as a avons avez ont suis es est sommes êtes sont étais était étions étaient avais avait avaient aime aiment aimais trouve trouvent trouvais permet permettent apporte apporte prend pris fait fais font faisais peux peut pouvons veulent veux veut voulais souhaite souhaitais préfère pense crois vois sens sent sens peux doit dois sera serai seront été venu venue décidé choisi envie').split(' '));
 const punctuation=(a,b)=>/[.,;:!?\n]/.test(text.slice(a,b));const ranges=[];
 const add=(a,b)=>{if(b<=a||ranges.some(r=>a<r.end&&b>r.start))return;ranges.push({start:a,end:b,text:text.slice(a,b)})};
 for(let i=0;i<tokens.length;i++){
  const first=tokens[i];if(!det.has(first.low)&&!/^l'/.test(first.low))continue;
  let j=i+1,content=/^l'/.test(first.low)?1:0;
  while(j<tokens.length&&j-i<9){const t=tokens[j],prev=tokens[j-1];if(punctuation(prev.end,t.start))break;
   if((t.low==='de'||t.low==='du'||t.low==='des'||/^d'/.test(t.low))&&content){j++;if((t.low==='de')&&tokens[j]&&(det.has(tokens[j].low)||/^l'/.test(tokens[j].low)))j++;if(tokens[j]&&!stops.has(tokens[j].low)&&!punctuation(tokens[j-1].end,tokens[j].start)){j++;continue}break}
   if(t.low==='en'&&tokens[j+1]?.low==='ligne'){j+=2;continue}
   if(stops.has(t.low)||det.has(t.low)||/^(?:qu'|j'|s'|c'|n'|m')/.test(t.low)||content>=3)break;
   content++;j++;
  }
  while(j>i+1&&['de','du','des'].includes(tokens[j-1].low))j--;
  if(content&&j>i&&(j-i>1||/^l'/.test(first.low))){add(first.start,tokens[j-1].end);i=j-1}
 }
 // Infinitive groups and time/frequency expressions complement the noun phrases.
 const patterns=[/\b(?:pour|de|à)\s+((?:[\p{L}]+(?:er|ir)|faire|vivre|être|avoir|apprendre|comprendre|découvrir|obtenir)\b(?:\s+(?:plus|mieux|facilement|régulièrement|dehors|ensemble|à distance|en forme)){0,3})/giu,/\b((?:un|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|plusieurs|\d+)\s+(?:ans?|mois|semaines?|jours?|fois)(?:\s+par\s+(?:semaine|jour|mois|an))?)/giu];
 for(const pattern of patterns)for(const m of text.matchAll(pattern)){const a=m.index+m[0].indexOf(m[1]);add(a,a+m[1].length)}
 if(!ranges.length){const candidates=tokens.filter(t=>t.word.length>=6&&!stops.has(t.low)&&!det.has(t.low));for(const t of candidates.slice(0,4))add(t.start,t.end)}
 return ranges.sort((a,b)=>a.start-b.start);
}
export function practiceGroups(p,scope='all'){const questionScope=scope==='questions'||scope.startsWith('q');const selections=scope==='all'?p.modules.map((m,i)=>({label:String(i+1).padStart(2,'0')+' · '+TITLES[i],paragraphs:m.paragraphs})):scope.startsWith('m')?[{label:TITLES[+scope.slice(1)],paragraphs:p.modules[+scope.slice(1)]?.paragraphs||[]}]:scope==='questions'?p.questions.map(q=>({label:q.q,paragraphs:q.paragraphs})):[{label:p.questions[+scope.slice(1)]?.q||'',paragraphs:p.questions[+scope.slice(1)]?.paragraphs||[]}];
 return selections.map(g=>{let text='',keywords=[];for(const para of g.paragraphs){if(text)text+='\n\n';const offset=text.length;text+=para.text;const spans=eligible(para)?para.keywords:questionScope?answerPhrases(para.text):[];if(spans.length)keywords.push(...spans.map(k=>({start:offset+k.start,end:offset+k.end,answer:k.text,paragraphId:para.id})))}return{label:g.label,text,keywords}})}
export function makeCloze(groups,rate=.65,rng=Math.random){let seq=0;return groups.map(g=>{const by=new Map();for(const k of g.keywords||[]){if(!by.has(k.paragraphId))by.set(k.paragraphId,[]);by.get(k.paragraphId).push(k)}let selected=[];for(const list of by.values()){const shuffled=list.map(k=>({...k,rank:rng()})).sort((a,b)=>a.rank-b.rank);selected.push(...shuffled.slice(0,Math.max(1,Math.round(list.length*rate))))}selected.sort((a,b)=>a.start-b.start);return{...g,blanks:selected.map(k=>({...k,id:'gap-'+seq++,value:'',revealed:false}))}})}
const marked=(text,parts)=>({text,ranges:parts.map(t=>{const start=text.indexOf(t);return{start,end:start+t.length}})});
export const SAMPLE_RECORDS=[
 {text:'1. 基本信息'}, {text:'Bonjour Madame /Monsieur,'},marked('Je m’appelle Claire et j’ai 30 ans.',['Claire','30 ans']),marked('Je viens de Pékin et j’habite à Toronto avec mon mari.',['Pékin','Toronto','mon mari']),
 {text:'2. 过去经历'},marked('Avant de venir au Canada, j’étais enseignante à l’université.',['enseignante','à l’université']),marked('Je suis venue au Canada parce que je voulais découvrir un autre mode de vie.',['découvrir un autre mode de vie']),
 {text:'3. 现在的学习/工作'},marked('En ce moment, j’étudie l’éducation de la petite enfance.',['l’éducation de la petite enfance']),marked('J’aime ce domaine parce que j’aime travailler avec les enfants.',['travailler avec les enfants']),
 {text:'4. 兴趣与日常'},marked('Je joue au tennis trois fois par semaine en été.',['tennis','trois fois par semaine','en été']),marked('En hiver, je vais à la salle de sport pour rester en forme.',['En hiver','la salle de sport','rester en forme']),
 {text:'5. 法语学习'},marked('J’apprends le français depuis trois mois.',['trois mois']),marked('Je suis des cours en ligne et je trouve les liaisons difficiles.',['cours en ligne','les liaisons']),
 {text:'6. 未来计划'},marked('Je souhaite m’installer au Canada et travailler dans une garderie.',['m’installer au Canada','travailler dans une garderie']),
 {text:'考官追问'}, {text:'问题 1：Pourquoi apprenez-vous le français ?'},{text:'中文题意：为什么学习法语？'},marked('J’apprends le français pour communiquer plus facilement au Canada.',['communiquer plus facilement']),
 {text:'问题 2：Qu’est-ce que vous aimez dans le tennis ?'},{text:'中文题意：喜欢网球的哪些方面？'},marked('Le tennis me permet de bouger et de me détendre.',['bouger','me détendre'])
];
