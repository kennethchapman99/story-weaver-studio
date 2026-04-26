import { Sparkles, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function HelpPanel({ context }: { context?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-magic text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
        aria-label="Need help?"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[320px] rounded-2xl border bg-card p-5 shadow-elegant animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-secondary" />
            <h4 className="font-display text-base font-semibold">Need help?</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {context || "Tip: focus on the people and stories they already love. We'll shape everything else around that."}
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="soft" className="flex-1" onClick={() => setOpen(false)}>Got it</Button>
            <Button size="sm" variant="magic" className="flex-1" asChild>
              <a href="mailto:hello@storyloom.test">Talk to us</a>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
