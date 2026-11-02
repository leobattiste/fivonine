import type { HistEvent, DatePrecision, Dimension } from "./types";
/** Bilingual 2025 research. Canonical UN resolution 2793 already present separately. */
type Entry={slug:string;date:string;dimension:Dimension;categories:string[];location:string;title:string;ft:string;summary:string;fs:string;body:string;fb:string;sources:[string,string][]};
const entries:Entry[]=[
  {
    "slug": "research-2025-01-armed-groups-attack-communities-i",
    "date": "2025-01",
    "dimension": "inside",
    "categories": [
      "society",
      "politics",
      "environment"
    ],
    "location": "Kenscoff, Ouest department",
    "title": "Armed groups attack communities in Kenscoff",
    "ft": "Des groupes armés attaquent les communautés de Kenscoff",
    "summary": "Assaults in mountain communities near Port-au-Prince kill residents and displace families.",
    "fs": "Des attaques dans les hauteurs proches de Port-au-Prince tuent des habitants et déplacent des familles.",
    "body": "Between 26 and 29 January 2025, gangs allied with Viv Ansanm attacked settlements in Kenscoff, south of Port-au-Prince. United Nations investigations later documented further attacks through April, with civilian deaths, injuries, houses burned and thousands of people forced to flee. The offensive targeted routes and territory connecting the capital to southeastern Haiti, demonstrating how insecurity was expanding beyond densely populated urban neighborhoods. Local warnings and the response of security forces became part of the investigation. Figures reported for January alone must not be confused with casualty counts for January–April. This history should include displaced rural families, farmers, residents of hillside settlements and the loss of access to schools and markets.",
    "fb": "Du 26 au 29 janvier 2025, des groupes alliés à Viv Ansanm attaquent des localités de Kenscoff, au sud de Port-au-Prince. Les investigations de l'ONU documentent d'autres offensives jusqu'en avril, avec des morts parmi les civils, des blessés, des maisons incendiées et des milliers de déplacés. Les groupes armés visent notamment les routes et les territoires reliant la capitale au Sud-Est. Les bilans de janvier ne doivent pas être confondus avec les chiffres couvrant plusieurs mois. L'histoire doit intégrer les familles rurales, les agriculteurs et les habitants privés d'école ou de marchés.",
    "sources": [
      [
        "United Nations in Haiti, Kenscoff attacks (English)",
        "https://haiti.un.org/en/292260-least-262-people-killed-over-two-months-brutal-attacks-kenscoff-heights-port-au-prince"
      ]
    ]
  },
  {
    "slug": "research-2025-02-haitian-writer-and-artist-frank-t",
    "date": "2025-02-20",
    "dimension": "inside",
    "categories": [
      "arts",
      "culture",
      "education"
    ],
    "location": "Delmas, Haiti",
    "title": "Haitian writer and artist Frankétienne dies at 88",
    "ft": "L'écrivain et artiste haïtien Frankétienne meurt à 88 ans",
    "summary": "The influential author of Dézafi and co-founder of spiralism leaves a major literary legacy.",
    "fs": "L'auteur de Dézafi et cofondateur du spiralisme laisse un héritage littéraire majeur.",
    "body": "On 20 February 2025, Haitian writer, poet, playwright, painter and educator Frankétienne died at the age of 88. Born in 1936, he co-founded the spiralist literary movement and created an extensive body of work in French and Haitian Creole, including Dézafi, a landmark novel in Creole. He also produced paintings and performances exploring memory, dictatorship and social upheaval. UNESCO commemorated his contributions to culture and education, including the school he founded in Port-au-Prince. His death prompted tributes in Haiti and abroad. The event belongs to the history of Haitian literature and the arts, and his biography should extend far beyond the circumstances of his death, documenting the works, collaborations and generations of artists he influenced.",
    "fb": "Le 20 février 2025, l'écrivain, poète, dramaturge, peintre et enseignant Frankétienne meurt à l'âge de 88 ans. Né en 1936, il est l'un des fondateurs du spiralisme et l'auteur d'une œuvre considérable en français et en créole haïtien, dont Dézafi. Sa peinture et son théâtre abordent la mémoire, la dictature et les bouleversements sociaux. L'UNESCO rend hommage à son travail artistique et éducatif, notamment à l'école qu'il a fondée à Port-au-Prince. Sa disparition suscite des hommages en Haïti et à l'étranger. Son parcours doit être documenté à travers ses créations et son influence sur plusieurs générations.",
    "sources": [
      [
        "UNESCO",
        "https://www.unesco.org/en/articles/franketienne-1936-2025-tireless-defender-haitian-culture-and-unesco-artist-peace"
      ]
    ]
  },
  {
    "slug": "research-2025-03-gang-offensives-take-over-mirebal",
    "date": "2025-03",
    "dimension": "inside",
    "categories": [
      "politics",
      "society",
      "economy"
    ],
    "location": "Mirebalais and Saut-d'Eau, Centre",
    "title": "Gang offensives take over Mirebalais and advance into Saut-d'Eau",
    "ft": "Des groupes armés prennent Mirebalais et avancent vers Saut-d'Eau",
    "summary": "Attacks force residents to flee and allow hundreds of prisoners to escape.",
    "fs": "Les attaques poussent les habitants à fuir et provoquent l'évasion de centaines de détenus.",
    "body": "On 31 March 2025, armed groups launched a major offensive against Mirebalais in Haiti's Centre department, after attacks along the Route Nationale 3 corridor. Groups associated with Viv Ansanm sought control of strategic routes toward the Dominican Republic and onward to the Artibonite. The assault resulted in the escape of more than 515 detainees from the local prison according to UN reporting. Nearby Saut-d'Eau was subsequently attacked. People fled homes, businesses, schools and health facilities, placing pressure on surrounding communities. This was an important geographical expansion of armed-group control, illustrating how access to markets, hospitals and trade routes could be threatened far from the capital.",
    "fb": "Le 31 mars 2025, des groupes armés attaquent Mirebalais, dans le département du Centre, après des offensives le long de la route nationale 3. Des groupes liés à Viv Ansanm cherchent à contrôler des axes stratégiques vers la frontière dominicaine et l'Artibonite. Selon l'ONU, plus de 515 détenus s'évadent de la prison de Mirebalais. Saut-d'Eau est ensuite attaquée. Des familles, commerçants et élèves quittent leurs lieux de vie et de travail. Ces événements marquent une extension territoriale importante de la violence au-delà de la région métropolitaine.",
    "sources": [
      [
        "UN / institutional report",
        "https://binuh.unmissions.org/en/press-releases/at-least-1617-people-killed-in-the-first-quarter-of-2025-in-haiti"
      ]
    ]
  },
  {
    "slug": "research-2025-04-united-states-designates-viv-ansa",
    "date": "2025-05-02",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "Washington, D.C., United States",
    "title": "United States designates Viv Ansanm and Gran Grif as foreign terrorist organizations",
    "ft": "Les États-Unis désignent Viv Ansanm et Gran Grif comme organisations terroristes étrangères",
    "summary": "The designation creates US legal restrictions on dealings with the named armed groups.",
    "fs": "La désignation entraîne des restrictions juridiques américaines concernant les groupes armés.",
    "body": "On 2 May 2025, the United States designated the Haitian armed alliances Viv Ansanm and Gran Grif as Foreign Terrorist Organizations and Specially Designated Global Terrorists. The Treasury Department published related sanctions information. The decision reflects a particular legal classification under United States law, not a determination issued by Haiti's courts or the United Nations. It has implications for financial transactions, material support, immigration and international cooperation. The event should be analyzed in relation to existing UN arms sanctions, allegations of trafficking and efforts to protect civilians. Designation alone does not prove that either group ceased operations or that insecurity declined.",
    "fb": "Le 2 mai 2025, les États-Unis désignent Viv Ansanm et Gran Grif comme organisations terroristes étrangères et entités terroristes mondiales spécialement désignées. Le département du Trésor publie les mesures correspondantes. Il s'agit d'une qualification prévue par le droit américain, distincte de décisions judiciaires haïtiennes ou de sanctions de l'ONU. Elle a des conséquences sur les transactions, l'aide matérielle, les migrations et la coopération. La désignation ne prouve pas que les groupes ont cessé leurs activités ni que la sécurité s'est améliorée.",
    "sources": [
      [
        "US Treasury",
        "https://ofac.treasury.gov/recent-actions/20250502"
      ]
    ]
  },
  {
    "slug": "research-2025-05-haiti-s-hope-help-apparel-trade-p",
    "date": "2025-09-30",
    "dimension": "foreign",
    "categories": [
      "economy",
      "abroad",
      "world"
    ],
    "location": "United States and Haiti",
    "title": "Haiti's HOPE/HELP apparel trade preferences lapse",
    "ft": "Les préférences commerciales HOPE/HELP pour le textile haïtien expirent",
    "summary": "Duty-free preferences for qualifying Haitian apparel expire and leave exporters uncertain.",
    "fs": "Les avantages tarifaires pour certains vêtements haïtiens expirent et fragilisent les exportateurs.",
    "body": "On 30 September 2025, important benefits provided under Haiti's HOPE and HELP trade-preference programs expired without timely renewal by the United States Congress. The programs supported eligible textile and apparel exports from Haiti to the US market and were important to the country's shrinking formal manufacturing sector. Their expiration raised concerns for factory workers, investors and exporters already struggling with insecurity, transport costs and interruptions to trade. It should be distinguished from the broader Caribbean Basin Trade Partnership Act, whose provisions had a different authorization period, and from the later retroactive renewal enacted in February 2026. The historical record should describe the temporary loss of benefits without claiming all textile factories closed.",
    "fb": "Le 30 septembre 2025, d'importants avantages des programmes commerciaux HOPE et HELP expirent faute de prolongation à temps par le Congrès américain. Ces dispositifs favorisent les exportations de certains vêtements produits en Haïti et soutiennent une partie de l'emploi industriel formel. Leur expiration accroît l'incertitude pour les salariés, les exportateurs et les investisseurs déjà confrontés à l'insécurité et aux coûts de transport. Il faut distinguer ces programmes des autres accords commerciaux et du rétablissement rétroactif adopté en février 2026. La fin temporaire des avantages ne signifie pas que toutes les usines aient fermé.",
    "sources": [
      [
        "US Trade Administration",
        "https://www.trade.gov/sites/default/files/2026-01/Cleared%20Haiti%20FAQs.pdf?v=1774398948598"
      ]
    ]
  },
  {
    "slug": "research-2025-06-unicef-reports-nearly-680-000-chi",
    "date": "2025-10-08",
    "dimension": "inside",
    "categories": [
      "society",
      "education"
    ],
    "location": "Haiti",
    "title": "UNICEF reports nearly 680,000 children displaced by violence",
    "ft": "L'UNICEF recense près de 680 000 enfants déplacés par la violence",
    "summary": "Displacement among children almost doubles over a year as essential services break down.",
    "fs": "Le nombre d'enfants déplacés a presque doublé en un an, tandis que les services essentiels se dégradent.",
    "body": "On 8 October 2025, UNICEF reported that about 680,000 children had been displaced by violence in Haiti, almost twice the number recorded one year before, within a total displaced population exceeding 1.3 million. Many families had moved repeatedly as armed groups expanded into new communities. Children lost access to safe housing, schooling, regular medical care and social support. The figures describe displacement as measured at a specific point in time, not a permanent total for the entire year. They help bring into focus the experiences of girls, boys, parents and teachers behind broader national statistics. The report also described a sharp increase in the number of displacement sites.",
    "fb": "Le 8 octobre 2025, l'UNICEF indique qu'environ 680 000 enfants ont été déplacés par la violence en Haïti, presque le double d'un an auparavant, dans une population déplacée dépassant 1,3 million de personnes. De nombreuses familles fuient plusieurs fois à mesure que l'insécurité s'étend. Les enfants perdent des logements sûrs, des cours réguliers, des soins et des réseaux de soutien. Ces chiffres correspondent à un état des lieux daté et non à un total définitif de l'année. Ils donnent une dimension humaine aux statistiques de la crise.",
    "sources": [
      [
        "UNICEF",
        "https://www.unicef.org/press-releases/number-displaced-children-haiti-almost-doubles-one-year"
      ]
    ]
  },
  {
    "slug": "research-2025-07-hurricane-melissa-causes-deadly-f",
    "date": "2025-10",
    "dimension": "inside",
    "categories": [
      "environment",
      "society",
      "economy",
      "education"
    ],
    "location": "Sud, Sud-Est, Nippes, Grand'Anse and Ouest",
    "title": "Hurricane Melissa causes deadly flooding and infrastructure damage",
    "ft": "L'ouragan Melissa provoque des inondations mortelles et des dégâts",
    "summary": "Heavy rain triggers flooding, landslides and damage to homes, schools, roads and water systems.",
    "fs": "Les pluies provoquent crues, glissements de terrain et dégâts aux maisons, écoles et réseaux d'eau.",
    "body": "During late October 2025, Hurricane Melissa brought destructive rainfall and flooding to Haiti, especially the southern departments and the Palmes region of Ouest. A UNICEF situation update covering 24 October to 24 November reported that 245,545 people were directly affected and documented damage to homes, schools, irrigation canals and drinking-water systems. Its casualty figures reflect that later reporting period and should not be treated as information known during the first days of the storm. The disaster disrupted agriculture, education and transportation in communities already struggling with insecurity. The impact must be described geographically and should not suggest that the hurricane's eye made landfall in Haiti.",
    "fb": "À la fin d'octobre 2025, l'ouragan Melissa apporte de fortes pluies et des inondations en Haïti, particulièrement dans les départements du Sud et dans la région des Palmes. Un bilan de l'UNICEF couvrant le 24 octobre au 24 novembre indique que 245 545 personnes sont directement touchées et relève des dégâts aux habitations, écoles, canaux d'irrigation et réseaux d'eau. Les bilans de victimes correspondent à cette période ultérieure. La catastrophe perturbe l'agriculture, l'école et les transports, sans qu'il faille prétendre que l'œil de l'ouragan a touché directement Haïti.",
    "sources": [
      [
        "UN / institutional report",
        "https://www.unicef.org/media/176786/file/UNICEF%20Haiti%20Flash%20Report%20No.%203%20%28Tropical%20Storm%20MELISSA%29%20November%202025.pdf.pdf"
      ]
    ]
  },
  {
    "slug": "research-2025-08-haiti-qualifies-for-its-first-men",
    "date": "2025-11-18",
    "dimension": "abroad",
    "categories": [
      "sports",
      "abroad"
    ],
    "location": "Willemstad, Curaçao",
    "title": "Haiti qualifies for its first men's World Cup since 1974",
    "ft": "Haïti se qualifie pour sa première Coupe du monde masculine depuis 1974",
    "summary": "A 2–0 victory over Nicaragua secures a place at the 2026 FIFA World Cup.",
    "fs": "Une victoire 2-0 contre le Nicaragua assure une place à la Coupe du monde 2026.",
    "body": "On 18 November 2025, Haiti defeated Nicaragua 2–0 to secure qualification for the 2026 men's FIFA World Cup, returning to the tournament for the first time since 1974. Haiti finished ahead in its Concacaf qualifying group despite being unable to play home matches in the country because of insecurity. Players, coaches and supporters across the Haitian diaspora shared the achievement. The qualification demonstrated the global reach of Haitian football in a difficult period, and the 2026 tournament appearances should be documented separately in the next year's chronology. The official result, location and qualification conditions are recorded by FIFA.",
    "fb": "Le 18 novembre 2025, Haïti bat le Nicaragua 2-0 et se qualifie pour la Coupe du monde masculine 2026, pour la première fois depuis 1974. La sélection termine en tête de son groupe qualificatif de la Concacaf, malgré l'impossibilité d'organiser ses matchs à domicile en Haïti à cause de l'insécurité. Les joueurs, les entraîneurs et les supporters de la diaspora célèbrent ce succès. La qualification doit être distinguée des matchs disputés pendant le tournoi de 2026. La FIFA conserve le résultat et le contexte de cette performance historique.",
    "sources": [
      [
        "FIFA",
        "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/haiti-qualify"
      ]
    ]
  },
  {
    "slug": "research-2025-09-unesco-inscribes-haitian-compas-a",
    "date": "2025-12",
    "dimension": "abroad",
    "categories": [
      "culture",
      "arts",
      "abroad"
    ],
    "location": "New Delhi, India",
    "title": "UNESCO inscribes Haitian Compas as intangible cultural heritage",
    "ft": "L'UNESCO inscrit le compas haïtien au patrimoine culturel immatériel",
    "summary": "The music and dance tradition receives international recognition for its cultural significance and transmission.",
    "fs": "La tradition musicale et dansée reçoit une reconnaissance internationale pour son importance culturelle.",
    "body": "At its 2025 meeting in New Delhi, UNESCO's Intergovernmental Committee inscribed the Compas of Haiti on the Representative List of the Intangible Cultural Heritage of Humanity. The recognition concerns a living music and dance tradition, including its rhythmic structures, performance practices and transmission by musicians, families, dancers and cultural institutions. It acknowledges African, European and Indigenous influences and the social importance of Compas at celebrations in Haiti and the diaspora. UNESCO inscription is not a statement that the genre was invented in 2025; the tradition has a longer history that requires its own historical treatment. The event also highlights the work of cultural bearers and organizations maintaining Haitian music across generations.",
    "fb": "Lors de sa réunion de 2025 à New Delhi, le Comité intergouvernemental de l'UNESCO inscrit le compas d'Haïti sur la Liste représentative du patrimoine culturel immatériel de l'humanité. La reconnaissance concerne une tradition vivante de musique et de danse, ses rythmes, ses pratiques et sa transmission par les musiciens, familles, danseurs et institutions. Elle souligne des influences africaines, européennes et autochtones ainsi que l'importance du compas lors des célébrations en Haïti et dans la diaspora. L'inscription ne signifie pas que le genre a été créé en 2025 ; son histoire s'étend sur plusieurs générations.",
    "sources": [
      [
        "UNESCO, Le compas d’Haïti (français)",
        "https://ich.unesco.org/fr/RL/le-compas-d-haiti-02273"
      ]
    ]
  },
  {
    "slug": "research-2025-10-transitional-presidential-council",
    "date": "2025-12-01",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Port-au-Prince",
    "title": "Transitional Presidential Council publishes a new electoral decree",
    "ft": "Le Conseil présidentiel de transition publie un nouveau décret électoral",
    "summary": "The decree establishes legal provisions for elections and an initial timetable later revised.",
    "fs": "Le texte fixe les dispositions juridiques des élections et un premier calendrier ensuite modifié.",
    "body": "On 1 December 2025, the Transitional Presidential Council published an electoral decree in the official gazette Le Moniteur. The document established rules for voter registration, candidates, electoral authorities, campaign financing and voting procedures. The Provisional Electoral Council later issued an initial timetable for 2026, but that schedule was changed by subsequent decrees and security developments. The adoption of an electoral decree did not mean elections had taken place. Its significance lies in efforts to rebuild an electoral legal framework after years without national voting, while disputes persisted about security, constitutional authority and the council's approaching February 2026 deadline.",
    "fb": "Le 1er décembre 2025, le Conseil présidentiel de transition publie un décret électoral dans Le Moniteur. Le texte encadre l'inscription des électeurs, les candidatures, les autorités électorales, le financement des campagnes et les opérations de vote. Le Conseil électoral provisoire annonce ensuite un premier calendrier pour 2026, modifié plus tard. L'adoption d'un décret ne signifie pas que des élections ont eu lieu. Cet acte marque une tentative de rétablir un cadre juridique électoral dans un contexte d'insécurité et avant l'expiration prévue du mandat du Conseil en février 2026.",
    "sources": [
      [
        "CEP, décret électoral du 1er décembre 2025 (français)",
        "https://cephaiti.ht/wp-content/uploads/2026/06/Decret_electoral_-1e-Decembre-2025.pdf"
      ]
    ]
  }
];
export const research2025:HistEvent[]=entries.map(e=>({slug:e.slug,date:e.date,precision:(e.date.length===10?"day":e.date.length===7?"month":"year") as DatePrecision,dimension:e.dimension,categories:e.categories,location:e.location,title:e.title,summary:e.summary,body:e.body,fr:{title:e.ft,summary:e.fs,body:e.fb},sources:e.sources.map(([title,url])=>({title,url})),status:"documented",editorial:{verification:"corroborated",dateBasis:"event date or dated institutional reporting period",reviewedOn:"2026-11-01"}}));

