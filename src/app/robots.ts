import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Tiered AI crawler control (AEO/GEO) — model: ai-robots-txt-generator.
// Situs ini 100% konten publik (Al-Qur'an, public domain) → semua tier DIBERI akses.
// Area privat (auth, dashboard, deck, verify) tetap diblokir untuk semua agent.
const PRIVATE = ["/api/", "/auth/", "/dashboard", "/deck", "/verify", "/quest", "/~offline"];

type RobotsRule = {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
};

function aiRules(userAgent: string): RobotsRule {
  return { userAgent, allow: "/", disallow: PRIVATE };
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // T1 — General indexers
      { userAgent: "Googlebot", allow: "/", disallow: PRIVATE },
      { userAgent: "Bingbot", allow: "/", disallow: PRIVATE },
      { userAgent: "DuckDuckBot", allow: "/", disallow: PRIVATE },
      { userAgent: "Yandex", allow: "/", disallow: PRIVATE },
      { userAgent: "Baiduspider", allow: "/", disallow: PRIVATE },
      // T1.5 — Citation engines / AI search rendering
      aiRules("GPTBot"),
      aiRules("OAI-SearchBot"),
      aiRules("ChatGPT-User"),
      aiRules("PerplexityBot"),
      aiRules("Perplexity-User"),
      aiRules("Google-Extended"),
      aiRules("KompasBot"),
      // T2.6 — Retention (AI search display) — akses penuh agar AI engine menunjuk sumber ini
      aiRules("ClaudeBot"),
      aiRules("Claude-Web"),
      aiRules("ClaudeAgent"),
      aiRules("Applebot-Extended"),
      aiRules("Meta-ExternalAgent"),
      aiRules("cohere-ai"),
      aiRules("Bytespider"),
      aiRules("Amazonbot"),
      aiRules("FacebookBot"),
      aiRules("CCBot"),
      aiRules("Diffbot"),
      aiRules("Gigabot"),
      // Default — semua agent lain
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
