import type { CustomerOrder } from "@/types/customerOrder";

// Sample orders covering every documented state. Each token is the demo
// path under /order/:token. Replace this file with real API data.

const baseEmail = "ken@example.com";

function iso(daysAgo: number, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const baseProduct = {
  packageName: "Custom Children's Adventure Book",
  formatLabel: "Digital + Paperback",
  isPrintIncluded: true,
  customerEmail: baseEmail,
  purchasedAt: iso(1, 10, 14),
};

export const SAMPLE_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    ...baseProduct,
    id: "SL-10001",
    accessToken: "demo-intake-not-started",
    status: "intake_not_started",
    estimatedNextStep: "Share your story details to get started.",
    updates: [
      { at: iso(0, 10, 14), message: "Order confirmed" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10002",
    accessToken: "demo-intake-in-progress",
    status: "intake_in_progress",
    intake: {
      completedSections: 3,
      totalSections: 6,
      remaining: ["Main character", "Story direction", "Dedication"],
      lastSavedAt: iso(0, 9, 12),
    },
    updates: [
      { at: iso(1, 10, 14), message: "Order confirmed" },
      { at: iso(0, 9, 12), message: "Story details autosaved" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10003",
    accessToken: "demo-intake-submitted",
    status: "intake_submitted",
    intakeSummary: [
      { label: "Main character", value: "Mira, age 9, brave and curious" },
      { label: "Recipient", value: "Mira (gift from Grandpa)" },
      { label: "Genre", value: "Magical adventure" },
      { label: "Tone", value: "Heartfelt + funny" },
      { label: "Dedication", value: "For my brave Mira — Love, Grandpa" },
      { label: "Cover preference", value: "Illustrated fantasy" },
    ],
    updates: [
      { at: iso(1, 10, 14), message: "Order confirmed" },
      { at: iso(0, 9, 30), message: "Story details received" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10004",
    accessToken: "demo-needs-info",
    status: "needs_customer_info",
    followUpQuestions: [
      { id: "q1", question: "What is the child's name or nickname?" },
      { id: "q2", question: "What kind of adventure should they go on?" },
      { id: "q3", question: "Any family members, pets, places, or inside jokes to include?" },
      { id: "q4", question: "Should it feel funny, magical, heartfelt, educational, or silly?" },
      { id: "q5", question: "Anything we should avoid?" },
    ],
    updates: [
      { at: iso(2, 10, 14), message: "Order confirmed" },
      { at: iso(1, 9, 30), message: "Story details received" },
      { at: iso(0, 8, 0), message: "We sent a few follow-up questions" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10005",
    accessToken: "demo-book-queued",
    status: "book_queued",
    estimatedNextStep: "Your preview will be ready in 24–48 hours.",
    updates: [
      { at: iso(2, 10, 14), message: "Order confirmed" },
      { at: iso(1, 11, 0), message: "Story details complete" },
      { at: iso(0, 7, 0), message: "Your book entered the queue" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10006",
    accessToken: "demo-book-generating",
    status: "book_generating",
    updates: [
      { at: iso(2, 10, 14), message: "Order confirmed" },
      { at: iso(1, 11, 0), message: "Story details complete" },
      { at: iso(0, 7, 0), message: "Your book entered creation" },
      { at: iso(0, 9, 18), message: "We're turning your details into a full story" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10007",
    accessToken: "demo-book-delayed",
    status: "book_delayed",
    updates: [
      { at: iso(3, 10, 14), message: "Order confirmed" },
      { at: iso(2, 11, 0), message: "Story details complete" },
      { at: iso(1, 7, 0), message: "Your book entered creation" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10008",
    accessToken: "demo-book-failed",
    status: "book_failed_internal_review",
    updates: [
      { at: iso(2, 10, 14), message: "Order confirmed" },
      { at: iso(1, 11, 0), message: "Story details complete" },
      { at: iso(0, 6, 0), message: "Your order is being reviewed by our team" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10009",
    accessToken: "demo-preview-ready",
    status: "preview_ready",
    preview: {
      title: "Mira and the Lantern of Westhollow",
      authorLine: "A custom novel for Mira — from Grandpa",
      excerpt:
        "The morning Mira found the brass lantern, the wind in Westhollow stopped to listen. She didn't know yet that lanterns like this one only light for people brave enough to follow them...",
      coverImageUrl: undefined,
      pdfUrl: "#preview.pdf",
    },
    updates: [
      { at: iso(3, 10, 14), message: "Order confirmed" },
      { at: iso(2, 11, 0), message: "Story details complete" },
      { at: iso(1, 7, 0), message: "Your book entered creation" },
      { at: iso(0, 10, 0), message: "Preview created" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10010",
    accessToken: "demo-changes-requested",
    status: "revision_generating",
    changeRequest: {
      submittedAt: iso(0, 9, 0),
      revisionNumber: 1,
      totalRevisions: 1,
      summary: "Soften the ending and add Mira's dog Pickle as a sidekick.",
    },
    updates: [
      { at: iso(2, 10, 14), message: "Order confirmed" },
      { at: iso(1, 10, 0), message: "Preview ready" },
      { at: iso(0, 9, 0), message: "Change request received" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10011",
    accessToken: "demo-finalizing",
    status: "finalizing",
    updates: [
      { at: iso(3, 10, 14), message: "Order confirmed" },
      { at: iso(1, 12, 0), message: "Preview approved" },
      { at: iso(0, 8, 0), message: "Final files in production" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10012",
    accessToken: "demo-digital-ready",
    status: "digital_ready",
    isPrintIncluded: false,
    formatLabel: "Digital",
    downloads: [
      { label: "Mira and the Lantern of Westhollow", fileType: "pdf", sizeMb: 8.2, url: "#download.pdf" },
      { label: "Mira and the Lantern of Westhollow (EPUB)", fileType: "epub", sizeMb: 1.4, url: "#download.epub" },
    ],
    updates: [
      { at: iso(4, 10, 14), message: "Order confirmed" },
      { at: iso(2, 12, 0), message: "Preview approved" },
      { at: iso(0, 9, 0), message: "Digital copy ready" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10013",
    accessToken: "demo-print-preparing",
    status: "print_preparing",
    downloads: [
      { label: "Mira and the Lantern of Westhollow", fileType: "pdf", sizeMb: 8.2, url: "#download.pdf" },
    ],
    shipping: {
      recipientName: "Ken Whittaker",
      city: "Toronto",
      region: "ON",
      country: "Canada",
      printReference: "SL-10013-P",
    },
    updates: [
      { at: iso(4, 10, 14), message: "Order confirmed" },
      { at: iso(0, 9, 0), message: "Digital copy ready" },
      { at: iso(0, 11, 0), message: "Preparing print files" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10014",
    accessToken: "demo-printing",
    status: "printing",
    downloads: [
      { label: "Mira and the Lantern of Westhollow", fileType: "pdf", sizeMb: 8.2, url: "#download.pdf" },
    ],
    shipping: {
      recipientName: "Ken Whittaker",
      city: "Toronto",
      region: "ON",
      country: "Canada",
      printReference: "SL-10014-P",
      estimatedDelivery: "May 18 – May 22",
    },
    updates: [
      { at: iso(5, 10, 14), message: "Order confirmed" },
      { at: iso(1, 9, 0), message: "Digital copy ready" },
      { at: iso(0, 11, 0), message: "Your book is being printed" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10015",
    accessToken: "demo-shipped",
    status: "shipped",
    downloads: [
      { label: "Mira and the Lantern of Westhollow", fileType: "pdf", sizeMb: 8.2, url: "#download.pdf" },
    ],
    shipping: {
      recipientName: "Ken Whittaker",
      city: "Toronto",
      region: "ON",
      country: "Canada",
      carrier: "Canada Post",
      trackingNumber: "CP123456789CA",
      trackingUrl: "https://www.canadapost-postescanada.ca/track-reperage/en",
      estimatedDelivery: "May 14",
      printReference: "SL-10015-P",
    },
    updates: [
      { at: iso(7, 10, 14), message: "Order confirmed" },
      { at: iso(2, 9, 0), message: "Digital copy ready" },
      { at: iso(0, 8, 0), message: "Your book has shipped" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10016",
    accessToken: "demo-delivered",
    status: "delivered",
    downloads: [
      { label: "Mira and the Lantern of Westhollow", fileType: "pdf", sizeMb: 8.2, url: "#download.pdf" },
    ],
    shipping: {
      recipientName: "Ken Whittaker",
      city: "Toronto",
      region: "ON",
      country: "Canada",
      carrier: "Canada Post",
      trackingNumber: "CP123456789CA",
      printReference: "SL-10016-P",
    },
    updates: [
      { at: iso(10, 10, 14), message: "Order confirmed" },
      { at: iso(5, 9, 0), message: "Digital copy ready" },
      { at: iso(2, 8, 0), message: "Shipped" },
      { at: iso(0, 13, 0), message: "Delivered" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10017",
    accessToken: "demo-cancelled",
    status: "refunded",
    refund: { refundedAt: iso(0, 12, 0), amount: 129, reason: "Customer requested cancellation" },
    updates: [
      { at: iso(2, 10, 14), message: "Order confirmed" },
      { at: iso(0, 12, 0), message: "Order cancelled and refunded" },
    ],
  },
  {
    ...baseProduct,
    id: "SL-10018",
    accessToken: "demo-payment-pending",
    status: "payment_failed",
    payment: { amount: 129, currency: "USD", resumeCheckoutUrl: "/checkout" },
    updates: [
      { at: iso(0, 10, 14), message: "Payment needs attention" },
    ],
  },
];

export function findOrderByToken(token: string) {
  return SAMPLE_CUSTOMER_ORDERS.find((o) => o.accessToken === token);
}
