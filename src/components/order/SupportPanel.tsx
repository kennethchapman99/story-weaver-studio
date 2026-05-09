import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail } from "lucide-react";

export function SupportPanel({ orderId }: { orderId: string }) {
  return (
    <section id="support" className="rounded-2xl border bg-gradient-card p-5 shadow-soft">
      <div className="flex items-center gap-2 text-secondary">
        <LifeBuoy className="h-4 w-4" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider">Support</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Questions about your order? Reach out and we'll get back the same day.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Reference: <span className="font-mono text-foreground">{orderId}</span>
      </p>
      <Button asChild variant="outline" size="sm" className="mt-3">
        <a href={`mailto:hello@storyloom.example?subject=Order%20${orderId}`}>
          <Mail className="mr-1 h-4 w-4" /> Contact support
        </a>
      </Button>
    </section>
  );
}
