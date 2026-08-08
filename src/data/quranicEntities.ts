// Quranic entities untuk schema.org `mentions` (GEO — entity recognition).
// Hanya entitas yang PASTI muncul di seluruh surah bernama tokoh.
// Wikidata IDs diverifikasi via API (Juni 2026).

export interface QuranicEntity {
  name: string;
  nameAr?: string;
  wikidataId: string;
  url: string;
}

export const QURANIC_ENTITIES_BY_SURAH: Record<number, QuranicEntity[]> = {
  2: [
    { name: "Abraham", nameAr: "إبراهيم", wikidataId: "Q9181", url: "https://www.wikidata.org/wiki/Q9181" },
    { name: "Moses", nameAr: "موسى", wikidataId: "Q9077", url: "https://www.wikidata.org/wiki/Q9077" },
  ],
  10: [{ name: "Jonah", nameAr: "يونس", wikidataId: "Q2468262", url: "https://www.wikidata.org/wiki/Q2468262" }],
  11: [{ name: "Hud", nameAr: "هود", wikidataId: "Q840510", url: "https://www.wikidata.org/wiki/Q840510" }],
  12: [{ name: "Joseph in Islam", nameAr: "يوسف", wikidataId: "Q563644", url: "https://www.wikidata.org/wiki/Q563644" }],
  14: [{ name: "Abraham", nameAr: "إبراهيم", wikidataId: "Q9181", url: "https://www.wikidata.org/wiki/Q9181" }],
  19: [
    { name: "Mary", nameAr: "مريم", wikidataId: "Q345", url: "https://www.wikidata.org/wiki/Q345" },
    { name: "Jesus", nameAr: "عيسى", wikidataId: "Q302", url: "https://www.wikidata.org/wiki/Q302" },
    { name: "John the Baptist", nameAr: "يحيى", wikidataId: "Q40662", url: "https://www.wikidata.org/wiki/Q40662" },
  ],
  21: [{ name: "Muhammad", nameAr: "محمد", wikidataId: "Q9458", url: "https://www.wikidata.org/wiki/Q9458" }],
  31: [{ name: "Luqman", nameAr: "لقمان", wikidataId: "Q1191484", url: "https://www.wikidata.org/wiki/Q1191484" }],
  47: [{ name: "Muhammad", nameAr: "محمد", wikidataId: "Q9458", url: "https://www.wikidata.org/wiki/Q9458" }],
  71: [{ name: "Noah", nameAr: "نوح", wikidataId: "Q81422", url: "https://www.wikidata.org/wiki/Q81422" }],
};

export const QURAN_ENTITY = {
  name: "Qur'an",
  nameAr: "القرآن",
  wikidataId: "Q428",
  url: "https://www.wikidata.org/wiki/Q428",
};
