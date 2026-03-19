"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ClaritySymbol } from "@/components/clarity-symbol"

const STATS = [
  {
    stat: "80% of product features are rarely or never used.",
    source: "Standish Group — CHAOS Report",
    url: "https://www.standishgroup.com/sample_research_files/CHAOSReport2015-Final.pdf",
  },
  {
    stat: "86% of workplace failures are caused by poor communication.",
    source: "Salesforce — Workplace Collaboration Research",
    url: "https://www.salesforce.com/blog/team-collaboration-statistics/",
  },
  {
    stat: "Projects with clearly defined objectives are 2× more likely to succeed.",
    source: "McKinsey & Company — Delivering Large-Scale IT Projects",
    url: "https://www.mckinsey.com/business-functions/operations/our-insights/delivering-large-scale-it-projects-on-time-on-budget-and-on-value",
  },
]

export function HeroSection() {
  const [index, setIndex] = React.useState(0)
  const [visible, setVisible] = React.useState(true)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  React.useEffect(() => {
    if (reduceMotion) return
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % STATS.length)
        setVisible(true)
      }, 400)
    }, 6000)
    return () => clearInterval(timer)
  }, [reduceMotion])

  const current = STATS[index]
  // step goes 1 → 2 → 3 as stats advance (out of 6 total segments)
  const step = (index + 1) * 2

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-6 pt-5 pb-3">
        <div className="pointer-events-none">
          <ClaritySymbol size={18} step={step} />
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 text-xs font-mono uppercase tracking-widest text-foreground pointer-events-none text-center text-pretty">
          Before building, teams need clarity.
        </p>
        <Button asChild size="sm" className="hidden sm:flex">
          <Link href="/app">Get Clarity</Link>
        </Button>
      </div>

      {/* Attribution — fixed bottom center, desktop only */}
      <div className="fixed bottom-0 left-0 right-0 z-10 hidden sm:flex justify-center pb-5">
        <a
          href="https://www.enter404.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-150"
        >
          Made by Enter404
        </a>
      </div>

      {/* Mobile CTA — fixed bottom center */}
      <div className="fixed bottom-0 left-0 right-0 z-10 flex justify-center pb-8 sm:hidden">
        <Button asChild size="lg">
          <Link href="/app">Get Clarity</Link>
        </Button>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col gap-6 max-w-lg items-center text-center">
        <div className="flex flex-col gap-5">
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(4px)",
              transition: reduceMotion ? "none" : "opacity 0.4s ease, transform 0.4s ease",
            }}
            className="flex flex-col gap-5"
          >
            <p className="font-serif text-4xl leading-[1.15] tracking-tight text-balance">
              {current.stat}
            </p>
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-foreground/60 hover:text-foreground transition-colors duration-150"
            >
              {current.source}
            </a>
          </div>
        </div>

        {/* <p className="text-sm font-mono text-muted-foreground leading-relaxed text-balance">
          Teams build the wrong things when the problem isn't clearly defined.
        </p> */}
      </div>
    </>
  )
}
