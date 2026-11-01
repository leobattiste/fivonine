import type { Category, Content, HistEvent, Period, Person } from "./types";\nimport { periodMedia } from "./period-media";
import { subjectNotes } from "./answers";
import { moreEvents, morePeople } from "./events-more";
import { yearEvents, yearPeople } from "./events-years";
import { essays } from "./essays";
import { periodsFr } from "./fr/periods";
import { events1790s, people1790s, essay1790s, notes1790s, biblio1790s } from "./decade-1790s";
import { events1790sFr, people1790sFr, essay1790sFr } from "./fr/decade-1790s";
import { indigenousChapter } from "./chapter-indigenous";
import { chaptersA, eventsA } from "./chapters-a";
import { chaptersB, eventsB, periodInfoB } from "./chapters-b";
import { chaptersC, eventsC, legacyC, periodInfoC } from "./chapters-c";
import { SECTIONS, notesToSections, toSections } from "./sections";

/**
 * Bundled starter content. It mirrors the Supabase schema exactly, so the site runs
 * with zero configuration and `npm run seed` can push it into the database.
 *
 * Editorial rule: nothing is invented to fill a decade. Periods without researched
 * entries show a transparent "being researched" state instead.
 */

export const categories: Category[] = [
  { slug: "politics", name: "Politics & Government", short: "Politics" },
  { slug: "economy", name: "Economy & Finance", short: "Economy" },
  { slug: "foreign-relations", name: "Foreign Relations", short: "Foreign relations" },
  { slug: "wars", name: "Wars & Conflicts", short: "Wars" },
  { slug: "music", name: "Music & Entertainment", short: "Music" },
  { slug: "arts", name: "Arts & Literature", short: "Arts" },
  { slug: "society", name: "Society & Daily Life", short: "Society" },
  { slug: "education", name: "Education & Science", short: "Education" },
  { slug: "religion", name: "Religion & Spirituality", short: "Religion" },
  { slug: "sports", name: "Sports & Recreation", short: "Sports" },
  { slug: "business", name: "Business & Agriculture", short: "Business" },
  { slug: "contributions", name: "International Contributions", short: "Contributions" },
  { slug: "major-events", name: "Major Events & Disasters", short: "Major events" },
];

export const periods: Period[] = [
  {
    slug: "indigenous-ayiti",
    kind: "era",
    label: "Indigenous Ayiti",
    start: -4000,
    end: 1491,
    title: "The island its people called Ayiti",
    overview:
      "For thousands of years before Europeans arrived, the island was home to successive Indigenous peoples. By the late fifteenth century the Taíno organized the island into chiefdoms (cacicazgos) led by caciques, with farming built on cassava, maize and conucos (mounded fields). The name Ayiti — often glossed as 'land of high mountains' — is the name Haiti reclaimed at independence.",
    legacy: "Dessalines and the founders deliberately chose the Taíno name Ayiti in 1804, tying the new nation to the island's first people.",
  },
  {
    slug: "conquest",
    kind: "era",
    label: "Conquest & Hispaniola",
    start: 1492,
    end: 1658,
    title: "Conquest, collapse and a contested coast",
    overview:
      "Columbus reached the island in December 1492 and Spain built its first American colony here. Violence, forced labor and epidemic disease devastated the Taíno within decades. Spain concentrated on the east; by the seventeenth century the western coast and Tortuga drew French and other buccaneers.",
  },
  {
    slug: "saint-domingue",
    kind: "era",
    label: "Saint-Domingue",
    start: 1659,
    end: 1789,
    title: "The wealthiest colony, built on enslavement",
    overview:
      "France formalized its hold on the western third of the island in 1697. Saint-Domingue became the most profitable colony in the Americas, producing a large share of the world's sugar and coffee through the forced labor of hundreds of thousands of enslaved Africans. Free people of color, maroons and enslaved people alike resisted the system in many forms.",
    legacy: "The colony's extreme inequality and brutality set the conditions for the revolution of 1791.",
  },
  decade(1790, "Revolution", "An uprising of the enslaved becomes a revolution",
    "In August 1791 enslaved people in the Northern Plain rose up, beginning the Haitian Revolution. Over the decade, France abolished slavery in the colony (1793–94) under pressure from the insurgency, and Toussaint Louverture rose to command.",
    "The decade turned enslaved people into soldiers, generals and political actors, and forced the first general abolition of slavery by a European power."),
  decade(1800, "Independence", "From Vertières to the first free Black republic",
    "Napoleon's expedition tried to restore French control and, many feared, slavery. Toussaint was captured and died in France. Under Dessalines, the indigenous army defeated the French at Vertières, and Haiti declared independence on 1 January 1804. Dessalines was assassinated in 1806 and the country split between north and south.",
    "Independence made Haiti a symbol for enslaved and colonized people worldwide, and an object of hostility for slaveholding powers."),
  decade(1810, "Two Haitis", "A kingdom in the north, a republic in the south",
    "Henri Christophe ruled the north as King Henry I, building the Citadelle Laferrière and the Sans-Souci palace, while Alexandre Pétion led the republic in the south. Pétion sheltered and supplied Simón Bolívar in 1815–16, asking in return that he free the enslaved in the lands he liberated.",
    "Haitian support for Bolívar is one of the clearest early cases of Haiti exporting freedom abroad."),
  decade(1820, "Reunification & Ransom", "One Haiti — and a bill from France",
    "After Christophe's death in 1820, Jean-Pierre Boyer reunited the country and in 1822 brought the whole island under Haitian rule. In 1825, under threat of a French fleet, Boyer accepted Charles X's ordinance demanding 150 million francs in exchange for French recognition.",
    "The indemnity and the loans taken to pay it shaped Haitian public finances for generations."),
  decade(1830, "Renegotiation", "The indemnity is cut — but not cancelled",
    "In 1838 France and Haiti signed treaties reducing the remaining indemnity to 90 million francs and formally recognizing Haitian independence. Boyer's long rule continued amid growing discontent."),
  decade(1840, "Upheaval", "Boyer falls and the island divides",
    "Boyer was overthrown in 1843. In 1844 the eastern part of the island declared independence as the Dominican Republic. A rapid succession of presidents followed until Faustin Soulouque took power in 1847."),
  decade(1860, "Recognition", "Washington finally recognizes Haiti",
    "Under President Fabre Geffrard, Haiti signed a Concordat with the Vatican (1860). In 1862 the United States — its Southern slaveholding bloc absent from Congress during the Civil War — recognized Haiti nearly six decades after independence."),
  decade(1880, "Ideas", "A Haitian answer to scientific racism",
    "In 1885 the Haitian anthropologist and diplomat Anténor Firmin published De l'égalité des races humaines in Paris, a direct rebuttal of Arthur de Gobineau's theories of racial hierarchy."),
  decade(1910, "Occupation", "Instability, foreign banks and the Marines",
    "A rapid turnover of governments coincided with growing foreign control of Haitian finance. In December 1914 US Marines removed gold from the Haitian national bank to New York. After the killing of President Vilbrun Guillaume Sam in July 1915, the United States invaded and began a nineteen-year occupation, met by armed Caco resistance led by Charlemagne Péralte.",
    "The occupation reorganized Haitian finances, the army and the state around US priorities, with effects that outlasted it."),
  decade(1920, "Under Occupation", "Resistance in arms, in print and in the streets",
    "The US occupation continued under President Louis Borno. Intellectuals answered with a cultural movement: Jean Price-Mars's Ainsi parla l'oncle (1928) urged Haitians to value their African heritage and peasant culture. In December 1929 Marines fired on protesters at Marchaterre near Les Cayes, intensifying pressure to end the occupation.",
    "Price-Mars's ideas fed indigénisme and, later, the Négritude movement; Marchaterre accelerated US withdrawal."),
  decade(1930, "Withdrawal & Massacre", "The Marines leave; terror at the border",
    "President Sténio Vincent negotiated the end of the occupation, and the last US Marines left in August 1934. In October 1937 Dominican dictator Rafael Trujillo ordered the killing of Haitians and Dominicans of Haitian descent in the borderlands — the Parsley Massacre.",
    "The massacre remains a central wound in Haitian–Dominican relations."),
  decade(1940, "Renaissance", "A painting boom and a student revolution",
    "The Centre d'Art opened in Port-au-Prince in 1944 and helped launch a generation of self-taught painters to international fame. In January 1946 student-led protests toppled President Élie Lescot, and Dumarsais Estimé came to power. In 1947 Haiti paid off the remaining US-held debt from the occupation era."),
  decade(1950, "Konpa & Duvalier", "A new sound, and the rise of a dictator",
    "Bandleader Nemours Jean-Baptiste popularized konpa direk from 1955, a sound that would define Haitian popular music. In 1957 François Duvalier won the presidency, beginning a dictatorship that would last, with his son, until 1986."),
  decade(1970, "Baby Doc", "A young dictator and a global stage",
    "François Duvalier died in 1971 and his son Jean-Claude became president-for-life at 19. Haiti qualified for the 1974 FIFA World Cup, where Emmanuel Sanon scored against Italy. Thousands fled by sea, many toward Florida."),
  decade(1980, "Dechoukaj", "The fall of the Duvaliers",
    "Popular protests forced Jean-Claude Duvalier into exile on 7 February 1986. A new constitution was approved by referendum in 1987, while elections that year were aborted by violence. Roots music (mizik rasin) grew as a voice of the movement."),
  decade(1990, "Democracy Interrupted", "An election, a coup and a return",
    "Jean-Bertrand Aristide won the December 1990 election, Haiti's first widely recognized free presidential vote, but was ousted by the army in September 1991. After years of repression and an international embargo, a US-led multinational force restored him in 1994."),
  decade(2010, "Goudougoudou", "Earthquake, cholera and protest",
    "On 12 January 2010 a magnitude 7.0 earthquake struck near Port-au-Prince, killing tens of thousands of people at minimum (official figures were far higher and are disputed). Later that year cholera was introduced, a link the UN acknowledged in 2016. From 2018, protests over the PetroCaribe funds drew huge crowds."),
  decade(2020, "Now", "A presidency ended by assassination; a crisis still unfolding",
    "President Jovenel Moïse was assassinated at his home on 7 July 2021. In August 2021 an earthquake struck the southern peninsula. Armed gangs expanded their control in and around Port-au-Prince, and international security missions were authorized. This decade is ongoing.",
    undefined,
    "Events after mid-2026 are not yet covered. This chapter is updated as the record develops."),
];

// Fill decades between 1790s and 2020s that have no researched chapter yet,
// so no period is skipped — they render transparently as "being researched".
(function fillMissingDecades() {
  for (let y = 1790; y <= 2020; y += 10) {
    const slug = `${y}s`;
    if (!periods.find((p) => p.slug === slug)) {
      periods.push({
        slug,
        kind: "decade",
        label: `The ${y}s`,
        start: y,
        end: y + 9,
        title: "This chapter is being researched",
        overview: "",
        researchNote:
          "Fivonine does not invent history to fill a page. Researched entries for this decade are being prepared and reviewed.",
      });
    }
  }
  periods.sort((a, b) => a.start - b.start);
  for (const p of periods) {
    if (subjectNotes[p.slug]) p.notes = subjectNotes[p.slug];
    if (essays[p.slug]) p.essay = essays[p.slug];
    if (periodsFr[p.slug]) p.fr = { ...(p.kind === "decade" ? { label: `Les années ${p.start}` } : {}), ...periodsFr[p.slug] };
    if (p.slug === "1790s") { p.essay = essay1790s.map((b, i) => (essay1790sFr[i] ? { ...b, fr: essay1790sFr[i] } : b) as typeof b); p.biblio = biblio1790s; p.notes = { ...p.notes, ...notes1790s }; }
    if (p.slug === "indigenous-ayiti") p.essay = indigenousChapter;
    const chapter = chaptersA[p.slug] ?? chaptersB[p.slug] ?? chaptersC[p.slug];
    if (chapter && !p.essay) p.essay = chapter;
    const info = periodInfoB[p.slug] ?? periodInfoC[p.slug];
    if (info) { Object.assign(p, info); p.researchNote = undefined; }
    if (!p.legacy && legacyC[p.slug]) p.legacy = legacyC[p.slug];
  }
})();

function decade(start: number, title: string, headline: string, overview: string, legacy?: string, researchNote?: string): Period {
  return {
    slug: `${start}s`,
    kind: "decade",
    label: `The ${start}s`,
    start,
    end: start + 9,
    title: `${title}: ${headline}`,
    overview,
    legacy,
    researchNote,
  };
}

const wiki = (t: string) => `https://en.wikipedia.org/wiki/${t}`;

export const events: HistEvent[] = [
  // ——— Eras ———
  {
    slug: "columbus-reaches-ayiti",
    title: "Columbus reaches Ayiti",
    date: "1492-12-05",
    precision: "day",
    dimension: "foreign",
    categories: ["foreign-relations", "major-events"],
    countries: ["Spain"],
    location: "Môle Saint-Nicolas",
    summary:
      "Christopher Columbus's ships landed on the island's northwest coast. On 24–25 December the Santa María ran aground and the crew built La Navidad, the first European settlement in the Americas.",
    consequences:
      "Spanish colonization brought forced labor, violence and epidemic disease that devastated the Taíno population within a few decades.",
    status: "documented",
    people: ["guacanagari"],
    sources: [{ title: "La Navidad", url: wiki("La_Navidad") }, { title: "Taíno", url: wiki("Ta%C3%ADno") }],
  },
  {
    slug: "treaty-of-ryswick",
    title: "Treaty of Ryswick and the birth of Saint-Domingue",
    date: "1697-09-20",
    precision: "day",
    dimension: "foreign",
    categories: ["foreign-relations", "politics"],
    countries: ["France", "Spain"],
    location: "Rijswijk, Dutch Republic",
    summary:
      "The peace ending the Nine Years' War is generally taken as Spain's recognition of French control over the western third of Hispaniola, which became Saint-Domingue.",
    consequences: "France built a plantation colony there that became the most profitable in the Americas.",
    status: "documented",
    sources: [{ title: "Peace of Ryswick", url: wiki("Peace_of_Ryswick") }, { title: "Saint-Domingue", url: wiki("Saint-Domingue") }],
  },
  {
    slug: "siege-of-savannah",
    title: "Saint-Domingue volunteers fight at Savannah",
    date: "1779-10-09",
    precision: "day",
    dimension: "abroad",
    categories: ["wars", "contributions"],
    countries: ["United States", "France"],
    location: "Savannah, Georgia",
    summary:
      "The Chasseurs-Volontaires de Saint-Domingue, a regiment of free men of color recruited in the colony, fought alongside French and American forces in the Siege of Savannah during the American Revolutionary War.",
    consequences:
      "Several veterans of Savannah, including Henri Christophe, according to tradition, later became leaders of the Haitian Revolution.",
    status: "documented",
    people: ["henri-christophe"],
    related: ["bois-caiman"],
    sources: [{ title: "Chasseurs-Volontaires de Saint-Domingue", url: wiki("Chasseurs-Volontaires_de_Saint-Domingue") }],
  },
  // ——— 1790s ———
  {
    slug: "bois-caiman",
    title: "Bois Caïman and the uprising of the North",
    date: "1791-08-14",
    precision: "day",
    dimension: "inside",
    categories: ["wars", "religion", "major-events"],
    location: "Northern Plain, near Cap-Français",
    summary:
      "According to tradition, a ceremony at Bois Caïman led by Dutty Boukman and Cécile Fatiman preceded the uprising that broke out on the night of 22 August 1791, when enslaved people across the Northern Plain rose against the plantations.",
    context: "Saint-Domingue held roughly half a million enslaved people under one of the most brutal plantation systems in the Americas.",
    consequences: "The revolt grew into the Haitian Revolution, the only successful revolution of enslaved people to found a state.",
    status: "documented",
    people: ["dutty-boukman"],
    related: ["french-abolition-1794"],
    sources: [{ title: "Bois Caïman", url: wiki("Bois_Ca%C3%AFman") }, { title: "Haitian Revolution", url: wiki("Haitian_Revolution") }],
  },
  {
    slug: "french-abolition-1794",
    title: "France abolishes slavery in its colonies",
    date: "1794-02-04",
    precision: "day",
    dimension: "foreign",
    categories: ["politics", "foreign-relations", "major-events"],
    countries: ["France"],
    location: "Paris",
    summary:
      "The National Convention abolished slavery throughout French colonies, ratifying abolitions already proclaimed in Saint-Domingue by commissioner Sonthonax in 1793 under pressure from the insurgents.",
    consequences: "Toussaint Louverture shifted his forces to the French side, a turning point in the war.",
    status: "documented",
    people: ["toussaint-louverture"],
    related: ["bois-caiman", "vertieres"],
    sources: [{ title: "Law of 4 February 1794", url: wiki("Law_of_4_February_1794") }],
  },
  // ——— 1800s ———
  {
    slug: "toussaint-captured",
    title: "Toussaint Louverture is seized and deported",
    date: "1802-06-07",
    precision: "day",
    dimension: "inside",
    categories: ["politics", "wars"],
    countries: ["France"],
    location: "Near Gonaïves",
    summary:
      "Lured to a meeting by General Brunet, Toussaint was arrested and shipped to France. He died at Fort de Joux in the Jura mountains on 7 April 1803.",
    consequences: "Fears that France intended to restore slavery drove generals including Dessalines and Christophe to resume the war.",
    status: "documented",
    people: ["toussaint-louverture"],
    related: ["vertieres"],
    sources: [{ title: "Toussaint Louverture", url: wiki("Toussaint_Louverture") }],
  },
  {
    slug: "vertieres",
    title: "Battle of Vertières",
    date: "1803-11-18",
    precision: "day",
    dimension: "inside",
    categories: ["wars", "major-events"],
    countries: ["France"],
    location: "Vertières, near Cap-Français",
    summary:
      "The indigenous army under Dessalines, with François Capois ('Capois-La-Mort') leading the assault, defeated the remaining French forces under Rochambeau, who agreed to evacuate.",
    consequences: "The last major battle of the revolution opened the way to independence six weeks later.",
    status: "documented",
    people: ["jean-jacques-dessalines"],
    related: ["independence-1804"],
    sources: [{ title: "Battle of Vertières", url: wiki("Battle_of_Verti%C3%A8res") }],
  },
  {
    slug: "independence-1804",
    title: "Haiti declares independence",
    date: "1804-01-01",
    precision: "day",
    dimension: "inside",
    categories: ["politics", "major-events"],
    location: "Gonaïves",
    summary:
      "Dessalines proclaimed the independence of Haiti, restoring the island's Taíno name. Haiti became the first independent nation in Latin America and the Caribbean to abolish slavery permanently, and the first Black republic.",
    consequences:
      "Slaveholding powers responded with isolation; the United States and France withheld recognition for decades. Haitians mark the day with soup joumou, once forbidden to the enslaved.",
    status: "documented",
    people: ["jean-jacques-dessalines"],
    related: ["indemnity-1825", "us-recognition-1862"],
    sources: [{ title: "Haitian Declaration of Independence", url: wiki("Haitian_Declaration_of_Independence") }],
  },
  {
    slug: "dessalines-assassinated",
    title: "Dessalines is assassinated at Pont-Rouge",
    date: "1806-10-17",
    precision: "day",
    dimension: "inside",
    categories: ["politics"],
    location: "Pont-Rouge, north of Port-au-Prince",
    summary: "Emperor Jacques I was killed in an ambush by officers opposed to his rule.",
    consequences: "The country split between Christophe's state in the north and Pétion's republic in the south.",
    status: "documented",
    people: ["jean-jacques-dessalines", "henri-christophe", "alexandre-petion"],
    sources: [{ title: "Jean-Jacques Dessalines", url: wiki("Jean-Jacques_Dessalines") }],
  },
  // ——— 1810s ———
  {
    slug: "christophe-crowned",
    title: "Henri Christophe crowned King Henry I",
    date: "1811-06-02",
    precision: "day",
    dimension: "inside",
    categories: ["politics", "arts"],
    location: "Cap-Henri (Cap-Haïtien)",
    summary:
      "Christophe proclaimed a kingdom in the north. His reign produced the Citadelle Laferrière and the Sans-Souci palace, today a UNESCO World Heritage Site.",
    status: "documented",
    people: ["henri-christophe"],
    sources: [{ title: "Henri Christophe", url: wiki("Henri_Christophe") }, { title: "Citadelle Laferrière", url: wiki("Citadelle_Laferri%C3%A8re") }],
  },
  {
    slug: "petion-aids-bolivar",
    title: "Pétion arms Simón Bolívar",
    date: "1815-12-24",
    precision: "circa",
    dimension: "abroad",
    categories: ["foreign-relations", "contributions", "wars"],
    countries: ["Venezuela", "Colombia"],
    location: "Les Cayes and Jacmel",
    summary:
      "Exiled after defeats in Venezuela, Bolívar arrived in Haiti in late 1815. Pétion supplied weapons, ships, money and men for expeditions launched in 1816, asking in return that Bolívar abolish slavery in the lands he freed.",
    consequences: "Bolívar's subsequent campaigns helped win independence for much of northern South America.",
    status: "documented",
    people: ["alexandre-petion"],
    related: ["independence-1804"],
    sources: [{ title: "Alexandre Pétion", url: wiki("Alexandre_P%C3%A9tion") }],
  },
  // ——— 1820s ———
  {
    slug: "boyer-unifies-island",
    title: "Boyer brings the whole island under Haitian rule",
    date: "1822-02-09",
    precision: "day",
    dimension: "inside",
    categories: ["politics", "wars"],
    location: "Santo Domingo",
    summary:
      "Having reunited north and south in 1820, President Boyer entered Santo Domingo, beginning a 22-year period in which Haiti governed the entire island and abolished slavery in the east.",
    consequences: "Eastern resentment of Haitian rule fed the movement that produced Dominican independence in 1844.",
    status: "documented",
    people: ["jean-pierre-boyer"],
    sources: [{ title: "Haitian occupation of Santo Domingo", url: wiki("Haitian_occupation_of_Santo_Domingo") }],
  },
  {
    slug: "indemnity-1825",
    title: "France's 1825 indemnity: 150 million francs for recognition",
    date: "1825-04-17",
    precision: "day",
    dimension: "foreign",
    categories: ["economy", "foreign-relations", "major-events"],
    countries: ["France"],
    location: "Paris / Port-au-Prince",
    summary:
      "King Charles X issued an ordinance recognizing Haiti in exchange for 150 million francs to compensate former colonists and halved customs duties for French ships. A French naval squadron delivered it to Port-au-Prince, and Boyer accepted.",
    context: "Haiti had been diplomatically isolated since 1804 and feared a French reconquest.",
    consequences:
      "Haiti borrowed from French banks to pay the first installment, creating a 'double debt' of indemnity plus loan interest. Payments and related loans burdened Haitian finances for over a century.",
    status: "documented",
    people: ["jean-pierre-boyer"],
    related: ["indemnity-reduced-1838", "independence-1804"],
    sources: [
      { title: "Haiti indemnity controversy", url: wiki("Haiti_indemnity_controversy") },
      { title: "The New York Times — The Ransom (2022)", url: "https://www.nytimes.com/interactive/2022/05/20/world/americas/haiti-history-colonized-france.html" },
    ],
  },
  // ——— 1830s ———
  {
    slug: "indemnity-reduced-1838",
    title: "Indemnity cut to 90 million francs",
    date: "1838",
    precision: "year",
    dimension: "foreign",
    categories: ["economy", "foreign-relations"],
    countries: ["France"],
    location: "Port-au-Prince",
    summary:
      "New treaties with France reduced the remaining indemnity to 90 million francs, payable over three decades, and gave unconditional recognition of Haitian independence.",
    consequences: "The debt remained a central drain on the treasury through the rest of the century.",
    status: "documented",
    people: ["jean-pierre-boyer"],
    related: ["indemnity-1825", "gold-removed-1914"],
    sources: [{ title: "Haiti indemnity controversy", url: wiki("Haiti_indemnity_controversy") }],
  },
  // ——— 1840s ———
  {
    slug: "dominican-independence-1844",
    title: "The east declares independence as the Dominican Republic",
    date: "1844-02-27",
    precision: "day",
    dimension: "inside",
    categories: ["politics", "foreign-relations"],
    countries: ["Dominican Republic"],
    location: "Santo Domingo",
    summary: "A year after Boyer's overthrow, separatists in Santo Domingo ended Haitian rule over the eastern part of the island.",
    consequences: "Haiti made repeated attempts to retake the east over the following decade; the border shaped relations ever since.",
    status: "documented",
    related: ["boyer-unifies-island", "parsley-massacre"],
    sources: [{ title: "Dominican War of Independence", url: wiki("Dominican_War_of_Independence") }],
  },
  // ——— 1860s ———
  {
    slug: "us-recognition-1862",
    title: "The United States recognizes Haiti",
    date: "1862-06-05",
    precision: "day",
    dimension: "foreign",
    categories: ["foreign-relations", "major-events"],
    countries: ["United States"],
    location: "Washington, D.C.",
    summary:
      "President Abraham Lincoln signed legislation authorizing diplomatic relations with Haiti and Liberia, 58 years after Haitian independence. Southern opposition had blocked recognition until the Civil War removed those votes from Congress.",
    status: "documented",
    related: ["independence-1804"],
    sources: [{ title: "Office of the Historian — Haiti", url: "https://history.state.gov/countries/haiti" }],
  },
  // ——— 1880s ———
  {
    slug: "firmin-equality-of-races",
    title: "Anténor Firmin publishes 'The Equality of the Human Races'",
    date: "1885",
    precision: "year",
    dimension: "abroad",
    categories: ["education", "arts", "contributions"],
    countries: ["France"],
    location: "Paris",
    summary:
      "Firmin, a member of the Paris Anthropological Society, published a nearly 700-page rebuttal of Gobineau's 'Essay on the Inequality of the Human Races', arguing on scientific grounds for human equality.",
    consequences: "Long neglected in Europe, the book is now recognized as a founding text of anti-racist anthropology and Pan-Africanist thought.",
    status: "documented",
    people: ["antenor-firmin"],
    related: ["price-mars-oncle"],
    sources: [{ title: "Anténor Firmin", url: wiki("Ant%C3%A9nor_Firmin") }],
  },
  // ——— 1910s ———
  {
    slug: "gold-removed-1914",
    title: "US Marines take Haiti's gold reserve to New York",
    date: "1914-12-17",
    precision: "day",
    dimension: "foreign",
    categories: ["economy", "foreign-relations"],
    countries: ["United States"],
    location: "Port-au-Prince",
    summary:
      "US Marines removed about $500,000 in gold from Haiti's national bank and shipped it to National City Bank in New York, with the support of the US State Department.",
    context:
      "Haiti's national bank was controlled by foreign interests, and National City Bank held a growing stake. Debt from the indemnity era and later loans had left the state dependent on foreign creditors.",
    consequences: "The seizure foreshadowed the 1915 invasion and US control of Haitian customs and finances.",
    status: "documented",
    related: ["indemnity-reduced-1838", "us-occupation-1915"],
    sources: [
      { title: "United States occupation of Haiti", url: wiki("United_States_occupation_of_Haiti") },
      { title: "The New York Times — The Ransom (2022)", url: "https://www.nytimes.com/interactive/2022/05/20/world/americas/haiti-history-colonized-france.html" },
    ],
  },
  {
    slug: "us-occupation-1915",
    title: "The United States invades and occupies Haiti",
    date: "1915-07-28",
    precision: "day",
    dimension: "foreign",
    categories: ["wars", "politics", "foreign-relations", "major-events"],
    countries: ["United States"],
    location: "Port-au-Prince",
    summary:
      "After President Vilbrun Guillaume Sam was killed by a crowd following a massacre of political prisoners, US Marines landed. The occupation lasted until 1934.",
    consequences:
      "The US imposed a treaty giving it control of customs and finances, rewrote the constitution in 1918 to allow foreign land ownership, revived forced road labor (corvée), and built a new army, the Garde d'Haïti.",
    status: "documented",
    related: ["gold-removed-1914", "peralte-killed", "marines-leave-1934"],
    sources: [
      { title: "Office of the Historian — U.S. Invasion and Occupation of Haiti", url: "https://history.state.gov/milestones/1914-1920/haiti" },
      { title: "United States occupation of Haiti", url: wiki("United_States_occupation_of_Haiti") },
    ],
  },
  {
    slug: "peralte-killed",
    title: "Charlemagne Péralte, leader of the Caco resistance, is killed",
    date: "1919-11-01",
    precision: "day",
    dimension: "inside",
    categories: ["wars", "politics"],
    countries: ["United States"],
    location: "Near Grande-Rivière-du-Nord",
    summary:
      "Péralte led armed resistance to the occupation. Marines disguised in blackface infiltrated his camp and killed him; his body was photographed tied to a door and the image circulated to discourage resistance.",
    consequences: "The photograph backfired, turning Péralte into a national martyr and a lasting symbol of resistance.",
    status: "documented",
    people: ["charlemagne-peralte"],
    related: ["us-occupation-1915"],
    sources: [{ title: "Charlemagne Péralte", url: wiki("Charlemagne_P%C3%A9ralte") }],
  },
  // ——— 1920s ———
  {
    slug: "price-mars-oncle",
    title: "Jean Price-Mars publishes 'Ainsi parla l'oncle'",
    date: "1928",
    precision: "year",
    dimension: "inside",
    categories: ["arts", "society", "religion", "education"],
    location: "Port-au-Prince",
    summary:
      "Written under the occupation, Price-Mars's ethnographic essays urged Haiti's elite to stop imitating France and to take seriously the country's African heritage, Vodou and peasant culture.",
    consequences: "The book shaped Haitian indigénisme and influenced the Négritude writers in Paris and the Caribbean.",
    status: "documented",
    people: ["jean-price-mars"],
    related: ["firmin-equality-of-races", "centre-d-art"],
    sources: [{ title: "Jean Price-Mars", url: wiki("Jean_Price-Mars") }],
  },
  {
    slug: "marchaterre-massacre",
    title: "Marchaterre massacre",
    date: "1929-12-06",
    precision: "day",
    dimension: "inside",
    categories: ["politics", "wars", "society"],
    countries: ["United States"],
    location: "Marchaterre, near Les Cayes",
    summary: "US Marines fired on a crowd of peasants protesting economic conditions and the occupation, killing at least a dozen people.",
    consequences: "Together with student strikes that year, the massacre led President Hoover to send the Forbes Commission, which recommended ending the occupation.",
    status: "documented",
    related: ["us-occupation-1915", "marines-leave-1934"],
    sources: [{ title: "United States occupation of Haiti", url: wiki("United_States_occupation_of_Haiti") }],
  },
  {
    slug: "league-of-nations-bellegarde",
    title: "Haiti joins the League of Nations; Bellegarde protests the occupation",
    date: "1920",
    precision: "year",
    dimension: "abroad",
    categories: ["foreign-relations", "contributions"],
    countries: ["Switzerland", "United States"],
    location: "Geneva",
    summary:
      "Haiti was among the founding members of the League of Nations. Its delegate, the educator and diplomat Dantès Bellegarde, used the League's platform in the early 1920s to denounce the US occupation of his country.",
    status: "documented",
    people: ["dantes-bellegarde"],
    related: ["us-occupation-1915"],
    sources: [{ title: "Dantès Bellegarde", url: wiki("Dant%C3%A8s_Bellegarde") }],
  },
  {
    slug: "batraville-killed",
    title: "Benoît Batraville, last Caco leader, is killed",
    date: "1920-05-19",
    precision: "day",
    dimension: "inside",
    categories: ["wars"],
    countries: ["United States"],
    location: "Central Plateau",
    summary: "Batraville had continued the armed resistance after Péralte's death. His killing by US Marines effectively ended the Caco war.",
    status: "documented",
    related: ["peralte-killed"],
    sources: [{ title: "Benoît Batraville", url: wiki("Beno%C3%AEt_Batraville") }],
  },
  {
    slug: "revue-indigene",
    title: "Young writers launch La Revue indigène",
    date: "1927",
    precision: "year",
    dimension: "inside",
    categories: ["arts"],
    location: "Port-au-Prince",
    summary:
      "Jacques Roumain, Normil Sylvain, Philippe Thoby-Marcelin, Émile Roumer, Carl Brouard and others founded a review calling for literature rooted in Haitian life rather than French models, launching the indigéniste movement.",
    status: "documented",
    related: ["price-mars-oncle"],
    sources: [{ title: "Indigenism (Haiti)", url: wiki("Indig%C3%A9nisme") }],
  },
  {
    slug: "damien-strike",
    title: "Students at Damien strike, setting off the 1929 protests",
    date: "1929-10-31",
    precision: "day",
    dimension: "inside",
    categories: ["education", "politics"],
    location: "Damien, near Port-au-Prince",
    summary:
      "Students at the central agricultural school, run by the occupation's Service Technique, walked out over cuts to scholarships. Their strike spread to other schools, civil servants and customs workers.",
    consequences: "Weeks later Marines fired on protesters at Marchaterre, and President Hoover sent the Forbes Commission.",
    status: "documented",
    related: ["marchaterre-massacre"],
    sources: [{ title: "United States occupation of Haiti", url: wiki("United_States_occupation_of_Haiti") }],
  },
  // ——— 1930s ———
  {
    slug: "marines-leave-1934",
    title: "The last US Marines leave Haiti",
    date: "1934-08-15",
    precision: "day",
    dimension: "foreign",
    categories: ["politics", "foreign-relations", "major-events"],
    countries: ["United States"],
    location: "Port-au-Prince",
    summary:
      "Under Franklin Roosevelt's Good Neighbor policy and after negotiations with President Sténio Vincent, the occupation ended. US financial oversight continued for years afterward.",
    status: "documented",
    related: ["us-occupation-1915", "debt-repaid-1947"],
    sources: [{ title: "United States occupation of Haiti", url: wiki("United_States_occupation_of_Haiti") }],
  },
  {
    slug: "parsley-massacre",
    title: "The Parsley Massacre",
    date: "1937-10-02",
    precision: "circa",
    dimension: "abroad",
    categories: ["wars", "contributions", "society"],
    countries: ["Dominican Republic"],
    location: "Dominican borderlands",
    summary:
      "On the orders of Rafael Trujillo, Dominican soldiers and civilians killed Haitians and Dominicans of Haitian descent living near the border over several days in October 1937.",
    consequences: "Death toll estimates range widely, from several thousand to more than 20,000. Trujillo's government later agreed to pay an indemnity, only part of which reached victims.",
    status: "documented",
    related: ["dominican-independence-1844"],
    sources: [{ title: "Parsley massacre", url: wiki("Parsley_massacre") }],
  },
  // ——— 1940s ———
  {
    slug: "centre-d-art",
    title: "The Centre d'Art opens in Port-au-Prince",
    date: "1944-05",
    precision: "month",
    dimension: "inside",
    categories: ["arts", "society", "contributions"],
    location: "Port-au-Prince",
    summary:
      "Founded with American teacher DeWitt Peters and Haitian artists and intellectuals, the Centre d'Art gave studio space and exhibitions to self-taught painters such as Hector Hyppolite and Philomé Obin.",
    consequences: "Haitian painting gained a worldwide audience; André Breton championed Hyppolite, and Haitian works entered major museum collections.",
    status: "documented",
    people: ["hector-hyppolite"],
    related: ["price-mars-oncle"],
    sources: [{ title: "Centre d'Art", url: wiki("Centre_d%27Art") }],
  },
  {
    slug: "revolution-1946",
    title: "Students topple President Lescot",
    date: "1946-01-11",
    precision: "day",
    dimension: "inside",
    categories: ["politics", "education", "society"],
    location: "Port-au-Prince",
    summary:
      "Student strikes, sparked after the seizure of the newspaper La Ruche, spread into general protests. The military forced Élie Lescot out, and the National Assembly later elected Dumarsais Estimé.",
    status: "documented",
    sources: [{ title: "1946 Haitian coup d'état", url: wiki("1946_Haitian_coup_d%27%C3%A9tat") }],
  },
  {
    slug: "debt-repaid-1947",
    title: "Estimé pays off the occupation-era US debt",
    date: "1947",
    precision: "year",
    dimension: "foreign",
    categories: ["economy", "foreign-relations"],
    countries: ["United States"],
    location: "Port-au-Prince",
    summary:
      "President Dumarsais Estimé's government retired the remaining debt held in the United States from the 1922 loan, ending formal US financial control.",
    consequences: "Historians who trace the indemnity's long chain of refinancing often treat 1947 as its effective end, more than 120 years after 1825.",
    status: "interpretation",
    related: ["marines-leave-1934", "indemnity-1825"],
    sources: [{ title: "Dumarsais Estimé", url: wiki("Dumarsais_Estim%C3%A9") }],
  },
  // ——— 1950s ———
  {
    slug: "konpa-direk",
    title: "Nemours Jean-Baptiste launches konpa direk",
    date: "1955",
    precision: "year",
    dimension: "inside",
    categories: ["music", "society"],
    location: "Port-au-Prince",
    summary:
      "Saxophonist and bandleader Nemours Jean-Baptiste popularized a new dance music, konpa direk, drawing on merengue and Haitian rhythms. A friendly rivalry with Webert Sicot's cadence rampa electrified the scene.",
    consequences: "Konpa became Haiti's signature popular music and spread across the Caribbean, Africa and the diaspora, influencing zouk and kizomba.",
    status: "documented",
    people: ["nemours-jean-baptiste"],
    related: ["boukman-eksperyans-kanaval"],
    sources: [{ title: "Compas", url: wiki("Compas") }],
  },
  {
    slug: "duvalier-elected",
    title: "François Duvalier elected president",
    date: "1957-09-22",
    precision: "day",
    dimension: "inside",
    categories: ["politics"],
    location: "Haiti",
    summary:
      "A physician known as 'Papa Doc', Duvalier won an election held under the military. He built a personal militia, the Volontaires de la Sécurité Nationale (Tontons Macoutes), and declared himself president-for-life in 1964.",
    consequences: "Tens of thousands were killed or disappeared under the Duvaliers, and a large share of Haiti's professional class went into exile.",
    status: "documented",
    people: ["francois-duvalier"],
    related: ["duvalier-flees-1986"],
    sources: [{ title: "François Duvalier", url: wiki("Fran%C3%A7ois_Duvalier") }],
  },
  // ——— 1970s ———
  {
    slug: "world-cup-1974",
    title: "Haiti plays at the World Cup; Sanon scores against Italy",
    date: "1974-06-15",
    precision: "day",
    dimension: "abroad",
    categories: ["sports", "contributions"],
    countries: ["West Germany"],
    location: "Munich, West Germany",
    summary:
      "In Haiti's first World Cup, Emmanuel 'Manno' Sanon scored against Italy, ending goalkeeper Dino Zoff's long run of international matches without conceding.",
    status: "documented",
    sources: [{ title: "Emmanuel Sanon", url: wiki("Emmanuel_Sanon") }],
  },
  // ——— 1980s ———
  {
    slug: "duvalier-flees-1986",
    title: "Jean-Claude Duvalier flees into exile",
    date: "1986-02-07",
    precision: "day",
    dimension: "inside",
    categories: ["politics", "major-events"],
    location: "Port-au-Prince",
    summary:
      "After months of protests that began in Gonaïves, Jean-Claude 'Baby Doc' Duvalier left for France on a US Air Force plane, ending 29 years of Duvalier rule.",
    consequences: "The dechoukaj ('uprooting') targeted Macoute symbols; a new constitution followed in 1987.",
    status: "documented",
    people: ["jean-claude-duvalier"],
    related: ["duvalier-elected", "constitution-1987"],
    sources: [{ title: "Jean-Claude Duvalier", url: wiki("Jean-Claude_Duvalier") }],
  },
  {
    slug: "constitution-1987",
    title: "Haitians approve the 1987 Constitution",
    date: "1987-03-29",
    precision: "day",
    dimension: "inside",
    categories: ["politics", "major-events"],
    location: "Haiti",
    summary: "A referendum approved a constitution that recognized Haitian Creole as an official language alongside French and set limits on presidential power.",
    status: "documented",
    related: ["duvalier-flees-1986"],
    sources: [{ title: "Constitution of Haiti", url: wiki("Constitution_of_Haiti") }],
  },
  // ——— 1990s ———
  {
    slug: "boukman-eksperyans-kanaval",
    title: "Boukman Eksperyans wins Carnival with 'Ke'm Pa Sote'",
    date: "1990",
    precision: "year",
    dimension: "inside",
    categories: ["music", "society", "politics"],
    location: "Port-au-Prince",
    summary:
      "The roots band's carnival song — 'I'm not afraid' — became an anthem of the democratic movement, bringing Vodou rhythms and lyrics into mainstream popular music.",
    consequences: "Mizik rasin reached international audiences, and its musicians faced pressure from the military regimes that followed.",
    status: "documented",
    related: ["konpa-direk", "aristide-elected"],
    sources: [{ title: "Boukman Eksperyans", url: wiki("Boukman_Eksperyans") }],
  },
  {
    slug: "aristide-elected",
    title: "Jean-Bertrand Aristide wins the presidency",
    date: "1990-12-16",
    precision: "day",
    dimension: "inside",
    categories: ["politics", "major-events"],
    location: "Haiti",
    summary: "A priest and leader of the Lavalas movement, Aristide won Haiti's first widely recognized free presidential election with about two-thirds of the vote.",
    consequences: "He was overthrown by the army on 30 September 1991, seven months after taking office.",
    status: "documented",
    people: ["jean-bertrand-aristide"],
    related: ["aristide-restored-1994"],
    sources: [{ title: "1990 Haitian general election", url: wiki("1990%E2%80%9391_Haitian_general_election") }],
  },
  {
    slug: "aristide-restored-1994",
    title: "A US-led force restores Aristide",
    date: "1994-09-19",
    precision: "day",
    dimension: "foreign",
    categories: ["politics", "foreign-relations", "wars"],
    countries: ["United States", "United Nations"],
    location: "Port-au-Prince",
    summary:
      "Authorized by the UN Security Council, Operation Uphold Democracy landed after a last-minute negotiated departure of the junta. Aristide returned on 15 October 1994.",
    status: "documented",
    people: ["jean-bertrand-aristide"],
    related: ["aristide-elected"],
    sources: [{ title: "Operation Uphold Democracy", url: wiki("Operation_Uphold_Democracy") }],
  },
  // ——— 2010s ———
  {
    slug: "earthquake-2010",
    title: "The 12 January earthquake",
    date: "2010-01-12",
    precision: "day",
    dimension: "inside",
    categories: ["major-events", "society"],
    location: "Léogâne and Port-au-Prince",
    summary:
      "A magnitude 7.0 earthquake struck near Léogâne, devastating Port-au-Prince and surrounding towns. Haitians call it 'Goudougoudou'.",
    consequences:
      "Estimates of the dead range from about 100,000 to over 300,000; the official government figure is disputed. More than a million people were displaced, and the reconstruction effort drew lasting criticism.",
    status: "disputed",
    related: ["cholera-2010"],
    sources: [{ title: "2010 Haiti earthquake", url: wiki("2010_Haiti_earthquake") }],
  },
  {
    slug: "cholera-2010",
    title: "Cholera is introduced to Haiti",
    date: "2010-10",
    precision: "month",
    dimension: "foreign",
    categories: ["society", "foreign-relations"],
    countries: ["United Nations", "Nepal"],
    location: "Mirebalais, Centre department",
    summary:
      "An epidemic began near a UN peacekeeping base where sewage contaminated a tributary of the Artibonite River. Scientific studies traced the strain to South Asia.",
    consequences: "Nearly 10,000 people died. In 2016 the UN Secretary-General apologized for the UN's role in the epidemic.",
    status: "documented",
    related: ["earthquake-2010"],
    sources: [{ title: "2010s Haiti cholera outbreak", url: wiki("2010s_Haiti_cholera_outbreak") }],
  },
  // ——— 2020s ———
  {
    slug: "moise-assassinated",
    title: "President Jovenel Moïse is assassinated",
    date: "2021-07-07",
    precision: "day",
    dimension: "inside",
    categories: ["politics", "major-events"],
    countries: ["Colombia", "United States"],
    location: "Pèlerin, Port-au-Prince",
    summary:
      "Moïse was killed at his residence by an armed group that included former Colombian soldiers. Investigations in Haiti and the United States have charged a number of suspects; who ordered the killing remains contested.",
    status: "investigative",
    sources: [{ title: "Assassination of Jovenel Moïse", url: wiki("Assassination_of_Jovenel_Mo%C3%AFse") }],
  },
  {
    slug: "earthquake-2021",
    title: "Earthquake strikes the southern peninsula",
    date: "2021-08-14",
    precision: "day",
    dimension: "inside",
    categories: ["major-events", "society"],
    location: "Nippes and Sud departments",
    summary: "A magnitude 7.2 earthquake killed more than 2,000 people, and Tropical Storm Grace hit the same region days later.",
    status: "documented",
    related: ["earthquake-2010"],
    sources: [{ title: "2021 Haiti earthquake", url: wiki("2021_Haiti_earthquake") }],
  },
];

export const people: Person[] = [
  { slug: "toussaint-louverture", name: "Toussaint Louverture", born: "c. 1743", died: "1803", roles: ["Revolutionary general", "Governor of Saint-Domingue"], bio: "Born enslaved, he became the revolution's foremost military and political leader and issued the 1801 constitution before being captured by the French." },
  { slug: "jean-jacques-dessalines", name: "Jean-Jacques Dessalines", born: "1758", died: "1806", roles: ["Founding father", "Emperor Jacques I"], bio: "Commander of the indigenous army at Vertières, he proclaimed Haitian independence on 1 January 1804." },
  { slug: "henri-christophe", name: "Henri Christophe", born: "1767", died: "1820", roles: ["General", "King Henry I"], bio: "Ruled northern Haiti from 1807, as king from 1811; builder of the Citadelle Laferrière." },
  { slug: "alexandre-petion", name: "Alexandre Pétion", born: "1770", died: "1818", roles: ["President of the Republic of Haiti"], bio: "Led the southern republic from 1806 and supported Simón Bolívar's independence campaigns." },
  { slug: "jean-pierre-boyer", name: "Jean-Pierre Boyer", born: "1776", died: "1850", roles: ["President"], bio: "Reunited Haiti in 1820, governed the whole island from 1822, and accepted the 1825 indemnity." },
  { slug: "dutty-boukman", name: "Dutty Boukman", died: "1791", roles: ["Revolutionary leader", "Vodou houngan"], bio: "Remembered as a leader of the Bois Caïman ceremony and the 1791 uprising; killed by colonial forces months later." },
  { slug: "antenor-firmin", name: "Anténor Firmin", born: "1850", died: "1911", roles: ["Anthropologist", "Diplomat", "Politician"], bio: "Author of 'De l'égalité des races humaines' (1885), a pioneering rebuttal of scientific racism." },
  { slug: "charlemagne-peralte", name: "Charlemagne Péralte", born: "1886", died: "1919", roles: ["Resistance leader"], bio: "Led the Caco insurgency against the US occupation." },
  { slug: "jean-price-mars", name: "Jean Price-Mars", born: "1876", died: "1969", roles: ["Physician", "Ethnographer", "Diplomat"], bio: "His 'Ainsi parla l'oncle' (1928) reshaped how Haitians understood their culture and heritage." },
  { slug: "nemours-jean-baptiste", name: "Nemours Jean-Baptiste", born: "1918", died: "1985", roles: ["Saxophonist", "Bandleader"], bio: "Creator and popularizer of konpa direk in the mid-1950s." },
  { slug: "francois-duvalier", name: "François Duvalier", born: "1907", died: "1971", roles: ["President-for-life"], bio: "'Papa Doc' ruled through terror from 1957 until his death." },
  { slug: "jean-claude-duvalier", name: "Jean-Claude Duvalier", born: "1951", died: "2014", roles: ["President-for-life"], bio: "'Baby Doc' succeeded his father in 1971 and was forced out in 1986." },
  { slug: "jean-bertrand-aristide", name: "Jean-Bertrand Aristide", born: "1953", roles: ["Priest", "President"], bio: "Elected in 1990, ousted in 1991, restored in 1994, re-elected in 2000 and removed in 2004." },
];

// Merge the second batch, newest additions last; pages sort chronologically.
events.push(...moreEvents, ...yearEvents, ...events1790s, ...eventsA, ...eventsB, ...eventsC);
people.push(...morePeople, ...yearPeople, ...people1790s);

for (const e of events) if (events1790sFr[e.slug]) e.fr = { ...e.fr, ...events1790sFr[e.slug] };
for (const pe of people) if (people1790sFr[pe.slug]) pe.fr = { ...pe.fr, ...people1790sFr[pe.slug] };

// File every moment under the 10 sections, and merge decade notes the same way.
const sectionedEvents = events.map(toSections);
for (const p of periods) p.notes = notesToSections(p.notes);
const sections = SECTIONS.map(({ items, ...c }) => c);

export const content: Content = { categories: sections, periods, events: sectionedEvents, people };
