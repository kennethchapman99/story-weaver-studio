import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import type { CustomerOrder } from "@/types/customerOrder";
import { fetchOrderByToken } from "@/services/customerOrders";
import { OrderHero } from "@/components/order/OrderHero";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { StatePanel } from "@/components/order/StatePanel";
import { UpdatesFeed } from "@/components/order/UpdatesFeed";
import { SupportPanel } from "@/components/order/SupportPanel";
import { buildTimeline } from "@/components/order/orderConfig";
import { SAMPLE_CUSTOMER_ORDERS } from "@/data/sampleCustomerOrders";
import { Button } from "@/components/ui/button";

type Result = CustomerOrder | "expired" | "not-found" | "loading";

export default function CustomerOrderPage() {
  const { token } = useParams<{ token: string }>();
  const [result, setResult] = useState<Result>("loading");

  useEffect(() => {
    // Demo convenience: visiting /order with no token loads a sample.
    const t = token ?? "demo-preview-ready";
    setResult("loading");
    fetchOrderByToken(t).then(setResult);
  }, [token]);

  if (result === "loading") {
    return <PageShell><div className="container py-20 text-muted-foreground">Loading your order…</div></PageShell>;
  }

  if (result === "not-found" || result === "expired") {
    return <ExpiredOrMissing kind={result} />;
  }

  const order = result;
  const timeline = buildTimeline(order);

  return (
    <PageShell>
      <div className="container max-w-6xl space-y-8 py-8 md:py-12">
        <DemoStateSwitcher current={order.accessToken} />

        <OrderHero order={order} />

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Where your book is in the process</h2>
          <OrderTimeline steps={timeline} />
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <StatePanel order={order} />
          </div>
          <aside className="space-y-6">
            <UpdatesFeed updates={order.updates} />
            <SupportPanel orderId={order.id} />
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

function ExpiredOrMissing({ kind }: { kind: "expired" | "not-found" }) {
  return (
    <PageShell>
      <div className="container max-w-xl py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">
          {kind === "expired" ? "This order link has expired" : "Order not found"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {kind === "expired"
            ? "For your privacy, order links expire after a short window. Request a new one from your order email."
            : "We couldn't find an order matching this link."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="outline"><Link to="/">Back home</Link></Button>
          <Button asChild variant="magic"><a href="mailto:hello@storyloom.example">Contact support</a></Button>
        </div>
      </div>
    </PageShell>
  );
}

/**
 * Demo-only state switcher. Lets you preview every customer-facing state
 * without a backend. Remove this once real magic-link tokens are wired in.
 */
function DemoStateSwitcher({ current }: { current: string }) {
  return (
    <details className="rounded-xl border border-dashed border-secondary/40 bg-secondary/5 p-3 text-xs">
      <summary className="cursor-pointer font-medium text-secondary">
        Demo · preview all order states
      </summary>
      <div className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3">
        {SAMPLE_CUSTOMER_ORDERS.map((o) => (
          <Link
            key={o.accessToken}
            to={`/order/${o.accessToken}`}
            className={`truncate rounded-md px-2 py-1 hover:bg-secondary/10 ${o.accessToken === current ? "bg-secondary/15 text-secondary font-medium" : "text-foreground/70"}`}
          >
            {o.id} · {o.status}
          </Link>
        ))}
        <Link to="/order/demo-link-expired" className="truncate rounded-md px-2 py-1 hover:bg-secondary/10 text-foreground/70">
          (link expired)
        </Link>
      </div>
    </details>
  );
}
