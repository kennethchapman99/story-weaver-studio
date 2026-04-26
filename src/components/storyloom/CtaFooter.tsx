import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function CtaFooter() {
  return (
    <section className="container py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 md:p-16 shadow-elegant">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pink/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative max-w-2xl text-primary-foreground">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Ready when you are
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl font-semibold leading-tight">
            Build a book around what they love.
          </h2>
          <p className="mt-3 text-base md:text-lg opacity-90">
            Start simple. Switch to detailed control whenever you're ready. We'll handle the rest.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="gold" size="xl">
              <Link to="/create">Start your book</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="border-white/40 bg-white/5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
              <Link to="/packages">See packages</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
