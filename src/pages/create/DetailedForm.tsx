import { PageShell } from "@/components/layout/PageShell";
import { useOrderDraft } from "@/store/orderDraft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/storyloom/Field";
import { ChipGroup } from "@/components/storyloom/Chip";
import { ProgressStepper } from "@/components/storyloom/ProgressStepper";
import { GENRES, TONES, THEMES, SETTINGS, COVER_STYLES, PACKAGES } from "@/data/packages";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Gift, Sparkles, Loader2 } from "lucide-react";
import { generateBlueprint } from "@/services/api";
import { StoryBlueprintPreview } from "@/components/storyloom/StoryBlueprintPreview";
import { HelpPanel } from "@/components/storyloom/HelpPanel";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackageCards } from "@/components/storyloom/PackageCards";
import type { StoryBlueprint } from "@/types/storyloom";
import { cn } from "@/lib/utils";

const STEPS = ["Recipient", "Inspiration", "Characters", "World", "Plot", "Safety", "Design", "Package", "Review"];

export default function DetailedForm() {
  const { draft, updateSection, update } = useOrderDraft();
  const [step, setStep] = useState(0);
  const [blueprint, setBlueprint] = useState<StoryBlueprint | null>(null);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const isGift = !!draft.recipient.isGift;

  async function handlePreview() {
    setGenerating(true);
    try { setBlueprint(await generateBlueprint(draft)); }
    finally { setGenerating(false); }
  }

  return (
    <PageShell>
      <div className={cn("py-12 md:py-16", isGift && "bg-gradient-soft")}>
        <div className="container max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild><Link to="/create"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>
            {isGift && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-foreground">
                <Gift className="h-3.5 w-3.5" /> Gift mode on
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-1">Detailed intake</h1>
          <p className="text-muted-foreground mb-6">Save progress automatically. Switch to the wizard anytime.</p>

          <div className="mb-8"><ProgressStepper steps={STEPS} current={step} onJump={setStep} /></div>

          <div className="rounded-3xl border bg-gradient-card p-6 md:p-8 shadow-card animate-fade-in">
            {step === 0 && <RecipientStep draft={draft} updateSection={updateSection} />}
            {step === 1 && <InspirationStep draft={draft} updateSection={updateSection} />}
            {step === 2 && <CharactersStep draft={draft} updateSection={updateSection} />}
            {step === 3 && <WorldStep draft={draft} updateSection={updateSection} />}
            {step === 4 && <PlotStep draft={draft} updateSection={updateSection} />}
            {step === 5 && <SafetyStep draft={draft} updateSection={updateSection} />}
            {step === 6 && <DesignStep draft={draft} updateSection={updateSection} />}
            {step === 7 && <PackageStep draft={draft} updateSection={updateSection} update={update} />}
            {step === 8 && (
              <ReviewStep
                draft={draft}
                onPreview={handlePreview}
                blueprint={blueprint}
                generating={generating}
              />
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button variant="soft" asChild><Link to="/create/wizard">Switch to wizard</Link></Button>
            </div>
            {step < STEPS.length - 1 ? (
              <Button variant="magic" onClick={() => setStep(step + 1)}>
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button variant="magic" size="lg" onClick={() => navigate("/checkout")} disabled={!draft.recipient.firstName}>
                Continue to checkout <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <HelpPanel context="Don't worry about filling everything in — we use what you give us, and you can revise after the blueprint." />
    </PageShell>
  );
}

// --- step components ---

function RecipientStep({ draft, updateSection }: any) {
  const r = draft.recipient;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Recipient first name"><Input value={r.firstName || ""} onChange={(e) => updateSection("recipient", { firstName: e.target.value })} /></Field>
      <Field label="Nickname (optional)"><Input value={r.nickname || ""} onChange={(e) => updateSection("recipient", { nickname: e.target.value })} /></Field>
      <Field label="Age"><Input type="number" min={0} max={120} value={r.age ?? ""} onChange={(e) => updateSection("recipient", { age: Number(e.target.value) })} /></Field>
      <Field label="Pronouns">
        <Select value={r.pronouns || ""} onValueChange={(v) => updateSection("recipient", { pronouns: v })}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            {["she/her", "he/him", "they/them", "other"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Reading level">
        <Select value={r.readingLevel || ""} onValueChange={(v) => updateSection("recipient", { readingLevel: v })}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            {[["early", "Early reader"], ["middle-grade", "Middle grade"], ["young-adult", "Young adult"], ["adult", "Adult"]].map(([v, l]) => (
              <SelectItem key={v} value={v}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div className="md:col-span-2 flex items-center justify-between rounded-xl border bg-background p-4">
        <div>
          <p className="font-medium">Is this a gift?</p>
          <p className="text-sm text-muted-foreground">Unlocks gift mode, dedication, and gift presentation options.</p>
        </div>
        <Switch checked={!!r.isGift} onCheckedChange={(c) => updateSection("recipient", { isGift: c })} />
      </div>
      {r.isGift && (
        <>
          <Field label="Your relationship to recipient"><Input value={r.buyerRelationship || ""} onChange={(e) => updateSection("recipient", { buyerRelationship: e.target.value })} placeholder="Parent, friend, sibling…" /></Field>
          <Field label="Occasion">
            <Select value={r.occasion || ""} onValueChange={(v) => updateSection("recipient", { occasion: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {["Birthday", "Holiday", "Graduation", "Just because", "School motivation", "Other"].map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </>
      )}
    </div>
  );
}

function InspirationStep({ draft, updateSection }: any) {
  const p = draft.preferences;
  return (
    <div className="space-y-5">
      <Field label="Favorite books"><Textarea rows={2} value={p.favoriteBooks || ""} onChange={(e) => updateSection("preferences", { favoriteBooks: e.target.value })} /></Field>
      <Field label="Favorite movies / shows"><Textarea rows={2} value={p.favoriteMoviesShows || ""} onChange={(e) => updateSection("preferences", { favoriteMoviesShows: e.target.value })} /></Field>
      <Field label="Favorite games"><Textarea rows={2} value={p.favoriteGames || ""} onChange={(e) => updateSection("preferences", { favoriteGames: e.target.value })} /></Field>
      <Field label="Favorite genres"><ChipGroup options={GENRES} value={p.genres} onChange={(v) => updateSection("preferences", { genres: v })} /></Field>
      <Field label="Favorite characters"><Input value={p.favoriteCharacters || ""} onChange={(e) => updateSection("preferences", { favoriteCharacters: e.target.value })} /></Field>
      <Field label="Things they dislike in stories"><Textarea rows={2} value={p.dislikes || ""} onChange={(e) => updateSection("preferences", { dislikes: e.target.value })} /></Field>
      <Field label="Make it feel like…" hint="A vibe, a comparison title, an aesthetic."><Textarea rows={2} value={p.feelLike || ""} onChange={(e) => updateSection("preferences", { feelLike: e.target.value })} /></Field>
      <Field label="Avoid anything too close to…"><Textarea rows={2} value={p.avoidCloseTo || ""} onChange={(e) => updateSection("preferences", { avoidCloseTo: e.target.value })} /></Field>
    </div>
  );
}

function CharactersStep({ draft, updateSection }: any) {
  const c = draft.characters;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border bg-background p-4">
        <div>
          <p className="font-medium">Should the recipient appear as the hero?</p>
          <p className="text-sm text-muted-foreground">We'll model the protagonist on them.</p>
        </div>
        <Switch checked={!!c.recipientAsHero} onCheckedChange={(v) => updateSection("characters", { recipientAsHero: v })} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Hero name"><Input value={c.heroName || ""} onChange={(e) => updateSection("characters", { heroName: e.target.value })} /></Field>
        <Field label="Hero traits"><Input value={c.heroTraits || ""} onChange={(e) => updateSection("characters", { heroTraits: e.target.value })} placeholder="Curious, stubborn, kind…" /></Field>
        <Field label="Hero strengths"><Input value={c.heroStrengths || ""} onChange={(e) => updateSection("characters", { heroStrengths: e.target.value })} /></Field>
        <Field label="Hero flaws"><Input value={c.heroFlaws || ""} onChange={(e) => updateSection("characters", { heroFlaws: e.target.value })} /></Field>
        <Field label="Hero goal"><Input value={c.heroGoal || ""} onChange={(e) => updateSection("characters", { heroGoal: e.target.value })} /></Field>
        <Field label="Sidekick / companion"><Input value={c.sidekick || ""} onChange={(e) => updateSection("characters", { sidekick: e.target.value })} /></Field>
        <Field label="Friends / team members"><Input value={c.friends || ""} onChange={(e) => updateSection("characters", { friends: e.target.value })} /></Field>
        <Field label="Family members to include"><Input value={c.family || ""} onChange={(e) => updateSection("characters", { family: e.target.value })} /></Field>
        <Field label="Pets to include"><Input value={c.pets || ""} onChange={(e) => updateSection("characters", { pets: e.target.value })} /></Field>
        <Field label="Villain / rival"><Input value={c.villain || ""} onChange={(e) => updateSection("characters", { villain: e.target.value })} /></Field>
      </div>
      <Field label="Characters to avoid"><Textarea rows={2} value={c.charactersToAvoid || ""} onChange={(e) => updateSection("characters", { charactersToAvoid: e.target.value })} /></Field>
    </div>
  );
}

function WorldStep({ draft, updateSection }: any) {
  const s = draft.setting;
  return (
    <div className="space-y-5">
      <Field label="Primary setting"><ChipGroup multi={false} options={[...SETTINGS, "Custom"]} value={s.primarySetting ? [s.primarySetting] : []} onChange={(v) => updateSection("setting", { primarySetting: v[0] })} /></Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Time period"><Input value={s.timePeriod || ""} onChange={(e) => updateSection("setting", { timePeriod: e.target.value })} placeholder="Modern day, far future, mythic past…" /></Field>
        <Field label="World style"><Input value={s.worldStyle || ""} onChange={(e) => updateSection("setting", { worldStyle: e.target.value })} placeholder="Cinematic, cozy, gritty…" /></Field>
        <Field label="Magic / technology level"><Input value={s.magicTechLevel || ""} onChange={(e) => updateSection("setting", { magicTechLevel: e.target.value })} /></Field>
        <Field label="Real-world places to include"><Input value={s.realWorldPlaces || ""} onChange={(e) => updateSection("setting", { realWorldPlaces: e.target.value })} /></Field>
      </div>
      <Field label="Key locations"><Textarea rows={2} value={s.keyLocations || ""} onChange={(e) => updateSection("setting", { keyLocations: e.target.value })} /></Field>
      <Field label="School / team / community details"><Textarea rows={2} value={s.community || ""} onChange={(e) => updateSection("setting", { community: e.target.value })} /></Field>
      <Field label="Custom world notes"><Textarea rows={3} value={s.customNotes || ""} onChange={(e) => updateSection("setting", { customNotes: e.target.value })} /></Field>
    </div>
  );
}

function PlotStep({ draft, updateSection }: any) {
  const p = draft.plot;
  return (
    <div className="space-y-5">
      <Field label="Main adventure / conflict"><Textarea rows={3} value={p.mainConflict || ""} onChange={(e) => updateSection("plot", { mainConflict: e.target.value })} /></Field>
      <Field label="Emotional arc"><Textarea rows={2} value={p.emotionalArc || ""} onChange={(e) => updateSection("plot", { emotionalArc: e.target.value })} placeholder="From doubt to confidence, from loss to belonging…" /></Field>
      <Field label="Themes"><ChipGroup options={THEMES} value={p.themes} onChange={(v) => updateSection("plot", { themes: v })} /></Field>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Desired ending">
          <Select value={p.endingType || ""} onValueChange={(v) => updateSection("plot", { endingType: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {[["happy", "Happy"], ["bittersweet", "Bittersweet"], ["cliffhanger", "Cliffhanger"], ["series-setup", "Series setup"]].map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Stakes">
          <ChipGroup options={["Personal", "Friendship", "Family", "School", "World-saving"]} value={p.stakes || []} onChange={(v) => updateSection("plot", { stakes: v })} />
        </Field>
        <Field label="Pacing">
          <Select value={p.pacing || ""} onValueChange={(v) => updateSection("plot", { pacing: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {["fast", "balanced", "cozy", "epic"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </div>
  );
}

function SafetyStep({ draft, updateSection }: any) {
  const b = draft.boundaries;
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Scary level">
          <Select value={b.scaryLevel} onValueChange={(v) => updateSection("boundaries", { scaryLevel: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["none", "mild", "medium"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Violence level">
          <Select value={b.violenceLevel} onValueChange={(v) => updateSection("boundaries", { violenceLevel: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["none", "cartoon", "adventure"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Romance">
          <Select value={b.romance} onValueChange={(v) => updateSection("boundaries", { romance: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[["none", "None"], ["crushes", "Crushes only"], ["ya-light", "YA-light"]].map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Language">
          <Select value={b.language} onValueChange={(v) => updateSection("boundaries", { language: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[["clean", "Clean"], ["mild-teen", "Mild teen"]].map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Topics to avoid"><Textarea rows={2} value={b.topicsToAvoid || ""} onChange={(e) => updateSection("boundaries", { topicsToAvoid: e.target.value })} /></Field>
      <Field label="Parent notes"><Textarea rows={2} value={b.parentNotes || ""} onChange={(e) => updateSection("boundaries", { parentNotes: e.target.value })} /></Field>
      <Field label="Sensitivity notes"><Textarea rows={2} value={b.sensitivityNotes || ""} onChange={(e) => updateSection("boundaries", { sensitivityNotes: e.target.value })} /></Field>
    </div>
  );
}

function DesignStep({ draft, updateSection }: any) {
  const d = draft.design;
  return (
    <div className="space-y-5">
      <Field label="Title ideas"><Input value={d.titleIdeas || ""} onChange={(e) => updateSection("design", { titleIdeas: e.target.value })} /></Field>
      <Field label="Cover style"><ChipGroup multi={false} options={COVER_STYLES} value={d.coverStyle ? [d.coverStyle] : []} onChange={(v) => updateSection("design", { coverStyle: v[0] })} /></Field>
      <Field label="Interior style">
        <ChipGroup multi={false} options={["Standard novel", "Large print", "Illustrated chapter book"]} value={d.interiorStyle ? [d.interiorStyle] : []} onChange={(v) => updateSection("design", { interiorStyle: v[0] })} />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Author name to display"><Input value={d.authorNameDisplay || ""} onChange={(e) => updateSection("design", { authorNameDisplay: e.target.value })} /></Field>
        <Field label="Dedication"><Input value={d.dedication || ""} onChange={(e) => updateSection("design", { dedication: e.target.value })} /></Field>
      </div>
      <Field label="Gift message"><Textarea rows={3} value={d.giftMessage || ""} onChange={(e) => updateSection("design", { giftMessage: e.target.value })} /></Field>
    </div>
  );
}

function PackageStep({ draft, updateSection }: any) {
  const selectedId = draft.package.packageId;
  const onSelect = (id: string) => {
    const pkg = PACKAGES.find((p) => p.id === id);
    if (!pkg) return;
    updateSection("package", { packageId: id, isSeries: pkg.isSeries, formats: pkg.formats });
  };
  return (
    <div className="space-y-6">
      <PackageCards onSelect={onSelect} selectedId={selectedId} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Quantity">
          <Input type="number" min={1} value={draft.package.quantity || 1}
            onChange={(e) => updateSection("package", { quantity: Math.max(1, Number(e.target.value)) })} />
        </Field>
        <Field label="Delivery preference">
          <Select value={draft.package.deliveryPreference || "standard"} onValueChange={(v) => updateSection("package", { deliveryPreference: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[["standard", "Standard"], ["expedited", "Expedited"], ["rush", "Rush"]].map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </div>
  );
}

function ReviewStep({ draft, onPreview, blueprint, generating }: any) {
  const pkg = PACKAGES.find((p) => p.id === draft.package.packageId);
  return (
    <div className="space-y-6">
      <h3 className="font-display text-2xl font-semibold">Review your order</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard title="Recipient" rows={[
          ["Name", draft.recipient.firstName || "—"],
          ["Age", draft.recipient.ageRange || draft.recipient.age || "—"],
          ["Gift", draft.recipient.isGift ? "Yes" : "No"],
        ]} />
        <SummaryCard title="Story" rows={[
          ["Genres", draft.preferences.genres.join(", ") || "—"],
          ["Tones", draft.preferences.tones.join(", ") || "—"],
          ["Setting", draft.setting.primarySetting || "—"],
        ]} />
        <SummaryCard title="Boundaries" rows={[
          ["Scary", draft.boundaries.scaryLevel],
          ["Violence", draft.boundaries.violenceLevel],
          ["Romance", draft.boundaries.romance],
        ]} />
        <SummaryCard title="Package" rows={[
          ["Plan", pkg?.name || "—"],
          ["Formats", draft.package.formats.join(", ")],
          ["Estimated price", pkg ? `$${pkg.price * (draft.package.quantity || 1)}` : "—"],
          ["Estimated timeline", "10–14 days"],
        ]} />
      </div>
      {blueprint ? (
        <StoryBlueprintPreview blueprint={blueprint} />
      ) : (
        <Button variant="magic" onClick={onPreview} disabled={generating}>
          {generating ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Building blueprint…</> : <>Preview story blueprint <Sparkles className="ml-1 h-4 w-4" /></>}
        </Button>
      )}
    </div>
  );
}

function SummaryCard({ title, rows }: { title: string; rows: [string, any][] }) {
  return (
    <div className="rounded-2xl border bg-background p-5 shadow-soft">
      <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-secondary mb-3">{title}</h4>
      <dl className="space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-medium text-right">{String(v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
