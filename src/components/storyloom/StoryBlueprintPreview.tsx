import type { StoryBlueprint } from "@/types/storyloom";
import { BookOpenCheck, Sparkles, ShieldCheck, Users2, Globe2, Drama, Palette, Package } from "lucide-react";

export function StoryBlueprintPreview({ blueprint }: { blueprint: StoryBlueprint }) {
  const rows: { icon: any; label: string; value: React.ReactNode }[] = [
    { icon: BookOpenCheck, label: "Working title", value: <span className="font-display text-2xl">{blueprint.title}</span> },
    ...(blueprint.seriesConcept ? [{ icon: Sparkles, label: "Series concept", value: blueprint.seriesConcept }] : []),
    { icon: Users2, label: "Main character", value: blueprint.mainCharacter },
    { icon: Users2, label: "Supporting cast", value: blueprint.supportingCast },
    { icon: Globe2, label: "World", value: blueprint.world },
    { icon: Drama, label: "Core conflict", value: blueprint.coreConflict },
    { icon: Palette, label: "Tone", value: blueprint.tone },
    { icon: Sparkles, label: "Themes", value: blueprint.themes.join(" · ") },
    { icon: ShieldCheck, label: "Content guardrails", value: blueprint.contentGuardrails.join(" · ") },
    { icon: Package, label: "Recommended package", value: blueprint.packageRecommendation },
  ];
  return (
    <div className="rounded-3xl border bg-gradient-card p-6 md:p-8 shadow-card">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="h-4 w-4 text-secondary" />
        <span className="text-xs uppercase tracking-[0.18em] font-semibold text-secondary">Story Blueprint</span>
      </div>
      <div className="space-y-5">
        {rows.map((r, i) => (
          <div key={i} className="flex gap-4 border-b border-border/60 pb-4 last:border-b-0 last:pb-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-soft">
              <r.icon className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{r.label}</div>
              <div className="mt-1 text-foreground">{r.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
