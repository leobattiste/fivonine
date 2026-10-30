import type { EssayBlock } from "./types";

/** Volume I: Before Haiti, the island before 1492. Supplied research, edited for readers. */
const s = (n: string, title: string): EssayBlock => ({ type: "section", n, title });
const sub = (title: string): EssayBlock => ({ type: "sub", title });
const p = (text: string): EssayBlock => ({ type: "p", text });
const list = (...items: string[]): EssayBlock => ({ type: "list", items });
const note = (label: string, text: string): EssayBlock => ({ type: "note", label, text });

export const indigenousChapter: EssayBlock[] = [
  { type: "section", title: "Before the world knew Haiti" },
  p("The story of Haiti does not begin with Christopher Columbus. It does not begin with France, Spain, slavery, or the Haitian Revolution. It begins thousands of years earlier, with the people who inhabited the island long before Europeans arrived."),
  p("Before the name Saint-Domingue appeared on European maps, before plantations transformed the land, before colonial powers fought over its resources, and before Haiti became the first independent Black republic, this island was already home to communities with their own identities, languages, traditions, systems of leadership, agricultural knowledge, spiritual beliefs, and relationships with neighboring islands."),
  p("The island's Indigenous history is not a footnote to Haiti's story. It is part of its foundation. This chapter begins with the evidence available about those worlds, and makes an important distinction: the island's Indigenous past is shared by the territories that are now Haiti and the Dominican Republic. Modern national borders did not exist in the pre-European period."),

  s("1", "The land and its geography"),
  p("The island known today as Hispaniola occupies a strategically important position in the Greater Antilles, between Cuba, Jamaica, Puerto Rico, and the smaller Caribbean islands. Today, its western portion is the Republic of Haiti and its eastern portion is the Dominican Republic. Its geography helped shape the lives of its earliest inhabitants. The island contains:"),
  list("Mountain ranges and highland valleys.", "River systems and fertile agricultural areas.", "Coastal plains and fishing grounds.", "Bays, reefs, and natural harbors.", "Forests and diverse ecological zones.", "Areas with different rainfall, soil, and growing conditions."),
  p("These were not simply features of the landscape. They influenced where people settled, what they cultivated, how they traveled, and how communities exchanged goods. The mountains and valleys were sources of water, food, materials, and shelter. Coastal communities could draw on fishing, shellfish, and maritime exchange; inland communities could cultivate root crops and other plants. Rivers and coastal routes helped connect settlements. The island was not one uniform environment, and its different regions encouraged interaction between communities."),

  s("2", "The first inhabitants"),
  p("People lived in the Caribbean thousands of years before Columbus. Archaeological evidence suggests that the earliest inhabitants of Hispaniola arrived by sea, as part of wider movements of people through the Caribbean. Archaeologists continue to study the timing, routes, origins, and relationships of these early populations, so no single migration story should be presented as settled."),
  p("Over many centuries, communities developed different technologies, food systems, settlement patterns, and cultural traditions. Some relied more heavily on fishing, gathering, and hunting; others developed increasingly intensive agriculture and pottery production. By the centuries immediately before European arrival, the island supported substantial, settled communities with sophisticated political and economic organization."),
  sub("Understanding the name Taíno"),
  p("The word Taíno is widely used today for Indigenous peoples of much of the Greater Antilles, including Hispaniola. Scholars caution that it should not automatically be treated as the exact name every Indigenous person on the island used for themselves in 1492. Archaeology, linguistics, and Spanish accounts do not always align neatly, and the label should not erase local identities or differences. Research on the languages of the Greater Antilles identifies several speech communities in the historical record, including Taíno varieties, Macorís, and Ciguayo; the evidence is incomplete and classifications remain debated."),

  s("3", "Indigenous societies"),
  p("The Indigenous societies of Hispaniola were not isolated groups without political structures or economies. They developed communities, networks of exchange, agricultural knowledge, skilled crafts, and systems of leadership. Archaeology has helped reconstruct this history through pottery, tools, ornaments, food remains, settlement patterns, and the remains of houses and ceremonial spaces."),
  sub("Agriculture and food"),
  p("Agriculture was central to many Taíno communities. One of their most important crops was cassava, also known as manioc or yuca, grown in raised or mounded plots called conucos that suited root crops in tropical conditions. Other foods included sweet potatoes, maize, beans, peanuts, peppers, and other cultivated plants and fruits, complemented by fishing and shellfish gathering."),
  p("Cassava could provide a substantial food supply, but processing bitter cassava required careful preparation to remove naturally occurring toxic compounds, knowledge that was part of a wider Indigenous Caribbean food tradition. Farming demanded an understanding of soils, seasons, water, plant varieties, storage, and labor."),
  note("Historical significance", "Indigenous agricultural knowledge became part of the foundation of Caribbean food history. Cassava and other Indigenous crops would eventually spread far beyond the region."),
  sub("Fishing, hunting and the sea"),
  p("The sea was a source of food, transportation, and connection. Coastal communities used fish, shellfish, and other marine resources, and rivers contributed to food supplies. The surrounding waters connected Hispaniola to other islands: people moved between them, exchanged goods, and maintained relationships long before European ships arrived. The sea was a living network, not a barrier."),
  sub("Trade and craftsmanship"),
  p("Communities produced objects for everyday use, social exchange, and ceremony, including:"),
  list("Pottery vessels and decorated ceramics.", "Cotton textiles.", "Woven objects and baskets.", "Stone tools.", "Shell ornaments.", "Carved wood objects.", "Personal ornaments and ceremonial objects."),
  p("Cotton was cultivated and spun into cloth, and skilled craftspeople produced objects that circulated through trade networks across the islands. These economies were not isolated household subsistence; they were connected through exchange and relationships."),
  sub("Political organization and leadership"),
  p("At the time of European contact, Hispaniola was organized into several major political territories known as cacicazgos, or chiefdoms, each led by a cacique, a term recorded in Spanish sources that adapted Indigenous terminology. Leadership was hereditary in important contexts, and authority operated through networks of communities and subordinate leaders. Historians and archaeologists commonly identify five major chiefdoms:"),
  { type: "table", head: ["Chiefdom", "Region and leader at contact"], rows: [
    ["Maguá", "The northeast. Its leader is commonly identified as Guarionex."],
    ["Marien", "The northwest, including the northern region of today's Haiti. Spanish accounts name Guacanagarí as its cacique."],
    ["Maguana", "The central interior. Caonabo is one of the best-known leaders connected to it."],
    ["Jaragua", "The southwest, including much of the western and southern region. Anacaona is one of its most prominent figures."],
    ["Higüey", "The east. Cotubanamá is a prominent leader associated with it in the later contact period."],
  ] },
  p("These chiefdoms were not modern countries or provinces; their boundaries should be reconstructed from historical and archaeological evidence rather than drawn as exact borders. Their leaders belong to the history of the entire island, not exclusively to either modern nation."),
  sub("Social organization and family"),
  p("Spanish accounts describe nitaínos as an elite group associated with leadership and the organization of labor and exchange; naborías, generally understood as the broader population; and behiques, people with religious, healing, and ceremonial responsibilities. These terms reach us through colonial-era observers who interpreted Indigenous institutions through their own categories, so they should be used with care."),
  p("Research suggests that descent and kinship could be traced through the maternal line. Women had important roles in household, agricultural, social, and political life; the precise distribution of authority between women and men cannot be fully reconstructed from surviving sources, and their positions deserve specific study."),
  sub("Spirituality and the natural world"),
  p("Taíno religious traditions included relationships with spiritual beings often represented through objects known as zemí or cemí, made from stone, wood, shell, and other materials. They were not decorative sculptures but objects of religious, social, and ceremonial significance. Spanish accounts describe ceremonies called areítos, with singing, dancing, storytelling, and the remembrance of ancestors and important events."),
  p("One of the earliest important accounts of Taíno beliefs was written by Ramón Pané, a friar who studied them in the 1490s. His work is valuable but must be read critically, because it was produced within the colonial encounter. Much of what was written about Indigenous spirituality comes from Europeans who arrived after 1492, and not every detail can be reconstructed."),
  sub("Architecture and settlement life"),
  p("Settlements included houses, communal spaces, and areas for ceremonial and social activities. Archaeological research at En Bas Saline in northern Haiti has provided unusually detailed evidence of an Indigenous town that existed before and after Columbus's arrival. Occupied from roughly 1250 to 1520 CE, it is considered the largest late pre-contact Taíno town documented in what is now Haiti, and one of the rare sites where archaeologists can study ordinary life, through homes, food preparation, crafts, and ceramics, on both sides of European contact."),
  sub("Music, dance, storytelling and memory"),
  p("The areíto was more than entertainment. Spanish observers described collective singing, dancing, and the recounting of stories and events that preserved memory, transmitted knowledge, and reinforced community identity. Melodies and instruments cannot be fully reconstructed, but organized music, dance, and oral memory were clearly part of life before colonization."),
  sub("Knowledge of the environment"),
  p("Indigenous communities understood local plants, food sources, soils, waterways, fishing areas, and seasons, and their settlement choices reflected that knowledge. Recent research emphasizes that Indigenous knowledge of the landscape shaped even the early European presence on the island, a significant correction to older narratives that treated Indigenous people as passive figures in a European story."),

  s("4", "How many people lived on the island?"),
  p("There is no universally accepted figure. Published estimates range from about 100,000 to more than one million, and some historical estimates reach several million. The differences reflect problems with early Spanish records, assumptions about settlement size, incomplete archaeological evidence, and disagreement about how to reconstruct population losses after contact. Archaeological evidence about village size has led some researchers to favor the higher end of the range, but no definitive count exists."),
  note("How Fivonine records this", "Population: unknown, with estimates that vary considerably. Evidence: Spanish colonial accounts, archaeological settlement surveys, and demographic reconstructions. No surviving census gives a reliable count for 1492, and no disputed estimate is presented here as fact."),
  p("What is certain is that Hispaniola was not an empty island waiting to be discovered. It was inhabited by established communities with settlements, political structures, food systems, and regional connections."),

  s("5", "Beyond Hispaniola"),
  p("The Indigenous peoples of Hispaniola were part of a much wider Caribbean world of migration, exchange, language, and shared traditions, reaching across Cuba, Jamaica, Puerto Rico, the Bahamas and Turks and Caicos, the Lesser Antilles, and the northern coast of South America. Archaeological and linguistic research shows these communities had diverse histories rather than forming one uniform population. Seeing the island this way places its history within a larger story of Indigenous Caribbean civilization."),

  s("6", "The name Ayiti"),
  p("The name Ayiti, rendered as Haiti in French and English, is often explained as an Indigenous name meaning 'land of mountains' or 'mountainous land'. Early colonial accounts preserve Indigenous place names, but their spellings and meanings are not always consistent, and both the name's use for the whole island and its meaning have been debated by historians."),
  p("What is certain is that the independent Haitian state deliberately adopted the name in 1804, choosing a name associated with the island's Indigenous past rather than the French colonial name Saint-Domingue."),

  s("7", "What survives of Indigenous Haiti?"),
  p("The Indigenous past did not simply vanish. Although colonization caused catastrophic disruption, Indigenous ancestry, cultural knowledge, archaeological remains, and elements of tradition continue to matter in the Caribbean. A 2018 genetic study in the _Proceedings of the National Academy of Sciences_ found evidence of Indigenous Caribbean ancestry surviving in present-day populations, evidence against the claim that Indigenous people disappeared without descendants, though genetics alone cannot establish anyone's cultural identity."),
  p("Indigenous legacies also deserve investigation through:"),
  list("Place names and language.", "Food and agricultural knowledge.", "Archaeological sites and artifacts.", "Traditional knowledge of plants and the environment.", "Oral histories and cultural memory.", "Contemporary Indigenous-descendant communities and their own accounts."),
  p("Not every Caribbean custom has an Indigenous origin; each claimed connection needs evidence."),

  s("8", "Chronology before 1492"),
  p("Written year-by-year records do not exist for most of this period, and inventing an event for every year would be misleading. The earliest history is organized here by archaeological periods and approximate dates. These are broad guideposts, refined as research advances."),
  { type: "table", head: ["Approximate period", "Development"], rows: [
    ["Several thousand years ago", "Early human settlement of the Caribbean and the Greater Antilles."],
    ["Before 1000 BC", "Early communities establish themselves across parts of the Caribbean."],
    ["Around 1000 BC", "Saladoid cultural traditions develop in northeastern South America."],
    ["Around 250 BC", "Saladoid-related traditions reach eastern Hispaniola."],
    ["First millennium AD", "Communities develop distinct regional traditions, technologies, and settlement patterns."],
    ["Around AD 600 onward", "Local cultural developments and changing patterns of settlement and exchange."],
    ["AD 800–1200", "Settlement growth in parts of northern Hispaniola."],
    ["AD 1200–1492", "Increasing settlement density and complex political and regional networks."],
    ["Around AD 1250–1520", "En Bas Saline is occupied, leaving a record across the period of European contact."],
    ["Late 1400s", "Multiple chiefdoms and established communities exist across Hispaniola."],
  ] },

  s("9", "Key people and records"),
  p("Several of these individuals are known mainly from accounts written after 1492, so their stories continue in the chapters on the contact period. Fivonine does not create portraits, invented quotations, or unsupported biographical details for them."),
  { type: "people", items: [
    { name: "Guacanagarí", slug: "guacanagari", text: "cacique of Marien in the north." },
    { name: "Caonabo", slug: "caonabo", text: "cacique of Maguana, remembered for resistance." },
    { name: "Anacaona", slug: "anacaona", text: "leader of Jaragua, poet, and a central figure of the contact era." },
    { name: "Guarionex", slug: "guarionex", text: "cacique of Maguá." },
    { name: "Cotubanamá", slug: "cotubanama", text: "leader associated with Higüey." },
    { name: "Ramón Pané", slug: "ramon-pane", text: "early European chronicler of Indigenous religious traditions." },
    { name: "En Bas Saline", text: "major archaeological site in northern Haiti." },
  ] },

  s("10", "Why this chapter matters"),
  list(
    "Haiti has an Indigenous history. Its story did not begin with European colonization.",
    "The island already had political and economic organization: communities cultivated food, produced crafts, exchanged goods, and maintained systems of leadership.",
    "The Caribbean was interconnected. Hispaniola belonged to a wider Indigenous world.",
    "Indigenous people were historical actors who made decisions, negotiated, defended their communities, and adapted.",
    "The Indigenous past remains relevant through archaeology, genetics, place names, agriculture, and cultural memory.",
  ),

  s("11", "Sources"),
  { type: "biblio", items: [
    "Kathleen Deagan, _En Bas Saline: A Taíno Town before and after Columbus_ (University Press of Florida, 2023).",
    "Florida Museum of Natural History, Taíno Society: research on agriculture, trade, political organization, and social roles.",
    "Florida Museum of Natural History, Taíno Culture History: research on origins, cultural development, and population-estimate debates.",
    "Corinne L. Hofman and colleagues, 'Indigenous Caribbean perspectives: archaeologies and legacies of the first colonised region in the New World', _Antiquity_ (2018).",
    "Hannes Schroeder and colleagues, 'Origins and genetic legacies of the Caribbean Taino', _Proceedings of the National Academy of Sciences_ (2018).",
    "William M. Denevan, ed., _The Native Population of the Americas in 1492_ (1992).",
    "David Geggus, 'The Naming of Haiti'.",
    "Samuel M. Wilson, _The Archaeology of the Caribbean_ (2012).",
  ] },

  s("12", "What comes next: 1492–1499"),
  p("The next chapter follows European arrival, Indigenous resistance, and the beginning of Spanish colonial rule:"),
  list(
    "1492: Columbus reaches Hispaniola, and the first encounters between Indigenous communities and Europeans.",
    "Guacanagarí, the wreck of the _Santa María_, and La Navidad.",
    "Spanish settlement and the founding of La Isabela.",
    "Caonabo, Guarionex, and Anacaona.",
    "Spanish demands for labor, food, tribute, and resources, and the beginnings of forced labor.",
    "Indigenous resistance, negotiation, and survival.",
    "European diseases and their demographic consequences, and Spain's expanding imperial ambitions.",
  ),
  note("Editorial note", "This chapter is a foundation, not a claim that Indigenous history has been exhausted. It will keep growing with Haitian archaeological scholarship, primary sources, and Indigenous-descendant perspectives, and the same standard applies to every period that follows."),
];
