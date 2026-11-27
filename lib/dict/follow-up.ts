import type { Locale } from "@/lib/i18n";

type Copy = {
  support: { title: string; intro: string; empty: string; got: string; undo: string; gotOn: (d: string) => string; waiting: string; anon: string; saveFailed: string };
  tally: (reported: number, confirmed: number) => string;
  final: { title: string; hint: string; label: string; button: string; tag: string; short: string; done: string; cancel: string };
  send: { title: string; privacy: string; date: string; ref: string; refHint: string; phone: string; receipt: string; receiptHint: string; add: string; change: string; remove: string; uploading: string; failed: string; view: string };
  mine: { tab: string; title: string; intro: string; empty: string; waiting: string; confirmed: (d: string) => string; gone: string; find: string };
  menu: { fundraisers: string; impact: string; impactSub: string; messages: string; settings: string; donate: string; donateSub: string; fundraise: string; fundraiseSub: string; about: string; aboutSub: string; how: string; howSub: string; help: string; helpSub: string; cont: string; start: string; signIn: string; signInSub: string; profile: string };
  review: { title: string; steps: [string, string, string]; by: Record<string, { h: string; p: string }> };
};

export const followUp: Record<Locale, Copy> = {
  ht: {
    support: { title: "Moun ki di yo voye èd", intro: "Lè lajan an rive, make li. Moun ki voye l la ap resevwa yon nòt, epi paj piblik la ap montre konbyen ki konfime.", empty: "Poko gen moun ki di yo voye èd.", got: "Mwen resevwa li", undo: "Anile", gotOn: (d) => `Resevwa ${d}`, waiting: "Ap tann konfimasyon ou", anon: "Anonim", saveFailed: "Nou pa t ka anrejistre sa. Eseye ankò." },
    tally: (r, c) => `${r} moun di yo voye èd · ${c} konfime pa òganizatè a`,
    final: { title: "Fèmen ak yon rapò final", hint: "Di moun ki te ede yo kisa ki fèt ak lajan an. Rapò sa a ap parèt sou paj piblik la.", label: "Kijan lajan an te itilize?", button: "Fèmen ak rapò final", tag: "Rapò final", short: "Ekri omwen 20 karaktè.", done: "Kolèk la fèmen. Mèsi!", cancel: "Pa kounye a" },
    send: { title: "Detay transfè a", privacy: "Se sèlman ou menm, òganizatè a ak ekip li ki ka wè detay sa yo. Yo pa janm parèt sou paj piblik la.", date: "Dat ou voye l la", ref: "Nimewo konfimasyon / referans", refHint: "Li sou resi MonCash, NatCash, bank oswa Western Union ou a.", phone: "Nimewo telefòn ou te voye l ladan", receipt: "Foto resi a", receiptHint: "Foto oswa PDF. Sa ede òganizatè a jwenn lajan an pi vit.", add: "Ajoute resi", change: "Chanje", remove: "Retire", uploading: "Ap voye…", failed: "Nou pa t ka voye fichye a. Eseye ankò.", view: "Gade resi a" },
    mine: { tab: "Èd mwen voye", title: "Èd mwen voye", intro: "Tout èd ou te di ou voye yo, ak detay yo, la a nan kont ou.", empty: "Ou poko di ou voye okenn èd.", waiting: "Ap tann òganizatè a konfime", confirmed: (d: string) => `Konfime pa òganizatè a, ${d}`, gone: "Kolèk sa a pa piblik ankò", find: "Chèche yon kolèk" },
    menu: { fundraisers: "Kolèk mwen yo", impact: "Enpak mwen", impactSub: "Èd ou te voye", messages: "Mesaj", settings: "Paramèt kont", donate: "Bay", donateSub: "Dekouvri kolèk pou sipòte", fundraise: "Kolekte", fundraiseSub: "Kòmanse yon kolèk, konsèy ak resous", about: "Sou nou", aboutSub: "Kiyès nou ye ak kijan nou travay", how: "Kijan li mache", howSub: "Revizyon, verifikasyon ak sa ki rive apre", help: "Sant èd", helpSub: "Repons ak sipò", cont: "Kontinye", start: "Kòmanse premye kolèk ou", signIn: "Konekte", signInSub: "Oswa kreye yon kont", profile: "Pwofil" },
    review: { title: "Kote demann ou ye", steps: ["Voye", "Verifikasyon", "Pibliye"], by: {
      draft: { h: "Bouyon", p: "Fini fòm lan epi voye l pou revizyon." },
      pending: { h: "N ap revize l", p: "Yon moun nan ekip la ap tcheke pyès idantite ou ak istwa a. Nou ap voye yon imèl lè sa fini." },
      needs_changes: { h: "Nou bezwen kèk chanjman", p: "Li nòt la anba a, korije, epi voye l ankò." },
      rejected: { h: "Nou pa t ka pibliye l", p: "Li rezon an anba a. Ou ka korije epi voye l ankò, oswa fè yon apèl." },
      live: { h: "Pibliye", p: "Kolèk ou an vizib pou tout moun." },
      completed: { h: "Fini", p: "Kolèk la fèmen." },
      closed: { h: "Fèmen", p: "Kolèk la pa aktif ankò." },
      suspended: { h: "Sispann pou kounye a", p: "Li nòt la anba a epi kontakte nou." },
    } },
  },
  fr: {
    support: { title: "Personnes qui disent avoir envoyé de l’aide", intro: "Quand l’argent arrive, marquez-le. La personne reçoit une notification et la page publique affiche le nombre de confirmations.", empty: "Personne n’a encore signalé d’envoi.", got: "Je l’ai reçu", undo: "Annuler", gotOn: (d) => `Reçu le ${d}`, waiting: "En attente de votre confirmation", anon: "Anonyme", saveFailed: "Impossible d’enregistrer. Réessayez." },
    tally: (r, c) => `${r} personne(s) disent avoir envoyé de l’aide · ${c} confirmé(s) par l’organisateur`,
    final: { title: "Clôturer avec un rapport final", hint: "Dites aux personnes qui ont aidé ce qui a été fait de l’argent. Ce rapport apparaîtra sur la page publique.", label: "Comment l’argent a-t-il été utilisé ?", button: "Clôturer avec le rapport", tag: "Rapport final", short: "Écrivez au moins 20 caractères.", done: "La collecte est clôturée. Merci !", cancel: "Pas maintenant" },
    send: { title: "Détails du transfert", privacy: "Seuls vous, l’organisateur et son équipe pouvez voir ces détails. Ils n’apparaissent jamais sur la page publique.", date: "Date d’envoi", ref: "Numéro de confirmation / référence", refHint: "Il figure sur votre reçu MonCash, NatCash, bancaire ou Western Union.", phone: "Numéro de téléphone utilisé pour l’envoi", receipt: "Photo du reçu", receiptHint: "Photo ou PDF. Cela aide l’organisateur à retrouver le transfert plus vite.", add: "Ajouter le reçu", change: "Changer", remove: "Retirer", uploading: "Envoi…", failed: "Impossible d’envoyer le fichier. Réessayez.", view: "Voir le reçu" },
    mine: { tab: "Mon aide", title: "Mon aide", intro: "Toute l’aide que vous avez signalée, avec ses détails, est ici dans votre compte.", empty: "Vous n’avez encore signalé aucune aide.", waiting: "En attente de confirmation de l’organisateur", confirmed: (d: string) => `Confirmé par l’organisateur, ${d}`, gone: "Cette collecte n’est plus publique", find: "Trouver une collecte" },
    menu: { fundraisers: "Vos collectes", impact: "Votre impact", impactSub: "L’aide que vous avez envoyée", messages: "Messages", settings: "Paramètres du compte", donate: "Donner", donateSub: "Découvrez des collectes à soutenir", fundraise: "Collecter", fundraiseSub: "Lancez une collecte, conseils et ressources", about: "À propos", aboutSub: "Qui nous sommes et notre façon de travailler", how: "Comment ça marche", howSub: "Vérification, étapes et suite", help: "Centre d’aide", helpSub: "Réponses et assistance", cont: "Continuer", start: "Lancez votre première collecte", signIn: "Se connecter", signInSub: "Ou créez un compte", profile: "Profil" },
    review: { title: "Où en est votre demande", steps: ["Envoyée", "Vérification", "Publiée"], by: {
      draft: { h: "Brouillon", p: "Terminez le formulaire puis envoyez-le pour examen." },
      pending: { h: "En cours d’examen", p: "Quelqu’un de l’équipe vérifie vos pièces d’identité et l’histoire. Vous recevrez un e-mail à la fin." },
      needs_changes: { h: "Des changements sont nécessaires", p: "Lisez la note ci-dessous, corrigez, puis renvoyez." },
      rejected: { h: "Nous n’avons pas pu publier", p: "Lisez la raison ci-dessous. Vous pouvez corriger et renvoyer, ou faire appel." },
      live: { h: "Publiée", p: "Votre collecte est visible par tous." },
      completed: { h: "Terminée", p: "La collecte est clôturée." },
      closed: { h: "Fermée", p: "La collecte n’est plus active." },
      suspended: { h: "Suspendue pour le moment", p: "Lisez la note ci-dessous et contactez-nous." },
    } },
  },
  en: {
    support: { title: "People who say they sent help", intro: "When the money arrives, mark it. The person gets a notification and the public page shows how many were confirmed.", empty: "No one has said they sent help yet.", got: "I received it", undo: "Undo", gotOn: (d) => `Received ${d}`, waiting: "Waiting for your confirmation", anon: "Anonymous", saveFailed: "Couldn’t save that. Try again." },
    tally: (r, c) => `${r} ${r === 1 ? "person says" : "people say"} they sent help · ${c} confirmed by the organizer`,
    final: { title: "Close with a final report", hint: "Tell the people who helped what was done with the money. This report shows on the public page.", label: "How was the money used?", button: "Close with final report", tag: "Final report", short: "Write at least 20 characters.", done: "The fundraiser is closed. Thank you!", cancel: "Not now" },
    send: { title: "Transfer details", privacy: "Only you, the organizer and their team can see these details. They never appear on the public page.", date: "Date sent", ref: "Confirmation / reference number", refHint: "It’s on your MonCash, NatCash, bank or Western Union receipt.", phone: "Phone number you sent from", receipt: "Photo of the receipt", receiptHint: "A photo or PDF. It helps the organizer find the transfer faster.", add: "Add receipt", change: "Change", remove: "Remove", uploading: "Uploading…", failed: "Couldn’t upload the file. Try again.", view: "View receipt" },
    mine: { tab: "My support", title: "My support", intro: "All the help you’ve reported, with its details, is here in your account.", empty: "You haven’t reported any help yet.", waiting: "Waiting for the organizer to confirm", confirmed: (d: string) => `Confirmed by the organizer, ${d}`, gone: "This fundraiser is no longer public", find: "Find a fundraiser" },
    menu: { fundraisers: "Your fundraisers", impact: "Your impact", impactSub: "Help you’ve sent", messages: "Messages", settings: "Account settings", donate: "Donate", donateSub: "Discover fundraisers to support", fundraise: "Fundraise", fundraiseSub: "Start a fundraiser, tips and resources", about: "About", aboutSub: "Who we are and how we work", how: "How it works", howSub: "Review, verification and what happens next", help: "Help Center", helpSub: "Answers and support", cont: "Continue", start: "Start your first fundraiser", signIn: "Sign in", signInSub: "Or create an account", profile: "Profile" },
    review: { title: "Where your request stands", steps: ["Sent", "Checking", "Published"], by: {
      draft: { h: "Draft", p: "Finish the form and send it for review." },
      pending: { h: "Under review", p: "Someone on the team is checking your ID and the story. You’ll get an email when it’s done." },
      needs_changes: { h: "Changes needed", p: "Read the note below, fix it, and send it again." },
      rejected: { h: "We couldn’t publish it", p: "Read the reason below. You can fix it and send it again, or appeal." },
      live: { h: "Published", p: "Your fundraiser is visible to everyone." },
      completed: { h: "Completed", p: "The fundraiser is closed." },
      closed: { h: "Closed", p: "The fundraiser is no longer active." },
      suspended: { h: "Paused for now", p: "Read the note below and contact us." },
    } },
  },
  es: {
    support: { title: "Personas que dicen haber enviado ayuda", intro: "Cuando llegue el dinero, márcalo. La persona recibe un aviso y la página pública muestra cuántos se confirmaron.", empty: "Nadie ha dicho todavía que envió ayuda.", got: "Lo recibí", undo: "Deshacer", gotOn: (d) => `Recibido el ${d}`, waiting: "Esperando tu confirmación", anon: "Anónimo", saveFailed: "No se pudo guardar. Inténtalo de nuevo." },
    tally: (r, c) => `${r} persona(s) dicen haber enviado ayuda · ${c} confirmada(s) por el organizador`,
    final: { title: "Cerrar con un informe final", hint: "Cuéntales a quienes ayudaron qué se hizo con el dinero. Este informe aparece en la página pública.", label: "¿Cómo se usó el dinero?", button: "Cerrar con informe final", tag: "Informe final", short: "Escribe al menos 20 caracteres.", done: "La recaudación está cerrada. ¡Gracias!", cancel: "Ahora no" },
    send: { title: "Detalles de la transferencia", privacy: "Solo tú, el organizador y su equipo pueden ver estos detalles. Nunca aparecen en la página pública.", date: "Fecha de envío", ref: "Número de confirmación / referencia", refHint: "Está en tu recibo de MonCash, NatCash, del banco o de Western Union.", phone: "Teléfono desde el que enviaste", receipt: "Foto del recibo", receiptHint: "Una foto o PDF. Ayuda al organizador a encontrar la transferencia más rápido.", add: "Agregar recibo", change: "Cambiar", remove: "Quitar", uploading: "Subiendo…", failed: "No se pudo subir el archivo. Inténtalo de nuevo.", view: "Ver recibo" },
    mine: { tab: "Mi ayuda", title: "Mi ayuda", intro: "Toda la ayuda que has reportado, con sus detalles, está aquí en tu cuenta.", empty: "Aún no has reportado ninguna ayuda.", waiting: "Esperando que el organizador confirme", confirmed: (d: string) => `Confirmado por el organizador, ${d}`, gone: "Esta recaudación ya no es pública", find: "Buscar una recaudación" },
    menu: { fundraisers: "Tus recaudaciones", impact: "Tu impacto", impactSub: "La ayuda que has enviado", messages: "Mensajes", settings: "Ajustes de la cuenta", donate: "Donar", donateSub: "Descubre recaudaciones para apoyar", fundraise: "Recaudar", fundraiseSub: "Inicia una recaudación, consejos y recursos", about: "Acerca de", aboutSub: "Quiénes somos y cómo trabajamos", how: "Cómo funciona", howSub: "Revisión, verificación y qué sigue", help: "Centro de ayuda", helpSub: "Respuestas y soporte", cont: "Continuar", start: "Inicia tu primera recaudación", signIn: "Iniciar sesión", signInSub: "O crea una cuenta", profile: "Perfil" },
    review: { title: "Cómo va tu solicitud", steps: ["Enviada", "Revisión", "Publicada"], by: {
      draft: { h: "Borrador", p: "Termina el formulario y envíalo a revisión." },
      pending: { h: "En revisión", p: "Alguien del equipo revisa tu identificación y la historia. Te escribiremos por correo al terminar." },
      needs_changes: { h: "Hacen falta cambios", p: "Lee la nota de abajo, corrige y vuelve a enviar." },
      rejected: { h: "No pudimos publicarla", p: "Lee el motivo de abajo. Puedes corregir y volver a enviar, o apelar." },
      live: { h: "Publicada", p: "Tu recaudación es visible para todos." },
      completed: { h: "Terminada", p: "La recaudación está cerrada." },
      closed: { h: "Cerrada", p: "La recaudación ya no está activa." },
      suspended: { h: "En pausa por ahora", p: "Lee la nota de abajo y contáctanos." },
    } },
  },
};
