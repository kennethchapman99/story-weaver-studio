/**
 * StoryLoom API service layer.
 *
 * All functions are mocked for now. Replace the bodies with real `fetch`
 * calls to the backend pipeline (already exists in GitHub) when wiring up.
 *
 * Suggested base URL: import.meta.env.VITE_API_URL
 */

import type {
  OrderPayload, Order, OrderStatus,
  CheckoutSessionResponse, StoryBlueprint,
} from "@/types/storyloom";
import { SAMPLE_ORDERS } from "@/data/sampleOrders";
import { startCheckout } from "./payments";

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

function genId(prefix = "SL") {
  return `${prefix}-${Math.floor(10000 + Math.random() * 89999)}`;
}

// In-memory store so the dashboard reflects new orders during the session.
const memoryOrders: Order[] = [...SAMPLE_ORDERS];

/** POST /api/orders — Creates an order draft. */
export async function createOrderDraft(payload: Partial<OrderPayload>): Promise<Order> {
  await delay(400);
  const order: Order = {
    ...(payload as OrderPayload),
    id: genId(),
    status: "intake-incomplete",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryOrders.unshift(order);
  return order;
}

/** POST /api/story-intake — Saves intake form. */
export async function saveStoryIntake(orderId: string, payload: Partial<OrderPayload>): Promise<Order> {
  await delay(400);
  const idx = memoryOrders.findIndex((o) => o.id === orderId);
  if (idx === -1) throw new Error("Order not found");
  memoryOrders[idx] = {
    ...memoryOrders[idx],
    ...payload,
    status: "blueprint-pending",
    updatedAt: new Date().toISOString(),
  } as Order;
  return memoryOrders[idx];
}

/** POST /api/story-blueprint — Requests blueprint generation. */
export async function generateBlueprint(payload: OrderPayload): Promise<StoryBlueprint> {
  await delay(900);
  const heroName = payload.characters?.heroName || payload.recipient?.firstName || "The Hero";
  const setting = payload.setting?.primarySetting || "a hidden world";
  return {
    title: `${heroName} and the Woven Path`,
    seriesConcept: payload.package?.isSeries ? "A three-arc journey across linked worlds." : undefined,
    mainCharacter: `${heroName} — shaped from your inputs and ready to lead the story.`,
    supportingCast: payload.characters?.sidekick || "A loyal companion and a chosen-family ensemble.",
    world: setting,
    coreConflict: payload.plot?.mainConflict || "An emerging threat that only the hero can untangle.",
    tone: (payload.preferences?.tones || []).join(", ") || "Balanced and engaging",
    themes: payload.plot?.themes || ["Courage", "Friendship"],
    contentGuardrails: [
      `Scary: ${payload.boundaries?.scaryLevel ?? "mild"}`,
      `Violence: ${payload.boundaries?.violenceLevel ?? "cartoon"}`,
      `Romance: ${payload.boundaries?.romance ?? "none"}`,
    ],
    packageRecommendation: payload.package?.isSeries ? "3-Book Series" : "Story Bundle",
  };
}

/**
 * POST /api/checkout/session — Creates a checkout session via the configured
 * payment provider (see src/services/payments.ts). Returns a hosted-checkout
 * URL the caller should redirect to.
 */
export async function createCheckoutSession(
  orderPayload: OrderPayload,
): Promise<CheckoutSessionResponse> {
  if (!orderPayload.package?.packageId) {
    throw new Error("Invalid package");
  }
  await delay(400);
  return startCheckout(orderPayload);
}

/** GET /api/orders/:id */
export async function getOrder(id: string): Promise<Order | undefined> {
  await delay(300);
  return memoryOrders.find((o) => o.id === id);
}

export async function listOrders(): Promise<Order[]> {
  await delay(200);
  return [...memoryOrders];
}

/** POST /api/orders/:id/revision */
export async function submitRevision(id: string, notes: string): Promise<{ ok: true }> {
  await delay(500);
  const idx = memoryOrders.findIndex((o) => o.id === id);
  if (idx !== -1) {
    memoryOrders[idx].updatedAt = new Date().toISOString();
  }
  console.info("[mock] revision submitted", { id, notes });
  return { ok: true };
}

/** POST /api/orders/:id/pipeline — Send finalized order to backend pipeline. */
export async function sendToPipeline(id: string): Promise<{ ok: true; pipelineId: string }> {
  await delay(700);
  return { ok: true, pipelineId: `pipe_${id.toLowerCase()}` };
}

export async function setOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
  await delay(150);
  const idx = memoryOrders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  memoryOrders[idx].status = status;
  memoryOrders[idx].updatedAt = new Date().toISOString();
  return memoryOrders[idx];
}
