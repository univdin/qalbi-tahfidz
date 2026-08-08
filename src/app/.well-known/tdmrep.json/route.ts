import { SITE_URL } from "@/lib/site";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

// TDMRep (W3C Text & Data Mining Reservation Protocol) — deklarasi opt-out
// untuk text-and-data mining (pasal 4 & 5 CDSM Directive EU). Isi teks & tafsir
// milik penyedia sumber (Kemenag RI); UI & artikel adalah karya orisinal situs.
export function GET() {
  return NextResponse.json(
    {
      "tdm-reservation": {
        "@context": "https://www.w3.org/ns/tdmrep",
        "@type": "TdmRepPolicy",
        assertedBy: SITE_URL,
        assertionDate: new Date().toISOString().slice(0, 10),
        contentTypes: ["text/html", "text/plain"],
        restrictPolicy: "restrict",
        creditPolicy: [
          {
            source: "https://quran.com",
            note: "Teks Arab & terjemahan bersumber dari Quran.com API / gadingnst / fawazahmed0.",
          },
          {
            source: "https://kemenag.go.id",
            note: "Tafsir bersumber dari Tafsir Kemenag RI.",
          },
        ],
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    }
  );
}
