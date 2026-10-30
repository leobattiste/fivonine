import type { HistEvent, Person } from "./types";

/** Third batch: filling individual years for the decades with essays (1790s, 1800s, 1820s, 1910s, 1920s). */
const wiki = (t: string) => `https://en.wikipedia.org/wiki/${t}`;
type E = Omit<HistEvent, "status" | "sources"> & { status?: HistEvent["status"]; src: [string, string][] };
const ev = ({ src, status = "documented", ...e }: E): HistEvent => ({ ...e, status, sources: src.map(([title, page]) => ({ title, url: wiki(page) })) });
const REV: [string, string] = ["Haitian Revolution", "Haitian_Revolution"];
const TL: [string, string] = ["Toussaint Louverture", "Toussaint_Louverture"];
const SON: [string, string] = ["Léger-Félicité Sonthonax", "L%C3%A9ger-F%C3%A9licit%C3%A9_Sonthonax"];
const BRIT: [string, string] = ["British occupation of Saint-Domingue", "British_occupation_of_Saint-Domingue"];
const EXP: [string, string] = ["Saint-Domingue expedition", "Saint-Domingue_expedition"];
const JJD: [string, string] = ["Jean-Jacques Dessalines", "Jean-Jacques_Dessalines"];
const OCC: [string, string] = ["United States occupation of Haiti", "United_States_occupation_of_Haiti"];

export const yearEvents: HistEvent[] = [
  // ——— Indigenous Ayiti
  { slug: "en-bas-saline", title: "En Bas Saline, the largest known Taíno town in Haiti", date: "1250", precision: "circa", dimension: "inside", categories: ["society", "business"], location: "En Bas Saline, northern Haiti",
    summary: "An Indigenous town occupied from roughly 1250 to 1520 CE. Archaeologists consider it the largest late pre-contact Taíno town documented in what is now Haiti, and a rare record of daily life before and after European contact.",
    status: "documented", people: ["guacanagari"], related: ["columbus-reaches-ayiti"],
    sources: [{ title: "Kathleen Deagan, En Bas Saline: A Taíno Town before and after Columbus (University Press of Florida, 2023)" }] },
  // ——— 1790s
  ev({ slug: "decree-may-1791", title: "Paris grants rights to some free men of color", date: "1791-05-15", precision: "day", dimension: "foreign", categories: ["politics", "society"], countries: ["France"], location: "Paris",
    summary: "The National Assembly gave political rights to free men of color born of two free parents. White colonists refused to apply the decree.", related: ["oge-revolt", "decree-april-1792"], src: [REV] }),
  ev({ slug: "decree-april-1792", title: "France grants citizenship to all free people of color", date: "1792-04-04", precision: "day", dimension: "foreign", categories: ["politics", "society"], countries: ["France"], location: "Paris",
    summary: "The Legislative Assembly extended full citizenship to all free people of color, hoping to unite free colonists against the slave insurrection.", related: ["sonthonax-arrives"], src: [REV] }),
  ev({ slug: "sonthonax-arrives", title: "Commissioners Sonthonax and Polverel arrive", date: "1792-09", precision: "month", dimension: "foreign", categories: ["politics", "foreign-relations"], countries: ["France"], location: "Cap-Français",
    summary: "Civil commissioners Léger-Félicité Sonthonax and Étienne Polverel landed with several thousand troops to enforce the April decree and restore French authority.", related: ["burning-cap-1793"], src: [SON] }),
  ev({ slug: "burning-cap-1793", title: "Cap-Français burns", date: "1793-06", precision: "month", dimension: "inside", categories: ["wars", "major-events"], location: "Cap-Français",
    summary: "Fighting between Sonthonax's forces and those of the new governor, Galbaud, turned the colony's capital into a battlefield. Sonthonax promised freedom to insurgents who fought for the Republic, and much of the city was destroyed.", related: ["sonthonax-abolition"], src: [SON] }),
  ev({ slug: "sonthonax-abolition", title: "Sonthonax proclaims the end of slavery in the north", date: "1793-08-29", precision: "day", dimension: "inside", categories: ["politics", "society"], countries: ["France"], location: "Cap-Français",
    summary: "Facing war with Spain and Britain, Sonthonax declared all enslaved people in the Northern Province free. Polverel extended abolition to the west and south that autumn.", related: ["french-abolition-1794"], src: [SON] }),
  ev({ slug: "british-invasion-1793", title: "Britain invades Saint-Domingue", date: "1793-09", precision: "month", dimension: "foreign", categories: ["wars", "foreign-relations"], countries: ["Great Britain"], location: "Jérémie and Môle Saint-Nicolas",
    summary: "British forces landed at the invitation of planters who hoped British rule would preserve slavery. The occupation lasted five years and cost Britain thousands of soldiers, mostly to disease.", related: ["british-withdraw-1798"], src: [BRIT] }),
  ev({ slug: "toussaint-joins-france", title: "Toussaint brings his army over to the French Republic", date: "1794-05", precision: "circa", dimension: "inside", categories: ["wars", "politics"], countries: ["Spain", "France"], location: "Northern and western provinces",
    summary: "After France abolished slavery, Toussaint broke with Spain, which had armed the insurgent leaders, and turned his troops against the Spanish and British.", people: ["toussaint-louverture"], related: ["french-abolition-1794"], src: [TL] }),
  ev({ slug: "treaty-of-basel", title: "Spain cedes Santo Domingo to France", date: "1795-07-22", precision: "day", dimension: "foreign", categories: ["foreign-relations"], countries: ["Spain", "France"], location: "Basel",
    summary: "Under the Peace of Basel, Spain gave up its colony on the eastern part of the island to France, though French control there remained largely on paper for years.", related: ["toussaint-santo-domingo"], src: [["Peace of Basel", "Peace_of_Basel"]] }),
  ev({ slug: "laveaux-rescued", title: "Toussaint rescues Governor Laveaux and becomes lieutenant governor", date: "1796-03", precision: "month", dimension: "inside", categories: ["politics"], location: "Cap-Français",
    summary: "Officers in Cap-Français arrested the French governor, Étienne Laveaux. Toussaint's troops freed him, and Laveaux named Toussaint lieutenant governor.", people: ["toussaint-louverture"], src: [TL] }),
  ev({ slug: "toussaint-commander", title: "Toussaint is named commander in chief", date: "1797", precision: "year", dimension: "inside", categories: ["politics", "wars"], location: "Saint-Domingue",
    summary: "Appointed commander in chief of the colony's army, Toussaint soon maneuvered Sonthonax into leaving for France, becoming the colony's most powerful figure.", people: ["toussaint-louverture"], src: [TL] }),
  ev({ slug: "british-withdraw-1798", title: "The British withdraw", date: "1798", precision: "year", dimension: "foreign", categories: ["wars", "foreign-relations"], countries: ["Great Britain"], location: "Port-au-Prince and Môle Saint-Nicolas",
    summary: "After five years of war and heavy losses to disease, Britain negotiated its evacuation with Toussaint.", people: ["toussaint-louverture"], related: ["british-invasion-1793"], src: [BRIT] }),
  ev({ slug: "war-of-knives", title: "The War of Knives begins", date: "1799", precision: "year", dimension: "inside", categories: ["wars", "politics"], location: "Southern province",
    summary: "Toussaint's forces fought those of André Rigaud, who controlled the south, in a brutal civil war. It ended in 1800 with Rigaud's defeat and exile.", people: ["toussaint-louverture"], src: [["War of Knives", "War_of_Knives"]] }),
  // ——— 1800s
  ev({ slug: "toussaint-santo-domingo", title: "Toussaint takes Santo Domingo", date: "1801-01", precision: "month", dimension: "inside", categories: ["wars", "politics"], countries: ["Spain"], location: "Santo Domingo",
    summary: "Toussaint's forces occupied the Spanish-speaking east and abolished slavery there, bringing the whole island under his authority.", people: ["toussaint-louverture"], related: ["toussaint-constitution"], src: [TL] }),
  ev({ slug: "leclerc-lands", title: "Napoleon's expedition lands", date: "1802-02", precision: "month", dimension: "foreign", categories: ["wars", "foreign-relations"], countries: ["France"], location: "Cap-Français and other ports",
    summary: "A French fleet carrying tens of thousands of soldiers under General Charles Leclerc arrived to restore French control. Henri Christophe burned Cap-Français rather than surrender it.", people: ["henri-christophe"], related: ["crete-a-pierrot", "toussaint-captured"], src: [EXP] }),
  ev({ slug: "crete-a-pierrot", title: "The defense of Crête-à-Pierrot", date: "1802-03", precision: "month", dimension: "inside", categories: ["wars"], countries: ["France"], location: "Petite-Rivière de l'Artibonite",
    summary: "Jean-Jacques Dessalines held a small fort against a much larger French army for weeks, then broke out with most of his garrison. Marie-Jeanne Lamartinière is remembered for fighting there.", people: ["jean-jacques-dessalines"], related: ["leclerc-lands"], src: [["Battle of Crête-à-Pierrot", "Battle_of_Cr%C3%AAte-%C3%A0-Pierrot"]] }),
  ev({ slug: "generals-defect-1802", title: "Haitian officers turn against the French", date: "1802-10", precision: "month", dimension: "inside", categories: ["wars"], countries: ["France"], location: "Saint-Domingue",
    summary: "As news spread that France had restored slavery in Guadeloupe, officers who had joined Leclerc, including Alexandre Pétion and Dessalines, defected and resumed the war.", people: ["alexandre-petion", "jean-jacques-dessalines"], related: ["vertieres"], src: [EXP] }),
  ev({ slug: "toussaint-dies", title: "Toussaint Louverture dies at Fort de Joux", date: "1803-04-07", precision: "day", dimension: "abroad", categories: ["politics"], countries: ["France"], location: "Fort de Joux, Jura mountains",
    summary: "Held without trial in a cold mountain fortress, Toussaint died of illness and neglect.", people: ["toussaint-louverture"], related: ["toussaint-captured"], src: [TL] }),
  ev({ slug: "arcahaie-flag", title: "The Congress of Arcahaie and the blue and red flag", date: "1803-05-18", precision: "day", dimension: "inside", categories: ["politics"], location: "Arcahaie",
    summary: "The revolutionary generals recognized Dessalines as commander in chief. Tradition holds that he tore the white band from the French tricolor to create the flag of the independence war.", people: ["jean-jacques-dessalines"], related: ["vertieres"], src: [["Flag of Haiti", "Flag_of_Haiti"]] }),
  ev({ slug: "massacre-1804", title: "The killing of the remaining French", date: "1804-02", precision: "month", dimension: "inside", categories: ["wars", "major-events"], location: "Across Haiti",
    summary: "Between February and April 1804, on Dessalines's orders, most of the French who remained in Haiti were killed; estimates run to several thousand. The massacre hardened hostility toward Haiti among slaveholding nations.", people: ["jean-jacques-dessalines"], related: ["independence-1804"], src: [["1804 Haiti massacre", "1804_Haiti_massacre"]] }),
  ev({ slug: "dessalines-crowned", title: "Dessalines becomes Emperor Jacques I", date: "1804-10", precision: "month", dimension: "inside", categories: ["politics"], location: "Cap-Haïtien",
    summary: "Months after independence, Dessalines was proclaimed and crowned emperor.", people: ["jean-jacques-dessalines"], src: [JJD] }),
  ev({ slug: "siege-santo-domingo-1805", title: "Dessalines besieges Santo Domingo", date: "1805-03", precision: "month", dimension: "inside", categories: ["wars"], countries: ["France"], location: "Santo Domingo",
    summary: "Haitian forces invaded the east, still held by the French, and besieged its capital, withdrawing when a French squadron appeared.", people: ["jean-jacques-dessalines"], src: [JJD] }),
  ev({ slug: "constitution-1805", title: "The imperial constitution", date: "1805-05-20", precision: "day", dimension: "inside", categories: ["politics", "society"], location: "Haiti",
    summary: "Haiti's first constitution as an independent state abolished slavery forever, barred white foreigners from owning property and declared that all Haitians would be known as black.", people: ["jean-jacques-dessalines"], src: [JJD] }),
  ev({ slug: "state-of-haiti-1807", title: "Haiti splits into two states", date: "1807-02", precision: "month", dimension: "inside", categories: ["politics", "wars"], location: "Cap-Haïtien and Port-au-Prince",
    summary: "Henri Christophe became president of the State of Haiti in the north, while Alexandre Pétion led the Republic of Haiti in the south and west. They remained at war for years.", people: ["henri-christophe", "alexandre-petion"], related: ["christophe-crowned"], src: [["State of Haiti", "State_of_Haiti"]] }),
  // ——— 1820s
  ev({ slug: "christophe-dies", title: "Henri Christophe takes his own life", date: "1820-10-08", precision: "day", dimension: "inside", categories: ["politics"], location: "Sans-Souci palace, Milot",
    summary: "Partly paralyzed by a stroke and facing a revolt by his army, the king died by suicide. Boyer reunited the country within weeks.", people: ["henri-christophe", "jean-pierre-boyer"], related: ["boyer-unifies-island"], src: [["Henri Christophe", "Henri_Christophe"]] }),
  ev({ slug: "spanish-haiti", title: "The east declares itself 'Spanish Haiti'", date: "1821-12-01", precision: "day", dimension: "inside", categories: ["politics", "foreign-relations"], countries: ["Spain"], location: "Santo Domingo",
    summary: "Led by José Núñez de Cáceres, colonists in the east declared independence from Spain and sought union with Gran Colombia. Boyer occupied the territory weeks later.", related: ["boyer-unifies-island"], src: [["Republic of Spanish Haiti", "Republic_of_Spanish_Haiti"]] }),
  ev({ slug: "african-american-emigration", title: "Free African Americans settle in Haiti", date: "1824", precision: "year", dimension: "inside", categories: ["society", "contributions"], countries: ["United States"], location: "Port-au-Prince and Samaná",
    summary: "Answering Boyer's invitation, several thousand free Black Americans emigrated to Haiti. Many returned, but descendants of those who settled at Samaná still live there.", people: ["jean-pierre-boyer"], src: [["Samaná Americans", "Saman%C3%A1_Americans"]] }),
  ev({ slug: "code-rural-1826", title: "The Code Rural", date: "1826", precision: "year", dimension: "inside", categories: ["business", "society", "economy"], location: "Haiti",
    summary: "Boyer's labor code required most rural Haitians to work the land and restricted their movement, aiming to raise exports to pay the French indemnity. Peasants widely resisted it.", people: ["jean-pierre-boyer"], related: ["indemnity-1825"], src: [["Jean-Pierre Boyer", "Jean-Pierre_Boyer"]] }),
  // ——— 1910s
  ev({ slug: "bnrh-1910", title: "A foreign-owned national bank", date: "1910", precision: "year", dimension: "foreign", categories: ["economy", "business"], countries: ["France", "Germany", "United States"], location: "Port-au-Prince",
    summary: "Haiti's national bank was reorganized with French, German and American capital, including National City Bank of New York, giving foreign shareholders control over the government's money.", related: ["gold-removed-1914"], src: [["Bank of the Republic of Haiti", "Bank_of_the_Republic_of_Haiti"]] }),
  ev({ slug: "sam-killed", title: "President Sam is killed by a crowd", date: "1915-07-28", precision: "day", dimension: "inside", categories: ["politics"], location: "Port-au-Prince",
    summary: "A day after his police chief had around 167 political prisoners executed, President Vilbrun Guillaume Sam was dragged from the French legation and killed. US forces landed that afternoon.", related: ["us-occupation-1915"], src: [["Vilbrun Guillaume Sam", "Vilbrun_Guillaume_Sam"]] }),
  ev({ slug: "treaty-1915", title: "A treaty hands Haiti's finances to the United States", date: "1915-09-16", precision: "day", dimension: "foreign", categories: ["foreign-relations", "economy"], countries: ["United States"], location: "Port-au-Prince",
    summary: "The treaty signed under occupation placed customs, public finance and a new constabulary under American officials.", related: ["us-occupation-1915"], src: [OCC] }),
  ev({ slug: "fort-riviere", title: "Marines storm Fort Rivière", date: "1915-11-17", precision: "day", dimension: "inside", categories: ["wars"], countries: ["United States"], location: "Near Grande-Rivière-du-Nord",
    summary: "Marines under Smedley Butler captured the old fort used by caco fighters, killing its defenders and ending the first phase of armed resistance.", related: ["peralte-killed"], src: [["Battle of Fort Rivière", "Battle_of_Fort_Rivi%C3%A8re"]] }),
  ev({ slug: "corvee-1916", title: "Forced road labor is revived", date: "1916", precision: "year", dimension: "inside", categories: ["society", "business"], countries: ["United States"], location: "Rural Haiti",
    summary: "Occupation authorities used an old law to conscript peasants for unpaid road work. Abuses against laborers drove many to join the armed resistance.", related: ["peralte-killed"], src: [OCC] }),
  ev({ slug: "legislature-dissolved-1917", title: "The legislature is dissolved", date: "1917-06", precision: "month", dimension: "inside", categories: ["politics"], countries: ["United States"], location: "Port-au-Prince",
    summary: "When legislators refused to approve a US-drafted constitution, President Dartiguenave dissolved the legislature with the backing of the Marines.", src: [OCC] }),
  ev({ slug: "constitution-1918", title: "Foreign land ownership approved by plebiscite", date: "1918-06-12", precision: "day", dimension: "inside", categories: ["politics", "business"], countries: ["United States"], location: "Haiti",
    summary: "A constitution permitting foreigners to own land, banned since independence, was approved in a plebiscite held under occupation.", src: [OCC] }),
  // ——— 1920s
  ev({ slug: "senate-inquiry-1921", title: "The US Senate investigates the occupation", date: "1921", precision: "year", dimension: "foreign", categories: ["foreign-relations", "politics"], countries: ["United States"], location: "Washington and Haiti",
    summary: "A Senate committee held hearings on abuses by Marines in Haiti and the Dominican Republic. It documented abuses but recommended that the occupation continue.", src: [OCC] }),
  ev({ slug: "russell-high-commissioner", title: "John H. Russell becomes High Commissioner", date: "1922", precision: "year", dimension: "foreign", categories: ["foreign-relations", "politics"], countries: ["United States"], location: "Port-au-Prince",
    summary: "The Marine general was given authority over all US officials in Haiti and worked closely with President Borno for the rest of the decade.", src: [["John H. Russell Jr.", "John_H._Russell_Jr."]] }),
  ev({ slug: "borno-1922", title: "Louis Borno becomes president", date: "1922-05", precision: "month", dimension: "inside", categories: ["politics"], location: "Port-au-Prince",
    summary: "Chosen by an appointed Council of State rather than an elected legislature, Borno governed in partnership with the occupation until 1930.", people: ["louis-borno"], src: [["Louis Borno", "Louis_Borno"]] }),
  ev({ slug: "olympic-bronze-1924", title: "Haiti's first Olympic medal", date: "1924", precision: "year", dimension: "abroad", categories: ["sports", "contributions"], countries: ["France"], location: "Paris",
    summary: "Haiti's rifle team won bronze in the team free rifle event at the Paris Olympics.", related: ["cator-1928"], src: [["Haiti at the 1924 Summer Olympics", "Haiti_at_the_1924_Summer_Olympics"]] }),
];

export const yearPeople: Person[] = [
  { slug: "guacanagari", name: "Guacanagarí", roles: ["Cacique of Marien"], bio: "Leader of the chiefdom of Marien in the northwest, including the north of today's Haiti. Spanish accounts name him as the cacique whose people helped Columbus's crew after the wreck of the Santa María in 1492. He is known almost entirely from European sources." },
  { slug: "caonabo", name: "Caonabo", roles: ["Cacique of Maguana"], bio: "Leader associated with the chiefdom of Maguana in the central interior, remembered for resisting the Spanish in the 1490s. He is known mainly from colonial-era accounts." },
  { slug: "guarionex", name: "Guarionex", roles: ["Cacique of Maguá"], bio: "Leader of the chiefdom of Maguá in the northeast at the time of European contact, known mainly from colonial-era accounts." },
  { slug: "cotubanama", name: "Cotubanamá", roles: ["Cacique of Higüey"], bio: "Leader associated with the chiefdom of Higüey in the east during the later contact period, known mainly from colonial-era accounts." },
  { slug: "ramon-pane", name: "Ramón Pané", roles: ["Friar", "Chronicler"], bio: "A friar who studied and recorded Taíno religious beliefs in the 1490s. His account is one of the earliest descriptions of Indigenous spirituality in the Caribbean and must be read critically, as it was written within the colonial encounter." },
  { slug: "louis-borno", name: "Louis Borno", born: "1865", died: "1942", roles: ["President"], bio: "Lawyer and diplomat who served as president from 1922 to 1930 under the US occupation, chosen by an appointed Council of State." },
];
