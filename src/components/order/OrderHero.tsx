import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import logo from "@/assets/storyloom-logo.png";
import type { CustomerOrder } from "@/types/customerOrder";
import { getHero } from "./orderConfig";
import { cn } from "@/lib/utils";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const TONE_CLASS = {
  info: "bg-secondary/15 text-secondary border-secondary/30",
  warn: "bg-gold/20 text-foreground border-gold/40",
  success: "bg-accent/15 text-accent border-accent/30",
  muted: "bg-muted text-muted-foreground border-border",
} as const;

function ActionButton({
  action,
  variant,
}: {
  action: NonNullable<ReturnType<typeof getHero>["primary"]>;
  variant: "magic" | "outline";
}) {
  const target = action.target ?? "#";
  if (action.intent === "scroll") {
    return (
      <Button variant={variant} size="lg" onClick={() => scrollTo(target)}>
        {variant === "magic" && <Sparkles className="mr-1 h-4 w-4" />}
        {action.label}
      </Button>
    );
  }
  if (action.intent === "external") {
    return (
      <Button asChild variant={variant} size="lg">
        <a href={target} target="_blank" rel="noreferrer">{action.label}</a>
      </Button>
    );
  }
  return (
    <Button asChild variant={variant} size="lg">
      <Link to={target}>{action.label}</Link>
    </Button>
  );
}

export function OrderHero({ order }: { order: CustomerOrder }) {
  const hero = getHero(order);
  return (
    <section className="rounded-3xl border bg-gradient-card p-6 shadow-elegant md:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="space-y-5">
          <img src={logo} alt="StoryLoom" className="h-10 w-auto md:h-12" />
          {hero.badge && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                TONE_CLASS[hero.badge.tone],
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {hero.badge.label}
            </span>
          )}
          <h1 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
            {hero.title}
          </h1>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">{hero.body}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            {hero.primary && <ActionButton action={hero.primary} variant="magic" />}
            {hero.secondary && <ActionButton action={hero.secondary} variant="outline" />}
          </div>
        </div>

        <aside className="rounded-2xl border bg-background/80 p-5 shadow-soft backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Order #{order.id}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold">{order.packageName}</h3>
          <p className="text-sm text-muted-foreground">{order.formatLabel}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <Row k="Purchased" v={new Date(order.purchasedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} />
            <Row k="Updates to" v={order.customerEmail} />
            {order.estimatedNextStep && <Row k="Next step" v={order.estimatedNextStep} />}
          </dl>
          <a
            href="#support"
            onClick={(e) => { e.preventDefault(); scrollTo("support"); }}
            className="mt-4 inline-block text-sm font-medium text-secondary hover:underline"
          >
            Need help with this order?
          </a>
        </aside>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-t border-border/60 pt-2 first:border-t-0 first:pt-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium text-foreground">{v}</dd>
    </div>
  );
}
