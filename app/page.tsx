import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GrainGradientBg } from "@/components/grain-gradient-bg";
import { HeroTicker } from "@/components/hero-ticker";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <GrainGradientBg />
      <div className="fixed top-0 left-0 z-10 px-6 pt-5 pb-3 flex items-center gap-2 pointer-events-none">
        <span className="text-sm font-semibold tracking-tight">Clarity</span>
        <span className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1 py-px leading-none">BETA</span>
      </div>
      <div className="relative z-10 flex flex-col gap-6 max-w-lg items-center text-center">
        <HeroTicker />
        <p className="text-sm font-mono text-muted-foreground leading-relaxed text-balance">
          Teams build the wrong things because they misunderstand the problem and fail to align before building.
        </p>
        <Button asChild size="lg" className="w-fit">
          <Link href="/app">Get Clarity</Link>
        </Button>
      </div>
    </main>
  );
}
