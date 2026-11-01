import type { HistEvent, DatePrecision, Dimension } from "./types";
type Draft = {
  slug: string; date: string; precision: DatePrecision; dimension: Dimension; categories: string[];
  location: string; countries?: string[]; title: string; ft: string; summary: string; fs: string;
  body: string; fb: string; sources: [string, string][];
};
const drafts: Draft[] = [
  {
    "slug": "peyi-lok-2019-research",
    "date": "2019-09",
    "precision": "month",
    "dimension": "inside",
    "categories": [
      "society",
      "economy",
      "politics"
    ],
    "location": "Haiti",
    "title": "Peyi lòk disrupts daily life amid protests and political deadlock",
    "ft": "Le peyi lòk paralyse la vie quotidienne sur fond de contestation",
    "summary": "A sustained period of protests and blockades closed schools, courts and businesses amid demands for accountability and political change.",
    "fs": "Une période de manifestations et de barrages perturbe écoles, tribunaux et commerces sur fond de revendications politiques et de demandes de comptes.",
    "body": "From September into November 2019, prolonged demonstrations and blockades across Haiti became known as peyi lòk, or a locked-down country. Schools, courts, businesses and many services struggled to function. The crisis followed the failed 2018 fuel-price increase and mounting demands for explanations about PetroCaribe funds, alongside dissatisfaction with President Jovenel Moïse's government. The experience differed by neighbourhood and region, and the disruptions carried costs for people who needed to travel, work or seek medical care. The World Bank later described the period as an almost complete suspension of ordinary activity. It is important to separate demonstrators' demands, allegations of corruption and findings established by audits.",
    "fb": "De septembre à novembre 2019, de longues manifestations et de nombreux barrages donnent lieu à ce qu'on appelle le peyi lòk, un pays paralysé. Écoles, tribunaux, entreprises et services fonctionnent difficilement. La crise suit la tentative de hausse des prix des carburants en 2018, les demandes de transparence sur les fonds PetroCaribe et le mécontentement à l'égard du gouvernement de Jovenel Moïse. Les conséquences diffèrent selon les quartiers et les régions, et la paralysie pénalise notamment les déplacements, le travail et l'accès aux soins. La Banque mondiale décrit plus tard une quasi-suspension des activités ordinaires. Il faut distinguer les revendications des manifestants, les accusations de corruption et les conclusions effectivement établies par des audits.",
    "sources": [
      [
        "World Bank, Haiti country context",
        "https://documents1.worldbank.org/curated/en/099149206272240174/pdf/IDU-2fac0c37-b37d-4903-afb4-a976a79b02a1.pdf"
      ]
    ]
  },
  {
    "slug": "parliament-lapses-haiti-2020",
    "date": "2020-01-13",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Port-au-Prince",
    "title": "Haiti enters a new institutional vacuum as parliamentary mandates lapse",
    "ft": "L'expiration des mandats parlementaires ouvre un nouveau vide institutionnel",
    "summary": "With scheduled elections not held, the legislature ceased functioning normally and the executive began governing without a sitting parliament.",
    "fs": "Faute d'élections, le Parlement cesse de fonctionner normalement et l'exécutif gouverne sans législature siégeant.",
    "body": "On 13 January 2020, President Jovenel Moïse announced that the terms of most members of Haiti's legislature had expired, after parliamentary elections scheduled for 2019 had not taken place. The legislature could no longer carry out its normal functions, increasing the concentration of governing authority in the presidency. The episode followed the 2018–2019 protest cycle and compounded disputes about accountability, constitutional procedure and election management. This institutional vacancy is essential context for the political confrontation that preceded the president's assassination in July 2021. It did not mean that every branch of government had ceased to exist, and legal arguments about executive powers remained contested.",
    "fb": "Le 13 janvier 2020, le président Jovenel Moïse annonce l'expiration des mandats de la plupart des parlementaires, les élections prévues en 2019 n'ayant pas eu lieu. Le Parlement ne peut plus exercer normalement ses fonctions, ce qui concentre davantage le pouvoir de gouverner autour de la présidence. Cette situation succède aux protestations de 2018 et 2019 et aggrave les débats sur la responsabilité publique, les procédures constitutionnelles et l'organisation des élections. Ce vide institutionnel aide à comprendre la confrontation politique précédant l'assassinat du président en juillet 2021. Il ne signifie pas la disparition de toutes les institutions, et les compétences de l'exécutif restent contestées.",
    "sources": [
      [
        "World Bank, Haiti institutional context",
        "https://documents1.worldbank.org/curated/en/099149206272240174/pdf/IDU-2fac0c37-b37d-4903-afb4-a976a79b02a1.pdf"
      ]
    ]
  },
  {
    "slug": "cholera-resurgence-haiti-2022",
    "date": "2022-10-02",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "society",
      "environment"
    ],
    "location": "Haiti",
    "title": "Cholera returns after more than three years without reported cases",
    "ft": "Le choléra réapparaît après plus de trois ans sans cas signalés",
    "summary": "Health authorities reported a renewed cholera outbreak as insecurity and disrupted water and health services compounded the public-health emergency.",
    "fs": "Les autorités sanitaires signalent une nouvelle épidémie dans un contexte d'insécurité et de perturbation de l'eau et des soins.",
    "body": "On 2 October 2022, Haitian health authorities reported a resurgence of cholera after more than three years without reported cases. The World Health Organization documented the outbreak as it spread throughout the country. This was a new chapter in a public-health history shaped by the cholera epidemic introduced after the 2010 earthquake; the United Nations later acknowledged its role in that earlier outbreak. The return of the disease coincided with gang violence, fuel shortages, insecurity and difficult access to safe water, sanitation and health facilities. The numbers recorded in reports are date-specific snapshots, not permanent totals; the outbreak's evolution must be followed through successive Ministry of Health and WHO reports.",
    "fb": "Le 2 octobre 2022, les autorités sanitaires haïtiennes signalent la réapparition du choléra après plus de trois ans sans cas déclarés. L'Organisation mondiale de la santé suit la diffusion de l'épidémie dans le pays. Cet épisode prolonge une histoire sanitaire marquée par l'épidémie apparue après le séisme de 2010, dont l'ONU a ensuite reconnu sa responsabilité dans l'introduction. La recrudescence survient alors que violences armées, pénuries de carburant et insécurité compromettent l'accès à l'eau potable, à l'assainissement et aux soins. Les nombres publiés à chaque date sont des bilans provisoires, non des totaux définitifs : l'évolution doit être étudiée à partir des rapports successifs du MSPP et de l'OMS.",
    "sources": [
      [
        "World Health Organization, cholera outbreak update (13 December 2022)",
        "https://www.who.int/emergencies/disease-outbreak-news/item/2022-DON427"
      ]
    ]
  },
  {
    "slug": "un-mss-authorization-2023",
    "date": "2023-10-02",
    "precision": "day",
    "dimension": "foreign",
    "categories": [
      "politics",
      "wars"
    ],
    "location": "New York, United States",
    "countries": [
      "Haiti",
      "Kenya",
      "United Nations"
    ],
    "title": "UN Security Council authorizes a multinational security mission for Haiti",
    "ft": "Le Conseil de sécurité autorise une mission multinationale de soutien à la sécurité",
    "summary": "Resolution 2699 authorized a Kenya-led, non-UN multinational mission to support Haitian police against gang violence.",
    "fs": "La résolution 2699 autorise une mission multinationale, dirigée par le Kenya mais distincte d'une opération de l'ONU, pour soutenir la police haïtienne.",
    "body": "On 2 October 2023 the UN Security Council adopted resolution 2699 by 13 votes to none, with two abstentions. The decision authorized countries to form a multinational security support mission led by Kenya, operating in cooperation with the Haitian government and police. It was intended to help re-establish security, protect critical infrastructure and create conditions for elections. Although authorized by the Council, the mission was not a United Nations peacekeeping operation; its personnel and funding depended on participating states and voluntary support. The resolution also emphasized compliance with international law and human-rights standards. The authorization should not be confused with the later arrival of personnel in 2024 or the separate Gang Suppression Force authorized in 2025.",
    "fb": "Le 2 octobre 2023, le Conseil de sécurité adopte la résolution 2699 par treize voix pour, aucune contre et deux abstentions. La décision autorise des États à constituer une mission multinationale de soutien à la sécurité dirigée par le Kenya, en coopération avec le gouvernement et la police haïtiens. Son objectif est d'améliorer la sécurité, de protéger des infrastructures essentielles et de créer des conditions favorables aux élections. Bien qu'autorisée par le Conseil, il ne s'agit pas d'une opération de maintien de la paix de l'ONU : ses effectifs et son financement dépendent des États participants et de contributions volontaires. La résolution exige aussi le respect du droit international et des droits humains. Il faut distinguer cette autorisation de l'arrivée des personnels en 2024 et de la Force de répression des gangs autorisée en 2025.",
    "sources": [
      [
        "UN Digital Library, Security Council resolution 2699 (2023)",
        "https://digitallibrary.un.org/record/4022890"
      ],
      [
        "United Nations Caribbean, mission authorization",
        "https://caribbean.un.org/en/248128-security-council-authorises-%E2%80%98historic%E2%80%99-support-mission-haiti"
      ]
    ]
  },
  {
    "slug": "transitional-presidential-council-installed-2024",
    "date": "2024-04-25",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Port-au-Prince",
    "title": "Transitional Presidential Council formally takes office",
    "ft": "Le Conseil présidentiel de transition est officiellement installé",
    "summary": "The council took office amid an emergency of violence and failed institutions, following Prime Minister Ariel Henry's resignation.",
    "fs": "Le Conseil s'installe au milieu de la crise sécuritaire et institutionnelle, à la suite de la démission du Premier ministre Ariel Henry.",
    "body": "The Transitional Presidential Council was officially installed in Port-au-Prince on 25 April 2024 as Haiti sought an interim governing arrangement following months of intense political crisis and armed violence. Ariel Henry had announced his resignation, while Finance Minister Michel Patrick Boisvert acted as interim prime minister. The council's task was linked to restoring public authority, appointing a government and preparing a return to elections. The arrangement emerged from negotiations involving Haitian political and civil-society actors and regional diplomacy. Its creation did not settle disputes over the distribution of executive power or resolve the insecurity affecting daily life; those difficulties continued to shape the transition in 2025 and 2026.",
    "fb": "Le Conseil présidentiel de transition est officiellement installé au Port-au-Prince le 25 avril 2024 alors qu'Haïti cherche un dispositif de gouvernement provisoire après des mois de crise politique et de violence armée. Ariel Henry a annoncé sa démission et le ministre des Finances Michel Patrick Boisvert exerce l'intérim. Le Conseil doit contribuer au rétablissement de l'autorité publique, à la formation d'un gouvernement et à la préparation du retour aux élections. Ce dispositif résulte de négociations entre acteurs politiques et organisations de la société civile haïtiennes, ainsi que de démarches diplomatiques régionales. Son installation ne met fin ni aux conflits sur la répartition du pouvoir exécutif ni à l'insécurité, qui continuent de peser sur la transition en 2025 et en 2026.",
    "sources": [
      [
        "United Nations, briefing of 25 April 2024",
        "https://www.un.org/sg/en/content/highlight/2024-04-25.html"
      ]
    ]
  },
  {
    "slug": "conille-cabinet-le-moniteur-2024",
    "date": "2024-06-11",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince",
    "title": "Garry Conille's cabinet is published in Le Moniteur",
    "ft": "Le gouvernement de Garry Conille est publié dans Le Moniteur",
    "summary": "The official gazette published the composition of the ministerial cabinet, documenting a central step in the transition.",
    "fs": "Le journal officiel publie la composition du cabinet ministériel, étape importante de la transition.",
    "body": "The composition of Prime Minister Garry Conille's government appeared in the special issue of Haiti's official gazette Le Moniteur dated 11 June 2024. The appointments included ministries responsible for foreign affairs, finance, education, health and other public services. The publication matters because an official gazette records the legal and institutional form of appointments, beyond press speculation or political declarations. It also documents the presence of public officials charged with governing while the presidential council remained in place. The cabinet's formation did not mean Haiti had held national elections or ended the security emergency.",
    "fb": "La composition du gouvernement du Premier ministre Garry Conille est publiée dans le numéro spécial du 11 juin 2024 du journal officiel haïtien Le Moniteur. Les nominations concernent notamment les Affaires étrangères, les Finances, l'Éducation, la Santé et d'autres services publics. La publication compte parce que le journal officiel documente les actes institutionnels au-delà des annonces politiques et des rumeurs. Elle renseigne aussi sur les responsables chargés d'administrer le pays pendant que le Conseil présidentiel est en place. La formation du cabinet ne signifie ni la tenue d'élections nationales ni la fin de la crise sécuritaire.",
    "sources": [
      [
        "Embassy of Haiti, June 2024 government appointments (French and English)",
        "https://www.haiti.org/nouveau-gouvernement/"
      ]
    ]
  },
  {
    "slug": "didier-fils-aime-appointed-2024",
    "date": "2024-11-11",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince",
    "title": "Alix Didier Fils-Aimé replaces Garry Conille as prime minister",
    "ft": "Alix Didier Fils-Aimé succède à Garry Conille à la primature",
    "summary": "The Transitional Presidential Council appointed a new prime minister amid disagreement over the direction of the transition.",
    "fs": "Le Conseil présidentiel de transition nomme un nouveau Premier ministre dans un contexte de désaccords sur la conduite de la transition.",
    "body": "On 11 November 2024, the Transitional Presidential Council designated Alix Didier Fils-Aimé to replace Garry Conille as prime minister. The change followed disagreement between the council and Conille over how the government should operate. An IMF statement later recorded the appointment and the issuing of a new cabinet decree on 15 November. The episode illustrates the instability of the transitional executive: senior offices changed hands before any new national election, even as public security, humanitarian needs and governance remained urgent. It also helps explain why institutional continuity became a central issue in debates over the council's expiry in February 2026.",
    "fb": "Le 11 novembre 2024, le Conseil présidentiel de transition désigne Alix Didier Fils-Aimé pour succéder à Garry Conille au poste de Premier ministre. Le changement suit des désaccords entre le Conseil et Conille sur le fonctionnement de l'exécutif. Une déclaration du FMI atteste ensuite cette nomination ainsi que la publication d'un nouveau décret ministériel le 15 novembre. Cet épisode illustre l'instabilité de l'exécutif provisoire : les fonctions dirigeantes changent avant toute nouvelle élection nationale, alors que les besoins sécuritaires et humanitaires restent pressants. Il aide à comprendre l'importance accordée à la continuité institutionnelle lors de l'expiration du mandat du Conseil en février 2026.",
    "sources": [
      [
        "IMF, statement of 20 November 2024",
        "https://www.elibrary.imf.org/view/journals/002/2024/333/article-A004-en.xml"
      ]
    ]
  },
  {
    "slug": "un-gang-suppression-force-2025",
    "date": "2025-09-30",
    "precision": "day",
    "dimension": "foreign",
    "categories": [
      "politics",
      "wars"
    ],
    "location": "New York, United States",
    "countries": [
      "Haiti",
      "United Nations"
    ],
    "title": "Security Council authorizes transition to a Gang Suppression Force",
    "ft": "Le Conseil de sécurité autorise le passage à une Force de répression des gangs",
    "summary": "Resolution 2793 established a new international security framework to replace the earlier multinational mission and created a UN support office.",
    "fs": "La résolution 2793 établit un nouveau dispositif de sécurité remplaçant la mission antérieure et crée un bureau d'appui de l'ONU.",
    "body": "On 30 September 2025 the UN Security Council adopted resolution 2793, authorizing a transition from the Multinational Security Support mission to a Gang Suppression Force. The resolution gave the force a mandate to conduct targeted operations against gangs, independently or with Haitian security institutions, while requiring respect for human rights and civilian protection. It also provided for a United Nations Support Office in Haiti to deliver logistics and operational assistance. This legal decision was distinct from the actual pace of deployment and should not be read as proof that the authorized personnel ceiling had been reached. The change reflected concern that earlier arrangements had not restored adequate security.",
    "fb": "Le 30 septembre 2025, le Conseil de sécurité adopte la résolution 2793, autorisant le passage de la Mission multinationale d'appui à la sécurité à une Force de répression des gangs. Le mandat prévoit des opérations ciblées contre les groupes armés, menées de manière autonome ou avec les institutions de sécurité haïtiennes, dans le respect des droits humains et de la protection des civils. La décision prévoit aussi un Bureau d'appui des Nations unies en Haïti chargé de l'assistance logistique et opérationnelle. L'autorisation juridique ne doit pas être confondue avec le rythme réel des déploiements ni avec l'atteinte du plafond théorique d'effectifs. Cette évolution reflète les inquiétudes devant l'insuffisance des dispositifs précédents.",
    "sources": [
      [
        "UN Digital Library, Resolution 2793 (2025), English/French",
        "https://digitallibrary.un.org/record/4089907"
      ],
      [
        "UN Mandate Registry, Resolution 2793",
        "https://mandates.un.org/mandate/S/RES/2793%282025%29"
      ]
    ]
  },
  {
    "slug": "tpc-mandate-ends-2026",
    "date": "2026-02-07",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince",
    "title": "Transitional Presidential Council mandate ends and executive power passes to ministers",
    "ft": "Fin du mandat du Conseil présidentiel de transition et transfert du pouvoir exécutif",
    "summary": "The council's mandate expired and executive authority was transferred to the Council of Ministers led by the prime minister.",
    "fs": "Le mandat du Conseil expire et le pouvoir exécutif est transféré au Conseil des ministres dirigé par le Premier ministre.",
    "body": "On 7 February 2026 the mandate of Haiti's Transitional Presidential Council ended. According to the UN Secretary-General's report, executive authority passed to the Council of Ministers under Prime Minister Alix Didier Fils-Aimé. The Council of Ministers adopted a decree claiming full executive authority until the inauguration of an elected president, invoking constitutional and transitional provisions. Different political actors disputed the interpretation of those legal bases. This transition was not an electoral handover and left fundamental questions about legitimacy, security and a timetable for voting unresolved. The date marks an institutional change rather than the completion of the democratic transition.",
    "fb": "Le 7 février 2026, le mandat du Conseil présidentiel de transition prend fin. Selon le rapport du Secrétaire général de l'ONU, le pouvoir exécutif passe au Conseil des ministres dirigé par le Premier ministre Alix Didier Fils-Aimé. Celui-ci adopte un décret revendiquant l'exercice intégral de l'autorité exécutive jusqu'à l'installation d'un président élu, sur la base de dispositions constitutionnelles et transitoires. Plusieurs acteurs contestent l'interprétation de ces fondements juridiques. Ce transfert ne résulte pas d'une élection et laisse ouvertes les questions de légitimité, de sécurité et de calendrier électoral. La date marque un changement institutionnel, non l'achèvement de la transition démocratique.",
    "sources": [
      [
        "United Nations, Secretary-General report S/2026/325",
        "https://www.un.org/sexualviolenceinconflict/wp-content/uploads/2026/04/report/united-nations-integrated-office-in-haiti-report-of-the-secretary-general/8788fc76-904c-49e0-abe6-6bab89bcf2de.pdf"
      ]
    ]
  },
  {
    "slug": "unsoh-operational-2026",
    "date": "2026-04-01",
    "precision": "day",
    "dimension": "foreign",
    "categories": [
      "politics"
    ],
    "location": "Haiti",
    "countries": [
      "Haiti",
      "United Nations"
    ],
    "title": "United Nations Support Office in Haiti becomes operational",
    "ft": "Le Bureau d'appui des Nations unies en Haïti devient opérationnel",
    "summary": "UNSOH began providing logistical support for the Gang Suppression Force and the UN political mission.",
    "fs": "L'UNSOH commence à fournir un appui logistique à la Force de répression des gangs et à la mission politique de l'ONU.",
    "body": "The United Nations Support Office in Haiti became fully operational on 1 April 2026, according to an official announcement released later that month. Created under Security Council resolution 2793, UNSOH was responsible for a wide range of logistical support, including medical services, fuel, transport, power, communications and accommodation for the Gang Suppression Force. It also provided mission-support services for the UN Integrated Office in Haiti. UNSOH's operational start describes the support structure, not the total number of police and military personnel deployed or the effectiveness of security operations. That distinction is important when evaluating international responses to Haiti's crisis.",
    "fb": "Le Bureau d'appui des Nations unies en Haïti devient pleinement opérationnel le 1er avril 2026, selon un communiqué officiel publié plus tard dans le mois. Créé par la résolution 2793, l'UNSOH doit fournir une vaste gamme d'appuis logistiques : services médicaux, carburant, transports, énergie, communications et hébergement à la Force de répression des gangs. Il assure aussi des services de soutien à la mission politique de l'ONU en Haïti. Le démarrage du bureau décrit l'infrastructure de soutien, et non le nombre total de policiers et militaires déployés ni l'efficacité des opérations. Cette distinction est essentielle pour évaluer les réponses internationales à la crise.",
    "sources": [
      [
        "United Nations, establishment of UNSOH (20 April 2026)",
        "https://www.un.org/en/node/241867"
      ]
    ]
  },
  {
    "slug": "haiti-gsf-agreement-july-2026",
    "date": "2026-07-27",
    "precision": "day",
    "dimension": "foreign",
    "categories": [
      "politics"
    ],
    "location": "Haiti",
    "countries": [
      "Haiti",
      "United Nations"
    ],
    "title": "Haiti and the Gang Suppression Force sign an agreement on its legal status",
    "ft": "Haïti et la Force de répression des gangs signent un accord sur son statut juridique",
    "summary": "The agreement clarified the force's legal personality and arrangements for its work in Haiti.",
    "fs": "L'accord précise la personnalité juridique de la Force et les modalités encadrant ses activités en Haïti.",
    "body": "An agreement between Haiti's government and the Gang Suppression Force was signed on 27 July 2026, according to Security Council resolution 2829. The instrument confirmed the force's legal personality and arrangements relevant to the protections and status needed for its operations. Such agreements matter because foreign security deployments require a legal framework defining their relationship with the host state. The UN Council later cited the agreement when renewing the force's mandate. The existence of legal arrangements must nevertheless be assessed separately from the conduct of operations, protection of civilians and accountability for any abuses.",
    "fb": "Un accord entre le gouvernement haïtien et la Force de répression des gangs est signé le 27 juillet 2026, selon la résolution 2829 du Conseil de sécurité. Le texte confirme la personnalité juridique de la Force et les arrangements relatifs au statut et aux protections nécessaires à ses activités. De tels accords comptent parce qu'un déploiement étranger demande un cadre juridique définissant les rapports avec l'État hôte. Le Conseil cite ensuite cet accord lorsqu'il renouvelle le mandat de la Force. L'existence de règles juridiques doit toutefois être distinguée de la conduite des opérations, de la protection des civils et de la responsabilité en cas d'abus.",
    "sources": [
      [
        "UN Mandate Registry, Resolution 2829 (2026)",
        "https://mandates.un.org/mandate/S/RES/2829%20%282026%29"
      ]
    ]
  },
  {
    "slug": "gsf-mandate-extended-september-2026",
    "date": "2026-09-29",
    "precision": "day",
    "dimension": "foreign",
    "categories": [
      "politics",
      "wars"
    ],
    "location": "New York, United States",
    "countries": [
      "Haiti",
      "United Nations"
    ],
    "title": "Security Council extends Gang Suppression Force mandate into 2027",
    "ft": "Le Conseil de sécurité prolonge le mandat de la Force de répression des gangs jusqu'en 2027",
    "summary": "Resolution 2829 extended the force's mandate until 31 March 2027 as insecurity continued.",
    "fs": "La résolution 2829 prolonge le mandat de la Force jusqu'au 31 mars 2027 alors que l'insécurité persiste.",
    "body": "On 29 September 2026 the UN Security Council adopted resolution 2829, extending the Gang Suppression Force's mandate for six months until 31 March 2027. Twelve members voted in favour and three abstained. The extension called for continued UN logistical support and acknowledged the agreement signed between Haiti and the force in July. A renewed mandate meant international authorization would continue; it did not guarantee that the force had the resources or capacity needed to achieve its objectives. The Council reiterated the central responsibility of Haitian authorities for public security and civilian protection.",
    "fb": "Le 29 septembre 2026, le Conseil de sécurité adopte la résolution 2829, prolongeant de six mois le mandat de la Force de répression des gangs, jusqu'au 31 mars 2027. Douze membres votent pour et trois s'abstiennent. La décision prévoit la poursuite de l'appui logistique de l'ONU et rappelle l'accord signé en juillet entre Haïti et la Force. Le renouvellement maintient une autorisation internationale ; il ne garantit ni les ressources ni la capacité de remplir les objectifs. Le Conseil réaffirme la responsabilité première des autorités haïtiennes pour la sécurité et la protection des civils.",
    "sources": [
      [
        "UNSOH, Security Council extends mandates (29 September 2026)",
        "https://www.unmissions.org/en/unsoh/news/security-council-extends-gang-suppression-force-and-unsoh-mandates"
      ],
      [
        "UN Mandate Registry, Resolution 2829 (2026)",
        "https://mandates.un.org/mandate/S/RES/2829%20%282026%29"
      ]
    ]
  },
  {
    "slug": "un-report-haiti-october-2026",
    "date": "2026-10-12",
    "precision": "day",
    "dimension": "inside",
    "categories": [
      "society",
      "economy",
      "politics"
    ],
    "location": "Haiti",
    "title": "UN October report documents violence, displacement and stalled elections",
    "ft": "Le rapport de l'ONU d'octobre documente les violences, les déplacements et les retards électoraux",
    "summary": "A Secretary-General report provided a dated assessment of security operations, displacement, the economy and preparations for voting.",
    "fs": "Un rapport du Secrétaire général présente un bilan daté de la sécurité, des déplacements, de l'économie et des préparatifs électoraux.",
    "body": "The UN Secretary-General's report dated 12 October 2026 described continued armed violence and major challenges for Haiti's political transition. For 1 July to 1 October the report recorded 1,123 people killed in gang-related violence and 440 injured; these figures reflect the reporting period and methodology, not the total for all of 2026. It estimated roughly 1.49 million people displaced as of August. The provisional electoral process was also under strain, with the campaign delayed after an October decree change. The report provides a dated institutional snapshot of crisis conditions and should be compared with Haitian civil-society reporting and later updates rather than treated as the final account of the year.",
    "fb": "Le rapport du Secrétaire général daté du 12 octobre 2026 décrit la persistance des violences armées et les obstacles à la transition politique en Haïti. Pour la période du 1er juillet au 1er octobre, il recense 1 123 personnes tuées dans des violences liées aux gangs et 440 blessées ; ces nombres correspondent à une période et à une méthode de comptage, non au bilan de toute l'année 2026. Le rapport estime à environ 1,49 million les personnes déplacées en août. Le processus électoral est aussi fragilisé, avec une campagne reportée après une modification du décret en octobre. Il s'agit d'un état des lieux institutionnel daté, à confronter aux rapports de la société civile haïtienne et aux mises à jour ultérieures.",
    "sources": [
      [
        "HaitiDocs, UN Secretary-General report S/2026/800, English/French",
        "https://www.haitidocs.org/doc/binuh-sg-reports-2026-10"
      ]
    ]
  },
  {
    "slug": "haiti-elections-postponed-october-2026",
    "date": "2026-10",
    "precision": "month",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Haiti",
    "title": "Haiti postpones its planned December election and announces a 2027 calendar",
    "ft": "Haïti reporte le scrutin prévu en décembre et annonce un calendrier pour 2027",
    "summary": "The provisional electoral authority announced a July 2027 first round instead of voting in December 2026.",
    "fs": "L'autorité électorale provisoire annonce un premier tour en juillet 2027, au lieu du scrutin envisagé pour décembre 2026.",
    "body": "At the end of October 2026 Haiti's Provisional Electoral Council announced that the first round of national elections, previously planned for December 2026, was being postponed to 18 July 2027, with a further round planned for 4 October 2027. Associated Press and Reuters reported the announcement as armed-group violence continued to obstruct electoral preparation and the protection of voters. A new calendar represents an announced plan rather than proof that elections will take place on those dates. The decision made the continuing absence of an elected president and the difficulties of restoring an electoral process especially visible. This entry records information available as of 1 November 2026 and should be updated if dates change again.",
    "fb": "À la fin d'octobre 2026, le Conseil électoral provisoire annonce le report du premier tour des élections nationales, initialement envisagé en décembre 2026, au 18 juillet 2027, avec un autre tour prévu le 4 octobre 2027. Associated Press et Reuters rapportent cette annonce alors que les violences des groupes armés continuent d'entraver la préparation du scrutin et la protection des électeurs. Un nouveau calendrier constitue un programme annoncé, non la garantie que les élections se tiendront à ces dates. La décision rend particulièrement visible l'absence persistante d'un président élu et les difficultés du retour au vote. Cette entrée reflète les informations disponibles au 1er novembre 2026 et devra être actualisée si les dates changent.",
    "sources": [
      [
        "Associated Press, updated Haitian election schedule (29 October 2026)",
        "https://apnews.com/article/3c24fe0b0134ea2b41b48fc80457215d"
      ],
      [
        "Reuters, Haiti postpones elections (29 October 2026)",
        "https://www.reuters.com/world/americas/haiti-postpones-first-presidential-election-decade-july-2027-2026-10-29/"
      ]
    ]
  }
];
export const contemporaryResearch: HistEvent[] = drafts.map((e) => ({
  slug: e.slug, date: e.date, precision: e.precision, dimension: e.dimension, categories: e.categories,
  location: e.location, countries: e.countries, title: e.title, summary: e.summary, body: e.body,
  fr: { title: e.ft, summary: e.fs, body: e.fb },
  sources: e.sources.map(([title,url]) => ({title,url})), status: "documented",
  editorial: { verification: "corroborated", dateBasis: e.precision === "day" ? "date of documented action" : "month of documented development",
    reviewedOn: "2026-11-01", note: "Narrative summarizes cited sources; future plans and dated statistics are explicitly time-qualified." },
}));
