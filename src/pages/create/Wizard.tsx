import { PageShell } from "@/components/layout/PageShell";
import { useOrderDraft } from "@/store/orderDraft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChipGroup } from "@/components/storyloom/Chip";
import { GENRES, TONES, THEMES, SETTINGS, PACKAGES } from "@/data/packages";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { generateBlueprint } from "@/services/api";
import { StoryBlueprintPreview } from "@/components/storyloom/StoryBlueprintPreview";
import { HelpPanel } from "@/components/storyloom/HelpPanel";
import type { StoryBlueprint } from "@/types/storyloom";

type Step = {
  key: string;
  prompt: string;
  hint?: string;
  render: (props: { value: any; onChange: (v: any) => void }) => React.ReactNode;
  isAnswered: (v: any) => boolean;
};

export default function Wizard() {
  const { draft, updateSection, update } = useOrderDraft();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [blueprint, setBlueprint] = useState<StoryBlueprint | null>(null);
  const [generating, setGenerating] = useState(false);

  const steps: Step[] = useMemo(() => [
    {
      key: "name", prompt: "Who is this book for? Share a name or nickname.",
      render: ({ value, onChange }) => (
        <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="e.g. Maya" autoFocus />
      ),
      isAnswered: (v) => !!v?.trim(),
    },
    {
      key: "ageRange", prompt: "What's the age range?",
      render: ({ value, onChange }) => (
        <ChipGroup multi={false} options={["0-5", "6-8", "9-12", "13-15", "16-18", "adult"]} value={value ? [value] : []} onChange={(v) => onChange(v[0])} />
      ),
      isAnswered: (v) => !!v,
    },
    {
      key: "favorites", prompt: "What books, movies, games, or shows do they love?",
      hint: "List anything — characters, worlds, vibes. We'll find the threads.",
      render: ({ value, onChange }) => (
        <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={4} placeholder="e.g. Wings of Fire, Ghibli films, Zelda…" />
      ),
      isAnswered: (v) => !!v?.trim(),
    },
    {
      key: "genres", prompt: "Pick a few genres that fit.",
      render: ({ value, onChange }) => <ChipGroup options={GENRES} value={value || []} onChange={onChange} />,
      isAnswered: (v) => v?.length > 0,
    },
    {
      key: "tones", prompt: "What tone should the story carry?",
      render: ({ value, onChange }) => <ChipGroup options={TONES} value={value || []} onChange={onChange} />,
      isAnswered: (v) => v?.length > 0,
    },
    {
      key: "hero", prompt: "Who's the main character?",
      hint: "Recipient as hero, an original character, or a creature companion?",
      render: ({ value, onChange }) => (
        <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="e.g. Maya — curious, brave, secretly the heir of a hidden kingdom" />
      ),
      isAnswered: (v) => !!v?.trim(),
    },
    {
      key: "sidekick", prompt: "Any companion, sidekick, or rival to include?",
      render: ({ value, onChange }) => (
        <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="e.g. Ember the talking fox" />
      ),
      isAnswered: () => true,
    },
    {
      key: "setting", prompt: "Where does the story unfold?",
      render: ({ value, onChange }) => <ChipGroup multi={false} options={[...SETTINGS, "Custom setting"]} value={value ? [value] : []} onChange={(v) => onChange(v[0])} />,
      isAnswered: (v) => !!v,
    },
    {
      key: "themes", prompt: "Which themes matter most?",
      render: ({ value, onChange }) => <ChipGroup options={THEMES} value={value || []} onChange={onChange} />,
      isAnswered: (v) => v?.length > 0,
    },
    {
      key: "guardrails", prompt: "Any content boundaries to keep in mind?",
      hint: "Pick what's important. We'll keep the story comfortable.",
      render: ({ value, onChange }) => (
        <ChipGroup
          options={["No scary content", "No romance", "No violence", "No death", "No bullying", "Keep it silly", "Keep it age-appropriate"]}
          value={value || []}
          onChange={onChange}
        />
      ),
      isAnswered: () => true,
    },
    {
      key: "package", prompt: "Pick a starting package — you can change this later.",
      render: ({ value, onChange }) => (
        <ChipGroup multi={false} options={PACKAGES.map((p) => p.name)} value={value ? [value] : []} onChange={(v) => onChange(v[0])} />
      ),
      isAnswered: (v) => !!v,
    },
    {
      key: "dedication", prompt: "Add a dedication or gift message? (Optional)",
      render: ({ value, onChange }) => (
        <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={3} placeholder="For Maya — keep dreaming bigger." />
      ),
      isAnswered: () => true,
    },
  ], []);

  const step = steps[stepIdx];
  const value = readValue(step.key, draft);
  const setValue = (v: any) => writeValue(step.key, v, { update, updateSection });
  const progress = Math.round(((stepIdx + 1) / steps.length) * 100);
  const isLast = stepIdx === steps.length - 1;

  async function handleGenerate() {
    setGenerating(true);
    try {
      const bp = await generateBlueprint(draft);
      setBlueprint(bp);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <PageShell>
      <div className="container max-w-3xl py-12 md:py-20">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild><Link to="/create"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>
        </div>

        {!blueprint ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Step {stepIdx + 1} of {steps.length}</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-magic transition-smooth" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="rounded-3xl border bg-gradient-card p-6 md:p-10 shadow-card animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-magic text-primary-foreground shadow-glow">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary">StoryLoom</p>
                  <h2 className="mt-1 font-display text-2xl md:text-3xl font-semibold leading-snug">{step.prompt}</h2>
                  {step.hint && <p className="mt-2 text-sm text-muted-foreground">{step.hint}</p>}
                </div>
              </div>
              <div className="mt-6 pl-0 md:pl-12">{step.render({ value, onChange: setValue })}</div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button variant="ghost" disabled={stepIdx === 0} onClick={() => setStepIdx((i) => i - 1)}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <div className="flex gap-2">
                <Button variant="soft" asChild><Link to="/create/form">Switch to detailed form</Link></Button>
                {isLast ? (
                  <Button variant="magic" onClick={handleGenerate} disabled={!step.isAnswered(value) || generating}>
                    {generating ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Building…</> : <>Preview Blueprint <Sparkles className="ml-1 h-4 w-4" /></>}
                  </Button>
                ) : (
                  <Button variant="magic" onClick={() => setStepIdx((i) => i + 1)} disabled={!step.isAnswered(value)}>
                    Continue <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-display text-3xl md:text-4xl font-semibold">Your Story Blueprint</h1>
            <p className="text-muted-foreground">A working summary you can edit before production. We'll lock the details when you continue to checkout.</p>
            <StoryBlueprintPreview blueprint={blueprint} />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setBlueprint(null)}>Edit details</Button>
                <Button variant="soft" asChild><Link to="/create/form">Switch to detailed form</Link></Button>
              </div>
              <Button variant="magic" size="lg" onClick={() => navigate("/checkout")}>
                Continue to package <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <HelpPanel context="The wizard collects what we need to spin up a strong blueprint. Skip anything that doesn't apply." />
    </PageShell>
  );
}

// ---- helpers to read/write nested draft fields by step key ----
function readValue(key: string, draft: any) {
  switch (key) {
    case "name": return draft.recipient.firstName;
    case "ageRange": return draft.recipient.ageRange;
    case "favorites": return draft.preferences.favoriteBooks;
    case "genres": return draft.preferences.genres;
    case "tones": return draft.preferences.tones;
    case "hero": return draft.characters.heroName;
    case "sidekick": return draft.characters.sidekick;
    case "setting": return draft.setting.primarySetting;
    case "themes": return draft.plot.themes;
    case "guardrails": return draft.boundaries.topicsToAvoid?.split(",").map((s: string) => s.trim()).filter(Boolean) || [];
    case "package": return PACKAGES.find((p) => p.id === draft.package.packageId)?.name;
    case "dedication": return draft.design.dedication;
    default: return undefined;
  }
}

function writeValue(key: string, v: any, { update, updateSection }: any) {
  switch (key) {
    case "name": return updateSection("recipient", { firstName: v });
    case "ageRange": return updateSection("recipient", { ageRange: v });
    case "favorites": return updateSection("preferences", { favoriteBooks: v });
    case "genres": return updateSection("preferences", { genres: v });
    case "tones": return updateSection("preferences", { tones: v });
    case "hero": return updateSection("characters", { heroName: v });
    case "sidekick": return updateSection("characters", { sidekick: v });
    case "setting": return updateSection("setting", { primarySetting: v });
    case "themes": return updateSection("plot", { themes: v });
    case "guardrails": return updateSection("boundaries", { topicsToAvoid: (v || []).join(", ") });
    case "package": {
      const pkg = PACKAGES.find((p) => p.name === v);
      if (pkg) return updateSection("package", { packageId: pkg.id, isSeries: pkg.isSeries, formats: pkg.formats });
      return;
    }
    case "dedication": return updateSection("design", { dedication: v });
  }
}
