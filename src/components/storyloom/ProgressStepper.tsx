import { cn } from "@/lib/utils";

export function ProgressStepper({ steps, current, onJump }: { steps: string[]; current: number; onJump?: (i: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-magic transition-smooth" style={{ width: `${((current + 1) / steps.length) * 100}%` }} />
      </div>
      <div className="flex flex-wrap gap-1.5 text-xs">
        {steps.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => onJump?.(i)}
            className={cn(
              "rounded-full px-2.5 py-1 transition-smooth",
              i === current ? "bg-secondary text-secondary-foreground" :
              i < current ? "bg-muted text-foreground hover:bg-muted/70" :
              "text-muted-foreground hover:text-foreground"
            )}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>
    </div>
  );
}
