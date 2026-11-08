export const siteConfig = {
  name: "10X",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tenx.my").replace(/\/$/, ""),
  /** The signed-in product. "CRM" is a forbidden word, so the button says "Open app". */
  appUrl: "https://app.tenx.my",
  signInUrl: "https://app.tenx.my/sign-in",
  signupUrl: "https://app.tenx.my/register",
  /** Temporary: the public booking page returned 404, so this points at the sales contact form. Swap in a verified booking URL when Terminal 1 supplies one. */
  demoUrl: "#audit",
  title: "10X | Your AI Operations Team",
  description:
    "Hire an AI operations team for a fraction of a human hire. Built for Malaysian service businesses.",
  company: {
    /** Public company name. Always exactly this. */
    name: "BTB SOLUTIONS",
    registration: "202503175924",
    country: "Malaysia",
    countryCode: "MY",
  },
  /** Public business contact only. Never add personal or founder contact details. */
  contact: {
    label: "Sales Team",
    email: "admin@tenx.my",
  },
  cta: {
    primary: "Start 7-Day Free Trial",
    primaryShort: "Start 7-Day Free Trial",
    secondary: "See How It Works",
    demo: "Talk to our team",
    formSubmit: "Talk to our sales team",
    microcopy: "7 days free. Full access. We set it up with you.",
    app: "Open app",
    signIn: "Sign in",
  },
  copyrightYear: 2026,
} as const;

/** Window event that opens the free trial popup. */
export const openTrialEvent = "open-trial-modal";

export const salesMailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent("10X enquiry")}`;

export const sectionIds = {
  hero: "top",
  team: "team",
  leak: "solutions",
  calculator: "calculator",
  howItWorks: "how-it-works",
  ai: "ai-employee",
  product: "product",
  pricing: "pricing",
  security: "security",
  audit: "audit",
} as const;

export const navLinks = [
  { label: "Solutions", href: `#${sectionIds.leak}` },
  { label: "How It Works", href: `#${sectionIds.howItWorks}` },
  { label: "AI Team", href: `#${sectionIds.team}` },
  { label: "Pricing", href: `#${sectionIds.pricing}` },
  { label: "Security", href: `#${sectionIds.security}` },
] as const;

/** The chapters rendered on the page, used by the focus rail and active navigation. */
export const chapters = [
  { id: sectionIds.hero, num: "01", label: "Overview" },
  { id: sectionIds.team, num: "02", label: "Your AI team" },
  { id: sectionIds.leak, num: "03", label: "The leak" },
  { id: sectionIds.howItWorks, num: "04", label: "How it works" },
  { id: sectionIds.product, num: "05", label: "Inside the product" },
  { id: sectionIds.pricing, num: "06", label: "Pricing & trust" },
  { id: sectionIds.audit, num: "07", label: "Talk to us" },
] as const;
