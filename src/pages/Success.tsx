import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, FileText, Pencil, Truck, Sparkles } from "lucide-react";
import { useOrderDraft } from "@/store/orderDraft";
import { PACKAGES } from "@/data/packages";

const STEPS = [
  { icon: Sparkles, title: "Story blueprint generated", desc: "We finalize the structural plan from your inputs." },
  { icon: FileText, title: "Draft production begins", desc: "Chapters are written, edited, and reviewed by humans." },
  { icon: Pencil, title: "Review window opens", desc: "Read the draft and request your revision pass." },
  { icon: Truck, title: "Files & prints delivered", desc: "Ebook, audiobook, and printed copies arrive." },
];

export default function Success() {
  const [params] = useSearchParams();
  const orderId = params.get("order") || "SL-XXXXX";
  const { draft, reset } = useOrderDraft();
  const pkg = PACKAGES.find((p) => p.id === draft.package.packageId);

  return (
    <PageShell>
      <div className="container max-w-3xl py-16 md:py-24 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-magic text-primary-foreground shadow-glow">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold">Your StoryLoom order is underway</h1>
        <p className="mt-4 text-lg text-muted-foreground">Order <span className="font-mono text-foreground">{orderId}</span> · {pkg?.name || "Package"}</p>

        <div className="mt-10 rounded-3xl border bg-gradient-card p-6 md:p-8 shadow-card text-left">
          <h2 className="font-display text-lg font-semibold mb-4">What happens next</h2>
          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background shadow-soft">
                  <s.icon className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold">{i + 1}. {s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="magic" size="lg"><Link to="/dashboard">View order</Link></Button>
          <Button asChild variant="outline" size="lg" onClick={() => reset()}><Link to="/create">Start another book</Link></Button>
        </div>
      </div>
    </PageShell>
  );
}
