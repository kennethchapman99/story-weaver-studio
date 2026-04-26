import { PageShell } from "@/components/layout/PageShell";
import { useOrderDraft } from "@/store/orderDraft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/storyloom/Field";
import { PACKAGES } from "@/data/packages";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2, Lock, ArrowLeft } from "lucide-react";
import { createCheckoutSession, createOrderDraft } from "@/services/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Checkout() {
  const { draft, updateSection, update } = useOrderDraft();
  const navigate = useNavigate();
  const pkg = PACKAGES.find((p) => p.id === draft.package.packageId);
  const needsShipping = draft.package.formats.some((f) => f === "paperback" || f === "hardcover");
  const [email, setEmail] = useState(draft.contactEmail || "");
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [promo, setPromo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    if (!pkg) return setError("Invalid package selected.");
    if (!email) return setError("Email is required.");
    if (!terms || !privacy) return setError("Please accept the terms and privacy policy.");
    if (needsShipping && !draft.package.shippingAddress?.line1) return setError("Shipping address is required for printed formats.");
    setLoading(true);
    try {
      update({ contactEmail: email });
      const order = await createOrderDraft({ ...draft, contactEmail: email });
      // TODO: replace mock with real Stripe Checkout: window.location.href = session.url
      const session = await createCheckoutSession({ ...draft, id: order.id, contactEmail: email });
      navigate(session.url);
    } catch (e: any) {
      setError(e?.message || "Backend unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const total = pkg ? pkg.price * (draft.package.quantity || 1) : 0;

  return (
    <PageShell>
      <div className="container max-w-5xl py-12 md:py-16">
        <Button variant="ghost" size="sm" asChild className="mb-4"><Link to="/create/form"><ArrowLeft className="mr-1 h-4 w-4" /> Back to intake</Link></Button>
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-8">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border bg-card p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold mb-4">Contact</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
                <Field label="Account password (optional)" hint="Leave blank for guest checkout."><Input type="password" placeholder="••••••••" /></Field>
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold mb-4">Billing</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Full name"><Input placeholder="Jane Doe" /></Field>
                <Field label="Country"><Input placeholder="United States" defaultValue="United States" /></Field>
                <Field label="Address"><Input placeholder="123 Main St" /></Field>
                <Field label="Postal code"><Input placeholder="10001" /></Field>
              </div>
            </section>

            {needsShipping && (
              <section className="rounded-2xl border bg-card p-6 shadow-soft">
                <h2 className="font-display text-lg font-semibold mb-4">Shipping</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Recipient"><Input value={draft.package.shippingAddress?.fullName || ""} onChange={(e) => updateSection("package", { shippingAddress: { ...(draft.package.shippingAddress || { country: "US", line1: "", city: "", state: "", postalCode: "", fullName: "" }), fullName: e.target.value } })} /></Field>
                  <Field label="Address line 1"><Input value={draft.package.shippingAddress?.line1 || ""} onChange={(e) => updateSection("package", { shippingAddress: { ...(draft.package.shippingAddress || { country: "US", line1: "", city: "", state: "", postalCode: "", fullName: "" }), line1: e.target.value } })} /></Field>
                  <Field label="City"><Input value={draft.package.shippingAddress?.city || ""} onChange={(e) => updateSection("package", { shippingAddress: { ...(draft.package.shippingAddress || { country: "US", line1: "", city: "", state: "", postalCode: "", fullName: "" }), city: e.target.value } })} /></Field>
                  <Field label="Postal code"><Input value={draft.package.shippingAddress?.postalCode || ""} onChange={(e) => updateSection("package", { shippingAddress: { ...(draft.package.shippingAddress || { country: "US", line1: "", city: "", state: "", postalCode: "", fullName: "" }), postalCode: e.target.value } })} /></Field>
                </div>
              </section>
            )}

            <section className="rounded-2xl border bg-card p-6 shadow-soft space-y-3">
              <Field label="Promo code"><Input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Optional" /></Field>
              <label className="flex items-start gap-2 text-sm">
                <Checkbox checked={terms} onCheckedChange={(c) => setTerms(!!c)} />
                <span>I agree to the <a href="#" className="text-secondary underline">Terms of Service</a>.</span>
              </label>
              <label className="flex items-start gap-2 text-sm">
                <Checkbox checked={privacy} onCheckedChange={(c) => setPrivacy(!!c)} />
                <span>I agree to the <a href="#" className="text-secondary underline">Privacy Policy</a>.</span>
              </label>
            </section>

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          </div>

          <aside className="h-fit rounded-2xl border bg-gradient-card p-6 shadow-card lg:sticky lg:top-24">
            <h3 className="font-display text-lg font-semibold mb-4">Order summary</h3>
            <div className="space-y-2 text-sm">
              <Row k={pkg?.name || "Package"} v={`$${pkg?.price ?? 0}`} />
              <Row k="Quantity" v={String(draft.package.quantity || 1)} />
              <Row k="Recipient" v={draft.recipient.firstName || "—"} />
              <Row k="Formats" v={draft.package.formats.join(", ") || "—"} />
              <div className="thread-divider my-3" />
              <Row k="Subtotal" v={`$${total}`} />
              <Row k="Tax" v="Calculated next" muted />
              <div className="thread-divider my-3" />
              <Row k={<span className="font-semibold">Total</span>} v={<span className="font-display text-2xl font-semibold">${total}</span>} />
            </div>
            <Button variant="magic" size="lg" className="mt-5 w-full" onClick={handlePay} disabled={loading}>
              {loading ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Creating session…</> : <><Lock className="mr-1 h-4 w-4" /> Proceed to secure payment</>}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Stripe Checkout · Test mode</p>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

function Row({ k, v, muted }: { k: React.ReactNode; v: React.ReactNode; muted?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${muted ? "text-muted-foreground" : ""}`}>
      <span>{k}</span><span>{v}</span>
    </div>
  );
}
