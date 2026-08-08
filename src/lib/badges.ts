export interface Badge {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface BadgeInput {
  surahCount: number;
  streakDays: number;
  reflectionsCount: number;
}

export function computeBadges({
  surahCount,
  streakDays,
  reflectionsCount,
}: BadgeInput): Badge[] {
  const badges: Badge[] = [];
  if (surahCount >= 20) {
    badges.push({ id: "juz30", label: "Hafizh Juz 30", icon: "📖", color: "#10b981" });
  }
  if (surahCount >= 50) {
    badges.push({ id: "juz5", label: "Hafizh 5 Juz", icon: "🛡️", color: "#8b5cf6" });
  }
  if (streakDays >= 7) {
    badges.push({ id: "istiqomah7", label: "Istiqomah 7 Hari", icon: "✨", color: "#f59e0b" });
  }
  if (streakDays >= 30) {
    badges.push({ id: "istiqomah30", label: "Istiqomah 30 Hari", icon: "🔥", color: "#ef4444" });
  }
  if (reflectionsCount >= 3) {
    badges.push({ id: "contributor", label: "Tadabbur Contributor", icon: "📝", color: "#06b6d4" });
  }
  return badges;
}
