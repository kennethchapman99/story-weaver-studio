import type { CustomerOrder, CustomerOrderStatus, TimelineStep } from "@/types/customerOrder";

// Friendly hero copy + primary/secondary actions per state.
export interface HeroConfig {
  title: string;
  body: string;
  primary?: { label: string; intent?: "scroll" | "external" | "route"; target?: string };
  secondary?: { label: string; intent?: "scroll" | "external" | "route"; target?: string };
  badge?: { label: string; tone: "info" | "warn" | "success" | "muted" };
}

export function getHero(order: CustomerOrder): HeroConfig {
  switch (order.status) {
    case "payment_pending":
    case "payment_failed":
      return {
        title: "Payment needs attention",
        body: "Your order has not started yet because payment has not been completed.",
        primary: { label: "Complete payment", intent: "route", target: order.payment?.resumeCheckoutUrl ?? "/checkout" },
        secondary: { label: "Contact support", intent: "scroll", target: "support" },
        badge: { label: "Action needed", tone: "warn" },
      };
    case "intake_not_started":
      return {
        title: "Your story is waiting to begin",
        body: "Your order is confirmed. Now we just need a few story details so we can begin creating your custom book.",
        primary: { label: "Start story intake", intent: "route", target: "/create/wizard" },
        secondary: { label: "I need help with my order", intent: "scroll", target: "support" },
        badge: { label: "Action needed", tone: "warn" },
      };
    case "intake_in_progress":
      return {
        title: "Finish your story details",
        body: "You're partway there. Finish the story details so we can start creating your book.",
        primary: { label: "Continue story intake", intent: "route", target: "/create/wizard" },
        secondary: { label: "Send me the intake link again", intent: "scroll", target: "support" },
        badge: { label: "Action needed", tone: "warn" },
      };
    case "intake_submitted":
      return {
        title: "We're checking your story details",
        body: "Thanks — we've received your story details. We're checking everything now before we begin.",
        secondary: { label: "View submitted details", intent: "scroll", target: "panel" },
        badge: { label: "In review", tone: "info" },
      };
    case "needs_customer_info":
      return {
        title: "We need a little more detail",
        body: "We have your order, but a few more details will help us make the story feel personal.",
        primary: { label: "Answer follow-up questions", intent: "scroll", target: "panel" },
        secondary: { label: "Reply by email instead", intent: "scroll", target: "support" },
        badge: { label: "Action needed", tone: "warn" },
      };
    case "intake_approved":
    case "book_queued":
      return {
        title: "Your story is in the queue",
        body: "We have everything we need. Your book is now queued for creation.",
        primary: { label: "View story details", intent: "scroll", target: "panel" },
        badge: { label: "Queued", tone: "info" },
      };
    case "book_generating":
      return {
        title: "We're creating your book",
        body: "Your story is being written and shaped into a book.",
        primary: { label: "View order details", intent: "scroll", target: "panel" },
        badge: { label: "In progress", tone: "info" },
      };
    case "book_delayed":
      return {
        title: "Your book is taking a little longer",
        body: "Your book is still being created. It's taking a little longer than expected, but your order is active.",
        primary: { label: "Contact support", intent: "scroll", target: "support" },
        secondary: { label: "View order details", intent: "scroll", target: "panel" },
        badge: { label: "Delayed", tone: "warn" },
      };
    case "book_failed_internal_review":
      return {
        title: "We're reviewing your order",
        body: "We hit a snag while creating your book, and we're reviewing it now. No action is needed from you right now.",
        primary: { label: "Contact support", intent: "scroll", target: "support" },
        badge: { label: "Under review", tone: "warn" },
      };
    case "preview_ready":
      return {
        title: "Your preview is ready",
        body: "Your book preview is ready. Take a look and let us know if it feels right.",
        primary: { label: "Review preview", intent: "scroll", target: "panel" },
        secondary: { label: "Request changes", intent: "scroll", target: "panel" },
        badge: { label: "Your turn", tone: "success" },
      };
    case "changes_requested":
    case "revision_generating":
      return {
        title: "We're updating your book",
        body: "We've received your change request and are updating your book.",
        primary: { label: "View requested changes", intent: "scroll", target: "panel" },
        badge: { label: "Revision in progress", tone: "info" },
      };
    case "approved":
    case "finalizing":
      return {
        title: "We're finalizing your book",
        body: "Your book has been approved. We're preparing the final files now.",
        primary: { label: "View order details", intent: "scroll", target: "panel" },
        badge: { label: "Finalizing", tone: "info" },
      };
    case "digital_ready":
      return {
        title: "Your digital book is ready",
        body: "Your custom book is ready to download.",
        primary: { label: "Download PDF", intent: "scroll", target: "panel" },
        secondary: { label: "Get help", intent: "scroll", target: "support" },
        badge: { label: "Ready", tone: "success" },
      };
    case "print_preparing":
    case "print_submitted":
      return {
        title: "Your printed book is being prepared",
        body: "Your digital book is ready, and your printed book is being prepared for production.",
        primary: { label: "Download digital copy", intent: "scroll", target: "panel" },
        secondary: { label: "View print status", intent: "scroll", target: "panel" },
        badge: { label: "In production", tone: "info" },
      };
    case "printing":
      return {
        title: "Your book is being printed",
        body: "Your printed book is now in production.",
        primary: { label: "Download digital copy", intent: "scroll", target: "panel" },
        secondary: { label: "View shipping details", intent: "scroll", target: "panel" },
        badge: { label: "Printing", tone: "info" },
      };
    case "shipped":
      return {
        title: "Your book has shipped",
        body: "Your printed book is on its way.",
        primary: { label: "Track shipment", intent: "external", target: order.shipping?.trackingUrl ?? "#" },
        secondary: { label: "Download digital copy", intent: "scroll", target: "panel" },
        badge: { label: "Shipped", tone: "success" },
      };
    case "delivered":
      return {
        title: "Your StoryLoom book is complete",
        body: "Your custom book has been delivered. We hope it becomes a favourite.",
        primary: { label: "Download digital copy", intent: "scroll", target: "panel" },
        secondary: { label: "Order another book", intent: "route", target: "/create" },
        badge: { label: "Complete", tone: "success" },
      };
    case "cancelled":
    case "refunded":
      return {
        title: "This order has been cancelled",
        body: "This order is no longer active.",
        primary: { label: "Contact support", intent: "scroll", target: "support" },
        secondary: { label: "Start a new order", intent: "route", target: "/create" },
        badge: { label: "Cancelled", tone: "muted" },
      };
    case "link_expired":
      return {
        title: "Let's verify your order",
        body: "For your privacy, this order link has expired.",
        primary: { label: "Send me a new link", intent: "scroll", target: "panel" },
        secondary: { label: "Contact support", intent: "scroll", target: "support" },
        badge: { label: "Verify", tone: "warn" },
      };
    default:
      return {
        title: "Your order",
        body: "We'll keep this page up to date as your book moves through creation.",
      };
  }
}

// Build the customer-facing timeline. We collapse internal statuses into
// a small set of milestone steps and tag the current/next ones.
export function buildTimeline(order: CustomerOrder): TimelineStep[] {
  const s = order.status;
  const print = order.isPrintIncluded;

  const steps: TimelineStep[] = [
    { id: "received", label: "Order received", state: "complete" },
    { id: "intake", label: "Story details", state: "upcoming" },
    { id: "create", label: "Book creation", state: "upcoming" },
    { id: "review", label: "Review & approval", state: "upcoming" },
    { id: "digital", label: "Digital delivery", state: "upcoming" },
  ];
  if (print) steps.push({ id: "print", label: "Print & shipping", state: "upcoming" });

  const set = (id: string, state: TimelineStep["state"]) => {
    const x = steps.find((t) => t.id === id);
    if (x) x.state = state;
  };

  const completeUpTo = (id: string) => {
    for (const t of steps) {
      if (t.id === id) break;
      t.state = "complete";
    }
  };

  switch (s) {
    case "payment_pending":
    case "payment_failed":
      set("received", "current");
      break;
    case "intake_not_started":
    case "intake_in_progress":
      set("intake", "needs-input");
      break;
    case "intake_submitted":
      set("intake", "current");
      break;
    case "needs_customer_info":
      set("intake", "needs-input");
      break;
    case "intake_approved":
    case "book_queued":
      completeUpTo("create");
      set("create", "current");
      break;
    case "book_generating":
      completeUpTo("create");
      set("create", "current");
      break;
    case "book_delayed":
      completeUpTo("create");
      set("create", "delayed");
      break;
    case "book_failed_internal_review":
      completeUpTo("create");
      set("create", "review");
      break;
    case "preview_ready":
      completeUpTo("review");
      set("review", "needs-input");
      break;
    case "changes_requested":
    case "revision_generating":
      completeUpTo("review");
      set("review", "current");
      break;
    case "approved":
    case "finalizing":
      completeUpTo("digital");
      set("digital", "current");
      break;
    case "digital_ready":
      completeUpTo("digital");
      set("digital", print ? "complete" : "current");
      if (print) set("print", "current");
      break;
    case "print_preparing":
    case "print_submitted":
    case "printing":
    case "shipped":
      completeUpTo("print");
      set("print", "current");
      break;
    case "delivered":
      for (const t of steps) t.state = "complete";
      break;
    case "cancelled":
    case "refunded":
      // leave as-is
      break;
  }
  return steps;
}

export function statusBadgeTone(s: CustomerOrderStatus) {
  if (["delivered", "digital_ready", "preview_ready", "shipped"].includes(s)) return "success";
  if (["book_delayed", "needs_customer_info", "payment_failed", "book_failed_internal_review", "intake_not_started", "intake_in_progress", "link_expired"].includes(s)) return "warn";
  if (["cancelled", "refunded"].includes(s)) return "muted";
  return "info";
}
