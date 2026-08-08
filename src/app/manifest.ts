import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QalbiTahfidz — Hafalan Al-Qur'an untuk Keluarga",
    short_name: "QalbiTahfidz",
    description:
      "Aplikasi hafalan Al-Qur'an anak & keluarga: Metode Ummi, Tikrar, FSRS, dan mushaf dwi-skrip.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    id: "/",
    categories: ["education", "books", "productivity"],
  };
}
