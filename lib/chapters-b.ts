import type { EssayBlock, HistEvent, Period } from "./types";

/** Chapters and moments: 1850s through 1900s. */
const wiki = (t: string) => `https://en.wikipedia.org/wiki/${t}`;
const y = (year: string, title: string): EssayBlock => ({ type: "year", year, title });
const p = (text: string): EssayBlock => ({ type: "p", text });
type E = Omit<HistEvent, "status" | "sources"> & { status?: HistEvent["status"]; src: [string, string][] };
const ev = ({ src, status = "documented", ...e }: E): HistEvent => ({ ...e, status, sources: src.map(([title, page]) => ({ title, url: wiki(page) })) });

/** Titles and summaries for decades that had none. */
export const periodInfoB: Record<string, Pick<Period, "title" | "overview" | "legacy">> = {
  "1850s": {
    title: "Empire: Faustin I and the war with the east",
    overview: "Faustin Soulouque ruled as Emperor Faustin I through most of the decade, repeatedly invading the Dominican Republic without success. Fabre Geffrard overthrew him in 1859 and restored the republic.",
    legacy: "Geffrard's republic opened the 1860s with a concordat with the Vatican and, at last, recognition by the United States.",
  },
  "1870s": {
    title: "Parties: Liberals, Nationals and gunboats",
    overview: "Haitian politics organized around two parties, the Liberals and the Nationals. Foreign powers increasingly used warships to collect debts and claims, and a scandalous 1875 loan deepened the country's indebtedness.",
    legacy: "Lysius Salomon's election in 1879 opened a decade of National Party rule and a new, French-controlled national bank.",
  },
  "1890s": {
    title: "Pressure: warships at the harbor",
    overview: "Haiti refused to give the United States a naval base, presented itself to the world at the Chicago World's Fair, and was forced by German warships to pay an indemnity. The decade showed how exposed the country was to foreign gunboat diplomacy.",
    legacy: "The rivalry between Anténor Firmin and Nord Alexis would explode into civil war in 1902.",
  },
  "1900s": {
    title: "Centennial: civil war and a hundred years of independence",
    overview: "The decade opened with civil war between supporters of Anténor Firmin and Nord Alexis, who took power in 1902. Haiti celebrated a century of independence in 1904 with a new national anthem, while a corruption trial exposed how public finances had been looted.",
    legacy: "Nord Alexis fell in 1908, and the instability that followed set the stage for the crises of the 1910s.",
  },
};

export const chaptersB: Record<string, EssayBlock[]> = {
  "1850s": [
    p("Through most of the 1850s Haiti was an empire. Faustin Soulouque, chosen president in 1847 because the elite thought him easy to control, crowned himself Faustin I, built a court and a nobility, and spent the country's resources on wars to retake the Dominican Republic. His defeats and repression eventually turned the army against him."),
    y("1852", "A coronation in Port-au-Prince"),
    p("Soulouque, proclaimed emperor in 1849, held a lavish formal coronation in 1852. His court created dozens of dukes, counts and barons."),
    y("1855", "The last invasion of the east"),
    p("Faustin I invaded the Dominican Republic again in late 1855. His armies were defeated in a series of battles, including at Santomé in December, and retreated early in 1856. It was the last major Haitian attempt to reunite the island by force."),
    y("1859", "Geffrard restores the republic"),
    p("In January 1859 General Fabre Geffrard led a revolt from Gonaïves and proclaimed the republic. Soulouque abdicated and went into exile. Geffrard's government focused on education, foreign recognition and relations with the Church."),
  ],

  "1860s": [
    p("Under Fabre Geffrard, Haiti sought a place among nations. A concordat with the Vatican rebuilt the Catholic Church and its schools, the United States finally recognized Haitian independence, and Haiti invited African Americans to settle. But when Spain reannexed the Dominican Republic, the decade turned violent, and it ended in civil war and the execution of a president."),
    y("1860", "The Concordat"),
    p("In March 1860 Haiti and the Vatican signed a concordat that restored a regular Catholic hierarchy. French clergy arrived to staff parishes and Catholic schools, which shaped the education of the Haitian elite for a century."),
    y("1861", "A new emigration from the United States, and Spain returns"),
    p("With the Haitian government's support, the American abolitionist James Redpath organized emigration from the United States, and around two thousand African Americans sailed for Haiti in 1861–62. That year Spain reannexed the Dominican Republic at the invitation of its president, alarming Haiti."),
    y("1862", "Washington recognizes Haiti"),
    p("With Southern states absent from Congress during the Civil War, President Abraham Lincoln signed legislation establishing diplomatic relations with Haiti and Liberia."),
    y("1863", "The Dominican Restoration War"),
    p("Dominicans rose against Spanish rule in 1863. Haitian territory served as a refuge and supply route for the rebels, and Spain withdrew in 1865."),
    y("1865", "Salnave's revolt and a British bombardment"),
    p("Major Sylvain Salnave led a revolt in Cap-Haïtien. When rebels seized a British-protected ship, the British warship HMS _Bulldog_ intervened; it ran aground and was blown up, and the British bombarded the town."),
    y("1867", "Geffrard falls; Salnave takes power"),
    p("Geffrard resigned in March 1867 and left for Jamaica. Salnave became president, but a civil war against him spread across the country."),
    y("1869", "Civil war"),
    p("By 1869 Salnave held little beyond Port-au-Prince. He fled in December, was captured, and was executed in January 1870."),
  ],

  "1870s": [
    p("After the civil war, Haiti's politics took a new shape. Two parties competed for power: the Liberals, many of them from the light-skinned urban elite, under the slogan of government by the most competent, and the Nationals, who claimed to speak for the black majority. Meanwhile European powers, especially Germany, began using warships to force Haiti to pay claims, and a loan raised in Paris in 1875 became a byword for corruption."),
    y("1870", "Salnave executed; Nissage Saget elected"),
    p("Salnave was executed in January. Nissage Saget became president and, in 1874, became one of the first Haitian presidents to complete his term and leave office peacefully."),
    y("1872", "German gunboats seize Haitian ships"),
    p("In June 1872 German warships under Captain Batsch entered Port-au-Prince harbor and seized two Haitian naval vessels until the government paid claims on behalf of German merchants. The humiliation was long remembered."),
    y("1874", "Michel Domingue"),
    p("General Michel Domingue took power, with his nephew Septimus Rameau as the real force in the government."),
    y("1875", "The 1875 loan"),
    p("Domingue's government contracted a large loan in Paris. A large share of it was absorbed by commissions and fees, while Haiti was left owing the full amount. Popular anger at the loan and at Rameau helped topple the government in 1876."),
    y("1876", "Boisrond-Canal"),
    p("Pierre Théoma Boisrond-Canal, a Liberal, became president after Domingue's fall."),
    y("1879", "Salomon"),
    p("After violent clashes between Liberals and Nationals, Lysius Salomon, a National Party leader and former finance minister, was elected president."),
  ],

  "1880s": [
    p("Lysius Salomon governed for most of the 1880s, modernizing institutions and centralizing power. His government founded a national bank, controlled by French capital, and crushed a Liberal uprising. In Paris a Haitian scholar published a landmark refutation of racist science. Salomon's fall in 1888 led to a civil war that drew in the United States."),
    y("1880", "A national bank founded in Paris"),
    p("Salomon's government authorized the Banque Nationale d'Haïti, founded with French capital and headquartered in Paris. It handled the government's revenues and payments, putting public finances in foreign hands."),
    y("1883", "The Liberal uprising"),
    p("Exiled Liberals landed at Miragoâne in 1883 and held out for months. In Port-au-Prince, fighting in September destroyed much of the commercial district."),
    y("1885", "The Equality of the Human Races"),
    p("In Paris, the anthropologist and diplomat Anténor Firmin published _De l'égalité des races humaines_, a nearly 700-page rebuttal of Arthur de Gobineau's theories of racial hierarchy."),
    y("1888", "Salomon falls"),
    p("Facing revolt in the north, Salomon resigned and went into exile. François Légitime and Florvil Hyppolite fought for the presidency."),
    y("1889", "Hyppolite wins"),
    p("Hyppolite, backed by the north and supplied with weapons through American merchants, defeated Légitime and became president. The United States expected a reward. Frederick Douglass arrived as US minister that year."),
  ],

  "1890s": [
    p("In the 1890s Haiti stood up to one great power and was humiliated by another. It refused the United States a naval base at Môle Saint-Nicolas, presented itself proudly to the world at the Chicago World's Fair, and then, in 1897, was forced by German warships to pay an indemnity and apologize over a single German resident."),
    y("1891", "No base at the Môle"),
    p("The United States, which had helped Hyppolite to power, sent warships and demanded a lease on Môle Saint-Nicolas as a coaling station. Foreign minister Anténor Firmin led Haiti's refusal."),
    y("1893", "Haiti at Chicago"),
    p("At the World's Columbian Exposition in Chicago, Haiti's pavilion, with Frederick Douglass as its commissioner, celebrated the Haitian Revolution and the republic before millions of visitors."),
    y("1896", "Simon Sam"),
    p("Hyppolite died in March 1896. Tirésias Simon Sam became president."),
    y("1897", "The Lüders affair"),
    p("After Emil Lüders, a German resident, was arrested and expelled following a dispute with police, two German warships arrived in December 1897 and threatened to bombard Port-au-Prince. Haiti paid an indemnity and issued an apology."),
  ],

  "1900s": [
    p("Haiti entered the twentieth century divided. The decade opened with civil war between the followers of Anténor Firmin, the internationally known scholar, and General Nord Alexis, who won. In 1904 the country celebrated a century of independence with a new national anthem. That same year, a trial exposed how officials and foreign bankers had looted the public debt. The fall of Nord Alexis in 1908 ushered in the chaos of the 1910s."),
    y("1902", "Firmin against Nord Alexis"),
    p("After President Simon Sam left office, Firmin and Nord Alexis fought for power. When a German gunboat cornered the Firminist flagship _Crête-à-Pierrot_ in September, Admiral Hammerton Killick blew it up with himself aboard. Nord Alexis became president in December, and Firmin went into exile."),
    y("1904", "A century of independence"),
    p("Haiti celebrated the centennial of independence. _La Dessalinienne_, with words by Justin Lhérisson and music by Nicolas Geffrard, was written for the occasion and became the national anthem. The same year the Consolidation trial convicted officials and employees of the French-controlled national bank of fraud involving the public debt."),
    y("1908", "Nord Alexis falls"),
    p("A revolt in the south forced Nord Alexis out in December 1908. Antoine Simon took power, beginning a period of increasingly rapid turnover."),
  ],
};

export const eventsB: HistEvent[] = [
  ev({ slug: "soulouque-invasion-1855", title: "Faustin I's last invasion of the Dominican Republic", date: "1855-12", precision: "month", dimension: "inside", categories: ["wars", "foreign-relations"], countries: ["Dominican Republic"], location: "Southern Dominican Republic",
    summary: "Soulouque's armies were defeated at Santomé and elsewhere and withdrew early in 1856, the last major Haitian attempt to retake the east by force.", people: ["faustin-soulouque"], related: ["dominican-independence-1844"], src: [["Faustin Soulouque", "Faustin_Soulouque"]] }),
  ev({ slug: "geffrard-1859", title: "Geffrard overthrows the emperor", date: "1859-01", precision: "month", dimension: "inside", categories: ["politics"], location: "Gonaïves and Port-au-Prince",
    summary: "General Fabre Geffrard proclaimed the republic in Gonaïves. Soulouque abdicated and went into exile.", people: ["faustin-soulouque"], related: ["concordat-1860"], src: [["Fabre Geffrard", "Fabre_Geffrard"]] }),
  ev({ slug: "redpath-emigration", title: "A second wave of African American emigration", date: "1861", precision: "year", dimension: "inside", categories: ["society", "contributions"], countries: ["United States"], location: "Haiti",
    summary: "With Haitian government support, abolitionist James Redpath organized emigration from the United States; around two thousand people came in 1861–62.", related: ["african-american-emigration"], src: [["James Redpath", "James_Redpath"]] }),
  ev({ slug: "dominican-restoration-1863", title: "Dominicans rise against Spain, with refuge in Haiti", date: "1863", precision: "year", dimension: "foreign", categories: ["wars", "foreign-relations"], countries: ["Spain", "Dominican Republic"], location: "Dominican Republic and the border",
    summary: "After Spain reannexed the Dominican Republic in 1861, Dominicans rebelled. Haitian territory served as refuge and supply route, and Spain withdrew in 1865.", src: [["Dominican Restoration War", "Dominican_Restoration_War"]] }),
  ev({ slug: "bulldog-1865", title: "A British warship bombards Cap-Haïtien", date: "1865-10", precision: "month", dimension: "foreign", categories: ["wars", "foreign-relations"], countries: ["Great Britain"], location: "Cap-Haïtien",
    summary: "During Salnave's revolt, HMS Bulldog intervened, ran aground and was blown up, and British ships bombarded the town.", src: [["HMS Bulldog (1845)", "HMS_Bulldog_(1845)"]] }),
  ev({ slug: "salnave-executed", title: "President Salnave is executed after civil war", date: "1870-01-15", precision: "day", dimension: "inside", categories: ["politics", "wars"], location: "Port-au-Prince",
    summary: "Sylvain Salnave, president since 1867, lost a nationwide civil war, was captured fleeing and was executed.", src: [["Sylvain Salnave", "Sylvain_Salnave"]] }),
  ev({ slug: "batsch-1872", title: "German gunboats seize Haitian warships", date: "1872-06", precision: "month", dimension: "foreign", categories: ["foreign-relations", "economy"], countries: ["Germany"], location: "Port-au-Prince",
    summary: "German warships seized two Haitian vessels until the government paid claims on behalf of German merchants.", src: [["Germany–Haiti relations", "Germany%E2%80%93Haiti_relations"]] }),
  ev({ slug: "loan-1875", title: "The 1875 loan", date: "1875", precision: "year", dimension: "foreign", categories: ["economy"], countries: ["France"], location: "Paris",
    summary: "Michel Domingue's government contracted a large loan in Paris, much of it absorbed by commissions and fees. Anger over it helped bring the government down in 1876.", src: [["Michel Domingue", "Michel_Domingue"]] }),
  ev({ slug: "salomon-1879", title: "Lysius Salomon becomes president", date: "1879", precision: "year", dimension: "inside", categories: ["politics"], location: "Port-au-Prince",
    summary: "The National Party leader began nearly a decade in power marked by centralization and modernization.", src: [["Lysius Salomon", "Lysius_Salomon"]] }),
  ev({ slug: "national-bank-1880", title: "A French-controlled national bank", date: "1880", precision: "year", dimension: "foreign", categories: ["economy", "business"], countries: ["France"], location: "Paris and Port-au-Prince",
    summary: "The Banque Nationale d'Haïti was founded with French capital and headquartered in Paris, giving foreign shareholders control of the government's revenues.", related: ["bnrh-1910"], src: [["Lysius Salomon", "Lysius_Salomon"]] }),
  ev({ slug: "miragoane-1883", title: "The Liberal uprising at Miragoâne", date: "1883", precision: "year", dimension: "inside", categories: ["wars", "politics"], location: "Miragoâne and Port-au-Prince",
    summary: "Exiled Liberals landed at Miragoâne and held out for months; fighting in Port-au-Prince destroyed much of its commercial district.", src: [["Lysius Salomon", "Lysius_Salomon"]] }),
  ev({ slug: "hyppolite-1889", title: "Florvil Hyppolite wins the civil war", date: "1889", precision: "year", dimension: "inside", categories: ["politics", "wars"], countries: ["United States"], location: "Port-au-Prince",
    summary: "Backed by the north and supplied through American merchants, Hyppolite defeated François Légitime and became president.", related: ["mole-saint-nicolas-1891"], src: [["Florvil Hyppolite", "Florvil_Hyppolite"]] }),
  ev({ slug: "luders-1897", title: "The Lüders affair", date: "1897-12", precision: "month", dimension: "foreign", categories: ["foreign-relations"], countries: ["Germany"], location: "Port-au-Prince",
    summary: "German warships threatened to bombard Port-au-Prince over the arrest and expulsion of a German resident. Haiti paid an indemnity and apologized.", src: [["Lüders affair", "L%C3%BCders_affair"]] }),
  ev({ slug: "nord-alexis-1902", title: "Nord Alexis takes power after civil war", date: "1902-12", precision: "month", dimension: "inside", categories: ["politics", "wars"], location: "Port-au-Prince",
    summary: "General Nord Alexis defeated Anténor Firmin's supporters and became president; Firmin went into exile.", people: ["antenor-firmin"], related: ["killick-crete-a-pierrot"], src: [["Pierre Nord Alexis", "Pierre_Nord_Alexis"]] }),
  ev({ slug: "consolidation-trial-1904", title: "The Consolidation trial", date: "1904", precision: "year", dimension: "inside", categories: ["economy", "politics"], countries: ["France"], location: "Port-au-Prince",
    summary: "Officials and employees of the French-controlled national bank were tried and convicted of fraud involving the public debt.", src: [["Pierre Nord Alexis", "Pierre_Nord_Alexis"]] }),
  ev({ slug: "simon-1908", title: "Nord Alexis falls; Antoine Simon takes power", date: "1908-12", precision: "month", dimension: "inside", categories: ["politics"], location: "Port-au-Prince",
    summary: "A revolt from the south forced Nord Alexis out, beginning years of rapid turnover in the presidency.", src: [["François C. Antoine Simon", "Fran%C3%A7ois_C._Antoine_Simon"]] }),
];
