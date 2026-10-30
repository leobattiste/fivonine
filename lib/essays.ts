import type { EssayBlock } from "./types";

/**
 * Long-form decade essays, organized year by year.
 * Images are public domain (by age or as US government works) and hosted on Wikimedia Commons.
 * No portraits or photographs of identifiable individuals.
 */
const commons = (file: string) => ({
  src: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1600`,
  source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`,
});
const img = (file: string, alt: string, caption: string, credit: string, license = "Public domain"): EssayBlock => ({
  type: "img", ...commons(file), alt, caption, credit, license,
});
const y = (year: string, title: string): EssayBlock => ({ type: "year", year, title });
const p = (text: string): EssayBlock => ({ type: "p", text });

export const essays: Record<string, EssayBlock[]> = {
  // ————————————————————————————————————————————————————————————— 1790s
  "1790s": [
    p("At the start of the decade, Saint-Domingue was the richest colony in the world and one of the most violent. Roughly half a million enslaved Africans and their descendants produced sugar and coffee for Europe. Around 30,000 white colonists and a similar number of free people of color held power, land and, in many cases, enslaved people of their own. By the end of the decade, slavery had been abolished, the colony was governed by a formerly enslaved general, and the three great empires of the Atlantic had all sent armies and lost."),
    img("Carte de la colonie française de Saint-Domingue.jpg", "An old hand-drawn map of the French colony of Saint-Domingue, the western part of Hispaniola.", "A colonial map of French Saint-Domingue, divided into its northern, western and southern provinces.", "Unknown cartographer, colonial period"),
    y("1790", "The Revolution in Paris reaches the colony"),
    p("News of the French Revolution and the Declaration of the Rights of Man arrived in 1789 and split colonial society. White planters wanted self-government, free from Paris. Free people of color, led in France by advocates such as Julien Raimond and Vincent Ogé, demanded the equal rights the new principles seemed to promise. Colonial assemblies refused. In October 1790 Ogé landed in the north with a few hundred armed men to force the issue. He was defeated, handed over by Spanish authorities, and in February 1791 broken on the wheel at Cap-Français."),
    y("1791", "The uprising in the Northern Plain"),
    p("In May 1791 the National Assembly in Paris granted political rights to free men of color born of free parents, a narrow concession that colonists still refused to apply. Meanwhile the enslaved were organizing. According to tradition, a ceremony at Bois Caïman in mid-August, led by Dutty Boukman and the priestess Cécile Fatiman, bound conspirators together. On the night of 22 August, enslaved people across the Northern Plain rose. Within weeks hundreds of plantations were burning and the plain around Cap-Français was in insurgent hands."),
    img("Fire in Saint-Domingo 1791, German copper engraving.jpg", "An eighteenth-century engraving showing plantations in flames.", "A German copper engraving of the fires that swept the Northern Plain in 1791.", "Unknown engraver, 18th century"),
    p("Boukman was killed in battle in November. Leadership passed to Jean-François and Georges Biassou. A literate formerly enslaved coachman in his late forties, Toussaint Bréda, who would later take the name Louverture, joined the insurgents and rose quickly as a military organizer."),
    y("1792", "Rights for free people of color, and commissioners from France"),
    p("In April 1792 France granted full citizenship to all free people of color, hoping to unite free colonists of every color against the insurrection. Civil commissioners Léger-Félicité Sonthonax and Étienne Polverel arrived in September with several thousand troops to enforce the decree, and soon found themselves at war with royalist and autonomist planters as much as with the insurgents."),
    y("1793", "War, fire and the first abolition"),
    p("France went to war with Britain and Spain early in 1793. Spain, which held the eastern part of the island, recruited the insurgent leaders as auxiliaries; Jean-François, Biassou and Toussaint fought under the Spanish flag. In June a confrontation between Sonthonax and the newly arrived governor, François-Thomas Galbaud, turned Cap-Français into a battlefield. To save the Republic's position, Sonthonax promised freedom to insurgents who would fight for France. Much of the city burned."),
    img("Vue de l'incendie de la ville du Cap Français, Arrivée le 21 Juin 1793.jpg", "An engraving of the city of Cap-Français burning, seen from the harbor.", "The burning of Cap-Français in June 1793, as depicted in a contemporary engraving.", "Unknown engraver, 1790s"),
    p("On 29 August 1793 Sonthonax proclaimed the abolition of slavery in the north; Polverel followed in the west and south. The same autumn, British forces landed at Jérémie and Môle Saint-Nicolas, invited by planters who hoped Britain would preserve slavery."),
    y("1794", "Paris abolishes slavery; Toussaint changes sides"),
    p("On 4 February 1794 the National Convention abolished slavery in all French colonies, ratifying what had happened in Saint-Domingue. That spring Toussaint broke with Spain and brought his army over to the French Republic. From then on he fought the Spanish and the British in its name, winning a series of campaigns in the west and the Artibonite."),
    y("1795", "Spain withdraws"),
    p("Under the Treaty of Basel in July 1795, Spain made peace with France and ceded its part of the island, Santo Domingo, on paper. The war in the colony narrowed to the Republic against Britain."),
    y("1796", "Toussaint becomes lieutenant governor"),
    p("In March 1796 officers in Cap-Français arrested the French governor, Étienne Laveaux. Toussaint's troops freed him, and Laveaux named Toussaint lieutenant governor of the colony."),
    y("1797", "Commander in chief"),
    p("Toussaint was appointed commander in chief of the army of Saint-Domingue. By August he had maneuvered Sonthonax, who had been elected to represent the colony in Paris, into leaving. Toussaint now held more real power in the colony than any official sent from France."),
    y("1798", "The British leave"),
    p("After five years of fighting and enormous losses to disease, Britain negotiated its withdrawal with Toussaint and evacuated its last positions in 1798. The French agent Gabriel de Hédouville, sent to rein Toussaint in, was forced out of the colony in October."),
    y("1799", "The War of Knives"),
    p("The last great rival to Toussaint's authority was André Rigaud, the general who controlled the south. Their conflict, known as the War of Knives, began in 1799 and was fought with great brutality. It ended in 1800 with Rigaud's defeat and exile, leaving Toussaint master of the whole colony as the new century began."),
  ],

  // ————————————————————————————————————————————————————————————— 1800s
  "1800s": [
    p("This was the decade Haiti was born. It began with Toussaint Louverture governing Saint-Domingue as a nominal French colony without slavery, and it ended with two rival Haitian states and the French gone for good. In between came Napoleon's attempt at reconquest, one of the deadliest colonial wars of the age, and the declaration of the first independent nation founded by formerly enslaved people."),
    y("1800", "Toussaint controls the colony"),
    p("Rigaud's defeat in the War of Knives left Toussaint unchallenged. To restore exports and pay his army, he kept former plantation workers bound to estates as paid laborers under strict military discipline, a system many of them resented as too close to the old one."),
    y("1801", "A constitution for a colony that ruled itself"),
    p("In January 1801 Toussaint's forces took over Spanish-speaking Santo Domingo, bringing the whole island under his authority and ending slavery there. In July he promulgated a constitution that abolished slavery forever and named him governor for life, while declaring Saint-Domingue part of the French empire. In Paris, Napoleon Bonaparte read it as defiance."),
    y("1802", "Napoleon's expedition"),
    p("In February 1802 a French fleet carrying tens of thousands of soldiers under General Charles Leclerc, Napoleon's brother-in-law, landed on the island. Cap-Français was burned rather than surrendered. In March, Jean-Jacques Dessalines held the fort of Crête-à-Pierrot against a far larger French force before breaking out, a defense that became legendary. Toussaint and his generals came to terms with Leclerc in the spring. In June Toussaint was lured to a meeting, arrested and deported to France."),
    img("Battle for Palm Tree Hill.jpg", "A nineteenth-century painting of a battle in tropical hills, soldiers in uniform fighting among palm trees.", "_Battle of San Domingo_, also known as _The Battle for Palm Tree Hill_, January Suchodolski's 1845 painting of the war, in which Polish legionnaires fought for France.", "January Suchodolski, 1845"),
    p("In May 1802 Napoleon decreed that slavery would continue in colonies where it had never been abolished, such as Martinique, and that summer French troops restored it by force in Guadeloupe. When news of this reached Saint-Domingue, Haitian officers who had joined the French, including Alexandre Pétion and Dessalines himself, turned against them in October. Yellow fever was devastating the French army; Leclerc died of it in November, and his successor, Donatien de Rochambeau, waged a campaign of terror."),
    y("1803", "Arcahaie, Vertières and the end of French rule"),
    p("At the Congress of Arcahaie in May 1803, the revolutionary generals recognized Dessalines as commander in chief, and tradition holds that he tore the white from the French tricolor to create the blue and red flag. In April, Toussaint had died in a cell at Fort de Joux in the Jura mountains. War between Britain and France resumed that month, and the Royal Navy blockaded the French ports. On 18 November the indigenous army defeated Rochambeau's forces at Vertières outside Cap-Français. The French agreed to evacuate and surrendered to the British fleet offshore."),
    y("1804", "Independence"),
    p("On 1 January 1804 at Gonaïves, Dessalines and his generals proclaimed the independence of Haiti, restoring the Taíno name of the island. The act declared that the country would never again fall under French rule. Haitians still mark the day by eating soup joumou, the pumpkin soup once reserved for the colonists."),
    img("Deklarasyon Endepandans Ayiti.jpg", "A page of the printed Haitian Declaration of Independence from 1804.", "The Act of Independence of 1 January 1804. A printed copy was found in Britain's National Archives in 2010.", "Government of Haiti, 1804"),
    p("Between February and April 1804, on Dessalines's orders, most of the French who remained in Haiti were killed; estimates run to several thousand. The massacre fixed the image of Haiti as a threat in the minds of slaveholding nations for generations. In the autumn Dessalines was crowned Emperor Jacques I."),
    y("1805", "The imperial constitution"),
    p("The constitution of May 1805 abolished slavery forever, barred white foreigners from owning property, and declared that all Haitians, whatever their color, would be known as black, a political definition of citizenship. Early in the year Dessalines invaded the Spanish-speaking east and besieged Santo Domingo, withdrawing when a French squadron appeared."),
    y("1806", "Assassination at Pont-Rouge"),
    p("Dessalines's land policies, including the review of property titles held by the old free elite, made him powerful enemies. On 17 October 1806 he was ambushed and killed at Pont-Rouge, just north of Port-au-Prince. A new constitution gave real power to the legislature; Henri Christophe, who had expected to rule, refused to accept it."),
    y("1807", "Two Haitis"),
    p("By early 1807 the country had split. Christophe governed the State of Haiti from Cap-Haïtien in the north; Pétion was elected president of the Republic of Haiti in Port-au-Prince in the south and west. Their war would drag on for years."),
    y("1808", "A divided island"),
    p("Civil war between north and south continued. In the east, Dominican colonists rose against the French garrison that had remained in Santo Domingo, with British naval support."),
    y("1809", "Santo Domingo returns to Spain"),
    p("The French surrendered Santo Domingo in 1809, and the east returned to Spanish rule. That same year, thousands of refugees from Saint-Domingue who had settled in Cuba were expelled by Spanish authorities and moved on to New Orleans, where they reshaped the city's culture."),
  ],

  // ————————————————————————————————————————————————————————————— 1820s
  "1820s": [
    p("The 1820s gave Haiti its widest borders and its heaviest burden. In three years President Jean-Pierre Boyer went from ruling the south to governing the entire island. Then, to end the threat of a French invasion and win recognition, he accepted a debt that would shape Haitian public finances for more than a century."),
    y("1820", "The end of the kingdom"),
    p("In August 1820 King Henry Christophe suffered a stroke. As his army and officials turned against him, he took his own life at the Sans-Souci palace on 8 October. Boyer, who had succeeded Pétion as president of the southern republic in 1818, marched north and reunited the country under a single government by the end of the month."),
    y("1821", "'Spanish Haiti' declares independence"),
    p("In the east, colonists led by José Núñez de Cáceres declared independence from Spain on 1 December 1821 as the Republic of Spanish Haiti and sought to join Simón Bolívar's Gran Colombia. Some in the east, especially in the borderlands, looked instead to Port-au-Prince."),
    y("1822", "One island under Haitian rule"),
    p("Boyer moved quickly. In February 1822 his army entered Santo Domingo without serious resistance, and he abolished slavery in the east. For the next 22 years Haiti governed all of Hispaniola. The unification brought freedom to the enslaved but also land confiscations and policies that alienated the Spanish-speaking elite and the Church."),
    y("1824", "Free Black Americans arrive, and talks with France fail"),
    p("Boyer invited free African Americans to settle in Haiti, offering passage and land. Beginning in 1824, several thousand sailed from Philadelphia, New York and Baltimore. Many returned to the United States, but communities such as the one at Samaná in the east endured. That year Haitian envoys also negotiated in Paris for recognition; the talks collapsed when France insisted on a form of sovereignty over its former colony."),
    y("1825", "Recognition at the price of a ransom"),
    p("On 17 April 1825 King Charles X issued an ordinance granting Haiti's independence on two conditions: halved customs duties for French ships, and 150 million francs to compensate former colonists, payable in five annual installments. In July a squadron of French warships under Baron de Mackau anchored off Port-au-Prince to deliver it. Facing the threat of war and decades of isolation, Boyer accepted."),
    img("Traité France Haïti 1825.jpg", "A page of an 1825 French document concerning Haiti's independence.", "The 1825 settlement between France and Haiti. The sum demanded far exceeded Haiti's annual revenue.", "Government of France, 1825"),
    p("To pay the first installment, Haiti borrowed 30 million francs from a Paris bank. After commissions and fees it received only around 24 million, while owing interest on the full amount. This was the start of what historians call the double debt: the indemnity itself, plus the loans taken to pay it."),
    y("1826", "The Code Rural"),
    p("To raise the exports needed to pay France, Boyer's government issued the Code Rural in 1826. It required most rural Haitians to work the land, restricted their movement and set penalties for idleness. Peasants largely ignored or resisted it, and the plantation economy it aimed to restore never returned."),
    y("1828", "Behind on the debt"),
    p("By the late 1820s Haiti had fallen behind on the installments. The burden would be renegotiated in 1838, reducing the remaining indemnity to 90 million francs but leaving decades of payments ahead."),
  ],

  // ————————————————————————————————————————————————————————————— 1910s
  "1910s": [
    p("In the 1910s Haiti's politics, finances and sovereignty came apart in quick succession. A string of short-lived presidencies, a national bank controlled from abroad and a world war that made Washington nervous about European influence in the Caribbean led to the United States invasion of 1915 and an occupation that would last nineteen years."),
    y("1910", "A national bank owned abroad"),
    p("The government reorganized the national bank as the Banque Nationale de la République d'Haïti, with capital from French, German and American investors, including National City Bank of New York. The bank held the government's deposits and managed its payments, giving foreign shareholders enormous leverage over the state."),
    y("1911", "The revolving door begins"),
    p("President Antoine Simon was driven out in August, and Cincinnatus Leconte took power. Over the next four years, armed bands known as cacos, often financed by merchants, repeatedly carried new contenders into the capital."),
    y("1912", "The palace explodes"),
    p("On 8 August 1912 the National Palace was destroyed by an explosion that killed President Leconte and hundreds of soldiers. Its cause was never established. Tancrède Auguste succeeded him."),
    y("1913", "Another succession"),
    p("Auguste died in office in May 1913. The legislature chose Michel Oreste, a lawyer, to replace him."),
    y("1914", "Gold leaves for New York"),
    p("Oreste was overthrown in January, Oreste Zamor in October, and Davilmar Théodore took power in November. As Washington pressed for control of Haitian customs, US Marines on 17 December carried about $500,000 in gold from the national bank's vault to a gunboat bound for New York, where it was deposited with National City Bank."),
    y("1915", "Invasion"),
    p("Vilbrun Guillaume Sam became president in March. In July, facing a revolt, his police chief had around 167 political prisoners executed. The next day a crowd dragged Sam from the French legation where he had taken refuge and killed him. On 28 July US Marines and sailors landed at Port-au-Prince."),
    img("US Marines and sailors from the USS Washington ashore for the capture of Port-au-Prince, Haiti, 1915.jpg", "Uniformed US Marines and sailors assembled on shore at Port-au-Prince in 1915.", "US Marines and sailors from the cruiser USS _Washington_ ashore at Port-au-Prince in 1915.", "United States Navy, 1915", "Public domain (US government work)"),
    p("The United States installed Philippe Sudre Dartiguenave as president and in September secured a treaty placing customs, finances and a new constabulary under American officials. In November Marines stormed Fort Rivière, a caco stronghold in the north, effectively ending the first phase of armed resistance."),
    y("1916", "Forced labor on the roads"),
    p("Occupation authorities revived the corvée, an old law requiring peasants to work on public roads. Conscripted laborers were roped together, beaten and marched far from home. The abuses turned much of the countryside against the occupation."),
    y("1917", "A legislature dissolved"),
    p("When Haiti's legislature refused to approve a new constitution drafted under US direction, President Dartiguenave dissolved it with the backing of the Marines' commanding officer, Smedley Butler."),
    y("1918", "A constitution by plebiscite, and a new revolt"),
    p("A constitution allowing foreigners to own land in Haiti, banned since independence, was approved in a June plebiscite held under occupation. In July Haiti declared war on Germany. Charlemagne Péralte, a former army officer sentenced to forced labor by an occupation court, escaped in September and in October launched a renewed caco war in the north and center."),
    y("1919", "The death of Péralte"),
    p("The uprising spread across the Central Plateau. On the night of 31 October to 1 November 1919, Marines disguised as Haitians infiltrated Péralte's camp and killed him. His death did not end the revolt, which continued under Benoît Batraville into 1920."),
  ],

  // ————————————————————————————————————————————————————————————— 1920s
  "1920s": [
    p("The 1920s were the high point of American control over Haiti and the decade in which Haitians found new ways to resist it. Armed revolt ended in 1920. In its place came protest in newspapers and at the League of Nations, a literary movement that redefined Haitian identity, and, at the decade's close, strikes and a massacre that made the occupation impossible to sustain."),
    y("1920", "Armed resistance ends; Haiti at the League of Nations"),
    p("Benoît Batraville, who had carried on Péralte's revolt, was killed in May 1920, and the caco war was over. Haiti, a signatory of the peace treaties ending the First World War, became a founding member of the League of Nations, where its delegate Dantès Bellegarde would speak against the occupation."),
    y("1921", "The US Senate investigates"),
    p("Reports of killings and abuses by Marines prompted a US Senate committee to investigate the occupations of Haiti and the Dominican Republic. Its hearings, held in Washington and in Haiti, documented abuses but recommended that the occupation continue."),
    y("1922", "Borno and Russell"),
    p("In 1922 Washington named General John H. Russell High Commissioner, the senior US official in Haiti. The same year an appointed Council of State, standing in for the dissolved legislature, chose Louis Borno as president. A new loan floated through New York bankers refinanced Haiti's older debts and extended US control of customs until it was repaid."),
    y("1923", "Schools for farm work"),
    p("Occupation officials expanded the Service Technique, a system of agricultural and vocational schools. Many Haitians saw it as an effort to replace the country's classical, French-style education with manual training, and it became a source of resentment."),
    y("1924", "An Olympic medal in Paris"),
    p("At the Paris Olympics, Haiti's rifle team won a bronze medal in the team event, the country's first Olympic medal."),
    img("Cathédrale-Port-au-Prince (before 1924).jpg", "An old photograph of the large Catholic cathedral in Port-au-Prince.", "The Cathedral of Port-au-Prince in the early twentieth century. The Catholic Church dominated official religious life while Vodou remained widely practiced and legally restricted.", "Unknown photographer, before 1924"),
    y("1925", "Coffee and railways"),
    p("Coffee grown by small peasant farmers remained Haiti's main export and the treasury's main source of revenue through export taxes. Short railway lines, mostly built with foreign concessions, linked parts of the plains around Port-au-Prince and Cap-Haïtien to the ports."),
    img("Haiti rail map 1925.jpg", "A map of Haiti from 1925 showing railway lines.", "Haiti's railways as mapped in 1925.", "Unknown cartographer, 1925"),
    y("1926", "Borno chosen again"),
    p("The Council of State re-elected Borno for a second term. With no elected legislature, the opposition worked through newspapers, many of whose editors were jailed for their criticism of the occupation."),
    y("1927", "La Revue indigène"),
    p("Young writers including Jacques Roumain, Normil Sylvain, Philippe Thoby-Marcelin, Émile Roumer and Carl Brouard founded _La Revue indigène_, calling for a literature rooted in Haitian life rather than French models. Their movement, indigénisme, would shape Haitian writing and politics for decades."),
    y("1928", "Ainsi parla l'oncle"),
    p("Jean Price-Mars published _Ainsi parla l'oncle_, a study of Haitian folklore and Vodou that urged the elite to stop imitating France and to recognize the African heritage of the Haitian people. In Amsterdam, Silvio Cator won Olympic silver in the long jump and soon after set a world record. The US-trained Gendarmerie was renamed the Garde d'Haïti."),
    y("1929", "Damien and Marchaterre"),
    p("On 31 October students at the agricultural school at Damien went on strike. Within weeks the protest spread to other schools, civil servants and customs workers. On 6 December Marines fired on a crowd of peasants at Marchaterre near Les Cayes, killing at least a dozen people. The killings drew international condemnation, and President Herbert Hoover appointed a commission to plan the end of the occupation."),
  ],
};
