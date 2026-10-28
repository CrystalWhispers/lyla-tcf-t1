// Use positive personal evidence; a teacher's example, a question, or a future wish
// must not be mistaken for the student's present situation.
const norm=s=>String(s||'').normalize('NFD').replace(/\p{M}/gu,'').replace(/[’‘]/g,"'").replace(/\*\*/g,'').toLowerCase();
const moduleText=(p,i)=>(p?.modules?.[i]?.paragraphs||[]).map(x=>x.text||'').join('. ');
const clauses=s=>norm(s).split(/[.!?;\n]+|\bmais\b|\bet\s+(?=je\b|j')/).map(x=>x.trim()).filter(Boolean);
const roles='enseignant|enseignante|professeur|professeure|educateur|educatrice|infirmier|infirmiere|medecin|ingenieur|ingenieure|technicien|technicienne|comptable|administrateur|administratrice|developpeur|developpeuse|vendeur|vendeuse|employe|employee|responsable|directeur|directrice|gestionnaire|consultant|consultante|assistant|assistante|avocat|avocate|entrepreneur|entrepreneuse|independant|independante|receptionniste|serveur|serveuse|cuisinier|cuisiniere|chauffeur|chauffeuse|aide.soignant|aide.soignante|agent|agente|fonctionnaire|chercheur|chercheuse|architecte|pharmacien|pharmacienne|dentiste|journaliste|artiste';
const presentRole=new RegExp("\\bje suis (?:actuellement |maintenant |toujours |aussi )?(?:(?:un|une) )?(?:"+roles+")\\b");
const academic=/\b(?:je suis (?:actuellement |maintenant |encore |aussi )?(?:(?:un|une) )?etudiant(?:e)?|j'etudie|je (?:fais|poursuis|reprends|termine|finis) (?:actuellement )?mes etudes|je suis (?:actuellement )?(?:une |en )formation|je (?:suis|prends) des cours|je prepare (?:un |une |mon |ma )(?:diplome|baccalaureat|bac|master|maitrise|licence|doctorat)|je suis (?:inscrit|inscrite) (?:a|au|dans))\b/;
const work=/\b(?:je travaille(?=\s+(?:a|au|aux|en|dans|chez|pour|avec|comme|actuellement|maintenant|toujours|aussi)\b|\s*$)|je fais du (?:soutien|support) informatique|j'occupe (?:un |le )poste|mon travail consiste|je suis (?:a mon compte|salarie|salariee))\b/;
const noWork=/\b(?:je (?:ne )?travaille (?:pas|plus)|je suis (?:actuellement )?(?:sans emploi|au chomage|a la retraite)|je n'ai (?:pas|plus) (?:de travail|d'emploi))\b/;
const noStudy=/\b(?:je ne suis (?:pas |plus )etudiant(?:e)?|je (?:n')?etudie (?:pas|plus)|je (?:ne )?(?:fais|poursuis) (?:pas|plus) (?:d'etudes|mes etudes))\b/;
const languageOnly=/\b(?:le francais|l'anglais|cours de (?:francais|langue|l'anglais)|formation (?:en|de) (?:francais|langue))\b/;
export function profileFacts(profile){
 const texts=(profile?.modules||[]).map((_,i)=>moduleText(profile,i));
 if(!texts.some(t=>t.trim()))return{personalized:false};
 const present=clauses(texts[2]||'');
 // Intro statements can establish status too; past and future modules cannot.
 const status=[...present,...clauses(texts[0]||'')];
 const studying=status.some(c=>academic.test(c)&&!noStudy.test(c)&&!languageOnly.test(c));
 const working=status.some(c=>!noWork.test(c)&&! /\bje travaille (?:actuellement )?(?:mon |le )francais\b/.test(c)&&(work.test(c)||presentRole.test(c)));
 const ownChildren=clauses(texts.join('. ')).some(c=>!/(?:je n'ai (?:pas|plus)|je n'ai jamais eu|je suis sans) (?:d'|des? )?enfants?\b/.test(c)&&(/\b(?:ma fille|mon fils|mes enfants|mon enfant|mes filles|mes fils)\b/.test(c)||/\b(?:j'ai|nous avons) (?:un |une |des |\d+ |deux |trois |quatre |cinq |six )(?:(?:petits?|petites?) )?(?:enfants?|filles?|fils)\b/.test(c)||/\bje suis (?:la )?(?:mere|pere|maman|papa) (?:de|d')/.test(c)));
 const leisure=clauses(texts[3]||'');
 const cooking=leisure.some(c=>!/(?:n'aime pas|ne cuisine (?:pas|jamais)|deteste)/.test(c)&&/\b(?:j'aime.*(?:cuisiner|cuisine)|je cuisine|la cuisine.*(?:plait|passion)|j'adore.*cuisin)\b/.test(c));
 const sport=leisure.some(c=>!/(?:ne (?:fais|pratique|joue) (?:pas|jamais)|n'aime pas|deteste)/.test(c)&&/\b(?:je (?:fais|pratique|joue|vais)|j'aime|j'adore).*(?:sport|tennis|natation|badminton|football|basket|volley|velo|yoga|gym|course a pied|salle de sport|courir|nager)/.test(c));
 const changed=clauses((texts[1]||'')+'. '+(texts[2]||'')).some(c=>/\b(?:j'ai (?:decide de )?change|je me suis reconverti|j'ai decide de faire autre chose|j'ai choisi un nouveau (?:metier|domaine))/.test(c));
 const future=clauses(texts[5]||'');
 const career=future.some(c=>/\b(?:je voudrais|j'aimerais|je veux|je compte|je souhaite|mon projet).*(?:travailler|devenir|metier|emploi)/.test(c));
 const childcare=future.some(c=>/\b(?:je voudrais|j'aimerais|je veux|je compte|je souhaite).*(?:garderie|petite enfance|creche|maternelle)/.test(c));
 return{personalized:true,studying,working,ownChildren,cooking,sport,changed,career,childcare};
}
export function questionApplies(item,f){
 if(!f?.personalized)return true;
 const g=item.group,i=item.intent;
 if(['12','27','28'].includes(g))return f.studying;
 if(g==='13')return i.includes('公司')?f.working:f.studying;
 if(g==='14')return f.working;
 if(g==='15')return i.includes('工作')?f.working:f.studying;
 if(g==='32')return f.ownChildren;
 if(g==='10')return f.changed;
 if(g==='19'&&i.includes('做饭'))return f.cooking;
 if(g==='18'&&i.includes('频率'))return f.sport;
 if(g==='29')return f.career;
 if(g==='short'){
  if(i.includes('幼儿园'))return f.childcare;
  if(i.includes('毕业'))return f.studying;
  return f.working;
 }
 return true;
}
