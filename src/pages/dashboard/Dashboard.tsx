import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/storyloom/Section";
import { listOrders } from "@/services/api";
import { useEffect, useState } from "react";
import type { Order } from "@/types/storyloom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { statusLabel } from "@/components/storyloom/OrderStatusTimeline";
import { PACKAGES } from "@/data/packages";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { listOrders().then(setOrders); }, []);

  return (
    <PageShell>
      <Section eyebrow="My orders" title="Your StoryLoom dashboard" subtitle="Track every book from blueprint to delivery.">
        {orders.length === 0 && (
          <div className="rounded-3xl border bg-gradient-card p-10 text-center shadow-soft">
            <Sparkles className="mx-auto h-8 w-8 text-secondary" />
            <h3 className="mt-3 font-display text-2xl font-semibold">No orders yet</h3>
            <p className="mt-1 text-muted-foreground">Start your first book and it'll appear here.</p>
            <Button asChild variant="magic" className="mt-5"><Link to="/create">Start your book</Link></Button>
          </div>
        )}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((o) => {
            const pkg = PACKAGES.find((p) => p.id === o.package.packageId);
            return (
              <Link to={`/dashboard/${o.id}`} key={o.id} className="group rounded-2xl border bg-gradient-card p-6 shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-card">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                  <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">{statusLabel(o.status)}</span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold">{o.recipient.firstName || "Untitled"}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{pkg?.name} · {o.package.formats.join(", ")}</p>
                <p className="mt-3 text-xs text-muted-foreground">Created {new Date(o.createdAt).toLocaleDateString()}</p>
                <p className="mt-1 text-sm font-medium text-secondary group-hover:underline">View details →</p>
              </Link>
            );
          })}
        </div>
      </Section>
    </PageShell>
  );
}
