import { PACKAGES } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function PackageCards({ onSelect, selectedId }: { onSelect?: (id: string) => void; selectedId?: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {PACKAGES.map((pkg) => {
        const isSelected = selectedId === pkg.id;
        return (
          <div
            key={pkg.id}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-gradient-card p-6 shadow-card transition-smooth hover:shadow-elegant",
              pkg.popular && "border-secondary/40 ring-2 ring-secondary/30",
              isSelected && "border-secondary ring-2 ring-secondary",
            )}
          >
            {pkg.badge && (
              <span className={cn(
                "absolute -top-3 left-6 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
                pkg.popular ? "bg-gradient-magic text-primary-foreground" : "bg-gold text-gold-foreground"
              )}>
                {pkg.badge}
              </span>
            )}
            <h3 className="font-display text-2xl font-semibold">{pkg.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{pkg.tagline}</p>
            <div className="my-5">
              <span className="font-display text-4xl font-semibold">${pkg.price}</span>
              <span className="text-sm text-muted-foreground"> / order</span>
            </div>
            <ul className="space-y-2 text-sm flex-1">
              {pkg.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {onSelect ? (
                <Button
                  variant={pkg.popular || isSelected ? "magic" : "outline"}
                  className="w-full"
                  onClick={() => onSelect(pkg.id)}
                >
                  {isSelected ? <><Check className="mr-1 h-4 w-4" /> Selected</> : "Select package"}
                </Button>
              ) : (
                <Button asChild variant={pkg.popular ? "magic" : "outline"} className="w-full">
                  <Link to={`/create?pkg=${pkg.id}`}>
                    <Sparkles className="mr-1 h-4 w-4" /> Choose
                  </Link>
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
