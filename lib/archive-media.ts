import type { ArchiveMedia, Content, HistoricalRecord } from "./types";
import { canonicalEventSlug } from "./event-aliases";

type LinkedMedia = ArchiveMedia & { eventSlugs: string[]; personSlugs: string[] };
/** Source metadata and image reuse terms checked 2 November 2026. */
export const archiveMedia: LinkedMedia[] = [
  {
    "id": "osaka",
    "kind": "image",
    "title": "Naomi Osaka at the 2020 US Open",
    "description": "During the final against Victoria Azarenka, 12 September 2020. Osaka represented Japan; her father is Haitian.",
    "url": "https://commons.wikimedia.org/wiki/File:NaomiOsaka-smile-2020.png",
    "publisher": "AndrewHenkelman / Wikimedia Commons",
    "date": "2020-09-12",
    "image": {
      "src": "/media/2020s/osaka.webp",
      "width": 960,
      "height": 1344,
      "alt": "Naomi Osaka smiling on the tennis court during the 2020 US Open final",
      "credit": "AndrewHenkelman / Wikimedia Commons",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
      "changes": "Resized and converted to WebP; full composition retained."
    },
    "fr": {
      "title": "Naomi Osaka à l’US Open 2020",
      "description": "Pendant la finale contre Victoria Azarenka, le 12 septembre 2020. Osaka représente le Japon ; son père est haïtien.",
      "alt": "Naomi Osaka souriante sur le court pendant la finale de l’US Open 2020",
      "changes": "Redimensionnement et conversion WebP ; composition intégrale conservée."
    },
    "eventSlugs": [
      "naomi-osaka-us-open-2020"
    ],
    "personSlugs": [
      "naomi-osaka"
    ]
  },
  {
    "id": "maniche",
    "kind": "image",
    "title": "Meeting residents in Maniche after the earthquake",
    "description": "USAID staff and Samantha Power meet residents on 26 August 2021. The photograph records a relief visit, twelve days after the earthquake.",
    "url": "https://www.dvidshub.net/image/6809422/administrator-power-visit-maniche-haiti-after-72-earthquake",
    "publisher": "Emily Rasinski / USAID, via DVIDS",
    "date": "2021-08-26",
    "image": {
      "src": "/media/2020s/maniche.webp",
      "width": 1000,
      "height": 667,
      "alt": "Residents and visiting relief officials gathered outdoors in Maniche",
      "credit": "Emily Rasinski / USAID, via DVIDS",
      "license": "Public domain (US government)",
      "licenseUrl": "https://www.dvidshub.net/about/copyright",
      "changes": "Resized and converted to WebP; full composition retained."
    },
    "fr": {
      "title": "Rencontre avec des habitants de Maniche après le séisme",
      "description": "Des représentants de l’USAID et Samantha Power rencontrent les habitants le 26 août 2021. La photographie documente une visite de secours, douze jours après le séisme.",
      "alt": "Habitants et responsables des secours réunis en plein air à Maniche",
      "changes": "Redimensionnement et conversion WebP ; composition intégrale conservée."
    },
    "eventSlugs": [
      "earthquake-2021",
      "haiti-2021-haitian-earthquake-aid-recovery"
    ],
    "personSlugs": []
  },
  {
    "id": "joumou",
    "kind": "image",
    "title": "Soup joumou: a living tradition",
    "description": "A bowl of soup joumou photographed in 2018. This earlier image illustrates the tradition inscribed by UNESCO in 2021; it does not depict the inscription ceremony.",
    "url": "https://commons.wikimedia.org/wiki/File:Soup_Joumou.jpg",
    "publisher": "Aliceba / Wikimedia Commons",
    "date": "2018-01-17",
    "image": {
      "src": "/media/2020s/joumou.webp",
      "width": 1200,
      "height": 1200,
      "alt": "A bowl of Haitian pumpkin soup with vegetables",
      "credit": "Aliceba / Wikimedia Commons",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
      "changes": "Resized and converted to WebP; full composition retained."
    },
    "fr": {
      "title": "La soupe joumou : une tradition vivante",
      "description": "Un bol de soupe joumou photographié en 2018. Cette image antérieure illustre la tradition inscrite par l’UNESCO en 2021 ; elle ne représente pas la cérémonie d’inscription.",
      "alt": "Un bol de soupe haïtienne au giraumon et aux légumes",
      "changes": "Redimensionnement et conversion WebP ; composition intégrale conservée."
    },
    "eventSlugs": [
      "soup-joumou-unesco-2021"
    ],
    "personSlugs": []
  },
  {
    "id": "jean-pierre",
    "kind": "image",
    "title": "Karine Jean-Pierre at the White House",
    "description": "Photographed during a press briefing on 28 August 2023, after her appointment as press secretary in May 2022.",
    "url": "https://commons.wikimedia.org/wiki/File:Karine_Jean-Pierre_2023.jpg",
    "publisher": "Carlos M. Vazquez II / The White House",
    "date": "2023-08-28",
    "image": {
      "src": "/media/2020s/jean-pierre.webp",
      "width": 1027,
      "height": 1400,
      "alt": "Karine Jean-Pierre during a White House press briefing",
      "credit": "Carlos M. Vazquez II / The White House",
      "license": "Public domain (US government)",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:Karine_Jean-Pierre_2023.jpg",
      "changes": "Resized and converted to WebP; full composition retained."
    },
    "fr": {
      "title": "Karine Jean-Pierre à la Maison-Blanche",
      "description": "Photographiée lors d’un point de presse le 28 août 2023, après sa nomination comme porte-parole en mai 2022.",
      "alt": "Karine Jean-Pierre pendant un point de presse à la Maison-Blanche",
      "changes": "Redimensionnement et conversion WebP ; composition intégrale conservée."
    },
    "eventSlugs": [
      "karine-jean-pierre-press-secretary-2022"
    ],
    "personSlugs": []
  },
  {
    "id": "covid-report-2020",
    "kind": "document",
    "title": "COVID-19 in Haiti: final report",
    "description": "A World Bank-hosted report for studying the pandemic and its Haitian context.",
    "url": "https://documents1.worldbank.org/curated/en/346091609822078760/pdf/Final-Report.pdf",
    "publisher": "World Bank",
    "date": "2020",
    "language": "English",
    "format": "PDF",
    "fr": {
      "title": "COVID-19 en Haïti : rapport final",
      "description": "Un rapport hébergé par la Banque mondiale pour étudier la pandémie dans le contexte haïtien."
    },
    "eventSlugs": [
      "haiti-covid-first-cases-2020",
      "haiti-covid-schools-closure-2020"
    ],
    "personSlugs": []
  },
  {
    "id": "earthquake-landslides-2021",
    "kind": "document",
    "title": "Landslides after the August 2021 earthquake",
    "description": "USGS Open-File Report 2021–1112 documents landslides triggered by the earthquake, with maps and scientific analysis.",
    "url": "https://pubs.usgs.gov/publication/ofr20211112",
    "publisher": "US Geological Survey",
    "date": "2021",
    "language": "English",
    "format": "HTML",
    "fr": {
      "title": "Glissements de terrain après le séisme d’août 2021",
      "description": "Le rapport USGS 2021–1112 documente les glissements de terrain provoqués par le séisme, avec des cartes et une analyse scientifique."
    },
    "eventSlugs": [
      "earthquake-2021"
    ],
    "personSlugs": []
  },
  {
    "id": "joumou-unesco-record",
    "kind": "archive",
    "title": "UNESCO: Joumou soup",
    "description": "The heritage record brings together the inscription and documentation of the practice.",
    "url": "https://ich.unesco.org/fr/RL/la-soupe-au-giraumon-01853",
    "publisher": "UNESCO",
    "date": "2021",
    "language": "Français",
    "format": "HTML",
    "fr": {
      "title": "UNESCO : la soupe au giraumon",
      "description": "La notice patrimoniale réunit l’inscription et la documentation de la pratique."
    },
    "eventSlugs": [
      "soup-joumou-unesco-2021"
    ],
    "personSlugs": []
  },
  {
    "id": "resolution-2653",
    "kind": "document",
    "title": "Security Council resolution 2653",
    "description": "The 21 October 2022 resolution established targeted sanctions concerning Haiti. Read the official record and linked resolution.",
    "url": "https://main.un.org/securitycouncil/en/content/sres2653-2022",
    "publisher": "United Nations",
    "date": "2022-10-21",
    "language": "English / Français",
    "format": "HTML",
    "fr": {
      "title": "Résolution 2653 du Conseil de sécurité",
      "description": "La résolution du 21 octobre 2022 établit des sanctions ciblées concernant Haïti. Consultez la notice officielle et le texte associé."
    },
    "eventSlugs": [
      "haiti-2022-un-sanctions-resolution-2653"
    ],
    "personSlugs": []
  },
  {
    "id": "resolution-2699",
    "kind": "document",
    "title": "Security Council resolution 2699",
    "description": "The official record for the October 2023 resolution associated with the multinational security mission and arms embargo.",
    "url": "https://main.un.org/securitycouncil/en/content/sres2699-2023",
    "publisher": "United Nations",
    "date": "2023-10-02",
    "language": "English / Français",
    "format": "HTML",
    "fr": {
      "title": "Résolution 2699 du Conseil de sécurité",
      "description": "La notice officielle de la résolution d’octobre 2023 relative à la mission multinationale de sécurité et à l’embargo sur les armes."
    },
    "eventSlugs": [
      "haiti-2023-un-mss-resolution-2699",
      "haiti-2024-kenyan-police-first-arrival"
    ],
    "personSlugs": []
  },
  {
    "id": "england-haiti-2023",
    "kind": "document",
    "title": "England–Haiti: official match report",
    "description": "FIFA’s 53-page report documents Haiti’s World Cup debut, including lineups, formations and match statistics.",
    "url": "https://www.fifatrainingcentre.com/media/native/tournaments/womens-world-cup/2023/report_131890.pdf",
    "publisher": "FIFA",
    "date": "2023-07-22",
    "language": "English",
    "format": "PDF",
    "fr": {
      "title": "Angleterre–Haïti : rapport officiel du match",
      "description": "Le rapport de 53 pages de la FIFA documente les débuts d’Haïti en Coupe du monde, avec les compositions, les formations et les statistiques."
    },
    "eventSlugs": [
      "research-2023-06-haiti-makes-its-first-appearance-at-t"
    ],
    "personSlugs": []
  },
  {
    "id": "caricom-declaration-2024",
    "kind": "document",
    "title": "CARICOM outcome declaration",
    "description": "The 11 March declaration sets out the proposed transitional presidential council and its responsibilities. It records commitments, rather than proof of their fulfillment.",
    "url": "https://caricom.org/outcome-declaration-of-caricom-international-partners-and-haitian-stakeholders/",
    "publisher": "CARICOM",
    "date": "2024-03-11",
    "language": "English",
    "format": "HTML",
    "fr": {
      "title": "Déclaration finale de la CARICOM",
      "description": "La déclaration du 11 mars expose le projet de conseil présidentiel de transition et ses responsabilités. Elle documente des engagements, sans prouver leur réalisation."
    },
    "eventSlugs": [
      "research-2024-03-caricom-mediated-talks-produce-a",
      "haiti-2024-transitional-presidential-council-installed"
    ],
    "personSlugs": []
  },
  {
    "id": "wharf-jeremie-report",
    "kind": "document",
    "title": "Wharf Jérémie investigation report",
    "description": "The December 2024 BINUH/OHCHR report records findings on the killings. The document describes severe violence.",
    "url": "https://binuh.unmissions.org/sites/default/files/flash_report_20241223_wharf_jeremie_fr.pdf",
    "publisher": "BINUH / OHCHR",
    "date": "2024-12-23",
    "language": "Français",
    "format": "PDF",
    "fr": {
      "title": "Rapport d’enquête sur Wharf Jérémie",
      "description": "Le rapport de décembre 2024 du BINUH et du HCDH présente les conclusions de l’enquête sur les tueries. Le document décrit des violences graves."
    },
    "eventSlugs": [
      "research-2024-07-wharf-j-r-mie-gang-carries-out-ma"
    ],
    "personSlugs": []
  },
  {
    "id": "compas-unesco-record",
    "kind": "archive",
    "title": "UNESCO: Compas of Haiti",
    "description": "Explore the heritage record for the musical and dance tradition inscribed in 2025.",
    "url": "https://ich.unesco.org/fr/RL/le-compas-d-haiti-02273",
    "publisher": "UNESCO",
    "date": "2025",
    "language": "Français",
    "format": "HTML",
    "fr": {
      "title": "UNESCO : le compas d’Haïti",
      "description": "Consultez la notice patrimoniale de la tradition musicale et dansée inscrite en 2025."
    },
    "eventSlugs": [
      "research-2025-09-unesco-inscribes-haitian-compas-a"
    ],
    "personSlugs": []
  },
  {
    "id": "electoral-decree-2025",
    "kind": "document",
    "title": "Electoral decree of 1 December 2025",
    "description": "A historical version of the electoral framework, held by the CEP. Later amendments or replacement texts must be consulted separately.",
    "url": "https://cephaiti.ht/wp-content/uploads/2026/06/Decret_electoral_-1e-Decembre-2025.pdf",
    "publisher": "Conseil électoral provisoire",
    "date": "2025-12-01",
    "language": "Français",
    "format": "PDF",
    "fr": {
      "title": "Décret électoral du 1er décembre 2025",
      "description": "Une version historique du cadre électoral, conservée par le CEP. Les modifications ou textes de remplacement ultérieurs doivent être consultés séparément."
    },
    "eventSlugs": [
      "research-2025-10-transitional-presidential-council"
    ],
    "personSlugs": []
  },
  {
    "id": "hope-help-2026",
    "kind": "document",
    "title": "HOPE/HELP extension: customs guidance",
    "description": "US Customs and Border Protection explains the retroactive extension of the apparel trade provisions.",
    "url": "https://content.govdelivery.com/accounts/USDHSCBP/bulletins/41cabec",
    "publisher": "US Customs and Border Protection",
    "date": "2026",
    "language": "English",
    "format": "HTML",
    "fr": {
      "title": "Prolongation HOPE/HELP : instructions douanières",
      "description": "Les douanes américaines expliquent la prolongation rétroactive des dispositions commerciales relatives aux vêtements."
    },
    "eventSlugs": [
      "research-2026-03-united-states-renews-hope-help-a"
    ],
    "personSlugs": []
  },
  {
    "id": "binuh-resolution-2814",
    "kind": "document",
    "title": "BINUH mandate: resolution 2814",
    "description": "The UN Digital Library record provides the resolution and language editions for the January 2026 mandate renewal.",
    "url": "https://digitallibrary.un.org/record/4101173?ln=en",
    "publisher": "United Nations Digital Library",
    "date": "2026-01-29",
    "language": "English / Français",
    "format": "HTML",
    "fr": {
      "title": "Mandat du BINUH : résolution 2814",
      "description": "La notice de la Bibliothèque numérique de l’ONU donne accès à la résolution et à ses versions linguistiques pour le renouvellement de janvier 2026."
    },
    "eventSlugs": [
      "research-2026-02-un-security-council-renews-binuh"
    ],
    "personSlugs": []
  }
];

export function attachArchiveMedia(content: Content): Content {
  const merge = (a: ArchiveMedia[] = [], b: ArchiveMedia[] = []) => [...new Map([...a, ...b].map(m => [m.id, m])).values()];
  const documents: HistoricalRecord[] = archiveMedia.filter(m => m.kind !== "image").map(m => ({
    slug: `archive-${m.id}`, type: m.kind === "document" ? "document" : "work", title: m.title,
    summary: m.description, dates: m.date, fr: { title: m.fr.title, summary: m.fr.description },
    eventSlugs: m.eventSlugs, sources: [{ title: `${m.publisher}: ${m.title}`, url: m.url }], attachments: [m],
  }));
  const records = [...new Map([...(content.records ?? []), ...documents].map(r => [r.slug, r])).values()];
  return {
    ...content, records,
    periods: content.periods.map(p => p.slug === "2020s" ? { ...p, attachments: merge(p.attachments, archiveMedia) } : p),
    events: content.events.map(e => {
      const media = archiveMedia.filter(m => m.eventSlugs.includes(canonicalEventSlug(e.slug)));
      return { ...e, attachments: merge(e.attachments, media), records: [...new Set([...(e.records ?? []), ...documents.filter(r => r.eventSlugs?.includes(canonicalEventSlug(e.slug))).map(r => r.slug)])] };
    }),
    people: content.people.map(p => ({ ...p, attachments: merge(p.attachments, archiveMedia.filter(m => m.personSlugs.includes(p.slug))) })),
  };
}
