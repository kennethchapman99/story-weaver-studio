import { PageShell } from "@/components/layout/PageShell";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrder, submitRevision } from "@/services/api";
import type { Order } from "@/types/storyloom";
import { OrderStatusTimeline, statusLabel } from "@/components/storyloom/OrderStatusTimeline";
import { StoryBlueprintPreview } from "@/components/storyloom/StoryBlueprintPreview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PACKAGES } from "@/data/packages";
import { ArrowLeft, FileText, Headphones, BookMarked } from "lucide-react";
import { toast } from "sonner";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | undefined>();
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => { if (id) getOrder(id).then(setOrder); }, [id]);

  if (!order) return <PageShell><div className="container py-20">Loading…</div></PageShell>;
  const pkg = PACKAGES.find((p) => p.id === order.package.packageId);

  async function handleRevision() {
    if (!notes.trim() || !id) return;
    setSending(true);
    try { await submitRevision(id, notes); toast.success("Revision request submitted"); setNotes(""); }
    finally { setSending(false); }
  }

  return (
    <PageShell>
      <div className="container max-w-5xl py-12">
        <Button asChild variant="ghost" size="sm" className="mb-4"><Link to="/dashboard"><ArrowLeft className="mr-1 h-4 w-4" /> All orders</Link></Button>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold">{order.recipient.firstName}'s book</h1>
            <p className="text-muted-foreground">{pkg?.name} · {statusLabel(order.status)}</p>
          </div>
        </div>
        <OrderStatusTimeline status={order.status} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {order.blueprint ? <StoryBlueprintPreview blueprint={order.blueprint} /> : (
              <div className="rounded-2xl border bg-gradient-card p-8 text-center text-muted-foreground shadow-soft">
                Blueprint will appear here once generation completes.
              </div>
            )}
            <div className="rounded-2xl border bg-card p-6 shadow-soft">
              <h3 className="font-display text-lg font-semibold mb-3">Request a revision</h3>
              <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What would you like adjusted? Tone, characters, scenes…" />
              <Button variant="magic" className="mt-3" onClick={handleRevision} disabled={sending || !notes.trim()}>Submit revision</Button>
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-secondary mb-3">Files</h4>
              <ul className="space-y-2 text-sm">
                {order.package.formats.includes("ebook") && <FileRow icon={FileText} label="Ebook (EPUB + PDF)" />}
                {order.package.formats.includes("audiobook") && <FileRow icon={Headphones} label="Audiobook (MP3)" />}
                {(order.package.formats.includes("paperback") || order.package.formats.includes("hardcover")) && <FileRow icon={BookMarked} label="Print-ready PDF" />}
              </ul>
            </div>
            <div className="rounded-2xl border bg-card p-5 shadow-soft text-sm">
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-secondary mb-3">Notes</h4>
              <p className="text-muted-foreground">Updated {new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

function FileRow({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <li className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
      <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-secondary" /> {label}</span>
      <span className="text-xs text-muted-foreground">Pending</span>
    </li>
  );
}
