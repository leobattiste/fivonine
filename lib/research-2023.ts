import type { HistEvent, DatePrecision, Dimension } from "./types";
/** Sourced bilingual additions to Haiti's 2023 chronology. */
type Entry={slug:string;date:string;dimension:Dimension;categories:string[];location:string;title:string;ft:string;summary:string;fs:string;body:string;fb:string;sources:[string,string][]};
const entries:Entry[]=[
  {
    "slug": "research-2023-01-the-united-states-opens-a-new-humanit",
    "date": "2023-01-05",
    "dimension": "abroad",
    "categories": [
      "abroad",
      "world",
      "society"
    ],
    "location": "United States",
    "title": "The United States opens a new humanitarian parole process for Haitians",
    "ft": "Les États-Unis ouvrent une nouvelle procédure de parole humanitaire aux Haïtiens",
    "summary": "Eligible Haitians may seek advance authorization for temporary admission with a supporter.",
    "fs": "Des Haïtiens admissibles peuvent demander une autorisation préalable pour une entrée temporaire avec un garant.",
    "body": "On 5 January 2023, the US Department of Homeland Security announced an expanded parole process for nationals of Haiti, Cuba, Nicaragua and Venezuela. Eligible applicants could seek case-by-case authorization to travel with a supporter and receive a temporary period of parole, rather than automatically obtaining permanent residence or asylum. This policy affected households separated across borders and influenced migration pathways throughout the Americas. Applicants had to meet specific eligibility conditions, including travel authorization and background checks. The program became subject to later legal and policy changes; those developments belong under the years in which they occurred. Its creation shows how decisions abroad shaped the lives of Haitians far beyond Haiti.",
    "fb": "Le 5 janvier 2023, le ministère américain de la Sécurité intérieure annonce une procédure élargie de parole humanitaire destinée aux ressortissants d'Haïti, de Cuba, du Nicaragua et du Venezuela. Des personnes admissibles peuvent demander une autorisation de voyage, avec un garant, en vue d'une admission temporaire examinée individuellement. Cette mesure ne confère pas automatiquement l'asile ni la résidence permanente. Elle influence les parcours migratoires et les familles séparées dans les Amériques. Le programme connaîtra ensuite des modifications juridiques et politiques qui doivent être documentées à leurs dates respectives.",
    "sources": [
      [
        "Social Security Administration",
        "https://secure.ssa.gov/apps10/referencearchive.nsf/links/07312024022308PMREV"
      ]
    ]
  },
  {
    "slug": "research-2023-03-the-bwa-kale-vigilante-movement-emerg",
    "date": "2023-04-24",
    "dimension": "inside",
    "categories": [
      "society",
      "politics"
    ],
    "location": "Port-au-Prince",
    "title": "The Bwa Kale vigilante movement emerges during a security breakdown",
    "ft": "Le mouvement d'autodéfense Bwa Kale émerge pendant la crise sécuritaire",
    "summary": "Civilians attack suspected gang members, raising urgent concerns about lynchings and due process.",
    "fs": "Des habitants attaquent des membres présumés de gangs, suscitant des inquiétudes sur les lynchages et la justice.",
    "body": "On 24 April 2023, killings of suspected gang members by civilians in Port-au-Prince drew attention to a rapidly spreading vigilante movement known as Bwa Kale. The movement emerged amid severe frustration with kidnappings, attacks and the inability of security institutions to protect neighborhoods. The UN later documented dozens of suspected gang members and alleged affiliates killed through lynching, stoning and burning, and reported retaliatory violence from armed groups. Civic self-defense, vigilantism and extrajudicial killing are distinct and should not be conflated. The historical account needs to acknowledge why communities sought protection while documenting the serious human-rights risks, including the possibility of mistaken identification and violence against innocent people.",
    "fb": "Le 24 avril 2023, des habitants de Port-au-Prince tuent des membres présumés de gangs, donnant une visibilité nationale au mouvement Bwa Kale. Celui-ci apparaît dans un contexte de kidnappings, d'attaques et d'incapacité des institutions à protéger certains quartiers. L'ONU documente ensuite des dizaines de personnes lynchées, lapidées ou brûlées, ainsi que des représailles de groupes armés. L'autoprotection, la justice populaire et les exécutions extrajudiciaires doivent être distinguées. L'histoire doit expliquer pourquoi des communautés réclament la sécurité tout en examinant les graves risques pour les droits humains.",
    "sources": [
      [
        "United Nations",
        "https://digitallibrary.un.org/record/4015003/files/S_2023_492-EN.pdf"
      ]
    ]
  },
  {
    "slug": "research-2023-04-unesco-approves-support-for-metal-cut",
    "date": "2023-06-05",
    "dimension": "foreign",
    "categories": [
      "culture",
      "arts",
      "world"
    ],
    "location": "Noailles, Croix-des-Bouquets",
    "title": "UNESCO approves support for metal-cutting artisans displaced from Noailles",
    "ft": "L'UNESCO approuve un soutien aux artisans du métal découpé déplacés de Noailles",
    "summary": "A heritage program aims to preserve metalwork traditions threatened by armed violence.",
    "fs": "Un programme de sauvegarde vise à préserver les traditions du métal découpé menacées par la violence.",
    "body": "On 5 June 2023, UNESCO's intangible heritage funding mechanism approved an emergency assistance project supporting metal-cutting artists and artisans from Noailles, Croix-des-Bouquets. The community has used recycled metal drums in a distinctive artistic tradition passed across generations. Armed insecurity had displaced artists from their homes and workshops and interrupted sales, training and the transmission of skills. UNESCO approved US$280,092 for a project implemented from October 2023 to October 2026 with Haitian partners. Approval of funding should be distinguished from verified later outcomes. The project is evidence that preserving cultural production and protecting livelihoods were important priorities during the security emergency.",
    "fb": "Le 5 juin 2023, un mécanisme de financement du patrimoine immatériel de l'UNESCO approuve une aide d'urgence aux artistes et artisans du métal découpé de Noailles, à Croix-des-Bouquets. Cette tradition utilise notamment des fûts métalliques recyclés et se transmet depuis plusieurs générations. L'insécurité a déplacé des créateurs et perturbé les ateliers, les ventes et la formation. Un montant de 280 092 dollars est approuvé pour un projet prévu d'octobre 2023 à octobre 2026. L'attribution des fonds ne prouve pas à elle seule les résultats obtenus par la suite.",
    "sources": [
      [
        "UNESCO",
        "https://ich.unesco.org/en/project?projectID=00464"
      ]
    ]
  },
  {
    "slug": "research-2023-05-monica-sorelle-s-mountains-premieres",
    "date": "2023-06-09",
    "dimension": "abroad",
    "categories": [
      "arts",
      "abroad",
      "culture"
    ],
    "location": "Miami and New York, United States",
    "title": "Monica Sorelle's Mountains premieres at the Tribeca Festival",
    "ft": "Mountains de Monica Sorelle est présenté en première au festival Tribeca",
    "summary": "The film portrays a Haitian immigrant family confronting gentrification in Miami's Little Haiti.",
    "fs": "Le film raconte une famille immigrée haïtienne face à la gentrification de Little Haiti à Miami.",
    "body": "In June 2023, Mountains, the first feature film by Haitian-American director Monica Sorelle, premiered at New York's Tribeca Festival. The film follows Xavier, a Haitian construction worker, and his family in Miami's Little Haiti neighborhood as rising property values and gentrification threaten a community they helped build. Haitian Creole, English and Spanish are spoken in the film, and the cast includes Atibon Nazaire and Sheila Anozier. Its festival premiere came before its later commercial release, dates that should remain distinct. Mountains belongs both to the history of Haitian cinema and to the history of immigrant communities, housing pressure, cultural identity and intergenerational change in the United States.",
    "fb": "En juin 2023, Mountains, premier long métrage de la réalisatrice haïtiano-américaine Monica Sorelle, est présenté au festival Tribeca à New York. Le récit suit Xavier, ouvrier haïtien du bâtiment, et sa famille dans Little Haiti à Miami, où la hausse du prix de l'immobilier menace les communautés établies. Le créole haïtien, l'anglais et l'espagnol y sont parlés ; la distribution comprend Atibon Nazaire et Sheila Anozier. La présentation en festival précède la sortie commerciale ultérieure. Le film éclaire à la fois le cinéma haïtien et la vie des diasporas face à la gentrification.",
    "sources": [
      [
        "Tribeca Festival",
        "https://tribecafilm.com/festival/archive/mountains-2023"
      ]
    ]
  },
  {
    "slug": "research-2023-06-haiti-makes-its-first-appearance-at-t",
    "date": "2023-07-22",
    "dimension": "abroad",
    "categories": [
      "sports",
      "abroad"
    ],
    "location": "Brisbane, Australia",
    "title": "Haiti makes its first appearance at the FIFA Women's World Cup",
    "ft": "Haïti dispute son premier match en Coupe du monde féminine",
    "summary": "The national team opens its first World Cup campaign against England.",
    "fs": "La sélection nationale débute sa première Coupe du monde contre l'Angleterre.",
    "body": "On 22 July 2023, Haiti's women's national team played its first FIFA Women's World Cup match, against England, after qualifying through the intercontinental playoff. Although the team lost 1–0, the performance drew attention to Haitian players competing at the highest international level. Haiti also faced China and Denmark in the group stage. Players such as Melchie Dumornay, Nérilia Mondésir and goalkeeper Kerly Théus became part of a historic first appearance. The campaign was especially important given the limited resources and security problems affecting football development at home. Results, dates and individual player claims should be checked against FIFA records and distinguished from the qualification milestone in February.",
    "fb": "Le 22 juillet 2023, l'équipe féminine d'Haïti dispute contre l'Angleterre son premier match de Coupe du monde, après sa qualification aux barrages. La rencontre se conclut par une défaite 1-0 mais attire l'attention sur la qualité des joueuses haïtiennes. L'équipe affronte ensuite la Chine et le Danemark. Melchie Dumornay, Nérilia Mondésir, Kerly Théus et leurs coéquipières participent à une première historique malgré les difficultés du football national. Les résultats sportifs doivent être distingués de la qualification obtenue en février.",
    "sources": [
      [
        "Concacaf/FIFA",
        "https://es.concacaf.com/news/dumornay-brace-qualifies-haiti-for-first-women-s-world-cup"
      ]
    ]
  },
  {
    "slug": "research-2023-07-dominican-republic-closes-its-border",
    "date": "2023-09-15",
    "dimension": "foreign",
    "categories": [
      "world",
      "economy",
      "environment"
    ],
    "location": "Haiti–Dominican Republic border",
    "title": "Dominican Republic closes its border with Haiti amid canal dispute",
    "ft": "La République dominicaine ferme sa frontière avec Haïti sur fond de conflit autour d'un canal",
    "summary": "A dispute over a canal using the Massacre/Dajabón River interrupts trade and cross-border movement.",
    "fs": "Un conflit autour d'un canal sur la rivière Massacre/Dajabón interrompt échanges et déplacements.",
    "body": "On 15 September 2023, the Dominican Republic closed its land, air and sea borders with Haiti during a dispute over construction of an irrigation canal on the Haitian side of the Massacre/Dajabón River. The Dominican government argued that the project threatened shared water resources and contravened a 1929 treaty; Haitian authorities and farmers defended a right to use water for agriculture. Border closures harmed merchants, agricultural workers, families and communities dependent on daily cross-border trade. The dispute raised long-standing questions of water governance, sovereignty, migration and unequal economic relations. The historical record must present the positions of both governments and distinguish allegations about water rights from independent hydrological findings.",
    "fb": "Le 15 septembre 2023, la République dominicaine ferme ses frontières terrestres, maritimes et aériennes avec Haïti pendant un conflit portant sur la construction d'un canal d'irrigation du côté haïtien de la rivière Massacre/Dajabón. Le gouvernement dominicain invoque le traité de 1929 et les risques pour les ressources partagées ; des acteurs haïtiens défendent l'usage de l'eau pour l'agriculture. La fermeture perturbe les commerçants, les travailleurs agricoles et les familles des régions frontalières. Ce désaccord soulève des questions de souveraineté, de gestion des eaux, de migrations et de relations économiques.",
    "sources": [
      [
        "Associated Press",
        "https://apnews.com/article/a8e763730d674fc840b4ea33d50ebe23"
      ]
    ]
  },
  {
    "slug": "haiti-2023-june-floods-earthquake-grandanse",
    "date": "2023-06-06",
    "dimension": "inside",
    "categories": [
      "environment",
      "society",
      "education"
    ],
    "location": "Grand'Anse, Ouest and Sud-Est departments, Haiti",
    "title": "Deadly floods and a June earthquake compound Haiti's humanitarian emergency",
    "ft": "Des inondations meurtrières et un séisme en juin aggravent la crise humanitaire",
    "summary": "Heavy rainfall and an earthquake near Jérémie damage housing and healthcare facilities in multiple departments.",
    "fs": "De fortes pluies et un séisme près de Jérémie endommagent des maisons et des structures de santé.",
    "body": "In early June 2023, intense rain caused flooding and landslides across Haiti, damaging thousands of homes and several healthcare facilities. The Pan American Health Organization's 6 June monitoring update reported 51 deaths associated with flooding, alongside injuries and missing people, in the then-current assessment. On 6 June, a separate earthquake struck the Grand'Anse region near Jérémie; contemporary initial reports recorded four deaths and dozens injured. These were distinct hazards affecting overlapping communities. The emergency occurred amid insecurity and poor road access, complicating evacuation, medical treatment and distribution of relief. The reported casualty totals were preliminary and tied to specific reporting dates, not definitive totals for the month. A geographical account should identify the affected departments, local civil protection responses and how consecutive emergencies added to household vulnerability.",
    "fb": "Au début de juin 2023, de fortes pluies provoquent des inondations et des glissements de terrain en Haïti, endommageant des milliers de maisons et plusieurs établissements de santé. Le bilan de l'Organisation panaméricaine de la santé daté du 6 juin fait état de 51 morts liés aux inondations, avec des blessés et des disparus. Le 6 juin, un séisme distinct frappe la région de la Grand'Anse près de Jérémie ; les premiers bilans signalent quatre morts et plusieurs dizaines de blessés. Ces catastrophes touchent des communautés déjà confrontées à l'insécurité et aux difficultés de transport. Les nombres sont provisoires et doivent être présentés à leur date de référence.",
    "sources": [
      [
        "Pan American Health Organization, natural hazards monitoring, 6 June 2023",
        "https://www.paho.org/en/natural-hazards-monitoring/natural-hazards-monitoring-6-june-2023"
      ]
    ]
  },
  {
    "slug": "haiti-2023-kenya-proposes-leading-mission-july",
    "date": "2023-07",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "Nairobi, Kenya",
    "title": "Kenya announces willingness to consider leading a Haiti security mission",
    "ft": "Le Kenya envisage de diriger une mission de sécurité en Haïti",
    "summary": "Kenya offers to consider sending police leadership and personnel, pending international authorization.",
    "fs": "Le Kenya envisage un rôle de direction et l'envoi de policiers, sous réserve d'une autorisation internationale.",
    "body": "In July 2023, Kenya announced its willingness to consider leading a multinational security support mission in Haiti, including a possible deployment of police officers. The announcement came after the Haitian government's October 2022 appeal for outside assistance and amid rising attacks by armed groups. The proposed force drew both diplomatic support and questions about the legal basis of deployment, past foreign interventions and potential rights violations. Kenya sent representatives to assess the situation before the UN Security Council adopted resolution 2699 on 2 October 2023. The July announcement was an expression of willingness, not the final authorization or the arrival of officers; those distinct events should be filed separately under October 2023 and June 2024.",
    "fb": "En juillet 2023, le Kenya annonce qu'il envisage de diriger une mission multinationale de soutien à la sécurité en Haïti, avec un possible déploiement de policiers. Cette annonce suit la demande d'aide du gouvernement haïtien en octobre 2022 et une hausse des attaques armées. La proposition reçoit un appui diplomatique, mais suscite aussi des questions sur sa base juridique, les interventions étrangères antérieures et le respect des droits humains. Le Kenya entreprend ensuite une évaluation avant l'adoption de la résolution 2699 le 2 octobre 2023. L'intention exprimée en juillet doit être distinguée de l'autorisation et du déploiement ultérieurs.",
    "sources": [
      [
        "U.S. Department of State, Kenya considering leading multinational force, August 2023",
        "https://2021-2025.state.gov/kenya-considering-leading-a-multinational-force-in-haiti/"
      ]
    ]
  }
];
export const research2023:HistEvent[]=entries.map(e=>({slug:e.slug,date:e.date,precision:(e.date.length===10?"day":e.date.length===7?"month":"year") as DatePrecision,dimension:e.dimension,categories:e.categories,location:e.location,title:e.title,summary:e.summary,body:e.body,fr:{title:e.ft,summary:e.fs,body:e.fb},sources:e.sources.map(([title,url])=>({title,url})),status:"documented",editorial:{verification:"corroborated",dateBasis:"date or month supported by linked sources",reviewedOn:"2026-11-01"}}));
