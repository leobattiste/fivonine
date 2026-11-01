import type { HistEvent, DatePrecision, Dimension } from "./types";
/** Seven additional documented events completing thematic gaps in 2021. */
type Entry = {
  slug: string; date: string; dimension: Dimension; categories: string[]; location: string;
  title: string; ft: string; summary: string; fs: string; body: string; fb: string; sources: [string, string][];
};
const entries: Entry[] = [
  {
    "slug": "village-de-dieu-police-raid-march-2021",
    "date": "2021-03-12",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Village de Dieu, Port-au-Prince",
    "title": "Deadly police operation at Village de Dieu exposes public-security weaknesses",
    "ft": "Une opération policière meurtrière à Village de Dieu révèle les faiblesses de la sécurité",
    "summary": "A failed police operation leaves at least four officers dead, revealing the state's limited capacity to confront organized armed groups.",
    "fs": "Une opération policière échoue et entraîne la mort d'au moins quatre agents, révélant les limites de l'État face aux groupes armés.",
    "body": "On 12 March 2021, Haitian National Police officers launched an operation against armed groups in Village de Dieu, on the southern edge of metropolitan Port-au-Prince. At least four officers were killed, and police vehicles were captured or destroyed. The failed raid triggered public anger over police leadership, equipment, preparation and the growing power of heavily armed organizations. The UN Secretary-General described the episode as further undermining confidence in the state's ability to protect residents. The officers' deaths form part of a wider 2021 pattern of attacks against the police, kidnappings and killings, as well as the vulnerability of people living near gang-controlled streets. The documented facts of the operation should be distinguished from political accusations about who bears responsibility for the failure.",
    "fb": "Le 12 mars 2021, la Police nationale d'Haïti mène une opération contre des groupes armés à Village de Dieu, dans le sud de Port-au-Prince. Au moins quatre policiers sont tués et des véhicules sont saisis ou détruits. Cet échec provoque des critiques concernant l'équipement, la préparation et la direction de la police. Le rapport du Secrétaire général des Nations unies souligne la perte de confiance dans la capacité de l'État à protéger la population. L'événement s'inscrit dans une multiplication des attaques contre les policiers et dans l'insécurité vécue par les habitants des quartiers concernés. Il faut distinguer les faits documentés des accusations politiques.",
    "sources": [
      [
        "UN Secretary-General, BINUH report S/2021/559",
        "https://www.haitidocs.org/doc/binuh-sg-reports-2021-report-secretary-general"
      ]
    ]
  },
  {
    "slug": "ariel-henry-designated-july-2021",
    "date": "2021-07-05",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince",
    "title": "Ariel Henry is designated prime minister but not installed before the assassination",
    "ft": "Ariel Henry est désigné Premier ministre sans être investi avant l'assassinat",
    "summary": "Jovenel Moïse appoints Ariel Henry to replace Claude Joseph, but the change is not completed before the president's death.",
    "fs": "Jovenel Moïse désigne Ariel Henry pour succéder à Claude Joseph, sans que la transition soit achevée avant sa mort.",
    "body": "On 5 July 2021, President Jovenel Moïse signed an appointment designating Ariel Henry as prime minister. Henry had not yet assumed office when Moïse was assassinated two days later. Claude Joseph therefore continued to lead the interim government during the immediate emergency. The incomplete change of government deepened the uncertainty over succession because Haiti had no functioning parliament able to take the usual constitutional steps following a presidential vacancy. Henry was formally installed on 20 July, a separate event that should not be confused with his designation. The sequence matters because it explains the competing claims to authority and the improvised political arrangements that followed the assassination.",
    "fb": "Le 5 juillet 2021, le président Jovenel Moïse signe un arrêté désignant Ariel Henry Premier ministre. Henry n'a pas encore pris ses fonctions lorsque le chef de l'État est assassiné deux jours plus tard. Claude Joseph dirige donc toujours le gouvernement par intérim dans les premiers jours de la crise. Le changement inachevé accroît les incertitudes sur la succession, alors qu'aucun Parlement fonctionnel ne peut suivre la procédure constitutionnelle ordinaire. Ariel Henry est officiellement investi le 20 juillet, événement distinct de sa désignation. Cette chronologie aide à comprendre les revendications concurrentes d'autorité.",
    "sources": [
      [
        "Haitian Prime Minister's Office, installation ceremony and original decree",
        "https://www.primature.gouv.ht/ceremonie-dinstallation-du-premier-ministre-dr-ariel-henry-et-des-membres-de-son-cabinet-ministeriel/"
      ]
    ]
  },
  {
    "slug": "montana-accord-haiti-august-2021",
    "date": "2021-08-30",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Port-au-Prince",
    "title": "Haitian civil-society groups introduce the Montana Accord",
    "ft": "Des organisations haïtiennes de la société civile présentent l'accord de Montana",
    "summary": "A civil-society proposal outlines an interim governing framework and electoral transition following the president's assassination.",
    "fs": "Un projet issu de la société civile propose une gouvernance de transition et un retour aux élections après l'assassinat présidentiel.",
    "body": "On 30 August 2021, the Commission to Search for a Haitian Solution to the Crisis presented what became known as the Montana Accord. Developed through consultations among Haitian civic, political, religious, professional, women's and labor organizations, the proposal advocated a transitional council, interim political leadership, oversight structures and a path toward credible elections. It differed from the agreement pursued by Prime Minister Ariel Henry. The Montana initiative did not represent a consensus shared by every organization or party; its historical significance lies in the sustained effort by Haitian groups to define alternatives to the existing political arrangements and press for accountable institutions. The commission's own account and an independent assessment by International Crisis Group document its origins and objectives.",
    "fb": "Le 30 août 2021, la Commission pour la recherche d'une solution haïtienne à la crise présente le texte appelé accord de Montana. Issu de consultations entre organisations civiles, professionnelles, religieuses, féminines, syndicales et politiques, ce projet prévoit un conseil de transition, un pouvoir provisoire, des mécanismes de contrôle et un processus électoral crédible. Il diffère de la stratégie défendue par le Premier ministre Ariel Henry. L'accord ne fait pas l'unanimité nationale, mais il témoigne de la volonté d'acteurs haïtiens de construire une alternative et de demander des institutions responsables. Le texte original et une analyse de l'International Crisis Group permettent de retracer son élaboration.",
    "sources": [
      [
        "Montana Accord commission, agreement and history",
        "https://akomontana.ht/en/agreeement/"
      ]
    ]
  },
  {
    "slug": "haiti-school-year-two-stage-delay-september-2021",
    "date": "2021-09-02",
    "dimension": "inside",
    "categories": [
      "education",
      "society",
      "environment"
    ],
    "location": "Haiti, especially Sud, Nippes and Grand'Anse",
    "title": "Government postpones the 2021–2022 school year after the earthquake",
    "ft": "Le gouvernement reporte la rentrée 2021–2022 après le séisme",
    "summary": "School reopening is rescheduled for September 21 in seven departments and October 4 in the three most affected by the earthquake.",
    "fs": "La rentrée est reportée au 21 septembre dans sept départements et au 4 octobre dans les trois plus touchés.",
    "body": "At a 2 September 2021 cabinet meeting, Haiti's government decided to delay the start of the academic year, originally expected on 6 September. The Ministry of Education subsequently announced a differentiated schedule: 21 September in seven departments and 4 October in Sud, Nippes and Grand'Anse, which had borne the greatest damage from the 14 August earthquake. The change reflected destroyed or unsafe classrooms, disrupted roads, temporary displacement and the need for school-based emergency planning. Later assessments documented damage to hundreds of educational institutions, with figures changing as the surveys proceeded. An announced reopening schedule should not be mistaken for evidence that all children returned on those dates. This record is distinct from the later reporting of schools actually beginning to resume classes.",
    "fb": "Lors d'un conseil des ministres du 2 septembre 2021, le gouvernement décide de reporter la rentrée, initialement prévue le 6 septembre. Le ministère de l'Éducation fixe ensuite le 21 septembre dans sept départements et le 4 octobre dans le Sud, les Nippes et la Grand'Anse, particulièrement touchés par le séisme du 14 août. La décision prend en compte des bâtiments scolaires détruits ou dangereux, des routes endommagées et le déplacement des familles. Les bilans des écoles sinistrées évoluent avec les inspections. Un calendrier annoncé ne signifie pas que tous les élèves ont effectivement repris les cours aux dates prévues. Cet acte est distinct de la reprise constatée plus tard.",
    "sources": [
      [
        "Haitian Ministry of Education, official September 2021 announcement",
        "https://communication.gouv.ht/in/report-par-le-menfp-de-la-rentree-des-classes-pour-les-21-septembre-et-4-octobre-2021/"
      ]
    ]
  },
  {
    "slug": "un-haitian-migrants-protection-september-2021",
    "date": "2021-09-30",
    "dimension": "abroad",
    "categories": [
      "abroad",
      "society",
      "world"
    ],
    "location": "Geneva, Switzerland",
    "title": "Four UN agencies demand safeguards for Haitians migrating across the Americas",
    "ft": "Quatre agences de l'ONU réclament des garanties pour les migrants haïtiens",
    "summary": "UN agencies ask states to examine migrants' protection needs before deportation and expand lawful pathways.",
    "fs": "Les agences demandent une évaluation des besoins de protection avant toute expulsion et davantage de voies régulières.",
    "body": "On 30 September 2021, UNHCR, IOM, UNICEF and the UN Human Rights Office jointly urged governments in the Americas not to remove Haitians without assessing individual protection needs. Their statement followed large-scale movements of Haitian migrants across several countries and deportations and expulsions at the United States–Mexico border. Many migrants had spent years working or living in other Latin American countries before traveling north, reflecting long routes and diverse family circumstances. The agencies called for protection of children, access to asylum procedures and greater regional coordination. Their recommendations were not binding findings about every individual's eligibility for asylum and should be distinguished from the governments' actual immigration policies. The event illustrates the transnational consequences of Haiti's crisis.",
    "fb": "Le 30 septembre 2021, le HCR, l'OIM, l'UNICEF et le Haut-Commissariat de l'ONU aux droits de l'homme demandent aux gouvernements des Amériques de ne pas renvoyer des Haïtiens sans examiner leurs besoins individuels de protection. La déclaration suit des mouvements migratoires à travers plusieurs pays ainsi que des expulsions à la frontière entre les États-Unis et le Mexique. De nombreuses personnes avaient auparavant vécu en Amérique latine. Les agences appellent à protéger les enfants, à garantir l'accès aux procédures d'asile et à améliorer la coopération régionale. Leurs recommandations ne préjugent pas du statut de chaque migrant et doivent être distinguées des politiques réellement appliquées.",
    "sources": [
      [
        "UNHCR, IOM, UNICEF and OHCHR joint statement, September 2021",
        "https://www.unhcr.org/africa/news/press-releases/un-agencies-call-protection-measures-and-comprehensive-regional-approach"
      ]
    ]
  },
  {
    "slug": "haiti-post-earthquake-needs-assessment-november-2021",
    "date": "2021-11",
    "dimension": "inside",
    "categories": [
      "economy",
      "environment",
      "society"
    ],
    "location": "Sud, Grand'Anse and Nippes, Haiti",
    "title": "Government assessment estimates nearly $2 billion needed for earthquake recovery",
    "ft": "Une évaluation estime à près de deux milliards de dollars les besoins après le séisme",
    "summary": "The post-disaster assessment documents damage, economic losses and priorities for rebuilding homes and public services.",
    "fs": "L'évaluation post-catastrophe détaille les dégâts, les pertes économiques et les priorités de reconstruction.",
    "body": "After the 14 August earthquake, the Haitian government coordinated a Post-Disaster Needs Assessment with technical assistance from the United Nations, World Bank, European Union and other partners. The assessment, released in November 2021, estimated nearly US$2 billion in recovery and reconstruction needs. It examined housing, schools, healthcare, roads, agriculture, commercial activities, water and environmental risks. These figures represent an assessment of needs, not the amount of money actually disbursed or the number of completed reconstruction projects. The report is a valuable record of the disaster's lasting economic and social consequences, and enables comparisons between the damage in Sud, Grand'Anse and Nippes. Its categories and measurement period must be maintained when later funding is evaluated.",
    "fb": "Après le séisme du 14 août, le gouvernement haïtien coordonne une Évaluation des besoins post-catastrophe, avec le soutien technique des Nations unies, de la Banque mondiale, de l'Union européenne et d'autres partenaires. Publiée en novembre 2021, elle chiffre les besoins de relèvement et de reconstruction à près de deux milliards de dollars. Le document étudie les logements, les écoles, les soins, les routes, l'agriculture, le commerce, l'eau et les risques environnementaux. Il s'agit d'une estimation des besoins, non de fonds déjà versés ni de chantiers achevés. Ce bilan permet d'évaluer les conséquences durables du désastre et de comparer les départements touchés.",
    "sources": [
      [
        "United Nations Haiti, post-disaster recovery cost assessment",
        "https://haiti.un.org/en/171580-government-republic-haiti-hosts-international-event-finance-reconstruction-and-recovery"
      ]
    ]
  },
  {
    "slug": "haiti-missionary-hostages-escape-december-2021",
    "date": "2021-12-16",
    "dimension": "inside",
    "categories": [
      "society",
      "world"
    ],
    "location": "Croix-des-Bouquets area, Haiti",
    "title": "Final hostages from October kidnapping escape captivity",
    "ft": "Les derniers otages de l'enlèvement d'octobre échappent à leurs ravisseurs",
    "summary": "After earlier releases, the remaining 12 missionaries are freed in December, ending the widely followed case.",
    "fs": "Après plusieurs libérations, les douze derniers missionnaires sortent de captivité en décembre.",
    "body": "On or about 16 December 2021, the twelve remaining hostages from the October kidnapping of seventeen Christian Aid Ministries missionaries escaped captivity, according to later United States Department of Justice accounts. Two hostages had been released during November and three in early December. The widely reported case demonstrated how armed groups used prolonged hostage-taking, ransom demands and intimidation. Subsequent court proceedings provided additional detail about how the abduction was organized, but the resolution should not be taken as evidence that Haiti's broader kidnapping crisis ended. This entry is directly connected to the 16 October abduction and places the outcome within the larger experiences of Haitian residents, whose own kidnappings often received far less international attention.",
    "fb": "Vers le 16 décembre 2021, les douze derniers otages parmi les dix-sept missionnaires enlevés en octobre échappent à leur captivité, selon des dossiers judiciaires américains ultérieurs. Deux membres du groupe ont été libérés en novembre et trois autres au début de décembre. L'affaire illustre les enlèvements prolongés, les demandes de rançon et l'intimidation pratiqués par des groupes armés. Les procédures judiciaires apportent ensuite des précisions sur l'organisation du crime. Cette issue ne signifie pas la fin de la crise des kidnappings en Haïti et doit être reliée à l'événement du 16 octobre, tout en rappelant les victimes haïtiennes.",
    "sources": [
      [
        "U.S. Department of Justice, record of 2021 hostage-taking case",
        "https://www.justice.gov/usao-dc/pr/haitian-gang-member-charged-hostage-taking-kidnapping-16-us-missionaries-fall-2021"
      ]
    ]
  }
];
export const historical2021Addenda: HistEvent[] = entries.map((e) => ({
  slug: e.slug, title: e.title, date: e.date,
  precision: (/^\d{4}-\d{2}-\d{2}$/.test(e.date) ? "day" : "month") as DatePrecision,
  dimension: e.dimension, categories: e.categories, location: e.location,
  summary: e.summary, body: e.body,
  fr: { title: e.ft, summary: e.fs, body: e.fb },
  sources: e.sources.map(([title,url]) => ({ title,url })),
  status: "documented",
  editorial: { verification: "corroborated", dateBasis: e.date.length === 10 ? "documented day" : "documented month", reviewedOn: "2026-11-01", note: "Dated claims sourced; uncertainty and official estimates distinguished from outcomes." },
}));
