import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/storyloom/Section";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen, Library, MessagesSquare, FormInput, Sparkles, HelpCircle } from "lucide-react";

const RECIPIENTS = [
  { id: "self", label: "Myself", desc: "I'm writing this for me." },
  { id: "child", label: "My child", desc: "Personalized adventures for kids." },
  { id: "teen", label: "Teen reader", desc: "YA tone with deeper stakes." },
  { id: "gift", label: "Friend / family gift", desc: "Surprise someone with their story." },
  { id: "group", label: "Classroom / group", desc: "Shared cast, shared world." },
];

const TYPES = [
  { id: "novel", label: "Single custom novel", icon: BookOpen, desc: "One book, fully tailored." },
  { id: "series", label: "3-book series", icon: Library, desc: "A connected arc across three books." },
  { id: "unsure", label: "Not sure yet", icon: HelpCircle, desc: "We'll recommend based on your inputs." },
];

const MODES = [
  { id: "wizard", label: "Guided wizard", icon: MessagesSquare, desc: "Easier, conversational, fast.", to: "/create/wizard" },
  { id: "form", label: "Detailed form", icon: FormInput, desc: "More control, deeper personalization.", to: "/create/form" },
];

export default function OrderTypeSelector() {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [mode, setMode] = useState<string>("wizard");

  const ready = recipient && type && mode;
  const targetMode = MODES.find((m) => m.id === mode)!;

  return (
    <PageShell>
      <Section
        align="center"
        eyebrow="Start your book"
        title={<>A few quick questions, <span className="text-gradient-magic">then we begin</span></>}
        subtitle="We'll use this to set up the right intake — you can change anything later."
      >
        <div className="mx-auto max-w-4xl space-y-10 text-left">
          <Group title="Who is this book for?">
            {RECIPIENTS.map((r) => (
              <Choice key={r.id} selected={recipient === r.id} onClick={() => setRecipient(r.id)} title={r.label} desc={r.desc} />
            ))}
          </Group>

          <Group title="What are you creating?">
            {TYPES.map((t) => (
              <Choice
                key={t.id}
                selected={type === t.id}
                onClick={() => setType(t.id)}
                icon={<t.icon className="h-5 w-5 text-secondary" />}
                title={t.label}
                desc={t.desc}
              />
            ))}
          </Group>

          <Group title="Preferred experience">
            {MODES.map((m) => (
              <Choice
                key={m.id}
                selected={mode === m.id}
                onClick={() => setMode(m.id)}
                icon={<m.icon className="h-5 w-5 text-accent" />}
                title={m.label}
                desc={m.desc}
              />
            ))}
          </Group>

          <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <Button variant="ghost" asChild><Link to="/">Back to home</Link></Button>
            <Button
              variant="magic"
              size="lg"
              disabled={!ready}
              onClick={() => navigate(targetMode.to)}
            >
              Continue <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold mb-4">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function Choice({
  selected, onClick, title, desc, icon,
}: { selected?: boolean; onClick?: () => void; title: string; desc: string; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border bg-card p-5 text-left shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-card",
        selected && "border-secondary ring-2 ring-secondary/40 bg-gradient-card",
      )}
    >
      {icon && <div className="mb-3">{icon}</div>}
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
    </button>
  );
}
