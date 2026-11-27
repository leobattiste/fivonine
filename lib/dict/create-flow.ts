import type { Locale } from "../i18n";
import type { PaymentIssue } from "../payment-fields";

/** Copy for the guided fundraiser application: progress, story help, budget, preview and next steps. */
type Copy = {
  stepOf: (n: number, total: number) => string; minutesLeft: (m: number) => string; almostDone: string;
  why: { title: string; points: [string, string][] };
  prompts: { title: string; byCause: Record<string, string[]>; fallback: string[]; useGuide: string; guideHeadings: string[]; tipsTitle: string; tips: string[] };
  meter: { short: string; ok: string; good: string; chars: (n: number) => string };
  budget: { title: string; hint: string; label: string; labelPh: string; amount: string; add: string; remove: string; total: string; useAsGoal: string; mismatch: (goal: string, total: string) => string; invalid: string };
  goalHint: string; deadlinePick: string; days: (n: number) => string; noEnd: string; deadlineHint: string;
  video: { label: string; hint: string; invalid: string };
  pay: Record<PaymentIssue, string> & { sendsTo: string; doubleCheck: string };
  consentOther: (name: string) => string; consentOrg: (name: string) => string;
  preview: { open: string; title: string; note: string; close: string; support: string; budget: string; video: string; organizer: string; noStory: string; noMethods: string };
  coOrg: string;
  after: { title: string; steps: (email: string) => string[]; shareTitle: string; shareBody: string; message: (title: string, url: string) => string; copy: string; copied: string; teamTitle: string; teamBody: string; teamCta: string };
};

export const createFlow: Record<Locale, Copy> = {
  en: {
    stepOf: (n, t) => `Step ${n} of ${t}`, minutesLeft: (m) => `About ${m} min left`, almostDone: "Last step",
    why: { title: "Why we ask for ID", points: [
      ["Why", "Supporters send money directly to you. A checked identity is how they know a real, accountable person runs this fundraiser."],
      ["Who sees it", "Only our review team. Your ID and selfie never appear on your fundraiser and are never shared."],
      ["How long", "Review usually takes up to 2 days. We email you as soon as it is done."],
      ["Tip", "Use good light and keep all four corners of the ID in the photo."],
    ] },
    prompts: {
      title: "Not sure what to write? Answer these:",
      byCause: {
        medical: ["Who is sick or injured, and how are they related to you?", "What happened, in your own words?", "What treatment is needed, and where?", "What exactly will the money pay for?", "Who receives the money, and how will you share updates?"],
        education: ["Who is the student, and what are they studying?", "Which school, and for which year or term?", "What do fees, books or transport cost?", "What will change for them if they can study?", "Who receives the money?"],
        emergency: ["What happened, and when?", "Who was affected, and where are they now?", "What do they need most right now?", "What will the money pay for first?", "Who receives the money?"],
        community: ["Which community, and where is it?", "What is the project and who leads it?", "Who will benefit, and how many people?", "What will the money pay for?", "How will you show progress to supporters?"],
      },
      fallback: ["Who is this for, and how are you connected?", "What happened, in your own words?", "What exactly will the money pay for?", "Who receives the money?", "How will you keep supporters updated?"],
      useGuide: "Start with an outline", guideHeadings: ["Who this is for", "What happened", "How the money will help", "Who receives the money"],
      tipsTitle: "What makes supporters trust a story", tips: ["Real names and places, shared with permission", "Exactly what the money pays for", "Who receives it and how", "A recent, clear photo"],
    },
    meter: { short: "Too short to submit yet", ok: "Good start. Add how the money will help", good: "Strong story length", chars: (n) => `${n} characters` },
    budget: { title: "How the money will be used", hint: "Supporters give more when they can see where the money goes. Add up to 6 lines.", label: "What it pays for", labelPh: "e.g. Surgery fee", amount: "Amount", add: "Add a line", remove: "Remove line", total: "Total", useAsGoal: "Use total as goal", mismatch: (g, t) => `Your goal is ${g} but the lines add up to ${t}.`, invalid: "Give each line a name and an amount." },
    goalHint: "Set an amount you can explain. The breakdown below helps supporters see why.", deadlinePick: "Quick pick", days: (n) => `In ${n} days`, noEnd: "No end date", deadlineHint: "The end date shows on your fundraiser so supporters know how soon help is needed. You can change it later.",
    video: { label: "Video link", hint: "A 30-second phone video builds trust. Post it on YouTube, Facebook, TikTok or Instagram and paste the link.", invalid: "Paste a full link that starts with https://" },
    pay: { holder: "Enter the recipient’s full name, as on their ID.", phone: "Enter an 8-digit Haitian number, e.g. 3712 3456.", account: "Check the account number. Use digits, at least 6.", handle: "Check this. Use an email, a phone number or a $cashtag.", sendsTo: "Supporters will send to", doubleCheck: "Check carefully. Supporters send money to exactly these details." },
    consentOther: (n) => `${n || "The person I am raising for"} knows about this fundraiser and agrees to it.`,
    consentOrg: (n) => `I am authorized by ${n || "the organization"} to raise funds for it.`,
    preview: { open: "See it as supporters will", title: "Preview", note: "This is how your fundraiser will look once it is approved.", close: "Close preview", support: "How to support", budget: "How the money will be used", video: "Watch the video", organizer: "Organized by", noStory: "Your story will appear here.", noMethods: "Add at least one way to receive support." },
    coOrg: "Want help running it? After you submit, you can add co-organizers from your dashboard.",
    after: { title: "What happens next", steps: (e) => ["We review your fundraiser. This usually takes up to 2 days.", `We email you at ${e} when it is approved, or if we need a change.`, "Once it is live, share it on WhatsApp and with your family groups."], shareTitle: "Your share message is ready", shareBody: "Copy it now. The link works as soon as your fundraiser is approved.", message: (t, u) => `Please help: ${t}. Every contribution, big or small, counts. ${u}`, copy: "Copy message", copied: "Message copied", teamTitle: "Add a co-organizer", teamBody: "A family member or friend can help post updates and answer questions.", teamCta: "Add someone" },
  },
  fr: {
    stepOf: (n, t) => `Étape ${n} sur ${t}`, minutesLeft: (m) => `Environ ${m} min restantes`, almostDone: "Dernière étape",
    why: { title: "Pourquoi nous demandons une pièce d’identité", points: [
      ["Pourquoi", "Les donateurs vous envoient l’argent directement. Une identité vérifiée leur montre qu’une personne réelle et responsable gère cette collecte."],
      ["Qui la voit", "Seulement notre équipe de vérification. Votre pièce et votre selfie n’apparaissent jamais sur la collecte et ne sont jamais partagés."],
      ["Délai", "La vérification prend en général jusqu’à 2 jours. Nous vous écrivons dès qu’elle est terminée."],
      ["Conseil", "Prenez la photo à la lumière, avec les quatre coins de la pièce visibles."],
    ] },
    prompts: {
      title: "Vous ne savez pas quoi écrire ? Répondez à ces questions :",
      byCause: {
        medical: ["Qui est malade ou blessé, et quel est votre lien avec cette personne ?", "Que s’est-il passé, avec vos mots ?", "Quel traitement faut-il, et où ?", "Que paiera exactement l’argent ?", "Qui reçoit l’argent, et comment donnerez-vous des nouvelles ?"],
        education: ["Qui est l’élève ou l’étudiant, et qu’étudie-t-il ?", "Quelle école, pour quelle année ?", "Combien coûtent les frais, livres ou transports ?", "Qu’est-ce que ces études changeront pour lui ?", "Qui reçoit l’argent ?"],
        emergency: ["Que s’est-il passé, et quand ?", "Qui est touché, et où se trouve-t-il maintenant ?", "De quoi a-t-il le plus besoin tout de suite ?", "Que paiera l’argent en premier ?", "Qui reçoit l’argent ?"],
        community: ["Quelle communauté, et où ?", "Quel est le projet et qui le dirige ?", "Qui en profitera, et combien de personnes ?", "Que paiera l’argent ?", "Comment montrerez-vous les progrès aux donateurs ?"],
      },
      fallback: ["Pour qui est cette collecte, et quel est votre lien ?", "Que s’est-il passé, avec vos mots ?", "Que paiera exactement l’argent ?", "Qui reçoit l’argent ?", "Comment tiendrez-vous les donateurs informés ?"],
      useGuide: "Commencer avec un plan", guideHeadings: ["Pour qui", "Ce qui s’est passé", "Comment l’argent aidera", "Qui reçoit l’argent"],
      tipsTitle: "Ce qui inspire confiance aux donateurs", tips: ["Des noms et lieux réels, partagés avec accord", "Ce que l’argent paie exactement", "Qui le reçoit et comment", "Une photo récente et nette"],
    },
    meter: { short: "Encore trop court pour soumettre", ok: "Bon début. Expliquez comment l’argent aidera", good: "Bonne longueur", chars: (n) => `${n} caractères` },
    budget: { title: "Comment l’argent sera utilisé", hint: "Les donateurs donnent plus quand ils voient où va l’argent. Jusqu’à 6 lignes.", label: "Ce que cela paie", labelPh: "ex. Frais d’opération", amount: "Montant", add: "Ajouter une ligne", remove: "Retirer la ligne", total: "Total", useAsGoal: "Utiliser le total comme objectif", mismatch: (g, t) => `Votre objectif est ${g} mais les lignes totalisent ${t}.`, invalid: "Donnez un nom et un montant à chaque ligne." },
    goalHint: "Choisissez un montant que vous pouvez expliquer. Le détail ci-dessous aide les donateurs à comprendre.", deadlinePick: "Choix rapide", days: (n) => `Dans ${n} jours`, noEnd: "Sans date de fin", deadlineHint: "La date de fin s’affiche sur la collecte pour indiquer l’urgence. Vous pourrez la modifier.",
    video: { label: "Lien vidéo", hint: "Une vidéo de 30 secondes au téléphone inspire confiance. Publiez-la sur YouTube, Facebook, TikTok ou Instagram et collez le lien.", invalid: "Collez un lien complet qui commence par https://" },
    pay: { holder: "Indiquez le nom complet du destinataire, comme sur sa pièce.", phone: "Indiquez un numéro haïtien à 8 chiffres, ex. 3712 3456.", account: "Vérifiez le numéro de compte : au moins 6 chiffres.", handle: "Vérifiez : utilisez un e-mail, un numéro ou un $cashtag.", sendsTo: "Les donateurs enverront à", doubleCheck: "Vérifiez bien. Les donateurs envoient l’argent exactement à ces coordonnées." },
    consentOther: (n) => `${n || "La personne pour qui je collecte"} est au courant de cette collecte et l’accepte.`,
    consentOrg: (n) => `Je suis autorisé par ${n || "l’organisation"} à collecter des fonds pour elle.`,
    preview: { open: "Voir comme un donateur", title: "Aperçu", note: "Voici votre collecte telle qu’elle apparaîtra une fois approuvée.", close: "Fermer l’aperçu", support: "Comment soutenir", budget: "Comment l’argent sera utilisé", video: "Voir la vidéo", organizer: "Organisée par", noStory: "Votre histoire apparaîtra ici.", noMethods: "Ajoutez au moins un moyen de réception." },
    coOrg: "Besoin d’aide pour la gérer ? Après l’envoi, vous pourrez ajouter des co-organisateurs depuis votre tableau de bord.",
    after: { title: "La suite", steps: (e) => ["Nous vérifions votre collecte, en général sous 2 jours.", `Nous vous écrivons à ${e} quand elle est approuvée, ou si un changement est nécessaire.`, "Une fois en ligne, partagez-la sur WhatsApp et dans vos groupes familiaux."], shareTitle: "Votre message de partage est prêt", shareBody: "Copiez-le maintenant. Le lien fonctionnera dès l’approbation.", message: (t, u) => `Aidez-nous : ${t}. Chaque contribution compte, petite ou grande. ${u}`, copy: "Copier le message", copied: "Message copié", teamTitle: "Ajouter un co-organisateur", teamBody: "Un proche peut aider à publier des nouvelles et à répondre aux questions.", teamCta: "Ajouter quelqu’un" },
  },
  ht: {
    stepOf: (n, t) => `Etap ${n} sou ${t}`, minutesLeft: (m) => `Anviwon ${m} minit ki rete`, almostDone: "Dènye etap",
    why: { title: "Poukisa nou mande pyès idantite", points: [
      ["Poukisa", "Moun k ap ede yo voye lajan an dirèkteman ba ou. Yon idantite ki verifye montre yo se yon moun reyèl ki responsab ranmasaj la."],
      ["Kiyès ki wè l", "Se sèlman ekip verifikasyon an. Pyès ou ak selfi ou pa janm parèt sou ranmasaj la, epi nou pa janm pataje yo."],
      ["Konbyen tan", "Verifikasyon an pran jiska 2 jou anjeneral. N ap ekri w depi li fini."],
      ["Konsèy", "Pran foto a nan bon limyè, ak 4 kwen pyès la vizib."],
    ] },
    prompts: {
      title: "Ou pa konn kisa pou w ekri? Reponn kesyon sa yo:",
      byCause: {
        medical: ["Kiyès ki malad oswa blese, e ki relasyon ou ak li?", "Kisa ki pase, nan pwòp mo pa w?", "Ki tretman li bezwen, e ki kote?", "Kisa lajan an pral peye egzakteman?", "Kiyès ki resevwa lajan an, e kijan w ap bay nouvèl?"],
        education: ["Kiyès elèv la, e kisa l ap etidye?", "Ki lekòl, pou ki ane?", "Konbyen frè, liv oswa transpò koute?", "Kisa etid sa yo pral chanje pou li?", "Kiyès ki resevwa lajan an?"],
        emergency: ["Kisa ki pase, e kilè?", "Kiyès ki afekte, e ki kote yo ye kounye a?", "Kisa yo bezwen plis kounye a?", "Kisa lajan an pral peye anvan?", "Kiyès ki resevwa lajan an?"],
        community: ["Ki kominote, e ki kote?", "Ki pwojè a, e kiyès k ap dirije l?", "Kiyès ki pral jwenn benefis, konbyen moun?", "Kisa lajan an pral peye?", "Kijan w ap montre pwogrè yo?"],
      },
      fallback: ["Pou kiyès ranmasaj sa a ye, e ki relasyon ou?", "Kisa ki pase, nan pwòp mo pa w?", "Kisa lajan an pral peye egzakteman?", "Kiyès ki resevwa lajan an?", "Kijan w ap bay moun yo nouvèl?"],
      useGuide: "Kòmanse ak yon plan", guideHeadings: ["Pou kiyès", "Kisa ki pase", "Kijan lajan an pral ede", "Kiyès ki resevwa lajan an"],
      tipsTitle: "Sa ki fè moun fè yon istwa konfyans", tips: ["Vrè non ak kote, ak pèmisyon", "Egzakteman kisa lajan an peye", "Kiyès ki resevwa l e kijan", "Yon foto resan ki klè"],
    },
    meter: { short: "Twò kout toujou pou voye", ok: "Bon kòmansman. Esplike kijan lajan an pral ede", good: "Bon longè", chars: (n) => `${n} karaktè` },
    budget: { title: "Kijan lajan an pral sèvi", hint: "Moun bay plis lè yo wè kote lajan an ale. Jiska 6 liy.", label: "Kisa li peye", labelPh: "eg. Frè operasyon", amount: "Montan", add: "Ajoute yon liy", remove: "Retire liy lan", total: "Total", useAsGoal: "Sèvi ak total la kòm objektif", mismatch: (g, t) => `Objektif ou se ${g} men liy yo fè ${t}.`, invalid: "Bay chak liy yon non ak yon montan." },
    goalHint: "Chwazi yon montan ou ka esplike. Detay ki anba a ede moun konprann.", deadlinePick: "Chwa rapid", days: (n) => `Nan ${n} jou`, noEnd: "Pa gen dat fen", deadlineHint: "Dat fen an parèt sou ranmasaj la pou moun konnen ijans lan. Ou ka chanje l pita.",
    video: { label: "Lyen videyo", hint: "Yon videyo 30 segonn ak telefòn bay konfyans. Mete l sou YouTube, Facebook, TikTok oswa Instagram epi kole lyen an.", invalid: "Kole yon lyen konplè ki kòmanse ak https://" },
    pay: { holder: "Antre non konplè moun k ap resevwa a, jan li ye sou pyès li.", phone: "Antre yon nimewo ayisyen 8 chif, eg. 3712 3456.", account: "Verifye nimewo kont lan: omwen 6 chif.", handle: "Verifye sa a: sèvi ak yon imèl, yon nimewo oswa yon $cashtag.", sendsTo: "Moun yo pral voye bay", doubleCheck: "Verifye byen. Moun yo voye lajan an egzakteman sou enfòmasyon sa yo." },
    consentOther: (n) => `${n || "Moun m ap ranmase pou li a"} konnen ranmasaj sa a epi li dakò.`,
    consentOrg: (n) => `${n || "Òganizasyon an"} otorize m pou m ranmase lajan pou li.`,
    preview: { open: "Gade l jan moun yo pral wè l", title: "Apèsi", note: "Men jan ranmasaj ou a pral parèt lè yo apwouve l.", close: "Fèmen apèsi a", support: "Kijan pou ede", budget: "Kijan lajan an pral sèvi", video: "Gade videyo a", organizer: "Òganize pa", noStory: "Istwa w ap parèt la a.", noMethods: "Ajoute omwen yon fason pou resevwa." },
    coOrg: "Ou bezwen èd pou jere l? Apre w voye l, ou ka ajoute ko-òganizatè nan tablo bò kont ou.",
    after: { title: "Sa k ap vini apre", steps: (e) => ["Nou verifye ranmasaj ou a. Sa pran jiska 2 jou anjeneral.", `N ap ekri w nan ${e} lè li apwouve, oswa si nou bezwen yon chanjman.`, "Lè l piblik, pataje l sou WhatsApp ak nan gwoup fanmi w."], shareTitle: "Mesaj pou pataje a pare", shareBody: "Kopye l kounye a. Lyen an ap mache depi yo apwouve ranmasaj la.", message: (t, u) => `Tanpri ede: ${t}. Chak kout men konte, piti kou gwo. ${u}`, copy: "Kopye mesaj la", copied: "Mesaj la kopye", teamTitle: "Ajoute yon ko-òganizatè", teamBody: "Yon fanmi oswa yon zanmi ka ede w poste nouvèl epi reponn kesyon.", teamCta: "Ajoute yon moun" },
  },
  es: {
    stepOf: (n, t) => `Paso ${n} de ${t}`, minutesLeft: (m) => `Unos ${m} min restantes`, almostDone: "Último paso",
    why: { title: "Por qué pedimos identificación", points: [
      ["Por qué", "Quienes apoyan te envían el dinero directamente. Una identidad verificada les muestra que una persona real y responsable gestiona esta recaudación."],
      ["Quién la ve", "Solo nuestro equipo de revisión. Tu identificación y tu selfie nunca aparecen en la recaudación ni se comparten."],
      ["Cuánto tarda", "La revisión suele tardar hasta 2 días. Te escribimos en cuanto termine."],
      ["Consejo", "Usa buena luz y deja visibles las cuatro esquinas del documento."],
    ] },
    prompts: {
      title: "¿No sabes qué escribir? Responde a estas preguntas:",
      byCause: {
        medical: ["¿Quién está enfermo o herido y qué relación tienes con esa persona?", "¿Qué pasó, con tus propias palabras?", "¿Qué tratamiento necesita y dónde?", "¿Qué pagará exactamente el dinero?", "¿Quién recibe el dinero y cómo compartirás novedades?"],
        education: ["¿Quién es el estudiante y qué estudia?", "¿Qué escuela y para qué año?", "¿Cuánto cuestan matrícula, libros o transporte?", "¿Qué cambiará para esa persona si puede estudiar?", "¿Quién recibe el dinero?"],
        emergency: ["¿Qué pasó y cuándo?", "¿Quién resultó afectado y dónde está ahora?", "¿Qué necesita con más urgencia?", "¿Qué pagará primero el dinero?", "¿Quién recibe el dinero?"],
        community: ["¿Qué comunidad y dónde está?", "¿Cuál es el proyecto y quién lo dirige?", "¿Quiénes se beneficiarán y cuántas personas?", "¿Qué pagará el dinero?", "¿Cómo mostrarás el avance a quienes apoyan?"],
      },
      fallback: ["¿Para quién es y qué relación tienes?", "¿Qué pasó, con tus propias palabras?", "¿Qué pagará exactamente el dinero?", "¿Quién recibe el dinero?", "¿Cómo mantendrás informados a quienes apoyan?"],
      useGuide: "Empezar con un esquema", guideHeadings: ["Para quién es", "Qué pasó", "Cómo ayudará el dinero", "Quién recibe el dinero"],
      tipsTitle: "Lo que genera confianza", tips: ["Nombres y lugares reales, con permiso", "Qué paga exactamente el dinero", "Quién lo recibe y cómo", "Una foto reciente y clara"],
    },
    meter: { short: "Aún es demasiado corta para enviar", ok: "Buen comienzo. Explica cómo ayudará el dinero", good: "Buena extensión", chars: (n) => `${n} caracteres` },
    budget: { title: "Cómo se usará el dinero", hint: "La gente aporta más cuando ve a dónde va el dinero. Hasta 6 líneas.", label: "Qué paga", labelPh: "p. ej. Costo de la cirugía", amount: "Monto", add: "Añadir línea", remove: "Quitar línea", total: "Total", useAsGoal: "Usar el total como meta", mismatch: (g, t) => `Tu meta es ${g} pero las líneas suman ${t}.`, invalid: "Pon un nombre y un monto en cada línea." },
    goalHint: "Elige un monto que puedas explicar. El desglose de abajo ayuda a entender por qué.", deadlinePick: "Elección rápida", days: (n) => `En ${n} días`, noEnd: "Sin fecha de fin", deadlineHint: "La fecha de fin aparece en la recaudación para indicar la urgencia. Puedes cambiarla después.",
    video: { label: "Enlace de video", hint: "Un video de 30 segundos con el teléfono genera confianza. Súbelo a YouTube, Facebook, TikTok o Instagram y pega el enlace.", invalid: "Pega un enlace completo que empiece por https://" },
    pay: { holder: "Escribe el nombre completo del destinatario, como en su documento.", phone: "Escribe un número haitiano de 8 dígitos, p. ej. 3712 3456.", account: "Revisa el número de cuenta: al menos 6 dígitos.", handle: "Revisa esto: usa un correo, un teléfono o un $cashtag.", sendsTo: "Quienes apoyan enviarán a", doubleCheck: "Revisa con cuidado. El dinero se envía exactamente a estos datos." },
    consentOther: (n) => `${n || "La persona para quien recaudo"} sabe de esta recaudación y está de acuerdo.`,
    consentOrg: (n) => `${n || "La organización"} me autoriza a recaudar fondos para ella.`,
    preview: { open: "Verla como quien apoya", title: "Vista previa", note: "Así se verá tu recaudación cuando sea aprobada.", close: "Cerrar vista previa", support: "Cómo apoyar", budget: "Cómo se usará el dinero", video: "Ver el video", organizer: "Organizada por", noStory: "Tu historia aparecerá aquí.", noMethods: "Añade al menos un método para recibir apoyo." },
    coOrg: "¿Quieres ayuda para gestionarla? Después de enviarla podrás añadir co-organizadores desde tu panel.",
    after: { title: "Qué pasa ahora", steps: (e) => ["Revisamos tu recaudación. Suele tardar hasta 2 días.", `Te escribimos a ${e} cuando esté aprobada o si necesitamos un cambio.`, "Cuando esté publicada, compártela por WhatsApp y en tus grupos familiares."], shareTitle: "Tu mensaje para compartir está listo", shareBody: "Cópialo ahora. El enlace funcionará en cuanto se apruebe.", message: (t, u) => `Por favor ayuda: ${t}. Cada aporte cuenta, grande o pequeño. ${u}`, copy: "Copiar mensaje", copied: "Mensaje copiado", teamTitle: "Añadir un co-organizador", teamBody: "Un familiar o amigo puede ayudar a publicar novedades y responder preguntas.", teamCta: "Añadir a alguien" },
  },
};
