import type { Locale } from "../i18n";

/**
 * Every word the fundraiser form shows, in one place.
 * One word per idea:  fundraiser = ranmasaj / collecte / recaudación
 *                     ways to receive money = fason pou resevwa lajan / moyens de recevoir l'argent / formas de recibir el dinero
 * Kreyòl is written first; the other languages follow it. Labels are short and spoken.
 */
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const ht = {
  intro: { title: "Kòmanse yon ranmasaj", lead: "Kèk minit pou rakonte istwa a. Ekip nou an verifye l anvan l parèt.", how: [["Anviwon 10 a 15 minit", "Ou pa bezwen fini tout an menm tan."], ["Li anrejistre pou kont li", "Ou ka kite epi kontinye pita, sou nenpòt aparèy."], ["Pyès ou rete prive", "Se sèlman ekip verifikasyon an ki wè l. Verifikasyon pran jiska 2 jou."]] as [string, string][], start: "Kòmanse", continueTitle: "Kontinye kote w te rive", savedOn: (d: string) => `Anrejistre ${d}`, needsChanges: "Gen chanjman pou fè", deviceDraft: "Kontinye sa w te kòmanse sou aparèy sa a", untitled: "Ranmasaj san tit", startNew: "Kòmanse yon lòt" },
  save: { saving: "L ap anrejistre…", saved: (t: string) => `Anrejistre nan kont ou · ${t}`, deviceOnly: "Anrejistre sou aparèy sa a. Ajoute yon tit pou l anrejistre nan kont ou tou.", failed: "Nou pa t ka anrejistre. Gade koneksyon w; n ap eseye ankò.", readyToSend: "Pare pou voye" },
  steps: { basics: "Pou kiyès", story: "Istwa", goal: "Objektif", media: "Foto", receive: "Lajan", verification: "Idantite", submit: "Voye" },
  nav: { previous: "Retounen", next: "Kontinye", edit: "Chanje", allSteps: "Tout etap yo", who: "Pou kiyès ranmasaj la ye?", self: "Pou mwen", other: "Pou yon lòt moun", org: "Pou yon òganizasyon", selfHint: "Pou pwòp bezwen pa m", otherHint: "Yon moun, yon fanmi oswa yon kominote", orgHint: "Yon lekòl, yon legliz oswa yon gwoup", selfName: "Non w", orgName: "Non òganizasyon an", authorization: "Si w ap ranmase pou yon lòt moun, ajoute prèv ou gen dwa fè l (yon lèt, yon mesaj de moun nan)." },
  ready: { title: "Prepare sa yo anvan", items: ["Yon foto ki klè", "Pyès idantite w ak yon selfi kote w kenbe l", "Yon kont MonCash, NatCash, bank oswa transfè"], dismiss: "Mwen pare" },
  c: {
    addDocument: "Ajoute yon dokiman", addPhoto: "Ajoute foto", beneficiary: "Non moun nan", choose: "Chwazi", commune: "Vil oswa komin", department: "Depatman",
    consentTruth: "Tout sa m ekri yo vre.", consentTerms: "M dakò ak kondisyon yo ak règ kominote a.", consentOff: "M konprann moun yo voye lajan an dirèkteman bay moun k ap resevwa a. yon kout men pa janm kenbe lajan an, epi li ka retire yon ranmasaj ki pa respekte règ yo.",
    contactEmail: "Imèl", contactName: "Non konplè w, jan li ye sou pyès ou", groupApp: "Aplikasyon (aletranje)", groupBank: "Bank", groupTransfer: "Transfè lajan", groupWallet: "Lajan sou telefòn",
    hintApp: "Non sou kont lan ak imèl oswa @non", hintBank: "Non sou kont lan, nimewo kont lan, lajan", hintOther: "Esplike kijan moun ka voye lajan an", hintTransfer: "Non konplè moun k ap resevwa a, vil, peyi", hintWallet: "Non sou kont lan ak nimewo a",
    idBack: "Pyès, dèyè", idFront: "Pyès, devan", missing: "Sa ki manke toujou", needContact: "Ajoute non w, imèl ou ak telefòn ou.", needIdentity: "Ajoute pyès ou ak yon selfi kote w kenbe l.", needRecipient: "Di pou kiyès ranmasaj la ye.",
    referenceContact: "Telefòn oswa imèl li", referenceName: "Yon moun ki ka konfime istwa w", relation: "Ki relasyon w ak li?", selfie: "Ou menm k ap kenbe pyès la",
    tooBig: "Fichye a twò gwo. Sèvi ak youn ki pi piti pase 8 MB.", uploadFailed: "Li pa monte. Gade koneksyon w epi eseye ankò.", uploaded: "Li monte", uploading: "L ap monte…",
  },
  ui: {
    coverTitle: "Foto kouvèti", coverHint: "Se premye bagay moun wè. Sèvi ak yon vrè foto ki klè.", coverAdd: "Ajoute foto kouvèti a", coverChange: "Chanje foto kouvèti a", galleryTitle: "Galri", galleryHint: "Plis foto oswa ti videyo (jiska 9). Yon ti videyo ak telefòn ede moun fè w konfyans. Chak videyo dwe pi piti pase 50 MB.", galleryAdd: "Ajoute foto oswa videyo", videoTooBig: "Videyo a twò gwo. Sèvi ak youn ki pi kout (mwens pase 50 MB).", video: "Videyo",
    addMethod: "Ajoute yon fason pou resevwa lajan", chooseMethod: "Chwazi…", city: "Vil ak rejyon", complete: "Fini", contact: "Kijan nou ka jwenn ou", contactExtra: "Gen lòt bagay nou ta dwe konnen?", country: "Peyi", cover: "Kouvèti",
    deadline: "Dat fen", delete: "Efase", desc: "Istwa a", details: "Detay", evidence: "Plis prèv", goal: "Konbyen lajan ou bezwen?", goalEmpty: "Kite l vid si pa gen yon montan fiks.", identity: "Pyès idantite w",
    invalidDate: "Chwazi yon dat ki bon.", invalidGoal: "Antre yon montan ki pi plis pase 0.", location: "Ki kote yo ye?", makeCover: "Mete l kòm kouvèti", noGoal: "Pa gen montan fiks", phone: "Telefòn oswa WhatsApp",
    photoError: "Gen foto ki pa t monte. Eseye ankò.", photoHelp: "Jiska 10 vrè foto. Premye a se kouvèti a.", photoMenu: "Opsyon foto", photoTitle: "Foto", photos: "Foto", addCover: "Ajoute yon foto kouvèti",
    removeMethod: "Retire", requiredCountry: "Chwazi yon peyi.", requiredLocation: "Ajoute vil la oswa rejyon an.", requiredRole: "Ajoute wòl ou.", reviewTitle: "Verifye epi voye", role: "Wòl ou nan òganizasyon an",
    story: "Rakonte istwa a", storyHelp: "Di kisa ki pase ak kisa lajan an pral peye. Ekri jan w pale.", title: "Tit", uploading: "Foto yo ap monte",
    summaryPhotos: (n: number) => plural(n, "foto", "foto"), summaryMethods: (n: number) => plural(n, "fason pou resevwa", "fason pou resevwa"), summaryDocs: (n: number) => n ? plural(n, "dokiman prive", "dokiman prive") : "Pa gen dokiman ankò",
    moreProof: "Ajoute plis prèv", moreProofHint: "Sa a pa obligatwa, men li ede ekip la verifye pi vit.",
  },
  verification: {
    consent: "M kite ekip verifikasyon an sèvi ak dokiman sa yo pou yo konfime kiyès mwen ye.", consentError: "Tcheke bwat sa a pou w kontinye.", contactHint: "Se sèlman ekip nou an ki wè sa.", correction: "Sa pou w korije",
    format: "Foto JPEG, PNG oswa WebP", identityHint: "Yon pyès idantite ofisyèl ak foto, epi yon foto kote w kenbe l. Figi w ak pyès la dwe klè.", intro: "Prive. Se sèlman ekip verifikasyon an ki wè etap sa a.", invalidFile: "Sèvi ak yon foto JPEG, PNG oswa WebP.",
    privateDraft: "Pyès ou ak kontak ou pa rete sou aparèy sa a. Anrejistre bouyon an pou kenbe yo.", recipientEvidence: "Pa egzanp: yon fakti lopital, yon lèt lekòl, oswa yon mesaj moun w ap ede a.",
    remove: (l: string) => `Retire ${l.toLowerCase()}`, replace: "Ranplase", title: "Idantite w", uploaded: "Li monte an prive",
  },
  k: {
    category: { label: "Ki kalite bezwen?", hint: "" }, cover: { demoReplace: "Sa a se yon foto egzanp. Mete pa w." }, goal: { label: "Montan" }, items: { consent: "Konfimasyon" },
    media: { documents: "Dokiman", documentsHint: "Foto oswa PDF. Se sèlman ekip nou an ki wè yo." }, receive: { label: "Kijan w ap resevwa lajan an?" }, side: { preview: "Jan l ap parèt" },
    submit: { changesHint: "Vèsyon piblik la rete jiskaske nou apwouve chanjman yo.", eta: "Anjeneral nou reponn nan 2 jou.", hint: "N ap verifye pyès ou ak enfòmasyon pou resevwa lajan an anvan l parèt.", label: "Voye pou verifikasyon", reach: (e: string) => `N ap ekri w nan ${e}.` },
    title: { ph: "Ede Marie peye operasyon li" },
  },
  x: {
    err: { cause: "Chwazi ki kalite bezwen.", consent: "Tcheke tout bwat yo.", cover: "Ajoute yon foto kouvèti.", department: "Chwazi yon depatman.", details: "Ranpli detay yo.", link: "Yon lyen dwe kòmanse ak https://", method: "Ajoute omwen yon fason pou resevwa lajan.", title: "Ekri yon tit (omwen 4 lèt)." },
    link: "Lyen peman", linkHint: "Pa egzanp yon lyen PayPal oswa Cash App (https://)", liveNote: "Ranmasaj sa a piblik. Chanjman yo pase pa verifikasyon anvan.", optional: "si w vle",
    saveDraft: "Anrejistre bouyon", saving: "L ap anrejistre…", savedAccount: (t: string) => `Anrejistre a ${t}`, savedDeviceAt: (t: string) => `Kenbe sou aparèy la · ${t}`, submitChanges: "Voye chanjman yo", title: "Kòmanse yon ranmasaj",
  },
  pay: { holder: "Non sou kont lan", phone: "Nimewo telefòn", account: "Nimewo kont", currency: "Lajan", country: "Peyi", city: "Vil", handle: "Imèl, telefòn oswa $non", name: "Non metòd la", instructions: "Kijan pou voye" },
};

type FormText = typeof ht;

const fr: FormText = {
  intro: { title: "Lancer une collecte", lead: "Quelques minutes pour raconter l’histoire. Notre équipe la vérifie avant publication.", how: [["Environ 10 à 15 minutes", "Pas besoin de tout finir d’un coup."], ["Enregistrement automatique", "Partez quand vous voulez et reprenez plus tard, sur n’importe quel appareil."], ["Votre pièce reste privée", "Seule l’équipe de vérification la voit. La vérification prend jusqu’à 2 jours."]], start: "Commencer", continueTitle: "Reprendre là où vous en étiez", savedOn: (d: string) => `Enregistré ${d}`, needsChanges: "Modifications demandées", deviceDraft: "Reprendre ce que vous avez commencé sur cet appareil", untitled: "Collecte sans titre", startNew: "En commencer une autre" },
  save: { saving: "Enregistrement…", saved: (t: string) => `Enregistré dans votre compte · ${t}`, deviceOnly: "Gardé sur cet appareil. Ajoutez un titre pour l’enregistrer aussi dans votre compte.", failed: "Enregistrement impossible. Vérifiez votre connexion ; nous réessayons.", readyToSend: "Prêt à envoyer" },
  steps: { basics: "Pour qui", story: "Histoire", goal: "Objectif", media: "Photos", receive: "Argent", verification: "Identité", submit: "Envoi" },
  nav: { previous: "Retour", next: "Continuer", edit: "Modifier", allSteps: "Toutes les étapes", who: "Pour qui est cette collecte ?", self: "Pour moi", other: "Pour quelqu’un d’autre", org: "Pour une organisation", selfHint: "Pour mon propre besoin", otherHint: "Une personne, une famille ou une communauté", orgHint: "Une école, une église ou un groupe", selfName: "Votre nom", orgName: "Nom de l’organisation", authorization: "Si vous collectez pour quelqu’un d’autre, ajoutez une preuve que vous en avez le droit (une lettre, un message de sa part)." },
  ready: { title: "Préparez ceci avant de commencer", items: ["Une photo nette", "Votre pièce d’identité et un selfie en la tenant", "Un compte MonCash, NatCash, bancaire ou de transfert"], dismiss: "Je suis prêt" },
  c: {
    addDocument: "Ajouter un document", addPhoto: "Ajouter une photo", beneficiary: "Son nom", choose: "Choisir", commune: "Ville ou commune", department: "Département",
    consentTruth: "Tout ce que j’ai écrit est vrai.", consentTerms: "J’accepte les conditions et les règles de la communauté.", consentOff: "Je comprends que les donateurs envoient l’argent directement au destinataire. yon kout men ne garde jamais l’argent et peut retirer une collecte qui ne respecte pas les règles.",
    contactEmail: "E-mail", contactName: "Nom complet, comme sur votre pièce", groupApp: "Applications (depuis l’étranger)", groupBank: "Banque", groupTransfer: "Transfert d’argent", groupWallet: "Argent mobile",
    hintApp: "Nom du compte et e-mail ou identifiant", hintBank: "Nom du compte, numéro de compte, devise", hintOther: "Expliquez comment envoyer l’argent", hintTransfer: "Nom complet du destinataire, ville, pays", hintWallet: "Nom du compte et numéro",
    idBack: "Pièce, verso", idFront: "Pièce, recto", missing: "Il manque encore", needContact: "Ajoutez votre nom, e-mail et téléphone.", needIdentity: "Ajoutez votre pièce et un selfie en la tenant.", needRecipient: "Indiquez pour qui est la collecte.",
    referenceContact: "Son téléphone ou e-mail", referenceName: "Quelqu’un qui peut confirmer votre histoire", relation: "Quel est votre lien ?", selfie: "Vous tenant votre pièce",
    tooBig: "Fichier trop lourd. Utilisez-en un de moins de 8 Mo.", uploadFailed: "L’envoi a échoué. Vérifiez votre connexion et réessayez.", uploaded: "Envoyé", uploading: "Envoi…",
  },
  ui: {
    coverTitle: "Photo de couverture", coverHint: "C’est la première chose que les gens voient. Utilisez une vraie photo nette.", coverAdd: "Ajouter la photo de couverture", coverChange: "Changer la photo de couverture", galleryTitle: "Galerie", galleryHint: "D’autres photos ou de courtes vidéos (jusqu’à 9). Une courte vidéo au téléphone inspire confiance. Moins de 50 Mo par vidéo.", galleryAdd: "Ajouter photos ou vidéos", videoTooBig: "Vidéo trop lourde. Utilisez-en une plus courte (moins de 50 Mo).", video: "Vidéo",
    addMethod: "Ajouter un moyen de recevoir l’argent", chooseMethod: "Choisir…", city: "Ville et région", complete: "Terminé", contact: "Comment vous joindre", contactExtra: "Autre chose à savoir ?", country: "Pays", cover: "Couverture",
    deadline: "Date de fin", delete: "Supprimer", desc: "L’histoire", details: "Détails", evidence: "Plus de preuves", goal: "De combien avez-vous besoin ?", goalEmpty: "Laissez vide s’il n’y a pas de montant fixe.", identity: "Votre pièce d’identité",
    invalidDate: "Choisissez une date valide.", invalidGoal: "Entrez un montant supérieur à 0.", location: "Où se trouvent-ils ?", makeCover: "Mettre en couverture", noGoal: "Sans montant fixe", phone: "Téléphone ou WhatsApp",
    photoError: "Certaines photos n’ont pas été envoyées. Réessayez.", photoHelp: "Jusqu’à 10 vraies photos. La première sert de couverture.", photoMenu: "Options de la photo", photoTitle: "Photos", photos: "Photos", addCover: "Ajouter une photo de couverture",
    removeMethod: "Retirer", requiredCountry: "Choisissez un pays.", requiredLocation: "Ajoutez la ville ou la région.", requiredRole: "Ajoutez votre rôle.", reviewTitle: "Vérifier et envoyer", role: "Votre rôle dans l’organisation",
    story: "Racontez l’histoire", storyHelp: "Dites ce qui s’est passé et ce que l’argent paiera. Écrivez comme vous parlez.", title: "Titre", uploading: "Envoi des photos",
    summaryPhotos: (n: number) => plural(n, "photo", "photos"), summaryMethods: (n: number) => plural(n, "moyen de réception", "moyens de réception"), summaryDocs: (n: number) => n ? plural(n, "document privé", "documents privés") : "Aucun document pour l’instant",
    moreProof: "Ajouter plus de preuves", moreProofHint: "Facultatif, mais cela aide l’équipe à vérifier plus vite.",
  },
  verification: {
    consent: "J’autorise l’équipe de vérification à utiliser ces documents pour confirmer mon identité.", consentError: "Cochez cette case pour continuer.", contactHint: "Seule notre équipe voit ceci.", correction: "À corriger",
    format: "Photo JPEG, PNG ou WebP", identityHint: "Une pièce d’identité officielle avec photo, et une photo de vous la tenant. Votre visage et la pièce doivent être nets.", intro: "Privé. Seule l’équipe de vérification voit cette étape.", invalidFile: "Utilisez une photo JPEG, PNG ou WebP.",
    privateDraft: "Votre pièce et vos coordonnées ne restent pas sur cet appareil. Enregistrez le brouillon pour les garder.", recipientEvidence: "Par exemple : une facture d’hôpital, une lettre de l’école, ou un message de la personne aidée.",
    remove: (l: string) => `Retirer ${l.toLowerCase()}`, replace: "Remplacer", title: "Votre identité", uploaded: "Envoyé en privé",
  },
  k: {
    category: { label: "Quel type de besoin ?", hint: "" }, cover: { demoReplace: "Ceci est une photo d’exemple. Ajoutez la vôtre." }, goal: { label: "Montant" }, items: { consent: "Confirmations" },
    media: { documents: "Documents", documentsHint: "Photos ou PDF. Seule notre équipe les voit." }, receive: { label: "Comment recevrez-vous l’argent ?" }, side: { preview: "Aperçu de la carte" },
    submit: { changesHint: "La version publique reste en ligne jusqu’à l’approbation des changements.", eta: "Nous répondons en général sous 2 jours.", hint: "Nous vérifions votre pièce et les coordonnées de réception avant la publication.", label: "Envoyer pour vérification", reach: (e: string) => `Nous vous écrirons à ${e}.` },
    title: { ph: "Aidez Marie à payer son opération" },
  },
  x: {
    err: { cause: "Choisissez le type de besoin.", consent: "Cochez toutes les cases.", cover: "Ajoutez une photo de couverture.", department: "Choisissez un département.", details: "Remplissez les détails.", link: "Un lien doit commencer par https://", method: "Ajoutez au moins un moyen de recevoir l’argent.", title: "Écrivez un titre (4 lettres minimum)." },
    link: "Lien de paiement", linkHint: "Par exemple un lien PayPal ou Cash App (https://)", liveNote: "Cette collecte est publique. Les changements passent d’abord en vérification.", optional: "facultatif",
    saveDraft: "Enregistrer le brouillon", saving: "Enregistrement…", savedAccount: (t: string) => `Enregistré à ${t}`, savedDeviceAt: (t: string) => `Gardé sur cet appareil · ${t}`, submitChanges: "Envoyer les changements", title: "Lancer une collecte",
  },
  pay: { holder: "Nom du compte", phone: "Numéro de téléphone", account: "Numéro de compte", currency: "Devise", country: "Pays", city: "Ville", handle: "E-mail, téléphone ou $identifiant", name: "Nom du moyen", instructions: "Comment envoyer" },
};

const en: FormText = {
  intro: { title: "Start a fundraiser", lead: "A few minutes to tell the story. Our team checks it before it goes public.", how: [["About 10–15 minutes", "You don’t have to finish in one go."], ["Saves as you go", "Leave anytime and pick up later, on any device."], ["Your ID stays private", "Only our review team sees it. Review takes up to 2 days."]], start: "Start", continueTitle: "Pick up where you left off", savedOn: (d: string) => `Saved ${d}`, needsChanges: "Needs changes", deviceDraft: "Continue what you started on this device", untitled: "Untitled fundraiser", startNew: "Start a new one" },
  save: { saving: "Saving…", saved: (t: string) => `Saved to your account · ${t}`, deviceOnly: "Saved on this device. Add a title to also save it to your account.", failed: "Couldn’t save. Check your connection; we’ll keep trying.", readyToSend: "Ready to send" },
  steps: { basics: "Who", story: "Story", goal: "Goal", media: "Photos", receive: "Money", verification: "ID", submit: "Send" },
  nav: { previous: "Back", next: "Continue", edit: "Edit", allSteps: "All steps", who: "Who is this fundraiser for?", self: "Me", other: "Someone else", org: "An organization", selfHint: "For my own need", otherHint: "A person, family or community", orgHint: "A school, church or group", selfName: "Your name", orgName: "Organization name", authorization: "Raising for someone else? Add proof you’re allowed to (a letter, or a message from them)." },
  ready: { title: "Have these ready", items: ["A clear photo", "Your ID and a selfie holding it", "A MonCash, NatCash, bank or transfer account"], dismiss: "I’m ready" },
  c: {
    addDocument: "Add a document", addPhoto: "Add photo", beneficiary: "Their name", choose: "Choose", commune: "Town or commune", department: "Department",
    consentTruth: "Everything I wrote is true.", consentTerms: "I accept the terms and community rules.", consentOff: "I understand supporters send money directly to the receiver. yon kout men never holds the money and can remove a fundraiser that breaks the rules.",
    contactEmail: "Email", contactName: "Full name, as on your ID", groupApp: "Apps (from abroad)", groupBank: "Bank", groupTransfer: "Money transfer", groupWallet: "Mobile money",
    hintApp: "Name on the account and email or @handle", hintBank: "Name on the account, account number, currency", hintOther: "Explain how people can send the money", hintTransfer: "Receiver’s full name, city, country", hintWallet: "Name on the account and the number",
    idBack: "ID, back", idFront: "ID, front", missing: "Still needed", needContact: "Add your name, email and phone.", needIdentity: "Add your ID and a selfie holding it.", needRecipient: "Say who it’s for.",
    referenceContact: "Their phone or email", referenceName: "Someone who can confirm your story", relation: "How do you know them?", selfie: "You holding your ID",
    tooBig: "This file is too big. Use one under 8 MB.", uploadFailed: "Upload failed. Check your connection and try again.", uploaded: "Uploaded", uploading: "Uploading…",
  },
  ui: {
    coverTitle: "Cover photo", coverHint: "The first thing people see. Use a clear, real photo.", coverAdd: "Add cover photo", coverChange: "Change cover photo", galleryTitle: "Gallery", galleryHint: "More photos or short videos (up to 9). A short phone video builds trust. Each video must be under 50 MB.", galleryAdd: "Add photos or videos", videoTooBig: "This video is too big. Use a shorter one (under 50 MB).", video: "Video",
    addMethod: "Add a way to receive money", chooseMethod: "Choose…", city: "City and region", complete: "Done", contact: "How we reach you", contactExtra: "Anything else we should know?", country: "Country", cover: "Cover",
    deadline: "End date", delete: "Delete", desc: "The story", details: "Details", evidence: "More proof", goal: "How much do you need?", goalEmpty: "Leave it empty if there’s no fixed amount.", identity: "Your ID",
    invalidDate: "Choose a valid date.", invalidGoal: "Enter an amount above 0.", location: "Where are they?", makeCover: "Use as cover", noGoal: "No fixed amount", phone: "Phone or WhatsApp",
    photoError: "Some photos didn’t upload. Try again.", photoHelp: "Up to 10 real photos. The first is the cover.", photoMenu: "Photo options", photoTitle: "Photos", photos: "Photos", addCover: "Add a cover photo",
    removeMethod: "Remove", requiredCountry: "Choose a country.", requiredLocation: "Add the city or region.", requiredRole: "Add your role.", reviewTitle: "Check and send", role: "Your role there",
    story: "Tell the story", storyHelp: "Say what happened and what the money will pay for. Write the way you speak.", title: "Title", uploading: "Uploading photos",
    summaryPhotos: (n: number) => plural(n, "photo", "photos"), summaryMethods: (n: number) => plural(n, "way to receive money", "ways to receive money"), summaryDocs: (n: number) => n ? plural(n, "private document", "private documents") : "No documents yet",
    moreProof: "Add more proof", moreProofHint: "Not required, but it helps our team check faster.",
  },
  verification: {
    consent: "I let the review team use these documents to confirm who I am.", consentError: "Tick this box to continue.", contactHint: "Only our team sees this.", correction: "What to fix",
    format: "JPEG, PNG or WebP photo", identityHint: "A government photo ID, and a photo of you holding it. Your face and the ID must be clear.", intro: "Private. Only our review team sees this step.", invalidFile: "Use a JPEG, PNG or WebP photo.",
    privateDraft: "Your ID and contacts aren’t kept on this device. Save the draft to keep them.", recipientEvidence: "For example: a hospital bill, a school letter, or a message from the person you’re helping.",
    remove: (l: string) => `Remove ${l.toLowerCase()}`, replace: "Replace", title: "Your identity", uploaded: "Uploaded privately",
  },
  k: {
    category: { label: "What kind of need?", hint: "" }, cover: { demoReplace: "This is a sample photo. Add your own." }, goal: { label: "Amount" }, items: { consent: "Confirmations" },
    media: { documents: "Documents", documentsHint: "Photos or PDF. Only our team sees them." }, receive: { label: "How will you receive the money?" }, side: { preview: "Card preview" },
    submit: { changesHint: "Your public version stays up until we approve the changes.", eta: "We usually reply within 2 days.", hint: "We check your ID and the receiving details before it goes public.", label: "Send for review", reach: (e: string) => `We’ll email you at ${e}.` },
    title: { ph: "Help Marie pay for her surgery" },
  },
  x: {
    err: { cause: "Choose the kind of need.", consent: "Tick all the boxes.", cover: "Add a cover photo.", department: "Choose a department.", details: "Fill in the details.", link: "A link must start with https://", method: "Add at least one way to receive money.", title: "Write a title (4+ letters)." },
    link: "Payment link", linkHint: "For example a PayPal or Cash App link (https://)", liveNote: "This fundraiser is public. Changes go to review first.", optional: "optional",
    saveDraft: "Save draft", saving: "Saving…", savedAccount: (t: string) => `Saved at ${t}`, savedDeviceAt: (t: string) => `Kept on this device · ${t}`, submitChanges: "Send changes", title: "Start a fundraiser",
  },
  pay: { holder: "Name on the account", phone: "Phone number", account: "Account number", currency: "Currency", country: "Country", city: "City", handle: "Email, phone or $tag", name: "Method name", instructions: "How to send" },
};

const es: FormText = {
  intro: { title: "Iniciar una recaudación", lead: "Unos minutos para contar la historia. Nuestro equipo la revisa antes de publicarla.", how: [["Unos 10 a 15 minutos", "No tienes que terminar de una vez."], ["Se guarda sola", "Sal cuando quieras y sigue después, en cualquier dispositivo."], ["Tu documento es privado", "Solo el equipo de revisión lo ve. La revisión tarda hasta 2 días."]], start: "Empezar", continueTitle: "Sigue donde lo dejaste", savedOn: (d: string) => `Guardado ${d}`, needsChanges: "Requiere cambios", deviceDraft: "Continuar lo que empezaste en este dispositivo", untitled: "Recaudación sin título", startNew: "Empezar otra" },
  save: { saving: "Guardando…", saved: (t: string) => `Guardado en tu cuenta · ${t}`, deviceOnly: "Guardado en este dispositivo. Añade un título para guardarlo también en tu cuenta.", failed: "No se pudo guardar. Revisa tu conexión; lo seguiremos intentando.", readyToSend: "Listo para enviar" },
  steps: { basics: "Para quién", story: "Historia", goal: "Meta", media: "Fotos", receive: "Dinero", verification: "Identidad", submit: "Enviar" },
  nav: { previous: "Atrás", next: "Continuar", edit: "Editar", allSteps: "Todos los pasos", who: "¿Para quién es esta recaudación?", self: "Para mí", other: "Para otra persona", org: "Para una organización", selfHint: "Para mi propia necesidad", otherHint: "Una persona, familia o comunidad", orgHint: "Una escuela, iglesia o grupo", selfName: "Tu nombre", orgName: "Nombre de la organización", authorization: "¿Recaudas para otra persona? Añade una prueba de que puedes hacerlo (una carta o un mensaje suyo)." },
  ready: { title: "Ten esto a mano", items: ["Una foto clara", "Tu documento y una selfie sosteniéndolo", "Una cuenta MonCash, NatCash, bancaria o de envío"], dismiss: "Estoy listo" },
  c: {
    addDocument: "Añadir un documento", addPhoto: "Añadir foto", beneficiary: "Su nombre", choose: "Elegir", commune: "Ciudad o comuna", department: "Departamento",
    consentTruth: "Todo lo que escribí es verdad.", consentTerms: "Acepto las condiciones y las reglas de la comunidad.", consentOff: "Entiendo que los donantes envían el dinero directamente a quien lo recibe. yon kout men nunca guarda el dinero y puede retirar una recaudación que no cumpla las reglas.",
    contactEmail: "Correo", contactName: "Nombre completo, como en tu documento", groupApp: "Apps (desde el exterior)", groupBank: "Banco", groupTransfer: "Envío de dinero", groupWallet: "Dinero móvil",
    hintApp: "Nombre de la cuenta y correo o usuario", hintBank: "Nombre de la cuenta, número de cuenta, moneda", hintOther: "Explica cómo enviar el dinero", hintTransfer: "Nombre completo de quien recibe, ciudad, país", hintWallet: "Nombre de la cuenta y el número",
    idBack: "Documento, reverso", idFront: "Documento, frente", missing: "Aún falta", needContact: "Añade tu nombre, correo y teléfono.", needIdentity: "Añade tu documento y una selfie sosteniéndolo.", needRecipient: "Di para quién es.",
    referenceContact: "Su teléfono o correo", referenceName: "Alguien que pueda confirmar tu historia", relation: "¿Qué relación tienes?", selfie: "Tú sosteniendo tu documento",
    tooBig: "El archivo es muy grande. Usa uno de menos de 8 MB.", uploadFailed: "No se pudo subir. Revisa tu conexión e inténtalo de nuevo.", uploaded: "Subido", uploading: "Subiendo…",
  },
  ui: {
    coverTitle: "Foto de portada", coverHint: "Es lo primero que ven. Usa una foto real y clara.", coverAdd: "Añadir foto de portada", coverChange: "Cambiar foto de portada", galleryTitle: "Galería", galleryHint: "Más fotos o videos cortos (hasta 9). Un video corto con el teléfono genera confianza. Menos de 50 MB por video.", galleryAdd: "Añadir fotos o videos", videoTooBig: "El video es muy grande. Usa uno más corto (menos de 50 MB).", video: "Video",
    addMethod: "Añadir una forma de recibir el dinero", chooseMethod: "Elegir…", city: "Ciudad y región", complete: "Listo", contact: "Cómo contactarte", contactExtra: "¿Algo más que debamos saber?", country: "País", cover: "Portada",
    deadline: "Fecha de fin", delete: "Eliminar", desc: "La historia", details: "Datos", evidence: "Más pruebas", goal: "¿Cuánto necesitas?", goalEmpty: "Déjalo vacío si no hay un monto fijo.", identity: "Tu documento",
    invalidDate: "Elige una fecha válida.", invalidGoal: "Escribe un monto mayor que 0.", location: "¿Dónde están?", makeCover: "Usar como portada", noGoal: "Sin monto fijo", phone: "Teléfono o WhatsApp",
    photoError: "Algunas fotos no se subieron. Inténtalo de nuevo.", photoHelp: "Hasta 10 fotos reales. La primera es la portada.", photoMenu: "Opciones de foto", photoTitle: "Fotos", photos: "Fotos", addCover: "Añadir una foto de portada",
    removeMethod: "Quitar", requiredCountry: "Elige un país.", requiredLocation: "Añade la ciudad o la región.", requiredRole: "Añade tu función.", reviewTitle: "Revisar y enviar", role: "Tu función ahí",
    story: "Cuenta la historia", storyHelp: "Di qué pasó y qué pagará el dinero. Escribe como hablas.", title: "Título", uploading: "Subiendo fotos",
    summaryPhotos: (n: number) => plural(n, "foto", "fotos"), summaryMethods: (n: number) => plural(n, "forma de recibir dinero", "formas de recibir dinero"), summaryDocs: (n: number) => n ? plural(n, "documento privado", "documentos privados") : "Aún no hay documentos",
    moreProof: "Añadir más pruebas", moreProofHint: "No es obligatorio, pero ayuda a revisar más rápido.",
  },
  verification: {
    consent: "Permito que el equipo de revisión use estos documentos para confirmar quién soy.", consentError: "Marca esta casilla para continuar.", contactHint: "Solo nuestro equipo ve esto.", correction: "Qué corregir",
    format: "Foto JPEG, PNG o WebP", identityHint: "Un documento oficial con foto y una foto tuya sosteniéndolo. Tu cara y el documento deben verse claros.", intro: "Privado. Solo el equipo de revisión ve este paso.", invalidFile: "Usa una foto JPEG, PNG o WebP.",
    privateDraft: "Tu documento y tus contactos no se guardan en este dispositivo. Guarda el borrador para conservarlos.", recipientEvidence: "Por ejemplo: una factura del hospital, una carta de la escuela o un mensaje de la persona a quien ayudas.",
    remove: (l: string) => `Quitar ${l.toLowerCase()}`, replace: "Reemplazar", title: "Tu identidad", uploaded: "Subido en privado",
  },
  k: {
    category: { label: "¿Qué tipo de necesidad?", hint: "" }, cover: { demoReplace: "Es una foto de ejemplo. Añade la tuya." }, goal: { label: "Monto" }, items: { consent: "Confirmaciones" },
    media: { documents: "Documentos", documentsHint: "Fotos o PDF. Solo nuestro equipo los ve." }, receive: { label: "¿Cómo recibirás el dinero?" }, side: { preview: "Vista de la tarjeta" },
    submit: { changesHint: "Tu versión pública sigue visible hasta que aprobemos los cambios.", eta: "Solemos responder en 2 días.", hint: "Revisamos tu documento y los datos para recibir el dinero antes de publicar.", label: "Enviar a revisión", reach: (e: string) => `Te escribiremos a ${e}.` },
    title: { ph: "Ayuda a Marie a pagar su cirugía" },
  },
  x: {
    err: { cause: "Elige el tipo de necesidad.", consent: "Marca todas las casillas.", cover: "Añade una foto de portada.", department: "Elige un departamento.", details: "Completa los datos.", link: "Un enlace debe empezar por https://", method: "Añade al menos una forma de recibir el dinero.", title: "Escribe un título (4 letras o más)." },
    link: "Enlace de pago", linkHint: "Por ejemplo un enlace de PayPal o Cash App (https://)", liveNote: "Esta recaudación es pública. Los cambios pasan primero por revisión.", optional: "opcional",
    saveDraft: "Guardar borrador", saving: "Guardando…", savedAccount: (t: string) => `Guardado a las ${t}`, savedDeviceAt: (t: string) => `Guardado en este dispositivo · ${t}`, submitChanges: "Enviar cambios", title: "Iniciar una recaudación",
  },
  pay: { holder: "Nombre de la cuenta", phone: "Número de teléfono", account: "Número de cuenta", currency: "Moneda", country: "País", city: "Ciudad", handle: "Correo, teléfono o $usuario", name: "Nombre del método", instructions: "Cómo enviar" },
};

export const formText: Record<Locale, FormText> = { ht, fr, en, es };
