import type { HistoricalRecord, HistEvent } from "./types";

/** Reusable records. Add each historical subject once, then link it from many events. */
export const historicalRecords: HistoricalRecord[] = [
  {
    slug: "gonaives", type: "place", title: "Gonaïves",
    summary: "A coastal city in Haiti's Artibonite department, closely associated with the proclamation of independence on 1 January 1804.",
    body: "Gonaïves became one of the defining places in Haitian national history when Jean-Jacques Dessalines and other revolutionary leaders proclaimed independence there on 1 January 1804. The city is consequently remembered as the birthplace of independent Haiti. Its role should be understood in the wider geography of the final campaign of the Haitian Revolution, rather than as an isolated event.",
    location: "Artibonite, Haiti",
    fr: {
      title: "Les Gonaïves",
      summary: "Ville côtière du département de l'Artibonite, étroitement liée à la proclamation de l'indépendance le 1er janvier 1804.",
      body: "Les Gonaïves occupent une place centrale dans l'histoire nationale haïtienne. Jean-Jacques Dessalines et d'autres chefs révolutionnaires y proclamèrent l'indépendance le 1er janvier 1804. La ville est ainsi commémorée comme le lieu de naissance d'Haïti indépendante. Son rôle doit être replacé dans la géographie plus large de la campagne finale de la Révolution haïtienne.",
      location: "Artibonite, Haïti"
    },
    eventSlugs: ["haitian-independence-1804"],
    sources: [
      { title: "Archives numériques de la Révolution haïtienne (ANRHA)", url: "https://anrha.com/" },
      { title: "HaitiDocs: archives et documents publics", url: "https://www.haitidocs.org/sources/fr/" }
    ]
  },
  {
    slug: "act-of-independence-1804", type: "document", title: "The Haitian Act of Independence",
    summary: "The founding declaration issued on 1 January 1804, announcing the end of French colonial rule and the creation of an independent state.",
    body: "The Act of Independence announced the separation of the former colony of Saint-Domingue from France and established the name Haiti for the new state. It was proclaimed at Gonaïves on 1 January 1804 and is associated with Jean-Jacques Dessalines and the revolutionary leadership. Louis Boisrond-Tonnerre is commonly credited with drafting the declaration, although the document should be studied alongside the surrounding proclamations, correspondence and revolutionary records. The Act is a foundational primary source for the history of Haitian sovereignty.",
    dates: "1 January 1804",
    fr: {
      title: "Acte de l'Indépendance d'Haïti",
      summary: "Déclaration fondatrice proclamée le 1er janvier 1804, annonçant la fin de la domination coloniale française et la création d'un État indépendant.",
      body: "L'Acte de l'Indépendance proclame la séparation de l'ancienne colonie de Saint-Domingue d'avec la France et établit le nom d'Haïti pour le nouvel État. Il fut proclamé aux Gonaïves le 1er janvier 1804 et est associé à Jean-Jacques Dessalines et aux dirigeants révolutionnaires. Louis Boisrond-Tonnerre est généralement présenté comme son rédacteur, mais le document doit être étudié avec les proclamations, la correspondance et les autres archives de la période révolutionnaire. Il constitue une source primaire fondamentale pour l'histoire de la souveraineté haïtienne.",
      dates: "1er janvier 1804"
    },
    eventSlugs: ["haitian-independence-1804"],
    related: ["gonaives", "indigenous-army"],
    sources: [
      { title: "Archives numériques de la Révolution haïtienne (ANRHA)", url: "https://anrha.com/" },
      { title: "Recueil général des lois et actes de Pradine", url: "https://www.haitidocs.org/series/hti-pradine-recueil?lang=fr" }
    ]
  },
  {
    slug: "indigenous-army", type: "organization", title: "The Indigenous Army",
    summary: "The revolutionary army whose victory over the French expeditionary force made Haitian independence possible.",
    body: "The Indigenous Army was the name adopted by the revolutionary forces at the end of the Haitian Revolution. It brought together soldiers and commanders who had fought against the colonial system and the French expedition sent by Napoleon Bonaparte. Under Jean-Jacques Dessalines, the army defeated French forces at the Battle of Vertières in November 1803. Its leaders then proclaimed independence in January 1804. The name expressed a break with colonial rule and a claim to sovereignty rooted in the island.",
    fr: {
      title: "L'Armée indigène",
      summary: "L'armée révolutionnaire dont la victoire sur l'expédition française rendit possible l'indépendance d'Haïti.",
      body: "L'Armée indigène est le nom adopté par les forces révolutionnaires à la fin de la Révolution haïtienne. Elle réunissait des soldats et des commandants qui avaient combattu le système colonial et l'expédition française envoyée par Napoléon Bonaparte. Sous le commandement de Jean-Jacques Dessalines, elle vainquit les forces françaises à la bataille de Vertières en novembre 1803. Ses dirigeants proclamèrent ensuite l'indépendance en janvier 1804. Ce nom exprimait la rupture avec l'ordre colonial et une revendication de souveraineté enracinée dans l'île."
    },
    eventSlugs: ["haitian-independence-1804"], related: ["act-of-independence-1804"],
    sources: [{ title: "Archives numériques de la Révolution haïtienne (ANRHA)", url: "https://anrha.com/" }]
  },
  {
    slug: "haitian-flag", type: "object", title: "The Haitian flag",
    summary: "The national flag emerged from the revolutionary struggle and became a lasting symbol of Haitian sovereignty.",
    body: "The blue and red flag is traditionally associated with the Congress of Arcahaie on 18 May 1803, when revolutionary leaders adopted a banner distinct from the French tricolor. The familiar account says that the white band was removed from the French flag and the remaining colors joined. Details of the episode are transmitted through later accounts and should be distinguished from what surviving contemporary documents independently establish. The flag became a central symbol of the revolutionary army and the independent nation.",
    fr: {
      title: "Le drapeau haïtien",
      summary: "Le drapeau national est issu de la lutte révolutionnaire et demeure un symbole de la souveraineté haïtienne.",
      body: "Le drapeau bleu et rouge est traditionnellement associé au Congrès de l'Arcahaie du 18 mai 1803, lorsque les chefs révolutionnaires adoptèrent un étendard distinct du tricolore français. Selon le récit le plus connu, la bande blanche du drapeau français fut retirée et les deux autres couleurs réunies. Les détails de cet épisode proviennent de récits transmis ultérieurement et doivent être distingués de ce que les documents contemporains conservés permettent d'établir indépendamment. Le drapeau devint un symbole central de l'armée révolutionnaire et de la nation indépendante."
    },
    eventSlugs: ["haitian-independence-1804", "arcahaie-flag"], related: ["indigenous-army"],
    sources: [{ title: "Archives numériques de la Révolution haïtienne (ANRHA)", url: "https://anrha.com/" }]
  }
];

export const haitianIndependenceEvent: HistEvent = {
  slug: "haitian-independence-1804",
  title: "Haiti declares independence",
  date: "1804-01-01", precision: "day", dimension: "inside",
  categories: ["politics", "world"], location: "Gonaïves",
  summary: "On 1 January 1804, Jean-Jacques Dessalines proclaimed the independence of the former French colony of Saint-Domingue and announced the name Haiti for the new state.",
  body: "At Gonaïves, Jean-Jacques Dessalines, commander-in-chief of the revolutionary forces, proclaimed the separation of the former colony of Saint-Domingue from France. The declaration named the new country Haiti, reviving the Indigenous name of the island, and rejected the restoration of French colonial rule. The Act of Independence was issued in the name of the new state and associated with Dessalines and the revolutionary generals. Louis Boisrond-Tonnerre is commonly credited with drafting its text. The proclamation followed the revolutionary army's victory at Vertières in November 1803 and the collapse of the French expedition's position. Independence created a sovereign state, but it did not end the dangers facing the new country: France and other slaveholding powers remained hostile, diplomatic recognition was withheld for decades, and Haiti faced military and economic pressure. The violence against many of the remaining French inhabitants in the months that followed is an important, distinct part of the 1804 story and should be examined in its own context.",
  context: "The declaration followed more than a decade of revolution, the defeat of Napoleon's expeditionary force, the French surrender at the end of 1803, and the victory of the revolutionary army at Vertières on 18 November 1803.",
  causes: "The revolution grew from the violence and inequalities of the slave-colonial system, the political crisis unleashed by the French Revolution, the resistance of enslaved people and free people of color, and the determination of revolutionary leaders to prevent the restoration of slavery and colonial rule.",
  consequences: "Haiti became an independent state and the first sovereign nation founded through a successful revolt of enslaved people. Its independence challenged the Atlantic slave system and shaped international politics, while bringing diplomatic isolation, military threats and economic pressure from slaveholding powers.",
  status: "documented", highlight: true,
  people: ["jean-jacques-dessalines"],
  records: ["gonaives", "act-of-independence-1804", "indigenous-army", "haitian-flag"],
  related: ["vertieres", "massacre-1804"],
  sources: [
    { title: "Archives numériques de la Révolution haïtienne (ANRHA)", url: "https://anrha.com/" },
    { title: "HaitiDocs: Recueil général des lois et actes de Pradine", url: "https://www.haitidocs.org/series/hti-pradine-recueil?lang=fr" }
  ],
  fr: {
    title: "Haïti proclame son indépendance",
    summary: "Le 1er janvier 1804, Jean-Jacques Dessalines proclama l'indépendance de l'ancienne colonie française de Saint-Domingue et annonça le nom d'Haïti pour le nouvel État.",
    body: "Aux Gonaïves, Jean-Jacques Dessalines, commandant en chef des forces révolutionnaires, proclama la séparation de l'ancienne colonie de Saint-Domingue d'avec la France. La déclaration donna le nom d'Haïti au nouveau pays, reprenant le nom autochtone de l'île, et rejeta le rétablissement de la domination coloniale française. L'Acte de l'Indépendance fut publié au nom du nouvel État et associé à Dessalines et aux généraux révolutionnaires. Louis Boisrond-Tonnerre est généralement présenté comme son rédacteur. La proclamation suivit la victoire de l'armée révolutionnaire à Vertières en novembre 1803 et l'effondrement de la position de l'expédition française. L'indépendance créa un État souverain, mais ne mit pas fin aux dangers auxquels le pays devait faire face : la France et d'autres puissances esclavagistes demeurèrent hostiles, la reconnaissance diplomatique fut refusée pendant des décennies et Haïti subit des pressions militaires et économiques. Les violences contre une grande partie des Français restés dans le pays au cours des mois suivants constituent un volet important et distinct de l'histoire de 1804, qui doit être étudié dans son propre contexte.",
    context: "La déclaration suivit plus d'une décennie de révolution, la défaite de l'expédition napoléonienne, la capitulation française à la fin de 1803 et la victoire de l'armée révolutionnaire à Vertières le 18 novembre 1803.",
    causes: "La révolution prit naissance dans la violence et les inégalités du système esclavagiste et colonial, la crise politique déclenchée par la Révolution française, la résistance des personnes réduites en esclavage et des libres de couleur, ainsi que la détermination des dirigeants révolutionnaires à empêcher le rétablissement de l'esclavage et de la domination coloniale.",
    consequences: "Haïti devint un État indépendant et la première nation souveraine issue d'une révolte victorieuse de personnes réduites en esclavage. Son indépendance remit en cause le système esclavagiste atlantique et transforma la politique internationale, tout en entraînant isolement diplomatique, menaces militaires et pressions économiques de la part des puissances esclavagistes.",
    location: "Les Gonaïves"
  }
};
