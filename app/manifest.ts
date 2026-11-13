import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "yon kout men",
    short_name: "yon kout men",
    description: "Un coup de main pour les Haïtiens, où qu'ils soient.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f503b",
    lang: "fr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
