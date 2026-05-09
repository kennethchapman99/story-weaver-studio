import { useState } from "react";
import { Link } from "react-router-dom";
import type { CustomerOrder } from "@/types/customerOrder";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  approvePreview, requestChanges, requestNewAccessLink, submitFollowUpAnswers,
} from "@/services/customerOrders";
import { toast } from "sonner";
import {
  Sparkles, FileText, Headphones, BookMarked, Truck, Download,
  PencilLine, CheckCircle2, Clock, ShieldCheck, RefreshCw,
} from "lucide-react";

const FORMAT_ICON: Record<string, any> = { pdf: FileText, epub: BookMarked, mp3: Headphones };

export function StatePanel({ order }: { order: CustomerOrder }) {
  switch (order.status) {
    case "intake_not_started": return <IntakeInvitationPanel order={order} />;
    case "intake_in_progress": return <IntakeInProgressPanel order={order} />;
    case "intake_submitted":
    case "intake_approved":
    case "book_queued": return <IntakeSummaryPanel order={order} />;
    case "needs_customer_info": return <FollowUpPanel order={order} />;
    case "book_generating": return <CreatingPanel />;
    case "book_delayed": return <DelayedPanel />;
    case "book_failed_internal_review": return <UnderReviewPanel />;
    case "preview_ready": return <PreviewPanel order={order} />;
    case "changes_requested":
    case "revision_generating": return <RevisionInProgressPanel order={order} />;
    case "approved":
    case "finalizing": return <FinalizingPanel order={order} />;
    case "digital_ready": return <DigitalDownloadPanel order={order} />;
    case "print_preparing":
    case "print_submitted": return <PrintPreparingPanel order={order} />;
    case "printing": return <PrintingPanel order={order} />;
    case "shipped": return <ShippedPanel order={order} />;
    case "delivered": return <DeliveredPanel order={order} />;
    case "cancelled":
    case "refunded": return <CancelledPanel order={order} />;
    case "payment_pending":
    case "payment_failed": return <PaymentPanel order={order} />;
    case "link_expired": return <ExpiredLinkPanel />;
    default: return null;
  }
}

function Shell({ title, children, icon: Icon }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <section id="panel" className="rounded-2xl border bg-card p-6 shadow-soft md:p-8">
      <header className="mb-4 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-secondary" />}
        <h2 className="font-display text-xl font-semibold md:text-2xl">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function IntakeInvitationPanel({ order }: { order: CustomerOrder }) {
  return (
    <Shell title="Tell us about your story" icon={Sparkles}>
      <ul className="grid gap-3 sm:grid-cols-3">
        <Bullet title="5–10 minutes" body="Quick answers are fine — share what you'd like." />
        <Bullet title="Short or detailed" body="Even a few sentences gives us plenty to work with." />
        <Bullet title="More personal = better" body="The more you share, the more personal the story." />
      </ul>
      <div className="mt-5 grid gap-3 rounded-xl border bg-muted/40 p-4 sm:grid-cols-3">
        <Meta k="Book" v={order.packageName} />
        <Meta k="Format" v={order.formatLabel} />
        <Meta k="Updates to" v={order.customerEmail} />
      </div>
      <Button asChild variant="magic" size="lg" className="mt-5">
        <Link to="/create/wizard"><Sparkles className="mr-1 h-4 w-4" /> Start story intake</Link>
      </Button>
    </Shell>
  );
}

function IntakeInProgressPanel({ order }: { order: CustomerOrder }) {
  const intake = order.intake!;
  const pct = Math.round((intake.completedSections / intake.totalSections) * 100);
  return (
    <Shell title="Pick up where you left off" icon={PencilLine}>
      <p className="text-sm text-muted-foreground">
        {intake.completedSections} of {intake.totalSections} sections complete
        {intake.lastSavedAt && (
          <> · Last saved {new Date(intake.lastSavedAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</>
        )}
      </p>
      <Progress value={pct} className="mt-3 h-2" />
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Remaining</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {intake.remaining.map((r) => (
            <li key={r} className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" /> {r}
            </li>
          ))}
        </ul>
      </div>
      <Button asChild variant="magic" size="lg" className="mt-5">
        <Link to="/create/wizard">Continue story intake</Link>
      </Button>
    </Shell>
  );
}

function IntakeSummaryPanel({ order }: { order: CustomerOrder }) {
  const summary = order.intakeSummary ?? [];
  return (
    <Shell title="Story details on file" icon={CheckCircle2}>
      <p className="text-sm text-muted-foreground">
        If we need anything else, we'll email you. You can request small changes until generation starts.
      </p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {summary.map((row) => (
          <div key={row.label} className="rounded-xl border bg-background p-3">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{row.label}</dt>
            <dd className="mt-1 text-sm font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Shell>
  );
}

function FollowUpPanel({ order }: { order: CustomerOrder }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  async function submit() {
    setSending(true);
    try {
      await submitFollowUpAnswers(order.accessToken, answers);
      toast.success("Thanks — we'll continue from here.");
    } finally { setSending(false); }
  }
  return (
    <Shell title="A few more details" icon={PencilLine}>
      <p className="text-sm text-muted-foreground">
        Your answers were a little light in a few areas. A few more details will help us make the story feel personal.
      </p>
      <div className="mt-5 space-y-4">
        {(order.followUpQuestions ?? []).map((q) => (
          <div key={q.id}>
            <Label htmlFor={q.id} className="text-sm">{q.question}</Label>
            <Textarea
              id={q.id}
              rows={2}
              className="mt-1.5"
              value={answers[q.id] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              placeholder="Type your answer…"
            />
          </div>
        ))}
      </div>
      <Button variant="magic" size="lg" className="mt-5" onClick={submit} disabled={sending}>
        Send answers
      </Button>
    </Shell>
  );
}

const ACTIVITY = [
  { label: "Writing the story", state: "current" as const },
  { label: "Creating the cover direction", state: "upcoming" as const },
  { label: "Preparing the book layout", state: "upcoming" as const },
  { label: "Final quality check", state: "upcoming" as const },
];

function CreatingPanel() {
  return (
    <Shell title="What's happening now" icon={Sparkles}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {ACTIVITY.map((a) => (
          <li key={a.label} className="rounded-xl border bg-background p-4">
            <p className="text-sm font-medium">{a.label}</p>
            <p className="text-xs text-muted-foreground capitalize">{a.state === "current" ? "In progress" : "Upcoming"}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-muted-foreground">
        We'll email you the moment your preview is ready. No need to wait on this page.
      </p>
    </Shell>
  );
}

function DelayedPanel() {
  return (
    <Shell title="Still working on it" icon={Clock}>
      <p className="text-sm text-muted-foreground">
        The story creation step is taking longer than usual. We're still working on it and will email you when the next step is ready.
      </p>
    </Shell>
  );
}

function UnderReviewPanel() {
  return (
    <Shell title="A team member is taking a look" icon={ShieldCheck}>
      <p className="text-sm text-muted-foreground">
        Something needs attention before we can finish your book. We've saved your order and story details — no action is needed from you right now. We'll email you when it's resolved.
      </p>
    </Shell>
  );
}

function PreviewPanel({ order }: { order: CustomerOrder }) {
  const p = order.preview!;
  const [showChanges, setShowChanges] = useState(false);
  const [cats, setCats] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);

  const toggle = (c: string) =>
    setCats((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  async function approve() {
    setSending(true);
    try { await approvePreview(order.accessToken); toast.success("Approved! We're finalizing your book."); }
    finally { setSending(false); }
  }
  async function send() {
    setSending(true);
    try {
      await requestChanges(order.accessToken, { categories: cats, notes });
      toast.success("Change request received");
      setShowChanges(false);
    } finally { setSending(false); }
  }

  return (
    <Shell title="Preview your book" icon={Sparkles}>
      <div className="grid gap-5 md:grid-cols-[180px_1fr]">
        <div className="aspect-[2/3] rounded-xl border bg-gradient-magic shadow-elegant" aria-hidden />
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-semibold leading-tight">{p.title}</h3>
          {p.authorLine && <p className="text-sm text-muted-foreground">{p.authorLine}</p>}
          {p.excerpt && (
            <blockquote className="mt-3 rounded-xl border-l-4 border-secondary/40 bg-muted/40 p-4 text-sm italic">
              {p.excerpt}
            </blockquote>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            {p.pdfUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={p.pdfUrl}><FileText className="mr-1 h-4 w-4" /> Open preview PDF</a>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
        Your package includes <strong>one round of small changes</strong>.
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="magic" size="lg" onClick={approve} disabled={sending}>
          <CheckCircle2 className="mr-1 h-4 w-4" /> Approve and finalize
        </Button>
        <Button variant="outline" size="lg" onClick={() => setShowChanges((s) => !s)}>
          <PencilLine className="mr-1 h-4 w-4" /> Request changes
        </Button>
      </div>
      {showChanges && (
        <div className="mt-5 space-y-3 rounded-xl border bg-background p-4">
          <p className="text-sm font-medium">What would you like changed?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {["Character name/details", "Tone", "Ending", "Cover", "Dedication", "Other"].map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <Checkbox checked={cats.includes(c)} onCheckedChange={() => toggle(c)} /> {c}
              </label>
            ))}
          </div>
          <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tell us more (optional)" />
          <Button variant="magic" onClick={send} disabled={sending || (!cats.length && !notes.trim())}>
            Send change request
          </Button>
        </div>
      )}
    </Shell>
  );
}

function RevisionInProgressPanel({ order }: { order: CustomerOrder }) {
  const cr = order.changeRequest;
  return (
    <Shell title="Revision in progress" icon={RefreshCw}>
      {cr ? (
        <div className="space-y-3">
          <p className="text-sm">
            Revision <strong>{cr.revisionNumber} of {cr.totalRevisions}</strong> is now in progress.
          </p>
          <div className="rounded-xl border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your request</p>
            <p className="mt-1 text-sm">{cr.summary}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Submitted {new Date(cr.submittedAt).toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            We'll email you when the updated preview is ready.
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">We're updating your book based on your request.</p>
      )}
    </Shell>
  );
}

function FinalizingPanel({ order }: { order: CustomerOrder }) {
  const items = [
    "Final manuscript",
    "Final cover",
    "Interior PDF",
    ...(order.isPrintIncluded ? ["Print-ready cover PDF"] : []),
    "Digital version",
    "Quality check",
  ];
  return (
    <Shell title="Final files in production" icon={ShieldCheck}>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i} className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" /> {i}
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function DigitalDownloadPanel({ order }: { order: CustomerOrder }) {
  return (
    <Shell title="Download your book" icon={Download}>
      <ul className="space-y-3">
        {(order.downloads ?? []).map((d) => {
          const Icon = FORMAT_ICON[d.fileType] ?? FileText;
          return (
            <li key={d.url} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background p-4">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.fileType.toUpperCase()}{d.sizeMb ? ` · ${d.sizeMb} MB` : ""}
                  </p>
                </div>
              </div>
              <Button asChild variant="magic" size="sm">
                <a href={d.url}><Download className="mr-1 h-4 w-4" /> Download</a>
              </Button>
            </li>
          );
        })}
      </ul>
      {order.isPrintIncluded && (
        <p className="mt-4 text-sm text-muted-foreground">
          Your digital copy is ready. Your printed book is now being prepared.
        </p>
      )}
    </Shell>
  );
}

function PrintPreparingPanel({ order }: { order: CustomerOrder }) {
  const s = order.shipping;
  return (
    <Shell title="Print order being prepared" icon={BookMarked}>
      <DownloadInline order={order} />
      {s && (
        <div className="mt-5 grid gap-3 rounded-xl border bg-background p-4 sm:grid-cols-2">
          <Meta k="Shipping to" v={`${s.recipientName} — ${s.city}, ${s.region}, ${s.country}`} />
          {s.printReference && <Meta k="Print reference" v={s.printReference} />}
        </div>
      )}
    </Shell>
  );
}

function PrintingPanel({ order }: { order: CustomerOrder }) {
  const s = order.shipping;
  return (
    <Shell title="In production" icon={BookMarked}>
      <p className="text-sm text-muted-foreground">
        Your book is currently being printed. We'll email you when tracking is available.
      </p>
      {s && (
        <div className="mt-4 grid gap-3 rounded-xl border bg-background p-4 sm:grid-cols-2">
          <Meta k="Format" v={order.formatLabel} />
          {s.estimatedDelivery && <Meta k="Estimated delivery" v={s.estimatedDelivery} />}
          <Meta k="Shipping to" v={`${s.recipientName} — ${s.city}, ${s.region}, ${s.country}`} />
          {s.printReference && <Meta k="Print reference" v={s.printReference} />}
        </div>
      )}
      <DownloadInline order={order} className="mt-5" />
    </Shell>
  );
}

function ShippedPanel({ order }: { order: CustomerOrder }) {
  const s = order.shipping!;
  return (
    <Shell title="On its way" icon={Truck}>
      <div className="grid gap-3 rounded-xl border bg-background p-4 sm:grid-cols-2">
        <Meta k="Carrier" v={s.carrier ?? "—"} />
        <Meta k="Tracking" v={s.trackingNumber ?? "—"} />
        {s.estimatedDelivery && <Meta k="Estimated delivery" v={s.estimatedDelivery} />}
        <Meta k="Shipping to" v={`${s.recipientName} — ${s.city}, ${s.region}, ${s.country}`} />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {s.trackingUrl && (
          <Button asChild variant="magic" size="lg">
            <a href={s.trackingUrl} target="_blank" rel="noreferrer"><Truck className="mr-1 h-4 w-4" /> Track shipment</a>
          </Button>
        )}
      </div>
      <DownloadInline order={order} className="mt-5" />
    </Shell>
  );
}

function DeliveredPanel({ order }: { order: CustomerOrder }) {
  return (
    <Shell title="Delivered" icon={CheckCircle2}>
      <p className="text-sm text-muted-foreground">
        Your custom book has arrived. We hope it becomes a favourite — we'd love to hear what you thought.
      </p>
      <DownloadInline order={order} className="mt-4" />
      <div className="mt-5 rounded-xl border bg-gradient-card p-4">
        <p className="font-display text-lg font-semibold">Want to turn this into a series?</p>
        <p className="mt-1 text-sm text-muted-foreground">Continue the world you built — book two starts from your story.</p>
        <Button asChild variant="magic" size="sm" className="mt-3">
          <Link to="/create">Create the next adventure</Link>
        </Button>
      </div>
    </Shell>
  );
}

function CancelledPanel({ order }: { order: CustomerOrder }) {
  return (
    <Shell title="Order cancelled" icon={ShieldCheck}>
      <div className="space-y-2 text-sm">
        <p>Order <span className="font-mono">{order.id}</span> is no longer active.</p>
        {order.refund?.refundedAt && (
          <p className="text-muted-foreground">
            Refund of {order.refund.amount ? `$${order.refund.amount}` : "your purchase"} issued on {new Date(order.refund.refundedAt).toLocaleDateString()}.
          </p>
        )}
      </div>
    </Shell>
  );
}

function PaymentPanel({ order }: { order: CustomerOrder }) {
  return (
    <Shell title="Complete your payment" icon={ShieldCheck}>
      <div className="grid gap-3 rounded-xl border bg-background p-4 sm:grid-cols-3">
        <Meta k="Product" v={order.packageName} />
        <Meta k="Amount" v={order.payment ? `$${order.payment.amount} ${order.payment.currency}` : "—"} />
        <Meta k="Status" v="Awaiting payment" />
      </div>
      <Button asChild variant="magic" size="lg" className="mt-4">
        <Link to={order.payment?.resumeCheckoutUrl ?? "/checkout"}>Complete payment</Link>
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        Production starts as soon as payment is confirmed.
      </p>
    </Shell>
  );
}

function ExpiredLinkPanel() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  async function submit() {
    setSending(true);
    try { await requestNewAccessLink(email); setSent(true); }
    finally { setSending(false); }
  }
  return (
    <Shell title="Send a new access link" icon={ShieldCheck}>
      {sent ? (
        <p className="text-sm text-muted-foreground">
          If this email matches an order, we'll send a fresh access link.
        </p>
      ) : (
        <div className="space-y-3">
          <div>
            <Label htmlFor="email">Order email</Label>
            <Input id="email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <Button variant="magic" onClick={submit} disabled={sending || !email.includes("@")}>
            Send me a new link
          </Button>
        </div>
      )}
    </Shell>
  );
}

function Bullet({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-xl border bg-background p-4">
      <p className="font-display text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </li>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className="text-sm font-medium">{v}</p>
    </div>
  );
}

function DownloadInline({ order, className = "" }: { order: CustomerOrder; className?: string }) {
  if (!order.downloads?.length) return null;
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Digital copy</p>
      <ul className="space-y-2">
        {order.downloads.map((d) => {
          const Icon = FORMAT_ICON[d.fileType] ?? FileText;
          return (
            <li key={d.url} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm">
              <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-secondary" /> {d.label}</span>
              <Button asChild variant="ghost" size="sm">
                <a href={d.url}><Download className="mr-1 h-4 w-4" /> Download</a>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
