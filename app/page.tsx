import { Suspense } from "react";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { BusinessProvider } from "@/components/providers/BusinessProvider";
import { AuditCTA } from "@/components/marketing/AuditCTA";
import { CommandPalette } from "@/components/marketing/CommandPalette";
import { CursorGlow } from "@/components/marketing/CursorGlow";
import { DepthBackground } from "@/components/marketing/DepthBackground";
import { FocusSystem } from "@/components/marketing/FocusSystem";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { MeetYourTeam } from "@/components/marketing/MeetYourTeam";
import { Navbar } from "@/components/marketing/Navbar";
import { ProductDemo } from "@/components/marketing/ProductDemo";
import { PricingFAQ } from "@/components/marketing/PricingFAQ";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { ScrollDepthTracker } from "@/components/marketing/ScrollDepthTracker";
import { ScrollProgress } from "@/components/marketing/ScrollProgress";
import { Testimonials } from "@/components/marketing/Testimonials";
import { TrialModal } from "@/components/marketing/TrialModal";
import { homepageJsonLd, jsonLdScript } from "@/lib/structured-data";

/**
 * Order: hero, meet your team, problem + calculator, how it works, product demos, testimonials, pricing + FAQ, final CTA.
 * OnePersonCompany, AITeam, ProductFeatures and the standalone calculator stay in the repo, unrendered.
 * A fixed depth background sits behind at z-0, the cursor glow above it.
 * Suspense boundaries let React hydrate chapters in separate, interruptible chunks.
 */
export default function HomePage() {
  return (
    <MotionProvider>
      <BusinessProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(homepageJsonLd()) }} />
        <CursorGlow />
        <ScrollProgress />
        <CommandPalette />
        <Navbar />
        <TrialModal />
        <FocusSystem />
        <DepthBackground />
        <main id="main" tabIndex={-1} className="relative z-10 focus:outline-none">
          {/* Hero */}
          <Hero />
          {/* Meet your team: four agents */}
          <MeetYourTeam />
          {/* Problem, with the calculator inline */}
          <Suspense fallback={null}>
            <ProblemSection />
          </Suspense>
          {/* How it works: six steps, four AI roles */}
          <Suspense fallback={null}>
            <HowItWorks />
          </Suspense>
          {/* Product demos: six interactive simulations */}
          <ProductDemo />
          {/* Testimonials */}
          <Suspense fallback={null}>
            <Testimonials />
          </Suspense>
          {/* Pricing + FAQ (one chapter: PricingFAQ renders Pricing, Security and FAQ) */}
          <Suspense fallback={null}>
            <PricingFAQ />
          </Suspense>
          {/* Final CTA (AuditCTA renders FinalCTA around the form) */}
          <Suspense fallback={null}>
            <AuditCTA />
          </Suspense>
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
        <ScrollDepthTracker />
      </BusinessProvider>
    </MotionProvider>
  );
}
