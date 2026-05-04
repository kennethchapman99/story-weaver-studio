import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Library, Sparkles, Star, Globe, ShieldCheck } from "lucide-react";
import grandparentReading from "@/assets/lifestyle-grandparent-reading.jpg";
import finishedTrilogy from "@/assets/finished-books-trilogy.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-soft">
      {/* decorative thread blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-[32rem] w-[32rem] rounded-full bg-secondary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-pink/10 blur-3xl" />

      <div className="container relative grid gap-12 py-20 md:py-32 lg:grid-cols-2 lg:items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-background/60 px-3 py-1 text-xs font-medium text-secondary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Personalized novels & series
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-primary md:text-6xl lg:text-7xl">
            A custom novel starring{" "}
            <span className="text-gradient-magic">someone you love</span>
          </h1>
          <p className="mt-4 font-display text-lg italic text-secondary/90 md:text-xl">
            Custom storybooks where imagination keeps going.
          </p>
          <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Delivered as ebook, audiobook, and a beautifully printed book — built around the people, themes, and worlds they love.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="magic" size="xl">
              <Link to="/create"><BookOpen className="mr-2 h-5 w-5" /> Start your book</Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/create?type=series"><Library className="mr-2 h-5 w-5" /> Build a 3-book series</Link>
            </Button>
          </div>

          {/* Trust strip */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="flex text-gold">
                {[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
              </span>
              4.9
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span>Loved by 1,200+ families</span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-secondary" /> Ships worldwide</span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Rewritten free if you don't love it</span>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <HeroImage />
        </div>
      </div>
    </section>
  );
}

function HeroImage() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative overflow-hidden rounded-[2rem] shadow-elegant ring-1 ring-border/40">
        <img
          src={grandparentReading}
          alt="A grandfather reading a personalized StoryLoom novel with his grandchild"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent" />
      </div>

      {/* floating finished-books card */}
      <div className="absolute -bottom-8 -left-6 hidden w-56 rotate-[-4deg] overflow-hidden rounded-2xl bg-background p-2 shadow-elegant ring-1 ring-border/60 sm:block animate-float">
        <img src={finishedTrilogy} alt="Finished StoryLoom hardcover trilogy" className="h-32 w-full rounded-xl object-cover" />
        <p className="px-2 pb-1 pt-2 text-[11px] font-medium text-muted-foreground">
          Hardcover · Paperback · Audiobook
        </p>
      </div>

      {/* floating quote card */}
      <div className="absolute -top-6 -right-4 hidden w-52 rotate-[3deg] rounded-2xl bg-background p-4 shadow-elegant ring-1 ring-border/60 md:block animate-float [animation-delay:1s]">
        <div className="flex text-gold">
          {[0,1,2,3,4].map(i => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
        </div>
        <p className="mt-1.5 font-display text-sm leading-snug text-foreground">
          "He read it three nights in a row."
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">— Anna, gift for Grandpa</p>
      </div>
    </div>
  );
}

// Kept for reference / alternate hero variant
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
