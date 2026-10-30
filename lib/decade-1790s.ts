import type { EssayBlock, HistEvent, Person, Source } from "./types";

/**
 * The 1790s, built mainly from French-language sources and translated.
 * Titles of French works are kept in French with an English gloss in parentheses.
 * Where the sources disagree, or where a detail rests on one secondary account, the entry says so.
 */

// ——— Sources (French originals, English glosses)
const AN: Source = { title: "Assemblée nationale, « 1794 : la première abolition » (1794: the first abolition)", url: "https://www2.assemblee-nationale.fr/15/evenements/2021/abolition-de-l-esclavage-1794-et-1848/1794-la-premiere-abolition" };
const FME: Source = { title: "Fondation pour la mémoire de l'esclavage, dossier pédagogique sur le rétablissement de l'esclavage, 2021 (teaching dossier on the restoration of slavery)", url: "https://memoire-esclavage.org/sites/default/files/2021-10/Dos%20pedago%20retablissement%20esclavage%201802%20FME2021.pdf" };
const HERO: Source = { title: "Hérodote, « 23 août 1791 : insurrection à Saint-Domingue » (23 August 1791: insurrection in Saint-Domingue)", url: "https://www.herodote.net/23_aout_1791-evenement-17910823.php" };
const REVFR: Source = { title: "Wikipédia (français), « Révolution haïtienne » (Haitian Revolution), which cites Benot, Régent, Gainot, Pluchon, Fouchard, Madiou and Ardouin", url: "https://fr.wikipedia.org/wiki/R%C3%A9volution_ha%C3%AFtienne" };
const TLFR: Source = { title: "Wikipédia (français), « Toussaint Louverture » (Toussaint Louverture), which cites Gainot, Régent, Garrigus, Cauna and Pluchon", url: "https://fr.wikipedia.org/wiki/Toussaint_Louverture" };
const CABOT: Source = { title: "Andy Cabot, conférence « La Révolution haïtienne » (lecture slides on the Haitian Revolution), Académie de Nice, 2024", url: "https://www.pedagogie.ac-nice.fr/plplh/wp-content/uploads/sites/18/2025/09/CABOT-ANDY-Conference-Revolution-Haitienne-2024.pdf" };
const MADIOU: Source = { title: "Thomas Madiou, Histoire d'Haïti, tome 1 (1492–1799) (History of Haiti, vol. 1), Port-au-Prince, 1847–48" };
const ARDOUIN: Source = { title: "Beaubrun Ardouin, Études sur l'histoire d'Haïti, tomes 1–2 (Studies on the history of Haiti), Paris, 1853–60" };

type E = Omit<HistEvent, "status" | "sources"> & { status?: HistEvent["status"]; src: Source[] };
const ev = ({ src, status = "documented", ...e }: E): HistEvent => ({ ...e, status, sources: src });

// ——— Moments, filed under the 10 sections (politics, economy, society, culture, arts, education, sports, abroad, world, environment)
export const events1790s: HistEvent[] = [
  // 1790
  ev({ slug: "saint-domingue-1789-numbers", title: "The richest colony in the world: who lived in Saint-Domingue", date: "1790", precision: "year", dimension: "inside", categories: ["society", "economy"], location: "Saint-Domingue",
    summary: "On the eve of the revolution Saint-Domingue held about 450,000 enslaved people, 40,000 white colonists and 30,000 free people of color (libres de couleur), according to a French teaching dossier. It was the world's leading producer of sugar and, with half the world's supply, of coffee, and its trade made up over a third of metropolitan France's.",
    status: "disputed", context: "Contemporary and modern counts differ by tens of thousands, and free people of color are often counted at 30,000 to 40,000.", src: [FME, REVFR] }),
  ev({ slug: "cap-slave-arrivals-1790", title: "Nineteen thousand captives land at Cap-Français", date: "1790", precision: "year", dimension: "foreign", categories: ["economy", "society", "world"], location: "Cap-Français",
    summary: "A 2024 French lecture on the revolution reports that about 19,000 enslaved Africans were disembarked at Cap-Français in 1790 alone, the main port of the colony. The Atlantic trade was still feeding the plantations as the revolution began.",
    status: "disputed", src: [CABOT] }),
  ev({ slug: "decree-march-1790", title: "Paris keeps the colonies apart from the new rights", date: "1790-03-28", precision: "day", dimension: "foreign", categories: ["politics", "world"], countries: ["France"], location: "Paris",
    summary: "The Constituent Assembly's decree of 28 March 1790 gave the vote to free property-owning men, but white colonists refused to extend it to the métis and free Black men. French Wikipedia adds that the legislation excluded the colonies from metropolitan law and created colonial assemblies open to property owners.",
    related: ["oge-revolt"], src: [AN, REVFR] }),
  ev({ slug: "colonial-assembly-1790", title: "White colonists form a colonial assembly without free people of color", date: "1790", precision: "year", dimension: "inside", categories: ["politics"], location: "Saint-Marc and Port-au-Prince",
    summary: "The white colonial assembly declared itself superior to the governor general and voted a constitution. Colonel de Mauduit, who dispersed it, was later lynched by his own soldiers, according to French Wikipedia.",
    status: "documented", src: [REVFR] }),
  ev({ slug: "gravure-oge-1790", title: "An engraving of Vincent Ogé by Chrétien", date: "1790", precision: "year", dimension: "foreign", categories: ["arts", "abroad"], countries: ["France"], location: "Paris",
    summary: "Gilles-Louis Chrétien engraved a portrait of Ogé in Paris in 1790, an image of the free-colored advocate made in his lifetime, dated 1790 in a 2024 French lecture.",
    people: ["vincent-oge"], src: [CABOT] }),
  ev({ slug: "raimond-citoyens-couleur", title: "Free men of color organize in Paris", date: "1790", precision: "year", dimension: "abroad", categories: ["abroad", "politics"], countries: ["France"], location: "Paris",
    summary: "Julien Raimond, Vincent Ogé and others pressed the National Assembly through the Société des Citoyens de Couleur, supported by Brissot's Société des Amis des Noirs, to extend equal rights to free people of color.",
    people: ["julien-raimond", "vincent-oge"], related: ["decree-may-1791"], src: [CABOT, REVFR] }),

  // 1791
  ev({ slug: "oge-chavannes-executed", title: "Ogé and Chavannes are broken on the wheel", date: "1791-02-25", precision: "day", dimension: "inside", categories: ["politics", "society"], location: "Cap-Français",
    summary: "Vincent Ogé and Jean-Baptiste Chavannes, captured after the October 1790 revolt, were executed by the wheel (supplice de la roue) in Cap-Français. Their public deaths convinced many free people of color that only arms would win equality.",
    people: ["vincent-oge"], related: ["oge-revolt"], src: [AN, HERO] }),
  ev({ slug: "viefville-plan-1791", title: "The first plan to abolish slavery reaches the Assembly, and is never debated", date: "1791-05-11", precision: "day", dimension: "foreign", categories: ["politics", "world"], countries: ["France"], location: "Paris",
    summary: "On 11 May 1791 Jean-Louis de Viefville des Essarts presented a detailed abolition plan to the National Assembly. It was never discussed; the debates of 12 to 15 May dealt only with free people of color.",
    related: ["decree-may-1791"], src: [REVFR] }),
  ev({ slug: "west-south-free-revolt-1791", title: "Free people of color win battles in the West and South", date: "1791", precision: "year", dimension: "inside", categories: ["politics", "environment"], location: "Western and Southern provinces",
    summary: "Under Louis-Jacques Beauvais and André Rigaud, free men of color took the field. They captured Port-au-Prince, much of which burned that year. On 23 October the governor Fontanges signed the Concordat of Croix-des-Bouquets, granting them equal civic rights with colonists, but the colonists retaliated.",
    people: ["andre-rigaud"], src: [REVFR] }),
  ev({ slug: "croix-des-bouquets-concordat", title: "Concordat of Croix-des-Bouquets", date: "1791-10-23", precision: "day", dimension: "inside", categories: ["politics", "society"], location: "Croix-des-Bouquets",
    summary: "Governor Fontanges and the Légion des Chasseurs volontaires of free men of color agreed that they would have civic rights equal to colonists. White colonists answered with reprisals, and Jean-Baptiste Chavannes's earlier death sentence stood as a warning.",
    src: [REVFR] }),
  ev({ slug: "boukman-killed-1791", title: "Boukman dies in the repression", date: "1791", precision: "year", dimension: "inside", categories: ["politics", "culture"], location: "Northern Plain",
    summary: "Dutty Boukman was killed in fighting after the uprising began. The date is traditionally given as November 1791, though French Wikipedia leaves it blank. Leadership passed to Jean-François and Georges Biassou.",
    status: "disputed", people: ["dutty-boukman", "georges-biassou", "jean-francois-papillon"], related: ["bois-caiman"], src: [REVFR] }),
  ev({ slug: "insurgents-declare-king-religion", title: "The insurgents proclaim loyalty to the king and to religion", date: "1791", precision: "year", dimension: "inside", categories: ["politics", "culture"], location: "Northern Plain",
    summary: "French Wikipedia records that the insurgents, led by Boukman, Jean-François and Biassou, declared themselves loyal to the king and to religion. Paris read the revolt as a royalist uprising on the model of the Vendée, backed by Britain and Spain; Hérodote presents this as a contemporary perception, not a fact.",
    status: "interpretation", src: [REVFR, HERO] }),
  ev({ slug: "insurrection-plantations-burned", title: "Hundreds of plantations burn", date: "1791-08-23", precision: "day", dimension: "inside", categories: ["economy", "environment", "society"], location: "Plaine du Nord",
    summary: "Within days hundreds of sugar works (sucreries) and coffee plantations (caféières) were destroyed in the Plaine du Nord. French Wikipedia puts the number of whites killed in the first days at about 1,000 and the insurgents at about 50,000; no source gives an overall death toll.",
    status: "disputed", related: ["bois-caiman"], src: [HERO, REVFR, AN] }),
  ev({ slug: "nicolas-ponce-recueil-1791", title: "Ponce's views of the principal places of the colony", date: "1791", precision: "year", dimension: "foreign", categories: ["arts", "environment"], countries: ["France"], location: "Paris",
    summary: "Nicolas Ponce published the Recueil de vues des lieux principaux de la colonie française de Saint-Domingue (Collection of views of the principal places of the French colony of Saint-Domingue), engravings that fix the look of Cap-Français and its plantations just before the revolt.",
    src: [CABOT] }),
  ev({ slug: "toussaint-doctor-insurgent-camp", title: "Toussaint joins the insurgents as physician and adviser", date: "1791", precision: "year", dimension: "inside", categories: ["education", "politics"], location: "Biassou's camp, Northern Plain",
    summary: "According to French Wikipedia, Toussaint acted as a doctor among the insurgents and advised Georges Biassou. Historians disagree about his earlier role: Jacques de Cauna presents him as an organizer of the uprising, Pierre Pluchon as playing a double game to protect his property, a view many academic historians reject.",
    status: "interpretation", people: ["toussaint-louverture", "georges-biassou"], src: [TLFR] }),
  ev({ slug: "mauduit-lynched", title: "Colonel de Mauduit is lynched by his own soldiers", date: "1791-03", precision: "month", dimension: "inside", categories: ["politics"], location: "Port-au-Prince",
    summary: "Mauduit, who had dispersed the colonial assembly in 1790, was killed by his own mutinous soldiers, showing that the royal army in the colony had split along the lines of the Revolution in France.",
    status: "interpretation", src: [REVFR] }),

  // 1792
  ev({ slug: "biassou-vice-roy", title: "Biassou calls himself \"vice-roi\"", date: "1792", precision: "year", dimension: "inside", categories: ["politics", "culture"], location: "Camp at Grande-Rivière",
    summary: "On learning of the king's situation in France, Georges Biassou took the title of viceroy (vice-roi). The title shows how much the insurgent leaders still spoke the language of royal loyalty.",
    people: ["georges-biassou"], src: [REVFR] }),
  ev({ slug: "decree-april-1792-text", title: "« Les hommes de couleur et les nègres libres doivent jouir ... »", date: "1792-04-04", precision: "day", dimension: "foreign", categories: ["politics", "society", "world"], countries: ["France"], location: "Paris",
    summary: "The decree of 4 April 1792, quoted by the Fondation pour la mémoire de l'esclavage as: « Les hommes de couleur et les nègres libres doivent jouir ainsi que les colons blancs de l'égalité des droits politiques » (\"Men of colour and free Black people must enjoy political equality with white colonists\"). Brissot had led the Girondin campaign for it.",
    related: ["decree-april-1792"], src: [FME, REVFR, CABOT] }),
  ev({ slug: "three-commissioners-1792", title: "Sonthonax, Polverel and Ailhaud sail with 4,000 National Guards", date: "1792-09", precision: "month", dimension: "foreign", categories: ["politics", "world"], countries: ["France"], location: "Cap-Français",
    summary: "The civil commissioners arrived days before the proclamation of the French Republic. French Wikipedia records that Sonthonax at first said he would preserve slavery. Republican troops with the support of insurgents won the military contest, according to the Assemblée nationale.",
    people: ["leger-felicite-sonthonax", "etienne-polverel"], related: ["sonthonax-arrives"], src: [REVFR, AN] }),

  // 1793
  ev({ slug: "war-declared-1793", title: "France is at war with Britain and Spain", date: "1793-02-01", precision: "day", dimension: "foreign", categories: ["world", "politics"], countries: ["Great Britain", "Spain", "France"], location: "Paris",
    summary: "The declaration of war turned Saint-Domingue into a theatre of the European war. Planters sought British protection, and Spain, which held the east of the island, armed the insurgent leaders.",
    related: ["british-invasion-1793"], src: [REVFR, CABOT] }),
  ev({ slug: "whitehall-planters-1793", title: "Planters turn to Britain", date: "1793", precision: "year", dimension: "foreign", categories: ["world", "economy"], countries: ["Great Britain"], location: "London",
    summary: "French Wikipedia dates the agreement between Britain and Saint-Domingue's large planters, the Whitehall treaty, to April 1793. The planters hoped British rule would preserve slavery; Britain's own policy was to expand its plantation economy.",
    status: "disputed", src: [REVFR, CABOT] }),
  ev({ slug: "toussaint-spanish-service", title: "Toussaint is made lieutenant general in the Spanish army", date: "1793", precision: "year", dimension: "inside", categories: ["politics"], location: "Spanish-held border",
    summary: "In spring 1793 the Spanish offered sanctuary and freedom to insurgents who fought for them. Toussaint, commanding about 3,000 to 4,000 men, was made lieutenant général by Spain.",
    people: ["toussaint-louverture"], src: [TLFR] }),
  ev({ slug: "battle-cap-june-1793", title: "The Battle of Cap-Français", date: "1793-06-20", precision: "day", dimension: "inside", categories: ["politics", "environment", "abroad"], location: "Cap-Français",
    summary: "From 20 to 23 June, governor François-Thomas Galbaud sided with colonists against the commissioners. Insurgents invaded the city, pillaged and burned it, and about 10,000 colonists left. The commissioners promised freedom to enslaved people who fought for the Republic.",
    people: ["leger-felicite-sonthonax"], related: ["burning-cap-1793"], src: [CABOT, REVFR] }),
  ev({ slug: "belley-mills-dufay-elected", title: "Saint-Domingue elects three deputies for Paris", date: "1793", precision: "year", dimension: "abroad", categories: ["abroad", "politics"], countries: ["France"], location: "Saint-Domingue",
    summary: "Sonthonax organized elections. Jean-Baptiste Belley (a formerly enslaved Black man), Jean-Baptiste Mills (a free man of color) and Louis-Pierre Dufay (a white colonist) were sent to Paris to have abolition ratified. The Assemblée nationale calls them an \"association de trois couleurs\" (an association of three colors).",
    people: ["jean-baptiste-belley"], related: ["french-abolition-1794"], src: [AN, REVFR] }),
  ev({ slug: "polverel-extends-abolition", title: "Polverel extends abolition to the West and South", date: "1793-09", precision: "month", dimension: "inside", categories: ["politics", "society"], location: "Port-au-Prince and Les Cayes",
    summary: "About a month after Sonthonax's proclamation in the North, Étienne Polverel proclaimed the end of slavery in the rest of the colony.",
    people: ["etienne-polverel"], related: ["sonthonax-abolition"], src: [REVFR, AN] }),
  ev({ slug: "british-land-jeremie", title: "The British land at Jérémie", date: "1793-09-19", precision: "day", dimension: "foreign", categories: ["world", "politics"], countries: ["Great Britain"], location: "Jérémie",
    summary: "On 19 September about 500 men from the Jamaica garrison landed at Jérémie. On 4 October André Rigaud repelled the British at Tiburon.",
    people: ["andre-rigaud"], related: ["british-invasion-1793"], src: [REVFR] }),
  ev({ slug: "refugees-cap-1793", title: "Refugees leave Cap-Français by sea", date: "1793-06", precision: "month", dimension: "abroad", categories: ["abroad", "society"], location: "Cap-Français",
    summary: "About 10,000 colonists left the city after the fire. They were the first large wave of the Saint-Domingue exiles who settled in Cuba, Jamaica and the United States over the following years.",
    status: "documented", src: [REVFR] }),

  // 1794
  ev({ slug: "deputies-admitted-3-feb-1794", title: "The three deputies are admitted to the Convention", date: "1794-02-03", precision: "day", dimension: "foreign", categories: ["politics", "abroad"], countries: ["France"], location: "Paris",
    summary: "On 15 pluviôse an II (3 February) Belley, Mills and Dufay were admitted to sit after being held on colonists' accusations of collusion with the Girondins.",
    people: ["jean-baptiste-belley"], related: ["french-abolition-1794"], src: [AN, FME] }),
  ev({ slug: "decree-16-pluviose-text", title: "« L'esclavage des nègres dans toutes les colonies est aboli »", date: "1794-02-04", precision: "day", dimension: "foreign", categories: ["politics", "society", "world"], countries: ["France"], location: "Paris",
    summary: "On 16 pluviôse an II the Convention voted abolition by acclamation: « La Convention nationale déclare que l'esclavage des nègres dans toutes les colonies est aboli » (\"The National Convention declares that the enslavement of Black people in all colonies is abolished\"). Dufay described the oppression, and Danton answered, to applause, by calling for « la liberté universelle » (universal liberty).",
    related: ["french-abolition-1794"], src: [AN, FME] }),
  ev({ slug: "toussaint-joins-france-dispute", title: "Why did Toussaint change sides?", date: "1794", precision: "year", dimension: "inside", categories: ["politics"], location: "Northern Province",
    summary: "The French sources give no exact day for the move. Older historians explained it by the decree of 4 February; John Garrigus argues the decree had not yet reached the island; Bernard Gainot and Frédéric Régent stress that Governor Laveaux armed cultivators and that Toussaint had fallen out with Jean-François and Biassou.",
    status: "interpretation", people: ["toussaint-louverture"], related: ["toussaint-joins-france"], src: [TLFR] }),
  ev({ slug: "british-take-port-au-prince", title: "The British take Port-au-Prince", date: "1794-06-01", precision: "day", dimension: "foreign", categories: ["world", "politics"], countries: ["Great Britain"], location: "Port-au-Prince",
    summary: "British forces captured the capital of the West from the forces of André Rigaud, widening the occupation that began at Jérémie.",
    people: ["andre-rigaud"], related: ["british-invasion-1793"], src: [REVFR] }),
  ev({ slug: "gregoire-patois-report", title: "Grégoire's report on the patois", date: "1794-06-04", precision: "day", dimension: "foreign", categories: ["education", "culture", "world"], countries: ["France"], location: "Paris",
    summary: "On 16 prairial an II the abbé Grégoire gave his report on the need to eliminate patois and universalize the French language. It concerned the regional languages of France; whether and how it reached the Creole of the colonies is not documented here.",
    status: "interpretation", src: [REVFR] }),
  ev({ slug: "yellow-fever-british", title: "Disease devastates the British expedition", date: "1794", precision: "year", dimension: "foreign", categories: ["education", "world"], countries: ["Great Britain"], location: "Port-au-Prince and Jérémie",
    summary: "Fever, above all yellow fever, killed far more British soldiers than combat did over the five years of occupation. Estimates of the total loss vary widely and are not given in the French sources consulted.",
    status: "disputed", src: [{ title: "British occupation of Saint-Domingue", url: "https://en.wikipedia.org/wiki/British_occupation_of_Saint-Domingue" }] }),

  // 1795
  ev({ slug: "constitution-an-iii", title: "The Constitution of Year III makes the colonies parts of the Republic", date: "1795-08-22", precision: "day", dimension: "foreign", categories: ["politics", "world"], countries: ["France"], location: "Paris",
    summary: "The Constitution of 5 fructidor an III declared the colonies « parties intégrantes de la République » (integral parts of the Republic), turning Saint-Domingue into departments of France.",
    src: [FME, REVFR] }),
  ev({ slug: "july-1795-promotions", title: "Laveaux and Toussaint are promoted", date: "1795-07-13", precision: "day", dimension: "inside", categories: ["politics"], location: "Saint-Domingue",
    summary: "The Committee of Public Safety named Étienne Laveaux general of division and provisional governor. Jean-Louis Villatte, André Rigaud, Louis-Jacques Beauvais and Toussaint Louverture became brigadier generals.",
    people: ["toussaint-louverture", "etienne-laveaux", "andre-rigaud"], src: [REVFR, TLFR] }),
  ev({ slug: "rigaud-retakes-tiburon", title: "Rigaud retakes Tiburon", date: "1795-12-09", precision: "day", dimension: "inside", categories: ["politics"], location: "Tiburon",
    summary: "André Rigaud retook the fort of Tiburon from the British, consolidating the Republic's hold on the southern peninsula.",
    people: ["andre-rigaud"], src: [REVFR] }),
  ev({ slug: "toussaint-liberates-interior", title: "Toussaint dominates the north after Spain's exit", date: "1795", precision: "year", dimension: "inside", categories: ["politics", "environment"], location: "Interior of the North",
    summary: "After Spain made peace, Toussaint controlled the northern province except Cap-Français, which General Villatte held. Lamour Dérance and others still resisted in the hills in late 1795.",
    people: ["toussaint-louverture"], related: ["treaty-of-basel"], src: [REVFR, TLFR] }),

  // 1796
  ev({ slug: "villatte-arrests-laveaux", title: "Villatte arrests Governor Laveaux; Toussaint frees him", date: "1796-03-20", precision: "day", dimension: "inside", categories: ["politics"], location: "Cap-Français",
    summary: "General Jean-Louis Villatte arrested Governor Laveaux in Cap-Français on 20 March. Toussaint defeated him, and as a reward became général de division and lieutenant-gouverneur, second only to Laveaux.",
    people: ["toussaint-louverture", "etienne-laveaux"], related: ["laveaux-rescued"], src: [REVFR, TLFR] }),
  ev({ slug: "rochambeau-arrested-1796", title: "The commissioners arrest General Rochambeau", date: "1796-07-21", precision: "day", dimension: "inside", categories: ["politics"], location: "Saint-Domingue",
    summary: "The commissioners arrested General Donatien de Rochambeau, who would return in 1802 as the last French captain-general of the colony.",
    status: "documented", src: [REVFR] }),
  ev({ slug: "sonthonax-constitution-project", title: "Sonthonax publishes a constitution project", date: "1796-08-06", precision: "day", dimension: "inside", categories: ["politics"], location: "Cap-Français",
    summary: "Sonthonax published a project calling for a single electoral assembly. Six deputies for the colony were elected on 24 September.",
    people: ["leger-felicite-sonthonax"], src: [REVFR] }),
  ev({ slug: "les-cayes-saint-louis-incidents", title: "Violence at Les Cayes and Saint-Louis", date: "1796-09", precision: "month", dimension: "inside", categories: ["society", "politics"], location: "Les Cayes and Saint-Louis",
    summary: "Incidents in the south left more than 200 victims. The events were reported unfavourably to the Directory in Paris.",
    status: "disputed", src: [REVFR] }),
  ev({ slug: "amis-des-noirs-et-colonies-1796", title: "The Société des Amis des Noirs et des Colonies is founded", date: "1796", precision: "year", dimension: "foreign", categories: ["abroad", "world"], countries: ["France"], location: "Paris",
    summary: "Lanthenas, Grégoire, Frossard, Servan, Garran-Coulon and Jean-Baptiste Say founded a successor to Brissot's anti-slavery society to defend the new colonial order.",
    src: [REVFR] }),

  // 1797
  ev({ slug: "five-departments-1797", title: "The colony is divided into five departments", date: "1797-02", precision: "month", dimension: "foreign", categories: ["politics", "environment"], countries: ["France"], location: "Paris",
    summary: "On a report by Louis-Pierre Dufay, the Council of Five Hundred divided Saint-Domingue into five departments, putting the new administrative geography into law.",
    src: [REVFR] }),
  ev({ slug: "rigaud-refuses-1797", title: "Rigaud refuses to leave his post", date: "1797-01-15", precision: "day", dimension: "inside", categories: ["politics"], location: "Les Cayes",
    summary: "Rigaud kept command in the South, the first sign of the rivalry with Toussaint that became the War of the South.",
    people: ["andre-rigaud", "toussaint-louverture"], related: ["war-of-knives"], src: [REVFR] }),
  ev({ slug: "girodet-belley-1797", title: "Girodet paints Jean-Baptiste Belley", date: "1797", precision: "year", dimension: "foreign", categories: ["arts", "abroad"], countries: ["France"], location: "Paris",
    summary: "Anne-Louis Girodet painted the deputy Jean-Baptiste Belley in Paris. The painting is dated 1797 in a 2024 French lecture on the revolution.",
    people: ["jean-baptiste-belley"], src: [CABOT] }),
  ev({ slug: "simcoe-landing-1797", title: "General Simcoe lands at Port-au-Prince", date: "1797-03", precision: "month", dimension: "foreign", categories: ["world", "politics"], countries: ["Great Britain"], location: "Port-au-Prince",
    summary: "British General John Graves Simcoe landed in March; he was replaced by John Whyte in August. In April Rigaud failed to retake the British fort at Les Irois.",
    related: ["british-invasion-1793"], src: [REVFR] }),
  ev({ slug: "christophe-vallieres-1797", title: "Christophe disarms the former troops of Jean-François at Vallières", date: "1797-07", precision: "month", dimension: "inside", categories: ["politics"], location: "Vallières",
    summary: "Henri Christophe neutralized the forces that had followed Jean-François, one of Toussaint's steps toward unifying the army.",
    people: ["henri-christophe"], src: [REVFR] }),
  ev({ slug: "sonthonax-departs-1797", title: "Toussaint urges Sonthonax to return to France", date: "1797-08", precision: "month", dimension: "inside", categories: ["politics"], location: "Cap-Français",
    summary: "After Sonthonax promoted Toussaint on 3 May, Toussaint pressed him through the summer to go back to France, and Sonthonax left. Toussaint's jealousy of his authority pushed him toward personal rule, according to French Wikipedia.",
    people: ["toussaint-louverture", "leger-felicite-sonthonax"], related: ["toussaint-commander"], src: [REVFR, TLFR] }),

  // 1798
  ev({ slug: "law-12-nivose-an-vi", title: "France bars new deportations of enslaved people to the colonies", date: "1798-01-01", precision: "day", dimension: "foreign", categories: ["politics", "society", "world"], countries: ["France"], location: "Paris",
    summary: "The law of 12 nivôse an VI made every Black man on French soil a citizen and ended new deportations of enslaved people to the colonies.",
    src: [FME] }),
  ev({ slug: "british-armistice-march-1798", title: "Britain signs an armistice with Toussaint", date: "1798-03-30", precision: "day", dimension: "foreign", categories: ["world", "politics"], countries: ["Great Britain"], location: "Western Province",
    summary: "The armistice led to the British withdrawal from the colony.",
    people: ["toussaint-louverture"], related: ["british-withdraw-1798"], src: [REVFR] }),
  ev({ slug: "hedouville-arrives", title: "Hédouville arrives as France's agent", date: "1798", precision: "year", dimension: "foreign", categories: ["politics", "world"], countries: ["France"], location: "Cap-Français",
    summary: "General Gabriel de Hédouville, sent by the Directory, proposed that Toussaint return to France. Furious at Toussaint's separate deal with the British, he released Rigaud from obedience to Toussaint before leaving.",
    people: ["gabriel-hedouville", "toussaint-louverture"], src: [REVFR, TLFR] }),
  ev({ slug: "maitland-convention", title: "The Maitland–Toussaint Convention", date: "1798-08-31", precision: "day", dimension: "foreign", categories: ["world", "economy", "politics"], countries: ["Great Britain"], location: "Port-au-Prince",
    summary: "Toussaint negotiated the British evacuation of the West, opening the colony's ports to British merchant ships while France and Britain were at war.",
    people: ["toussaint-louverture"], related: ["british-withdraw-1798"], src: [CABOT, TLFR] }),
  ev({ slug: "us-trade-resumes-1798", title: "The United States signals it will resume trade", date: "1798", precision: "year", dimension: "foreign", categories: ["economy", "world"], countries: ["United States"], location: "Philadelphia",
    summary: "Secretary of State Timothy Pickering confirmed that the United States would resume trade if Toussaint prevailed, opening a commercial channel for the colony outside France.",
    src: [REVFR] }),
  ev({ slug: "hedouville-expelled", title: "A popular revolt drives Hédouville out", date: "1798-10", precision: "month", dimension: "inside", categories: ["politics"], location: "Cap-Français and Fort-Liberté",
    summary: "French sources describe a popular revolt (soulèvement populaire) that forced Hédouville to leave the colony. French Wikipedia leaves the date blank; the traditional date is October 1798. The source says Toussaint organized the revolt; this attribution is contested.",
    status: "disputed", people: ["gabriel-hedouville", "toussaint-louverture"], src: [REVFR, TLFR] }),

  // 1799
  ev({ slug: "rigaud-refuses-1799", title: "Rigaud rejects Toussaint's authority", date: "1799-01", precision: "month", dimension: "inside", categories: ["politics"], location: "Les Cayes",
    summary: "Commissioner Philippe-Rose Roume wrote to Rigaud on 17 and 22 January 1799. Rigaud refused to recognize Toussaint, and on 25 February Roume moved the French agency to Le Cap.",
    people: ["andre-rigaud", "philippe-rose-roume"], related: ["war-of-knives"], src: [REVFR] }),
  ev({ slug: "tripartite-convention-1799", title: "Britain, the United States and the colony sign a trade convention", date: "1799-06-13", precision: "day", dimension: "foreign", categories: ["economy", "world"], countries: ["Great Britain", "United States"], location: "Saint-Domingue",
    summary: "The tripartite convention brought British and American shipping into the colony's trade. On 27 April Roume had praised Toussaint's supply agreement with the United States.",
    people: ["toussaint-louverture"], src: [REVFR] }),
  ev({ slug: "petit-goave-june-1799", title: "Petit-Goâve and the start of the War of the South", date: "1799-06-17", precision: "day", dimension: "inside", categories: ["politics", "society"], location: "Petit-Goâve",
    summary: "On 17 June Jean-Pierre Delva handed Petit-Goâve to Rigaud's lieutenants, Faubert and Renaud-Desruisseaux, and a massacre of whites followed. French Wikipedia marks this as the opening of the guerre du Sud.",
    people: ["andre-rigaud"], related: ["war-of-knives"], src: [REVFR] }),
  ev({ slug: "war-south-interpretations", title: "Race war or power struggle? The War of the South", date: "1799", precision: "year", dimension: "inside", categories: ["politics", "society"], location: "Southern Province",
    summary: "Contemporaries framed the conflict as Blacks against mulattoes (a conflict of « castes »). French Wikipedia's article on Toussaint argues it was mainly a struggle for power and territory, with 5,000 to 10,000 dead, most of them disarmed soldiers; Bernard Gainot calls it a « guerre d'extermination » (war of extermination).",
    status: "interpretation", people: ["andre-rigaud", "toussaint-louverture"], related: ["war-of-knives"], src: [TLFR, REVFR] }),
  ev({ slug: "roume-confirms-commands", title: "Roume confirms Dessalines and Moyse in their commands", date: "1799-10", precision: "month", dimension: "inside", categories: ["politics"], location: "Le Cap",
    summary: "Commissioner Roume confirmed Jean-Jacques Dessalines as commander of the Western army and Moyse Louverture as commander of the Northern army.",
    people: ["jean-jacques-dessalines"], src: [REVFR] }),
  ev({ slug: "brumaire-1799", title: "Bonaparte seizes power", date: "1799-11-09", precision: "day", dimension: "foreign", categories: ["world", "politics"], countries: ["France"], location: "Paris",
    summary: "The coup of 18 brumaire ended the Directory. French Wikipedia says Bonaparte opposed continuing the war against Rigaud and considered using Haitian armies to conquer Jamaica. The Constitution of Year VIII (December) stated that the colonies would be governed by special laws, the opening for what followed in 1802.",
    src: [REVFR, FME] }),
  ev({ slug: "sports-none-1790s", title: "No sports record has been found for the 1790s", date: "1799", precision: "year", dimension: "inside", categories: ["sports"], location: "Saint-Domingue",
    summary: "None of the French-language sources consulted document organized sport in the colony during the decade. The decade's recorded achievements are military and political: the campaigns of Toussaint's army, Rigaud's defence of the South and Christophe's operations. Fivonine leaves the gap open rather than invent entries; contributions with sources are welcome.",
    status: "interpretation", src: [REVFR] }),
];

// ——— People of the decade
export const people1790s: Person[] = [
  { slug: "cecile-fatiman", name: "Cécile Fatiman", roles: ["Vodou priestess (mambo)"], bio: "French Wikipedia names her as present at the Bois-Caïman ceremony with Dutty Boukman. Details of her life rest on tradition and later accounts, which makes this entry open to correction." },
  { slug: "georges-biassou", name: "Georges Biassou", roles: ["Insurgent leader"], bio: "One of the leaders of the 1791 uprising alongside Boukman and Jean-François. Toussaint served under him as physician and adviser; he took the title « vice-roi » (viceroy) in 1792." },
  { slug: "jean-francois-papillon", name: "Jean-François Papillon", roles: ["Insurgent leader"], bio: "Insurgent general of 1791 who allied with Spain in 1793. Toussaint fell out with him and Biassou before joining the French." },
  { slug: "andre-rigaud", name: "André Rigaud", born: "1761", died: "1811", roles: ["General", "Governor of the South"], bio: "A free man of color who led the South against the British (Tiburon, 1793 and 1795). His rivalry with Toussaint led to the War of the South in 1799." },
  { slug: "leger-felicite-sonthonax", name: "Léger-Félicité Sonthonax", born: "1763", died: "1813", roles: ["French civil commissioner"], bio: "Arrived in 1792, proclaimed the abolition of slavery in the North on 29 August 1793, and was elected deputy before leaving in 1797 under pressure from Toussaint." },
  { slug: "etienne-polverel", name: "Étienne Polverel", roles: ["French civil commissioner"], bio: "Commissioner with Sonthonax who extended abolition to the West and South in September 1793." },
  { slug: "jean-baptiste-belley", name: "Jean-Baptiste Belley", roles: ["Deputy", "Soldier"], bio: "A formerly enslaved man elected in 1793 to represent Saint-Domingue in Paris. He was admitted to the Convention on 3 February 1794, the day before abolition, and painted by Girodet in 1797." },
  { slug: "julien-raimond", name: "Julien Raimond", born: "1744", died: "1801", roles: ["Free man of color", "Advocate of equal rights"], bio: "A planter of color who lobbied in Paris through the Société des Citoyens de Couleur for the rights of free people of color." },
  { slug: "etienne-laveaux", name: "Étienne Laveaux", roles: ["French governor"], bio: "General and governor who armed cultivators and, after 1794, relied on Toussaint's army. He was freed by Toussaint after Villatte's arrest in 1796." },
  { slug: "gabriel-hedouville", name: "Gabriel de Hédouville", roles: ["French agent"], bio: "Sent by the Directory in 1798, he challenged Toussaint's autonomy and was forced to leave the colony after a popular revolt." },
  { slug: "philippe-rose-roume", name: "Philippe-Rose Roume", roles: ["French commissioner"], bio: "Succeeded Hédouville as the Directory's agent; in 1799 he moved the agency to Le Cap and confirmed Dessalines and Moyse in their commands." },
  { slug: "jean-louis-villatte", name: "Jean-Louis Villatte", roles: ["General"], bio: "Held Cap-Français in 1795 and arrested Governor Laveaux in March 1796, an attempt Toussaint defeated." },
];

// ——— The year-by-year essay (French originals kept alongside translations)
const p = (text: string): EssayBlock => ({ type: "p", text });
const yr = (year: string, title: string): EssayBlock => ({ type: "year", year, title });
const note = (label: string, text: string): EssayBlock => ({ type: "note", label, text });
const quote = (label: string, fr: string, en: string, ref: string): EssayBlock => ({ type: "note", label, text: `« ${fr} » (“${en}”) — ${ref}` });

export const intro1790s: EssayBlock[] = [
  p("At the start of the decade, Saint-Domingue was the richest colony in the world and one of the most violent. A French teaching dossier counts about 450,000 enslaved people, 40,000 white colonists and 30,000 free people of color, and notes that the colony was the world's leading producer of sugar. By the decade's end slavery had been abolished, the colony was run by a formerly enslaved general, and three European empires had sent armies and withdrawn or lost."),
];

export const essay1790s: EssayBlock[] = [
  ...intro1790s,
  yr("1790", "The Revolution in Paris splits the colony"),
  p("News of the French Revolution and the Declaration of the Rights of Man (26 August 1789) alarmed the colonists, who feared the principle « les hommes naissent et demeurent libres et égaux en droits » (“men are born and remain free and equal in rights”) would not stop at the metropole. White planters wanted self-government; the Club de l'hôtel de Massiac in Paris lobbied to keep the colonies out of the new law. The Constituent Assembly's decree of 28 March 1790 gave the vote to free property-owning men aged 25, but colonists refused to apply it to the métis and free Black men."),
  p("In Paris, Julien Raimond, Vincent Ogé and others pressed the case of the free people of color through the Société des Citoyens de Couleur, with the support of Brissot's Société des Amis des Noirs. In the colony, a white assembly declared itself superior to the governor-general and voted a constitution. In October, Ogé returned and led about 300 men in an armed revolt. It was crushed, and both he and Jean-Baptiste Chavannes were condemned to the wheel."),
  p("The year left images as well as events: Gilles-Louis Chrétien's engraving of Ogé, and, according to a 2024 French lecture, about 19,000 captives landed at Cap-Français, a reminder that the Atlantic trade was still running."),
  yr("1791", "The uprising in the Plaine du Nord"),
  p("Ogé and Chavannes were executed by the wheel (« supplice de la roue ») on 25 February. In Paris, the abolition plan of Jean-Louis de Viefville des Essarts (11 May) was never debated; on 15 May the Assembly granted political rights only to some free men of color born of free parents, a concession the colonists would not honor. In summer, free people of color rose in the West and South under Louis-Jacques Beauvais and André Rigaud and took Port-au-Prince, much of which burned."),
  p("On the night of 22–23 August, enslaved people across the Plaine du Nord rose. Tradition places a Vodou ceremony at Bois-Caïman on 14 August, led by Dutty Boukman with Cécile Fatiman; Hérodote repeats it as established, but it appears in sources written decades later (Dalmas 1814, Hérard-Dumesle 1824, Madiou 1847), and the date is contested. Within days, hundreds of sugar works (sucreries) and coffee plantations (caféières) were burning; French Wikipedia puts the first white deaths at about 1,000 and the insurgents at about 50,000. The insurgent leaders, Boukman, Jean-François and Georges Biassou, declared loyalty to the king and to religion. Boukman was killed in the repression."),
  p("On 23 October, Governor Fontanges signed the Concordat of Croix-des-Bouquets with the Légion des Chasseurs volontaires, granting free people of color equal civic rights; colonists retaliated. Toussaint, a freed man in his late forties, joined Biassou's camp as physician and adviser."),
  quote("Primary source", "les hommes naissent et demeurent libres et égaux en droits", "men are born and remain free and equal in rights", "Déclaration des droits de l'homme et du citoyen, art. 1, 26 août 1789, as quoted by the Assemblée nationale"),
  yr("1792", "Equal rights for free people of color, and commissioners from France"),
  p("On 4 April 1792 the Legislative Assembly granted equal political rights to all free people of color. The Fondation pour la mémoire de l'esclavage quotes the decree: « Les hommes de couleur et les nègres libres doivent jouir ainsi que les colons blancs de l'égalité des droits politiques » (“Men of colour and free Black people must enjoy political equality with white colonists”). The Girondins, with Brissot, wanted to unite free people against the insurgents; colonists were reluctant to apply it."),
  p("In September, three commissioners, Léger-Félicité Sonthonax, Étienne Polverel and Ailhaud, arrived at Le Cap with about 4,000 National Guard volunteers, days before the proclamation of the Republic. Sonthonax at first said he would preserve slavery. Biassou took the title of « vice-roi »."),
  yr("1793", "War, fire and abolition"),
  p("On 1 February France went to war with Britain and Spain. Planters turned to Britain, whose treaty with them French Wikipedia dates to April; Spain, which held the east, armed the insurgent leaders, and Toussaint, commanding 3,000 to 4,000 men, was made lieutenant général in the Spanish army."),
  p("From 20 to 23 June governor Galbaud sided with the colonists against the commissioners. Insurgents invaded Cap-Français, pillaged and burned it, and about 10,000 colonists left. The commissioners promised freedom to enslaved people who fought for the Republic. On 29 August, Sonthonax proclaimed abolition in the North, and a month later Polverel did the same in the West and South. Three deputies were elected and sent to Paris to get it ratified."),
  p("On 19 September, 500 men from Jamaica landed at Jérémie; on 4 October, Rigaud repulsed the British at Tiburon."),
  yr("1794", "Paris abolishes slavery"),
  p("On 15 pluviôse an II (3 February) the three deputies, Jean-Baptiste Belley, Louis-Pierre Dufay and Jean-Baptiste Mills, were admitted to the Convention. On 16 pluviôse (4 February) it voted abolition by acclamation: « La Convention nationale déclare que l'esclavage des nègres dans toutes les colonies est aboli » (“The National Convention declares that the enslavement of Black people in all colonies is abolished”). Danton, to applause, spoke of « la liberté universelle »."),
  p("That spring Toussaint rallied to the Republic on Governor Laveaux's offer. The motive is disputed: older historians cited the decree, John Garrigus argues it had not yet arrived, and Bernard Gainot and Frédéric Régent point to Laveaux's arming of cultivators and Toussaint's break with Jean-François and Biassou. On 1 June the British took Port-au-Prince from Rigaud. On 4 June abbé Grégoire gave his report on eliminating the patois of France."),
  yr("1795", "Spain withdraws; the colonies become departments"),
  p("France and Spain made peace at Basel in July, and Spain gave up the eastern part of the island on paper. On 13 July the Committee of Public Safety named Laveaux general of division and provisional governor; Villatte, Rigaud, Beauvais and Toussaint became brigadier generals. The Constitution of 5 fructidor an III made the colonies « parties intégrantes de la République » (integral parts of the Republic). Rigaud retook Tiburon on 9 December."),
  yr("1796", "Toussaint becomes lieutenant governor"),
  p("On 20 March General Villatte arrested Governor Laveaux at Cap-Français. Toussaint defeated him and was rewarded as général de division and lieutenant-gouverneur. On 21 July the commissioners arrested General Rochambeau; on 6 August Sonthonax published a constitution project for a single electoral assembly; in September incidents at Les Cayes and Saint-Louis left more than 200 dead; on 24 September six deputies were elected. In Paris the Société des Amis des Noirs et des Colonies was founded."),
  yr("1797", "The commander in chief"),
  p("On 15 January Rigaud refused to leave his post. In February the Council of Five Hundred divided the colony into five departments. In March General Simcoe landed at Port-au-Prince; in April Rigaud failed to retake the British fort at Les Irois. Sonthonax promoted Toussaint on 3 May and Toussaint became commander in chief; in July Henri Christophe neutralized the former troops of Jean-François at Vallières. By August Toussaint had pressed Sonthonax to return to France. Girodet painted Belley in Paris."),
  yr("1798", "The British leave; Hédouville is driven out"),
  p("On 12 nivôse an VI (1 January) a French law made every Black man on French soil a citizen and ended new deportations of enslaved people. On 30 March Britain signed an armistice with Toussaint. General Gabriel de Hédouville arrived and proposed that Toussaint return to France. On 31 August the Maitland–Toussaint Convention opened the colony's ports to British merchant ships while securing the evacuation of the West. A popular revolt drove Hédouville out in the autumn, and before leaving he released Rigaud from obedience to Toussaint. Mid-year, US Secretary of State Timothy Pickering confirmed that the United States would resume trade if Toussaint prevailed."),
  yr("1799", "The War of the South"),
  p("In January Rigaud refused to recognize Toussaint. Commissioner Roume wrote to him on 17 and 22 January and moved the agency to Le Cap on 25 February. On 13 June the tripartite trade convention was signed with Britain and the United States. On 17 June Petit-Goâve was handed to Rigaud's lieutenants and a massacre of whites followed, opening the guerre du Sud. In October, Roume confirmed Dessalines in command in the West and Moyse Louverture in the North. In Paris, Bonaparte took power on 18 brumaire. The war's toll is estimated at 5,000 to 10,000 dead, most of them disarmed soldiers; whether it was a race war or a power struggle is still argued. Jacmel fell to Toussaint after a three-month siege in 1800, outside this decade."),
  { type: "sub", title: "French-language bibliography for the 1790s" },
  { type: "biblio", items: [
    "Thomas Madiou, Histoire d'Haïti, tome 1 (1492–1799) (History of Haiti), Port-au-Prince, 1847–48.",
    "Beaubrun Ardouin, Études sur l'histoire d'Haïti (Studies on the history of Haiti), Paris, 1853–60.",
    "Victor Schœlcher, Vie de Toussaint Louverture (Life of Toussaint Louverture), Paris, 1889.",
    "Yves Benot, La Révolution française et la fin des colonies (The French Revolution and the end of the colonies), Paris, 1987.",
    "Pierre Pluchon, Toussaint Louverture : un révolutionnaire noir d'Ancien Régime (Toussaint Louverture: a Black revolutionary of the old regime), Paris, 1989.",
    "Jean Fouchard, Les Marrons de la liberté (The maroons of liberty), Paris, 1972.",
  ] },
];

// ——— A short note for each of the 10 sections, shown when a reader filters the decade
export const notes1790s: Partial<Record<string, string>> = {
  politics: "Three powers contested Saint-Domingue: white colonists, free people of color and the insurgents. Paris answered with the rights decrees of 1791 and 1792 and the abolition of 1793–94, and the decade ended with Toussaint ruling the colony and a civil war against Rigaud in the South.",
  economy: "The world's leading sugar and coffee colony saw hundreds of plantations burn in 1791. Under Toussaint trade turned away from France, to British and American shipping, through the Maitland convention of 1798 and the tripartite convention of 1799.",
  society: "About 450,000 enslaved people, 40,000 whites and 30,000 free people of color made up the colony in 1789. Free men of color fought for rights in 1790 and 1791, and the enslaved won freedom by arms in 1793.",
  culture: "The Bois-Caïman ceremony is remembered as a Vodou gathering led by Boukman with Cécile Fatiman. Its historicity and date are debated, and the sources are later accounts.",
  arts: "The decade's images are largely made in France: Ponce's views of the colony (1791), Chrétien's engraving of Ogé (1790) and Girodet's portrait of Belley (1797).",
  education: "Toussaint acted as a physician in the insurgent camp, and disease did more than combat to destroy the British occupation. Grégoire's report on the patois (1794) shaped French language policy.",
  sports: "No organized sport is documented in the French sources consulted for the 1790s. Contributions with sources are welcome.",
  abroad: "Raimond and Ogé lobbied in Paris, Belley, Mills and Dufay sat in the Convention, and about 10,000 colonists left Cap-Français in 1793. The revolution's news reached other slave societies.",
  world: "France declared war on Britain and Spain in 1793, Britain occupied parts of the colony until 1798, Spain left in 1795, and Bonaparte took power in 1799.",
  environment: "The Plaine du Nord burned in 1791, Cap-Français in 1793 and Port-au-Prince in 1791. No hurricane or earthquake is documented in the French sources consulted for this decade.",
  next: "Toussaint's rule of the whole island, his constitution of 1801 and Bonaparte's decision to send an army to Saint-Domingue led directly to the war of the 1800s and to independence in 1804.",
};
