import { Section } from "./Section";
import { Cake, BookOpen, Sword, Tent, Moon, Rocket } from "lucide-react";

const CASES = [
  { icon: Cake, title: "Birthday gift", desc: "Make them the hero of an unforgettable adventure." },
  { icon: BookOpen, title: "Reluctant reader", desc: "Hook them with characters and worlds they already love." },
  { icon: Sword, title: "Teen fantasy series", desc: "A three-book arc with cinematic stakes." },
  { icon: Tent, title: "Family adventure", desc: "Real names, real places, woven into the story." },
  { icon: Moon, title: "Personalized bedtime novel", desc: "Cozy chapters crafted for a nightly read-aloud." },
  { icon: Rocket, title: "Custom sci-fi universe", desc: "Build the canon. Then live in it." },
];

export function UseCases() {
  return (
    <Section eyebrow="Use cases" title="Built for the moments that matter" className="bg-gradient-soft">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CASES.map((c) => (
          <div key={c.title} className="flex gap-4 rounded-2xl border bg-background p-5 shadow-soft hover:shadow-card transition-smooth">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold">{c.title}</h4>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
