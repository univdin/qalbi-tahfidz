export interface SurahMeta {
  number: number;
  nameId: string;
  nameArabic: string;
  ayahCount: number;
  revelation: "Makkah" | "Madinah";
}

export const SURAHS: SurahMeta[] = [
  { number: 1, nameId: "Al-Fatihah", nameArabic: "الفاتحة", ayahCount: 7, revelation: "Makkah" },
  { number: 2, nameId: "Al-Baqarah", nameArabic: "البقرة", ayahCount: 286, revelation: "Madinah" },
  { number: 3, nameId: "Ali 'Imran", nameArabic: "آل عمران", ayahCount: 200, revelation: "Madinah" },
  { number: 4, nameId: "An-Nisa'", nameArabic: "النساء", ayahCount: 176, revelation: "Madinah" },
  { number: 5, nameId: "Al-Ma'idah", nameArabic: "المائدة", ayahCount: 120, revelation: "Madinah" },
  { number: 6, nameId: "Al-An'am", nameArabic: "الأنعام", ayahCount: 165, revelation: "Makkah" },
  { number: 7, nameId: "Al-A'raf", nameArabic: "الأعراف", ayahCount: 206, revelation: "Makkah" },
  { number: 8, nameId: "Al-Anfal", nameArabic: "الأنفال", ayahCount: 75, revelation: "Madinah" },
  { number: 9, nameId: "At-Tawbah", nameArabic: "التوبة", ayahCount: 129, revelation: "Madinah" },
  { number: 10, nameId: "Yunus", nameArabic: "يونس", ayahCount: 109, revelation: "Makkah" },
  { number: 11, nameId: "Hud", nameArabic: "هود", ayahCount: 123, revelation: "Makkah" },
  { number: 12, nameId: "Yusuf", nameArabic: "يوسف", ayahCount: 111, revelation: "Makkah" },
  { number: 13, nameId: "Ar-Ra'd", nameArabic: "الرعد", ayahCount: 43, revelation: "Madinah" },
  { number: 14, nameId: "Ibrahim", nameArabic: "إبراهيم", ayahCount: 52, revelation: "Makkah" },
  { number: 15, nameId: "Al-Hijr", nameArabic: "الحجر", ayahCount: 99, revelation: "Makkah" },
  { number: 16, nameId: "An-Nahl", nameArabic: "النحل", ayahCount: 128, revelation: "Makkah" },
  { number: 17, nameId: "Al-Isra'", nameArabic: "الإسراء", ayahCount: 111, revelation: "Makkah" },
  { number: 18, nameId: "Al-Kahf", nameArabic: "الكهف", ayahCount: 110, revelation: "Makkah" },
  { number: 19, nameId: "Maryam", nameArabic: "مريم", ayahCount: 98, revelation: "Makkah" },
  { number: 20, nameId: "Thaha", nameArabic: "طه", ayahCount: 135, revelation: "Makkah" },
  { number: 21, nameId: "Al-Anbiya'", nameArabic: "الأنبياء", ayahCount: 112, revelation: "Makkah" },
  { number: 22, nameId: "Al-Hajj", nameArabic: "الحج", ayahCount: 78, revelation: "Madinah" },
  { number: 23, nameId: "Al-Mu'minun", nameArabic: "المؤمنون", ayahCount: 118, revelation: "Makkah" },
  { number: 24, nameId: "An-Nur", nameArabic: "النور", ayahCount: 64, revelation: "Madinah" },
  { number: 25, nameId: "Al-Furqan", nameArabic: "الفرقان", ayahCount: 77, revelation: "Makkah" },
  { number: 26, nameId: "Asy-Syu'ara'", nameArabic: "الشعراء", ayahCount: 227, revelation: "Makkah" },
  { number: 27, nameId: "An-Naml", nameArabic: "النمل", ayahCount: 93, revelation: "Makkah" },
  { number: 28, nameId: "Al-Qasas", nameArabic: "القصص", ayahCount: 88, revelation: "Makkah" },
  { number: 29, nameId: "Al-'Ankabut", nameArabic: "العنكبوت", ayahCount: 69, revelation: "Makkah" },
  { number: 30, nameId: "Ar-Rum", nameArabic: "الروم", ayahCount: 60, revelation: "Makkah" },
  { number: 31, nameId: "Luqman", nameArabic: "لقمان", ayahCount: 34, revelation: "Makkah" },
  { number: 32, nameId: "As-Sajdah", nameArabic: "السجدة", ayahCount: 30, revelation: "Makkah" },
  { number: 33, nameId: "Al-Ahzab", nameArabic: "الأحزاب", ayahCount: 73, revelation: "Madinah" },
  { number: 34, nameId: "Saba'", nameArabic: "سبأ", ayahCount: 54, revelation: "Makkah" },
  { number: 35, nameId: "Fatir", nameArabic: "فاطر", ayahCount: 45, revelation: "Makkah" },
  { number: 36, nameId: "Yasin", nameArabic: "يس", ayahCount: 83, revelation: "Makkah" },
  { number: 37, nameId: "As-Saffat", nameArabic: "الصافات", ayahCount: 182, revelation: "Makkah" },
  { number: 38, nameId: "Sad", nameArabic: "ص", ayahCount: 88, revelation: "Makkah" },
  { number: 39, nameId: "Az-Zumar", nameArabic: "الزمر", ayahCount: 75, revelation: "Makkah" },
  { number: 40, nameId: "Ghafir", nameArabic: "غافر", ayahCount: 85, revelation: "Makkah" },
  { number: 41, nameId: "Fussilat", nameArabic: "فصلت", ayahCount: 54, revelation: "Makkah" },
  { number: 42, nameId: "Asy-Syura", nameArabic: "الشورى", ayahCount: 53, revelation: "Makkah" },
  { number: 43, nameId: "Az-Zukhruf", nameArabic: "الزخرف", ayahCount: 89, revelation: "Makkah" },
  { number: 44, nameId: "Ad-Dukhan", nameArabic: "الدخان", ayahCount: 59, revelation: "Makkah" },
  { number: 45, nameId: "Al-Jathiyah", nameArabic: "الجاثية", ayahCount: 37, revelation: "Makkah" },
  { number: 46, nameId: "Al-Ahqaf", nameArabic: "الأحقاف", ayahCount: 35, revelation: "Makkah" },
  { number: 47, nameId: "Muhammad", nameArabic: "محمد", ayahCount: 38, revelation: "Madinah" },
  { number: 48, nameId: "Al-Fath", nameArabic: "الفتح", ayahCount: 29, revelation: "Madinah" },
  { number: 49, nameId: "Al-Hujurat", nameArabic: "الحجرات", ayahCount: 18, revelation: "Madinah" },
  { number: 50, nameId: "Qaf", nameArabic: "ق", ayahCount: 45, revelation: "Makkah" },
  { number: 51, nameId: "Adz-Dzariyat", nameArabic: "الذاريات", ayahCount: 60, revelation: "Makkah" },
  { number: 52, nameId: "At-Tur", nameArabic: "الطور", ayahCount: 49, revelation: "Makkah" },
  { number: 53, nameId: "An-Najm", nameArabic: "النجم", ayahCount: 62, revelation: "Makkah" },
  { number: 54, nameId: "Al-Qamar", nameArabic: "القمر", ayahCount: 55, revelation: "Makkah" },
  { number: 55, nameId: "Ar-Rahman", nameArabic: "الرحمن", ayahCount: 78, revelation: "Madinah" },
  { number: 56, nameId: "Al-Waqi'ah", nameArabic: "الواقعة", ayahCount: 96, revelation: "Makkah" },
  { number: 57, nameId: "Al-Hadid", nameArabic: "الحديد", ayahCount: 29, revelation: "Madinah" },
  { number: 58, nameId: "Al-Mujadilah", nameArabic: "المجادلة", ayahCount: 22, revelation: "Madinah" },
  { number: 59, nameId: "Al-Hasyr", nameArabic: "الحشر", ayahCount: 24, revelation: "Madinah" },
  { number: 60, nameId: "Al-Mumtahanah", nameArabic: "الممتحنة", ayahCount: 13, revelation: "Madinah" },
  { number: 61, nameId: "As-Saff", nameArabic: "الصف", ayahCount: 14, revelation: "Madinah" },
  { number: 62, nameId: "Al-Jumu'ah", nameArabic: "الجمعة", ayahCount: 11, revelation: "Madinah" },
  { number: 63, nameId: "Al-Munafiqun", nameArabic: "المنافقون", ayahCount: 11, revelation: "Madinah" },
  { number: 64, nameId: "At-Taghabun", nameArabic: "التغابن", ayahCount: 18, revelation: "Madinah" },
  { number: 65, nameId: "At-Talaq", nameArabic: "الطلاق", ayahCount: 12, revelation: "Madinah" },
  { number: 66, nameId: "At-Tahrim", nameArabic: "التحريم", ayahCount: 12, revelation: "Madinah" },
  { number: 67, nameId: "Al-Mulk", nameArabic: "الملك", ayahCount: 30, revelation: "Makkah" },
  { number: 68, nameId: "Al-Qalam", nameArabic: "القلم", ayahCount: 52, revelation: "Makkah" },
  { number: 69, nameId: "Al-Haqqah", nameArabic: "الحاقة", ayahCount: 52, revelation: "Makkah" },
  { number: 70, nameId: "Al-Ma'arij", nameArabic: "المعارج", ayahCount: 44, revelation: "Makkah" },
  { number: 71, nameId: "Nuh", nameArabic: "نوح", ayahCount: 28, revelation: "Makkah" },
  { number: 72, nameId: "Al-Jinn", nameArabic: "الجن", ayahCount: 28, revelation: "Makkah" },
  { number: 73, nameId: "Al-Muzzammil", nameArabic: "المزمل", ayahCount: 20, revelation: "Makkah" },
  { number: 74, nameId: "Al-Muddaththir", nameArabic: "المدثر", ayahCount: 56, revelation: "Makkah" },
  { number: 75, nameId: "Al-Qiyamah", nameArabic: "القيامة", ayahCount: 40, revelation: "Makkah" },
  { number: 76, nameId: "Al-Insan", nameArabic: "الإنسان", ayahCount: 31, revelation: "Madinah" },
  { number: 77, nameId: "Al-Mursalat", nameArabic: "المرسلات", ayahCount: 50, revelation: "Makkah" },
  { number: 78, nameId: "An-Naba'", nameArabic: "النبأ", ayahCount: 40, revelation: "Makkah" },
  { number: 79, nameId: "An-Nazi'at", nameArabic: "النازعات", ayahCount: 46, revelation: "Makkah" },
  { number: 80, nameId: "'Abasa", nameArabic: "عبس", ayahCount: 42, revelation: "Makkah" },
  { number: 81, nameId: "At-Takwir", nameArabic: "التكوير", ayahCount: 29, revelation: "Makkah" },
  { number: 82, nameId: "Al-Infitar", nameArabic: "الانفطار", ayahCount: 19, revelation: "Makkah" },
  { number: 83, nameId: "Al-Mutaffifin", nameArabic: "المطففين", ayahCount: 36, revelation: "Makkah" },
  { number: 84, nameId: "Al-Insyiqaq", nameArabic: "الانشقاق", ayahCount: 25, revelation: "Makkah" },
  { number: 85, nameId: "Al-Buruj", nameArabic: "البروج", ayahCount: 22, revelation: "Makkah" },
  { number: 86, nameId: "At-Tariq", nameArabic: "الطارق", ayahCount: 17, revelation: "Makkah" },
  { number: 87, nameId: "Al-A'la", nameArabic: "الأعلى", ayahCount: 19, revelation: "Makkah" },
  { number: 88, nameId: "Al-Ghasyiyah", nameArabic: "الغاشية", ayahCount: 26, revelation: "Makkah" },
  { number: 89, nameId: "Al-Fajr", nameArabic: "الفجر", ayahCount: 30, revelation: "Makkah" },
  { number: 90, nameId: "Al-Balad", nameArabic: "البلد", ayahCount: 20, revelation: "Makkah" },
  { number: 91, nameId: "Asy-Syams", nameArabic: "الشمس", ayahCount: 15, revelation: "Makkah" },
  { number: 92, nameId: "Al-Lail", nameArabic: "الليل", ayahCount: 21, revelation: "Makkah" },
  { number: 93, nameId: "Ad-Duha", nameArabic: "الضحى", ayahCount: 11, revelation: "Makkah" },
  { number: 94, nameId: "Asy-Syarh", nameArabic: "الشرح", ayahCount: 8, revelation: "Makkah" },
  { number: 95, nameId: "At-Tin", nameArabic: "التين", ayahCount: 8, revelation: "Makkah" },
  { number: 96, nameId: "Al-'Alaq", nameArabic: "العلق", ayahCount: 19, revelation: "Makkah" },
  { number: 97, nameId: "Al-Qadr", nameArabic: "القدر", ayahCount: 5, revelation: "Makkah" },
  { number: 98, nameId: "Al-Bayyinah", nameArabic: "البينة", ayahCount: 8, revelation: "Madinah" },
  { number: 99, nameId: "Az-Zalzalah", nameArabic: "الزلزلة", ayahCount: 8, revelation: "Madinah" },
  { number: 100, nameId: "Al-'Adiyat", nameArabic: "العاديات", ayahCount: 11, revelation: "Makkah" },
  { number: 101, nameId: "Al-Qari'ah", nameArabic: "القارعة", ayahCount: 11, revelation: "Makkah" },
  { number: 102, nameId: "At-Takathur", nameArabic: "التكاثر", ayahCount: 8, revelation: "Makkah" },
  { number: 103, nameId: "Al-'Asr", nameArabic: "العصر", ayahCount: 3, revelation: "Makkah" },
  { number: 104, nameId: "Al-Humazah", nameArabic: "الهمزة", ayahCount: 9, revelation: "Makkah" },
  { number: 105, nameId: "Al-Fil", nameArabic: "الفيل", ayahCount: 5, revelation: "Makkah" },
  { number: 106, nameId: "Quraisy", nameArabic: "قريش", ayahCount: 4, revelation: "Makkah" },
  { number: 107, nameId: "Al-Ma'un", nameArabic: "الماعون", ayahCount: 7, revelation: "Makkah" },
  { number: 108, nameId: "Al-Kautsar", nameArabic: "الكوثر", ayahCount: 3, revelation: "Makkah" },
  { number: 109, nameId: "Al-Kafirun", nameArabic: "الكافرون", ayahCount: 6, revelation: "Makkah" },
  { number: 110, nameId: "An-Nasr", nameArabic: "النصر", ayahCount: 3, revelation: "Madinah" },
  { number: 111, nameId: "Al-Lahab", nameArabic: "المسد", ayahCount: 5, revelation: "Makkah" },
  { number: 112, nameId: "Al-Ikhlas", nameArabic: "الإخلاص", ayahCount: 4, revelation: "Makkah" },
  { number: 113, nameId: "Al-Falaq", nameArabic: "الفلق", ayahCount: 5, revelation: "Makkah" },
  { number: 114, nameId: "An-Nas", nameArabic: "الناس", ayahCount: 6, revelation: "Makkah" },
];

export const TOTAL_AYAHS = SURAHS.reduce((sum, s) => sum + s.ayahCount, 0);

export function getSurahMeta(number: number): SurahMeta | undefined {
  return SURAHS.find((s) => s.number === number);
}

export function formatAyahFile(surah: number, ayah: number): string {
  return `${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}`;
}

export const RECITERS = [
  { id: "Alafasy_128kbps", name: "Misyari Rasyid Al-'Afasi" },
  { id: "MaherAlMuaiqly128kbps", name: "Maher Al-Mu'aiqly" },
  { id: "Abdul_Basit_Murattal_128kbps", name: "Abdul Basit (Murattal)" },
] as const;

export function everyayahAudioUrl(
  reciter: string,
  surah: number,
  ayah: number
): string {
  return `https://everyayah.com/data/${reciter}/${formatAyahFile(surah, ayah)}.mp3`;
}
