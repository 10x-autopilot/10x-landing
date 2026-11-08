import { faqs } from "./faq";
import { pricingPlans } from "./pricing";
import { siteConfig } from "./site-config";

/** JSON-LD for the homepage. Visible, factual content only. No ratings, reviews or counts. */
export function homepageJsonLd() {
  const { url, company, contact } = siteConfig;
  const orgId = `${url}/#organization`;
  const prices = pricingPlans.map((p) => p.monthly);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: company.name,
        url,
        logo: `${url}/icon.svg`,
        email: contact.email,
        address: { "@type": "PostalAddress", addressCountry: company.countryCode },
        brand: { "@type": "Brand", name: "10X" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          name: contact.label,
          email: contact.email,
          areaServed: "MY",
          availableLanguage: ["en", "ms"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: "10X",
        inLanguage: "en-MY",
        publisher: { "@id": orgId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${url}/#software`,
        name: "10X",
        url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: siteConfig.description,
        publisher: { "@id": orgId },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: pricingPlans.length,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
