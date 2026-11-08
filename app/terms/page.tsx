import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the 10X website. Draft pending legal review.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const { company, contact } = siteConfig;
  return (
    <LegalPage title="Terms of Use" updated="26 September 2026">
      <p>
        These draft terms cover use of the 10X marketing website operated by {company.name}, Malaysia. Terms for the 10X software subscription are provided separately when you sign
        up.
      </p>

      <h2>Information on this website</h2>
      <p>
        We aim to keep information on this website accurate. Product demos on this website use illustrative data and
        fictional names. The exact features available to you depend on your plan and setup, and are confirmed with you
        before any subscription starts.
      </p>

      <h2>Estimates</h2>
      <p>
        The opportunity calculator produces estimates from the assumptions you enter. It is an illustration, not a promise
        or guarantee of results.
      </p>

      <h2>Pricing</h2>
      <p>
        Prices shown are in US dollars. Founding prices apply as described on the pricing section. Final pricing and
        plan scope are confirmed in writing before any subscription starts. [Subscription terms to be finalised during
        legal review.]
      </p>

      <h2>Enquiries</h2>
      <p>
        Sending an enquiry is free. We will contact you at the email or WhatsApp number you provide to arrange your
        onboarding. You can ask to be removed at any time by emailing {contact.email}.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </p>
    </LegalPage>
  );
}
