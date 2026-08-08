export type MoralTag =
  | "jujur"
  | "sabar"
  | "tawakal"
  | "kasih-sayang"
  | "syukur"
  | "keberanian"
  | "keadilan"
  | "tawadhu"
  | "ketaatan"
  | "pemaaf";

export interface StoryNode {
  id: string;
  ref: string; // "surah:ayah"
  label: string;
  tag?: MoralTag;
}

export interface StoryEdge {
  source: string;
  target: string;
}

export interface Story {
  id: string;
  title: string;
  icon: string;
  desc: string;
  tags: MoralTag[];
  nodes: StoryNode[];
  edges: StoryEdge[];
}

export const MORAL_TAG_LABEL: Record<MoralTag, string> = {
  jujur: "Kejujuran",
  sabar: "Kesabaran",
  tawakal: "Tawakal",
  "kasih-sayang": "Kasih Sayang",
  syukur: "Syukur",
  keberanian: "Keberanian",
  keadilan: "Keadilan",
  tawadhu: "Tawadhu",
  ketaatan: "Ketaatan",
  pemaaf: "Pemaaf",
};

export const MORAL_TAG_COLOR: Record<MoralTag, string> = {
  jujur: "#10b981",
  sabar: "#f59e0b",
  tawakal: "#14b8a6",
  "kasih-sayang": "#ec4899",
  syukur: "#8b5cf6",
  keberanian: "#ef4444",
  keadilan: "#3b82f6",
  tawadhu: "#64748b",
  ketaatan: "#06b6d4",
  pemaaf: "#84cc16",
};

function seq(nodes: string[]): StoryEdge[] {
  const edges: StoryEdge[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({ source: nodes[i], target: nodes[i + 1] });
  }
  return edges;
}

export const STORIES: Story[] = [
  {
    id: "ashabul-kahfi",
    title: "Ashabul Kahfi — Pemuda Gua",
    icon: "🏔️",
    desc: "Kisah sekelompok pemuda beriman yang berlindung di dalam gua dari penguasa zalim, lalu Allah menidurkan mereka bertahun-tahun. Sumber: Surah Al-Kahf.",
    tags: ["keberanian", "tawakal"],
    nodes: [
      { id: "k1", ref: "18:9", label: "Para pemuda berlindung di gua", tag: "keberanian" },
      { id: "k2", ref: "18:10", label: "Doa memohon rahmat & petunjuk", tag: "tawakal" },
      { id: "k3", ref: "18:11", label: "Allah menidurkan mereka bertahun-tahun" },
      { id: "k4", ref: "18:16", label: "Berlindung kepada Allah" },
      { id: "k5", ref: "18:17", label: "Cahaya masuk ke gua, mereka tak tersengat panas" },
      { id: "k6", ref: "18:19-20", label: "Terbangun, mengutus seorang membawa uang perak" },
      { id: "k7", ref: "18:26", label: "Hanya Allah yang tahu berapa lama" },
    ],
    edges: seq(["k1", "k2", "k3", "k4", "k5", "k6", "k7"]),
  },
  {
    id: "yusuf",
    title: "Kisah Nabi Yusuf",
    icon: "🌟",
    desc: "Kisah Nabi Yusuf AS — dari mimpi, dibuang ke sumur, menjadi bendahara Mesir, hingga bertemu kembali dengan keluarganya. Kisah terbaik dalam Al-Qur'an (Surah Yusuf).",
    tags: ["sabar", "pemaaf", "tawadhu"],
    nodes: [
      { id: "y1", ref: "12:4", label: "Yusuf bermimpi 11 bintang, matahari, dan bulan" },
      { id: "y2", ref: "12:8-9", label: "Kecemburuan saudara-saudaranya" },
      { id: "y3", ref: "12:15", label: "Dibuang ke sumur", tag: "sabar" },
      { id: "y4", ref: "12:23", label: "Menolak godaan, memilih penjara" },
      { id: "y5", ref: "12:36-42", label: "Menafsirkan mimpi di penjara" },
      { id: "y6", ref: "12:54-56", label: "Menjadi bendahara Mesir", tag: "tawadhu" },
      { id: "y7", ref: "12:92", label: "Memaafkan saudara-saudaranya", tag: "pemaaf" },
    ],
    edges: seq(["y1", "y2", "y3", "y4", "y5", "y6", "y7"]),
  },
  {
    id: "musa",
    title: "Kisah Nabi Musa",
    icon: "🗡️",
    desc: "Perjalanan Nabi Musa AS melawan kezaliman Firaun — dari tongkat berubah ular, mukjizat, hingga terbelahnya laut. Sumber: Thaha, Al-Qasas, Asy-Syu'ara'.",
    tags: ["keberanian", "tawakal"],
    nodes: [
      { id: "m1", ref: "20:9-10", label: "Musa melihat api, berangkat mencari" },
      { id: "m2", ref: "20:17-21", label: "Tongkat berubah menjadi ular" },
      { id: "m3", ref: "20:23-35", label: "Diberi mukjizat & doa dilapangkan dada" },
      { id: "m4", ref: "20:49-55", label: "Berhadapan dengan Firaun", tag: "keberanian" },
      { id: "m5", ref: "26:63", label: "Laut terbelah menyelamatkan Bani Israil", tag: "tawakal" },
      { id: "m6", ref: "20:77", label: "Firman untuk keluar membawa hamba-hamba-Nya" },
    ],
    edges: seq(["m1", "m2", "m3", "m4", "m5", "m6"]),
  },
  {
    id: "nuh",
    title: "Kisah Nabi Nuh",
    icon: "🚢",
    desc: "Nabi Nuh AS berdakwah 950 tahun, membangun bahtera atas perintah Allah, dan banjir besar menimpa kaum yang mendustakan. Sumber: Surah Nuh.",
    tags: ["sabar", "ketaatan"],
    nodes: [
      { id: "n1", ref: "71:1-4", label: "Diutus kepada kaumnya, ajakan beribadah" },
      { id: "n2", ref: "71:5-7", label: "Dakwah siang malam namun kaum menolak", tag: "sabar" },
      { id: "n3", ref: "11:36-37", label: "Perintah membangun bahtera", tag: "ketaatan" },
      { id: "n4", ref: "11:40", label: "Bahtera berlayar saat banjir tiba" },
      { id: "n5", ref: "11:44", label: "Air surut, bahtera berlabuh" },
    ],
    edges: seq(["n1", "n2", "n3", "n4", "n5"]),
  },
  {
    id: "ibrahim",
    title: "Kisah Nabi Ibrahim",
    icon: "🔥",
    desc: "Nabi Ibrahim AS menghancurkan berhala, diselamatkan Allah dari api, dan diuji dengan penyembelihan putranya. Sumber: Al-Anbiya', As-Saffat.",
    tags: ["keberanian", "tawakal"],
    nodes: [
      { id: "i1", ref: "21:52-56", label: "Menentang penyembahan berhala", tag: "keberanian" },
      { id: "i2", ref: "21:57-58", label: "Menghancurkan berhala-berhala" },
      { id: "i3", ref: "21:68-69", label: "Dilempar ke api, api menjadi dingin", tag: "tawakal" },
      { id: "i4", ref: "37:102-103", label: "Mimpi menyembelih Ismail, keduanya pasrah" },
      { id: "i5", ref: "37:107", label: "Tebusan besar menggantikan Ismail" },
    ],
    edges: seq(["i1", "i2", "i3", "i4", "i5"]),
  },
  {
    id: "maryam-isa",
    title: "Maryam & Nabi Isa",
    icon: "🕊️",
    desc: "Kisah Maryam binti Imran menerima kabar gembira, melahirkan Isa AS dengan izin Allah, dan mukjizat-mukjizatnya. Sumber: Maryam, Ali 'Imran.",
    tags: ["ketaatan", "syukur"],
    nodes: [
      { id: "mc1", ref: "3:42-43", label: "Maryam dipilih dan disucikan", tag: "ketaatan" },
      { id: "mc2", ref: "3:45-47", label: "Kabar gembira kelahiran Isa" },
      { id: "mc3", ref: "19:16-21", label: "Malaikat menyampaikan berita anak suci" },
      { id: "mc4", ref: "19:22-26", label: "Maryam melahirkan di bawah pohon kurma" },
      { id: "mc5", ref: "19:27-33", label: "Isa berbicara saat masih bayi", tag: "syukur" },
    ],
    edges: seq(["mc1", "mc2", "mc3", "mc4", "mc5"]),
  },
  {
    id: "yunus",
    title: "Kisah Nabi Yunus",
    icon: "🐋",
    desc: "Nabi Yunus AS meninggalkan kaumnya, ditelan ikan besar, lalu berdoa dalam kegelapan dan diselamatkan Allah. Sumber: As-Saffat.",
    tags: ["sabar", "pemaaf"],
    nodes: [
      { id: "un1", ref: "37:139-141", label: "Yunus melarikan diri & mengundi" },
      { id: "un2", ref: "37:142-144", label: "Ditelan ikan besar", tag: "sabar" },
      { id: "un3", ref: "21:87", label: "Doa dalam kegelapan: tiada Tuhan selain Engkau" },
      { id: "un4", ref: "37:145-146", label: "Dilemparkan ke daratan, tumbuh pohon labu" },
      { id: "un5", ref: "10:98", label: "Kaum Yunus beriman dan selamat" },
    ],
    edges: seq(["un1", "un2", "un3", "un4", "un5"]),
  },
  {
    id: "sulaiman-balqis",
    title: "Sulaiman & Ratu Balqis",
    icon: "👑",
    desc: "Nabi Sulaiman AS memahami bahasa burung dan semut, suratnya kepada Ratu Balqis, dan singgasananya yang dipindahkan sekejap mata. Sumber: An-Naml.",
    tags: ["keadilan", "tawadhu"],
    nodes: [
      { id: "sb1", ref: "27:16-17", label: "Sulaiman mewarisi ilmu & bala tentara" },
      { id: "sb2", ref: "27:18-19", label: "Memahami bahasa semut, bersyukur", tag: "tawadhu" },
      { id: "sb3", ref: "27:22-26", label: "Burung hud-hud membawa kabar negeri Saba'" },
      { id: "sb4", ref: "27:28-31", label: "Mengirim surat kepada Ratu Balqis" },
      { id: "sb5", ref: "27:38-40", label: "Singgasana dipindahkan sekejap mata" },
      { id: "sb6", ref: "27:44", label: "Balqis beriman kepada Allah", tag: "keadilan" },
    ],
    edges: seq(["sb1", "sb2", "sb3", "sb4", "sb5", "sb6"]),
  },
  {
    id: "dawud-jalut",
    title: "Dawud & Jalut",
    icon: "⚔️",
    desc: "Talut dan pasukannya menghadapi Jalut; Dawud muda membunuh Jalut dengan ketapel, lalu menjadi raja dan menerima hikmah. Sumber: Al-Baqarah.",
    tags: ["keberanian", "tawakal"],
    nodes: [
      { id: "dj1", ref: "2:246", label: "Bani Israil meminta diangkat raja" },
      { id: "dj2", ref: "2:247", label: "Talut diangkat sebagai raja" },
      { id: "dj3", ref: "2:249", label: "Ujian sungai bagi pasukan Talut" },
      { id: "dj4", ref: "2:250", label: "Doa pasukan yang sedikit", tag: "tawakal" },
      { id: "dj5", ref: "2:251", label: "Dawud membunuh Jalut", tag: "keberanian" },
    ],
    edges: seq(["dj1", "dj2", "dj3", "dj4", "dj5"]),
  },
  {
    id: "zakaria-yahya",
    title: "Zakaria & Yahya",
    icon: "🌾",
    desc: "Nabi Zakaria AS berdoa memohon keturunan di usia tua, dan Allah mengabulkan dengan kelahiran Yahya AS. Sumber: Maryam, Ali 'Imran.",
    tags: ["sabar", "syukur"],
    nodes: [
      { id: "zy1", ref: "3:37", label: "Zakaria menjaga Maryam, rezeki datang" },
      { id: "zy2", ref: "3:38-39", label: "Berdoa memohon keturunan", tag: "sabar" },
      { id: "zy3", ref: "19:2-6", label: "Doa dalam ketersembunyian" },
      { id: "zy4", ref: "19:7-9", label: "Kabar gembira kelahiran Yahya" },
      { id: "zy5", ref: "19:12-15", label: "Yahya diberi hikmah sejak kecil", tag: "syukur" },
    ],
    edges: seq(["zy1", "zy2", "zy3", "zy4", "zy5"]),
  },
  {
    id: "ayyub",
    title: "Kisah Nabi Ayyub",
    icon: "🤲",
    desc: "Nabi Ayyub AS diuji dengan penyakit dan kehilangan harta, namun tetap sabar dan bersyukur hingga Allah memulihkannya. Sumber: Sad, Al-Anbiya'.",
    tags: ["sabar", "syukur"],
    nodes: [
      { id: "ay1", ref: "38:41", label: "Ayyub berdoa: aku tertimpa penyakit", tag: "sabar" },
      { id: "ay2", ref: "38:42", label: "Perintah menghentakkan kaki, sembuh" },
      { id: "ay3", ref: "38:43", label: "Kembali diberi keluarga & hartanya" },
      { id: "ay4", ref: "21:83-84", label: "Doa: Engkau Maha Penyayang", tag: "syukur" },
    ],
    edges: seq(["ay1", "ay2", "ay3", "ay4"]),
  },
  {
    id: "hud-ad",
    title: "Nabi Hud & Kaum 'Ad",
    icon: "🌪️",
    desc: "Nabi Hud AS menyeru kaum 'Ad yang sombong, namun mereka mendustakan hingga azab berupa angin kencang menimpa mereka. Sumber: Hud, Al-A'raf.",
    tags: ["tawadhu", "keadilan"],
    nodes: [
      { id: "hd1", ref: "11:50-52", label: "Hud menyeru kaum 'Ad" },
      { id: "hd2", ref: "11:53-55", label: "Kaum 'Ad menantang dan mendustakan", tag: "keadilan" },
      { id: "hd3", ref: "7:68-69", label: "Peringatan tentang kesombongan", tag: "tawadhu" },
      { id: "hd4", ref: "11:58-59", label: "Azab angin kencang menimpa kaum yang zalim" },
      { id: "hd5", ref: "11:60", label: "Kebinasaan kaum 'Ad" },
    ],
    edges: seq(["hd1", "hd2", "hd3", "hd4", "hd5"]),
  },
  {
    id: "shalih",
    title: "Nabi Shalih & Unta Betina",
    icon: "🐪",
    desc: "Nabi Shalih AS diutus kepada kaum Tsamud dengan mukjizat unta betina, namun mereka membunuhnya hingga azab menimpa. Sumber: Hud, Al-A'raf, Asy-Syu'ara'.",
    tags: ["ketaatan", "keadilan"],
    nodes: [
      { id: "sh1", ref: "11:61-62", label: "Shalih menyeru kaum Tsamud" },
      { id: "sh2", ref: "11:64", label: "Unta betina sebagai tanda", tag: "ketaatan" },
      { id: "sh3", ref: "26:155-156", label: "Peringatan untuk tidak menyakiti unta" },
      { id: "sh4", ref: "7:77-78", label: "Unta dibunuh, azab menimpa", tag: "keadilan" },
      { id: "sh5", ref: "11:66", label: "Shalih dan orang beriman diselamatkan" },
    ],
    edges: seq(["sh1", "sh2", "sh3", "sh4", "sh5"]),
  },
  {
    id: "luth",
    title: "Nabi Luth & Kaum Sodom",
    icon: "🏚️",
    desc: "Nabi Luth AS menyeru kaum Sodom yang menyimpang, kedatangan tamu mulia, dan azab yang menimpa kaumnya. Sumber: Hud, Al-A'raf.",
    tags: ["keberanian", "keadilan"],
    nodes: [
      { id: "lu1", ref: "11:77-78", label: "Tamu mulia (malaikat) datang" },
      { id: "lu2", ref: "11:80-81", label: "Luth tak mampu menghadapi kaumnya", tag: "keberanian" },
      { id: "lu3", ref: "7:80-81", label: "Mengingatkan perbuatan yang melampaui batas", tag: "keadilan" },
      { id: "lu4", ref: "11:82", label: "Azab menimpa kaum Sodom" },
      { id: "lu5", ref: "11:81", label: "Luth dan keluarganya keluar malam itu" },
    ],
    edges: seq(["lu1", "lu2", "lu3", "lu4", "lu5"]),
  },
  {
    id: "dzulqarnain",
    title: "Dzul Qarnain & Ya'juj Ma'juj",
    icon: "🏰",
    desc: "Dzul Qarnain menjelajah bumi, menegakkan keadilan, dan membangun benteng untuk membendung Ya'juj Ma'juj. Sumber: Al-Kahf.",
    tags: ["keadilan", "tawakal"],
    nodes: [
      { id: "dq1", ref: "18:84-86", label: "Dzul Qarnain diberi kekuasaan" },
      { id: "dq2", ref: "18:86-88", label: "Menegakkan keadilan di barat", tag: "keadilan" },
      { id: "dq3", ref: "18:90-92", label: "Perjalanan ke timur & antara dua gunung" },
      { id: "dq4", ref: "18:94-95", label: "Minta bantuan membendung Ya'juj Ma'juj" },
      { id: "dq5", ref: "18:97-98", label: "Benteng berdiri; ini rahmat Tuhanku", tag: "tawakal" },
    ],
    edges: seq(["dq1", "dq2", "dq3", "dq4", "dq5"]),
  },
];
