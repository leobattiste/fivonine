import type { Locale, Category } from "./i18n";
export const platform = {
  en: {
    fundraise: "Fundraise",
    causes: "Fundraising categories",
    resources: "Fundraising resources",
    safety: "Safety center",
    pricing: "Pricing and fees",
    guide: "Read the guide",
    related: "More fundraisers to explore",
    organizer: "Meet the organizer",
    browse: "Browse this cause",
    start: "Start with your story",
    resourceIntro:
      "Practical guidance for sharing a need, reaching your community, and keeping supporters informed.",
    causeIntro:
      "Find a cause that matters to you, or share a need with your community.",
    safetyIntro:
      "Understand the organizer, the request, and the way your support will reach the beneficiary.",
    pricingIntro: "Free to share. Free to discover.",
    free: "No Fivonine listing fee",
    freeBody:
      "Creating a listing, browsing campaigns, and sharing fundraiser links are free. Fivonine takes no percentage of contributions.",
    external: "External service fees",
    externalBody:
      "A payment or transfer provider may charge its own fees, apply exchange rates, or set eligibility and withdrawal rules. Check its terms before contributing.",
    noPayments:
      "Support goes directly through the organizer’s instructions. Fivonine does not receive or process donations.",
    before: "Before you support",
    beforeItems: [
      "Read who organized the campaign and who benefits.",
      "Check who receives the money and how it reaches the beneficiary.",
      "Check the full website address before following a support link.",
      "Review fees, refund terms, and eligibility with the external service.",
    ],
    responsible: "A review is not a guarantee",
    responsibleBody:
      "A reviewed listing is not a guarantee of identity, need, use of funds, or outcome. Indicators on a campaign describe the checks actually completed. Fivonine does not provide donation protection or refunds for payments made elsewhere.",
    privacy: "Protect personal information",
    privacyBody:
      "Share only what the story needs. Keep identity documents, medical records, banking credentials, private addresses, and children’s identifying details off public pages. Get permission before posting another person’s story or photo.",
    problems: "Something does not look right?",
    problemsBody:
      "Use the report link on the campaign page for misleading information, impersonation, or privacy concerns. Contact the external payment service about a payment or refund.",
    faq: "Questions and answers",
    searchHelp: "Search help topics",
    noHelp: "No matching topics. Try another word or contact us.",
    learn: "Learn how fundraising works",
    supportMethods: "Ways to support",
    storyTab: "Story",
    updatesTab: "Updates",
    organizerTab: "Organizer",
    shareTitle: "Help this story reach your community",
    shareBody: "Share the campaign link with people who may want to help.",
    link: "Copy link",
    copied: "Link copied",
    copyFailed: "Could not copy. Copy the address from your browser.",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    recipient: "Beneficiary",
    checklist: "Before you publish",
    checklistItems: [
      "Use a title that describes the need.",
      "Explain your relationship to the beneficiary.",
      "State what support will cover and how it arrives.",
      "Use a photo you have permission to share.",
      "Check every support link before submitting.",
    ],
    next: "Your next steps",
    overview: "Overview",
    edit: "Edit and review",
    share: "Share your campaign",
    updates: "Keep supporters informed",
    reviewStatus: "Review status",
    tips: "Fundraising tips",
    seeAll: "See all categories",
    empty: "No published fundraisers in this category yet.",
    guideBack: "All fundraising resources",
  },
  fr: {
    fundraise: "Collecter",
    causes: "Catégories de collectes",
    resources: "Conseils de collecte",
    safety: "Centre de sécurité",
    pricing: "Tarifs et frais",
    guide: "Lire le guide",
    related: "D’autres collectes à découvrir",
    organizer: "Rencontrer l’organisateur",
    browse: "Explorer cette cause",
    start: "Commencez par votre histoire",
    resourceIntro:
      "Des conseils pour partager un besoin, rejoindre votre communauté et informer les personnes qui vous soutiennent.",
    causeIntro:
      "Trouvez une cause qui vous parle ou partagez un besoin avec votre communauté.",
    safetyIntro:
      "Comprenez qui organise la collecte, son objectif et comment votre soutien parviendra au bénéficiaire.",
    pricingIntro: "Partager et découvrir, gratuitement.",
    free: "Aucun frais de publication Fivonine",
    freeBody:
      "Créer une annonce, découvrir les collectes et partager leurs liens est gratuit. Fivonine ne prélève aucun pourcentage des contributions.",
    external: "Frais des services externes",
    externalBody:
      "Un prestataire de paiement ou de transfert peut appliquer des frais, un taux de change et des conditions de retrait ou d’éligibilité. Consultez ses conditions avant de contribuer.",
    noPayments:
      "Le soutien suit les instructions de l’organisateur. Fivonine ne reçoit et ne traite aucun don.",
    before: "Avant de contribuer",
    beforeItems: [
      "Lisez qui organise la collecte et qui en bénéficie.",
      "Vérifiez qui reçoit les fonds et comment ils arrivent au bénéficiaire.",
      "Vérifiez l’adresse complète du site avant de suivre un lien.",
      "Consultez les frais et conditions du service externe.",
    ],
    responsible: "Un examen n’est pas une garantie",
    responsibleBody:
      "Une annonce examinée ne garantit ni l’identité, ni le besoin, ni l’utilisation des fonds, ni le résultat. Les indicateurs décrivent les vérifications effectuées. Fivonine ne protège et ne rembourse pas les paiements externes.",
    privacy: "Protégez les informations personnelles",
    privacyBody:
      "Publiez uniquement ce qui est nécessaire. Ne partagez pas de pièces d’identité, dossiers médicaux, identifiants bancaires, adresses privées ou informations identifiant des enfants. Demandez l’accord pour les récits et photos.",
    problems: "Quelque chose vous inquiète ?",
    problemsBody:
      "Signalez une collecte depuis sa page pour des informations trompeuses, une usurpation ou un problème de confidentialité. Contactez le service de paiement pour un paiement ou un remboursement.",
    faq: "Questions et réponses",
    searchHelp: "Rechercher une aide",
    noHelp: "Aucun sujet trouvé. Essayez un autre mot ou contactez-nous.",
    learn: "Comprendre le fonctionnement",
    supportMethods: "Comment contribuer",
    storyTab: "Histoire",
    updatesTab: "Actualités",
    organizerTab: "Organisateur",
    shareTitle: "Aidez cette histoire à rejoindre votre communauté",
    shareBody: "Partagez le lien avec des personnes qui souhaitent aider.",
    link: "Copier le lien",
    copied: "Lien copié",
    copyFailed: "Copie impossible. Copiez l’adresse dans votre navigateur.",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    recipient: "Bénéficiaire",
    checklist: "Avant de publier",
    checklistItems: [
      "Choisissez un titre qui décrit le besoin.",
      "Expliquez votre lien avec le bénéficiaire.",
      "Précisez l’usage et l’acheminement du soutien.",
      "Utilisez une photo autorisée.",
      "Vérifiez chaque lien avant de soumettre.",
    ],
    next: "Vos prochaines étapes",
    overview: "Aperçu",
    edit: "Modifier et vérifier",
    share: "Partager votre collecte",
    updates: "Informer les soutiens",
    reviewStatus: "État de l’examen",
    tips: "Conseils de collecte",
    seeAll: "Toutes les catégories",
    empty: "Aucune collecte publiée dans cette catégorie.",
    guideBack: "Tous les conseils",
  },
  ht: {
    fundraise: "Ranmase sipò",
    causes: "Kategori kanpay yo",
    resources: "Gid pou kanpay",
    safety: "Sant sekirite",
    pricing: "Pri ak frè",
    guide: "Li gid la",
    related: "Lòt kanpay pou dekouvri",
    organizer: "Rankontre òganizatè a",
    browse: "Eksplore kòz sa a",
    start: "Kòmanse ak istwa w",
    resourceIntro:
      "Konsèy pou pataje yon bezwen, jwenn kominote w epi bay moun k ap sipòte w nouvèl.",
    causeIntro:
      "Jwenn yon kòz ki touche w oswa pataje yon bezwen ak kominote w.",
    safetyIntro:
      "Konprann kiyès ki òganize kanpay la, bezwen an ak fason sipò a ap rive jwenn benefisyè a.",
    pricingIntro: "Pataje gratis. Dekouvri gratis.",
    free: "Pa gen frè pou pibliye sou Fivonine",
    freeBody:
      "Kreye yon kanpay, dekouvri lòt kanpay ak pataje lyen yo gratis. Fivonine pa pran okenn pousantaj nan kontribisyon yo.",
    external: "Frè sèvis ekstèn yo",
    externalBody:
      "Yon sèvis peman oswa transfè ka gen frè, to chanj ak kondisyon pou kalifye oswa retire lajan. Li kondisyon sèvis la anvan w kontribye.",
    noPayments:
      "Sipò fèt dapre enstriksyon òganizatè a. Fivonine pa resevwa ni trete don.",
    before: "Anvan ou bay sipò",
    beforeItems: [
      "Li kiyès ki òganize kanpay la ak kiyès ki benefisye.",
      "Verifye kiyès ki resevwa lajan an ak kijan li rive jwenn benefisyè a.",
      "Verifye tout adrès sit la anvan ou swiv yon lyen.",
      "Li frè ak kondisyon sèvis ekstèn nan.",
    ],
    responsible: "Yon revizyon pa yon garanti",
    responsibleBody:
      "Yon kanpay ki pase revizyon pa garanti idantite, bezwen, itilizasyon lajan oswa rezilta. Endikatè yo dekri verifikasyon ki fèt yo. Fivonine pa garanti ni ranbouse peman ki fèt lòt kote.",
    privacy: "Pwoteje enfòmasyon pèsonèl",
    privacyBody:
      "Pataje sèlman sa istwa a bezwen. Pa mete dokiman idantite, dosye medikal, kòd bank, adrès prive oswa detay ki idantifye timoun sou paj piblik. Mande pèmisyon pou istwa ak foto lòt moun.",
    problems: "Gen yon bagay ki pa sanble kòrèk?",
    problemsBody:
      "Sèvi ak lyen rapò sou paj kanpay la pou enfòmasyon ki twonpe, fo idantite oswa pwoblèm vi prive. Kontakte sèvis peman an pou peman oswa ranbousman.",
    faq: "Kesyon ak repons",
    searchHelp: "Chèche yon sijè èd",
    noHelp: "Pa gen sijè sa a. Eseye yon lòt mo oswa kontakte nou.",
    learn: "Konprann kijan sa mache",
    supportMethods: "Fason pou ede",
    storyTab: "Istwa",
    updatesTab: "Nouvèl",
    organizerTab: "Òganizatè",
    shareTitle: "Ede istwa sa a rive jwenn kominote w",
    shareBody: "Pataje lyen kanpay la ak moun ki ka vle ede.",
    link: "Kopye lyen",
    copied: "Lyen kopye",
    copyFailed: "Nou pa ka kopye lyen an. Kopye adrès la nan navigatè w.",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    recipient: "Benefisyè",
    checklist: "Anvan ou pibliye",
    checklistItems: [
      "Chwazi yon tit ki dekri bezwen an.",
      "Esplike relasyon w ak benefisyè a.",
      "Di sa sipò a kouvri ak kijan li rive.",
      "Sèvi ak yon foto ou gen pèmisyon pou pataje.",
      "Verifye chak lyen anvan ou soumèt.",
    ],
    next: "Pwochen etap ou yo",
    overview: "Apèsi",
    edit: "Modifye epi revize",
    share: "Pataje kanpay ou",
    updates: "Bay moun k ap sipòte w nouvèl",
    reviewStatus: "Estati revizyon",
    tips: "Konsèy pou kanpay",
    seeAll: "Tout kategori yo",
    empty: "Pa gen kanpay pibliye nan kategori sa a ankò.",
    guideBack: "Tout gid yo",
  },
} satisfies Record<Locale, unknown>;
export const causeMedia: Record<Category, string> = {
  education: "/photos/learning.webp",
  medical: "/photos/care.webp",
  emergencies: "/photos/growing.webp",
  community: "/photos/together.webp",
  personal: "/photos/together.webp",
};
export const causeCopy: Record<
  Locale,
  Record<Category, { title: string; body: string; ideas: string[] }>
> = {
  en: {
    education: {
      title: "Give learning a place to grow.",
      body: "Share school expenses, tuition needs, classroom projects and opportunities for students in Haiti and the diaspora.",
      ideas: [
        "Tuition and course materials",
        "Books, supplies and classroom repairs",
        "Community learning programs",
      ],
    },
    medical: {
      title: "Help someone focus on recovery.",
      body: "Bring attention to treatment, transport and recovery needs while protecting the beneficiary’s medical privacy.",
      ideas: [
        "Treatment and prescriptions",
        "Travel to medical appointments",
        "Recovery and essential care",
      ],
    },
    emergencies: {
      title: "Come together when it matters.",
      body: "Share urgent needs after an unexpected crisis, with a clear explanation of what help is needed now.",
      ideas: [
        "Temporary housing and essentials",
        "Disaster recovery",
        "Urgent family support",
      ],
    },
    community: {
      title: "Build something your community can share.",
      body: "Connect neighbors and supporters around practical projects for Haitian communities.",
      ideas: [
        "Schools and shared spaces",
        "Neighborhood repairs",
        "Local community initiatives",
      ],
    },
    personal: {
      title: "A little support can make room to move forward.",
      body: "Share essential needs for individuals and families in Haiti and across the diaspora.",
      ideas: [
        "Housing and living essentials",
        "Support during a difficult transition",
        "Family needs",
      ],
    },
  },
  fr: {
    education: {
      title: "Donnons à l’éducation la place de grandir.",
      body: "Partagez des besoins de scolarité, de matériel et des projets éducatifs en Haïti et dans la diaspora.",
      ideas: [
        "Scolarité et cours",
        "Livres et fournitures",
        "Programmes éducatifs communautaires",
      ],
    },
    medical: {
      title: "Aidons une personne à se rétablir.",
      body: "Partagez les besoins de traitement, de transport et de convalescence en protégeant la vie privée du bénéficiaire.",
      ideas: [
        "Soins et médicaments",
        "Transport médical",
        "Convalescence et soins essentiels",
      ],
    },
    emergencies: {
      title: "Ensemble quand cela compte.",
      body: "Expliquez les besoins urgents après une crise et le soutien nécessaire maintenant.",
      ideas: [
        "Hébergement et besoins essentiels",
        "Reconstruction après une catastrophe",
        "Soutien familial urgent",
      ],
    },
    community: {
      title: "Construisons ensemble pour notre communauté.",
      body: "Rassemblez voisins et soutiens autour de projets utiles aux communautés haïtiennes.",
      ideas: [
        "Écoles et espaces partagés",
        "Réparations de quartier",
        "Initiatives locales",
      ],
    },
    personal: {
      title: "Un soutien pour avancer.",
      body: "Partagez les besoins essentiels de personnes et familles en Haïti et dans la diaspora.",
      ideas: [
        "Logement et dépenses essentielles",
        "Période de transition",
        "Besoins familiaux",
      ],
    },
  },
  ht: {
    education: {
      title: "Bay aprantisaj plas pou l grandi.",
      body: "Pataje bezwen lekòl, frè etid, materyèl ak pwojè pou elèv ann Ayiti ak nan dyaspora a.",
      ideas: [
        "Frè lekòl ak materyèl kou",
        "Liv ak reparasyon sal klas",
        "Pwogram aprantisaj kominotè",
      ],
    },
    medical: {
      title: "Ede yon moun konsantre sou gerizon.",
      body: "Pataje bezwen swen, transpò ak rekiperasyon pandan ou pwoteje vi prive benefisyè a.",
      ideas: [
        "Tretman ak medikaman",
        "Transpò pou randevou medikal",
        "Swen pandan rekiperasyon",
      ],
    },
    emergencies: {
      title: "Mete tèt ansanm lè sa nesesè.",
      body: "Pataje bezwen ijan apre yon kriz epi esplike ki èd ki nesesè kounye a.",
      ideas: [
        "Lojman tanporè ak bagay esansyèl",
        "Rekiperasyon apre dezas",
        "Sipò ijan pou fanmi",
      ],
    },
    community: {
      title: "Bati yon bagay kominote w ka pataje.",
      body: "Rasanble vwazen ak moun k ap bay sipò pou pwojè itil nan kominote ayisyen yo.",
      ideas: [
        "Lekòl ak espas pataje",
        "Reparasyon nan katye",
        "Inisyativ lokal",
      ],
    },
    personal: {
      title: "Yon ti sipò pou kontinye avanse.",
      body: "Pataje bezwen esansyèl moun ak fanmi ann Ayiti ak nan dyaspora a.",
      ideas: [
        "Lojman ak depans esansyèl",
        "Sipò nan yon tranzisyon difisil",
        "Bezwen fanmi",
      ],
    },
  },
};
export type Guide = {
  slug: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
};
export const guides: Record<Locale, Guide[]> = {
  en: [
    {
      slug: "tell-your-story",
      title: "Write a story people can understand",
      intro:
        "Explain the need, the people involved, and the practical plan for support.",
      sections: [
        {
          heading: "Start with the need",
          body: "Describe what happened, who needs support, and why you are sharing the campaign. Use a specific title and explain your relationship to the beneficiary.",
        },
        {
          heading: "Explain the plan",
          body: "Break down what support will cover. If you list a goal, explain how you chose it. Name who receives the money and how it reaches the person or community who needs it.",
        },
        {
          heading: "Choose what to share",
          body: "Use a photo you have permission to publish. Leave out documents, account credentials, exact home addresses, and sensitive medical information. Ask the beneficiary to review the story before publishing.",
        },
      ],
    },
    {
      slug: "share-your-fundraiser",
      title: "Share your fundraiser with your community",
      intro: "Make it easy for people to read the story and pass it along.",
      sections: [
        {
          heading: "Begin with people you know",
          body: "Share your campaign link with family, friends and community contacts. Explain the need in your own words and let people decide whether to help or share.",
        },
        {
          heading: "Make the link easy to find",
          body: "Use the campaign’s share controls or copy its address. Add the link to a message or social post with a short introduction. Ask before sharing in an organization’s group.",
        },
        {
          heading: "Keep the story current",
          body: "Post useful updates when circumstances change. Explain new needs or completed steps. Avoid repeatedly posting sensitive details or pressuring people to contribute.",
        },
      ],
    },
    {
      slug: "diaspora-support",
      title: "Organize support across borders",
      intro:
        "Make the connection between the organizer and the beneficiary clear.",
      sections: [
        {
          heading: "Name the roles",
          body: "Explain where the organizer and beneficiary are based, who will receive contributions, and who is responsible for getting support to the beneficiary.",
        },
        {
          heading: "Check the service rules",
          body: "An external service may limit supported countries, who can open an account, or who can receive funds. Check its current requirements directly. Do not use another person’s identity or make promises about eligibility.",
        },
        {
          heading: "Explain delivery",
          body: "Describe the intended transfer or purchasing arrangement, possible fees and how updates will be shared. Do not publish private account details or promise a delivery time you cannot confirm.",
        },
      ],
    },
    {
      slug: "support-instructions",
      title: "Write clear support instructions",
      intro:
        "Your campaign can explain how people help without an existing fundraising page.",
      sections: [
        {
          heading: "Use plain instructions",
          body: "State the support method, the recipient’s role, and what someone should expect after following the link. Use public HTTPS links and check that the address is correct.",
        },
        {
          heading: "Explain outside services",
          body: "Payments, refunds, eligibility and withdrawals follow the external service’s rules. Fivonine does not process these payments. Tell supporters to review fees and terms before contributing.",
        },
        {
          heading: "Keep changes transparent",
          body: "If your recipient or support method changes, submit an edit for review. Explain the change in an update. Never post passwords, banking login details or identity documents.",
        },
      ],
    },
    {
      slug: "campaign-updates",
      title: "Keep supporters informed",
      intro: "Useful updates explain what changed and what comes next.",
      sections: [
        {
          heading: "Share a concrete development",
          body: "Describe a completed step, a changed need, or a practical obstacle. Use dates and specific information you are comfortable publishing.",
        },
        {
          heading: "Be precise about amounts",
          body: "Only describe amounts you can confirm. Separate a goal from contributions received. Fivonine does not track donations or provide a live amount raised.",
        },
        {
          heading: "Close the loop",
          body: "Let people know when the campaign is no longer needed. Explain the outcome with the beneficiary’s permission and request removal or closure through your campaign dashboard.",
        },
      ],
    },
    {
      slug: "privacy-and-consent",
      title: "Protect the people in your story",
      intro:
        "A public campaign should share the need without exposing private information.",
      sections: [
        {
          heading: "Get permission",
          body: "Ask the beneficiary before publishing their story or image. For children, get permission from the appropriate parent or guardian and limit identifying details.",
        },
        {
          heading: "Leave private documents out",
          body: "Do not publish medical records, passports, banking credentials, private phone numbers or home addresses. A clear public explanation does not need these documents.",
        },
        {
          heading: "Respond to concerns",
          body: "If someone asks you to correct or remove information about them, respond promptly. They can contact Fivonine or report the listing directly from the campaign page.",
        },
      ],
    },
  ],
  fr: [
    {
      slug: "tell-your-story",
      title: "Écrire une histoire compréhensible",
      intro:
        "Expliquez le besoin, les personnes concernées et le plan de soutien.",
      sections: [
        {
          heading: "Commencez par le besoin",
          body: "Décrivez la situation, qui a besoin de soutien et votre lien avec le bénéficiaire. Choisissez un titre précis.",
        },
        {
          heading: "Expliquez le plan",
          body: "Détaillez l’usage du soutien et le calcul de l’objectif. Indiquez qui reçoit les fonds et comment ils arrivent au bénéficiaire.",
        },
        {
          heading: "Choisissez ce que vous publiez",
          body: "Utilisez une photo autorisée. Évitez les documents privés, identifiants et informations médicales sensibles. Faites relire le récit par le bénéficiaire.",
        },
      ],
    },
    {
      slug: "share-your-fundraiser",
      title: "Partager votre collecte",
      intro: "Facilitez la lecture et le partage de votre histoire.",
      sections: [
        {
          heading: "Commencez par votre entourage",
          body: "Partagez le lien avec vos proches et contacts communautaires. Expliquez le besoin sans faire pression.",
        },
        {
          heading: "Rendez le lien accessible",
          body: "Utilisez les boutons de partage ou copiez l’adresse. Accompagnez le lien d’un court message. Demandez l’accord avant de publier dans un groupe.",
        },
        {
          heading: "Actualisez votre histoire",
          body: "Publiez des nouvelles utiles lorsque les besoins changent. Respectez la vie privée des personnes concernées.",
        },
      ],
    },
    {
      slug: "diaspora-support",
      title: "Organiser un soutien entre pays",
      intro: "Clarifiez le lien entre l’organisateur et le bénéficiaire.",
      sections: [
        {
          heading: "Précisez les rôles",
          body: "Expliquez où se trouvent les personnes, qui reçoit les contributions et qui les transmet.",
        },
        {
          heading: "Vérifiez les conditions du service",
          body: "Un service externe peut limiter les pays et les personnes éligibles. Consultez ses conditions actuelles. N’utilisez pas l’identité d’une autre personne.",
        },
        {
          heading: "Expliquez l’acheminement",
          body: "Décrivez le transfert ou les achats prévus, les frais possibles et les futures nouvelles. Ne publiez pas d’informations de compte privées.",
        },
      ],
    },
    {
      slug: "support-instructions",
      title: "Rédiger des instructions claires",
      intro: "Expliquez comment aider, même sans page de collecte existante.",
      sections: [
        {
          heading: "Soyez précis",
          body: "Indiquez le moyen de soutien, le rôle du destinataire et ce qui se passe après le clic. Vérifiez les liens HTTPS publics.",
        },
        {
          heading: "Expliquez les services externes",
          body: "Paiements, retraits et remboursements dépendent du prestataire. Fivonine ne traite pas ces paiements. Invitez à consulter les frais et conditions.",
        },
        {
          heading: "Expliquez les changements",
          body: "Soumettez toute modification du destinataire ou du moyen de soutien à un nouvel examen. Ne publiez jamais de mots de passe ou de documents d’identité.",
        },
      ],
    },
    {
      slug: "campaign-updates",
      title: "Informer les personnes qui vous soutiennent",
      intro: "Une nouvelle utile explique ce qui a changé et la suite.",
      sections: [
        {
          heading: "Décrivez une avancée",
          body: "Partagez une étape terminée, un besoin modifié ou un obstacle concret, avec des informations que vous acceptez de publier.",
        },
        {
          heading: "Précisez les montants",
          body: "Indiquez uniquement les sommes confirmées et distinguez objectif et contributions. Fivonine ne suit pas les dons en temps réel.",
        },
        {
          heading: "Expliquez le résultat",
          body: "Informez les soutiens lorsque la collecte n’est plus nécessaire. Demandez sa fermeture ou son retrait depuis votre espace.",
        },
      ],
    },
    {
      slug: "privacy-and-consent",
      title: "Protéger les personnes de votre histoire",
      intro: "Partagez le besoin en respectant la vie privée.",
      sections: [
        {
          heading: "Demandez l’accord",
          body: "Obtenez l’accord du bénéficiaire avant publication. Pour les enfants, demandez au parent ou responsable et limitez les détails identifiants.",
        },
        {
          heading: "Gardez les documents privés",
          body: "Ne publiez pas de dossiers médicaux, passeports, identifiants bancaires, téléphones privés ou adresses personnelles.",
        },
        {
          heading: "Répondez aux préoccupations",
          body: "Répondez rapidement à une demande de correction ou de retrait. La personne concernée peut contacter Fivonine ou signaler la page.",
        },
      ],
    },
  ],
  ht: [
    {
      slug: "tell-your-story",
      title: "Ekri yon istwa moun ka konprann",
      intro: "Esplike bezwen an, moun ki konsène yo ak plan pou sipò a.",
      sections: [
        {
          heading: "Kòmanse ak bezwen an",
          body: "Dekri sa ki rive, kiyès ki bezwen sipò ak relasyon w ak benefisyè a. Chwazi yon tit presi.",
        },
        {
          heading: "Esplike plan an",
          body: "Di sa sipò a kouvri ak kijan ou chwazi objektif la. Di kiyès ki resevwa lajan an ak kijan li rive jwenn benefisyè a.",
        },
        {
          heading: "Chwazi sa ou pataje",
          body: "Sèvi ak yon foto ki otorize. Pa mete dokiman prive, kòd kont oswa enfòmasyon medikal sansib. Fè benefisyè a li istwa a anvan ou pibliye.",
        },
      ],
    },
    {
      slug: "share-your-fundraiser",
      title: "Pataje kanpay ou ak kominote w",
      intro: "Fè li fasil pou moun li istwa a epi pataje l.",
      sections: [
        {
          heading: "Kòmanse ak moun ou konnen",
          body: "Pataje lyen an ak fanmi, zanmi ak kontak nan kominote a. Esplike bezwen an san ou pa fè presyon.",
        },
        {
          heading: "Fè lyen an fasil jwenn",
          body: "Sèvi ak bouton pataje yo oswa kopye adrès la. Mete yon ti mesaj ak lyen an. Mande pèmisyon anvan ou pibliye nan yon gwoup.",
        },
        {
          heading: "Kenbe istwa a ajou",
          body: "Bay nouvèl itil lè bezwen yo chanje. Respekte vi prive moun ki nan istwa a.",
        },
      ],
    },
    {
      slug: "diaspora-support",
      title: "Òganize sipò ant peyi yo",
      intro: "Fè relasyon òganizatè a ak benefisyè a klè.",
      sections: [
        {
          heading: "Esplike wòl yo",
          body: "Di kote moun yo ye, kiyès ki resevwa kontribisyon yo ak kiyès ki responsab pou fè sipò a rive.",
        },
        {
          heading: "Verifye kondisyon sèvis la",
          body: "Yon sèvis ekstèn ka limite peyi ak moun ki ka itilize l. Verifye kondisyon aktyèl yo. Pa sèvi ak idantite yon lòt moun.",
        },
        {
          heading: "Esplike livrezon an",
          body: "Dekri transfè oswa acha ki prevwa yo, frè posib yo ak fason ou pral bay nouvèl. Pa pibliye detay kont prive.",
        },
      ],
    },
    {
      slug: "support-instructions",
      title: "Ekri enstriksyon sipò ki klè",
      intro:
        "Ou ka esplike kijan moun ede san yon paj koleksyon ki deja egziste.",
      sections: [
        {
          heading: "Ekri enstriksyon senp",
          body: "Di metòd sipò a, wòl moun k ap resevwa a ak sa k ap pase apre yon moun klike. Verifye lyen HTTPS piblik yo.",
        },
        {
          heading: "Esplike sèvis ekstèn yo",
          body: "Peman, retrè ak ranbousman suiv kondisyon sèvis la. Fivonine pa trete peman sa yo. Fè moun konnen pou yo li frè ak kondisyon yo.",
        },
        {
          heading: "Fè chanjman yo klè",
          body: "Soumèt chanjman nan moun k ap resevwa oswa metòd sipò a pou revizyon. Pa pibliye modpas ni dokiman idantite.",
        },
      ],
    },
    {
      slug: "campaign-updates",
      title: "Bay moun k ap sipòte w nouvèl",
      intro: "Yon nouvèl itil esplike sa ki chanje ak sa ki vini apre.",
      sections: [
        {
          heading: "Pataje yon etap konkrè",
          body: "Dekri yon etap ki fini, yon bezwen ki chanje oswa yon obstak pratik ak enfòmasyon ou ka pibliye.",
        },
        {
          heading: "Fè kantite lajan yo presi",
          body: "Pataje sèlman kantite ou ka konfime epi separe objektif ak kontribisyon. Fivonine pa swiv don an tan reyèl.",
        },
        {
          heading: "Esplike rezilta a",
          body: "Di moun lè kanpay la pa nesesè ankò. Mande fèmen oswa retire kanpay la nan espas ou a.",
        },
      ],
    },
    {
      slug: "privacy-and-consent",
      title: "Pwoteje moun ki nan istwa w",
      intro: "Pataje bezwen an san ou pa ekspoze enfòmasyon prive.",
      sections: [
        {
          heading: "Jwenn pèmisyon",
          body: "Mande benefisyè a pèmisyon anvan ou pibliye. Pou timoun, mande paran oswa responsab la epi limite detay ki idantifye yo.",
        },
        {
          heading: "Pa pibliye dokiman prive",
          body: "Pa mete dosye medikal, paspò, kòd bank, telefòn prive oswa adrès lakay sou paj piblik.",
        },
        {
          heading: "Reponn enkyetid yo",
          body: "Reponn vit lè yon moun mande koreksyon oswa retrè. Moun nan ka kontakte Fivonine oswa rapòte paj la dirèkteman.",
        },
      ],
    },
  ],
};
