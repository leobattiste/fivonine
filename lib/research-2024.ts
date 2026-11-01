import type { HistEvent, DatePrecision, Dimension } from "./types";
/** Bilingual 2024 entries supplement canonical council and security-mission events. */
type Entry={slug:string;date:string;dimension:Dimension;categories:string[];location:string;title:string;ft:string;summary:string;fs:string;body:string;fb:string;sources:[string,string][]};
const entries:Entry[]=[
  {
    "slug": "research-2024-01-viv-ansanm-launches-coordinated-o",
    "date": "2024-02-29",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Port-au-Prince",
    "title": "Viv Ansanm launches coordinated offensives against state institutions",
    "ft": "Viv Ansanm lance des attaques coordonnées contre les institutions",
    "summary": "A coalition of previously rival armed groups attacks infrastructure and security institutions.",
    "fs": "Une coalition de groupes armés rivaux attaque les infrastructures et les services de sécurité.",
    "body": "On 29 February 2024, armed factions that had previously fought each other revived the Viv Ansanm coalition and began coordinated attacks in Port-au-Prince. The targets included police stations, government facilities, the international airport and key roads. The offensive aimed to challenge the authorities and expand territorial control at a moment when interim Prime Minister Ariel Henry was abroad. Civilians endured shootings, forced displacement, closed businesses and interrupted medical access. Later UN investigations documented the violence and the coalition's attempt to consolidate areas across the capital. The opening of the offensive is distinct from the subsequent prison attacks and political agreements that followed in March.",
    "fb": "Le 29 février 2024, des factions armées auparavant rivales réactivent la coalition Viv Ansanm et lancent des attaques coordonnées à Port-au-Prince. Les cibles comprennent des commissariats, des bâtiments publics, l'aéroport et des routes stratégiques. Les habitants sont confrontés aux tirs, aux déplacements forcés, à la fermeture des commerces et aux difficultés d'accès aux soins. Des enquêtes de l'ONU décrivent ensuite l'extension de la violence et l'objectif de contrôle territorial. Le début des offensives doit être distingué des attaques des prisons et des négociations politiques de mars.",
    "sources": [
      [
        "United Nations",
        "https://main.un.org/securitycouncil/en/content/viv-ansanm"
      ]
    ]
  },
  {
    "slug": "research-2024-02-attacks-on-two-major-prisons-lead",
    "date": "2024-03-02",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Port-au-Prince and Croix-des-Bouquets",
    "title": "Attacks on two major prisons lead to mass escapes",
    "ft": "Des attaques contre deux grandes prisons provoquent des évasions massives",
    "summary": "More than 4,600 detainees escape after assaults on the capital's main prisons.",
    "fs": "Plus de 4 600 détenus s'évadent après des assauts contre les deux principaux établissements pénitentiaires.",
    "body": "On 2 and 3 March 2024, armed groups attacked the National Penitentiary in Port-au-Prince and the prison at Croix-des-Bouquets. UN human-rights reporting recorded the escape of more than 4,600 prisoners and described the two facilities as no longer operational. The events compounded an existing crisis of overcrowding, pretrial detention and limited judicial capacity. The escaped detainees included people with very different legal histories, and it would be inaccurate to call them all convicted gang members. The attacks also directly threatened prison workers and nearby communities and added to fears about public security. This episode should be connected to the wider Viv Ansanm offensive without conflating the separate attacks on individual institutions.",
    "fb": "Les 2 et 3 mars 2024, des groupes armés attaquent le Pénitencier national de Port-au-Prince et la prison de Croix-des-Bouquets. Selon les rapports de l'ONU, plus de 4 600 détenus s'évadent et les deux établissements deviennent inutilisables. Cette crise s'ajoute à la surpopulation carcérale, aux détentions préventives prolongées et aux difficultés de la justice. Tous les fugitifs ne sont pas des membres de gangs condamnés : leurs situations juridiques sont diverses. Les attaques menacent aussi les agents pénitentiaires et les habitants des quartiers voisins.",
    "sources": [
      [
        "United Nations",
        "https://www.haitidocs.org/doc/ohchr-2024-situation-human-rights"
      ]
    ]
  },
  {
    "slug": "research-2024-03-caricom-mediated-talks-produce-a",
    "date": "2024-03-11",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "Kingston, Jamaica",
    "title": "CARICOM-mediated talks produce a transitional political framework",
    "ft": "Des pourparlers facilités par la CARICOM ouvrent une transition politique",
    "summary": "Haitian stakeholders and regional partners agree on a proposed transitional council.",
    "fs": "Des acteurs haïtiens et partenaires régionaux conviennent d'un projet de conseil de transition.",
    "body": "At a high-level meeting in Kingston, Jamaica, on 11 March 2024, CARICOM convened Haitian political, business, religious and civil-society representatives with international partners. The resulting declaration called for a transitional governing arrangement, a presidential council, security measures and a route toward future elections. Prime Minister Ariel Henry indicated he would resign when an interim council was established. The agreement emerged amid severe violence and the inability of Henry to return to Haiti. It represented a negotiated political framework, not the immediate installation of a new government or the completion of democratic elections. Different Haitian organizations continued to debate participation, representation and legitimacy as the council was formed.",
    "fb": "Le 11 mars 2024, la CARICOM réunit à Kingston, en Jamaïque, des représentants politiques, économiques, religieux et associatifs haïtiens ainsi que des partenaires internationaux. La déclaration issue des discussions prévoit un organe de transition, un conseil présidentiel, des mesures de sécurité et la préparation d'élections. Ariel Henry accepte de démissionner après la mise en place du nouveau dispositif. Cette entente négociée n'est pas une installation immédiate de gouvernement ni une élection. Les questions de représentation, de participation et de légitimité restent débattues en Haïti.",
    "sources": [
      [
        "CARICOM",
        "https://caricom.org/outcome-declaration-of-caricom-international-partners-and-haitian-stakeholders/"
      ]
    ]
  },
  {
    "slug": "research-2024-04-haiti-s-paris-olympic-uniforms-br",
    "date": "2024-07-26",
    "dimension": "abroad",
    "categories": [
      "sports",
      "arts",
      "abroad",
      "culture"
    ],
    "location": "Paris, France",
    "title": "Haiti's Paris Olympic uniforms bring Haitian visual art to a world audience",
    "ft": "Les tenues olympiques d'Haïti présentent l'art haïtien à un public mondial",
    "summary": "Designer Stella Jean collaborates with painter Philippe Dodard for the delegation's parade uniforms.",
    "fs": "Stella Jean collabore avec le peintre Philippe Dodard pour les tenues du défilé olympique.",
    "body": "During the opening ceremony of the Paris 2024 Olympic Games, Haiti's delegation wore ceremonial uniforms designed by Stella Jean incorporating imagery by Haitian painter Philippe Dodard. The Olympic Museum's collection attributes the women's uniform to both creators and preserves the object as part of the Games' material history. The garments combined national representation, fashion, painting and ideas about heritage and sustainability. Athletes competing at the Games were thus accompanied by a visual cultural statement created across disciplines and borders. The example demonstrates how Haitian artists influence international design even during periods of political hardship. The athletes' participation and individual results should be documented separately from the uniforms.",
    "fb": "Lors de l'ouverture des Jeux olympiques de Paris le 26 juillet 2024, la délégation haïtienne porte des tenues dessinées par Stella Jean avec des œuvres du peintre haïtien Philippe Dodard. Le Musée olympique attribue officiellement la tenue féminine aux deux créateurs. Les vêtements associent représentation nationale, peinture, mode et patrimoine. Ils offrent une visibilité mondiale à des créateurs haïtiens pendant une période difficile. La participation et les résultats des sportifs doivent être documentés séparément de l'histoire des costumes.",
    "sources": [
      [
        "Olympic Museum",
        "https://olympic-museum-artefacts.zetcom.net/en/collection/item/183601/"
      ]
    ]
  },
  {
    "slug": "research-2024-05-gran-grif-gunmen-massacre-civilia",
    "date": "2024-10-03",
    "dimension": "inside",
    "categories": [
      "society",
      "politics"
    ],
    "location": "Pont-Sondé, Artibonite",
    "title": "Gran Grif gunmen massacre civilians at Pont-Sondé",
    "ft": "Des hommes armés de Gran Grif massacrent des civils à Pont-Sondé",
    "summary": "A mass attack in Artibonite leaves scores dead and drives thousands from their homes.",
    "fs": "Une attaque de masse dans l'Artibonite fait de nombreuses victimes et entraîne des déplacements.",
    "body": "On 3 October 2024, members of the Gran Grif armed group attacked Pont-Sondé in the Artibonite department. Civilians were killed in homes and streets, and thousands sought refuge in Saint-Marc and surrounding communities. Reports of the death toll evolved as the search for victims continued; by 9 October local officials reported at least 115 deaths, while a later UN assessment used its own verified count. The event illustrated the expansion of mass violence far beyond Port-au-Prince and the vulnerability of agricultural communities and transport routes. Any account must distinguish early local figures from later verified investigations and examine access to protection, emergency healthcare and shelter for survivors.",
    "fb": "Le 3 octobre 2024, des membres du groupe armé Gran Grif attaquent Pont-Sondé dans le département de l'Artibonite. Des civils sont tués dans leurs maisons ou dans la rue, et des milliers de personnes cherchent refuge à Saint-Marc et dans les environs. Les bilans évoluent au fil des recherches : des autorités locales évoquent au moins 115 morts le 9 octobre, tandis que l'ONU publie ensuite ses propres chiffres vérifiés. L'attaque témoigne de l'extension des violences au-delà de la capitale et de la vulnérabilité des communautés agricoles.",
    "sources": [
      [
        "Associated Press",
        "https://apnews.com/article/1a45faafb929a605f30af4efd8454aeb"
      ]
    ]
  },
  {
    "slug": "research-2024-06-unesco-recognizes-cassava-bread-t",
    "date": "2024-12-04",
    "dimension": "abroad",
    "categories": [
      "culture",
      "world",
      "arts"
    ],
    "location": "Asunción, Paraguay",
    "title": "UNESCO recognizes cassava-bread traditions shared by Haiti and its neighbors",
    "ft": "L'UNESCO inscrit les savoir-faire traditionnels de la cassave",
    "summary": "The multinational recognition includes Haiti, Cuba, the Dominican Republic, Honduras and Venezuela.",
    "fs": "L'inscription multinationale réunit Haïti, Cuba, la République dominicaine, le Honduras et le Venezuela.",
    "body": "On 4 December 2024, UNESCO inscribed the traditional knowledge and practices for making and consuming cassava bread on the Representative List of the Intangible Cultural Heritage of Humanity. Haiti joined Cuba, the Dominican Republic, Honduras and Venezuela in the multinational nomination. Cassava bread, known in Haiti as kasav, reflects techniques passed through households and communities and connects Indigenous and African food heritage. The listing recognizes knowledge and transmission, not the exclusive ownership of the food by one nation. It offers an opportunity to document growers, artisans, women's work, markets and the continuity of culinary practices across the Caribbean and northern South America.",
    "fb": "Le 4 décembre 2024, l'UNESCO inscrit sur la Liste du patrimoine culturel immatériel les savoir-faire et pratiques liés à la production et à la consommation de la cassave. Haïti partage la candidature avec Cuba, la République dominicaine, le Honduras et le Venezuela. Le kasav repose sur des techniques transmises dans les familles et les communautés et renvoie à des héritages autochtones et africains. L'inscription valorise des pratiques de fabrication et leur transmission, sans reconnaître une propriété exclusive à un pays. Elle permet de raconter l'histoire des cultivateurs, artisans et marchés.",
    "sources": [
      [
        "UNESCO",
        "https://ich.unesco.org/en/RL/traditional-knowledge-and-practices-for-the-making-and-consumption-of-cassava-bread-02118"
      ]
    ]
  },
  {
    "slug": "research-2024-07-wharf-j-r-mie-gang-carries-out-ma",
    "date": "2024-12-06",
    "dimension": "inside",
    "categories": [
      "society",
      "politics",
      "culture"
    ],
    "location": "Wharf Jérémie, Port-au-Prince",
    "title": "Wharf Jérémie gang carries out mass killings over six days",
    "ft": "Le gang de Wharf Jérémie commet des massacres durant six jours",
    "summary": "A UN inquiry identifies at least 207 people executed, many older people accused of witchcraft.",
    "fs": "Une enquête de l'ONU recense au moins 207 personnes exécutées, notamment des personnes âgées accusées de sorcellerie.",
    "body": "Between 6 and 11 December 2024, the Wharf Jérémie gang in Port-au-Prince executed at least 207 people, according to a joint investigation by BINUH and the UN Human Rights Office. Victims included older residents accused of witchcraft or involvement with Vodou, their relatives and individuals suspected of sharing information with journalists. Investigators documented killings across several areas and attempts to conceal the bodies. The accusations used to justify the violence were not evidence of wrongdoing by victims. The episode exposes extreme criminal control over communities, the targeting of vulnerable people and the absence of effective judicial protection. A historical account should center the victims and explain the distinction between religious practices and defamatory accusations employed by perpetrators.",
    "fb": "Entre le 6 et le 11 décembre 2024, le gang de Wharf Jérémie exécute au moins 207 personnes à Port-au-Prince, selon une enquête commune du BINUH et du Haut-Commissariat de l'ONU aux droits de l'homme. Parmi les victimes figurent des personnes âgées accusées de sorcellerie ou de liens avec le Vodou, leurs proches et des habitants soupçonnés d'avoir parlé aux journalistes. Les enquêteurs décrivent plusieurs lieux de crime et des tentatives de dissimulation des corps. Les accusations lancées par les assaillants ne constituent aucune preuve contre les victimes. L'événement révèle l'emprise de groupes criminels et l'impunité.",
    "sources": [
      [
        "UN BINUH",
        "https://binuh.unmissions.org/en/press-releases/united-nations-investigation-report-brings-to-207-the-number-of-people"
      ]
    ]
  },
  {
    "slug": "research-2024-08-un-reports-more-than-5-600-deaths",
    "date": "2024",
    "dimension": "inside",
    "categories": [
      "society",
      "education",
      "economy"
    ],
    "location": "Haiti",
    "title": "UN reports more than 5,600 deaths amid nationwide violence in 2024",
    "ft": "L'ONU recense plus de 5 600 morts dans les violences de 2024",
    "summary": "Annual UN figures document a grave increase in killings, kidnappings and displacement.",
    "fs": "Les chiffres annuels de l'ONU documentent une forte augmentation des meurtres, des enlèvements et des déplacements.",
    "body": "A United Nations human-rights assessment published early in 2025 reported that at least 5,626 people were killed and more than 2,200 injured in Haiti during 2024 in violence involving armed groups, security operations and self-defense groups. It also documented 1,494 kidnappings for ransom during the year. These figures are based on UN monitoring procedures and a defined calendar-year reporting period, not a comprehensive tally of all harm suffered by the population. The rise in violence disrupted education, healthcare, agriculture, transport and normal civic life. This annual entry helps contextualize individual attacks, but careful historical writing should avoid double-counting the same victims when combining it with incident-specific reports.",
    "fb": "Un bilan des Nations unies publié au début de 2025 recense au moins 5 626 morts, plus de 2 200 blessés et 1 494 enlèvements contre rançon en Haïti durant 2024. Ces chiffres reposent sur des méthodes de suivi de l'ONU et une période définie, sans représenter toutes les souffrances subies par les habitants. L'extension des violences affecte l'école, les soins, l'agriculture, les transports et la vie civique. Ce bilan annuel aide à replacer les événements particuliers dans leur contexte, tout en évitant de compter plusieurs fois les mêmes victimes.",
    "sources": [
      [
        "UN BINUH",
        "https://www.unmissions.org/en/binuh/press-releases/haiti-the-human-rights-situation-remains-very-alarming"
      ]
    ]
  }
];
export const research2024:HistEvent[]=entries.map(e=>({slug:e.slug,date:e.date,precision:(e.date.length===10?"day":e.date.length===7?"month":"year") as DatePrecision,dimension:e.dimension,categories:e.categories,location:e.location,title:e.title,summary:e.summary,body:e.body,fr:{title:e.ft,summary:e.fs,body:e.fb},sources:e.sources.map(([title,url])=>({title,url})),status:"documented",editorial:{verification:"corroborated",dateBasis:"documented event or year-end UN assessment",reviewedOn:"2026-11-01"}}));
