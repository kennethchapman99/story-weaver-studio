import { Section } from "./Section";
import { ShieldCheck, UserCheck, Settings2, RefreshCcw } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, title: "Private inputs", desc: "Your story details are never shared or used to train external models." },
  { icon: UserCheck, title: "Human review available", desc: "Editors verify tone, safety, and character consistency." },
  { icon: Settings2, title: "Parent-friendly controls", desc: "Choose scary, violence, romance, and language thresholds." },
  { icon: RefreshCcw, title: "Revision window", desc: "Every package includes at least one revision pass before delivery." },
];

export function TrustSection() {
  return (
    <Section eyebrow="Trust" title="Crafted with care, reviewed by people">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((i) => (
          <div key={i.title} className="rounded-2xl border bg-gradient-card p-6 shadow-soft">
            <i.icon className="h-6 w-6 text-accent" />
            <h4 className="mt-4 font-display text-lg font-semibold">{i.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{i.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
