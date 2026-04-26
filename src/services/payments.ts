/**
 * Payment provider adapter.
 *
 * The checkout page calls `createCheckoutSession()` and then redirects to
 * the returned `url`. To wire in a real provider, implement the matching
 * branch below — the rest of the app does not need to change.
 *
 * Supported targets:
 *  - "mock"   → local mock, redirects to /success (default during dev)
 *  - "stripe" → backend creates a Stripe Checkout Session and returns its URL
 *  - "paddle" → backend creates a Paddle transaction and returns its checkout URL
 *
 * The backend (existing GitHub repo) is responsible for:
 *  - holding the SECRET key
 *  - creating the session against the provider
 *  - verifying webhooks (`/api/webhooks/stripe` or `/api/webhooks/paddle`)
 *  - flipping order status to "paid" once the webhook is verified
 */

import type { OrderPayload, CheckoutSessionResponse } from "@/types/storyloom";

export type PaymentProvider = "mock" | "stripe" | "paddle";

export const PAYMENT_PROVIDER: PaymentProvider =
  (import.meta.env.VITE_PAYMENT_PROVIDER as PaymentProvider) || "mock";

export const API_URL: string = import.meta.env.VITE_API_URL || "";

export const PROVIDER_LABEL: Record<PaymentProvider, string> = {
  mock: "Demo checkout · No real payment",
  stripe: "Secured by Stripe",
  paddle: "Secured by Paddle",
};

/** Single entry point used by Checkout.tsx */
export async function startCheckout(
  payload: OrderPayload,
): Promise<CheckoutSessionResponse> {
  if (PAYMENT_PROVIDER === "mock" || !API_URL) {
    // Mock: pretend the backend created a session and route to /success.
    return {
      sessionId: `cs_mock_${Math.random().toString(36).slice(2, 12)}`,
      url: `/success?order=${payload.id ?? "demo"}`,
    };
  }

  // Real backend call — same contract for Stripe or Paddle.
  // Backend should return { sessionId, url } where `url` is the hosted
  // checkout page (Stripe Checkout / Paddle Checkout overlay redirect).
  const res = await fetch(`${API_URL}/api/checkout/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: PAYMENT_PROVIDER, order: payload }),
  });

  if (!res.ok) {
    throw new Error(`Checkout session failed (${res.status})`);
  }
  return res.json();
}