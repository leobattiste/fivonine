import type { HistEvent } from "./types";
/** Source-led archival entries. Titles and dates checked against ANRHA's French D/XXV/9 inventory.
 * Full-text conclusions are deliberately not inferred from inventory descriptions. */
const inventory = "https://anrha.com/d-xxv-9-inventaire/";
const archivalEvents1793Draft: HistEvent[] = [
  { slug: "sonthonax-extraordinary-tribunal-1793", date: "1793-02-13", precision: "day", dimension: "inside", title: "Sonthonax orders an extraordinary criminal tribunal",
    location: "Saint-Domingue", categories: ["politics","society"], status: "documented",
    summary: "The civil commissioner issued a seven-page order concerning an extraordinary criminal tribunal during the revolutionary emergency.", body: "The archival inventory records the tribunal order but not its complete rules. The document is important to the history of judicial institutions and coercive power during the revolution; researchers must consult the full order to establish its jurisdiction and operation.",
    people: ["leger-felicite-sonthonax"],
    fr: { title: "Sonthonax réglemente un tribunal criminel extraordinaire", summary: "Le commissaire civil publie un arrêté de sept pages concernant un tribunal criminel extraordinaire pendant la crise révolutionnaire.", body: "L'inventaire atteste l'arrêté, sans en détailler toutes les règles. Il éclaire l'histoire des institutions judiciaires et du pouvoir de contrainte pendant la révolution. Le texte intégral est nécessaire pour établir les compétences et le fonctionnement du tribunal." },
    sources: [{ title: "ANRHA, fonds D/XXV/9, inventaire de documents de 1793 (français)", url: inventory }]
  },
  { slug: "slave-discipline-proclamation-1793", date: "1793-05-03", precision: "day", dimension: "inside", title: "Commissioners issue a proclamation concerning slave discipline",
    location: "Saint-Domingue", categories: ["society","politics"], status: "documented",
    summary: "The commissioners issued a proclamation referring to colonial regulations of 1685, 1724 and 1784 on the discipline of enslaved people.", body: "This dated document demonstrates that the legal machinery of slavery was still being debated and administered in May 1793. The inventory does not establish the complete effect of the proclamation, so it should not be presented as a general emancipation decree.",
    people: ["etienne-polverel","leger-felicite-sonthonax"],
    fr: { title: "Proclamation des commissaires sur la discipline des personnes esclavisées", summary: "Les commissaires publient une proclamation concernant les règlements coloniaux de 1685, 1724 et 1784 sur la discipline des personnes esclavisées.", body: "Ce document daté montre que le droit de l'esclavage fait encore l'objet de débats et de mesures administratives en mai 1793. L'inventaire ne permet pas d'en établir tous les effets; il ne faut pas le confondre avec un décret d'émancipation générale." },
    sources: [{ title: "ANRHA, fonds D/XXV/9, inventaire de documents de 1793 (français)", url: inventory }]
  },
  { slug: "church-property-republic-1793", date: "1793-05-05", precision: "day", dimension: "inside", title: "Church property is incorporated into the Republic's domain",
    location: "Saint-Domingue", categories: ["culture","economy","politics"], status: "documented",
    summary: "The civil commissioners proclaimed the incorporation of church property into the Republic's domain.", body: "The measure connects revolutionary politics to religious institutions, landholding and public finance. Its existence is established by the dated inventory, but implementation across the colony and its effects on worship require investigation in local records.",
    people: ["etienne-polverel","leger-felicite-sonthonax"],
    fr: { title: "Les biens du clergé sont réunis au domaine de la République", summary: "Les commissaires civils proclament la réunion des biens du clergé au domaine de la République.", body: "La mesure relie la politique révolutionnaire aux institutions religieuses, à la propriété foncière et aux finances publiques. Son existence est attestée par l'inventaire daté, mais son application dans la colonie et ses effets sur le culte nécessitent des recherches locales." },
    sources: [{ title: "ANRHA, fonds D/XXV/9, inventaire de documents de 1793 (français)", url: inventory }]
  },
  { slug: "divorce-law-saint-domingue-1793", date: "1793-06-13", precision: "day", dimension: "inside", title: "French divorce law is ordered published in Saint-Domingue",
    location: "Saint-Domingue", categories: ["society","politics"], status: "documented",
    summary: "Commissioners ordered publication of the French law of 20 September 1792 regulating divorce.", body: "This entry concerns the transmission of family law into the colony, not the original passage of the law in France. The source establishes the publication order; whether and how the law was applied to different communities remains a separate historical question.",
    people: ["etienne-polverel","leger-felicite-sonthonax"],
    fr: { title: "La publication de la loi sur le divorce est ordonnée à Saint-Domingue", summary: "Les commissaires ordonnent la publication de la loi française du 20 septembre 1792 réglementant le divorce.", body: "Cette entrée concerne la transmission du droit de la famille dans la colonie et non l'adoption initiale de la loi en France. La source atteste l'ordre de publication; son application aux différentes populations reste une question historique distincte." },
    sources: [{ title: "ANRHA, fonds D/XXV/9, inventaire de documents de 1793 (français)", url: inventory }]
  },
  { slug: "freedom-for-republican-combatants-1793", date: "1793-06-21", precision: "day", dimension: "inside", title: "Commissioners promise freedom to Black combatants supporting the Republic",
    location: "Saint-Domingue", categories: ["society","politics"], status: "documented",
    summary: "The commissioners promised freedom to Black fighters who joined the Republican cause, before the general emancipation proclaimed in the North in August.", body: "This proclamation illustrates how wartime alliances and military recruitment shaped the path to abolition. The promise was conditional, and must be distinguished from the later general emancipation measure. It also shows insurgents' military importance in negotiations with the commissioners.",
    people: ["etienne-polverel","leger-felicite-sonthonax"],
    fr: { title: "Les commissaires promettent la liberté aux combattants noirs ralliés à la République", summary: "Les commissaires promettent la liberté aux combattants noirs ralliés à la République, avant l'émancipation générale proclamée dans le Nord en août.", body: "Cette proclamation montre le rôle des alliances militaires et du recrutement dans le processus d'abolition. La promesse était conditionnelle et doit être distinguée de l'émancipation générale ultérieure. Elle révèle aussi le poids militaire des insurgés dans les négociations avec les commissaires." },
    sources: [{ title: "ANRHA, fonds D/XXV/9, inventaire de documents de 1793 (français)", url: inventory }]
  },
  { slug: "hospitals-proclamation-1793", date: "1793-07-03", precision: "day", dimension: "inside", title: "Civil commissioners issue a proclamation on hospitals",
    location: "Saint-Domingue", categories: ["society"], status: "documented",
    summary: "A dated proclamation concerning hospitals appears in the commissioners' archival inventory.", body: "Health and hospitals formed part of government activity during the revolutionary emergency. The inventory verifies that the document exists but does not reproduce its provisions. It would be misleading to attribute specific hospital reforms to it without reading the original.",
    
    fr: { title: "Les commissaires civils publient une proclamation sur les hôpitaux", summary: "Une proclamation datée concernant les hôpitaux figure dans l'inventaire des archives des commissaires.", body: "La santé et les hôpitaux font partie de l'action publique pendant la crise révolutionnaire. L'inventaire confirme l'existence du document, sans en reproduire les dispositions. Il serait trompeur de lui attribuer des réformes précises sans consulter l'original." },
    sources: [{ title: "ANRHA, fonds D/XXV/9, inventaire de documents de 1793 (français)", url: inventory }]
  },
  { slug: "polverel-marriage-status-1793", date: "1793-07-11", precision: "day", dimension: "inside", title: "Polverel addresses marriage between free men and enslaved women",
    location: "Saint-Domingue", categories: ["society","politics"], status: "documented",
    summary: "Polverel issued a three-page proclamation concerning marriages between free men and enslaved women.", body: "The proclamation offers evidence that legal status, gender and family relationships were live political questions before general emancipation. Its specific protections or restrictions cannot be established from the inventory title alone.",
    people: ["etienne-polverel"],
    fr: { title: "Polverel traite du mariage entre hommes libres et femmes esclavisées", summary: "Polverel publie une proclamation de trois pages concernant les mariages entre hommes libres et femmes esclavisées.", body: "La proclamation montre que le statut juridique, le genre et les liens familiaux sont des questions politiques importantes avant l'émancipation générale. L'intitulé de l'inventaire ne suffit pas à établir les protections ou les restrictions exactes." },
    sources: [{ title: "ANRHA, fonds D/XXV/9, inventaire de documents de 1793 (français)", url: inventory }]
  },
  { slug: "cap-francais-republican-festival-1793", date: "1793-07-14", precision: "day", dimension: "inside", title: "Republican festival recorded at Cap-Français",
    location: "Saint-Domingue", categories: ["culture","politics"], status: "documented",
    summary: "A four-page official account documents a 14 July celebration at Cap-Français.", body: "The document opens a window onto political culture and public ceremony amid revolutionary violence. Public celebrations communicated ideas of citizenship and authority, but the inventory alone cannot tell us the composition of the crowd or the words spoken.",
    
    fr: { title: "Une fête républicaine est documentée au Cap-Français", summary: "Un procès-verbal officiel de quatre pages documente une fête du 14 juillet au Cap-Français.", body: "Ce document éclaire la culture politique et les cérémonies publiques au milieu des violences révolutionnaires. Les fêtes transmettent des idées de citoyenneté et d'autorité, mais l'inventaire ne permet pas à lui seul d'identifier les participants ou les discours." },
    sources: [{ title: "ANRHA, fonds D/XXV/9, inventaire de documents de 1793 (français)", url: inventory }]
  },
  { slug: "civil-status-law-registration-1793", date: "1793-07-15", precision: "day", dimension: "inside", title: "Commissioners order registration of the civil-status law",
    location: "Saint-Domingue", categories: ["society","politics"], status: "documented",
    summary: "The commissioners ordered registration of the French law of 20 September 1792 on documenting citizens' civil status.", body: "This administrative act connects revolution to ordinary legal identity: birth, marriage and death records. Its presence in the archive does not establish how broadly records were actually kept or who was recognized as a citizen.",
    people: ["etienne-polverel","leger-felicite-sonthonax"],
    fr: { title: "Les commissaires ordonnent l'enregistrement de la loi sur l'état civil", summary: "Les commissaires ordonnent l'enregistrement de la loi française du 20 septembre 1792 sur la constatation de l'état civil des citoyens.", body: "Cet acte administratif relie la révolution à l'identité juridique ordinaire : actes de naissance, de mariage et de décès. Sa présence dans l'archive ne permet pas d'établir l'étendue réelle des registres ni les personnes reconnues comme citoyennes." },
    sources: [{ title: "ANRHA, fonds D/XXV/9, inventaire de documents de 1793 (français)", url: inventory }]
  },
  { slug: "combatant-emancipation-order-1793", date: "1793-07-25", precision: "day", dimension: "inside", title: "Commissioners issue a proclamation on freeing insurgent combatants",
    location: "Saint-Domingue", categories: ["society","politics"], status: "documented",
    summary: "The commissioners issued a proclamation concerning the emancipation of insurgent combatants.", body: "This document is part of the transition from military promises of freedom toward broader abolition. The archive establishes its date and subject, but the complete terms of emancipation must be checked in the document itself.",
    people: ["etienne-polverel","leger-felicite-sonthonax"],
    fr: { title: "Proclamation des commissaires sur l'affranchissement des combattants insurgés", summary: "Les commissaires publient une proclamation concernant l'affranchissement des combattants insurgés.", body: "Ce document s'inscrit dans la transition des promesses de liberté liées au service militaire vers une abolition plus large. L'archive en établit la date et le sujet, mais les conditions précises doivent être vérifiées dans le texte intégral." },
    sources: [{ title: "ANRHA, fonds D/XXV/9, inventaire de documents de 1793 (français)", url: inventory }]
  }
];

/** Catalogue verification: the date labels the document, not necessarily its effects. */
const dossiers: Record<string, number> = {
  "sonthonax-extraordinary-tribunal-1793": 86,
  "slave-discipline-proclamation-1793": 89,
  "church-property-republic-1793": 89,
  "divorce-law-saint-domingue-1793": 90,
  "freedom-for-republican-combatants-1793": 90,
  "hospitals-proclamation-1793": 91,
  "polverel-marriage-status-1793": 91,
  "cap-francais-republican-festival-1793": 91,
  "civil-status-law-registration-1793": 91,
  "combatant-emancipation-order-1793": 91,
};
export const archivalEvents1793: HistEvent[] = archivalEvents1793Draft.map((e) => ({
  ...e,
  sources: [{ title: `ANRHA, D/XXV/9, dossier ${dossiers[e.slug]} (French inventory)`, url: inventory }],
  editorial: {
    verification: "inventory",
    dateBasis: "date of archived document",
    reviewedOn: "2026-11-01",
    note: "Document existence and date checked against inventory; complete manuscript not examined.",
  },
}));
