import type { PeriodMedia } from "./types";

/**
 * Curated archival entry points for each period. These are collection/item records,
 * not claims that every item in a collection belongs to that decade. Descriptions
 * identify the relevant date range and what researchers can actually find there.
 */
export const periodMedia: Record<string, PeriodMedia[]> = {
  "indigenous-ayiti": [
    { title: "En Bas Saline: A Taíno Town before and after Columbus", description: "Kathleen Deagan's archaeological study of the community in northern Haiti, occupied c. 1250–1520. Includes research on households, foodways, ceramics, crafts and the changes following European contact.", url: "https://floridapress.org/9781683403593/en-bas-saline/" },
    { title: "Florida Scholarship Online: En Bas Saline", description: "Book contents and chapter abstracts for the archaeological study of En Bas Saline.", url: "https://academic.oup.com/florida-scholarship-online/book/55610" },
  ],
  conquest: [
    { title: "Haiti Digital Library, Duke University", description: "Research guide and digitized materials for colonial Saint-Domingue, the Haitian Revolution and later periods.", url: "https://sites.duke.edu/haitilab/english/" },
    { title: "Francophone Caribbean Collections: Haiti", description: "Library of Congress guide to historical maps, books, prints and other materials on Hispaniola and Haiti.", url: "https://guides.loc.gov/francophone-caribbean-collections-library-of-congress/haiti" },
  ],
  "saint-domingue": [
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Approximately 2,000 manuscripts dating from 1714 to 1957, including material on French colonial rule, the Revolution, and the beginning of Haitian self-government.", url: "https://archives.bpl.org/repositories/2/resources/77" },
    { title: "Digital Library of the Caribbean", description: "A cooperative digital library of books, newspapers, photographs, manuscripts and other material from and about the Caribbean.", url: "https://www.dloc.com/" },
  ],
  "1790s": [
    { title: "Haitian History: Primary Resources, Library of Congress", description: "Letters, newspapers, prints, photographs and records documenting the Revolution and its connections to Black liberation movements in the Americas.", url: "https://guides.loc.gov/haiti-reimagined/primary-resources" },
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Manuscripts include correspondence and military and government records relating to the Revolution and its leaders.", url: "https://archives.bpl.org/repositories/2/resources/77" },
  ],
  "1800s": [
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Correspondence, government papers and military records relating to independence and the first decades of Haitian self-rule.", url: "https://archives.bpl.org/repositories/2/resources/77" },
    { title: "Haiti Digital Library, Duke University", description: "Digitized historical documents and research guides, including material on the Revolution and early independent Haiti.", url: "https://sites.duke.edu/haitilab/english/" },
  ],
  "1810s": [
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Original correspondence and government and military papers connected to early Haitian governments and leaders including Henri Christophe and Alexandre Pétion.", url: "https://archives.bpl.org/repositories/2/resources/77" },
    { title: "Haitiana Collection, University of Florida", description: "Government correspondence and records from Haiti's nineteenth-century administrations, including diplomatic and public affairs material.", url: "https://guides.uflib.ufl.edu/c.php?g=1528267&p=11447702" },
  ],
  "1820s": [
    { title: "Haitiana Collection, University of Florida", description: "Presidential and ministerial correspondence, laws, reports, commercial agreements and diplomatic records. Particularly useful for the Boyer administration and the indemnity period.", url: "https://guides.uflib.ufl.edu/c.php?g=1528267&p=11447702" },
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Original manuscripts relating to the early republic, including political and diplomatic correspondence.", url: "https://archives.bpl.org/repositories/2/resources/77" },
  ],
  "1830s": [
    { title: "Haitiana Collection, University of Florida", description: "Government records and diplomatic correspondence useful for studying the 1838 treaties, public finance and Haiti's foreign relations.", url: "https://guides.uflib.ufl.edu/c.php?g=1528267&p=11447702" },
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Nineteenth-century correspondence and government records, with a substantial portion of the collection dating from 1783 to 1839.", url: "https://archives.bpl.org/repositories/2/resources/77" },
  ],
  "1840s": [
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Government and personal papers documenting the republic's political development after Boyer's overthrow.", url: "https://archives.bpl.org/repositories/2/resources/77" },
    { title: "Haitiana Collection, University of Florida", description: "Diplomatic and government correspondence spanning Haiti's nineteenth century.", url: "https://guides.uflib.ufl.edu/c.php?g=1528267&p=11447702" },
  ],
  "1850s": [
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Records relating to the development of the Haitian state and its nineteenth-century political leadership.", url: "https://archives.bpl.org/repositories/2/resources/77" },
    { title: "Haitiana Collection, University of Florida", description: "Presidential correspondence, laws, reports and diplomatic records from the period.", url: "https://guides.uflib.ufl.edu/c.php?g=1528267&p=11447702" },
  ],
  "1860s": [
    { title: "Haitiana Collection, University of Florida", description: "Correspondence from Haitian presidents, government officials and foreign representatives, including records on diplomacy and public administration.", url: "https://guides.uflib.ufl.edu/c.php?g=1528267&p=11447702" },
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Nineteenth-century government, military, commercial and personal records.", url: "https://archives.bpl.org/repositories/2/resources/77" },
  ],
  "1870s": [
    { title: "Haitiana Collection, University of Florida", description: "Government and diplomatic records relevant to foreign loans, trade, state finances and political change.", url: "https://guides.uflib.ufl.edu/c.php?g=1528267&p=11447702" },
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Original papers from Haitian political and diplomatic life across the nineteenth century.", url: "https://archives.bpl.org/repositories/2/resources/77" },
  ],
  "1880s": [
    { title: "Vue de la citadelle Laferrière, 1888", description: "An illustration of the Citadelle published in Dantès Fortunat's 1888 geographical work. The New York Public Library marks this item free to use without restriction.", url: "https://old-digitalcollections.nypl.org/items/510d47e0-2268-a3d9-e040-e00a18064a99", image: "https://images.nypl.org/index.php?download=1&id=1267383&suffix=510d47e0-2268-a3d9-e040-e00a18064a99.001&t=w", alt: "1888 illustration of the Citadelle Laferrière", credit: "Dantès Fortunat, 1888; Schomburg Center, New York Public Library", license: "Free to use without restriction" },
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Correspondence and records from Haitian political life in the nineteenth century.", url: "https://archives.bpl.org/repositories/2/resources/77" },
  ],
  "1890s": [
    { title: "Haiti, Port-au-Prince: Market Day, Library of Congress", description: "A Detroit Publishing Company glass negative dated between 1880 and 1901, documenting public life and commerce in Port-au-Prince.", url: "https://www.loc.gov/item/2016794479/" },
    { title: "Haitiana Collection, University of Florida", description: "Government and diplomatic records that help trace Haiti's international relations and political economy.", url: "https://guides.uflib.ufl.edu/c.php?g=1528267&p=11447702" },
  ],
  "1900s": [
    { title: "Custom House, Port-au-Prince, 1906", description: "An archival image reproduced from Jacques Nicolas Léger's 1906 book, Haiti: Her History and Her Detractors.", url: "https://en.wikisource.org/wiki/File:Custom_House-_Port-au-Prince-_Haiti,_her_history_and_her_detractors.jpg", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Custom_House- Port-au-Prince- Haiti, her history and her detractors.jpg?width=1600", alt: "The Custom House in Port-au-Prince, reproduced in a 1906 history of Haiti", credit: "Jacques Nicolas Léger, 1906; Wikimedia Commons", license: "Public domain in the United States" },
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "Government, diplomatic and personal records extending into the early twentieth century.", url: "https://archives.bpl.org/repositories/2/resources/77" },
  ],
  "1910s": [
    { title: "Haitian History: Primary Resources, Library of Congress", description: "Includes NAACP records and James Weldon Johnson's investigation of the US occupation, as well as photographs and contemporary reporting.", url: "https://guides.loc.gov/haiti-reimagined/primary-resources" },
    { title: "The United States Occupation, 1915–1934, Duke University", description: "Digitized US and Haitian documents, including the 1915 treaty, Senate inquiry records and Haitian responses to the occupation.", url: "https://sites.duke.edu/haitilab/english/the-united-states-occupation/" },
    { title: "Haiti, Port-au-Prince waterfront, Library of Congress", description: "A photograph dated between 1909 and 1920, showing people, ships and warehouses along the waterfront.", url: "https://www.loc.gov/item/92522610/" },
  ],
  "1920s": [
    { title: "Christophe's Citadel, 1920, New York Public Library", description: "A photograph by Harry Alverson Franck documenting the Citadelle Laferrière. The image dates to 1920, not the period of the fortress's construction.", url: "https://old-digitalcollections.nypl.org/items/510d47e0-22d3-a3d9-e040-e00a18064a99", image: "https://images.nypl.org/index.php?download=1&id=1267480&suffix=510d47e0-22d3-a3d9-e040-e00a18064a99.001&t=w", alt: "A 1920 photograph of the Citadelle Laferrière", credit: "Harry Alverson Franck, 1920; Schomburg Center, New York Public Library", license: "Free to use without restriction" },
    { title: "The United States Occupation, Duke University", description: "Primary documents and historical accounts on the occupation, resistance, international scrutiny and the movement toward withdrawal.", url: "https://sites.duke.edu/haitilab/english/the-united-states-occupation/" },
  ],
  "1930s": [
    { title: "Zora Neale Hurston Plays, Library of Congress", description: "Digitized and catalogued manuscripts by Hurston, whose 1936 fieldwork in Haiti informed her writing on Vodou and Haitian life.", url: "https://guides.loc.gov/haiti-reimagined/primary-resources" },
    { title: "Haiti Digital Library, Duke University", description: "Research materials on the end of the US occupation, the Parsley Massacre and Haitian society.", url: "https://sites.duke.edu/haitilab/english/" },
  ],
  "1940s": [
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "The collection extends to 1957 and includes government, diplomatic and personal records.", url: "https://archives.bpl.org/repositories/2/resources/77" },
    { title: "Haiti Digital Library, Duke University", description: "Digitized Haitian historical publications, cultural materials and research guides.", url: "https://sites.duke.edu/haitilab/english/" },
  ],
  "1950s": [
    { title: "Radio Haiti Archive, Duke University", description: "Audio and visual records beginning in 1957, documenting politics, public life, culture and the Duvalier era.", url: "https://guides.library.duke.edu/c.php?g=1038475&p=8592047" },
    { title: "Haitian Manuscripts Collection, Boston Public Library", description: "The collection includes material through 1957, including government and diplomatic records.", url: "https://archives.bpl.org/repositories/2/resources/77" },
  ],
  "1960s": [
    { title: "Radio Haiti Archive, Duke University", description: "Broadcast recordings and related materials documenting the Duvalier dictatorship, repression, opposition and everyday life.", url: "https://guides.library.duke.edu/c.php?g=1038475&p=8592047" },
    { title: "Haiti Digital Library, Duke University", description: "Historical and cultural materials on Haiti, including literature, music and political history.", url: "https://sites.duke.edu/haitilab/english/" },
  ],
  "1970s": [
    { title: "Radio Haiti Archive, Duke University", description: "Audio and visual reporting that helps reconstruct political developments, migration, culture and public debate from the late 1950s onward.", url: "https://guides.library.duke.edu/c.php?g=1038475&p=8592047" },
  ],
  "1980s": [
    { title: "Radio Haiti Archive, Duke University", description: "Recordings documenting the final years of the Duvalier regime, the 1986 uprising, military rule and the transition toward elections.", url: "https://guides.library.duke.edu/c.php?g=1038475&p=8592047" },
    { title: "Haitian History: Primary Resources, Library of Congress", description: "Archival collections and research pathways for Haiti and the wider Black diaspora.", url: "https://guides.loc.gov/haiti-reimagined/primary-resources" },
  ],
  "1990s": [
    { title: "Radio Haiti Archive, Duke University", description: "A major source for the 1991 coup, repression, the return of Aristide, human-rights reporting and the early Préval years.", url: "https://guides.library.duke.edu/c.php?g=1038475&p=8592047" },
    { title: "Caribbean Sea Migration Collection, Duke University", description: "Records on maritime migration and interdictions from 1982 to 2012, including Haitian migration through the Caribbean and Florida Straits.", url: "https://guides.library.duke.edu/c.php?g=1038475&p=8592047" },
  ],
  "2000s": [
    { title: "Radio Haiti Archive, Duke University", description: "The archive documents Haiti through 2003, including the Aristide years and political conflict before the 2004 bicentennial.", url: "https://guides.library.duke.edu/c.php?g=1038475&p=8592047" },
    { title: "Caribbean Sea Migration Collection, Duke University", description: "Records on Haitian and other Caribbean maritime migration from 1982 to 2012.", url: "https://guides.library.duke.edu/c.php?g=1038475&p=8592047" },
  ],
  "2010s": [
    { title: "USGS Rapid Response to Haiti, 2010", description: "A public-domain photograph of earthquake damage in Port-au-Prince, with related scientific photography and reports.", url: "https://www.usgs.gov/media/images/usgs-rapid-response-haiti-1", image: "https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/Haiti_Jan_2010_3_104.jpg", alt: "A collapsed building in Port-au-Prince after the January 2010 earthquake", credit: "Walter Mooney, US Geological Survey, 1 February 2010", license: "Public domain, USGS" },
    { title: "Smithsonian Haiti Cultural Recovery Project", description: "Records on efforts to rescue, document and conserve Haitian artworks, artifacts, documents and architectural heritage after the 2010 earthquake.", url: "https://collections.si.edu/search/results.htm?fq=-object_type%3A%22Photographs%22&fq=object_type%3A%22Collection+descriptions%22&q=%22Haitian%22" },
    { title: "MINUSTAH resources and earthquake records", description: "United Nations briefings, photographs, statements and reports relating to the 2010 earthquake and the mission's work through 2017.", url: "https://minustah.unmissions.org/en/resources" },
  ],
  "2020s": [
    { title: "REDOP: Public Documentation of Haiti", description: "An open catalogue of Haitian public documents and international publications, with coverage from 1890 to 2026, including laws, budgets, reports and public policy.", url: "https://redop.charesso.org/" },
    { title: "United Nations Integrated Office in Haiti: 2020 report", description: "A dated UN Secretary-General report providing a primary institutional record of political and security developments in 2020.", url: "https://digitallibrary.un.org/record/3885639?ln=en" },
    { title: "COVID-19 in Haiti: World Bank country background", description: "A World Bank report documenting the first confirmed cases on 19 March 2020, the national health emergency and the early economic response.", url: "https://documents1.worldbank.org/curated/en/346091609822078760/pdf/Final-Report.pdf" },
    { title: "UN Secretary-General report on Haiti, January 2026", description: "A dated Security Council report covering the end of 2025, political transition arrangements, the election calendar, security developments and humanitarian conditions.", url: "https://digitallibrary.un.org/record/4099435/files/S_2026_31-EN.pdf" },
    { title: "UN Panel of Experts final report on Haiti, September 2026", description: "A Security Council expert report covering October 2025 to July 2026, including armed-group activity, weapons trafficking, security operations and sanctions enforcement.", url: "https://www.haitidocs.org/doc/un-panel-experts-2026" },
    { title: "UN Security Council briefing on Haiti, 19 October 2026", description: "A contemporaneous record of the security situation, civilian harm and risks to the planned electoral process.", url: "https://press.un.org/en/2026/sc16482.doc.htm" },
    { title: "Haiti election timetable postponed, October 2026", description: "Reporting on the electoral authorities' revised schedule, with the first round now set for July 2027 and a second round and local elections for October 2027.", url: "https://www.reuters.com/world/americas/haiti-postpones-first-presidential-election-decade-july-2027-2026-10-29/" },
  ],
};
