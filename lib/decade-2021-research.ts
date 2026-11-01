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
  },
  {
    "slug": "haiti-2021-storm-grace-after-earthquake",
    "date": "2021-08-16",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "environment",
      "society"
    ],
    "location": "South, Nippes and Grand'Anse, Haiti",
    "title": "Tropical Depression Grace floods earthquake-affected communities",
    "ft": "La dépression tropicale Grace inonde des zones frappées par le séisme",
    "summary": "Heavy rainfall and flooding compound the emergency just two days after the August 14 earthquake.",
    "fs": "De fortes pluies et des inondations aggravent l'urgence deux jours après le séisme du 14 août.",
    "body": "On 16 August 2021, Tropical Depression Grace crossed southwestern Haiti, bringing intense rain and flooding to an area already devastated by the magnitude 7.2 earthquake of 14 August. Families living in damaged houses or makeshift shelters faced additional exposure, and heavy rain complicated transportation, searches for survivors, medical care and relief distribution. PAHO and other humanitarian agencies warned of increased health and sanitation risks as local systems struggled to meet immediate needs. This was a compound disaster: the earthquake and subsequent rainfall affected the same communities but were separate hazards. A reliable chronology should distinguish the meteorological date, the earthquake's earlier damage and the different phases of the response.",
    "fb": "Le 16 août 2021, la dépression tropicale Grace traverse le sud-ouest d'Haïti avec de fortes pluies et des inondations, seulement deux jours après le séisme de magnitude 7,2. Les familles installées dans des maisons endommagées ou des abris provisoires sont exposées à de nouveaux dangers. Les pluies compliquent les déplacements, les secours, les soins et la distribution d'aide. Les organisations sanitaires signalent aussi des risques liés à l'eau et à l'assainissement. Le tremblement de terre et Grace constituent deux phénomènes distincts dont les effets se cumulent dans les mêmes communes. La chronologie doit distinguer les dates et les phases de l'intervention.",
    "sources": [
      [
        "PAHO, natural hazards bulletin, 16 August 2021",
        "https://www.paho.org/en/natural-hazards-monitoring/natural-hazards-monitoring-16-august-2021"
      ],
      [
        "UNICEF, Haiti earthquake situation reports",
        "https://www.unicef.org/lac/en/reports/earthquake-haiti-humanitarian-situation-reports"
      ]
    ]
  },
  {
    "slug": "haiti-2021-haitian-earthquake-aid-recovery",
    "date": "2021-08",
    "precision": "month",
    "dimension": "inside",
    "categories": [
      "society",
      "education",
      "environment"
    ],
    "location": "Les Cayes, Jérémie, Nippes and surrounding communities",
    "title": "Haitian rescue teams and communities organize relief after the earthquake",
    "ft": "Les équipes de secours et les communautés haïtiennes organisent l'aide après le séisme",
    "summary": "Local authorities, residents and humanitarian workers coordinate search, shelter, medical and water assistance after August 14.",
    "fs": "Les autorités locales, habitants et équipes humanitaires coordonnent les secours, les soins, l'eau et les abris après le 14 août.",
    "body": "In the days following the 14 August 2021 earthquake, Haitian civil-protection staff, healthcare workers, community members and local organizations searched for survivors, provided first aid and attempted to restore essential services. The immediate response took place amid damaged roads, healthcare facilities, schools and water systems, with Tropical Depression Grace adding rain and flooding. PAHO reported extensive damage to health facilities, while UNICEF and other partners supported mobile medical services, shelter, clean water and assistance to children. International organizations supplied logistics and funding, but the first hours and everyday recovery work also depended on Haitian personnel and neighbors. The recovery effort extended well beyond the initial emergency and should be followed through reconstruction records and local testimony.",
    "fb": "Dans les jours suivant le séisme du 14 août 2021, la protection civile haïtienne, les soignants, les habitants et des organisations locales recherchent des survivants, assurent les premiers soins et tentent de rétablir les services essentiels. Les routes, les hôpitaux, les écoles et les réseaux d'eau sont endommagés, tandis que Grace apporte de nouvelles pluies. L'OPS signale d'importants dégâts sanitaires ; l'UNICEF et d'autres partenaires appuient les soins mobiles, les abris et l'accès à l'eau. L'aide internationale est importante, mais les premières interventions reposent aussi sur les personnels et les voisins haïtiens. La reconstruction se prolonge bien au-delà de l'urgence immédiate.",
    "sources": [
      [
        "PAHO, Haiti earthquake August 2021",
        "https://www.paho.org/en/haiti-earthquake-august-2021"
      ],
      [
        "UNICEF, earthquake situation and humanitarian response",
        "https://www.unicef.org/lac/en/reports/earthquake-haiti-humanitarian-situation-reports"
      ]
    ]
  },
  {
    "slug": "haiti-2021-earthquake-schools-damage",
    "date": "2021-09",
    "precision": "month",
    "dimension": "inside",
    "categories": [
      "education",
      "society",
      "environment"
    ],
    "location": "Sud, Nippes and Grand'Anse departments",
    "title": "Assessments reveal widespread damage to schools after the August earthquake",
    "ft": "Les évaluations révèlent d'importants dégâts dans les écoles après le séisme d'août",
    "summary": "Education authorities and humanitarian agencies document major classroom losses before the new academic year.",
    "fs": "Les autorités éducatives et les organisations humanitaires dressent le bilan des établissements endommagés avant la rentrée.",
    "body": "During September 2021, Haitian education officials and UNICEF assessed the effects of the August earthquake on schools in Sud, Nippes and Grand'Anse. A UNICEF situation report dated 15 September recorded 906 schools partly or completely destroyed among those assessed at that time, while later surveys reported larger totals as more areas were reached. Damaged classrooms, unsafe buildings, lost teaching materials and disrupted transport put learning at risk, especially for children already affected by the pandemic and insecurity. These are dated assessment figures, not final totals for every school in the region. The damage made safe reopening and reconstruction major concerns for teachers, families and the education authorities.",
    "fb": "En septembre 2021, les autorités éducatives et l'UNICEF évaluent les dégâts causés aux écoles du Sud, des Nippes et de la Grand'Anse par le séisme d'août. Un rapport du 15 septembre recense 906 établissements partiellement ou totalement détruits parmi les écoles évaluées à ce moment ; des enquêtes ultérieures augmentent ce nombre à mesure que d'autres communes sont visitées. Salles de classe dangereuses, matériel perdu et transports perturbés compromettent l'apprentissage des enfants déjà affectés par la pandémie et l'insécurité. Ces bilans sont datés et ne doivent pas être présentés comme définitifs.",
    "sources": [
      [
        "UNICEF, earthquake humanitarian situation reports",
        "https://www.unicef.org/lac/en/reports/earthquake-haiti-humanitarian-situation-reports"
      ],
      [
        "UNICEF, early assessment of damaged schools",
        "https://www.unicef.org/press-releases/early-assessments-show-extensive-quake-damage-schools-haiti"
      ]
    ]
  },
  {
    "slug": "haiti-2021-september-political-accord",
    "date": "2021-09-11",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Port-au-Prince",
    "people": [
      "ariel-henry"
    ],
    "title": "Ariel Henry signs political agreement on interim governance",
    "ft": "Ariel Henry signe un accord politique sur la gouvernance intérimaire",
    "summary": "Representatives of political parties and civil society sign a transition agreement, while other groups continue to dispute the process.",
    "fs": "Des représentants de partis et de la société civile signent un accord de transition, dont le processus reste contesté.",
    "body": "On 11 September 2021, Prime Minister Ariel Henry and representatives of political parties and civil-society organizations signed a political agreement concerning interim governance and the preparation of elections. A Haitian government communiqué described the arrangement as a step toward restoring institutions and creating a more stable transitional framework after President Moïse's assassination. The agreement was not endorsed by every political or civic group, and it did not immediately resolve disputes about legitimacy, elections or insecurity. The signatures and the agreement's provisions should be distinguished from implementation. This milestone is relevant to the continued evolution of governing arrangements through 2022 and the later transition debates.",
    "fb": "Le 11 septembre 2021, le Premier ministre Ariel Henry et des représentants de partis politiques et d'organisations de la société civile signent un accord concernant la gouvernance intérimaire et la préparation des élections. Un communiqué du gouvernement le présente comme une étape vers le rétablissement des institutions après l'assassinat de Jovenel Moïse. Tous les acteurs politiques et associatifs ne soutiennent cependant pas ce dispositif, qui ne règle pas immédiatement les questions de légitimité, de sécurité et d'organisation du scrutin. Il faut distinguer les signatures, le contenu du texte et sa mise en application. Cet accord joue un rôle dans les débats sur la transition des années suivantes.",
    "sources": [
      [
        "Haitian Government, interim governance agreement of 11 September 2021",
        "https://communication.gouv.ht/in/signature-historique-de-l-accord-politique-pour-une-gouvernance-apaisee-et-efficace-de-la-periode-interimaire/"
      ],
      [
        "BINUH, UN Secretary-General's September 2021 report",
        "https://www.haitidocs.org/doc/binuh-sg-reports-2021-2?lang=fr"
      ]
    ]
  },
  {
    "slug": "haiti-2021-schools-reopen-south-october",
    "date": "2021-10-04",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "education",
      "society",
      "environment"
    ],
    "location": "South, Nippes and Grand'Anse, Haiti",
    "title": "Children begin returning to school in earthquake-affected departments",
    "ft": "Les enfants reprennent progressivement l'école dans les départements frappés par le séisme",
    "summary": "A delayed academic reopening begins amid extensive damage to school buildings and continuing recovery work.",
    "fs": "Une rentrée scolaire retardée commence malgré les dégâts dans les établissements et les besoins de reconstruction.",
    "body": "On 4 October 2021, students began a gradual return to classes in Haiti's southwestern departments following the August earthquake. UNICEF reported that roughly 70 percent of schools in the affected region were damaged or destroyed and that around 300,000 children were expected to return to school over time. Temporary learning spaces, building assessments, teaching materials and school meals were important parts of the response. The reopening was not uniform: some children had safe classrooms, while others remained in temporary accommodation or attended facilities in need of repair. The year illustrates how disasters affect education for months or years after the immediate emergency, particularly where households already struggle with poverty and insecurity.",
    "fb": "Le 4 octobre 2021, la rentrée scolaire reprend progressivement dans les départements du sud-ouest touchés par le séisme d'août. L'UNICEF indique qu'environ 70 % des écoles de la zone sont endommagées ou détruites et que quelque 300 000 enfants doivent retrouver peu à peu le chemin des classes. Les espaces provisoires, les évaluations des bâtiments, les fournitures et les cantines jouent un rôle important. La reprise reste inégale : certains élèves disposent de salles sûres, tandis que d'autres fréquentent des installations temporaires ou attendent des réparations. Les conséquences éducatives d'une catastrophe se prolongent bien au-delà de la phase de secours.",
    "sources": [
      [
        "UNICEF, back to school in earthquake-affected Haiti, 4 October 2021",
        "https://www.unicef.org/press-releases/earthquake-leaves-nearly-70-cent-schools-damaged-or-destroyed-southwestern-haiti"
      ],
      [
        "UN Haiti, rehabilitated schools welcome pupils, December 2021",
        "https://haiti.un.org/en/164433-rehabilitated-schools-welcome-back-students-after-earthquake"
      ]
    ]
  },
  {
    "slug": "haiti-2021-binuh-security-council-renewal",
    "date": "2021-10-15",
    "precision": "day",
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
    "title": "UN Security Council extends BINUH's mandate into 2022",
    "ft": "Le Conseil de sécurité prolonge le mandat du BINUH jusqu'en 2022",
    "summary": "Resolution 2600 renews the political mission and requests a review of its role during Haiti's worsening crisis.",
    "fs": "La résolution 2600 reconduit la mission politique et demande une évaluation de son rôle dans la crise.",
    "body": "On 15 October 2021, the UN Security Council unanimously adopted resolution 2600, renewing the mandate of the United Nations Integrated Office in Haiti (BINUH) through 15 July 2022. The resolution called for a review of the mission's responsibilities and emphasized support for political dialogue, human rights, rule of law and elections. The measure came months after the assassination of Haiti's president and amid gang violence, displacement and the aftermath of the August earthquake. BINUH was a political mission, not a replacement government or UN peacekeeping force. Its renewal records continued international involvement while leaving responsibility for Haiti's public security and political institutions primarily with Haitian authorities.",
    "fb": "Le 15 octobre 2021, le Conseil de sécurité de l'ONU adopte à l'unanimité la résolution 2600, qui renouvelle le mandat du Bureau intégré des Nations unies en Haïti (BINUH) jusqu'au 15 juillet 2022. Le texte demande une évaluation des missions du Bureau et insiste sur le dialogue politique, les droits humains, l'état de droit et les élections. La décision intervient après l'assassinat du président et dans un contexte de violence, de déplacements et de reconstruction après le séisme. Le BINUH est une mission politique et ne remplace ni le gouvernement ni la police haïtienne.",
    "sources": [
      [
        "United Nations Digital Library, Security Council resolution 2600 (2021)",
        "https://digitallibrary.un.org/record/3944408?ln=en"
      ]
    ]
  },
  {
    "slug": "haiti-2021-400-mawozo-missionaries-kidnapped",
    "date": "2021-10-16",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "society",
      "culture",
      "politics",
      "world"
    ],
    "location": "Near Croix-des-Bouquets, Ouest",
    "countries": [
      "United States",
      "Canada"
    ],
    "title": "Seventeen North American missionaries are abducted in Haiti",
    "ft": "Dix-sept missionnaires nord-américains sont enlevés en Haïti",
    "summary": "A kidnapping associated with the 400 Mawozo gang brings new international attention to the wider hostage crisis.",
    "fs": "Un enlèvement attribué au groupe 400 Mawozo attire l'attention mondiale sur la crise des prises d'otages.",
    "body": "On 16 October 2021, seventeen members of a Christian missionary group, sixteen U.S. citizens and one Canadian citizen, were abducted near Port-au-Prince. U.S. prosecutors later alleged that members of the 400 Mawozo gang carried out the kidnapping and demanded large ransoms. Several captives were released later in the year and others escaped in December, according to the U.S. Department of Justice. The case received extensive international coverage. Thousands of Haitian residents also faced kidnapping threats, extortion and movement restrictions that often received less attention abroad. A careful history of the event should distinguish allegations against individual suspects from convictions and should place the hostage crisis within broader conditions of public insecurity.",
    "fb": "Le 16 octobre 2021, dix-sept membres d'un groupe missionnaire chrétien, seize citoyens américains et une personne canadienne, sont enlevés près de Port-au-Prince. Des procureurs américains attribuent ensuite l'enlèvement à des membres du groupe 400 Mawozo et évoquent des demandes de rançon importantes. Certains otages sont libérés, tandis que d'autres s'échappent en décembre, selon le département américain de la Justice. L'affaire attire une grande attention internationale, alors que de nombreux habitants haïtiens subissent aussi des enlèvements et des extorsions. Il importe de distinguer les accusations visant des suspects des décisions judiciaires et de replacer le cas dans l'insécurité générale.",
    "sources": [
      [
        "U.S. Department of Justice, kidnapping investigation",
        "https://www.justice.gov/usao-dc/pr/haitian-gang-member-charged-hostage-taking-kidnapping-16-us-missionaries-fall-2021"
      ]
    ]
  },
  {
    "slug": "haiti-2021-october-november-fuel-disruption",
    "date": "2021-10",
    "precision": "month",
    "dimension": "inside",
    "categories": [
      "economy",
      "society",
      "politics",
      "education"
    ],
    "location": "Port-au-Prince and nationwide supply routes",
    "title": "Gang blockade interrupts fuel distribution and essential services",
    "ft": "Le blocage des carburants perturbe la distribution et les services essentiels",
    "summary": "A fuel distribution disruption linked to armed groups paralyzes transport, hospitals and economic activity in October and November.",
    "fs": "Un blocage lié aux groupes armés paralyse les transports, les soins et l'activité économique en octobre et novembre.",
    "body": "In October and November 2021, armed groups affiliated with the G9 coalition interfered with distribution from major fuel terminals in the Port-au-Prince area, sharply reducing supplies across Haiti. Hospitals and water-pumping systems dependent on generators struggled to operate, and transport costs and availability disrupted schools, commerce and food distribution. The blockade was connected to political demands, including calls for Prime Minister Ariel Henry to resign. Fuel shipments eventually resumed, but the episode demonstrated how control of a few strategic supply routes could affect communities far from the armed clashes. This disruption must be distinguished from the later Varreux blockade in 2022, which followed new fuel-price protests and lasted through a separate period.",
    "fb": "En octobre et novembre 2021, des groupes armés liés à la coalition G9 perturbent la distribution depuis les principaux terminaux de carburant de la capitale. La pénurie se fait sentir dans tout le pays : hôpitaux, pompes à eau, transports, écoles, commerces et distribution alimentaire sont touchés. Le blocage s'accompagne de revendications politiques, notamment d'appels au départ du Premier ministre Ariel Henry. La reprise de certaines livraisons ne fait pas disparaître la vulnérabilité des réseaux d'approvisionnement. Il faut distinguer cet épisode du nouveau blocage du terminal de Varreux en 2022, survenu dans un contexte différent.",
    "sources": [
      [
        "UN Haiti, humanitarian access and fuel supply, review of 2021–22",
        "https://haiti.un.org/en/189876-haiti-impact-deteriorating-security-situation-humanitarian-access-background-note-july-2022"
      ],
      [
        "Council on Foreign Relations, Haiti conflict chronology",
        "https://www.cfr.org/global-conflict-tracker/conflict/instability-haiti"
      ],
      [
        "UN Haiti, December 2021 fuel truck disaster report",
        "https://haiti.un.org/en/165533-haiti-explosion-fuel-truck-cap-haitien-situation-report-no-1-14-december-2021"
      ]
    ]
  },
  {
    "slug": "haiti-2021-cap-haitien-fuel-explosion",
    "date": "2021-12-14",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "environment",
      "society",
      "education",
      "economy"
    ],
    "location": "Cap-Haïtien, Nord",
    "title": "Fuel truck explosion kills dozens in Cap-Haïtien",
    "ft": "L'explosion d'un camion-citerne tue des dizaines de personnes au Cap-Haïtien",
    "summary": "A tanker accident and fire produce mass casualties, overwhelming hospitals and prompting national mourning.",
    "fs": "Un accident de camion-citerne provoque une catastrophe meurtrière, saturant les hôpitaux et entraînant un deuil national.",
    "body": "Around midnight on 14 December 2021, a fuel tanker overturned at an entrance to Cap-Haïtien and exploded as nearby residents approached the spilled fuel. A United Nations situation report dated 14 December recorded a preliminary toll of at least 61 deaths and dozens of burn injuries; later totals changed as more information became available. The fire damaged homes, vehicles and nearby property. Healthcare workers in Cap-Haïtien struggled to treat severely burned patients, and national and international partners assisted with medical supplies and patient transfers. The disaster occurred after months of fuel scarcity that had intensified the value and risk of accessing gasoline. Investigators should distinguish initial casualty reports, later assessments and the specific circumstances of the accident.",
    "fb": "Dans la nuit du 13 au 14 décembre 2021, un camion-citerne se renverse à l'entrée du Cap-Haïtien et explose alors que des habitants s'approchent du carburant répandu. Un rapport des Nations unies daté du 14 décembre mentionne un bilan provisoire d'au moins 61 morts et de nombreuses personnes brûlées ; les chiffres évoluent ensuite. L'incendie endommage également des maisons et des véhicules. Les soignants locaux sont débordés, tandis que des partenaires appuient les transferts de patients et l'approvisionnement médical. Cette catastrophe survient après une longue pénurie de carburant. Les bilans initiaux et définitifs doivent être distingués.",
    "sources": [
      [
        "UN Haiti, OCHA situation report on Cap-Haïtien fuel truck explosion",
        "https://haiti.un.org/en/165533-haiti-explosion-fuel-truck-cap-haitien-situation-report-no-1-14-december-2021"
      ]
    ]
  },
  {
    "slug": "haiti-2021-economic-third-year-contraction",
    "date": "2021",
    "precision": "year",
    "dimension": "inside",
    "categories": [
      "economy",
      "society"
    ],
    "location": "Haiti",
    "title": "Haiti's economy contracts for a third consecutive fiscal year",
    "ft": "L'économie haïtienne recule pour un troisième exercice consécutif",
    "summary": "IMF figures record a 1.8 percent contraction in real GDP during fiscal 2021, amid insecurity and disasters.",
    "fs": "Le FMI relève un recul de 1,8 % du PIB réel sur l'exercice 2021, dans un contexte de violences et de catastrophes.",
    "body": "During Haiti's fiscal year ending 30 September 2021, real economic output contracted by an estimated 1.8 percent, according to the IMF's 2022 review. This was the third consecutive fiscal-year decline after contractions in 2019 and 2020. The report identified political instability, interruptions to supply, the president's assassination, armed violence, weaker investment and subdued household spending among the contributing factors. Remittances from Haitians abroad continued to provide important support, but they could not remove the wider pressures on work, transport and business. The 1.8 percent statistic is specific to fiscal-year real GDP and should not be mixed uncritically with consumer-price inflation or calendar-year estimates.",
    "fb": "Pour l'exercice budgétaire clos le 30 septembre 2021, l'économie haïtienne enregistre une contraction estimée à 1,8 % du PIB réel, selon le FMI. Il s'agit du troisième exercice de recul consécutif après 2019 et 2020. Le rapport évoque l'instabilité politique, les difficultés d'approvisionnement, l'assassinat du président, les violences armées, la faiblesse de l'investissement et de la consommation. Les transferts de la diaspora soutiennent les ménages sans suffire à compenser ces difficultés. Le chiffre de 1,8 % concerne le PIB réel sur un exercice budgétaire et doit être distingué des statistiques d'inflation ou d'année civile.",
    "sources": [
      [
        "IMF Haiti Staff-Monitored Program, June 2022, economic indicators for FY2021",
        "https://www.elibrary.imf.org/view/journals/002/2022/207/article-A001-en.xml"
      ]
    ]
  },
  {
    "slug": "haiti-2021-remittances-rise-fy",
    "date": "2021",
    "precision": "year",
    "dimension": "abroad",
    "categories": [
      "abroad",
      "economy",
      "society"
    ],
    "location": "Haitian diaspora and households in Haiti",
    "countries": [
      "Haiti",
      "United States",
      "Canada",
      "Dominican Republic"
    ],
    "title": "Haitian migrants' remittances increase during another year of crisis",
    "ft": "Les transferts de la diaspora augmentent pendant une nouvelle année de crise",
    "summary": "IMF data record strong growth in remittance inflows over fiscal 2021, reflecting transnational family support.",
    "fs": "Les données du FMI montrent une forte progression des envois de fonds durant l'exercice 2021.",
    "body": "Haitians living abroad sent substantial funds to relatives and communities in Haiti during 2021, even as domestic economic output continued to fall. An IMF economic review published in 2022 recorded an increase of approximately 21.1 percent in the U.S.-dollar value of remittances during fiscal 2021. These flows helped families pay for food, rent, education, healthcare and emergency needs, though their benefits and availability varied widely. Migration, transfer fees, exchange rates and the working conditions of migrants all shaped how support reached households. The increase should be presented as an IMF fiscal-year statistic, not a permanent annual growth rate or a sum of development grants. Remittances are private contributions from people, rather than government-to-government assistance.",
    "fb": "En 2021, les Haïtiens vivant à l'étranger continuent d'envoyer d'importantes sommes à leurs proches, malgré le recul de l'activité économique nationale. Un rapport du FMI publié en 2022 relève une hausse d'environ 21,1 % de la valeur en dollars des transferts pour l'exercice 2021. Ces ressources servent notamment à payer l'alimentation, le logement, l'école, les soins et les urgences. Leur accès dépend des revenus des migrants, des frais de transfert et des taux de change. Cette progression concerne un exercice précis et ne constitue pas un taux de croissance permanent. Il s'agit de contributions privées des familles, distinctes de l'aide publique internationale.",
    "sources": [
      [
        "IMF Haiti Staff-Monitored Program, FY2021 remittances and GDP table",
        "https://www.elibrary.imf.org/view/journals/002/2022/207/article-A001-en.xml"
      ]
    ]
  },
  {
    "slug": "haiti-2021-tps-designation-may",
    "date": "2021-05-22",
    "precision": "day",
    "dimension": "foreign",
    "categories": [
      "world",
      "abroad",
      "society"
    ],
    "location": "Washington, D.C., United States",
    "countries": [
      "United States",
      "Haiti"
    ],
    "title": "United States announces new temporary protected status designation for Haiti",
    "ft": "Les États-Unis annoncent une nouvelle désignation TPS pour Haïti",
    "summary": "The U.S. government announces temporary protection for eligible Haitian nationals amid deteriorating conditions in Haiti.",
    "fs": "Le gouvernement américain annonce une protection temporaire pour les ressortissants haïtiens répondant aux critères.",
    "body": "On 22 May 2021, the U.S. Department of Homeland Security announced a new 18-month designation of Haiti for Temporary Protected Status (TPS). The government cited insecurity, civil unrest, human-rights concerns, poverty and the COVID-19 pandemic. The designation allowed eligible Haitian nationals already in the United States to apply for temporary protection and work authorization; eligibility and application rules were clarified later in the Federal Register, effective 3 August. TPS was a temporary immigration status subject to statutory conditions, not a route to permanent residence and not an asylum determination. The announcement affected many Haitian families in the United States and helps explain the complex immigration policies in force during the September Del Rio expulsions, which involved people with different individual circumstances.",
    "fb": "Le 22 mai 2021, le département américain de la Sécurité intérieure annonce une nouvelle désignation d'Haïti au Statut de protection temporaire (TPS) pour une durée de dix-huit mois. Les autorités évoquent l'insécurité, les troubles civils, les atteintes aux droits humains, la pauvreté et la pandémie de COVID-19. Les ressortissants haïtiens répondant aux critères et déjà présents aux États-Unis peuvent demander une protection temporaire et une autorisation de travail. Les modalités sont ensuite précisées au Federal Register, avec une entrée en vigueur le 3 août. Le TPS n'est ni un statut permanent ni une décision d'asile. Cette annonce éclaire les politiques migratoires affectant les familles haïtiennes durant l'année.",
    "sources": [
      [
        "U.S. Department of Homeland Security, May 22 2021 TPS announcement",
        "https://www.presidency.ucsb.edu/documents/white-house-press-release-secretary-mayorkas-designates-haiti-for-temporary-protected"
      ],
      [
        "USCIS, 30 July 2021 bulletin on Haiti TPS registration",
        "https://content.govdelivery.com/accounts/USDHSCIS/bulletins/2eab0a8"
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
