import type { HistEvent, DatePrecision, Dimension } from "./types";
/** Documented additions for 2022 through 1 November 2026. */
type Entry = { slug:string; date:string; dimension:Dimension; categories:string[]; location:string; title:string; ft:string; summary:string; fs:string; body:string; fb:string; sources:[string,string][] };
const entries: Entry[] = [
  {
    "slug": "haiti-2022-cite-soleil-gang-violence",
    "date": "2022-07",
    "dimension": "inside",
    "categories": [
      "society",
      "politics"
    ],
    "location": "Cité Soleil, Port-au-Prince",
    "title": "Deadly clashes in Cité Soleil displace residents",
    "ft": "Des affrontements meurtriers à Cité Soleil déplacent les habitants",
    "summary": "Armed-group fighting kills civilians, forces families to flee and blocks access to food and water.",
    "fs": "Des affrontements entre groupes armés tuent des civils, déplacent des familles et entravent l'accès à la nourriture et à l'eau.",
    "body": "In July 2022, clashes between rival armed groups in Cité Soleil, Port-au-Prince, caused widespread civilian casualties and displacement. Residents were trapped by gunfire, and humanitarian organizations struggled to reach communities with food, drinking water and medical services. The United Nations documented killings, sexual violence and the effects of restricted movement. The violence took place within a larger struggle over territorial control and transport routes. Estimates of casualties varied with the period and methodology used, so a single figure should not be presented as the definitive total for the entire year.",
    "fb": "En juillet 2022, des affrontements entre groupes armés rivaux à Cité Soleil provoquent des victimes civiles et des déplacements. Des habitants sont piégés par les tirs et les organisations humanitaires peinent à distribuer de l'eau, des aliments et des soins. Les Nations unies documentent les meurtres, les violences sexuelles et les restrictions de circulation. Cette violence s'inscrit dans la lutte pour le contrôle des territoires et des axes de transport. Les bilans varient selon les périodes et les méthodes de décompte.",
    "sources": [
      [
        "Human Rights Watch, World Report 2023: Haiti",
        "https://www.hrw.org/world-report/2023/country-chapters/haiti"
      ]
    ]
  },
  {
    "slug": "haiti-2022-cholera-resurgence-october",
    "date": "2022-10-02",
    "dimension": "inside",
    "categories": [
      "education",
      "society"
    ],
    "location": "Port-au-Prince, Haiti",
    "title": "Cholera returns after more than three years without reported cases",
    "ft": "Le choléra réapparaît après plus de trois ans sans cas signalés",
    "summary": "Health authorities report new cholera cases amid insecurity and disruptions to water and sanitation.",
    "fs": "Les autorités sanitaires signalent de nouveaux cas de choléra dans un contexte d'insécurité et de difficultés d'accès à l'eau.",
    "body": "On 2 October 2022, Haiti reported the resurgence of cholera after more than three years without a reported case. The outbreak spread amid disrupted water and sanitation systems, displacement, limited healthcare access and the fuel crisis. WHO reported 13,672 suspected cases and 283 deaths between 2 October and 6 December, using the Ministry of Health's data available at that time. These figures are an early outbreak snapshot, not a total for the epidemic. The return of cholera showed how fragile access to clean water and medical care remained after years of crises.",
    "fb": "Le 2 octobre 2022, Haïti signale la réapparition du choléra après plus de trois ans sans cas déclaré. L'épidémie se propage dans un contexte de manque d'eau potable, de déplacements, d'accès limité aux soins et de crise du carburant. Selon l'OMS, 13 672 cas suspects et 283 décès sont recensés entre le 2 octobre et le 6 décembre. Ce bilan constitue une photographie provisoire de l'épidémie, et non son total définitif. Le retour du choléra révèle la fragilité des réseaux d'eau et des services de santé.",
    "sources": [
      [
        "WHO, Disease Outbreak News, 13 December 2022",
        "https://www.who.int/emergencies/disease-outbreak-news/item/2022-DON427"
      ]
    ]
  },
  {
    "slug": "haiti-2022-un-sanctions-resolution-2653",
    "date": "2022-10-21",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "United Nations Security Council, New York",
    "title": "UN Security Council establishes a sanctions regime for Haiti",
    "ft": "Le Conseil de sécurité de l'ONU établit un régime de sanctions concernant Haïti",
    "summary": "Resolution 2653 creates targeted measures against people and entities linked to violence and destabilization.",
    "fs": "La résolution 2653 crée des mesures ciblées contre les personnes et entités liées à la violence et à la déstabilisation.",
    "body": "On 21 October 2022, the United Nations Security Council adopted resolution 2653, creating a sanctions regime for Haiti. The measures included an asset freeze, travel ban and targeted arms embargo against designated individuals and entities threatening peace and stability. The resolution responded to gang violence, human-rights abuses and the blockade of fuel supplies. A sanctions framework does not itself establish criminal guilt or guarantee effective enforcement; individual designations and later changes must be documented separately. The resolution was a significant shift in international policy toward actors linked to Haiti's security crisis.",
    "fb": "Le 21 octobre 2022, le Conseil de sécurité adopte la résolution 2653, établissant un régime de sanctions pour Haïti. Les mesures comprennent le gel des avoirs, l'interdiction de voyager et un embargo ciblé sur les armes pour des personnes et entités désignées. La décision répond aux violences, aux atteintes aux droits humains et au blocus du carburant. La création du régime ne constitue pas à elle seule une condamnation pénale et ne garantit pas son application. Les désignations individuelles doivent être étudiées séparément.",
    "sources": [
      [
        "UN Security Council, Resolution 2653 (2022)",
        "https://digitallibrary.un.org/record/3990820"
      ]
    ]
  },
  {
    "slug": "haiti-2023-last-senators-terms-expire",
    "date": "2023-01-09",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince, Haiti",
    "title": "Haiti's last elected senators leave office",
    "ft": "Les mandats des derniers sénateurs élus prennent fin",
    "summary": "The end of the remaining Senate mandates leaves Haiti without nationally elected officeholders.",
    "fs": "La fin des derniers mandats sénatoriaux laisse Haïti sans responsables élus au niveau national.",
    "body": "On 9 January 2023, the terms of Haiti's remaining elected senators expired. With the Chamber of Deputies already inactive and the presidency vacant since Jovenel Moïse's assassination, the country was left without nationally elected officials. The development followed repeated failures to hold elections and prolonged disputes over the legitimacy of transitional arrangements. Executive authority remained with the unelected government headed by Ariel Henry. This institutional vacuum affected the oversight of laws, budgets and public appointments. The end of the senators' terms was a constitutional and political milestone, separate from the worsening security situation.",
    "fb": "Le 9 janvier 2023, les mandats des derniers sénateurs élus arrivent à leur terme. La Chambre des députés ne fonctionnant plus et la présidence étant vacante depuis l'assassinat de Jovenel Moïse, le pays se retrouve sans responsables élus au niveau national. Cette situation résulte de reports répétés des élections et de conflits sur la transition. L'exécutif demeure dirigé par le gouvernement non élu d'Ariel Henry. Le vide institutionnel affecte le contrôle des lois, des budgets et des nominations.",
    "sources": [
      [
        "Human Rights Watch, World Report 2024: Haiti",
        "https://www.hrw.org/world-report/2024/country-chapters/haiti"
      ]
    ]
  },
  {
    "slug": "haiti-2023-bwa-kale-movement",
    "date": "2023-04",
    "dimension": "inside",
    "categories": [
      "society",
      "politics"
    ],
    "location": "Port-au-Prince and other communities, Haiti",
    "title": "Bwa Kale vigilante movement emerges amid gang violence",
    "ft": "Le mouvement d'autodéfense Bwa Kale apparaît face à la violence des gangs",
    "summary": "Residents mobilize against suspected gang members, raising concerns about vigilante violence and due process.",
    "fs": "Des habitants se mobilisent contre des personnes soupçonnées d'appartenir aux gangs, soulevant des inquiétudes sur la justice populaire.",
    "body": "In April 2023, residents in Port-au-Prince and other communities began organizing collective action against suspected gang members in what became known as Bwa Kale. The movement reflected widespread frustration with the inability of state security institutions to protect civilians. Some participants detained or killed suspected members of armed groups without judicial proceedings, prompting concerns about vigilantism, mistaken identity and retaliatory violence. The movement cannot be reduced to a single national organization or treated as a lawful substitute for police and courts. Its rise is essential to understanding the relationship between insecurity, community self-defense and the erosion of institutional justice.",
    "fb": "En avril 2023, des habitants de Port-au-Prince et d'autres communautés organisent des actions contre des personnes soupçonnées d'appartenir aux groupes armés, sous le nom de Bwa Kale. Le mouvement exprime l'exaspération devant l'incapacité des institutions à protéger la population. Certains participants arrêtent ou tuent des suspects sans procédure judiciaire, soulevant des questions sur la justice populaire, les erreurs d'identification et les représailles. Il ne s'agit pas d'une organisation nationale unique ni d'un remplacement légal de la police et de la justice.",
    "sources": [
      [
        "Human Rights Watch, World Report 2024: Haiti",
        "https://www.hrw.org/world-report/2024/country-chapters/haiti"
      ]
    ]
  },
  {
    "slug": "haiti-women-first-world-cup-2023",
    "date": "2023-02-22",
    "dimension": "abroad",
    "categories": [
      "sports",
      "abroad"
    ],
    "location": "Auckland, New Zealand",
    "title": "Haiti qualifies for its first FIFA Women's World Cup",
    "ft": "Haïti se qualifie pour sa première Coupe du monde féminine de la FIFA",
    "summary": "The women's national team defeats Chile in an intercontinental playoff to reach the 2023 tournament.",
    "fs": "L'équipe féminine bat le Chili en barrage intercontinental et se qualifie pour le tournoi de 2023.",
    "body": "On 22 February 2023, Haiti's women's national football team defeated Chile 2–1 in Auckland, New Zealand, qualifying for the FIFA Women's World Cup for the first time. Melchie Dumornay scored both Haitian goals. The achievement brought international attention to a generation of Haitian players and to the development of women's football despite limited resources and the national crisis. Haiti went on to play in the World Cup group stage in July and August in Australia and New Zealand. Qualification is distinct from advancing beyond the group stage, which the team did not achieve. The event belongs to both Haitian sporting history and the wider history of women in international football.",
    "fb": "Le 22 février 2023, l'équipe féminine haïtienne de football bat le Chili 2–1 à Auckland, en Nouvelle-Zélande, et se qualifie pour la première fois à la Coupe du monde de la FIFA. Melchie Dumornay marque les deux buts haïtiens. Cet exploit donne une visibilité internationale à une génération de joueuses malgré des ressources limitées et la crise nationale. Haïti participe ensuite à la phase de groupes du tournoi en juillet et août en Australie et en Nouvelle-Zélande. La qualification doit être distinguée d'un passage au tour suivant, que l'équipe n'obtient pas.",
    "sources": [
      [
        "FIFA, Haiti qualify for the Women's World Cup 2023",
        "https://www.fifa.com/en/tournaments/womens/womensworldcup/australia-new-zealand2023"
      ]
    ]
  },
  {
    "slug": "haiti-2023-un-mss-resolution-2699",
    "date": "2023-10-02",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "United Nations Security Council, New York",
    "title": "Security Council authorizes a Kenya-led multinational security mission",
    "ft": "Le Conseil de sécurité autorise une mission multinationale dirigée par le Kenya",
    "summary": "Resolution 2699 authorizes a non-UN security support mission to assist Haitian police.",
    "fs": "La résolution 2699 autorise une mission de soutien sécuritaire extérieure à l'ONU pour aider la police haïtienne.",
    "body": "On 2 October 2023, the UN Security Council adopted resolution 2699, authorizing a Multinational Security Support mission to assist the Haitian National Police in addressing gang violence. Kenya agreed to lead the non-UN mission, subject to legal, logistical and financing arrangements. Authorization was a major diplomatic step but did not mean personnel deployed immediately. The first Kenyan contingent arrived in June 2024. The distinction between mandate, funding, deployment and operational results is central to assessing international security assistance and accountability to Haitian civilians.",
    "fb": "Le 2 octobre 2023, le Conseil de sécurité adopte la résolution 2699 autorisant une Mission multinationale d'appui à la sécurité pour soutenir la Police nationale d'Haïti contre les groupes armés. Le Kenya accepte d'en assurer la direction, sous réserve de dispositions juridiques, logistiques et financières. L'autorisation ne correspond pas à un déploiement immédiat : les premiers policiers kényans arrivent en juin 2024. Il faut distinguer le mandat, les financements, l'arrivée des effectifs et les résultats opérationnels.",
    "sources": [
      [
        "UN Support Office in Haiti, background and history of MSS",
        "https://unsoh.unmissions.org/en/unsoh/background"
      ]
    ]
  },
  {
    "slug": "haiti-2024-prison-breaks-gang-offensive",
    "date": "2024-03-02",
    "dimension": "inside",
    "categories": [
      "politics",
      "society"
    ],
    "location": "Port-au-Prince, Haiti",
    "title": "Coordinated gang offensive targets prisons and public infrastructure",
    "ft": "Une offensive coordonnée de groupes armés vise les prisons et les infrastructures publiques",
    "summary": "Armed groups attack prisons and key institutions as the political crisis escalates.",
    "fs": "Des groupes armés attaquent les prisons et des institutions essentielles alors que la crise politique s'aggrave.",
    "body": "Beginning in late February and escalating on 2 March 2024, armed groups launched coordinated attacks on police facilities, prisons and transport infrastructure in Port-au-Prince. Thousands of prisoners escaped or were released from major detention facilities. The violence interrupted flights and essential services, forced residents from their homes and intensified demands for the resignation of Prime Minister Ariel Henry, who was abroad. The attacks showed how armed coalitions could challenge institutions at the center of the state. The exact number of escaped detainees and casualties changed across reports and must be attributed to dated sources. The political transition that followed was negotiated amid these extraordinary security conditions.",
    "fb": "À partir de la fin février, et particulièrement le 2 mars 2024, des groupes armés lancent des attaques coordonnées contre des commissariats, des prisons et des infrastructures de transport à Port-au-Prince. Des milliers de détenus s'évadent ou sont libérés de grands établissements pénitentiaires. Les violences interrompent les vols et les services essentiels, déplacent des habitants et renforcent les demandes de départ du Premier ministre Ariel Henry, alors à l'étranger. Les bilans des évasions et des victimes varient selon les rapports. La transition politique suivante se négocie dans ce contexte de crise sécuritaire.",
    "sources": [
      [
        "Human Rights Watch, World Report 2025: Haiti",
        "https://www.hrw.org/world-report/2025/country-chapters/haiti"
      ]
    ]
  },
  {
    "slug": "haiti-2024-transitional-presidential-council-installed",
    "date": "2024-04-25",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince, Haiti",
    "title": "Transitional Presidential Council takes office",
    "ft": "Le Conseil présidentiel de transition entre en fonction",
    "summary": "A new transitional governing arrangement replaces Ariel Henry's outgoing administration.",
    "fs": "Une nouvelle structure de gouvernance provisoire succède à l'administration sortante d'Ariel Henry.",
    "body": "On 25 April 2024, members of Haiti's Transitional Presidential Council were sworn in after negotiations involving Haitian political and civic groups and regional diplomacy facilitated by CARICOM. The ceremony marked the formal end of Ariel Henry's tenure and the beginning of a new transitional governing arrangement. The council was tasked with supporting a path toward security, elections and the restoration of constitutional institutions. Its creation did not immediately resolve disagreements among participating groups or restore an elected government. The council's later decisions, appointments and disputes require their own chronological records.",
    "fb": "Le 25 avril 2024, les membres du Conseil présidentiel de transition prêtent serment après des négociations entre acteurs politiques et civiques haïtiens et une médiation régionale facilitée par la CARICOM. La cérémonie marque la fin du mandat d'Ariel Henry et l'entrée en fonction d'une nouvelle structure provisoire. Le Conseil doit préparer la sécurité, les élections et le rétablissement des institutions constitutionnelles. Sa création ne règle pas immédiatement les différends ni ne rétablit un gouvernement élu. Les décisions et conflits ultérieurs doivent être documentés séparément.",
    "sources": [
      [
        "Human Rights Watch, World Report 2025: Haiti",
        "https://www.hrw.org/world-report/2025/country-chapters/haiti"
      ]
    ]
  },
  {
    "slug": "haiti-2024-kenyan-police-first-arrival",
    "date": "2024-06-25",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "Port-au-Prince, Haiti",
    "title": "First Kenyan police contingent arrives for the multinational mission",
    "ft": "Le premier contingent de policiers kényans arrive pour la mission multinationale",
    "summary": "The first deployment begins eight months after UN authorization of the mission.",
    "fs": "Le premier déploiement commence huit mois après l'autorisation de la mission par l'ONU.",
    "body": "On 25 June 2024, the first Kenyan police contingent arrived in Haiti for the Multinational Security Support mission, which the UN Security Council had authorized in October 2023. The mission was designed to assist Haitian police in responding to gang violence and protecting critical infrastructure. It was not a UN peacekeeping force and relied on voluntary funding and contributions from participating countries. Subsequent assessments found serious gaps in staffing, equipment and resources. The arrival of personnel marked the beginning of deployment, not the restoration of public security or the achievement of the mission's planned strength.",
    "fb": "Le 25 juin 2024, le premier contingent de policiers kényans arrive en Haïti pour la Mission multinationale d'appui à la sécurité, autorisée par le Conseil de sécurité en octobre 2023. La mission vise à soutenir la police haïtienne face aux groupes armés et à protéger les infrastructures essentielles. Il ne s'agit pas d'une opération de maintien de la paix de l'ONU et elle dépend de contributions volontaires. Les évaluations ultérieures révèlent d'importantes insuffisances d'effectifs, d'équipement et de financement. L'arrivée du contingent ne signifie pas le rétablissement de la sécurité.",
    "sources": [
      [
        "UN Support Office in Haiti, MSS deployment chronology",
        "https://unsoh.unmissions.org/en/unsoh/background"
      ]
    ]
  },
  {
    "slug": "haiti-2025-constitutional-review-cancelled",
    "date": "2025-10",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince, Haiti",
    "title": "Transitional authorities abandon the constitutional review project",
    "ft": "Les autorités de transition abandonnent le projet de révision constitutionnelle",
    "summary": "A proposed constitutional reform is cancelled after months of debate and insecurity.",
    "fs": "Un projet de réforme constitutionnelle est abandonné après des mois de débats et d'insécurité.",
    "body": "During 2025, Haiti's transitional authorities explored a draft constitution and a possible referendum as part of their proposed political transition. The initiative drew debate about legitimacy, public participation and the feasibility of a national vote during widespread violence and displacement. In October, the Transitional Presidential Council cancelled the constitutional review project. The decision illustrates how institutional reform plans can falter when the conditions for consultation and elections are absent. The abandonment of this specific project should not be confused with the end of every discussion about constitutional change.",
    "fb": "En 2025, les autorités de transition examinent un projet de nouvelle constitution et un éventuel référendum. L'initiative suscite des débats sur la légitimité, la participation publique et la possibilité d'organiser un vote alors que la violence et les déplacements se multiplient. En octobre, le Conseil présidentiel de transition annule le projet de révision constitutionnelle. Cette décision montre les difficultés d'une réforme institutionnelle sans conditions de consultation et de sécurité. Elle ne signifie pas la fin de tous les débats constitutionnels.",
    "sources": [
      [
        "Human Rights Watch, World Report 2026: Haiti",
        "https://www.hrw.org/world-report/2026/country-chapters/haiti"
      ]
    ]
  },
  {
    "slug": "haiti-2025-un-gang-suppression-force-resolution",
    "date": "2025-09-30",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "United Nations Security Council, New York",
    "title": "UN authorizes Gang Suppression Force to replace the MSS mission",
    "ft": "L'ONU autorise une Force de répression des gangs pour remplacer la mission multinationale",
    "summary": "Resolution 2793 establishes a new international security framework and UN support office.",
    "fs": "La résolution 2793 établit un nouveau cadre sécuritaire international et un bureau de soutien de l'ONU.",
    "body": "On 30 September 2025, the UN Security Council adopted resolution 2793, authorizing the transformation of the under-resourced Multinational Security Support mission into a Gang Suppression Force and establishing a UN Support Office in Haiti. The new force was authorized for up to 5,500 personnel and given a more robust mandate. The UN support office was created to provide logistical and operational assistance. The decision reflected dissatisfaction with the slow deployment and limited capacity of the previous mission. Authorization did not mean the full force was immediately deployed; its operational strength and civilian-protection performance require continuing assessment.",
    "fb": "Le 30 septembre 2025, le Conseil de sécurité adopte la résolution 2793, autorisant la transformation de la Mission multinationale d'appui à la sécurité en Force de répression des gangs et créant un Bureau d'appui de l'ONU en Haïti. La nouvelle force peut atteindre 5 500 membres et reçoit un mandat renforcé. Le bureau fournit une aide logistique et opérationnelle. Cette décision reflète les limites de la mission précédente, mais ne signifie pas que tous les effectifs sont immédiatement déployés. Les résultats et la protection des civils doivent être évalués dans le temps.",
    "sources": [
      [
        "UN Support Office in Haiti, GSF establishment and mandate",
        "https://unsoh.unmissions.org/en/unsoh/background"
      ]
    ]
  },
  {
    "slug": "haiti-2026-cpt-mandate-ends",
    "date": "2026-02-07",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince, Haiti",
    "title": "Transitional Presidential Council's mandate ends",
    "ft": "Le mandat du Conseil présidentiel de transition prend fin",
    "summary": "The council's mandate expires as the country remains without elected national leadership.",
    "fs": "Le mandat du Conseil prend fin alors que le pays reste sans dirigeants nationaux élus.",
    "body": "On 7 February 2026, the mandate of Haiti's Transitional Presidential Council ended without a new elected national government in place. Executive authority passed to the Council of Ministers led by Prime Minister Alix Didier Fils-Aimé. The transition followed months of disputes over institutional legitimacy and a security crisis that prevented the electoral calendar from being implemented. The date is significant because it marks the end of a formal transitional mandate rather than the successful completion of its electoral goals. Subsequent negotiations and announcements must be assessed against actual changes in governance and security.",
    "fb": "Le 7 février 2026, le mandat du Conseil présidentiel de transition prend fin sans qu'un nouveau gouvernement national élu soit en place. L'autorité exécutive passe au Conseil des ministres dirigé par le Premier ministre Alix Didier Fils-Aimé. La transition suit des mois de conflits sur la légitimité des institutions et une crise sécuritaire qui empêche l'application du calendrier électoral. Cette date marque la fin d'un mandat provisoire et non la réalisation de ses objectifs électoraux. Les négociations ultérieures doivent être évaluées à partir des changements effectifs.",
    "sources": [
      [
        "UN, Haiti political transition and security background",
        "https://www.un.org/en/spotlight-on-haiti/background"
      ]
    ]
  },
  {
    "slug": "haiti-2026-gsf-mandate-extended-september",
    "date": "2026-09-29",
    "dimension": "foreign",
    "categories": [
      "world",
      "politics"
    ],
    "location": "United Nations Security Council, New York",
    "title": "Security Council extends Gang Suppression Force mandate into 2027",
    "ft": "Le Conseil de sécurité prolonge le mandat de la Force de répression des gangs jusqu'en 2027",
    "summary": "Resolution 2829 extends the mandate until 31 March 2027 amid continuing violence.",
    "fs": "La résolution 2829 prolonge le mandat jusqu'au 31 mars 2027 malgré la persistance des violences.",
    "body": "On 29 September 2026, the UN Security Council adopted resolution 2829, extending the mandate of the Gang Suppression Force for six months, until 31 March 2027. The Council also requested continued logistical and operational support from the UN Support Office in Haiti. The extension occurred as new contingents joined the force, including personnel deployed outside the capital. UN officials emphasized that Haitian authorities retained primary responsibility for civilian protection. The renewal was a legal and diplomatic decision, distinct from the actual strength, effectiveness or accountability of the operation. October reports continued to describe insecurity and concerns about the pace of deployment.",
    "fb": "Le 29 septembre 2026, le Conseil de sécurité adopte la résolution 2829, prolongeant de six mois le mandat de la Force de répression des gangs, jusqu'au 31 mars 2027. Il demande également la poursuite du soutien logistique et opérationnel du Bureau d'appui de l'ONU. Cette décision intervient alors que de nouveaux contingents rejoignent la force et que des opérations se déroulent hors de la capitale. Les responsables de l'ONU rappellent que la protection des civils relève d'abord des autorités haïtiennes. La prolongation du mandat ne garantit ni l'efficacité ni la responsabilité de la force.",
    "sources": [
      [
        "UN Support Office in Haiti, Security Council extends GSF mandate",
        "https://www.unmissions.org/en/unsoh/news/security-council-extends-gang-suppression-force-and-unsoh-mandates"
      ]
    ]
  },
  {
    "slug": "haiti-2026-october-election-calendar-postponed",
    "date": "2026-10-29",
    "dimension": "inside",
    "categories": [
      "politics"
    ],
    "location": "Port-au-Prince, Haiti",
    "title": "Haiti postpones planned 2026 elections to July and October 2027",
    "ft": "Haïti reporte les élections prévues en 2026 à juillet et octobre 2027",
    "summary": "The electoral council announces a first round for July 18, 2027, and a second round and local elections for October 4.",
    "fs": "Le conseil électoral annonce un premier tour le 18 juillet 2027 et un second tour avec les élections locales le 4 octobre.",
    "body": "On 29 October 2026, Haiti's Provisional Electoral Council announced another revision to its national election calendar. The first round of presidential and legislative elections was moved to 18 July 2027, with a second round and local elections planned for 4 October. The change followed concerns about armed violence, voter registration and the feasibility of holding a national vote under current conditions. Haiti had not held a national election since 2016. These are announced future dates, not elections already held or guaranteed to take place. The revised calendar must be revisited as conditions and official decisions change.",
    "fb": "Le 29 octobre 2026, le Conseil électoral provisoire annonce une nouvelle modification du calendrier national. Le premier tour des élections présidentielles et législatives est fixé au 18 juillet 2027, avec un second tour et des élections locales prévus le 4 octobre. Le report découle des inquiétudes sur la violence armée, l'inscription des électeurs et la faisabilité du scrutin. Haïti n'a pas organisé d'élection nationale depuis 2016. Ces dates sont des prévisions officielles, non des élections déjà réalisées ni garanties. Le calendrier devra être actualisé en fonction des décisions futures.",
    "sources": [
      [
        "Reuters, Haiti postpones election to July 2027, 29 October 2026",
        "https://www.reuters.com/world/americas/haiti-postpones-first-presidential-election-decade-july-2027-2026-10-29/"
      ]
    ]
  }
];
export const historical2022to2026: HistEvent[] = entries.map(e => ({
  slug:e.slug, title:e.title, date:e.date,
  precision:(/^\d{4}-\d{2}-\d{2}$/.test(e.date)?"day":"month") as DatePrecision,
  dimension:e.dimension, categories:e.categories, location:e.location,
  summary:e.summary, body:e.body, fr:{title:e.ft,summary:e.fs,body:e.fb},
  sources:e.sources.map(([title,url])=>({title,url})),
  status:"documented",
  editorial:{verification:"corroborated",dateBasis:e.date.length===10?"documented day":"documented month",reviewedOn:"2026-11-01",note:"Source-dated historical account; distinguish announced policies from completed implementation."}
}));
