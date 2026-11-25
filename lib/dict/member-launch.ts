import type { Locale } from "../i18n";

type MemberCopy = {
  proofPhoto: (n: number) => string;
  removeProof: (n: number) => string;
  waitForUpload: string;
  appealHistory: string;
  noAppeals: string;
  yourAppeal: string;
  teamResponse: string;
  awaitingResponse: string;
  noResponse: string;
  appealStatus: { open: string; accepted: string; declined: string };
};

const copy: Record<Locale, MemberCopy> = {
  en: {
    proofPhoto: (n) => `Supporting photo ${n}`,
    removeProof: (n) => `Remove supporting photo ${n}`,
    waitForUpload: "Wait for the photo to finish uploading before publishing.",
    appealHistory: "Your appeals",
    noAppeals: "You haven't sent an appeal yet.",
    yourAppeal: "Your request",
    teamResponse: "Response from our review team",
    awaitingResponse: "Our team hasn't responded yet. You'll find their decision here.",
    noResponse: "No additional response was provided.",
    appealStatus: { open: "Under review", accepted: "Accepted", declined: "Declined" },
  },
  fr: {
    proofPhoto: (n) => `Photo justificative ${n}`,
    removeProof: (n) => `Retirer la photo justificative ${n}`,
    waitForUpload: "Attendez la fin du téléversement de la photo avant de publier.",
    appealHistory: "Vos recours",
    noAppeals: "Vous n'avez pas encore envoyé de recours.",
    yourAppeal: "Votre demande",
    teamResponse: "Réponse de notre équipe de vérification",
    awaitingResponse: "Notre équipe n'a pas encore répondu. Sa décision apparaîtra ici.",
    noResponse: "Aucune réponse complémentaire n'a été ajoutée.",
    appealStatus: { open: "En cours d'examen", accepted: "Accepté", declined: "Refusé" },
  },
  ht: {
    proofPhoto: (n) => `Foto kòm prèv ${n}`,
    removeProof: (n) => `Retire foto kòm prèv ${n}`,
    waitForUpload: "Tann foto a fin monte anvan ou pibliye.",
    appealHistory: "Apèl ou yo",
    noAppeals: "Ou poko voye yon apèl.",
    yourAppeal: "Demann ou a",
    teamResponse: "Repons ekip verifikasyon nou an",
    awaitingResponse: "Ekip nou an poko reponn. W ap jwenn desizyon li isit la.",
    noResponse: "Pa gen lòt repons ki ajoute.",
    appealStatus: { open: "An egzamen", accepted: "Aksepte", declined: "Refize" },
  },
  es: {
    proofPhoto: (n) => `Foto de respaldo ${n}`,
    removeProof: (n) => `Quitar la foto de respaldo ${n}`,
    waitForUpload: "Espera a que termine de subir la foto antes de publicar.",
    appealHistory: "Tus apelaciones",
    noAppeals: "Todavía no has enviado una apelación.",
    yourAppeal: "Tu solicitud",
    teamResponse: "Respuesta de nuestro equipo de revisión",
    awaitingResponse: "Nuestro equipo todavía no ha respondido. Su decisión aparecerá aquí.",
    noResponse: "No se añadió ninguna respuesta adicional.",
    appealStatus: { open: "En revisión", accepted: "Aceptada", declined: "Rechazada" },
  },
};

export const memberCopy = (locale: Locale): MemberCopy => copy[locale];
