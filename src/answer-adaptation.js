// Reshape explicit reasons without adding new personal claims or ranking motivations.
const end=s=>String(s||'').trim().replace(/[.!?]+$/,'');
const lower=s=>s.replace(/^Je\b/,'je').replace(/^J([’'])/,'j$1').replace(/^Cela\b/,'cela').replace(/^Ça\b/,'ça');
const because=s=>/^(?:[aeiouyàâéèêëîïôùûüœ]|h\w)/iu.test(s.replace(/^\*\*/,''))?'parce qu’'+s:'parce que '+s;
const KNOWN_REASON_CN=new Map([
 ["cela me permet de mieux m'integrer a la vie canadienne et d'elargir mes horizons",'它能帮助我更好地融入加拿大的生活，并开阔眼界'],
 ["je trouve cette langue vraiment elegante",'我觉得这门语言非常优雅'],
 ["je trouve cette langue tres elegante",'我觉得这门语言非常优雅'],
 ["j'aime la liberte et le mode de vie ici",'我喜欢这里的自由和生活方式']
]);
const key=s=>s.replace(/\*\*/g,'').normalize('NFD').replace(/\p{M}/gu,'').replace(/[’‘]/g,"'").toLowerCase().replace(/\s+/g,' ').trim();
export function adaptAnswer(item,base){
 const reasonQuestion=['7','10','22','29'].includes(item.group)||(item.group==='19'&&!item.intent.includes('哪些方面'));
 if(!reasonQuestion)return[{...base}];
 const text=base.text,first=text.match(/^([\s\S]*?[.!?])(?:\s|$)/)?.[1]||text,rest=text.slice(first.length).trim();
 const prefixes={'7':/venue|arrivée/u.test(text)?'Je suis venue au Canada':'Je suis venu au Canada','10':'J’ai changé de domaine','22':'J’apprends le français','29':'Je voudrais faire ce métier','19':item.intent.includes('做饭')?'J’aime cuisiner':'J’aime cette activité'};
 let prefix=prefixes[item.group],reason;
 const cause=first.match(/\b(?:parce que\s+|parce qu[’']|car\s+)([\s\S]+)/iu);
 if(cause){reason=end(cause[1]);const lead=first.slice(0,cause.index).trim().replace(/[,;:]$/,'').trim();if(item.group!=='22'&&/^J(?:e\b|[’'])/u.test(lead))prefix=lead}
 if(!reason){const benefit=first.match(/(?:ce qui|cela|ça|le français|cette langue)\s+me permet\s+([\s\S]+)/iu);if(benefit)reason='cela me permet '+end(benefit[1])}
 if(reason){reason=lower(reason);const suffix=rest?' '+rest:'';const cnReason=KNOWN_REASON_CN.get(key(reason));
  const cn1=cnReason&&!rest?({'7':'我来加拿大','10':'我换专业领域','22':'我学习法语','29':'我想从事这个职业','19':item.intent.includes('做饭')?'我喜欢做饭':'我喜欢这项活动'}[item.group]+'，是因为'+cnReason+'。'):base.cn;
  const cn2=cnReason&&!rest?({'7':'我来加拿大','10':'我换专业领域','22':'我学习法语','29':'我想从事这个职业','19':item.intent.includes('做饭')?'我喜欢做饭':'我喜欢这项活动'}[item.group]+'有一个简单的原因：'+cnReason+'。'):base.cn;
  return[{...base,text:prefix+' '+because(reason)+'.'+suffix,cn:cn1,adapted:true,cues:true},{...base,text:prefix+' pour une raison simple : '+reason+'.'+suffix,cn:cn2,adapted:true,cues:true}];
 }
 // An explicit purpose is also a direct answer to pourquoi; retain its grammatical form.
 const purpose=first.match(/\bpour\s+(?!une raison\b)([\s\S]+)/iu);
 if(purpose&&!/^(?:moi|toi|lui|elle|nous|vous|eux|elles|une?\b|les?\b|des?\b)/iu.test(purpose[1].replace(/^\*\*/,''))){const lead=first.slice(0,purpose.index).trim();if(item.group!=='22'&&/^J(?:e\b|[’'])/u.test(lead))prefix=lead;const goal=end(purpose[1]),suffix=rest?' '+rest:'';return[{...base,text:prefix+' pour '+goal+'.'+suffix,adapted:true,cues:true},{...base,text:'C’est pour '+goal+' que '+lower(prefix)+'.'+suffix,cn:base.cn,adapted:true,cues:true}]}
 // An answer without explicit causal evidence is not given an invented explanation.
 return[{...base,cues:true}];
}
