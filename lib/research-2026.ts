import type { HistEvent, DatePrecision, Dimension } from "./types";
/** 2026 chronology cutoff: 2026-11-01. Future election dates are plans, not events. */
type Entry={slug:string;date:string;dimension:Dimension;categories:string[];location:string;title:string;ft:string;summary:string;fs:string;body:string;fb:string;sources:[string,string][]};
const entries:Entry[]=[
  {
    "slug": "research-2026-01-un-humanitarian-plan-estimates-6",
    "date": "2026-01",
    "dimension": "inside",
    "categories": [
      "society",
      "education",
      "economy"
    ],
    "location": "Haiti",
    "title": "UN humanitarian plan estimates 6.4 million Haitians require assistance",
    "ft": "Le plan humanitaire de l'ONU estime que 6,4 millions d'Haïtiens ont besoin d'aide",
    "summary": "The planned response highlights violence, hunger, displacement and disrupted essential services.",
    "fs": "Le plan souligne la violence, la faim, les déplacements et la dégradation des services.",
    "body": "The United Nations' 2026 Humanitarian Needs and Response Plan estimated that 6.4 million people in Haiti, more than half the population, would require some form of humanitarian assistance during the year. The assessment connected armed violence, food insecurity, displacement, reduced access to schools and healthcare, and vulnerability to climate-related disasters. Such an estimate describes projected humanitarian needs rather than a count of individuals who actually received aid. The response faced financing and access constraints, including dangerous roads and insecurity around settlements. For historical accuracy, aid targets, people assessed as in need and people actually reached should be tracked as separate figures.",
    "fb": "Le Plan des besoins et de la réponse humanitaire des Nations unies estime qu'en 2026, 6,4 millions de personnes en Haïti, soit plus de la moitié de la population, ont besoin d'une aide humanitaire. Il relie ce besoin à la violence armée, à la faim, aux déplacements et aux difficultés d'accès aux écoles et aux soins, dans un contexte de risques climatiques. Cette estimation ne correspond pas au nombre réel de bénéficiaires. Les objectifs, les besoins recensés et l'aide effectivement distribuée doivent être présentés séparément, en tenant compte des contraintes de financement et de sécurité.",
    "sources": [
      [
        "United Nations / official documentation",
        "https://www.un.org/en/node/216734"
      ]
    ]
  },
  {
    "slug": "research-2026-02-un-security-council-renews-binuh",
    "date": "2026-01-29",
    "dimension": "abroad",
    "categories": [
      "world",
      "politics"
    ],
    "location": "United Nations, New York",
    "title": "UN Security Council renews BINUH's mandate through January 2027",
    "ft": "Le Conseil de sécurité renouvelle le mandat du BINUH jusqu'en janvier 2027",
    "summary": "Resolution 2814 extends the UN political mission amid continuing insecurity and delayed elections.",
    "fs": "La résolution 2814 prolonge la mission politique de l'ONU malgré l'insécurité et les retards électoraux.",
    "body": "On 29 January 2026, the UN Security Council adopted resolution 2814 renewing the mandate of the United Nations Integrated Office in Haiti, BINUH, through 31 January 2027. The mission's work included political engagement, advice on institutions and attention to human rights. BINUH was distinct from the multinational security operations authorized under other resolutions. The renewal occurred only days before the planned expiration of Haiti's Transitional Presidential Council, and amid doubts about security conditions for elections. As with other UN mandates, the adoption of a resolution is evidence of legal authorization and intended tasks, not proof that the underlying political problems were resolved.",
    "fb": "Le 29 janvier 2026, le Conseil de sécurité adopte la résolution 2814 et prolonge jusqu'au 31 janvier 2027 le mandat du Bureau intégré des Nations unies en Haïti (BINUH). Cette mission politique soutient le dialogue, les institutions et le suivi des droits humains. Elle est distincte des dispositifs internationaux de sécurité autorisés par d'autres résolutions. La décision intervient peu avant la fin prévue du Conseil présidentiel de transition et dans un contexte d'incertitude électorale. La prolongation du mandat ne signifie pas que les difficultés politiques ou sécuritaires aient été résolues.",
    "sources": [
      [
        "United Nations / official documentation",
        "https://www.securitycouncilreport.org/un-documents/haiti"
      ]
    ]
  },
  {
    "slug": "research-2026-03-united-states-renews-hope-help-a",
    "date": "2026-02-03",
    "dimension": "abroad",
    "categories": [
      "economy",
      "world",
      "abroad"
    ],
    "location": "United States and Haiti",
    "title": "United States renews HOPE/HELP apparel trade preferences retroactively",
    "ft": "Les États-Unis rétablissent rétroactivement les préférences commerciales HOPE/HELP",
    "summary": "The reauthorization restores specified duty-free benefits after a lapse beginning October 2025.",
    "fs": "La prolongation rétablit certains avantages tarifaires après l'interruption commencée en octobre 2025.",
    "body": "On 3 February 2026, US legislation extended eligible preferential treatment under Haiti's HOPE and HELP trade programs through 31 December 2026, with provisions for retroactive refund of certain duties collected since the October 2025 lapse. US Customs and Border Protection later published operational guidance for importers. The programs were important to Haiti's garment sector, which faced insecurity, factory closures and transportation problems. A retroactive renewal does not guarantee higher production or employment; those outcomes require separate economic evidence. The distinction between signed law, administrative implementation and effects on factories matters when reporting the history of international trade policy.",
    "fb": "Le 3 février 2026, une loi américaine prolonge jusqu'au 31 décembre 2026 certains avantages des programmes HOPE et HELP pour les exportations haïtiennes, avec des dispositions de remboursement rétroactif de droits perçus depuis octobre 2025. Les douanes américaines publient ensuite les instructions d'application. Ces mesures concernent un secteur textile soumis à l'insécurité et aux difficultés de transport. La prolongation ne garantit pas automatiquement une hausse de l'emploi ou de la production. Il faut distinguer la loi, son application administrative et ses conséquences économiques.",
    "sources": [
      [
        "US Customs and Border Protection",
        "https://content.govdelivery.com/accounts/USDHSCBP/bulletins/41cabec"
      ]
    ]
  },
  {
    "slug": "research-2026-04-edwidge-danticat-receives-the-pe",
    "date": "2026-03-31",
    "dimension": "abroad",
    "categories": [
      "arts",
      "abroad",
      "culture"
    ],
    "location": "New York, United States",
    "title": "Edwidge Danticat receives the PEN/Nabokov Award for international literature",
    "ft": "Edwidge Danticat reçoit le prix PEN/Nabokov de littérature internationale",
    "summary": "The Haitian-American writer is honored for her long literary contribution.",
    "fs": "L'écrivaine haïtiano-américaine est distinguée pour l'ensemble de son œuvre.",
    "body": "At the PEN America Literary Awards ceremony on 31 March 2026 in New York, Haitian-American writer Edwidge Danticat was honored with the PEN/Nabokov Award for Achievement in International Literature. The distinction recognized decades of fiction and nonfiction addressing migration, family, memory and the Haitian diaspora. Her work includes Breath, Eyes, Memory, Krik? Krak!, Brother, I'm Dying and other influential books. The award is recognition of a career, not the publication date of any specific work. It offers an opportunity to document the role Haitian writers have played in Caribbean and American literature and the circulation of Haitian stories across borders and languages.",
    "fb": "Lors de la cérémonie des prix littéraires de PEN America, le 31 mars 2026 à New York, l'écrivaine haïtiano-américaine Edwidge Danticat reçoit le prix PEN/Nabokov pour l'ensemble de son apport à la littérature internationale. L'organisation souligne plusieurs décennies de romans, de nouvelles et d'essais consacrés à la migration, à la famille et à la mémoire. Parmi ses livres figurent Breath, Eyes, Memory, Krik? Krak! et Brother, I'm Dying. Cette distinction récompense une carrière et ne correspond pas à la date de publication d'un ouvrage particulier.",
    "sources": [
      [
        "PEN America",
        "https://pen.org/2026-literary-awards-winners/"
      ]
    ]
  },
  {
    "slug": "research-2026-05-miami-jury-convicts-four-defenda",
    "date": "2026-05-08",
    "dimension": "abroad",
    "categories": [
      "world",
      "politics"
    ],
    "location": "Miami, Florida, United States",
    "title": "Miami jury convicts four defendants in Jovenel Moïse assassination plot",
    "ft": "Un jury de Miami condamne quatre accusés dans le complot contre Jovenel Moïse",
    "summary": "A federal jury finds four men guilty of offenses relating to the 2021 presidential assassination.",
    "fs": "Un jury fédéral déclare quatre hommes coupables d'infractions liées à l'assassinat de 2021.",
    "body": "On 8 May 2026, a federal jury in Miami convicted Arcangel Pretel Ortiz, Antonio Intriago, Walter Veintemilla and James Solages of charges connected to the conspiracy surrounding President Jovenel Moïse's assassination in 2021. The US Department of Justice listed conspiracy and material-support offenses among the verdicts and stated that the defendants faced potential life sentences. A conviction in one jurisdiction must be distinguished from the status of other suspects, charges and cases in Haitian courts. The ruling is a significant later development in the history of the assassination, but it does not by itself settle every question concerning the original plot, its financing and responsibility. The full legal record should be linked to the 7 July 2021 historical entry.",
    "fb": "Le 8 mai 2026, un jury fédéral de Miami déclare Arcangel Pretel Ortiz, Antonio Intriago, Walter Veintemilla et James Solages coupables d'infractions liées au complot entourant l'assassinat de Jovenel Moïse en 2021. Le département américain de la Justice mentionne notamment des infractions de complot et de soutien matériel. Un verdict dans une juridiction ne règle pas automatiquement le sort d'autres suspects ou de procédures en Haïti. Cette décision constitue un développement important de l'enquête, sans répondre à toutes les questions sur la préparation et le financement du crime.",
    "sources": [
      [
        "US Department of Justice",
        "https://www.justice.gov/usao-sdfl/pr/four-defendants-convicted-plot-kill-haitian-president-jovenel-moise"
      ]
    ]
  },
  {
    "slug": "research-2026-06-haiti-returns-to-the-men-s-fifa",
    "date": "2026-06-13",
    "dimension": "abroad",
    "categories": [
      "sports",
      "abroad"
    ],
    "location": "Boston, United States",
    "title": "Haiti returns to the men's FIFA World Cup against Scotland",
    "ft": "Haïti retrouve la Coupe du monde masculine contre l'Écosse",
    "summary": "Haiti plays its first World Cup match since 1974 and loses 1–0 to Scotland.",
    "fs": "Haïti dispute son premier match mondial depuis 1974 et s'incline 1-0 contre l'Écosse.",
    "body": "On 13 June 2026, the Haitian men's national football team returned to the FIFA World Cup after a 52-year absence, playing Scotland at Boston Stadium. Scotland won the Group C match 1–0. Qualification had been secured in November 2025, despite the national team's inability to host its qualifying home matches in Haiti. The opening match became a moment of global recognition and a source of interest among Haitian communities in the diaspora. The result should be recorded without confusing the qualification campaign of the preceding year with the 2026 tournament itself. FIFA match records provide the date, location and final score.",
    "fb": "Le 13 juin 2026, l'équipe masculine d'Haïti retrouve la Coupe du monde après 52 ans d'absence en affrontant l'Écosse à Boston. La rencontre du groupe C se termine par une défaite 1-0. La qualification avait été obtenue en novembre 2025, malgré l'impossibilité de disputer des matchs à domicile en Haïti. Ce retour bénéficie d'une visibilité mondiale et suscite l'intérêt des supporters de la diaspora. Il convient de distinguer la campagne qualificative du tournoi de 2026 et de conserver les résultats officiels de la FIFA.",
    "sources": [
      [
        "FIFA",
        "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums"
      ]
    ]
  },
  {
    "slug": "research-2026-07-un-secretary-general-visits-hait",
    "date": "2026-06-16",
    "dimension": "foreign",
    "categories": [
      "world",
      "society",
      "politics"
    ],
    "location": "Port-au-Prince, Haiti",
    "title": "UN Secretary-General visits Haiti and warns of deepening humanitarian crisis",
    "ft": "Le Secrétaire général de l'ONU visite Haïti et alerte sur la crise humanitaire",
    "summary": "A UN assessment highlights mass displacement, severe hunger and the protection of children.",
    "fs": "Une évaluation souligne les déplacements massifs, la faim et la protection des enfants.",
    "body": "During a June 2026 visit to Haiti, UN Secretary-General António Guterres described the humanitarian crisis as one of the most severe in the region. On 16 June he stated that 6.4 million Haitians needed assistance and nearly 1.5 million were displaced by violence. He raised concerns about hunger, sexual violence and children recruited by armed groups, while praising local humanitarian workers and calling for financing and civilian protection. These numbers were a dated assessment rather than a forecast of how the entire year would end. The visit illustrates both international attention to the crisis and the central role of Haitian organizations working to support affected families.",
    "fb": "Lors d'une visite en Haïti en juin 2026, le Secrétaire général des Nations unies António Guterres décrit une crise humanitaire parmi les plus graves de la région. Le 16 juin, il affirme que 6,4 millions de personnes ont besoin d'aide et que près de 1,5 million sont déplacées par la violence. Il évoque la faim, les violences sexuelles et le recrutement d'enfants par des groupes armés, tout en saluant les travailleurs humanitaires haïtiens. Ces chiffres constituent un bilan daté et non la conclusion de l'année.",
    "sources": [
      [
        "United Nations / official documentation",
        "https://www.un.org/sg/en/content/sg/press-events/2026-06-16/secretary-generals-press-encounter-haiti"
      ]
    ]
  },
  {
    "slug": "research-2026-08-brazil-defeats-haiti-in-the-seco",
    "date": "2026-06-19",
    "dimension": "abroad",
    "categories": [
      "sports",
      "abroad"
    ],
    "location": "Philadelphia, United States",
    "title": "Brazil defeats Haiti in the second World Cup group match",
    "ft": "Le Brésil bat Haïti lors de son deuxième match de groupe",
    "summary": "Haiti loses 3–0 to Brazil at the 2026 FIFA World Cup.",
    "fs": "Haïti s'incline 3-0 contre le Brésil à la Coupe du monde 2026.",
    "body": "On 19 June 2026, Haiti met Brazil in Group C at the FIFA World Cup in Philadelphia and lost 3–0. The match was part of Haiti's first appearance at the men's tournament since 1974. The encounter placed the national team against one of international football's most storied sides while Haitian supporters followed the competition from communities across the world. The match's final result and date are recorded by FIFA. This was the team's second group game and should be distinguished from the opening contest against Scotland on 13 June and the final group match against Morocco on 24 June.",
    "fb": "Le 19 juin 2026, Haïti affronte le Brésil dans le groupe C de la Coupe du monde, à Philadelphie, et s'incline 3-0. La rencontre s'inscrit dans la première participation masculine du pays depuis 1974. Elle oppose les Grenadiers à l'une des équipes les plus connues du football international et mobilise les supporters haïtiens dans le monde. Le résultat et la date sont confirmés par la FIFA. Il s'agit du deuxième match de groupe, après l'Écosse et avant le Maroc.",
    "sources": [
      [
        "FIFA",
        "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums"
      ]
    ]
  },
  {
    "slug": "research-2026-09-haiti-scores-twice-against-moroc",
    "date": "2026-06-24",
    "dimension": "abroad",
    "categories": [
      "sports",
      "abroad"
    ],
    "location": "Atlanta, United States",
    "title": "Haiti scores twice against Morocco in its final World Cup group match",
    "ft": "Haïti marque deux buts contre le Maroc lors de son dernier match de groupe",
    "summary": "Morocco wins 4–2 and Haiti concludes its 2026 World Cup campaign.",
    "fs": "Le Maroc gagne 4-2 et Haïti termine son parcours à la Coupe du monde 2026.",
    "body": "On 24 June 2026, Haiti played Morocco in Atlanta in its third and final Group C match at the men's FIFA World Cup. Morocco won 4–2, bringing Haiti's campaign to an end after defeats against Scotland and Brazil. Haiti's two goals and the return to the tournament after 52 years became part of the national football record. The team's performance should be assessed in the context of the competition, the qualification campaign and the difficulties of organizing football under severe insecurity at home. Neither a group-stage defeat nor the final score erases the significance of reaching the tournament. FIFA's official competition schedule provides a dependable match record.",
    "fb": "Le 24 juin 2026, Haïti dispute contre le Maroc à Atlanta son troisième et dernier match du groupe C de la Coupe du monde masculine. Le Maroc s'impose 4-2, ce qui met fin au parcours haïtien après les défaites contre l'Écosse et le Brésil. Les deux buts marqués contre le Maroc et le retour à la compétition après 52 ans font partie de l'histoire sportive nationale. La performance doit être replacée dans le contexte de la qualification et des difficultés de préparation liées à l'insécurité en Haïti.",
    "sources": [
      [
        "FIFA",
        "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums"
      ]
    ]
  },
  {
    "slug": "research-2026-10-security-council-renews-haiti-sa",
    "date": "2026-10-14",
    "dimension": "abroad",
    "categories": [
      "world",
      "politics"
    ],
    "location": "United Nations, New York",
    "title": "Security Council renews Haiti sanctions and arms embargo",
    "ft": "Le Conseil de sécurité renouvelle les sanctions et l'embargo sur les armes concernant Haïti",
    "summary": "Resolution 2831 renews the sanctions regime and expert monitoring.",
    "fs": "La résolution 2831 prolonge le régime de sanctions et le suivi des experts.",
    "body": "On 14 October 2026, the UN Security Council adopted resolution 2831, renewing the travel-ban, asset-freeze and arms-embargo measures associated with Haiti's 2653 sanctions regime. The Council also extended the mandate of the Panel of Experts, which investigates networks linked to armed violence and monitors enforcement. The vote was 14 in favor, none against and one abstention. Renewal was a legal action separate from the September extension of the Gang Suppression Force; neither measure alone demonstrated that arms trafficking had ceased. The resolution also called for benchmarks and reporting by Haitian authorities concerning sanctions implementation and security developments.",
    "fb": "Le 14 octobre 2026, le Conseil de sécurité adopte la résolution 2831, qui prolonge les interdictions de voyager, gels d'avoirs et mesures d'embargo sur les armes concernant Haïti. Il étend aussi le mandat du Groupe d'experts chargé d'enquêter sur les réseaux liés à la violence et sur l'application des sanctions. Le vote réunit 14 voix pour et une abstention. Cette décision juridique est distincte de la prolongation de la Force de répression des gangs en septembre et ne prouve pas que le trafic d'armes ait cessé.",
    "sources": [
      [
        "United Nations / official documentation",
        "https://main.un.org/securitycouncil/en/content/sres28312026"
      ]
    ]
  },
  {
    "slug": "research-2026-11-el-salvador-s-troop-deployment-r",
    "date": "2026-10-29",
    "dimension": "foreign",
    "categories": [
      "politics",
      "world",
      "society"
    ],
    "location": "Port-au-Prince",
    "title": "El Salvador's troop deployment raises new questions about international security operations",
    "ft": "Le déploiement de troupes salvadoriennes suscite des questions sur les opérations de sécurité",
    "summary": "More than 2,000 Salvadoran troops deploy amid a search for missing personnel and wider anti-gang cooperation.",
    "fs": "Plus de 2 000 militaires salvadoriens arrivent pendant la recherche de personnels disparus et la coopération sécuritaire.",
    "body": "By 29 October 2026, El Salvador had deployed more than 2,000 military personnel to Haiti in connection with efforts to recover four missing Salvadoran aviation technicians and support security operations. The technicians had disappeared following an attack near Port-au-Prince. Salvadoran and Haitian authorities made statements about cooperation, but public information left questions about the soldiers' mandate, command structure, relationship to the UN-authorized Gang Suppression Force and protections for civilians. International reporting described the deployment as taking place during continuing insecurity and a new postponement of Haiti's elections. Claims about the operation's final outcome should not be inferred from the announcement or arrival of personnel.",
    "fb": "À la fin d'octobre 2026, plus de 2 000 militaires salvadoriens arrivent en Haïti dans le cadre de recherches visant quatre techniciens aéronautiques disparus et d'une coopération sécuritaire élargie. Les autorités haïtiennes et salvadoriennes évoquent leur collaboration, mais des questions demeurent sur le mandat, la chaîne de commandement, les relations avec la Force de répression des gangs et la protection des civils. Le déploiement intervient au moment d'un nouveau report des élections. La présence de soldats ne prouve pas à elle seule le succès de l'opération.",
    "sources": [
      [
        "Associated Press",
        "https://apnews.com/article/3c24fe0b0134ea2b41b48fc80457215d"
      ]
    ]
  },
  {
    "slug": "research-2026-12-un-october-report-records-displa",
    "date": "2026-10-12",
    "dimension": "inside",
    "categories": [
      "economy",
      "society",
      "education"
    ],
    "location": "Haiti",
    "title": "UN October report records displacement and severe electoral constraints",
    "ft": "Le rapport de l'ONU d'octobre décrit les déplacements et les obstacles électoraux",
    "summary": "The report measures violence, displacement and the funding shortfall in Haiti's humanitarian response.",
    "fs": "Le rapport évalue les violences, les déplacements et le manque de financement de l'aide.",
    "body": "A report dated 12 October 2026 by the UN Secretary-General described the continuing expansion of armed violence, preparations for elections and a major humanitarian emergency. It estimated about 1.49 million people internally displaced as of August and recorded 1,123 people killed in gang-related violence between 1 July and 1 October. The report also noted that humanitarian funding covered less than half of the annual plan at that time. These statistics describe specific monitoring periods, not a full-year casualty count or a prediction of subsequent developments. The electoral schedule mentioned in the report was overtaken by a new announcement on 29 October; chronology requires keeping those distinct.",
    "fb": "Un rapport du Secrétaire général daté du 12 octobre 2026 décrit la poursuite des violences armées et la crise humanitaire. Il estime à environ 1,49 million le nombre de déplacés en août et recense 1 123 morts dans des violences liées aux gangs entre le 1er juillet et le 1er octobre. Moins de la moitié du plan humanitaire est alors financée. Ces données concernent des périodes d'observation précises. Le calendrier électoral cité dans le document est ensuite remplacé par une annonce du 29 octobre, qui doit être distinguée de cet état des lieux.",
    "sources": [
      [
        "United Nations / official documentation",
        "https://www.haitidocs.org/doc/binuh-sg-reports-2026-10"
      ]
    ]
  }
];
export const research2026:HistEvent[]=entries.map(e=>({slug:e.slug,date:e.date,precision:(e.date.length===10?"day":e.date.length===7?"month":"year") as DatePrecision,dimension:e.dimension,categories:e.categories,location:e.location,title:e.title,summary:e.summary,body:e.body,fr:{title:e.ft,summary:e.fs,body:e.fb},sources:e.sources.map(([title,url])=>({title,url})),status:"documented",editorial:{verification:"corroborated",dateBasis:"historical event or report as known by 1 Nov 2026",reviewedOn:"2026-11-01"}}));
