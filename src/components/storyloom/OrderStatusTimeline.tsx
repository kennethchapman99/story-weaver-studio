import type { OrderStatus } from "@/types/storyloom";
import { cn } from "@/lib/utils";

const STATUSES: { id: OrderStatus; label: string }[] = [
  { id: "intake-incomplete", label: "Intake" },
  { id: "blueprint-pending", label: "Blueprint pending" },
  { id: "blueprint-ready", label: "Blueprint ready" },
  { id: "draft-in-progress", label: "Draft in progress" },
  { id: "ready-for-review", label: "Ready for review" },
  { id: "final-production", label: "Final production" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
];

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  const idx = STATUSES.findIndex((s) => s.id === status);
  return (
    <ol className="grid gap-2 md:grid-cols-4 text-xs">
      {STATUSES.map((s, i) => (
        <li key={s.id} className={cn("rounded-lg border px-3 py-2", i <= idx ? "border-secondary/40 bg-secondary/10 text-foreground" : "text-muted-foreground")}>
          <span className="font-mono mr-1">0{i + 1}</span> {s.label}
        </li>
      ))}
    </ol>
  );
}

export function statusLabel(s: OrderStatus) {
  return STATUSES.find((x) => x.id === s)?.label || s;
}
