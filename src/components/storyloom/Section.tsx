import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children, className, eyebrow, title, subtitle, align = "left",
}: {
  children?: ReactNode; className?: string;
  eyebrow?: string; title?: ReactNode; subtitle?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        {(eyebrow || title || subtitle) && (
          <div className={cn("mb-12 max-w-3xl", align === "center" && "mx-auto text-center")}>
            {eyebrow && (
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-secondary mb-3">
                {eyebrow}
              </span>
            )}
            {title && <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight">{title}</h2>}
            {subtitle && <p className="mt-4 text-base md:text-lg text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
