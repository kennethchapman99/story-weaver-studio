import type { UpdateEvent } from "@/types/customerOrder";

export function UpdatesFeed({ updates }: { updates: UpdateEvent[] }) {
  if (!updates.length) return null;
  const sorted = [...updates].sort((a, b) => +new Date(b.at) - +new Date(a.at));
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-soft">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-secondary">
        Updates
      </h3>
      <ol className="mt-3 space-y-3">
        {sorted.map((u, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" />
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight">{u.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(u.at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
