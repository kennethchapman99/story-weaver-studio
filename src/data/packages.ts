import type { PackageInfo } from "@/types/storyloom";

// Editable pricing constants — wire to real backend pricing later.
export const PACKAGES: PackageInfo[] = [
  {
    id: "digital-novel",
    name: "Digital Novel",
    tagline: "A custom novel, beautifully delivered as an ebook.",
    price: 49,
    features: ["Custom novel", "Ebook (EPUB + PDF)", "Story blueprint", "1 revision pass"],
    formats: ["ebook"],
    isSeries: false,
  },
  {
    id: "story-bundle",
    name: "Story Bundle",
    tagline: "Ebook, audiobook, and a printed paperback.",
    price: 129,
    features: [
      "Custom novel",
      "Ebook (EPUB + PDF)",
      "Audiobook (MP3)",
      "Paperback-ready file",
      "1 printed copy",
      "1 revision pass",
    ],
    formats: ["ebook", "audiobook", "paperback"],
    isSeries: false,
    popular: true,
    badge: "Most Popular",
  },
  {
    id: "three-book-series",
    name: "3-Book Series",
    tagline: "A connected arc of three custom novels.",
    price: 299,
    features: [
      "Series bible",
      "3 connected books",
      "Ebook versions",
      "Audiobook versions",
      "Paperback-ready files",
      "Optional printed copies",
      "2 revision passes",
    ],
    formats: ["ebook", "audiobook", "paperback"],
    isSeries: true,
    badge: "Best Value",
  },
  {
    id: "gift-deluxe",
    name: "Gift Deluxe",
    tagline: "A premium printed gift edition.",
    price: 179,
    features: [
      "Custom novel or series book one",
      "Ebook + Audiobook",
      "Premium printed copy",
      "Personal dedication",
      "Gift message + presentation",
    ],
    formats: ["ebook", "audiobook", "hardcover"],
    isSeries: false,
    badge: "Gift Ready",
  },
];

export const GENRES = [
  "Fantasy", "Sci-Fi", "Mystery", "Adventure", "Sports",
  "Friendship", "Comedy", "School Drama", "Mythology", "Superhero", "Animal Adventure",
];

export const TONES = [
  "Funny", "Epic", "Cozy", "Mysterious", "Emotional",
  "Fast-paced", "Slightly Spooky", "Inspiring",
];

export const THEMES = [
  "Courage", "Friendship", "Confidence", "Teamwork",
  "Resilience", "Belonging", "Curiosity", "Family",
];

export const SETTINGS = [
  "Magical school", "Future city", "Lost island",
  "Space academy", "Hidden kingdom", "Modern hometown with secrets",
];

export const COVER_STYLES = [
  "Illustrated fantasy", "Graphic novel energy", "Cinematic YA",
  "Cozy storybook", "Modern minimalist", "Funny / cartoon",
];
