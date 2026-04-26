import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Library, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-soft">
      {/* decorative thread blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink/15 blur-3xl" />

      <div className="container relative grid gap-12 py-20 md:py-32 lg:grid-cols-2 lg:items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-background/60 px-3 py-1 text-xs font-medium text-secondary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Personalized novels & series
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-primary md:text-6xl lg:text-7xl">
            Turn someone's favorite worlds into a{" "}
            <span className="text-gradient-magic">custom book series</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
            StoryLoom creates personalized novels, ebooks, audiobooks, and printed books based on the people, characters, settings, themes, and stories you love.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="magic" size="xl">
              <Link to="/create"><BookOpen className="mr-2 h-5 w-5" /> Start your book</Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/create?type=series"><Library className="mr-2 h-5 w-5" /> Build a 3-book series</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Ebook · Audiobook · Print</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-secondary" /> Human reviewed</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gold" /> Gift-ready editions</span>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <BookStack />
        </div>
      </div>
    </section>
  );
}

function BookStack() {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-md md:h-[520px]">
      <div className="absolute left-6 top-10 h-[360px] w-[240px] rotate-[-8deg] rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-elegant md:left-2 animate-float">
        <BookFace title="Maya & the Ember Crown" subtitle="Book One" tone="A cozy hidden kingdom." accent="gold" />
      </div>
      <div className="absolute right-2 top-2 h-[380px] w-[260px] rotate-[6deg] rounded-2xl bg-gradient-to-br from-accent to-secondary shadow-elegant animate-float [animation-delay:1.5s]">
        <BookFace title="The Signal Beneath" subtitle="Book Two" tone="A future city, rewritten." accent="pink" />
      </div>
      <div className="absolute bottom-0 left-1/2 h-[340px] w-[230px] -translate-x-1/2 rotate-[-2deg] rounded-2xl bg-gradient-to-br from-secondary via-pink to-gold shadow-elegant animate-float [animation-delay:0.6s]">
        <BookFace title="Threads of Tomorrow" subtitle="Book Three" tone="The arc completes." accent="teal" />
      </div>
      {/* sparkles */}
      <Sparkle className="left-4 top-2" />
      <Sparkle className="right-10 bottom-12" delay="2s" />
      <Sparkle className="right-2 top-24" delay="1s" />
    </div>
  );
}

function BookFace({ title, subtitle, tone, accent }: { title: string; subtitle: string; tone: string; accent: "gold" | "pink" | "teal" }) {
  const accentClass = accent === "gold" ? "bg-gold/30" : accent === "pink" ? "bg-pink/30" : "bg-accent/30";
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 p-5 text-primary-foreground">
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] opacity-70">StoryLoom · Custom Edition</span>
        <div className={`mt-3 h-px w-12 ${accentClass}`} />
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold leading-tight">{title}</h3>
        <p className="mt-1 text-xs opacity-80">{subtitle}</p>
      </div>
      <p className="text-xs italic opacity-80">{tone}</p>
    </div>
  );
}

function Sparkle({ className = "", delay = "0s" }: { className?: string; delay?: string }) {
  return (
    <span
      className={`absolute h-3 w-3 rotate-45 bg-gold/80 shadow-[0_0_12px_hsl(var(--gold))] ${className} animate-float`}
      style={{ animationDelay: delay }}
    />
  );
}
