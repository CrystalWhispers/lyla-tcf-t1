import {adaptAnswer} from './answer-adaptation.js';
import {BANK_CN,SPECIAL_CN,registerTranslation} from './answer-translations.js';
// Curated examples are separate from quoted personal source information.
const BANK={
  "1": [
    "Bonjour, je m’appelle **Camille**. J’ai **30 ans** et j’habite à **Toronto**. En ce moment, je suis **étudiante**.",
    "Je m’appelle **Alex**. Je viens de **Chine** et je vis à **Calgary**. Je travaille dans **le soutien informatique**."
  ],
  "2": [
    "Je viens de **Pékin**, en **Chine**. C’est une ville que j’aime beaucoup. J’y ai **fait mes études et vécu avec ma famille**.",
    "Je viens de **Shanghai**, en **Chine**. J’y ai passé une grande partie de ma vie. J’aime surtout **ses quartiers animés et sa cuisine**."
  ],
  "3": [
    "J’habite à **Toronto**, au **Canada**. Je m’y sens bien. J’aime surtout **les parcs près de chez moi, où je peux me promener après les cours**.",
    "En ce moment, je vis à **Calgary**, au **Canada**. J’aime beaucoup cette ville. Le week-end, j’aime **me promener dans les différents quartiers et aller au café avec mes amis**."
  ],
  "4": [
    "J’habite avec **mon mari et ma fille**. Nous passons beaucoup de temps ensemble. Le soir, nous aimons **préparer le dîner et discuter de notre journée**.",
    "Je vis **seule** dans **un appartement**. Je vois souvent **mes amis**. J’aime **avoir du temps pour moi et passer aussi du temps avec eux**."
  ],
  "5": [
    "J’ai **30 ans**. En ce moment, je me concentre sur **mes études et ma vie de famille**, parce que **je prépare un nouveau projet professionnel**.",
    "J’ai **37 ans**. À cette étape de ma vie, je souhaite surtout **trouver un bon équilibre entre le travail et ma famille**."
  ],
  "6": [
    "Je suis arrivée au Canada en **2025** pour **faire mes études**. Au début, **la langue et les démarches administratives étaient difficiles pour moi**. Maintenant, **je me sens plus à l’aise dans la vie quotidienne**.",
    "Je suis arrivée au Canada en **2023** avec **ma famille**. Les premiers mois, nous avons surtout **cherché un logement et découvert notre quartier**. Cela nous a aidés à **nous sentir chez nous**."
  ],
  "7": [
    "Je suis venue au Canada pour **faire mes études**. Je voulais aussi découvrir **une autre façon de vivre**. Ici, je peux **me former pour un métier qui m’intéresse**.",
    "J’ai choisi le Canada parce que **j’aime la vie ici**. Je voulais **commencer une nouvelle vie avec ma famille**. Pour moi, **bien vivre et penser à l’avenir de mes enfants, c’est important**."
  ],
  "8": [
    "Avant de venir au Canada, j’ai étudié **l’économie** à **Pékin**. J’ai appris **comment fonctionnent les entreprises et comment analyser des informations**.",
    "Dans mon pays, j’ai fait des études en **informatique**. J’y ai appris à **comprendre les réseaux et à résoudre des problèmes techniques**."
  ],
  "9": [
    "Avant de venir au Canada, j’étais **enseignante à l’université**. J’aimais beaucoup ce travail. Je **préparais les cours et j’aidais les étudiants à faire leurs projets**.",
    "Dans mon pays, je travaillais dans **l’administration** pour **une entreprise de logistique**. Je **m’occupais des dossiers et j’organisais le travail au bureau**."
  ],
  "10": [
    "J’ai changé de domaine parce que **j’aime travailler avec les enfants**. Je voulais **faire un travail qui me plaît davantage**. J’aimerais **utiliser ce que j’ai appris comme enseignante dans ce nouveau métier**.",
    "J’avais envie de **découvrir un nouveau métier**. J’ai donc décidé de me former dans **l’informatique**. J’y apprends **des choses utiles pour mon futur travail**."
  ],
  "11": [
    "En ce moment, je suis **étudiante**. J’étudie **l’éducation à la petite enfance**. En cours, nous apprenons à **comprendre ce dont les enfants ont besoin et à leur proposer des activités**.",
    "Actuellement, je **travaille dans le soutien informatique** pour **une entreprise de logistique**. Au quotidien, j’aide **mes collègues à résoudre leurs problèmes d’ordinateur et de réseau**."
  ],
  "12": [
    "J’étudie **l’éducation à la petite enfance**. J’aime cette formation parce que **j’aime travailler avec les enfants**. Dans les cours, nous apprenons à **organiser des activités adaptées à l’âge des enfants**.",
    "En ce moment, je suis une formation en **informatique**. Je voudrais travailler dans **le soutien informatique**. Avec les exercices, je peux **essayer ce que j’apprends et mieux comprendre comment l’utiliser au travail**."
  ],
  "13": [
    "Je fais mes études à **George Brown College**, à **Toronto**. J’aime surtout **les cours pratiques, parce qu’ils m’aident à mieux comprendre le métier**.",
    "J’étudie à **l’Université de Calgary**, à **Calgary**. J’aime **faire des projets avec les autres étudiants**. Cela m’aide à **essayer nos idées et à apprendre avec eux**."
  ],
  "14": [
    "Je travaille dans **le soutien informatique**. Je m’occupe surtout **du réseau et des ordinateurs**. Par exemple, je **vérifie les connexions et j’aide les collègues quand un logiciel ne fonctionne pas**.",
    "Je suis **éducatrice dans une garderie**. Je **m’occupe des enfants pendant la journée**. Par exemple, je **prépare des jeux et je les aide à apprendre à jouer ensemble**."
  ],
  "15": [
    "Ce qui me plaît dans mes études, c’est **d’apprendre à m’occuper des jeunes enfants**. Je trouve cela **utile et intéressant**. Par exemple, nous apprenons à **choisir des jeux qui les aident à parler et à faire des choses seuls**.",
    "Dans ma formation, j’aime surtout **les activités pratiques**. Elles m’aident à **mieux comprendre le métier**. Par exemple, je peux **essayer une activité en classe, puis le professeur me donne des conseils pour l’améliorer**."
  ],
  "16": [
    "Pendant mon temps libre, j’aime **jouer au tennis** et **me promener avec ma famille**. Cela me permet de **bouger et de penser à autre chose après les cours**.",
    "J’aime **lire** et **jouer aux jeux de société avec ma fille**. Cela me permet de me détendre. Nous aimons surtout **les jeux où chacun peut participer et discuter**."
  ],
  "17": [
    "Le week-end, je **me promène avec ma famille**. Nous aimons aussi **cuisiner ensemble**. Après une semaine chargée, **cela nous fait du bien de passer du temps ensemble**.",
    "Le week-end, je **vois mes amis** ou je **fais du sport**. Cela m’aide à **me détendre**. J’aime aussi **prendre du temps pour les personnes que j’aime**."
  ],
  "18": [
    "Je fais du sport **trois fois par semaine**. En général, je **joue au tennis**. Cela me permet de **rester active et de me détendre après les cours**.",
    "Je vais **à la salle de sport deux fois par semaine**. Cela me fait du bien. J’essaie de **garder ce rythme même quand je suis occupée**, parce que **je me sens mieux après une séance**."
  ],
  "19": [
    "J’aime cuisiner parce que **cela me détend**. J’aime aussi **préparer des plats pour ma famille**. Par exemple, le week-end, j’aime **essayer une nouvelle recette et la faire goûter à ma famille**.",
    "J’aime cuisiner parce que **je peux essayer de nouvelles recettes**. J’aime aussi **cuisiner avec ma famille**. Nous pouvons **préparer le repas ensemble et discuter en même temps**."
  ],
  "20": [
    "Le matin, je **vais en cours**. L’après-midi, je **fais mes devoirs**. Le soir, je **passe du temps avec ma famille**.",
    "En général, je **travaille pendant la journée**. Après le travail, je **fais du sport**, puis je **prépare le dîner**. Le soir, j’essaie de **me reposer pour être en forme le lendemain**."
  ],
  "21": [
    "J’apprends le français depuis **trois mois**. Je pratique **un peu chaque jour, en réécoutant les phrases vues en cours**. Cela m’aide à **reconnaître les mots plus facilement**.",
    "Ça fait **six mois** que j’apprends le français. J’essaie de **parler à voix haute plusieurs fois par semaine**. Je remarque que **les phrases deviennent plus faciles à retenir**."
  ],
  "22": [
    "J’apprends le français parce que **je trouve cette langue élégante**. Je voudrais aussi **mieux communiquer au Canada**. Par exemple, j’aimerais **pouvoir discuter plus facilement avec des personnes francophones**.",
    "J’ai commencé à apprendre le français pour **trouver plus facilement du travail**. J’aimerais aussi **parler avec des collègues et des clients francophones**."
  ],
  "23": [
    "Je suis **des cours en ligne** et je pratique avec **une professeure**. Je **répète les phrases à voix haute** chaque jour. Cela m’aide à **retenir les expressions et à savoir comment les utiliser**.",
    "J’apprends avec **un professeur**. Entre les cours, je **réécoute les enregistrements et je répète les phrases**. Cela m’aide à **mieux comprendre et à mieux prononcer les mots**."
  ],
  "24": [
    "Pour moi, le plus difficile, ce sont **les liaisons**. J’ai besoin de **réécouter et de répéter les phrases**. Par exemple, **quand les mots sont liés dans une phrase, je ne les reconnais pas toujours**.",
    "J’ai surtout **du mal à comprendre le français à l’oral**. Quand les gens parlent vite, je ne comprends pas toujours. Pour progresser, je **réécoute de courts dialogues et je vérifie si j’ai bien compris les questions**."
  ],
  "25": [
    "Je voudrais **communiquer plus facilement au Canada**. J’aimerais aussi **utiliser le français au travail**. Par exemple, je voudrais **poser une question et comprendre la réponse sans passer par l’anglais**.",
    "Je voudrais **parler français dans la vie de tous les jours** et **comprendre les personnes autour de moi**. Pour y arriver, je **m’entraîne souvent avec de courts dialogues**."
  ],
  "26": [
    "Plus tard, je voudrais **rester au Canada** et **travailler dans une garderie**. Je compte d’abord **terminer ma formation, puis chercher un emploi dans ce domaine**.",
    "Je voudrais **terminer mes études** et **trouver un emploi dans l’informatique**. J’aimerais **apprendre en travaillant et avoir une vie stable**."
  ],
  "27": [
    "Je devrais terminer mes études en **mai 2027**. D’ici là, je dois encore **terminer mes cours et faire mon stage**. Je voudrais ensuite **chercher un emploi dans mon domaine**.",
    "Je pense obtenir mon diplôme **à la fin de l’année prochaine**. Il me reste **quelques cours et un projet de fin d’études**. Après cela, je souhaite **commencer à travailler**."
  ],
  "28": [
    "Après mes études, je voudrais **travailler dans une garderie**. J’aimerais **m’occuper des jeunes enfants**. Je pourrais aussi **apprendre en travaillant avec des collègues qui ont plus d’expérience que moi**.",
    "Après mon diplôme, je voudrais devenir **administratrice de systèmes informatiques**. J’aimerais **trouver un premier emploi où je pourrais continuer à apprendre et à progresser**."
  ],
  "29": [
    "Je voudrais faire ce métier parce que **j’aime travailler avec les enfants**. J’aime **les aider à apprendre de nouvelles choses**. Par exemple, **quand un enfant réussit une activité et prend confiance en lui, cela me fait plaisir**.",
    "Ce métier m’intéresse parce que **j’aime résoudre des problèmes informatiques**. Il est aussi lié à **mes études**. Par exemple, **quand je trouve pourquoi un ordinateur ne fonctionne pas et que j’aide quelqu’un à reprendre son travail, je suis contente**."
  ],
  "30": [
    "Oui, je voudrais rester à **Toronto**. J’aime **la diversité de la ville et les possibilités de travail**. J’aimerais **y trouver un emploi stable et continuer à y vivre avec ma famille**.",
    "J’aimerais m’installer à **Calgary** pour **être plus proche de ma famille**. Cela me permettrait de **voir mes proches plus souvent et de partager davantage de moments avec eux**."
  ],
  "31": [
    "Dans ma famille, il y a **mon mari, ma fille et moi**. Nous aimons **passer du temps ensemble**. Le week-end, nous aimons **nous promener dans un parc ou cuisiner à la maison**.",
    "Dans ma famille, il y a **mes parents, ma sœur et moi**. Nous sommes **très proches**. Nous essayons de **nous appeler régulièrement, même quand nous ne vivons pas dans la même ville**."
  ],
  "32": [
    "Ma fille a **huit ans**. Elle va **à l’école primaire**. Nous aimons **jouer aux jeux de société ensemble après l’école**.",
    "Mes enfants ont **six et dix ans**. Ils vont **à l’école primaire**. Le week-end, nous aimons **faire des sorties en famille**."
  ],
  "33": [
    "Je suis plutôt **calme et patiente**. J’aime **prendre le temps d’écouter les autres**. Par exemple, quand **quelqu’un a une difficulté**, j’essaie de **comprendre la situation avant de proposer une solution**.",
    "Je suis **dynamique et sociable**. J’aime **rencontrer de nouvelles personnes**. Par exemple, j’aime **organiser une sortie et mettre les autres à l’aise dans un groupe**."
  ],
  "34": [
    "Je parle **chinois et anglais**, et j’apprends **le français**. Je pratique surtout **le français en cours et quand je répète les phrases à la maison**.",
    "Ma langue maternelle est **le chinois**. Je parle aussi **anglais**. J’utilise **l’anglais dans la vie quotidienne** et je travaille **le français avec une professeure**."
  ],
  "35": [
    "J’habite dans **un appartement** avec **ma famille**. J’y suis bien parce que **les transports et les magasins sont près de chez moi**.",
    "Je vis dans **une maison** avec **mon conjoint**. Nous aimons surtout **avoir de la place et être au calme pour nous reposer après le travail**."
  ],
  "36": [
    "J’aime surtout **la diversité de Toronto** et **la gentillesse des habitants**. Par exemple, je peux **découvrir des cuisines de différents pays dans mon quartier**. Cela me permet de **rencontrer des personnes de cultures différentes**.",
    "Dans ma ville, j’apprécie surtout **les parcs** et **le calme**. Après **les cours**, je peux **me promener près de chez moi et prendre l’air**. Cela m’aide à **me détendre après une journée chargée**."
  ],
  "37": [
    "Avec mes amis, j’aime **aller au restaurant** et **me promener**. Même si **nous sommes tous occupés**, nous essayons de **nous voir pour discuter et garder le contact**.",
    "Quand je vois mes amis, nous **cuisinons ensemble** ou nous **jouons aux jeux de société**. Nous n’avons pas besoin de **prévoir une grande sortie** pour **passer un bon moment ensemble**."
  ],
  "38": [
    "En général, je prends **le bus** pour **aller en cours**. C’est pratique parce que **l’arrêt est près de chez moi et que je n’ai pas besoin de chercher une place de parking**.",
    "Je me déplace surtout **en voiture**. Pour les petits trajets, je vais **à pied**. Cela me permet de **gagner du temps pour les longs trajets et de marcher un peu chaque jour**."
  ],
  "39": [
    "La dernière fois, je suis allée à **Paris** avec **ma famille**. Nous avons passé un très bon moment et pris beaucoup de belles photos.",
    "La dernière fois, je suis allée à **Montréal** avec **des amis**. Nous avons visité la ville et goûté des spécialités locales."
  ]
};
const SPECIAL={
  "你在加拿大生活了多久": [
    "Je vis au Canada depuis **deux ans**. Au début, **j’avais du mal à comprendre certaines habitudes et à faire les démarches**. Aujourd’hui, **je me sens plus à l’aise**.",
    "Ça fait **trois ans** que je vis au Canada. Depuis mon arrivée, j’ai **fait mes études et rencontré de nouvelles personnes**. Cela m’a aidée à **me sentir plus à l’aise ici**."
  ],
  "你以前在哪个领域工作": [
    "Avant de venir ici, je travaillais dans **l’éducation**. Je travaillais surtout avec **des étudiants et des collègues enseignants**. Cette expérience m’a appris à **expliquer les choses clairement**.",
    "Dans mon pays, je travaillais dans **la logistique**. Je **rangeais les dossiers et je vérifiais où en étaient les livraisons**. J’aimais **travailler en équipe**."
  ],
  "你在哪家公司工作": [
    "Je travaille pour **une entreprise de logistique**, à **Toronto**. Je m’occupe surtout **du soutien informatique pour les employés**. J’aime ce travail parce que **je peux résoudre des problèmes concrets**.",
    "Je travaille chez **ABC**, une entreprise dans **l’informatique**. J’aide **les clients à utiliser les logiciels**. Cela me permet d’**utiliser ce que j’ai appris pendant mes études**."
  ],
  "你最喜欢目前工作的哪些方面": [
    "Ce que j’aime le plus dans mon travail, c’est **aider les autres à résoudre leurs problèmes informatiques**. Quand **un ordinateur fonctionne à nouveau**, je vois que **j’ai vraiment aidé quelqu’un**. Cela me fait **plaisir de me sentir utile**.",
    "Dans mon travail, j’aime surtout **être avec les enfants**. Par exemple, j’aime **voir un enfant réussir une activité qu’il trouvait difficile**. Cela me donne **envie de continuer à les aider**."
  ],
  "你什么时候开始学法语": [
    "J’ai commencé à apprendre le français en **janvier 2026**. Au début, j’apprenais avec **des cours en ligne**. Maintenant, je **pratique régulièrement avec une professeure**.",
    "J’ai commencé à apprendre le français **l’année dernière**. Au début, j’apprenais surtout **les expressions de la vie de tous les jours**. Cela m’a donné envie de **continuer à apprendre**."
  ],
  "你毕业后想在哪个领域工作": [
    "Après mes études, je voudrais travailler dans **l’éducation de la petite enfance**. J’aimerais **aider les enfants à grandir et à apprendre**. En cours, j’apprends à **préparer des activités qui leur conviennent**.",
    "J’aimerais travailler dans **l’informatique** après mon diplôme. Cela m’intéresse parce que **j’aime comprendre comment fonctionnent les ordinateurs et résoudre des problèmes**. Je voudrais **continuer à apprendre en travaillant**."
  ],
  "你未来想在哪里定居": [
    "Plus tard, j’aimerais m’installer à **Toronto**. J’aime **la diversité de la ville et les possibilités de travail**. J’aimerais **y avoir une vie stable avec ma famille**.",
    "Je voudrais vivre à **Calgary**, près de **ma famille**. Nous pourrions **nous voir plus souvent et nous aider au quotidien**. Pour moi, **pouvoir compter sur ma famille, c’est important**."
  ],
  "你为什么这么喜欢这项活动": [
    "J’aime cette activité parce que **cela me détend après le travail**. Quand je la fais, je peux **penser à autre chose et oublier le stress de la journée**.",
    "J’aime cette activité parce que **je peux passer du temps avec mes amis**. Nous pouvons **discuter et nous amuser en faisant quelque chose qui nous plaît**."
  ],
  "为什么想去幼儿园工作": [
    "J’ai envie de travailler dans une garderie parce que **j’aime m’occuper des jeunes enfants**. Par exemple, j’aime **les aider à découvrir une nouvelle activité**. Cela me fait **plaisir de les voir apprendre**.",
    "Je voudrais travailler dans une garderie parce que **j’aime préparer des activités pour les enfants**. Je peux **choisir des jeux pour leur âge et les encourager à participer**. Je suis **patiente et j’aime prendre le temps de les aider**."
  ],
  "举一个法语在工作中有用的例子": [
    "Par exemple, je peux **répondre aux questions d’un client francophone** et **l’aider à trouver les informations dont il a besoin**. Nous pouvons **nous comprendre plus facilement**. C’est **plus simple pour lui et pour moi**.",
    "Par exemple, le français me permet de **parler avec mes collègues francophones**. Je peux **poser une question sans demander à quelqu’un de traduire**. C’est **plus facile de travailler ensemble**."
  ],
  "在目前这份工作之前做什么": [
    "Avant, j’étais **enseignante dans une école**. Je **préparais les cours et j’aidais les élèves pendant les activités**. Cela m’a appris à **être patiente et à expliquer les choses clairement**.",
    "Avant ce travail, j’étais **étudiante en informatique**. Pendant mes études, j’ai **fait des projets avec d’autres étudiants**. Cela m’a aidée à **me préparer pour mon premier emploi**."
  ],
  "毕业之后有什么安排": [
    "Après mon diplôme, je voudrais **chercher un emploi dans mon domaine**. J’aimerais **utiliser ce que j’ai appris et avoir une première expérience de travail**.",
    "Après mes études, je compte **travailler dans une garderie**. J’aimerais **m’occuper des jeunes enfants et continuer à apprendre avec mes collègues**."
  ],
  "具体解释你做什么工作": [
    "Je **règle les problèmes d’ordinateur** et je **m’occupe du réseau de l’entreprise**. Par exemple, quand **un collègue n’arrive plus à se connecter**, je **cherche ce qui ne va pas et je l’aide à se reconnecter**.",
    "Dans mon travail, je **réponds aux questions des clients** et je **les aide à trouver des solutions**. Par exemple, quand **un client utilise un nouveau service**, je **lui explique comment faire, étape par étape**."
  ]
};
BANK['30'][1]='Non, je ne souhaite pas rester dans cette ville. J’aimerais m’installer à **Calgary** pour **être plus proche de ma famille**. Cela me permettrait de **voir mes proches plus souvent**.';
BANK_CN['30'][1]='不，我不打算继续住在这座城市。我想定居卡尔加里，以便离家人更近。这样我就能更经常见到亲人。';
BANK['5']=['J’ai **30 ans**.','J’ai **37 ans**.'];
BANK_CN['5']=['我30岁。','我37岁。'];
BANK['40']=['Je m’appelle **Camille**.','Je m’appelle **Alex**.'];
BANK_CN['40']=['我叫Camille。','我叫Alex。'];
for(const [id,rows] of Object.entries(BANK))rows.forEach((fr,i)=>registerTranslation(fr,BANK_CN[id][i]));
for(const [id,rows] of Object.entries(SPECIAL))rows.forEach((fr,i)=>registerTranslation(fr,SPECIAL_CN[id][i]));
const norm=s=>String(s||'').toLocaleLowerCase('fr').normalize('NFD').replace(/\p{M}/gu,'').replace(/[’‘]/g,"'");
// Restrictive evidence rules retrieve verbatim sentences, not guessed personal facts.
function rule(item){const i=item.intent,g=item.group;
 if(g==='short')return null; // The preset dialogue is fictional and may not describe this student.
 if(g==='40')return{mods:[0],match:/je m'appelle|mon nom est/};
 if(g==='1')return{mods:[0],match:/je m'appelle|mon nom est/};
 if(g==='2')return{mods:[0],match:/je (?:viens de|suis (?:originaire|d'origine))/,reject:i.includes('城市')?/d'origine chinoise|(?:viens de|originaire de) (?:chine|la chine|canada|france)(?:[., ]|$)/:null};
 if(g==='3')return{mods:[0],match:/(?:j'habite|je (?:vis|reside))\b/,reject:i.includes('城市')?/(?:vis|habite|reside) (?:au canada|en chine|en france)(?:[., ]|$)/:null};
 if(g==='4')return{mods:[0],match:/(?:j'habite|je vis|je partage).*(?:avec|seul)/};
 if(g==='5')return{mods:[0],match:/j'ai (?:\d+|[a-z -]+) ans\b/};
 if(g==='6')return i.includes('多久')?{mods:[0,1],match:/(?:vis|habite|vie|suis|installe|installee).*(?:canada.*depuis|depuis.*canada)|(?:ca fait).*(?:ans|mois).*(?:canada)/}:{mods:[0,1],match:/(?:arriv|venu|venue|installe|installee).*(?:canada|ici).*(?:\b20\d\d\b|annee)|\b20\d\d\b.*(?:arriv|venu|venue)/};
 if(g==='7')return{mods:[1],match:/(?:venu|venue|choisi).*(?:canada|ici).*(?:parce que|pour |car )/};
 if(g==='8')return{mods:[1],match:/(?:j'ai (?:etudie|fait des etudes|obtenu)|j'etudiais|(?:une |ma )maitrise|(?:une |ma )licence|mon diplome)/};
 if(g==='9')return{mods:[1],match:/(?:j'etais|je travaillais|j'ai travaille|j'ai ete).*(?:enseign|administr|travail|entreprise|informat|educat|ingenieur|commerc|service|logist|sante|banque|restaur|comptab)/};
 if(g==='10')return{mods:[1,2],match:/(?:change|changer|autre chose|autre domaine).*(?:parce que|car |envie|realise)/};
 if(g==='11')return{mods:[2],match:/(?:j'etudie|je (?:poursuis|suis une formation|travaille)|je suis (?:etudiant|etudiante)|j'ai termine)/};
 if(g==='12')return{mods:[2],match:/(?:j'etudie|je poursuis mes etudes|je suis une formation)/};
 if(g==='13')return i.includes('公司')?{mods:[2],match:/je travaille.*(?:chez |pour |entreprise|societe)/}:{mods:[2],match:/(?:etudi|etudes|formation).*(?:college|universite|ecole|institut)/};
 if(g==='14')return i.includes('职责')?{mods:[2],match:/(?:je m'occupe|mes (?:taches|responsabilites)|mon travail consiste|je suis responsable)/}:{mods:[2],match:/(?:je travaille|je suis (?:educat|enseign|ingenieur|administr|technicien|infirmier|comptab)|j'occupe)/};
 if(g==='15')return i.includes('工作')?{mods:[2],match:/(?:j'aime|j'apprecie|me plait|ce que j'aime).*(?:travail|metier)|(?:travail|metier).*(?:parce que|car )/}:{mods:[2],match:/(?:j'aime|j'apprecie|me plait).*(?:domaine|formation|etudes|cours)|(?:formation|etudes).*(?:parce que|car )/};
 if(g==='16')return{mods:[3],match:/(?:j'aime|je joue|je fais|je pratique|je frequente|je vais|je lis)/};
 if(g==='17')return{mods:[3],match:/week.end|samedi|dimanche/};
 if(g==='18')return{mods:[3],match:/(?:sport|tennis|gym|salle|natation|velo|cours|marche).*(?:fois|regulier|souvent|chaque)|(?:fois|regulier|souvent|chaque).*(?:sport|tennis|salle|natation|velo)/};
 if(g==='19')return{mods:[3],match:i.includes('做饭')?/(?:cuisin|cuisine).*(?:parce que|permet|detend|plait|apprecie|aime)/:/(?:j'aime|me plait|j'apprecie).*(?:parce que|permet|car )/};
 if(g==='20')return{mods:[3],match:/le matin|l'apres.midi|le soir|journee (?:typique|habituelle)/,limit:3};
 if(g==='21')return{mods:[4],match:/francais.*(?:depuis|mois|ans|commence)|commence.*francais/};
 if(g==='22')return{mods:[4],match:/(?:francais|langue).*(?:parce que|pour |permet|car )/};
 if(g==='23')return{mods:[4],match:/(?:cours|professeur|professeure|enseignant|en ligne|podcast|application|repete|ecoute|pratique avec)/,limit:2};
 if(g==='24')return{mods:[4],match:/difficil|du mal|complique/};
 if(g==='25')return{mods:[4],match:/(?:objectif|but|souhaite|voudrais|veux|pour pouvoir|permet).*(?:communiquer|parler|travailler|integrer|comprendre|francais|horizon)/};
 if(g==='26')return{mods:[5],match:/(?:souhaite|voudrais|aimerais|compte|projet|veux)/,limit:2};
 if(g==='27')return{mods:[2,5],match:/(?:diplom|terminer|finir).*(?:\b20\d\d\b|annee|mois|mai|juin|juillet|aout|septembre|decembre)/};
 if(g==='28')return{mods:[5],match:/(?:souhaite|voudrais|aimerais|compte|veux).*(?:travail|devenir|emploi|metier)/};
 if(g==='29')return{mods:[5],match:/(?:travail|metier|emploi).*(?:parce que|car |permet)/};
 if(g==='30')return{mods:[5],match:/(?:souhaite|voudrais|aimerais|compte|veux).*(?:install|vivre|rester|etablir)/};
 if(g==='31')return{mods:[0],match:/(?:ma famille|mon mari|ma femme|mon conjoint|ma conjointe|mes enfants|ma fille|mon fils|mes parents|ma soeur|mon frere)/};
 if(g==='32')return{mods:[0],match:/(?:ma fille|mon fils|mes enfants).*(?:a |ont |ages?).*(?:ans|an\b)/};
 if(g==='33')return{mods:[0,3],match:/(?:je suis|quelqu'un).*(?:calme|patient|patiente|dynamique|sociable|actif|active|timide|ouvert|reserve|caractere)/};
 if(g==='34')return{mods:[0,4],match:/je parle|langue maternelle/};
 if(g==='35')return{mods:[0],match:/(?:j'habite|je vis|mon logement).*(?:maison|appartement|studio)/};
 if(g==='36')return{mods:[0],match:/(?:ville|toronto|calgary|winnipeg|montreal).*(?:apprecie|aime|plait|diversite|modernite|gentillesse)/};
 if(g==='37')return{mods:[3],match:/(?:mes amis|des amis).*(?:jou|promen|cuisin|restaurant|sort|activit)|(?:jou|promen|cuisin|restaurant|sort).*(?:mes amis|des amis)/};
 if(g==='38')return{mods:[3],match:/(?:je prends|je me deplace|je vais|je conduis).*(?:bus|metro|voiture|pied|velo|transport)/};
 if(g==='39')return{mods:[1,3],match:/(?:dernier voyage|derniere fois|dernieres vacances)/};
 return null;
}
const finish=s=>{s=String(s||'').trim().replace(/^[,;:\s]+|[,;:\s]+$/g,'').replace(/[.!?]+$/,'');return s?s[0].toLocaleUpperCase('fr')+s.slice(1)+'.':''};
function focusedFact(item,text){const g=item.group,i=item.intent;let m;
 if(g==='40'){m=text.match(/(?:je m[’']appelle|mon nom est)\s+([^,.!?;\n]+)/iu);if(!m)return null;const name=m[1].split(/\s+(?:et|j[’']ai|je\b|âgé|âgée)\s*/iu)[0].trim();return name?{text:'Je m’appelle '+name+'.',cn:'我叫'+name+'。'}:null}
 // Closed factual questions call for exactly the requested fact, not a whole sentence from the introduction.
 if(g==='5'){m=text.match(/\bj[’']ai\s+(\d{1,3}|[\p{L} -]+?)\s+ans\b/iu);if(!m)return null;return{text:'J’ai '+m[1]+' ans.',cn:/^\d+$/.test(m[1])?'我'+m[1]+'岁。':undefined}}
 if(g==='3'){
  m=text.match(/\b(j[’']habite|je (?:vis|réside))\s+(?:actuellement\s+)?((?:à|au|aux|en|dans)\s+[^,.!?\n]+)/iu);
  if(!m)return null;let place=m[2].split(/\s+(?:avec|depuis|parce que|car|et\s+(?:j[’']|je\b))/iu)[0].trim();
  if(i.includes('城市')&&/^(?:au Canada|en Chine|en France|aux États-Unis)$/iu.test(place))return null;
  return{text:finish(m[1]+' '+place)};
 }
 if(g==='4'){
  m=text.match(/(?:j[’']habite|je vis|je partage mon logement)[^.!?\n]*?\bavec\s+([^,.!?\n]+)/iu);
  if(m)return{text:finish('J’habite avec '+m[1].split(/\s+(?:et\s+(?:j[’']|je\b)|parce que|car)\s*/iu)[0])};
  m=text.match(/(?:j[’']habite|je vis)\s+seul(?:e)?\b/iu);return m?{text:finish(m[0])}:null;
 }
 if(g==='6'){
  if(i.includes('多久')){m=text.match(/(?:canada[^.!?\n]{0,25}?depuis\s+)([^,.!?\n]+)/iu);if(!m)return null;return{text:finish('Je vis au Canada depuis '+m[1].split(/\s+(?:et|parce que|car)\s+/iu)[0])}}
  if(!/(?:arriv|venu|install)/iu.test(text))return null;
  m=text.match(/\ben\s+((?:(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+)?20\d{2})\b/iu);
  if(!m)return null;const verb=/arrivée|venue|installée/iu.test(text)?'arrivée':'arrivé';return{text:'Je suis '+verb+' au Canada en '+m[1]+'.'};
 }
 if(g==='21'){
  if(i.includes('开始')){m=text.match(/(?:commencé[^.!?\n]*?français|français)[^.!?\n]*?\ben\s+((?:(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+)?20\d{2})\b/iu);if(m)return{text:'J’ai commencé à apprendre le français en '+m[1]+'.'}}
  m=text.match(/français[^.!?\n]*?\bdepuis\s+([^,.!?\n]+)/iu);if(m)return{text:finish('J’apprends le français depuis '+m[1].split(/\s+(?:parce que|car|et\s+(?:j[’']|je\b))/iu)[0])};return null;
 }
 if(g==='30'){
  if(i.includes('哪里')){m=text.match(/(?:installer|établir|vivre|habiter)[^.!?\n]*?\bà\s+([^,.!?\n]+)/iu);if(!m)return null;const place=m[1].split(/\s+(?:pour|avec|parce que|et\s+(?:j[’']|je\b))/iu)[0];return{text:finish('J’aimerais m’installer à '+place)}}
  // Settling in Canada does not prove a wish to stay in the present city.
  m=text.match(/(?:je souhaite|je voudrais|j[’']aimerais|je compte|je veux)\s+(?:continuer à vivre|rester)\s+([^.!?\n]+)/iu);return m?{text:finish(m[0])}:null;
 }
 return undefined;
}
function sourceAnswer(item,p){if(!p?.modules?.length||/虚构|示例/.test(p.name||''))return null;
 if(item.group==='1'){const text=p.modules.flatMap(m=>m.paragraphs||[]).map(x=>x.text).filter(Boolean).join('\n\n');if(text)return{source:true,name:p.name,text}}
 const r=rule(item);if(!r)return null;
 const exact=p.questions?.find(q=>norm(q.q).replace(/[^a-z0-9]/g,'')===norm(item.fr).replace(/[^a-z0-9]/g,''));
 const records=r.mods.flatMap(mod=>p.modules[mod]?.paragraphs||[]).concat(exact?.paragraphs||[]);
 const found=[];
 for(const para of records)for(const sentence of String(para.text||'').match(/[^.!?\n]+(?:[.!?]+|$)/g)||[]){
  // Split independent first-person statements before deciding whether they answer this question.
  const clauses=sentence.split(/[,;]\s*(?=(?:j[’']|je\b|nous\b))|\s+et\s+(?=(?:j[’']|je\b|nous\b))/iu);
  for(const clause of clauses){const text=clause.trim(),n=norm(text);if(!r.match.test(n)||r.reject?.test(n))continue;
   const fact=focusedFact(item,text);if(fact===null)continue;
   if(fact)return{source:true,name:p.name,...fact};
   // Do not confuse a previous diploma with a future graduation, or a previous course with current study.
   if(['11','12','13'].includes(item.group)&&/j'ai (?:termine|etudie|obtenu)/.test(n))continue;
   if(item.group==='27'&&!/(?:devrais|devrait|vais|va |pense|terminer|finir|obtenir|serai)/.test(n))continue;
   const cleaned=finish(text);if(cleaned&&!found.includes(cleaned))found.push(cleaned);
  }
 }
 return found.length?{source:true,name:p.name,text:found.slice(0,r.limit||1).join(' ')}:null;
}
function baseAnswer(item,profile){const fromSource=sourceAnswer(item,profile);if(fromSource)return fromSource;const choices=SPECIAL[item.intent]||BANK[item.group];if(!choices)return{source:false,text:'Je voudrais **chercher un emploi dans mon domaine**.'};const index=Math.floor(Math.random()*choices.length);return{source:false,text:choices[index],cn:(SPECIAL[item.intent]?SPECIAL_CN[item.intent]:BANK_CN[item.group])[index]}}

export function sampleAnswer(item,profile){const base=baseAnswer(item,profile);return{...base,variants:adaptAnswer(item,base)}}
