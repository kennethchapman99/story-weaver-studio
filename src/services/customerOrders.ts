/**
 * Customer-facing order fetcher.
 *
 * Backend integration:
 *   GET /api/orders/by-token/:token  -> CustomerOrder
 *   POST /api/orders/by-token/:token/access-link  (re-send magic link)
 *
 * The `token` here is a single-use, signed access token issued by the
 * backend (typically delivered via the order confirmation email). It maps
 * to a single order without requiring a full auth session.
 */

import type { CustomerOrder, CustomerOrderStatus } from "@/types/customerOrder";
import { findOrderByToken } from "@/data/sampleCustomerOrders";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function fetchOrderByToken(token: string): Promise<CustomerOrder | "expired" | "not-found"> {
  await delay();
  if (token === "demo-link-expired") return "expired";
  const order = findOrderByToken(token);
  return order ?? "not-found";
}

export async function requestNewAccessLink(email: string): Promise<{ ok: true }> {
  await delay();
  // Backend should always respond ok regardless of email match (no enumeration).
  console.info("[mock] access link requested for", email);
  return { ok: true };
}

export async function submitFollowUpAnswers(
  token: string,
  answers: Record<string, string>,
): Promise<{ ok: true }> {
  await delay();
  console.info("[mock] follow-up answers submitted", { token, answers });
  return { ok: true };
}

export async function approvePreview(token: string): Promise<{ ok: true }> {
  await delay();
  console.info("[mock] preview approved", { token });
  return { ok: true };
}

export async function requestChanges(
  token: string,
  payload: { categories: string[]; notes: string },
): Promise<{ ok: true }> {
  await delay();
  console.info("[mock] changes requested", { token, payload });
  return { ok: true };
}

// Customer-facing label map per spec.
export const STATUS_LABEL: Record<CustomerOrderStatus, string> = {
  payment_pending: "Payment needed",
  payment_failed: "Payment needs attention",
  order_received: "Order received",
  intake_not_started: "Story details needed",
  intake_in_progress: "Story details in progress",
  intake_submitted: "Reviewing your details",
  needs_customer_info: "More details needed",
  intake_approved: "Story details complete",
  book_queued: "Book queued",
  book_generating: "Creating your book",
  book_delayed: "Taking a little longer",
  book_failed_internal_review: "Reviewing your order",
  preview_ready: "Preview ready",
  changes_requested: "Changes requested",
  revision_generating: "Updating your book",
  approved: "Approved",
  finalizing: "Finalizing your book",
  digital_ready: "Digital book ready",
  print_preparing: "Preparing print files",
  print_submitted: "Print order submitted",
  printing: "Printing",
  shipped: "On its way",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
  link_expired: "Link expired",
};
