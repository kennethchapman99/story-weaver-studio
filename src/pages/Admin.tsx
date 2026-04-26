import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/storyloom/Section";
import { listOrders, sendToPipeline, setOrderStatus } from "@/services/api";
import type { Order, OrderStatus } from "@/types/storyloom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { statusLabel } from "@/components/storyloom/OrderStatusTimeline";
import { PACKAGES } from "@/data/packages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Download, Send } from "lucide-react";
import { toast } from "sonner";

const ALL_STATUSES: OrderStatus[] = ["intake-incomplete","blueprint-pending","blueprint-ready","draft-in-progress","ready-for-review","final-production","shipped","delivered"];

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<Order | null>(null);

  async function refresh() { setOrders(await listOrders()); }
  useEffect(() => { refresh(); }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  function exportJson() {
    const blob = new Blob([JSON.stringify(orders, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "storyloom-orders.json"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PageShell>
      <Section eyebrow="Admin (mock)" title="Orders & pipeline" subtitle="Passwordless preview. Wire to real auth before shipping.">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={exportJson}><Download className="mr-1 h-4 w-4" /> Export JSON</Button>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th><th className="px-4 py-3">Recipient</th><th className="px-4 py-3">Package</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const pkg = PACKAGES.find((p) => p.id === o.package.packageId);
                return (
                  <tr key={o.id} className="border-t hover:bg-muted/30 transition-smooth">
                    <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                    <td className="px-4 py-3">{o.recipient.firstName}</td>
                    <td className="px-4 py-3">{pkg?.name}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary">{statusLabel(o.status)}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(o.updatedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost" onClick={() => setActive(o)}>Open</Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {active && (
            <>
              <SheetHeader><SheetTitle>{active.id} · {active.recipient.firstName}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Status</p>
                  <Select value={active.status} onValueChange={async (v) => { await setOrderStatus(active.id, v as OrderStatus); await refresh(); setActive({ ...active, status: v as OrderStatus }); }}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <pre className="max-h-[40vh] overflow-auto rounded-lg bg-muted p-3 text-xs">{JSON.stringify(active, null, 2)}</pre>
                <Button variant="magic" className="w-full" onClick={async () => { await sendToPipeline(active.id); toast.success("Sent to backend pipeline"); }}>
                  <Send className="mr-1 h-4 w-4" /> Send to backend pipeline
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}
