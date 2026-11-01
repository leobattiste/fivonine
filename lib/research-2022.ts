import type { HistEvent, DatePrecision, Dimension } from "./types";
/** 2022: bilingual source-linked historical research; add to existing canonical events. */
type Entry = {slug:string;date:string;dimension:Dimension;categories:string[];location:string;title:string;ft:string;summary:string;fs:string;body:string;fb:string;sources:[string,string][]};
const entries:Entry[] = [
  {
    "slug": "haiti-2022-research-01-armed-clashes-spread-across-northea",
    "date": "2022-04-24",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Croix-des-Bouquets and Tabarre",
    "title": "Armed clashes spread across northeastern Port-au-Prince",
    "ft": "Des affrontements armés s'étendent au nord-est de Port-au-Prince",
    "summary": "Territorial fighting forces residents to flee and disrupts work and schooling.",
    "fs": "Des affrontements territoriaux déplacent des familles et perturbent les activités quotidiennes.",
    "body": "In late April 2022, armed groups fought for control of territory in Croix-des-Bouquets, Tabarre and adjoining districts. Residents reported shootings, destroyed homes, closed schools and forced displacement. The crisis deepened an already persistent insecurity along important routes to the capital. Humanitarian assessments later traced how repeated clashes throughout the year restricted access to markets, healthcare, public services and assistance. The date marks the beginning of a renewed offensive, not the end of violence in affected neighborhoods. A responsible historical account should document the experiences of inhabitants, the responses by Haitian police and the difference between figures collected by humanitarian agencies and estimates circulated during fighting.",
    "fb": "À la fin d'avril 2022, des groupes armés se disputent des territoires à Croix-des-Bouquets, Tabarre et dans des quartiers voisins. Les tirs et les attaques provoquent des déplacements, la fermeture d'écoles et des dommages aux habitations. Ces affrontements aggravent l'insécurité sur des voies de circulation importantes. Les évaluations humanitaires documentent des difficultés d'accès aux marchés, aux soins et aux services publics. Il s'agit du début d'une nouvelle phase de violence et non de la fin des combats. Les récits des habitants et les bilans établis par des organismes identifiables doivent être distingués des estimations provisoires.",
    "sources": [
      [
        "Institutional research",
        "https://www.oas.org/en/iachr/docs/annual/2022/chapters/6-ia2022_cap_4a_en.pdf"
      ]
    ]
  },
  {
    "slug": "haiti-2022-research-02-july-fighting-in-cit-soleil-causes",
    "date": "2022-07-08",
    "dimension": "inside",
    "categories": [
      "society",
      "politics"
    ],
    "location": "Cité Soleil, Port-au-Prince",
    "title": "July fighting in Cité Soleil causes mass civilian harm",
    "ft": "Les combats de juillet à Cité Soleil frappent durement les civils",
    "summary": "UN agencies document hundreds killed, wounded or missing in fighting between armed groups.",
    "fs": "L'ONU documente des centaines de morts, de blessés ou de disparus lors d'affrontements.",
    "body": "Between 8 and 17 July, rival armed groups fought across Cité Soleil, trapping families and damaging homes. The United Nations reported more than 471 people killed, injured or unaccounted for during its observation period, and around 3,000 residents fled their homes. Reports described sexual violence, recruitment of children, food scarcity and the inability of ambulances or aid workers to reach some communities. This was a grave civilian-protection crisis with distinct effects on women and children, not simply a battle between armed organizations. The reported toll includes different categories of casualties and should never be presented as 471 confirmed deaths.",
    "fb": "Du 8 au 17 juillet, des groupes armés rivaux s'affrontent à Cité Soleil, piégeant des familles et endommageant des habitations. L'ONU indique que plus de 471 personnes ont été tuées, blessées ou portées disparues durant cette période, et qu'environ 3 000 habitants fuient. Les témoignages évoquent des violences sexuelles, le recrutement d'enfants et l'impossibilité d'acheminer suffisamment d'aide. Ce bilan rassemble plusieurs catégories de victimes et ne doit pas être présenté comme 471 décès confirmés. L'événement révèle la crise de protection des civils dans les quartiers populaires.",
    "sources": [
      [
        "United Nations",
        "https://haiti.un.org/en/191932-un-humanitarian-agencies-deliver-relief-aid-directly-people-affected-violence-cit%C3%A9-soleil"
      ]
    ]
  },
  {
    "slug": "haiti-2022-research-03-fuel-subsidy-reductions-trigger-nat",
    "date": "2022-09-11",
    "dimension": "inside",
    "categories": [
      "economy",
      "politics",
      "society"
    ],
    "location": "Haiti",
    "title": "Fuel-subsidy reductions trigger nationwide protests",
    "ft": "La réduction des subventions au carburant déclenche des manifestations",
    "summary": "Fuel-price changes intensify unrest amid inflation, declining purchasing power and insecurity.",
    "fs": "Les changements de prix du carburant aggravent les protestations dans un contexte d'inflation.",
    "body": "In September 2022, Prime Minister Ariel Henry's government announced steep changes to subsidized fuel prices. Protests and barricades spread across several cities beginning around 12 September as residents faced rising food and transportation costs. The economic pressures followed years of contraction and political paralysis. Armed groups also obstructed fuel supply, but public protests against the government and actions by armed organizations were not identical activities and must be differentiated. The consequences affected workers dependent on transportation, traders supplying markets, schools and health services. OCHA's contemporaneous assessment documented how the worsening fuel crisis rapidly disrupted water, electricity and emergency assistance.",
    "fb": "En septembre 2022, le gouvernement du Premier ministre Ariel Henry annonce d'importantes modifications des prix subventionnés du carburant. Des manifestations et barrages commencent autour du 12 septembre dans plusieurs villes, alors que les ménages subissent déjà la hausse de l'alimentation et du transport. Les revendications économiques et les actions des groupes armés ne doivent pas être confondues. La crise touche les travailleurs, les commerçants, les établissements scolaires et les services de santé. Une évaluation de l'OCHA décrit les perturbations de l'eau, de l'électricité et de l'aide humanitaire.",
    "sources": [
      [
        "Institutional research",
        "https://haiti.un.org/en/201531-fuel-crisis-and-social-unrest-impact-humanitarian-situation"
      ]
    ]
  },
  {
    "slug": "haiti-2022-research-04-un-agencies-call-for-a-humanitarian",
    "date": "2022-10-06",
    "dimension": "inside",
    "categories": [
      "society",
      "education",
      "world"
    ],
    "location": "Port-au-Prince",
    "title": "UN agencies call for a humanitarian fuel corridor",
    "ft": "Les agences de l'ONU demandent un couloir humanitaire pour le carburant",
    "summary": "The Varreux blockade threatens water systems and hospitals as cholera returns.",
    "fs": "Le blocus de Varreux menace l'approvisionnement en eau et les hôpitaux lors du retour du choléra.",
    "body": "On 6 October 2022, the United Nations and humanitarian partners publicly called for a corridor allowing fuel to leave the Varreux terminal. Armed groups had blocked the country's principal point of fuel entry, interrupting the operation of water pumps, medical facilities, telecommunications and transport. The first new cholera cases had just been reported, making access to treated water and treatment centers urgent. This appeal was a humanitarian demand, not evidence that a corridor was immediately established. It documents the reliance of critical services on fuel supplies and the extent to which armed control of infrastructure could endanger civilians far beyond the site of the blockade.",
    "fb": "Le 6 octobre 2022, les Nations unies et leurs partenaires humanitaires demandent un couloir permettant la sortie du carburant de Varreux. Des groupes armés bloquent le principal terminal pétrolier, perturbant l'eau potable, les hôpitaux, les télécommunications et les transports. Les premiers cas de choléra viennent d'être signalés. Cette demande humanitaire ne signifie pas qu'un couloir a aussitôt été ouvert. L'épisode montre combien l'accès au carburant conditionne les services essentiels et comment le contrôle armé d'une infrastructure menace des civils dans tout le pays.",
    "sources": [
      [
        "Institutional research",
        "https://haiti.un.org/en/202244-un-and-its-partners-haiti-call-creation-humanitarian-corridor"
      ]
    ]
  },
  {
    "slug": "haiti-2022-research-05-food-security-assessment-identifies",
    "date": "2022-10-14",
    "dimension": "inside",
    "categories": [
      "economy",
      "society",
      "education"
    ],
    "location": "Cité Soleil, Haiti",
    "title": "Food-security assessment identifies catastrophic hunger in Cité Soleil",
    "ft": "Une évaluation recense une faim catastrophique à Cité Soleil",
    "summary": "The IPC analysis identifies about 19,200 people facing Catastrophe conditions.",
    "fs": "L'analyse IPC situe environ 19 200 personnes en situation de catastrophe alimentaire.",
    "body": "A food-security assessment released in October 2022 found that an estimated 4.7 million people in Haiti faced Crisis-level food insecurity or worse. In parts of Cité Soleil, approximately 19,200 people were classified in the IPC's highest category, Catastrophe. Violence, restrictions on road access, expensive food and lost incomes combined to obstruct households' ability to feed themselves. These assessments distinguish acute food insecurity levels from a formal nationwide famine declaration. The date and forecast period matter: the numbers describe a particular assessment and cannot be treated as permanent totals. This episode also records the unequal impact of political and armed conflict on families already facing poverty.",
    "fb": "L'évaluation d'octobre 2022 estime que 4,7 millions de personnes sont confrontées à une insécurité alimentaire de niveau Crise ou supérieur. À Cité Soleil, environ 19 200 personnes se trouvent dans la catégorie Catastrophe de l'IPC. La violence, les difficultés d'acheminement, le coût des aliments et la perte de revenus se renforcent. Ces résultats ne constituent pas une déclaration de famine généralisée à tout le pays. Les chiffres correspondent à une période précise et doivent être rapportés comme tels. Ils soulignent les conséquences inégales de l'insécurité sur les familles.",
    "sources": [
      [
        "ACAPS",
        "https://www.haitidocs.org/doc/acaps-haiti-2022"
      ]
    ]
  },
  {
    "slug": "haiti-2022-research-06-haiti-s-government-requests-interna",
    "date": "2022-10-07",
    "dimension": "inside",
    "categories": [
      "politics",
      "world"
    ],
    "location": "Port-au-Prince",
    "title": "Haiti's government requests international security assistance",
    "ft": "Le gouvernement haïtien sollicite une assistance internationale à la sécurité",
    "summary": "The executive appeals for foreign help amid armed-group violence, fuel shortages and cholera.",
    "fs": "L'exécutif demande une aide extérieure sur fond de violences, de pénuries et de choléra.",
    "body": "In early October 2022, Ariel Henry's government sought international support to confront armed groups and allow fuel and humanitarian supplies to circulate. The request came during nationwide protests, the Varreux blockade and the first renewed cholera cases. Haitian political and civil-society organizations differed sharply over the proposal, particularly given Haiti's experience with previous foreign interventions. The appeal did not itself authorize a foreign force. The UN Security Council's later decisions on sanctions in 2022 and an international support mission in 2023 were separate legal acts. This distinction is central to analyzing Haiti's sovereignty, the government's legitimacy and the role of international institutions.",
    "fb": "Au début d'octobre 2022, le gouvernement d'Ariel Henry demande un appui international pour affronter les groupes armés et rétablir la circulation des approvisionnements. L'appel intervient pendant les manifestations, le blocus de Varreux et le retour du choléra. Des organisations politiques et civiles haïtiennes expriment des positions divergentes, notamment en raison de l'histoire des interventions étrangères. La demande n'autorise pas elle-même une force internationale. Les sanctions de 2022 et l'autorisation d'une mission en 2023 sont des actes juridiques distincts.",
    "sources": [
      [
        "Institutional research",
        "https://www.oas.org/en/iachr/docs/annual/2022/chapters/6-ia2022_cap_4a_en.pdf"
      ]
    ]
  },
  {
    "slug": "haiti-2022-research-07-security-council-establishes-target",
    "date": "2022-10-21",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "United Nations, New York",
    "title": "Security Council establishes targeted Haiti sanctions regime",
    "ft": "Le Conseil de sécurité crée un régime de sanctions ciblées concernant Haïti",
    "summary": "Resolution 2653 authorizes asset freezes, travel bans and targeted arms restrictions.",
    "fs": "La résolution 2653 établit des gels d'avoirs, interdictions de voyager et restrictions ciblées sur les armes.",
    "body": "On 21 October 2022, the United Nations Security Council adopted resolution 2653, creating a sanctions regime in response to Haiti's deteriorating security situation. Its measures included a travel ban, asset freeze and targeted arms embargo for designated individuals and entities. The Council also established a sanctions committee and a panel of experts to monitor implementation, including criminal networks and weapons trafficking. The legal action was separate from the Haitian government's earlier request for international intervention, and it did not itself establish an international police deployment. The sanctions framework subsequently became a basis for investigations and further designations. Its effectiveness depended on enforcement by states and financial institutions.",
    "fb": "Le 21 octobre 2022, le Conseil de sécurité des Nations unies adopte la résolution 2653 face à la détérioration de la sécurité en Haïti. Le texte instaure des interdictions de voyager, des gels d'avoirs et un embargo ciblé sur les armes pour les personnes et entités désignées. Il crée aussi un comité de sanctions et un groupe d'experts chargé de suivre l'application des mesures, notamment en matière de trafics. Cette décision ne crée pas une force policière internationale et demeure distincte des demandes antérieures du gouvernement. Son efficacité dépend de son application par les États.",
    "sources": [
      [
        "UN Security Council",
        "https://main.un.org/securitycouncil/en/content/sres2653-2022"
      ]
    ]
  },
  {
    "slug": "haiti-2022-research-08-haitian-police-regain-access-to-the",
    "date": "2022-11-03",
    "dimension": "inside",
    "categories": [
      "economy",
      "society",
      "politics"
    ],
    "location": "Varreux, Port-au-Prince",
    "title": "Haitian police regain access to the Varreux fuel terminal",
    "ft": "La police haïtienne reprend l'accès au terminal pétrolier de Varreux",
    "summary": "Authorities say the main terminal becomes accessible after 56 days of blockade.",
    "fs": "Les autorités annoncent la fin d'un blocus de 56 jours au principal terminal de carburant.",
    "body": "On 3 November 2022, Haiti's National Police announced that it had regained control of access to the Varreux terminal after 56 days of complete blockade. The terminal had been blocked by armed groups since September, leading to fuel shortages that halted water distribution, closed hospitals and interrupted businesses and humanitarian operations. OCHA noted that reopening markets and services would be gradual and that firms had already suffered layoffs. Regaining physical access was an important step, but it did not resolve gang violence or guarantee immediate normal distribution. The episode should be studied alongside the October cholera emergency and the wider failure of safe transport routes.",
    "fb": "Le 3 novembre 2022, la Police nationale d'Haïti annonce avoir repris l'accès au terminal de Varreux après 56 jours de blocus total. Depuis septembre, les pénuries de carburant ont interrompu la distribution d'eau, le fonctionnement de centres de santé, les entreprises et les opérations humanitaires. L'OCHA souligne que la reprise des marchés et des services est progressive et que des entreprises ont déjà licencié des travailleurs. La récupération d'un terminal ne signifie ni la fin des violences ni un retour immédiat à un approvisionnement normal.",
    "sources": [
      [
        "Institutional research",
        "https://haiti.un.org/en/206570-haiti-humanitarian-situation-and-cholera-%E2%80%93-flash-update-5-7-november-2022"
      ]
    ]
  },
  {
    "slug": "haiti-2022-research-09-makenzy-orcel-s-une-somme-humaine-r",
    "date": "2022",
    "dimension": "abroad",
    "categories": [
      "arts",
      "abroad"
    ],
    "location": "France and Haiti",
    "title": "Makenzy Orcel's Une somme humaine reaches the Prix Goncourt shortlist",
    "ft": "Une somme humaine de Makenzy Orcel atteint la sélection finale du prix Goncourt",
    "summary": "The Haitian writer receives major international recognition for his novel, without winning the 2022 award.",
    "fs": "Le romancier haïtien est finaliste d'un grand prix international, sans remporter l'édition 2022.",
    "body": "Haitian novelist Makenzy Orcel published Une somme humaine in 2022 and appeared among the four finalists for that year's Prix Goncourt, one of France's best-known literary awards. The winner was Brigitte Giraud for Vivre vite. Orcel's selection drew attention to Haitian literature beyond the country's political crisis and to literary work that travels through Caribbean and European publishing networks. A careful chronology distinguishes the publication of the book, the successive shortlist announcements and the awarding of the prize, avoiding the erroneous claim that Orcel won the Goncourt. The recognition can be connected to the broader history of Haitian-language and Francophone writing, publishing and translation.",
    "fb": "Le romancier haïtien Makenzy Orcel publie Une somme humaine en 2022 et figure parmi les quatre finalistes du prix Goncourt. Brigitte Giraud remporte finalement le prix pour Vivre vite. La sélection attire l'attention sur la littérature haïtienne au-delà de l'actualité politique et sur ses liens avec les réseaux éditoriaux caribéens et européens. La chronologie doit distinguer la parution du roman, les étapes de sélection et le prix attribué, sans présenter Orcel comme lauréat de cette édition.",
    "sources": [
      [
        "Gazette Haiti",
        "https://gazettehaiti.com/index.php/node/8953"
      ]
    ]
  },
  {
    "slug": "haiti-2022-research-10-school-closures-and-disrupted-healt",
    "date": "2022",
    "dimension": "inside",
    "categories": [
      "education",
      "society",
      "economy"
    ],
    "location": "Haiti",
    "title": "School closures and disrupted healthcare deepen the social emergency",
    "ft": "Les fermetures d'écoles et les soins perturbés aggravent la crise sociale",
    "summary": "Violence, fuel scarcity and disease combine to interrupt education and health services.",
    "fs": "La violence, les pénuries de carburant et les maladies interrompent l'école et les soins.",
    "body": "Throughout 2022, insecurity and repeated blockades kept many children out of school while hospitals struggled to obtain fuel for generators, supplies and transport. A humanitarian assessment published in November described more than 200 schools closed and significant restrictions on access to care. The cholera resurgence in October added urgent needs for clean water, rehydration treatment and preventive outreach. Educational interruptions were not identical in every department, and the number of affected schools changed with reporting periods. The history of the year must include teachers, parents, health workers and children whose daily routines were disrupted, and it must distinguish temporary closures from lasting damage to educational institutions.",
    "fb": "Pendant l'année 2022, l'insécurité et les barrages empêchent de nombreux enfants d'aller à l'école, tandis que les hôpitaux manquent de carburant pour leurs générateurs et leurs transports. Une évaluation de novembre mentionne plus de 200 établissements scolaires fermés et des difficultés d'accès aux soins. Le retour du choléra crée des besoins supplémentaires en eau potable et en traitements. Les conditions varient selon les départements, et les nombres d'écoles touchées changent avec les périodes d'observation. Le récit doit prendre en compte les enseignants, les familles, les soignants et les élèves.",
    "sources": [
      [
        "ACAPS",
        "https://www.haitidocs.org/doc/acaps-haiti-2022"
      ]
    ]
  }
];
export const research2022: HistEvent[] = entries.map(e=>({slug:e.slug,date:e.date,precision:(e.date.length===10?"day":e.date.length===7?"month":"year") as DatePrecision,dimension:e.dimension,categories:e.categories,location:e.location,title:e.title,summary:e.summary,body:e.body,fr:{title:e.ft,summary:e.fs,body:e.fb},sources:e.sources.map(([title,url])=>({title,url})),status:"documented",editorial:{verification:"corroborated",dateBasis:"date or period given in cited contemporary research",reviewedOn:"2026-11-01"}}));
