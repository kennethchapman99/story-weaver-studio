// StoryLoom domain types — shared between frontend and (future) backend pipeline.

export type AgeRange = "0-5" | "6-8" | "9-12" | "13-15" | "16-18" | "adult";
export type ReadingLevel = "early" | "middle-grade" | "young-adult" | "adult";
export type Pronouns = "she/her" | "he/him" | "they/them" | "other";

export interface RecipientProfile {
  firstName: string;
  nickname?: string;
  age?: number;
  ageRange?: AgeRange;
  pronouns?: Pronouns;
  readingLevel?: ReadingLevel;
  isGift?: boolean;
  buyerRelationship?: string;
  occasion?: string;
}

export interface StoryPreferences {
  favoriteBooks?: string;
  favoriteMoviesShows?: string;
  favoriteGames?: string;
  favoriteCharacters?: string;
  genres: string[];
  tones: string[];
  dislikes?: string;
  feelLike?: string;
  avoidCloseTo?: string;
}

export interface CharacterProfile {
  recipientAsHero?: boolean;
  heroName?: string;
  heroTraits?: string;
  heroStrengths?: string;
  heroFlaws?: string;
  heroGoal?: string;
  sidekick?: string;
  friends?: string;
  family?: string;
  pets?: string;
  villain?: string;
  charactersToAvoid?: string;
}

export interface SettingProfile {
  primarySetting?: string;
  timePeriod?: string;
  worldStyle?: string;
  magicTechLevel?: string;
  keyLocations?: string;
  community?: string;
  realWorldPlaces?: string;
  customNotes?: string;
}

export interface PlotThemes {
  mainConflict?: string;
  emotionalArc?: string;
  themes: string[];
  endingType?: "happy" | "bittersweet" | "cliffhanger" | "series-setup";
  stakes?: string[];
  pacing?: "fast" | "balanced" | "cozy" | "epic";
}

export interface ContentBoundaries {
  scaryLevel: "none" | "mild" | "medium";
  violenceLevel: "none" | "cartoon" | "adventure";
  romance: "none" | "crushes" | "ya-light";
  language: "clean" | "mild-teen";
  topicsToAvoid?: string;
  parentNotes?: string;
  sensitivityNotes?: string;
}

export interface BookDesignPreferences {
  titleIdeas?: string;
  coverStyle?: string;
  interiorStyle?: string;
  dedication?: string;
  authorNameDisplay?: string;
  giftMessage?: string;
}

export type FormatOption = "ebook" | "audiobook" | "paperback" | "hardcover";

export interface PackageSelection {
  packageId: string;
  formats: FormatOption[];
  isSeries: boolean;
  quantity: number;
  shippingAddress?: ShippingAddress;
  deliveryPreference?: "standard" | "expedited" | "rush";
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderPayload {
  id?: string;
  recipient: RecipientProfile;
  preferences: StoryPreferences;
  characters: CharacterProfile;
  setting: SettingProfile;
  plot: PlotThemes;
  boundaries: ContentBoundaries;
  design: BookDesignPreferences;
  package: PackageSelection;
  contactEmail?: string;
  createdAt?: string;
}

export type OrderStatus =
  | "intake-incomplete"
  | "blueprint-pending"
  | "blueprint-ready"
  | "draft-in-progress"
  | "ready-for-review"
  | "final-production"
  | "shipped"
  | "delivered";

export interface Order extends OrderPayload {
  id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  blueprint?: StoryBlueprint;
}

export interface StoryBlueprint {
  title: string;
  seriesConcept?: string;
  mainCharacter: string;
  supportingCast: string;
  world: string;
  coreConflict: string;
  tone: string;
  themes: string[];
  contentGuardrails: string[];
  packageRecommendation: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PackageInfo {
  id: string;
  name: string;
  tagline: string;
  price: number;
  features: string[];
  formats: FormatOption[];
  isSeries: boolean;
  popular?: boolean;
  badge?: string;
}
