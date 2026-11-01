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
    "slug": "research-2023-02-haiti-s-women-qualify-for-their-first",
    "date": "2023-02-22",
    "dimension": "abroad",
    "categories": [
      "sports",
      "abroad"
    ],
    "location": "Auckland, New Zealand",
    "title": "Haiti's women qualify for their first FIFA Women's World Cup",
    "ft": "Les Haïtiennes se qualifient pour leur première Coupe du monde féminine",
    "summary": "Melchie Dumornay scores twice in a 2–1 playoff victory over Chile.",
    "fs": "Melchie Dumornay marque les deux buts de la victoire 2-1 contre le Chili.",
    "body": "On 22 February 2023, Haiti defeated Chile 2–1 in the intercontinental playoff in Auckland, New Zealand, qualifying for the women's FIFA World Cup for the first time. Nineteen-year-old Melchie Dumornay scored both goals, while goalkeeper Kerly Théus and teammates helped secure the historic victory. The achievement reflected years of work by players and coaches in difficult conditions, as well as the contributions of women developing their careers in international leagues. Qualification should be distinguished from Haiti's subsequent group-stage matches in July and August. The result created an important moment of pride and international recognition and offers a starting point for documenting the history of women's football in Haiti.",
    "fb": "Le 22 février 2023, Haïti bat le Chili 2-1 lors du barrage intercontinental à Auckland, en Nouvelle-Zélande, et se qualifie pour la première fois à la Coupe du monde féminine. Melchie Dumornay, âgée de dix-neuf ans, marque les deux buts. Kerly Théus et ses coéquipières contribuent aussi à ce succès historique. Cette performance résulte du travail des joueuses et des entraîneurs malgré de nombreuses difficultés, ainsi que de carrières menées dans des championnats étrangers. La qualification est distincte des rencontres disputées ensuite pendant la compétition.",
    "sources": [
      [
        "Concacaf/FIFA",
        "https://es.concacaf.com/news/dumornay-brace-qualifies-haiti-for-first-women-s-world-cup"
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
    "slug": "research-2023-08-un-security-council-authorizes-a-keny",
    "date": "2023-10-02",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "United Nations, New York",
    "title": "UN Security Council authorizes a Kenya-led security support mission",
    "ft": "Le Conseil de sécurité autorise une mission de soutien sécuritaire dirigée par le Kenya",
    "summary": "Resolution 2699 authorizes international police support; it is not a UN peacekeeping mission.",
    "fs": "La résolution 2699 autorise un soutien policier international distinct d'une opération de maintien de la paix.",
    "body": "On 2 October 2023, the United Nations Security Council adopted resolution 2699 authorizing member states to form a multinational security support mission for Haiti, with Kenya offering to lead. The mission was intended to support the Haitian National Police, secure critical infrastructure and help create conditions for elections. It was authorized by the Security Council but was not a United Nations peacekeeping operation. The authorization did not mean that the officers immediately arrived; the first Kenyan contingent deployed in June 2024. The decision drew differing responses from Haitians because of concerns about insecurity, national sovereignty, civilian protection and the legacy of previous international missions.",
    "fb": "Le 2 octobre 2023, le Conseil de sécurité des Nations unies adopte la résolution 2699, qui autorise des États à former une mission multinationale de soutien à la sécurité en Haïti, sous direction proposée du Kenya. Elle doit soutenir la Police nationale, protéger des infrastructures et contribuer à préparer des élections. Il ne s'agit pas d'une opération de maintien de la paix de l'ONU. L'autorisation ne correspond pas à un déploiement immédiat : les premiers policiers kényans arrivent en juin 2024. La décision suscite des positions divergentes au sein de la société haïtienne.",
    "sources": [
      [
        "Security Council Report",
        "https://www.securitycouncilreport.org/un-documents/haiti"
      ]
    ]
  }
];
export const research2023:HistEvent[]=entries.map(e=>({slug:e.slug,date:e.date,precision:(e.date.length===10?"day":e.date.length===7?"month":"year") as DatePrecision,dimension:e.dimension,categories:e.categories,location:e.location,title:e.title,summary:e.summary,body:e.body,fr:{title:e.ft,summary:e.fs,body:e.fb},sources:e.sources.map(([title,url])=>({title,url})),status:"documented",editorial:{verification:"corroborated",dateBasis:"date or month supported by linked sources",reviewedOn:"2026-11-01"}}));
