import type { Locale } from "./i18n";
type Section = { heading: string; body: string };
export const aboutCopy: Record<Locale, Section[]> = {
  en: [
    {
      heading: "Connection is a kind of strength.",
      body: "Pote Kole is a place for Haitian individuals, families and communities to share their needs and find support, in Haiti and throughout the diaspora. The name is a nod to Haiti’s +509 calling code—and to the connections that cross borders.",
    },
    {
      heading: "A place to be seen.",
      body: "We bring campaigns together so that visibility does not depend only on the size of an organizer’s audience. Education, medical care, emergencies, community projects and essential personal needs belong here.",
    },
    {
      heading: "Independent. Community first.",
      body: "We publish reviewed campaign information and organizer-written support instructions. We do not collect, hold, transfer or distribute donations, and we do not guarantee campaign outcomes. Submissions and discovery are free.",
    },
  ],
  fr: [
    {
      heading: "Les liens font notre force.",
      body: "Pote Kole permet aux personnes, familles et communautés haïtiennes de partager leurs besoins et de trouver du soutien, en Haïti et dans la diaspora. Son nom évoque l’indicatif +509 et les liens qui traversent les frontières.",
    },
    {
      heading: "Un espace pour être visible.",
      body: "Nous rassemblons les collectes pour que leur visibilité ne dépende pas uniquement du réseau de leur organisateur : éducation, santé, urgences, projets communautaires et besoins essentiels.",
    },
    {
      heading: "Indépendant. La communauté d’abord.",
      body: "Nous publions des annonces examinées et les instructions des organisateurs. Nous ne gérons aucun don et ne garantissons aucun résultat. La soumission et la découverte sont gratuites.",
    },
  ],
  ht: [
    {
      heading: "Koneksyon se yon fòs.",
      body: "Pote Kole se yon espas kote moun, fanmi ak kominote ayisyen yo pataje bezwen yo epi jwenn sipò, ann Ayiti ak nan dyaspora a. Non an fè referans ak kòd telefòn +509 Ayiti a ak koneksyon ki travèse fwontyè yo.",
    },
    {
      heading: "Yon espas pou moun wè ou.",
      body: "Nou rasanble kanpay yo pou vizibilite pa depann sèlman de kantite moun yon òganizatè konnen. Edikasyon, swen sante, ijans, pwojè kominotè ak bezwen esansyèl gen plas yo isit la.",
    },
    {
      heading: "Endepandan. Kominote an premye.",
      body: "Nou pibliye kanpay nou revize ak enstriksyon òganizatè yo ekri. Nou pa resevwa, kenbe oswa transfere don, epi nou pa garanti rezilta. Soumèt ak dekouvri kanpay yo gratis.",
    },
  ],
};
export const helpCopy: Record<Locale, Section[]> = {
  en: [
    {
      heading: "Do I need an account to support someone?",
      body: "No. Browse, search, share and read campaign support instructions without an account. An organizer needs a confirmed email to manage submissions.",
    },
    {
      heading: "How do donations work?",
      body: "Read the organizer’s instructions and decide whether and how to proceed outside Pote Kole. Confirm the recipient and any provider’s rules. We do not process payments, issue donation receipts or resolve payment disputes.",
    },
    {
      heading: "Can someone in Haiti submit a campaign?",
      body: "Yes. The organizer must explain the beneficiary, intended use and distribution arrangement. Any external service’s country and payout rules still apply; Pote Kole does not bypass them.",
    },
    {
      heading: "What does review mean?",
      body: "We screen information and only display indicators for checks actually completed. Review does not guarantee identity, legitimacy, use of funds or success.",
    },
    {
      heading: "How do I report a campaign or request removal?",
      body: "Use “Report this fundraiser” on the campaign page. Organizers can request removal from their dashboard. People described in a campaign can contact us to dispute consent or request a privacy review.",
    },
    {
      heading: "What should I never publish?",
      body: "Passwords, identity documents, bank credentials, precise home addresses, private medical records, or information that puts someone at risk. Get permission before sharing someone’s story or photograph, particularly a child’s.",
    },
  ],
  fr: [
    {
      heading: "Faut-il un compte pour soutenir une collecte ?",
      body: "Non. Vous pouvez explorer, rechercher, partager et lire les instructions sans compte. L’organisateur doit confirmer son e-mail pour gérer ses demandes.",
    },
    {
      heading: "Comment fonctionnent les dons ?",
      body: "Lisez les instructions et poursuivez en dehors de Pote Kole. Confirmez le bénéficiaire et les règles du service utilisé. Nous ne traitons pas les paiements, ne délivrons pas de reçus fiscaux et ne réglons pas les litiges de paiement.",
    },
    {
      heading: "Peut-on soumettre une collecte depuis Haïti ?",
      body: "Oui. Expliquez l’utilisation et la distribution du soutien. Les restrictions de pays et de retrait du service externe restent applicables.",
    },
    {
      heading: "Que signifie l’examen ?",
      body: "Nous examinons les informations et affichons uniquement les contrôles effectués. Cela ne garantit ni l’identité, ni l’utilisation des fonds, ni le résultat.",
    },
    {
      heading: "Comment signaler ou retirer une collecte ?",
      body: "Utilisez le lien de signalement sur la collecte. Les organisateurs peuvent demander son retrait dans leur tableau de bord. Toute personne concernée peut nous contacter pour contester son consentement.",
    },
    {
      heading: "Que ne faut-il jamais publier ?",
      body: "Mots de passe, documents d’identité, identifiants bancaires, adresses précises, dossiers médicaux privés ou informations dangereuses. Obtenez l’autorisation pour les récits et les images, notamment d’enfants.",
    },
  ],
  ht: [
    {
      heading: "Èske mwen bezwen yon kont pou ede?",
      body: "Non. Ou ka dekouvri, chèche, pataje epi li enstriksyon yo san kont. Yon òganizatè bezwen konfime imèl li pou jere demann li yo.",
    },
    {
      heading: "Kijan don yo mache?",
      body: "Li enstriksyon òganizatè a epi deside si ou vle ede deyò Pote Kole. Konfime moun k ap resevwa sipò a ak règ sèvis la. Nou pa trete peman, bay resi fiskal oswa regle konfli peman.",
    },
    {
      heading: "Èske yon moun ann Ayiti ka soumèt yon kanpay?",
      body: "Wi. Eksplike benefisyè a, itilizasyon sipò a ak kijan l ap rive jwenn li. Règ peyi ak retrè sèvis ekstèn yo toujou aplike.",
    },
    {
      heading: "Kisa revizyon an vle di?",
      body: "Nou egzamine enfòmasyon yo epi montre sèlman verifikasyon nou fè. Sa pa garanti idantite, itilizasyon lajan oswa rezilta.",
    },
    {
      heading: "Kijan pou siyale oswa retire yon kanpay?",
      body: "Sèvi ak lyen siyalman sou kanpay la. Òganizatè yo ka mande retire kanpay nan tablo yo. Moun ki nan istwa a ka kontakte nou pou pwoblèm konsantman oswa vi prive.",
    },
    {
      heading: "Kisa mwen pa dwe janm pibliye?",
      body: "Modpas, dokiman idantite, enfòmasyon bankè, adrès kay presi, dosye medikal prive oswa enfòmasyon ki ka mete yon moun an danje. Jwenn pèmisyon pou istwa ak foto, sitou pou timoun.",
    },
  ],
};
export const legalCopy: Record<Locale, Section[]> = {
  en: [
    {
      heading: "Privacy",
      body: "Public campaign stories and organizer names are visible to visitors after approval. Organizer email addresses, reports and moderation notes are private. Authentication is provided by Supabase; transactional email may use a separate email provider. We do not collect donor financial information. Contact us to request access, correction or removal of your information.",
    },
    {
      heading: "Terms",
      body: "Submit accurate information you have permission to publish. You remain responsible for your campaign and support instructions. Pote Kole is an independent publishing and discovery service, not a payment processor, escrow agent or guarantor. External services have their own terms. We may decline, suspend or remove listings that violate these policies.",
    },
    {
      heading: "Fundraising guidelines",
      body: "Eligible categories are education, medical needs, emergencies, community projects and essential personal needs. No political fundraising, loans, investments, financial-return promises, impersonation or deceptive requests. Explain the recipient, intended use and distribution arrangement. Obtain consent and image rights. Do not publish sensitive documents or credentials.",
    },
    {
      heading: "Review policy",
      body: "New campaigns and revisions require human review. Specific indicators only describe completed checks: organizer email confirmation, support-link review or organization-information review. They do not constitute a guarantee. Reports can lead to temporary suspension, further information requests or removal; decisions are recorded internally.",
    },
    {
      heading: "Donation disclosures",
      body: "Pote Kole does not collect, hold, transfer or distribute donations. Support is arranged directly with an organizer or external service. The organizer may control how proceeds reach a beneficiary. Confirm the recipient, fees, availability, payout eligibility and dispute process before proceeding. Do not assume contributions are tax deductible. No live donation amount or progress is inferred.",
    },
  ],
  fr: [
    {
      heading: "Confidentialité",
      body: "Après approbation, les récits et noms des organisateurs sont publics. Les e-mails, signalements et notes de modération restent privés. Supabase fournit l’authentification et un prestataire distinct peut envoyer les e-mails. Nous ne collectons aucune information financière de donateur. Contactez-nous pour accéder à vos données, les corriger ou demander leur suppression.",
    },
    {
      heading: "Conditions",
      body: "Fournissez des informations exactes que vous avez le droit de publier. Vous êtes responsable de votre collecte et de ses instructions. Pote Kole est un service indépendant de publication, pas un prestataire de paiement ni un garant. Les services externes appliquent leurs propres règles. Les annonces contraires aux politiques peuvent être retirées.",
    },
    {
      heading: "Règles des collectes",
      body: "Éducation, santé, urgences, communauté et besoins essentiels sont éligibles. Sont interdits : financement politique, prêts, investissements, promesses de rendement, usurpation et tromperie. Précisez le bénéficiaire, l’utilisation et la distribution du soutien. Obtenez les consentements et les droits sur les images. Aucun document sensible ni identifiant.",
    },
    {
      heading: "Politique d’examen",
      body: "Les nouvelles collectes et modifications sont examinées par une personne. Les indicateurs décrivent seulement les contrôles effectués, sans garantie. Les signalements peuvent entraîner une suspension, une demande d’informations ou un retrait. Les décisions sont conservées en interne.",
    },
    {
      heading: "Informations sur les dons",
      body: "Pote Kole ne reçoit, ne conserve et ne transfère aucun don. Le soutien se fait directement avec un organisateur ou un service externe. Confirmez le destinataire, les frais, l’éligibilité aux retraits et les recours. Ne présumez pas de déduction fiscale. Aucun montant collecté en temps réel n’est déduit.",
    },
  ],
  ht: [
    {
      heading: "Konfidansyalite",
      body: "Apre apwobasyon, istwa kanpay ak non òganizatè yo piblik. Imèl, siyalman ak nòt moderasyon yo prive. Supabase bay koneksyon kont yo, epi yon lòt sèvis ka voye imèl. Nou pa kolekte enfòmasyon finansye donatè. Kontakte nou pou jwenn, korije oswa mande retire enfòmasyon ou yo.",
    },
    {
      heading: "Kondisyon",
      body: "Soumèt enfòmasyon ki kòrèk ou gen dwa pibliye. Ou responsab kanpay ou ak enstriksyon yo. Pote Kole se yon sèvis piblikasyon endepandan, li pa trete peman ni garanti kanpay. Sèvis ekstèn yo gen pwòp règ yo. Nou ka retire kanpay ki pa respekte règleman yo.",
    },
    {
      heading: "Règ kanpay yo",
      body: "Edikasyon, sante, ijans, kominote ak bezwen esansyèl elijib. Nou pa aksepte finansman politik, prè, envestisman, pwomès pwofi, fo idantite oswa demann ki twonpe. Eksplike moun k ap resevwa sipò a, itilizasyon li ak distribisyon li. Jwenn konsantman ak dwa sou imaj. Pa mete dokiman sansib oswa modpas.",
    },
    {
      heading: "Règleman revizyon",
      body: "Yon moun revize chak nouvo kanpay ak chanjman. Endikatè yo dekri sèlman verifikasyon ki fèt, yo pa garanti kanpay. Siyalman ka lakòz sispansyon, demann plis enfòmasyon oswa retrè. Nou konsève desizyon yo anndan sistèm nan.",
    },
    {
      heading: "Enfòmasyon sou don",
      body: "Pote Kole pa resevwa, kenbe oswa transfere don. Sipò a fèt dirèkteman ak yon òganizatè oswa sèvis ekstèn. Konfime moun k ap resevwa lajan an, frè yo, règ retrè ak pwosesis konfli yo. Pa sipoze don yo dediktib nan taks. Nou pa devine kantite don yo.",
    },
  ],
};
