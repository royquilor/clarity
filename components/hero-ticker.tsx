"use client"

import * as React from "react"

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

export function HeroTicker() {
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
    }, 4000)
    return () => clearInterval(timer)
  }, [reduceMotion])

  const current = STATS[index]

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(4px)",
        transition: reduceMotion ? "none" : "opacity 0.4s ease, transform 0.4s ease",
      }}
      className="flex flex-col gap-5"
    >
      <p className="text-4xl tracking-tight text-balance" style={{ fontFamily: "'Newsreader', serif" }}>
        {current.stat}
      </p>
      <a
        href={current.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-mono text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-150"
      >
        {current.source}
      </a>
    </div>
  )
}
