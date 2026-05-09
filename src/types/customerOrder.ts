// Customer-facing order types for the post-purchase Order Page (`/order/:token`).
// Backend integration: replace the in-memory store + mock fetch with a real
// authenticated API. The token in the URL should be a single-use, signed
// access token (magic-link style). See src/services/customerOrders.ts.

export type CustomerOrderStatus =
  | "payment_pending"
  | "payment_failed"
  | "order_received"
  | "intake_not_started"
  | "intake_in_progress"
  | "intake_submitted"
  | "needs_customer_info"
  | "intake_approved"
  | "book_queued"
  | "book_generating"
  | "book_delayed"
  | "book_failed_internal_review"
  | "preview_ready"
  | "changes_requested"
  | "revision_generating"
  | "approved"
  | "finalizing"
  | "digital_ready"
  | "print_preparing"
  | "print_submitted"
  | "printing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "link_expired";

export type TimelineState = "complete" | "current" | "upcoming" | "needs-input" | "delayed" | "review";

export interface TimelineStep {
  id: string;
  label: string;
  state: TimelineState;
  timestamp?: string;
}

export interface UpdateEvent {
  at: string;        // ISO date
  message: string;   // customer-safe milestone copy
}

export interface IntakeProgress {
  completedSections: number;
  totalSections: number;
  remaining: string[];
  lastSavedAt?: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
}

export interface PreviewArtifact {
  coverImageUrl?: string;
  title: string;
  authorLine?: string;
  excerpt?: string;
  pdfUrl?: string;
}

export interface DigitalDownload {
  label: string;
  fileType: "pdf" | "epub" | "mp3";
  sizeMb?: number;
  url: string;        // signed/tokenized URL in production
  expiresAt?: string;
}

export interface ShippingInfo {
  recipientName: string;
  city: string;
  region: string;
  country: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  printReference?: string;
}

export interface ChangeRequest {
  submittedAt: string;
  revisionNumber: number;
  totalRevisions: number;
  summary: string;
}

export interface PaymentInfo {
  amount: number;
  currency: string;
  resumeCheckoutUrl?: string;
}

export interface RefundInfo {
  refundedAt?: string;
  amount?: number;
  reason?: string;
}

export interface CustomerOrder {
  // Identity
  id: string;                 // friendly ref e.g. SL-10482
  accessToken: string;        // routed via /order/:accessToken
  customerEmail: string;
  purchasedAt: string;

  // Product
  packageName: string;
  formatLabel: string;        // e.g. "Digital + Paperback"
  isPrintIncluded: boolean;

  // State
  status: CustomerOrderStatus;
  estimatedNextStep?: string;

  // Optional state-specific blocks
  intake?: IntakeProgress;
  intakeSummary?: { label: string; value: string }[];
  followUpQuestions?: FollowUpQuestion[];
  preview?: PreviewArtifact;
  changeRequest?: ChangeRequest;
  downloads?: DigitalDownload[];
  shipping?: ShippingInfo;
  payment?: PaymentInfo;
  refund?: RefundInfo;

  // Curated milestones feed
  updates: UpdateEvent[];
}
