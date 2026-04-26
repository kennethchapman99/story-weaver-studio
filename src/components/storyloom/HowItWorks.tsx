import { Section } from "./Section";
import { MessagesSquare, Users2, FileText, BookOpenCheck } from "lucide-react";

const STEPS = [
  { icon: MessagesSquare, title: "Tell us what they love", desc: "Share favorite books, characters, worlds, themes, and the people behind the story." },
  { icon: Users2, title: "Shape characters and world", desc: "Cast a hero, build a sidekick, choose a setting and tone — guided or detailed." },
  { icon: FileText, title: "Review the story blueprint", desc: "We assemble a clear blueprint you can edit before any draft is written." },
  { icon: BookOpenCheck, title: "Get ebook, audiobook & print", desc: "Receive every format. Request a revision pass. Then it's theirs forever." },
];

export function HowItWorks() {
  return (
    <Section
      eyebrow="How it works"
      title="From spark to printed book in four steps"
      subtitle="Start simple. Add depth when you're ready."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative rounded-2xl border bg-gradient-card p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-magic text-primary-foreground shadow-glow">
              <s.icon className="h-5 w-5" />
            </div>
            <span className="absolute right-5 top-5 font-display text-3xl font-semibold text-muted-foreground/30">
              0{i + 1}
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
