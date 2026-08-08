import type { Badge } from "@/lib/badges";

export function BadgeList({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Belum ada lencana. Terus istiqomah menghafal!
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((b) => (
        <span
          key={b.id}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-white"
          style={{ backgroundColor: b.color }}
        >
          <span aria-hidden>{b.icon}</span>
          {b.label}
        </span>
      ))}
    </div>
  );
}
