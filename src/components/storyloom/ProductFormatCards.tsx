import { Section } from "./Section";
import { BookText, Headphones, BookMarked, Library, Gift, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const PRODUCTS = [
  { icon: BookMarked, title: "Custom Novel", desc: "A standalone book written around your inputs.", to: "/packages" },
  { icon: Library, title: "3-Book Series", desc: "A connected arc across three custom novels.", to: "/packages" },
  { icon: Gift, title: "Gift Edition", desc: "Premium printed and presented to delight.", to: "/packages" },
];

const FORMATS = [
  { icon: BookText, title: "Ebook", desc: "EPUB + PDF, ready for any device." },
  { icon: Headphones, title: "Audiobook", desc: "Narrated chapters, MP3 delivery." },
  { icon: BookMarked, title: "Printed Book", desc: "Paperback or premium hardcover." },
];

export function ProductFormatCards() {
  return (
    <Section eyebrow="What you get" title="Three products. Three formats. Endlessly personal.">
      <div className="grid gap-5 md:grid-cols-3 mb-10">
        {PRODUCTS.map((p) => (
          <Link
            to={p.to}
            key={p.title}
            className="group rounded-2xl border bg-gradient-card p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-1"
          >
            <p.icon className="h-7 w-7 text-secondary" />
            <h3 className="mt-4 font-display text-xl font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-secondary group-hover:gap-2 transition-smooth">
              Explore <Sparkles className="ml-1 h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
      <div className="rounded-3xl border bg-gradient-soft p-8">
        <div className="grid gap-5 md:grid-cols-3">
          {FORMATS.map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background shadow-soft">
                <f.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
