import { Hero } from "@/features/landing/components/Hero";
import { Features } from "@/features/landing/components/Features";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { Industries } from "@/features/landing/components/Industries";
import { WhyBidTracker } from "@/features/landing/components/WhyBidTracker";
import { CallToAction } from "@/features/landing/components/CallToAction";

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <WhyBidTracker />
        <Industries />
        <CallToAction />
      </main>
    </div>
  );
}
