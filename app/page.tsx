import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GrainGradientBg } from "@/components/grain-gradient-bg";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <GrainGradientBg />
      <div className="relative z-10 flex flex-col gap-6 max-w-md">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight">Clarity</span>
          <span className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1 py-px leading-none">BETA</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-balance">
          Define your sprint before it starts.
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed text-balance">
          Clarity helps teams answer the six questions that matter most before a sprint begins. Go from chaos to a structured project scope in minutes.
        </p>
        <Button asChild size="sm" className="w-fit">
          <Link href="/app">Start Sprint</Link>
        </Button>
      </div>
    </main>
  );
}
