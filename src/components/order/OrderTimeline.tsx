import type { TimelineStep } from "@/types/customerOrder";
import { Check, Circle, AlertCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STATE_META: Record<TimelineStep["state"], { icon: any; label: string; classes: string }> = {
  complete:    { icon: Check,       label: "Done",            classes: "border-accent/50 bg-accent/10 text-accent" },
  current:     { icon: Loader2,     label: "In progress",     classes: "border-secondary/50 bg-secondary/10 text-secondary" },
  upcoming:    { icon: Circle,      label: "Upcoming",        classes: "border-border bg-muted/40 text-muted-foreground" },
  "needs-input": { icon: AlertCircle, label: "Needs your input", classes: "border-gold/60 bg-gold/15 text-foreground" },
  delayed:     { icon: Clock,       label: "Taking longer",   classes: "border-gold/60 bg-gold/10 text-foreground" },
  review:      { icon: AlertCircle, label: "Under review",    classes: "border-destructive/40 bg-destructive/10 text-destructive" },
};

export function OrderTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
      {steps.map((s, i) => {
        const meta = STATE_META[s.state];
        const Icon = meta.icon;
        const spin = s.state === "current";
        return (
          <li
            key={s.id}
            className={cn(
              "rounded-2xl border p-4 transition-smooth",
              meta.classes,
            )}
          >
            <div className="flex items-center gap-2 text-xs font-mono opacity-70">
              <span>0{i + 1}</span>
              <Icon className={cn("h-3.5 w-3.5", spin && "animate-spin")} />
            </div>
            <p className="mt-2 font-display text-sm font-semibold leading-tight">{s.label}</p>
            <p className="mt-1 text-xs opacity-80">{meta.label}</p>
            {s.timestamp && <p className="mt-1 text-[10px] opacity-60">{s.timestamp}</p>}
          </li>
        );
      })}
    </ol>
  );
}
