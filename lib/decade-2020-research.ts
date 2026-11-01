import type { HistEvent, DatePrecision, Dimension } from "./types";

/**
 * Historical research for 2020, assembled from date-specific primary documents,
 * institutional reports and contemporary journalism. These records supplement
 * existing January 13 (parliament) and March 19 (first COVID cases) entries.
 * Source links are exposed exclusively through the site's /sources index.
 */
type Entry = {
  slug: string; date: string; precision: DatePrecision; dimension: Dimension;
  categories: string[]; location: string; countries?: string[]; people?: string[];
  title: string; ft: string; summary: string; fs: string;
  body: string; fb: string; sources: [string, string][];
};
const entries: Entry[] = [
  {
    "precision": "day",
    "slug": "haiti-police-army-clashes-carnival-2020",
    "date": "2020-02-23",
    "dimension": "inside",
    "categories": [
      "politics",
      "society",
      "arts"
    ],
    "location": "Champ de Mars, Port-au-Prince",
    "title": "Police–army gunfire disrupts Haiti's Carnival",
    "ft": "Des affrontements entre policiers et militaires perturbent le Carnaval",
    "summary": "A confrontation during police protests forced the government to cancel the principal Carnival festivities in Port-au-Prince.",
    "fs": "Des affrontements liés à des revendications policières entraînent l'annulation du Carnaval national à Port-au-Prince.",
    "body": "On 23 February 2020, off-duty police officers and supporters demonstrating for better pay, safer working conditions and a recognized union exchanged fire with members of Haiti's reconstituted armed forces near the National Palace. The confrontation took place around Champ de Mars as the capital was preparing for the opening of its principal Carnival celebrations. In the evening the authorities canceled the festivities in Port-au-Prince, citing the risk of further bloodshed. The episode revealed serious tensions inside the security institutions and also deprived vendors, performers and other Carnival workers of an important source of seasonal activity. It should be understood as both a political-security crisis and a disruption of a major cultural tradition, not simply as the cancellation of a public festival.",
    "fb": "Le 23 février 2020, des policiers hors service et leurs soutiens, mobilisés notamment pour de meilleures conditions de travail et la reconnaissance d'un syndicat, échangent des tirs avec des militaires près du Palais national. Les affrontements se produisent au Champ de Mars, alors que Port-au-Prince se prépare à célébrer le Carnaval. Les autorités annulent les festivités dans la capitale par crainte de nouvelles violences. Cet épisode révèle de fortes tensions entre les institutions de sécurité et affecte aussi les artistes, les commerçants et les personnes dont l'activité dépend du Carnaval. Il relève à la fois de l'histoire politique, de la sécurité publique et de la vie culturelle.",
    "sources": [
      [
        "Associated Press report published by PBS NewsHour",
        "https://www.pbs.org/newshour/world/haiti-police-exchange-fire-with-troops-near-national-palace"
      ],
      [
        "Human Rights Watch, events of 2020",
        "https://www.hrw.org/world-report/2021/country-chapters/haiti"
      ]
    ]
  },
  {
    "precision": "month",
    "slug": "joseph-jouthe-appointed-prime-minister-2020",
    "date": "2020-03",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince",
    "title": "Joseph Jouthe becomes prime minister amid the parliamentary vacuum",
    "ft": "Joseph Jouthe devient Premier ministre dans un contexte de vide parlementaire",
    "summary": "Jovenel Moïse appoints Joseph Jouthe as prime minister without a functioning national legislature to provide the customary parliamentary process.",
    "fs": "Jovenel Moïse désigne Joseph Jouthe à la primature alors que le Parlement ne peut plus fonctionner normalement.",
    "body": "In early March 2020, President Jovenel Moïse appointed Joseph Jouthe as prime minister, succeeding Jean-Michel Lapin in a period when Haiti no longer had an operational parliament. The appointment came weeks after legislative mandates had expired because overdue elections were not held. Under ordinary constitutional arrangements the relationship between the executive and legislature provides opportunities for parliamentary scrutiny; in 2020 those checks were severely weakened. Jouthe's government soon faced the arrival of COVID-19, rising insecurity and a worsening economy. The episode illustrates how administrative continuity continued despite an institutional vacuum. Different political groups disputed the legitimacy and extent of executive power during the period, a distinction that belongs in the full historical account.",
    "fb": "Au début de mars 2020, le président Jovenel Moïse nomme Joseph Jouthe Premier ministre pour succéder à Jean-Michel Lapin. Cette nomination intervient alors que les mandats parlementaires ont expiré faute d'élections et que le Parlement n'est plus en mesure de fonctionner normalement. Les mécanismes ordinaires de contrôle de l'exécutif s'en trouvent affaiblis. Le nouveau gouvernement doit rapidement répondre à l'arrivée de la COVID-19, aux difficultés économiques et à l'insécurité. L'épisode montre que l'administration continue de fonctionner malgré un vide institutionnel, tandis que l'étendue et la légitimité des pouvoirs exécutifs demeurent contestées.",
    "sources": [
      [
        "U.S. Department of State, Haiti human rights report for 2020",
        "https://2021-2025.state.gov/reports/2020-country-reports-on-human-rights-practices/haiti/"
      ],
      [
        "IMF, institutional chronology of Haiti",
        "https://www.elibrary.imf.org/view/journals/002/2022/207/article-A001-en.xml"
      ]
    ],
    "people": [
      "joseph-jouthe",
      "jovenel-moise"
    ]
  },
  {
    "precision": "month",
    "slug": "haiti-covid-schools-closure-2020",
    "date": "2020-03",
    "dimension": "inside",
    "categories": [
      "education",
      "society",
      "economy"
    ],
    "location": "Haiti",
    "title": "School closures disrupt education for millions of Haitian children",
    "ft": "La fermeture des écoles interrompt l'éducation de millions d'enfants haïtiens",
    "summary": "Measures adopted after the first coronavirus cases interrupted classes and exposed unequal access to home learning.",
    "fs": "Les mesures contre la pandémie interrompent les cours et révèlent les inégalités d'accès à l'enseignement à distance.",
    "body": "After Haiti announced its first confirmed coronavirus cases on 19 March 2020, schools closed along with several other public and economic activities. For many students, the interruption followed the previous year's peyi lòk protests, which had already caused extensive missed school days. Remote learning could not simply replace classrooms: many households lacked reliable internet, electricity, devices or the financial means to support home instruction. UNICEF documented efforts to develop printed learning materials, catch-up classes and hygiene provisions for school reopening. This is an education story as well as a public-health response. Its consequences were not uniform: children with limited resources and those already outside formal school faced a much greater risk of falling behind.",
    "fb": "Après l'annonce des premiers cas confirmés de coronavirus le 19 mars 2020, les établissements scolaires ferment. Pour de nombreux élèves, cette interruption suit déjà les perturbations du peyi lòk en 2019. L'enseignement à distance ne peut remplacer les cours pour les familles privées d'électricité fiable, d'internet ou de matériel adapté. L'UNICEF documente la préparation de supports imprimés, de cours de rattrapage et de mesures d'hygiène pour la reprise. Les effets ne sont pas identiques pour tous : les élèves les plus défavorisés et les enfants exclus du système scolaire sont davantage exposés à la perte d'apprentissage.",
    "sources": [
      [
        "UNICEF, education and the pandemic in Haiti (2020)",
        "https://www.unicef.org/haiti/recits/coronavirus-pandemic-denies-children-access-their-basic-rights"
      ],
      [
        "UNICEF Haiti Country Office Annual Report 2020",
        "https://www.unicef.org/media/100291/file/Haiti-2020-COAR.pdf"
      ]
    ]
  },
  {
    "precision": "day",
    "slug": "imf-covid-financing-haiti-april-2020",
    "date": "2020-04-17",
    "dimension": "foreign",
    "categories": [
      "economy",
      "world",
      "education"
    ],
    "location": "Washington, D.C., United States",
    "countries": [
      "United States",
      "International Monetary Fund",
      "Haiti"
    ],
    "title": "IMF approves $111.6 million in emergency financing for Haiti",
    "ft": "Le FMI approuve une aide d'urgence de 111,6 millions de dollars à Haïti",
    "summary": "The IMF authorizes Rapid Credit Facility financing to address pandemic-related health, fiscal and balance-of-payments pressures.",
    "fs": "Le FMI autorise un décaissement d'urgence pour faire face aux pressions sanitaires et économiques liées à la pandémie.",
    "body": "On 17 April 2020, the IMF Executive Board approved US$111.6 million for Haiti under its Rapid Credit Facility. The Fund said the financing was intended to ease balance-of-payments pressures and provide fiscal space for healthcare, income support and social assistance during the coronavirus emergency. In its public announcement the IMF also called for transparent monthly reporting on pandemic spending and a later audit of related operations. Approval of financing was not proof that every proposed service or assistance measure reached people as intended; the effectiveness and allocation of spending require separate scrutiny. This entry belongs to the history of Haiti's economy and to the influence of international financial institutions on domestic policy.",
    "fb": "Le 17 avril 2020, le conseil d'administration du Fonds monétaire international approuve un décaissement de 111,6 millions de dollars au titre de la Facilité de crédit rapide. Le financement doit aider Haïti à faire face aux besoins de balance des paiements, aux dépenses de santé et aux mesures de soutien aux revenus. Le FMI demande aussi des rapports réguliers sur les dépenses liées à la pandémie et un audit ultérieur. L'approbation des fonds ne prouve pas que les aides aient toutes atteint leurs destinataires : leur utilisation doit être étudiée séparément. La décision illustre les relations entre politique économique nationale et institutions financières internationales.",
    "sources": [
      [
        "IMF, press release of 17 April 2020",
        "https://www.imf.org/en/news/articles/2020/04/17/pr20171-haiti-imf-executive-board-approves-us-111-6m-disbursement-address-covid19-pandemic"
      ]
    ]
  },
  {
    "precision": "day",
    "slug": "g9-armed-coalition-formed-june-2020",
    "date": "2020-06-10",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Port-au-Prince metropolitan area",
    "title": "G9 armed-group alliance emerges in Port-au-Prince",
    "ft": "Une coalition de groupes armés, le G9, émerge à Port-au-Prince",
    "summary": "A federation of armed groups headed by former police officer Jimmy Chérizier becomes a central force in the capital's security crisis.",
    "fs": "Une fédération de groupes armés conduite par l'ancien policier Jimmy Chérizier s'impose comme acteur majeur de l'insécurité.",
    "body": "A new alliance of armed groups known as G9 an fanmi e alye took shape in the Port-au-Prince area in June 2020. A UN Secretary-General report dated September identifies 10 June as the formation of the coalition and describes its initial membership, its expansion, and its influence in neighborhoods including Cité Soleil, La Saline and lower Delmas. Former police officer Jimmy Chérizier was reported as a leading figure. The alliance was associated with violent struggles over territory, access routes and the control of neighborhoods. Human rights organizations also raised concerns about possible connections between gang actors and political interests; those allegations require careful attribution rather than being treated as established verdicts. The emergence of G9 helps explain the later escalation of armed-group coalitions and the fragmentation of state security authority.",
    "fb": "En juin 2020, l'alliance de groupes armés G9 an fanmi e alye se constitue dans la région métropolitaine de Port-au-Prince. Un rapport du Secrétaire général de l'ONU situe sa formation au 10 juin et décrit son implantation dans plusieurs quartiers, notamment Cité Soleil, La Saline et le bas Delmas. L'ancien policier Jimmy Chérizier figure parmi ses responsables. Les groupes armés se disputent des territoires, des routes et l'accès à des quartiers populaires. Des organisations de défense des droits humains évoquent aussi de possibles liens avec des intérêts politiques, mais ces allégations doivent être attribuées et vérifiées. La création du G9 constitue une étape importante dans l'évolution ultérieure des coalitions armées.",
    "sources": [
      [
        "UN Secretary-General, BINUH report S/2020/944",
        "https://www.haitidocs.org/doc/binuh-sg-reports-2020-2"
      ],
      [
        "United Nations Haiti, humanitarian access and gang alliances",
        "https://haiti.un.org/en/189876-haiti-impact-deteriorating-security-situation-humanitarian-access-background-note-july-2022"
      ]
    ]
  },
  {
    "precision": "month",
    "slug": "cite-soleil-violence-may-july-2020",
    "date": "2020-06",
    "dimension": "inside",
    "categories": [
      "society",
      "politics"
    ],
    "location": "Cité Soleil, Port-au-Prince",
    "title": "Armed attacks in Cité Soleil deepen the civilian protection crisis",
    "ft": "Les violences armées à Cité Soleil aggravent la crise de protection des civils",
    "summary": "A succession of attacks and clashes between May and July displaced families and exposed residents to killings and sexual violence.",
    "fs": "Entre mai et juillet, plusieurs attaques provoquent des déplacements et exposent la population aux meurtres et aux violences sexuelles.",
    "body": "Between May and July 2020, armed groups fought and attacked communities in Cité Soleil and adjoining areas of Port-au-Prince. Human rights investigations documented killings, sexual violence, homes burned or damaged, and families forced to flee. The women and girls affected were not merely incidental victims of a political confrontation: sexual violence was reported as part of the insecurity experienced in and around homes, streets and markets. Accurate reporting must distinguish the dates and methodologies of different investigations rather than combining casualty figures without context. The attacks also affected access to work, food, schools and healthcare. This episode should be documented from the perspectives of residents and rights groups, alongside the security and political dimensions.",
    "fb": "Entre mai et juillet 2020, des groupes armés commettent des attaques et s'affrontent à Cité Soleil et dans des quartiers voisins de Port-au-Prince. Des enquêtes d'organisations de défense des droits humains font état de morts, de violences sexuelles, de maisons endommagées ou incendiées et de familles contraintes de partir. Les violences subies par les femmes et les filles sont une dimension centrale de cette histoire. Il importe de respecter les périodes et méthodes des différentes enquêtes avant de comparer les bilans. Les affrontements perturbent également l'accès aux marchés, au travail, aux soins et à l'école. Le récit doit accorder une place aux témoignages des habitants et aux observations des organisations locales.",
    "sources": [
      [
        "CSIS, analysis of gender-based violence and gang attacks",
        "https://www.csis.org/analysis/gender-based-violence-crisis-haiti"
      ],
      [
        "Human Rights Watch, Haiti events of 2020",
        "https://www.hrw.org/world-report/2021/country-chapters/haiti"
      ]
    ]
  },
  {
    "precision": "day",
    "slug": "social-protection-policy-haiti-2020",
    "date": "2020-06-12",
    "dimension": "inside",
    "categories": [
      "economy",
      "society",
      "education"
    ],
    "location": "Haiti",
    "title": "Haiti adopts a national social protection and promotion policy",
    "ft": "Haïti adopte une politique nationale de protection et de promotion sociales",
    "summary": "The government's policy proposes longer-term systems to address poverty, inequality and vulnerability.",
    "fs": "Le gouvernement adopte une politique destinée à lutter contre la pauvreté, les inégalités et la vulnérabilité sociale.",
    "body": "On 12 June 2020, Haiti adopted its National Social Protection and Promotion Policy, prepared with input from government ministries, civil-society organizations and international partners. The document set long-term goals to reduce poverty and inequality and to strengthen support for people affected by illness, unemployment, disability, old age or sudden crises. Its proposed instruments included cash transfers and other social assistance, with attention to children, caregivers and vulnerable communities. The policy was an institutional achievement during a difficult year, but adoption must not be confused with complete implementation. Studying how much funding was available and which programs actually reached residents is necessary to evaluate its historical significance.",
    "fb": "Le 12 juin 2020, Haïti adopte la Politique nationale de protection et de promotion sociales, élaborée avec des ministères, des organisations de la société civile et des partenaires internationaux. Ce cadre vise à réduire durablement la pauvreté et les inégalités, tout en améliorant l'assistance aux personnes touchées par la maladie, la perte de revenus, le handicap, la vieillesse et les crises. Parmi les dispositifs envisagés figurent des transferts monétaires et d'autres formes de soutien social. Il s'agit d'une avancée institutionnelle, mais l'adoption du texte ne signifie pas sa mise en œuvre complète. Son bilan exige de suivre les financements et les bénéficiaires réels.",
    "sources": [
      [
        "ECLAC, policy date and costing of transfers",
        "https://www.cepal.org/en/publications/46248-estimates-cost-cash-transfers-under-national-policy-social-protection-and"
      ],
      [
        "WFP, national social protection policy",
        "https://www.wfp.org/news/government-haiti-adopts-wfp-supported-social-protection-and-promotion-policy"
      ]
    ]
  },
  {
    "precision": "month",
    "slug": "municipal-mandates-expire-2020",
    "date": "2020-07",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Haiti",
    "title": "Local government terms expire and mayors are replaced by appointment",
    "ft": "Les mandats municipaux expirent et les maires sont remplacés par nomination",
    "summary": "The expiry of elected mayors' terms gives the executive greater influence over local administrations.",
    "fs": "L'expiration des mandats des maires élus accroît l'influence de l'exécutif sur les administrations communales.",
    "body": "In July 2020, the mandates of Haiti's elected mayors expired. Rather than holding municipal elections, President Jovenel Moïse reappointed or replaced local officials, according to the U.S. State Department's account of the year. The change mattered far beyond the capital: municipal authorities oversee important local services, public spaces and relationships with residents. At a time when national parliament was already inactive, replacing elected local leadership further reduced opportunities for representative political accountability. The effects varied by municipality and should be investigated through local records rather than inferred from the national decree alone. The episode belongs in the history of decentralization as well as the constitutional crisis.",
    "fb": "En juillet 2020, les mandats des maires élus d'Haïti expirent. Faute d'élections municipales, le président Jovenel Moïse reconduit ou remplace les responsables locaux, comme le relate le rapport annuel du département d'État américain. Ces décisions concernent aussi les services communaux, les espaces publics et les relations entre municipalités et habitants. Alors que le Parlement national ne fonctionne déjà plus, le recours aux nominations réduit davantage les occasions de contrôle démocratique. Les conséquences doivent être étudiées commune par commune, à partir d'archives et de témoignages locaux. L'épisode s'inscrit dans l'histoire de la décentralisation et de la crise institutionnelle.",
    "sources": [
      [
        "U.S. Department of State, Haiti human rights report 2020",
        "https://2021-2025.state.gov/reports/2020-country-reports-on-human-rights-practices/haiti/"
      ]
    ],
    "people": [
      "jovenel-moise"
    ]
  },
  {
    "precision": "day",
    "slug": "haitian-league-season-abandoned-2020",
    "date": "2020-07-02",
    "dimension": "inside",
    "categories": [
      "sports",
      "society"
    ],
    "location": "Haiti",
    "title": "Haiti's top-flight football season is abandoned amid COVID-19",
    "ft": "Le championnat national de football est abandonné pendant la pandémie",
    "summary": "The 2020 Ligue Haïtienne was suspended in March and later abandoned without a champion.",
    "fs": "Le championnat haïtien de première division, interrompu en mars, est abandonné sans champion.",
    "body": "Haiti's 2020 top-flight football championship opened in late February, only weeks before the coronavirus pandemic forced sports organizations around the world to suspend competition. The league was halted on 20 March and abandoned on 2 July, with no champion declared for the season. Match records compiled by the Rec.Sport.Soccer Statistics Foundation preserve the results and standings up to the interruption. The disruption affected clubs, coaches, players, sports workers and supporters, and demonstrates how public-health decisions reached the cultural and recreational life of Haitian communities. It also illustrates a historical distinction: a championship that begins and is later abandoned is not evidence that a club won the planned season.",
    "fb": "Le championnat national haïtien de première division commence à la fin de février 2020, quelques semaines avant que la pandémie n'entraîne la suspension des compétitions sportives. Le tournoi est interrompu le 20 mars, puis abandonné le 2 juillet, sans attribution du titre de champion. Les archives de résultats conservent les matchs et le classement au moment de l'arrêt. Cette interruption concerne les clubs, les joueurs, les entraîneurs, les employés et les supporters. Elle montre comment les mesures sanitaires touchent aussi les pratiques sportives et la vie collective.",
    "sources": [
      [
        "RSSSF, Haiti 2020 national league results and interruption",
        "https://www.rsssf.org/tablesh/haiti2020.html"
      ]
    ]
  },
  {
    "precision": "month",
    "slug": "haiti-schools-catch-up-reopening-2020",
    "date": "2020-08",
    "dimension": "inside",
    "categories": [
      "education",
      "society"
    ],
    "location": "Haiti",
    "title": "Schools prepare to reopen with catch-up classes and hygiene measures",
    "ft": "Les écoles préparent la reprise avec rattrapage et mesures d'hygiène",
    "summary": "Educators and aid organizations develop learning recovery programs after months of interrupted schooling.",
    "fs": "Des programmes de rattrapage sont mis en place après plusieurs mois de fermeture des établissements scolaires.",
    "body": "During the second half of 2020, the Haitian Ministry of Education and its partners prepared the return of pupils after extensive closures caused by the pandemic and preceding civil unrest. UNICEF's annual reporting documents catch-up classes for tens of thousands of children, school hygiene support, reading materials and efforts to reach children without reliable internet. Even where classes resumed, the need to recover lost learning time remained acute. Access depended on households' ability to pay for transport, supplies and fees, and on schools' capacity to provide safe facilities. This event records a major educational response rather than claiming that every school reopened on one date or that educational gaps were resolved.",
    "fb": "Au second semestre 2020, le ministère de l'Éducation et ses partenaires préparent la reprise scolaire après les fermetures liées à la pandémie et aux troubles civils précédents. Les rapports de l'UNICEF décrivent des cours de rattrapage, des supports de lecture et un appui à l'hygiène scolaire pour des dizaines de milliers d'enfants. La reprise ne signifie pourtant pas la disparition des pertes d'apprentissage. Les moyens des familles, le transport, les frais scolaires et l'état des établissements continuent de déterminer l'accès à l'éducation. L'entrée documente une réponse éducative sans supposer que toutes les écoles ont rouvert le même jour.",
    "sources": [
      [
        "UNICEF Haiti annual report, education programs 2020",
        "https://www.unicef.org/media/100291/file/Haiti-2020-COAR.pdf"
      ],
      [
        "UNICEF Haiti humanitarian situation report, December 2020",
        "https://www.unicef.org/media/94046/file/Haiti-SitRep-December-2020.pdf"
      ]
    ]
  },
  {
    "precision": "day",
    "slug": "tropical-storm-laura-haiti-2020",
    "date": "2020-08-23",
    "dimension": "inside",
    "categories": [
      "environment",
      "society",
      "economy"
    ],
    "location": "West and Southeast departments, Haiti",
    "title": "Tropical Storm Laura brings flooding and damage to Haiti",
    "ft": "La tempête tropicale Laura provoque des inondations et des dégâts en Haïti",
    "summary": "Laura passes across Haiti, causing flash floods, fatalities, agricultural losses and disruptions to transport.",
    "fs": "Laura traverse Haïti et provoque des crues, des victimes, des pertes agricoles et des difficultés de circulation.",
    "body": "On 23 August 2020, Tropical Storm Laura passed over Haiti with heavy rain, strong winds and dangerous sea conditions. Haiti's Civil Protection Directorate reported flooding in multiple departments, evacuations, damaged homes and roads, and losses to crops and livestock. A regional disaster report issued the next day recorded nine reported deaths and two people missing in its initial assessment; those numbers are preliminary, not a final nationwide casualty total. The Cayes-Jacmel bridge was reported blocked by debris, illustrating how a storm can interrupt access to communities and markets. Laura occurred during an already difficult year shaped by COVID-19 and economic strain, increasing the burden on households and emergency services.",
    "fb": "Le 23 août 2020, la tempête tropicale Laura traverse Haïti avec de fortes pluies, des rafales et une mer dangereuse. La Direction de la protection civile signale des inondations dans plusieurs départements, des évacuations, des dommages aux habitations et aux routes, ainsi que des pertes agricoles. Un premier rapport régional daté du lendemain fait état de neuf décès signalés et de deux disparus ; ce bilan est provisoire. Le pont de Cayes-Jacmel est alors obstrué par des dépôts, ce qui montre les conséquences sur les déplacements et l'accès aux marchés. La tempête aggrave les difficultés d'une année déjà marquée par la COVID-19.",
    "sources": [
      [
        "Caribbean Disaster Emergency Management Agency, Tropical Storm Laura situation report 1",
        "https://cdema.org/CDEMA_Situation_Report_1_-_TS_Laura_24Aug2020.pdf"
      ]
    ]
  },
  {
    "precision": "day",
    "slug": "montferrier-dorval-assassinated-2020",
    "date": "2020-08-28",
    "dimension": "inside",
    "categories": [
      "politics",
      "education",
      "society"
    ],
    "location": "Port-au-Prince",
    "title": "Constitutional scholar and bar president Montferrier Dorval is murdered",
    "ft": "L'avocat et constitutionnaliste Montferrier Dorval est assassiné",
    "summary": "The killing of the Port-au-Prince Bar Association's president shocks legal and civic communities.",
    "fs": "Le meurtre du bâtonnier du barreau de Port-au-Prince provoque une vive réaction des milieux juridiques et civiques.",
    "body": "On 28 August 2020, Montferrier Dorval, law professor and president of the Port-au-Prince Bar Association, was murdered in Port-au-Prince. He had publicly criticized Haiti's governing crisis and was known for his work on constitutional law and institutional reform. The UN Secretary-General's September report described the assassination as a warning to the civic community and recorded strong demands for investigation and accountability from magistrates, lawyers and rights organizations. The timing of his death generated questions and speculation, but neither motive nor responsibility should be declared established without judicial evidence. Dorval's murder became a defining example of the danger facing prominent legal professionals and public intellectuals.",
    "fb": "Le 28 août 2020, Montferrier Dorval, professeur de droit et bâtonnier de l'Ordre des avocats de Port-au-Prince, est assassiné. Il s'était exprimé publiquement sur la crise de gouvernance et travaillait sur les questions constitutionnelles. Le rapport de septembre du Secrétaire général de l'ONU évoque un choc pour la société civile et relève les demandes d'enquête et de justice formulées par des magistrats, des avocats et des organisations de défense des droits humains. Le contexte nourrit de nombreuses interrogations, mais il faut distinguer les hypothèses des faits établis par une procédure judiciaire. Cet assassinat marque l'histoire de la profession juridique et du débat public.",
    "sources": [
      [
        "UN Secretary-General, BINUH September 2020 report",
        "https://www.haitidocs.org/doc/binuh-sg-reports-2020-2"
      ],
      [
        "Scholars at Risk, case record of 28 August 2020",
        "https://www.scholarsatrisk.org/report/2020-08-28-university-of-haiti/"
      ]
    ],
    "people": [
      "montferrier-dorval"
    ]
  },
  {
    "precision": "month",
    "slug": "haiti-electoral-council-reconstituted-2020",
    "date": "2020-09",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Haiti",
    "title": "A new electoral council is appointed amid disputes over constitutional reform",
    "ft": "Un nouveau Conseil électoral provisoire est nommé dans la contestation",
    "summary": "After the previous council's resignation, new appointments and referendum plans provoke questions about electoral legitimacy.",
    "fs": "Après la démission de l'ancien conseil, de nouvelles nominations et le projet de référendum suscitent des objections.",
    "body": "Following the collective resignation of the previous Provisional Electoral Council in July, President Jovenel Moïse appointed new members in September 2020. Some traditionally represented organizations declined to participate or nominate representatives because of disagreements with the executive. The authorities also assigned the council a role in preparations for a proposed constitutional referendum, although important legal and political objections remained. Those disputes concerned both the composition of the body and the conditions for credible elections during an institutional crisis. The appointment did not mean that elections or the referendum had already taken place. Later decisions about the electoral timetable should be documented under the years in which they occurred.",
    "fb": "Après la démission collective des membres du Conseil électoral provisoire en juillet, le président Jovenel Moïse nomme de nouveaux conseillers en septembre 2020. Plusieurs secteurs traditionnellement représentés refusent de proposer des candidats, en raison de désaccords avec l'exécutif. Le nouveau Conseil reçoit aussi des responsabilités liées à la préparation d'un référendum constitutionnel, malgré de fortes objections politiques et juridiques. Les débats portent sur la composition de l'institution et sur les conditions d'élections crédibles. Cette nomination ne signifie pas que des scrutins aient déjà eu lieu : il faut distinguer les décisions préparatoires des événements électoraux ultérieurs.",
    "sources": [
      [
        "Inter-American Commission on Human Rights, report on Haiti",
        "https://www.oas.org/en/iachr/reports/pdfs/2023/Informe_Haiti_EN.pdf"
      ],
      [
        "UN Secretary-General, report S/2021/133",
        "https://www.securitycouncilreport.org/atf/cf/%7B65BFCF9B-6D27-4E9C-8CD3-CF6E4FF96FF9%7D/s_2021_133.pdf"
      ]
    ],
    "people": [
      "jovenel-moise"
    ]
  },
  {
    "precision": "month",
    "slug": "gourde-inflation-and-currency-volatility-2020",
    "date": "2020-09",
    "dimension": "inside",
    "categories": [
      "economy",
      "society"
    ],
    "location": "Haiti",
    "title": "Currency swings and high inflation squeeze household budgets",
    "ft": "Les fluctuations de la gourde et l'inflation fragilisent les ménages",
    "summary": "Rapid currency depreciation followed by a sharp September appreciation occurred amid rising living costs.",
    "fs": "La dépréciation suivie d'une forte appréciation en septembre s'accompagne d'une hausse du coût de la vie.",
    "body": "In 2020, Haiti's economy faced a combination of political disruption, pandemic restrictions, weakened public revenue and pressure on the exchange rate. The gourde depreciated earlier in the fiscal year, then appreciated sharply after intervention by the Banque de la République d'Haïti and fiscal adjustments in September. Inflation nevertheless remained high and food prices strained purchasing power. A subsequent World Bank assessment recorded inflation above 22 percent at the end of 2020, while Haiti's public audit court documented particularly high year-on-year inflation during the year. These figures must be labeled by measure and reporting period. The effects were felt by households, merchants and workers whose income did not keep pace with prices.",
    "fb": "En 2020, l'économie haïtienne subit la paralysie politique, les restrictions sanitaires, la faiblesse des recettes publiques et les tensions sur le taux de change. La gourde perd de sa valeur au début de l'exercice, puis s'apprécie fortement après des interventions de la Banque de la République d'Haïti et des mesures budgétaires en septembre. L'inflation reste élevée et pèse particulièrement sur les achats alimentaires. Les évaluations de la Banque mondiale et de la Cour supérieure des comptes signalent une forte hausse des prix, selon des mesures et des périodes qu'il faut distinguer. Les ménages, les commerçants et les travailleurs en supportent les conséquences.",
    "sources": [
      [
        "World Bank, Haiti fiscal and currency analysis",
        "https://documents1.worldbank.org/curated/en/099149206272240174/pdf/IDU-2fac0c37-b37d-4903-afb4-a976a79b02a1.pdf"
      ],
      [
        "HaitiDocs, Court of Auditors FY2019–2020 financial report",
        "https://www.haitidocs.org/doc/cscca-rsfpedp-2019-2020"
      ]
    ]
  },
  {
    "precision": "day",
    "slug": "binuh-un-mandate-renewed-2020",
    "date": "2020-10-15",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "United Nations, New York",
    "countries": [
      "United Nations",
      "Haiti"
    ],
    "title": "UN Security Council renews the BINUH political mission mandate",
    "ft": "Le Conseil de sécurité renouvelle le mandat de la mission BINUH",
    "summary": "Resolution 2547 extends the UN Integrated Office's mandate amid concerns about insecurity and the political impasse.",
    "fs": "La résolution 2547 prolonge le mandat du Bureau intégré des Nations unies en Haïti dans un contexte de crise.",
    "body": "On 15 October 2020, the UN Security Council adopted resolution 2547 renewing the mandate of the United Nations Integrated Office in Haiti, known as BINUH, until October 2021. BINUH is a political mission distinct from the UN peacekeeping operations that preceded it. Its remit included supporting dialogue, institutional capacity and human rights. At the October briefing, the UN's representative warned about insecurity, gang violence, perceived impunity and the pandemic's effect on economic recovery. The Council's decision illustrates continued international involvement in Haiti's governance crisis, but the renewal of a mandate does not mean the mission held executive or police authority over the Haitian state.",
    "fb": "Le 15 octobre 2020, le Conseil de sécurité de l'ONU adopte la résolution 2547 et prolonge jusqu'en octobre 2021 le mandat du Bureau intégré des Nations unies en Haïti (BINUH). Il s'agit d'une mission politique, distincte des anciennes opérations de maintien de la paix. Son travail concerne notamment le dialogue, les institutions et les droits humains. Lors du débat d'octobre, l'ONU souligne les inquiétudes liées à la violence armée, à l'impunité et aux effets économiques de la pandémie. La prolongation du mandat témoigne de la présence internationale, sans transférer à la mission les pouvoirs exécutifs ou policiers de l'État haïtien.",
    "sources": [
      [
        "Security Council Report, chronology of Haiti in 2020",
        "https://www.securitycouncilreport.org/chronology/haiti.php?print=true"
      ]
    ]
  },
  {
    "precision": "day",
    "slug": "haiti-ani-security-decrees-november-2020",
    "date": "2020-11-26",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Port-au-Prince",
    "title": "Executive decrees create a national intelligence agency and expand security offenses",
    "ft": "Des décrets créent une agence de renseignement et élargissent les infractions de sécurité",
    "summary": "The new ANI agency and a public-security decree provoke objections about oversight, civil liberties and executive power.",
    "fs": "La création de l'ANI et un décret de sécurité suscitent des inquiétudes sur le contrôle démocratique et les libertés.",
    "body": "A special edition of Haiti's official gazette Le Moniteur dated 26 November 2020 published decrees creating the National Intelligence Agency (ANI) and modifying the legal treatment of public-security offenses. The decrees were signed the previous day during a period when no functioning parliament could consider new legislation. Critics, including the diplomatic Core Group, raised concerns about expansive definitions of terrorist acts, harsh penalties and legal protections for intelligence agents. These are concerns attributed to identifiable groups rather than judicial findings that every provision was unlawful. The episode illustrates the constitutional dispute about governing by decree and the practical implications for citizens' rights, surveillance and public accountability.",
    "fb": "Le Moniteur du 26 novembre 2020 publie des décrets créant l'Agence nationale d'intelligence (ANI) et modifiant les dispositions relatives à la sécurité publique. Les textes ont été signés la veille, alors qu'aucun Parlement fonctionnel ne peut examiner la législation. Des critiques, notamment le Core Group diplomatique, s'inquiètent de la définition élargie des actes terroristes, de la sévérité des sanctions et des protections accordées aux agents du renseignement. Ces objections doivent être attribuées à leurs auteurs, sans devenir automatiquement des conclusions judiciaires. L'épisode illustre les tensions entre gouvernement par décret, libertés publiques et contrôle démocratique.",
    "sources": [
      [
        "Le Moniteur November 2020 decree archive, HaitiDocs",
        "https://www.haitidocs.org/doc/prh-decrets-2020-11-ani-securite-publique"
      ],
      [
        "BINUH, Core Group statement of 12 December 2020",
        "https://binuh.unmissions.org/fr/node/74516"
      ]
    ],
    "people": [
      "jovenel-moise"
    ]
  },
  {
    "precision": "year",
    "slug": "haiti-2020-economic-contraction-year",
    "date": "2020",
    "dimension": "inside",
    "categories": [
      "economy",
      "society"
    ],
    "location": "Haiti",
    "title": "Haiti's economy contracts for a second consecutive year",
    "ft": "L'économie haïtienne se contracte pour une deuxième année consécutive",
    "summary": "Economic data for 2020 reflect the combined effects of political paralysis, COVID-19 and structural vulnerabilities.",
    "fs": "Les statistiques de 2020 témoignent des effets combinés de la crise politique, de la pandémie et des fragilités structurelles.",
    "body": "Haiti's economic output fell again in 2020 after a contraction in 2019. World Bank data put real GDP growth for 2020 at approximately minus 3.3 percent, reflecting a year of pandemic disruption and the lingering effects of the preceding political and social crisis. Imports and exports were interrupted, and many households faced rising food prices and uncertainty about employment. GDP is an economy-wide measure, not a direct account of individual livelihoods; understanding this period also requires evidence from agriculture, small enterprises, the garment sector, and informal markets. Researchers should distinguish calendar-year and Haitian fiscal-year estimates when comparing different institutions' figures. This event records the annual outcome rather than assigning the entire contraction to any single decision.",
    "fb": "L'activité économique d'Haïti recule de nouveau en 2020, après une contraction en 2019. Les données de la Banque mondiale situent la variation du PIB réel autour de moins 3,3 % pour l'année 2020. Cette évolution reflète les perturbations de la pandémie et les conséquences de la crise politique et sociale antérieure. Les importations, les exportations et l'emploi sont touchés, tandis que les prix alimentaires pèsent sur les ménages. Le PIB ne résume pas le quotidien des familles : il faut aussi étudier l'agriculture, les petites entreprises, l'industrie textile et les marchés informels. Les chiffres doivent être comparés en distinguant année civile et exercice budgétaire.",
    "sources": [
      [
        "World Bank, Haiti World Development Indicators",
        "https://databank.worldbank.org/RD-haiti-statistics/id/8418467d"
      ],
      [
        "World Bank, Haiti macroeconomic and fiscal analysis",
        "https://documents1.worldbank.org/curated/en/099149206272240174/pdf/IDU-2fac0c37-b37d-4903-afb4-a976a79b02a1.pdf"
      ]
    ]
  },
  {
    "precision": "year",
    "slug": "haiti-diaspora-remittances-2020",
    "date": "2020",
    "dimension": "abroad",
    "categories": [
      "abroad",
      "economy",
      "society"
    ],
    "location": "Haitian diaspora and Haiti",
    "countries": [
      "Haiti",
      "United States",
      "Canada",
      "Dominican Republic"
    ],
    "title": "Haitian diaspora remittances remain central during the pandemic",
    "ft": "Les transferts de la diaspora restent essentiels pendant la pandémie",
    "summary": "Remittances from Haitians living abroad continue supporting families and supplying foreign currency during economic disruption.",
    "fs": "Les transferts des Haïtiens à l'étranger continuent de soutenir les familles et d'apporter des devises pendant la crise.",
    "body": "During 2020, money sent by Haitians abroad remained a major source of foreign currency and household support inside Haiti. A U.S. State Department investment report estimated that the country received about US$3.2 billion in remittances during the year. These transfers helped connect families across borders even as the pandemic disrupted jobs, travel and commerce worldwide. Remittances should not be treated as equivalent to foreign aid: they represent private income and social relationships maintained by migrants and their relatives. The history also includes transfer fees, exchange-rate rules and the unequal capacity of diaspora households to provide support. This is a documented contribution of Haitian communities worldwide that belongs alongside political and economic events in the national archive.",
    "fb": "En 2020, les transferts d'argent envoyés par les Haïtiens vivant à l'étranger restent une source majeure de devises et de soutien pour les ménages du pays. Un rapport du département d'État américain estime ces envois à environ 3,2 milliards de dollars. Les transferts entretiennent les liens familiaux malgré les perturbations mondiales du travail, des voyages et du commerce. Ils ne doivent pas être confondus avec l'aide étrangère : il s'agit de ressources privées issues du travail et des relations entre familles. L'histoire de ces envois comprend aussi les frais de transfert, les règles de change et les inégalités entre les ménages de la diaspora.",
    "sources": [
      [
        "U.S. Department of State, 2021 Investment Climate Statements: Haiti, remittances",
        "https://2021-2025.state.gov/reports/2021-investment-climate-statements/haiti/"
      ]
    ]
  },
  {
    "precision": "year",
    "slug": "edwidge-danticat-bocas-fiction-prize-2020",
    "date": "2020",
    "dimension": "abroad",
    "categories": [
      "arts",
      "abroad"
    ],
    "location": "Caribbean and United States",
    "countries": [
      "United States",
      "Haiti",
      "Trinidad and Tobago"
    ],
    "title": "Edwidge Danticat wins the 2020 OCM Bocas Fiction Prize",
    "ft": "Edwidge Danticat remporte le prix Bocas de fiction en 2020",
    "summary": "The Haitian-born author's collection Everything Inside receives major Caribbean literary recognition.",
    "fs": "Le recueil Everything Inside de l'écrivaine née en Haïti est distingué par un important prix littéraire caribéen.",
    "body": "In 2020, Haitian-born writer Edwidge Danticat won the fiction category of the OCM Bocas Prize for Caribbean Literature for Everything Inside, her collection of short stories published in 2019. The award is documented by the Bocas Lit Fest organizers, who distinguish the fiction category from that year's overall prize. Danticat's writing explores family bonds, loss, migration and communities connected to Haiti and its diaspora. Her recognition matters to the history of Haitian culture beyond national borders: literature is one of the ways Haitian experiences enter wider conversations about identity, memory and belonging. The award should be linked to the book's 2019 publication rather than incorrectly recorded as a new 2020 release.",
    "fb": "En 2020, l'écrivaine d'origine haïtienne Edwidge Danticat reçoit le prix de fiction OCM Bocas pour son recueil de nouvelles Everything Inside, paru en 2019. L'organisation du festival confirme qu'il s'agit du prix de la catégorie fiction, distinct du grand prix attribué cette année-là. Ses textes abordent la famille, la migration, le deuil et les communautés liées à Haïti. Cette distinction témoigne du rayonnement littéraire haïtien dans la Caraïbe et au-delà. Il faut distinguer la date de publication du livre de celle de la récompense.",
    "sources": [
      [
        "Bocas Lit Fest, winners of the 2020 OCM Bocas Prize",
        "https://www.bocaslitfest.com/awards/ocm/winners/"
      ],
      [
        "Edwidge Danticat, official biography",
        "https://edwidgedanticat.com/about"
      ]
    ],
    "people": [
      "edwidge-danticat"
    ]
  },
  {
    "precision": "year",
    "slug": "yanick-lahens-prix-carbet-2020",
    "date": "2020",
    "dimension": "abroad",
    "categories": [
      "arts",
      "abroad",
      "culture"
    ],
    "location": "Francophone Caribbean",
    "countries": [
      "Haiti",
      "France"
    ],
    "title": "Yanick Lahens receives the 2020 Prix Carbet for her body of work",
    "ft": "Yanick Lahens reçoit le Prix Carbet 2020 pour l'ensemble de son œuvre",
    "summary": "A major Caribbean literary award recognizes Haitian novelist Yanick Lahens alongside two fellow Caribbean writers.",
    "fs": "Un prix littéraire caribéen distingue la romancière haïtienne Yanick Lahens aux côtés de deux autres auteurs.",
    "body": "The 2020 Prix Carbet de la Caraïbe et du Tout-Monde honored Haitian author Yanick Lahens for her body of work, alongside Élie Stephenson of French Guiana and Alfred Alexandre of Martinique. The prize, created to celebrate Caribbean writing across different languages, territories and perspectives, provides an important record of Haitian literary influence. Lahens is known for novels and essays engaging with Haitian history, family, urban life, and social inequality. This distinction should be presented in its regional context: she was one of three laureates, rather than the sole winner. The recognition also connects 2020 cultural history to the longer development of Caribbean and Haitian publishing.",
    "fb": "En 2020, le Prix Carbet de la Caraïbe et du Tout-Monde distingue la romancière haïtienne Yanick Lahens pour l'ensemble de son œuvre, avec Élie Stephenson, écrivain guyanais, et Alfred Alexandre, auteur martiniquais. Créé pour valoriser les littératures caribéennes et la diversité de leurs voix, ce prix témoigne du rayonnement des lettres haïtiennes. Les romans et essais de Lahens abordent notamment l'histoire, la famille, les inégalités et la vie sociale. L'attribution doit être présentée correctement : elle partage cette édition avec deux autres écrivains. Cette reconnaissance relie l'histoire culturelle de 2020 aux échanges littéraires de la région.",
    "sources": [
      [
        "University of the Antilles Libraries, 2020 Prix Carbet",
        "https://bu.univ-antilles.fr/alertes/prix-carbet-caraibe-tout-monde-2020.html"
      ]
    ],
    "people": [
      "yanick-lahens"
    ]
  }
];

export const historical2020: HistEvent[] = entries.map((entry) => ({
  slug: entry.slug,
  title: entry.title,
  date: entry.date,
  precision: entry.precision,
  dimension: entry.dimension,
  categories: entry.categories,
  location: entry.location,
  countries: entry.countries,
  people: entry.people,
  summary: entry.summary,
  body: entry.body,
  fr: { title: entry.ft, summary: entry.fs, body: entry.fb },
  sources: entry.sources.map(([title, url]) => ({ title, url })),
  status: "documented",
  editorial: {
    verification: "corroborated",
    dateBasis: entry.precision === "day" ? "documented calendar date" : entry.precision === "month" ? "month or reporting period; do not infer a precise day" : "year of the documented development",
    reviewedOn: "2026-11-01",
    note: "Curated summary of cited sources. Interpretations and statistical reference periods are explicitly qualified.",
  },
}));
