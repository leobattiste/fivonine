import type { HistEvent, DatePrecision, Dimension } from "./types";

/**
 * 2021 research records: Haitian political history, public health, education,
 * sport, cultural achievement, society and the worldwide Haitian diaspora.
 * Sources are indexed centrally by the site rather than repeated in articles.
 */
type Entry = {
 slug: string; date: string; precision: DatePrecision; dimension: Dimension;
 categories: string[]; location: string; countries?: string[]; people?: string[];
 title: string; ft: string; summary: string; fs: string; body: string; fb: string;
 sources: [string,string][];
};
const entries: Entry[] = [
  {
    "slug": "haiti-2021-presidential-term-dispute",
    "date": "2021-02-07",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Port-au-Prince",
    "people": [
      "jovenel-moise"
    ],
    "title": "Dispute over the end of President Moïse's term enters a decisive phase",
    "ft": "Le désaccord sur la fin du mandat de Jovenel Moïse s'intensifie",
    "summary": "Opposition groups and legal bodies argue that Moïse's term has ended, while the president says it continues until 2022.",
    "fs": "L'opposition et des institutions juridiques estiment que le mandat est terminé, tandis que le président défend l'échéance de 2022.",
    "body": "On 7 February 2021, Haiti entered a decisive phase in its constitutional dispute. Opposition parties, the Haitian Bar Federation and members of the judiciary argued that President Jovenel Moïse's term should have expired that day. Moïse maintained that he had another year to serve, pointing to his inauguration in February 2017 after an interrupted electoral process. Demonstrations and arrests accompanied the confrontation. Since most parliamentary mandates had already expired in January 2020, the legislature could not provide ordinary institutional checks or a broadly accepted solution. The dispute had practical consequences for planned elections, constitutional reform and public trust. Both interpretations must be explained in their constitutional context, without presenting the disagreement itself as an election or an agreed transfer of authority.",
    "fb": "Le 7 février 2021 marque une nouvelle étape de la crise constitutionnelle. Des partis d'opposition, la Fédération des barreaux d'Haïti et des représentants du pouvoir judiciaire estiment que le mandat de Jovenel Moïse doit prendre fin. Le président affirme au contraire que son mandat se poursuit jusqu'en février 2022, compte tenu de son entrée en fonction en 2017 après un processus électoral interrompu. Des manifestations et des arrestations accompagnent ce désaccord. Le Parlement ne pouvant plus fonctionner normalement depuis janvier 2020, les mécanismes de contrôle institutionnel sont affaiblis. Cette controverse affecte les projets électoraux, la réforme constitutionnelle et la confiance de la population.",
    "sources": [
      [
        "Immigration and Refugee Board of Canada, political dispute 2019–July 2021",
        "https://www.ecoi.net/en/document/2057118.html"
      ],
      [
        "Institute for Justice and Democracy in Haiti, rule-of-law review",
        "https://www.ijdh.org/publications/human-rights-and-rule-of-law-in-haiti-key-recent-developments-3/"
      ]
    ]
  },
  {
    "slug": "haiti-2021-judicial-council-conflict",
    "date": "2021-02-08",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "politics",
      "education",
      "society"
    ],
    "location": "Port-au-Prince",
    "people": [
      "jovenel-moise"
    ],
    "title": "Three Supreme Court judges are removed amid a constitutional dispute",
    "ft": "Trois juges de la Cour de cassation sont écartés pendant la crise constitutionnelle",
    "summary": "The executive removes three senior judges after alleging a plot; legal organizations challenge the decision.",
    "fs": "L'exécutif écarte trois hauts magistrats après avoir dénoncé un complot ; des organisations juridiques contestent la mesure.",
    "body": "After President Moïse's announcement on 7 February that authorities had thwarted an alleged coup attempt, the executive forcibly retired three judges of the Cour de cassation. The judges included Joseph Mécène Jean-Louis, whom opposition politicians had proposed as an interim president, as well as Izykel Dabrezil and Windelle Coq-Thélot. Legal and civil-society organizations challenged the measures, arguing that judges' security of tenure and the separation of powers had been violated. The government appointed replacements a few days later. These events deepened the confrontation among the executive, judiciary and opposition. Allegations of conspiracy, legal objections and official decrees require separate attribution; they should not be merged into an assumed judicial verdict.",
    "fb": "Après l'annonce présidentielle du 7 février faisant état d'une tentative présumée de coup d'État, l'exécutif met à la retraite forcée trois magistrats de la Cour de cassation : Joseph Mécène Jean-Louis, proposé par l'opposition comme président provisoire, Izykel Dabrezil et Windelle Coq-Thélot. Des organisations juridiques et civiques contestent cette décision au nom de l'indépendance de la justice et de la séparation des pouvoirs. De nouveaux juges sont nommés peu après. Cet épisode accentue la crise entre l'exécutif, la magistrature et l'opposition. Les accusations de complot et les objections juridiques doivent rester attribuées à leurs auteurs.",
    "sources": [
      [
        "U.S. Department of State, 2021 Haiti human rights report",
        "https://www.ecoi.net/en/document/2071140.html"
      ],
      [
        "Institute for Justice and Democracy in Haiti, 2021 review",
        "https://www.ijdh.org/publications/human-rights-and-rule-of-law-in-haiti-key-recent-developments-3/"
      ]
    ]
  },
  {
    "slug": "haiti-2021-clergy-kidnapping-april",
    "date": "2021-04-11",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "society",
      "culture",
      "politics"
    ],
    "location": "Croix-des-Bouquets, Ouest",
    "title": "Ten Catholic clergy and associated persons are abducted",
    "ft": "Dix personnes liées à l'Église catholique sont enlevées",
    "summary": "A mass kidnapping attributed to the 400 Mawozo gang highlights attacks on religious communities and widespread ransom-taking.",
    "fs": "Un enlèvement attribué au groupe 400 Mawozo illustre les attaques contre les communautés religieuses et l'essor des rançons.",
    "body": "On 11 April 2021, members of the 400 Mawozo armed group kidnapped ten Catholic clergy and associated persons, including French nationals, near Croix-des-Bouquets. The case attracted international attention, but it formed part of a broader wave of kidnappings affecting Haitian worshippers, teachers, shopkeepers and ordinary travelers. Religious communities faced growing risks during services, journeys and outreach work. The United States' 2021 report on religious freedom documented this abduction alongside other incidents, including an earlier kidnapping at a Seventh-day Adventist church. Historical coverage should record the victims and their safety with care and avoid equating the risk to prominent international visitors with the experiences of the wider Haitian population.",
    "fb": "Le 11 avril 2021, des membres du groupe armé 400 Mawozo enlèvent dix personnes liées à l'Église catholique, dont des ressortissants français, dans la région de Croix-des-Bouquets. L'affaire attire l'attention internationale, alors que les enlèvements frappent également des fidèles, des enseignants, des commerçants et des voyageurs haïtiens. Les communautés religieuses sont exposées pendant leurs déplacements et leurs activités. Le rapport américain de 2021 sur la liberté religieuse documente cet événement et d'autres enlèvements. Le récit doit replacer ce cas médiatisé dans la réalité plus large de l'insécurité vécue par la population.",
    "sources": [
      [
        "U.S. Department of State, 2021 religious freedom report: Haiti",
        "https://2021-2025.state.gov/reports/2021-report-on-international-religious-freedom/haiti/"
      ]
    ]
  },
  {
    "slug": "haiti-2021-claude-joseph-interim-premier",
    "date": "2021-04-14",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince",
    "people": [
      "joseph-jouthe",
      "claude-joseph",
      "jovenel-moise"
    ],
    "title": "Claude Joseph becomes interim prime minister after Jouthe resigns",
    "ft": "Claude Joseph assure l'intérim à la primature après la démission de Joseph Jouthe",
    "summary": "The foreign minister is appointed interim head of government during the unresolved constitutional and electoral crisis.",
    "fs": "Le ministre des Affaires étrangères assure l'intérim du gouvernement dans un contexte de crise constitutionnelle et électorale.",
    "body": "On 14 April 2021, Joseph Jouthe resigned as prime minister and President Jovenel Moïse appointed Foreign Minister Claude Joseph to lead the government on an interim basis. Haiti still had no normally functioning parliament, and dispute over Moïse's presidential term remained unresolved. The change took place as armed violence and the pandemic complicated public administration and preparations for proposed elections. Claude Joseph's interim status became especially significant after Moïse's assassination on 7 July, when he temporarily exercised leadership of the Council of Ministers while Ariel Henry, named to succeed him shortly before the killing, had not yet been sworn in. The April appointment should therefore be recorded as a separate step in the succession timeline.",
    "fb": "Le 14 avril 2021, Joseph Jouthe démissionne de la primature et le président Jovenel Moïse désigne le ministre des Affaires étrangères Claude Joseph pour diriger provisoirement le gouvernement. Le Parlement demeure inopérant et la durée du mandat présidentiel reste contestée. Ce changement intervient alors que la violence armée et la pandémie compliquent la gestion des affaires publiques et les préparatifs électoraux. Le statut intérimaire de Claude Joseph prendra une importance particulière après l'assassinat du président le 7 juillet, lorsque la succession devient incertaine.",
    "sources": [
      [
        "United Nations, report of the Secretary-General S/2021/559",
        "https://www.haitidocs.org/doc/binuh-sg-reports-2021-report-secretary-general"
      ],
      [
        "Congressional Research Service, assassination and succession",
        "https://www.everycrsreport.com/reports/IN11699.html"
      ]
    ]
  },
  {
    "slug": "haiti-2021-cholera-free-confirmed-2021",
    "date": "2021-04-07",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "education",
      "society"
    ],
    "location": "Haiti",
    "title": "Haiti reaches more than two years without a laboratory-confirmed cholera case",
    "ft": "Haïti dépasse deux ans sans nouveau cas de choléra confirmé en laboratoire",
    "summary": "A public-health review documents progress against cholera before the disease's return in 2022.",
    "fs": "Un bilan sanitaire souligne les progrès contre le choléra avant sa réapparition en 2022.",
    "body": "On 7 April 2021, the World Bank reported that Haiti had recorded no new laboratory-confirmed cholera case since February 2019. The improvement followed years of work by Haitian health professionals, public-health laboratories, water and sanitation teams, and community organizations after the outbreak introduced in 2010. The absence of confirmed cases was an important achievement but did not remove the country's vulnerability to unsafe water, poor sanitation, or future transmission. Researchers should distinguish the number of reported suspected cases from laboratory-confirmed infections and avoid treating a period with no detected cholera as permanent eradication. The disease returned in 2022, making this 2021 public-health milestone historically significant.",
    "fb": "Le 7 avril 2021, la Banque mondiale indique qu'aucun nouveau cas de choléra confirmé en laboratoire n'a été enregistré en Haïti depuis février 2019. Ce progrès résulte de longues années de travail des soignants, des laboratoires, des équipes chargées de l'eau et de l'assainissement et d'organisations communautaires. L'absence de cas confirmés constitue une réussite sanitaire, sans faire disparaître les risques liés à l'eau insalubre ou au manque d'assainissement. Il faut distinguer les cas suspects des infections confirmées et éviter de parler d'éradication définitive. La réapparition de la maladie en 2022 donne à ce bilan une importance particulière.",
    "sources": [
      [
        "World Bank, Haiti: Towards the Elimination of Cholera (7 April 2021)",
        "https://www.worldbank.org/en/news/feature/2021/04/07/haiti-towards-the-elimination-of-cholera"
      ]
    ]
  },
  {
    "slug": "haiti-2021-martissant-gang-attacks",
    "date": "2021-06",
    "precision": "month",
    "dimension": "inside",
    "categories": [
      "politics",
      "society",
      "economy"
    ],
    "location": "Martissant, Fontamara and Delmas, Port-au-Prince",
    "title": "Armed clashes force thousands from Martissant and surrounding neighborhoods",
    "ft": "Des affrontements armés déplacent des milliers d'habitants de Martissant et des quartiers voisins",
    "summary": "Violence beginning in early June drives large-scale displacement and restricts access to southern Haiti.",
    "fs": "Les violences de début juin provoquent de nombreux déplacements et entravent l'accès au sud du pays.",
    "body": "Beginning in early June 2021, clashes among armed groups spread through Martissant, Fontamara and other neighborhoods around Port-au-Prince. UNICEF reported that around 8,500 women and children were displaced within two weeks, while subsequent UN reporting estimated about 19,000 displaced people across several metropolitan communities. Homes were burned or damaged, schools could not operate safely and the RN2 route connecting the capital to the south became difficult or dangerous to use. The closure of the Martissant corridor had consequences for transport, trade and later earthquake relief. The figures refer to different dates and populations and should not be added together. This episode is central to understanding how insecurity reached beyond conflict zones through disrupted roads and public services.",
    "fb": "Dès le début de juin 2021, des affrontements entre groupes armés touchent Martissant, Fontamara et d'autres quartiers de la capitale. L'UNICEF signale le déplacement d'environ 8 500 femmes et enfants en deux semaines ; des rapports ultérieurs de l'ONU évoquent quelque 19 000 personnes déplacées dans plusieurs communes. Des maisons sont incendiées, des écoles ferment et la route nationale 2 vers le sud devient dangereuse. Cette coupure perturbe le transport, le commerce et plus tard l'acheminement de l'aide après le séisme. Ces chiffres portent sur des populations et périodes différentes et ne doivent pas être additionnés.",
    "sources": [
      [
        "UNICEF, displacement in Port-au-Prince, 14 June 2021",
        "https://www.unicef.org/press-releases/haiti-about-8500-women-and-children-displaced-urban-guerrilla-two-weeks"
      ],
      [
        "UN Haiti, humanitarian access review",
        "https://haiti.un.org/en/189876-haiti-impact-deteriorating-security-situation-humanitarian-access-background-note-july-2022"
      ],
      [
        "BINUH, Secretary-General report September 2021",
        "https://www.haitidocs.org/doc/binuh-sg-reports-2021-2?lang=fr"
      ]
    ]
  },
  {
    "slug": "haiti-2021-camp-lapiste-displaced",
    "date": "2021-06-07",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "society",
      "education"
    ],
    "location": "Camp Lapiste, Port-au-Prince",
    "title": "Armed men burn Camp Lapiste, displacing residents with disabilities",
    "ft": "Des hommes armés incendient le camp Lapiste et déplacent ses habitants handicapés",
    "summary": "The destruction of a settlement established after the 2010 earthquake exposes heightened risks for displaced residents with disabilities.",
    "fs": "L'incendie d'un camp établi après le séisme de 2010 met en lumière la vulnérabilité des personnes handicapées déplacées.",
    "body": "On 7 June 2021, armed men set fire to Camp Lapiste, a settlement that had sheltered people displaced by the 2010 earthquake, including many residents living with disabilities. The United States' 2021 human-rights report described how dozens of people sought refuge at Saint Yves Church, where accommodation lacked accessible space, ventilation and sanitation. The case illustrates how repeated displacement can compound exclusion for people with mobility or other support needs. It also reveals the limits of humanitarian access when armed groups control surrounding streets. A complete historical account should document the circumstances reported by residents and distinguish confirmed conditions from figures in preliminary emergency assessments.",
    "fb": "Le 7 juin 2021, des hommes armés incendient le camp Lapiste, où vivent des personnes déplacées depuis le séisme de 2010, dont de nombreux habitants en situation de handicap. Le rapport américain sur les droits humains indique que des dizaines de résidents trouvent refuge à l'église Saint-Yves dans des conditions d'accessibilité, de ventilation et d'assainissement insuffisantes. L'événement montre comment les déplacements répétés aggravent l'exclusion des personnes ayant besoin d'un soutien particulier. Il souligne également les limites de l'accès humanitaire lorsque des groupes armés contrôlent les rues voisines.",
    "sources": [
      [
        "U.S. Department of State, 2021 human rights report",
        "https://www.ecoi.net/en/document/2071140.html"
      ]
    ]
  },
  {
    "slug": "haiti-2021-constitutional-referendum-postponed",
    "date": "2021-06-07",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "politics",
      "education"
    ],
    "location": "Port-au-Prince",
    "people": [
      "jovenel-moise"
    ],
    "title": "Proposed constitutional referendum is postponed during COVID-19 resurgence",
    "ft": "Le référendum constitutionnel prévu est reporté face à la recrudescence de la COVID-19",
    "summary": "The electoral authority delays a June 27 vote amid an intensified health emergency and debate over its legality.",
    "fs": "Le Conseil électoral reporte le scrutin prévu le 27 juin alors que la crise sanitaire et la contestation juridique se poursuivent.",
    "body": "On 7 June 2021, Haiti's Provisional Electoral Council postponed the constitutional referendum planned for 27 June, citing the worsening COVID-19 situation and renewed public-health emergency measures. Officials said a new date might be announced later. The proposal itself had provoked objections among lawyers and opposition groups who argued that the 1987 constitution prohibited a referendum as a route to constitutional amendment. The draft also involved major institutional changes, including to the structure of the legislature and executive. The postponement took place before President Moïse's assassination in July and did not amount to approval or rejection of the proposed constitution. It demonstrates the collision of pandemic governance, contested political authority and constitutional reform.",
    "fb": "Le 7 juin 2021, le Conseil électoral provisoire reporte le référendum constitutionnel prévu le 27 juin en raison de la recrudescence de la COVID-19 et de la prolongation de l'urgence sanitaire. Les autorités évoquent la possibilité d'un nouveau calendrier. Le projet suscite déjà des objections juridiques : des avocats et des opposants estiment que la Constitution de 1987 interdit la modification du texte par référendum. Il envisage également de profondes transformations des institutions. Le report intervient avant l'assassinat de Jovenel Moïse et ne constitue ni une adoption ni un rejet du projet.",
    "sources": [
      [
        "Haitian Government, communiqué on referendum postponement, 7 June 2021",
        "https://communication.gouv.ht/in/covid-19-le-cep-reporte-le-referendum-du-27-juin-en-attendant-toutes-decisions-des-autorites-sanitaires/"
      ],
      [
        "UN Secretary-General, report S/2021/559",
        "https://www.haitidocs.org/doc/binuh-sg-reports-2021-report-secretary-general"
      ]
    ]
  },
  {
    "slug": "haiti-2021-world-cup-qualifying-canada",
    "date": "2021-06-15",
    "precision": "day",
    "dimension": "abroad",
    "categories": [
      "sports",
      "abroad"
    ],
    "location": "Bridgeview, Illinois, United States",
    "countries": [
      "United States",
      "Canada"
    ],
    "title": "Haiti's men's team exits 2022 World Cup qualifying after Canada series",
    "ft": "L'équipe masculine d'Haïti quitte les éliminatoires du Mondial après la confrontation avec le Canada",
    "summary": "A 3–0 defeat in the return leg ends Haiti's bid to reach the final CONCACAF qualifying round.",
    "fs": "Une défaite 3 à 0 au match retour met fin au parcours haïtien vers le dernier tour des qualifications.",
    "body": "On 15 June 2021, Haiti's men's national football team lost 3–0 to Canada in Bridgeview, Illinois, ending the two-leg World Cup qualifying series 4–0 on aggregate. The match was played in the United States because of the pandemic-era arrangements for international fixtures. Haiti had lost the first leg 1–0 in Port-au-Prince. The team's attempt to reach the CONCACAF final qualifying round therefore ended despite a competitive first half in the return fixture. Match records should preserve the exact dates, scoreline and aggregate result, while broader analysis can examine player development, training infrastructure and how insecurity affects a national team's ability to compete and host matches.",
    "fb": "Le 15 juin 2021, la sélection masculine d'Haïti s'incline 3 à 0 face au Canada à Bridgeview, dans l'Illinois. Sur l'ensemble des deux rencontres, le Canada s'impose 4 à 0 et met fin au parcours haïtien vers le dernier tour des qualifications pour la Coupe du monde. Le match retour est organisé aux États-Unis, dans le contexte des restrictions sanitaires. Le premier match s'était soldé par une défaite haïtienne de 1 à 0 à Port-au-Prince. Les archives doivent conserver les résultats et les dates précises, tout en analysant les défis sportifs et logistiques de la sélection.",
    "sources": [
      [
        "CONCACAF, Canada down Haiti to reach Final Round",
        "https://www.concacaf.com/news/canada-down-haiti-to-reach-final-round"
      ]
    ]
  },
  {
    "slug": "haiti-2021-freda-cannes",
    "date": "2021-07",
    "precision": "month",
    "dimension": "abroad",
    "categories": [
      "arts",
      "culture",
      "abroad"
    ],
    "location": "Cannes, France",
    "countries": [
      "France",
      "Benin",
      "Haiti"
    ],
    "people": [
      "gessica-geneus"
    ],
    "title": "Géssica Généus brings the Haitian feature Freda to Cannes",
    "ft": "Géssica Généus présente le film haïtien Freda au Festival de Cannes",
    "summary": "The Creole-language feature is selected for Un Certain Regard, centering a young woman's decisions amid insecurity in Port-au-Prince.",
    "fs": "Le long métrage en créole intègre Un Certain Regard et raconte les choix d'une jeune femme confrontée à l'insécurité.",
    "body": "In July 2021, Haitian director Géssica Généus presented her first fiction feature film, Freda, in the Un Certain Regard selection at the Cannes Film Festival. Set in Port-au-Prince, the story follows a young woman and her family as they confront insecurity, economic uncertainty and differing ideas about leaving Haiti. The film was made through production partnerships involving Haiti, Benin and France and features Haitian actors and Haitian Creole dialogue. Généus told Cannes that the film grew from questions of trauma, rebuilding and the possibilities of creating a future at home. Its selection brought Haitian cinema to an important international platform and deserves to be placed alongside the year's political and humanitarian history, not eclipsed by it.",
    "fb": "En juillet 2021, la réalisatrice haïtienne Géssica Généus présente son premier long métrage de fiction, Freda, dans la section Un Certain Regard du Festival de Cannes. Située à Port-au-Prince, l'histoire suit une jeune femme et sa famille face à l'insécurité, aux difficultés économiques et au choix de rester ou de partir. Le film repose sur des partenariats de production entre Haïti, le Bénin et la France et met en valeur des interprètes haïtiens et la langue créole. Dans un entretien à Cannes, Généus évoque le traumatisme et la reconstruction. Cette sélection contribue au rayonnement international du cinéma haïtien.",
    "sources": [
      [
        "Festival de Cannes, official selection: Freda",
        "https://www.festival-cannes.com/en/f/freda/"
      ],
      [
        "Festival de Cannes, interview with Géssica Généus, 14 July 2021",
        "https://www.festival-cannes.com/en/2021/freda-as-seen-by-gessica-geneus/"
      ]
    ]
  },
  {
    "slug": "haiti-2021-covax-shipment",
    "date": "2021-07-14",
    "precision": "day",
    "dimension": "foreign",
    "categories": [
      "education",
      "world",
      "society"
    ],
    "location": "Port-au-Prince",
    "countries": [
      "United States",
      "Haiti"
    ],
    "title": "Haiti receives its first 500,000 COVID-19 vaccine doses through COVAX",
    "ft": "Haïti reçoit ses 500 000 premières doses de vaccins contre la COVID-19 via COVAX",
    "summary": "The first vaccine shipment, donated by the United States, arrives months after many other countries began immunizing.",
    "fs": "Un premier lot de vaccins donné par les États-Unis arrive plusieurs mois après le début des campagnes ailleurs.",
    "body": "On 14 July 2021, a shipment of 500,000 doses of Moderna COVID-19 vaccine, donated by the United States through the COVAX mechanism, arrived in Haiti. PAHO and UNICEF described the delivery as the country's first arrival of COVID-19 vaccine supplies, during a renewed wave of illness and a political crisis following the president's assassination. The milestone exposed the unequal pace of global vaccine access. Delivering doses, however, was only the start of the work. Haitian health authorities and partners needed to store, transport and administer the vaccines under difficult security and infrastructure conditions and address questions and concerns from residents.",
    "fb": "Le 14 juillet 2021, Haïti reçoit 500 000 doses de vaccin Moderna contre la COVID-19, données par les États-Unis via le mécanisme COVAX. L'OPS et l'UNICEF présentent cette livraison comme le premier arrivage de vaccins dans le pays, alors que les contaminations augmentent et que l'assassinat du président a aggravé la crise politique. Cet événement illustre les inégalités d'accès mondial aux vaccins. L'arrivée des doses ne suffit pas : les autorités sanitaires doivent assurer leur conservation, leur transport et leur administration dans des conditions difficiles et répondre aux interrogations de la population.",
    "sources": [
      [
        "PAHO, Haiti receives 500,000 vaccines, 14 July 2021",
        "https://www.paho.org/en/news/14-7-2021-haiti-receives-500000-vaccines-donated-united-states-through-covax"
      ],
      [
        "UNICEF, arrival of first vaccines",
        "https://www.unicef.org/press-releases/statement-arrival-first-batch-covid-19-vaccines-haiti"
      ]
    ]
  },
  {
    "slug": "haiti-2021-first-covid-vaccinations",
    "date": "2021-07-16",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "education",
      "society"
    ],
    "location": "Hôpital Universitaire de Paix, Port-au-Prince",
    "title": "Haiti begins administering COVID-19 vaccines",
    "ft": "Haïti commence la vaccination contre la COVID-19",
    "summary": "Health workers and older people receive Moderna doses at the Hôpital Universitaire de Paix.",
    "fs": "Des professionnels de santé et des personnes âgées reçoivent les premières doses Moderna à l'Hôpital Universitaire de Paix.",
    "body": "On 16 July 2021, Haiti's Ministry of Public Health began its first COVID-19 vaccination sessions at the Hôpital Universitaire de Paix in Port-au-Prince, less than two days after the arrival of 500,000 donated vaccine doses. PAHO staff observed the initial vaccinations, including health workers and older people. The campaign was intended to extend to additional facilities and departments. The rollout depended on cold-chain logistics, communications and the safety of teams and patients, all of which were strained by insecurity and the health emergency. The beginning of vaccinations did not mean that most Haitians were already protected; coverage and access were continuing challenges.",
    "fb": "Le 16 juillet 2021, le ministère de la Santé publique organise ses premières séances de vaccination contre la COVID-19 à l'Hôpital Universitaire de Paix de Port-au-Prince, moins de deux jours après l'arrivée de 500 000 doses. Des membres du personnel médical et des personnes âgées reçoivent les premières injections en présence d'observateurs de l'OPS. La campagne doit ensuite s'étendre à d'autres établissements et départements. Sa réussite dépend de la chaîne du froid, de l'information du public et de la sécurité des équipes. Le début de la vaccination ne signifie pas que la majorité de la population est déjà protégée.",
    "sources": [
      [
        "PAHO, Haiti starts COVID-19 vaccinations, 17 July 2021",
        "https://www.paho.org/en/news/17-7-2021-start-covid-19-vaccination-campaign-haiti-first-persons-vaccinated-less-48-hours"
      ]
    ]
  },
  {
    "slug": "haiti-2021-us-delegation-succession",
    "date": "2021-07-11",
    "precision": "day",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "Port-au-Prince",
    "countries": [
      "United States",
      "Haiti"
    ],
    "people": [
      "claude-joseph",
      "ariel-henry"
    ],
    "title": "U.S. delegation meets Haitian leaders after the presidential assassination",
    "ft": "Une délégation américaine rencontre des responsables haïtiens après l'assassinat présidentiel",
    "summary": "U.S. security, justice and diplomatic representatives discuss assistance and political succession with competing Haitian leaders.",
    "fs": "Des représentants américains évoquent l'assistance et la succession politique avec des responsables haïtiens.",
    "body": "On 11 July 2021, a U.S. interagency delegation traveled to Haiti in response to the Haitian government's request for assistance after the assassination of President Jovenel Moïse. The delegation met with the Haitian National Police and with acting Prime Minister Claude Joseph, prime minister-designate Ariel Henry and Senate President Joseph Lambert. An official U.S. statement framed the visit as support for investigation, security and dialogue. Haiti's constitutional succession was unusually difficult because most lawmakers' terms had expired, leaving no functioning legislature to resolve the vacancy under the normal procedures. This visit is a documented example of foreign diplomatic involvement in a domestic political crisis; it should be analyzed in relation to Haitian actors' competing positions.",
    "fb": "Le 11 juillet 2021, une délégation interministérielle américaine se rend en Haïti après une demande d'assistance du gouvernement haïtien à la suite de l'assassinat de Jovenel Moïse. Elle rencontre la Police nationale ainsi que Claude Joseph, Ariel Henry et le président du Sénat Joseph Lambert. Le communiqué américain présente la visite comme un appui à l'enquête, à la sécurité et au dialogue. La succession est compliquée par l'absence d'un Parlement en mesure de fonctionner normalement. Cet épisode documente une intervention diplomatique extérieure dans une crise politique intérieure, à analyser avec les positions des acteurs haïtiens.",
    "sources": [
      [
        "U.S. National Security Council, delegation statement, 12 July 2021",
        "https://www.presidency.ucsb.edu/documents/statement-nsc-spokesperson-emily-horne-us-government-delegation-haiti"
      ],
      [
        "Congressional Research Service, succession report",
        "https://www.everycrsreport.com/reports/IN11699.html"
      ]
    ]
  },
  {
    "slug": "haiti-2021-ariel-henry-government",
    "date": "2021-07-20",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince",
    "people": [
      "ariel-henry",
      "claude-joseph"
    ],
    "title": "Ariel Henry takes office as prime minister after the assassination",
    "ft": "Ariel Henry prend ses fonctions de Premier ministre après l'assassinat",
    "summary": "The prime minister-designate forms a government after a contested interim leadership period.",
    "fs": "Le Premier ministre désigné forme un gouvernement après une période de direction provisoire contestée.",
    "body": "On 20 July 2021, Ariel Henry formally took office as Haiti's prime minister. President Jovenel Moïse had designated him shortly before being assassinated on 7 July, but Henry had not been sworn in at the time of the killing. Interim Prime Minister Claude Joseph initially led the Council of Ministers and later agreed to cede the office. The transition followed negotiations among Haitian officials and diplomatic engagement by international actors. With no functioning parliament and no elected president, the new government operated without the ordinary electoral and legislative foundations of a stable constitutional system. Henry's assumption of office represented an interim political arrangement, not a presidential election.",
    "fb": "Le 20 juillet 2021, Ariel Henry entre officiellement en fonctions comme Premier ministre. Jovenel Moïse l'avait désigné peu avant son assassinat du 7 juillet, mais il n'avait pas encore prêté serment au moment du meurtre. Claude Joseph, alors Premier ministre intérimaire, dirige d'abord le Conseil des ministres, puis lui cède la place. La transition suit des négociations entre responsables haïtiens et des interventions diplomatiques étrangères. Sans Parlement fonctionnel ni président élu, le nouveau gouvernement exerce ses responsabilités dans un cadre institutionnel fragile. Il s'agit d'un arrangement provisoire et non d'un scrutin présidentiel.",
    "sources": [
      [
        "UK House of Lords Library, Haiti political upheaval and natural disaster",
        "https://lordslibrary.parliament.uk/haiti-political-upheaval-and-natural-disaster/"
      ],
      [
        "Congressional Research Service, Haitian succession",
        "https://www.everycrsreport.com/reports/IN11699.html"
      ]
    ]
  },
  {
    "slug": "haiti-2021-tokyo-olympics",
    "date": "2021-07-23",
    "precision": "day",
    "dimension": "abroad",
    "categories": [
      "sports",
      "abroad"
    ],
    "location": "Tokyo, Japan",
    "countries": [
      "Japan",
      "Haiti"
    ],
    "title": "Haitian athletes participate in the Tokyo Olympic Games",
    "ft": "Des athlètes haïtiens participent aux Jeux olympiques de Tokyo",
    "summary": "Haiti sends a small team to the Olympics delayed from 2020 to 2021 by the COVID-19 pandemic.",
    "fs": "Haïti présente une petite délégation aux Jeux reportés de 2020 à 2021 en raison de la pandémie.",
    "body": "The Tokyo Olympic Games opened on 23 July 2021 after being postponed for a year because of COVID-19. Haiti was represented by athletes in disciplines including judo, boxing, swimming and athletics. Contemporary Haitian coverage identified competitors such as judoka Sabiana Anestor, boxer Darrelle Valsaint Jr., swimmers Emilie Grand'Pierre and Davidson Vincent, and hurdler Mulern Jean. The team trained and competed while Haiti confronted political instability, the pandemic and insecurity. The Olympic participation belongs in the national sporting record, even in the absence of a medal. Researchers should verify the final roster and results against the Olympic records, since preliminary athlete lists published before the Games can change.",
    "fb": "Les Jeux olympiques de Tokyo ouvrent le 23 juillet 2021 après avoir été reportés d'un an à cause de la pandémie. Haïti y est représentée dans plusieurs disciplines, notamment le judo, la boxe, la natation et l'athlétisme. La presse haïtienne cite des sportifs comme Sabiana Anestor, Darrelle Valsaint Jr., Emilie Grand'Pierre, Davidson Vincent et Mulern Jean. Leur participation intervient alors que le pays connaît de graves crises politiques et sanitaires. Cette présence mérite d'être documentée même sans médaille. Les listes préliminaires doivent être confrontées aux résultats officiels, car les effectifs peuvent changer avant la compétition.",
    "sources": [
      [
        "HaitiLibre, Haitian Olympic delegation and schedule, July 2021",
        "https://www.haitilibre.com/en/news-34263-haiti-tokyo-2021-6-haitian-athletes-in-competition-calendar.html"
      ],
      [
        "ITF, Tokyo Olympic opening ceremony",
        "https://www.itftennis.com/en/news-and-media/articles/naomi-osaka-lights-olympic-cauldron-to-launch-tokyo-2020-games/"
      ]
    ]
  },
  {
    "slug": "haiti-2021-naomi-osaka-olympic-flame",
    "date": "2021-07-23",
    "precision": "day",
    "dimension": "abroad",
    "categories": [
      "sports",
      "abroad",
      "culture"
    ],
    "location": "Tokyo, Japan",
    "countries": [
      "Japan",
      "Haiti"
    ],
    "people": [
      "naomi-osaka"
    ],
    "title": "Naomi Osaka, daughter of a Haitian father, lights the Olympic cauldron",
    "ft": "Naomi Osaka, fille d'un père haïtien, allume la vasque olympique",
    "summary": "The Japanese tennis champion with Haitian family roots serves as the final Olympic torchbearer at Tokyo 2020.",
    "fs": "La championne japonaise de tennis d'ascendance haïtienne est la dernière porteuse de la flamme à Tokyo.",
    "body": "At the Olympic opening ceremony on 23 July 2021, tennis champion Naomi Osaka lit the ceremonial cauldron in Tokyo. Osaka, born in Japan to a Japanese mother and Haitian father, represented Japan at the Games and had become a global sporting figure through her Grand Slam victories. Her role as final torchbearer attracted attention among communities connected to both countries. It is important to identify her sporting nationality accurately: she competed for Japan, not Haiti. Her experience nevertheless belongs in a history of the Haitian diaspora and descendants of Haitian families whose achievements circulate internationally across multiple identities.",
    "fb": "Le 23 juillet 2021, la joueuse de tennis Naomi Osaka allume la vasque olympique lors de la cérémonie d'ouverture à Tokyo. Née au Japon d'une mère japonaise et d'un père haïtien, elle représente le Japon dans les compétitions et connaît déjà un grand succès international. Sa présence comme dernière porteuse de la flamme est remarquée par des communautés liées aux deux pays. Il faut préciser sa nationalité sportive : elle concourt pour le Japon, non pour Haïti. Son parcours éclaire néanmoins les contributions internationales des descendants de familles haïtiennes et la diversité de leurs appartenances.",
    "sources": [
      [
        "International Tennis Federation, Naomi Osaka lights Olympic cauldron",
        "https://www.itftennis.com/en/news-and-media/articles/naomi-osaka-lights-olympic-cauldron-to-launch-tokyo-2020-games/"
      ],
      [
        "NBC Olympics, Osaka's heritage and opening ceremony",
        "https://www.nbcolympics.com/news/naomi-osaka-lights-olympic-cauldron-tokyo-opening-ceremony?chrcontext=ktvz"
      ]
    ]
  }
];

export const historical2021: HistEvent[] = entries.map((entry) => ({
 slug: entry.slug, title: entry.title, date: entry.date,
 precision: entry.precision, dimension: entry.dimension,
 categories: entry.categories, location: entry.location,
 countries: entry.countries, people: entry.people,
 summary: entry.summary, body: entry.body,
 fr: { title: entry.ft, summary: entry.fs, body: entry.fb },
 sources: entry.sources.map(([title, url]) => ({ title, url })),
 status: "documented",
 editorial: {
   verification: "corroborated",
   dateBasis: entry.precision === "day" ? "documented date" : entry.precision === "month" ? "documented month, not a specific day" : "year of documented development",
   reviewedOn: "2026-11-01",
   note: "English and French summaries based on linked sources; casualty figures and interpretations attributed to their reporting periods.",
 },
}));
