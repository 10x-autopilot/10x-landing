export type PricingPlan = {
  slug: string;
  name: string;
  /** Monthly price in USD. */
  monthly: number;
  headline: string;
  /** Short line under the price. */
  subtext: string;
  features: string[];
  highlighted?: boolean;
  /** Glowing note shown under the card. */
  badge?: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    slug: "starter",
    name: "Starter",
    monthly: 29,
    headline: "Your AI employee for less than $1 a day.",
    subtext: "About $0.97 a day.",
    // "CRM" is a forbidden word (DESIGN.md §8).
    features: ["1 website with subdomain", "WhatsApp AI chatbot", "Full contact and pipeline access"],
  },
  {
    slug: "scaler",
    name: "Scaler",
    monthly: 77,
    headline: "Run 3 businesses for about 4 cents an hour each.",
    subtext: "About $25.67 per business across 3 sub-accounts.",
    features: [
      "10 websites with subdomains",
      "Custom team agent",
      "10 free leads a month",
      "Ready-made automations",
      "AI voice caller",
      "Ad manager for Google, Facebook and Instagram",
      "5 users and 3 sub-accounts",
    ],
    highlighted: true,
    badge: "The math: $77 a month. One extra client usually covers the plan. The rest is yours.",
  },
  {
    slug: "agency",
    name: "Agency",
    monthly: 297,
    headline: "Sell it under your own brand.",
    subtext: "For agencies that resell.",
    features: [
      "No limit on websites and subdomains",
      "White-label with your own brand",
      "No limit on users and sub-accounts",
      "Priority support",
    ],
  },
];

/** Setup is optional on every tier. */
export const setupCopy = {
  label: "Guided setup (optional)",
  note: "We build it with you. Skip it and set up yourself.",
  badge: "Setup fee optional",
} as const;

export const pricingCopy = {
  title: "Start free. Pick a plan after.",
  lead: "7 days free. Full access. We set it up with you.",
  compare: "Compare: one junior hire costs about $600-800/month. 10X does the same work for a fraction.",
} as const;
