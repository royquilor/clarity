import { GrainGradientBg } from "@/components/grain-gradient-bg";
import { HeroSection } from "@/components/hero-ticker";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <GrainGradientBg />
      <HeroSection />
    </main>
  );
}
