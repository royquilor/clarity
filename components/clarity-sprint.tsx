"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Copy01Icon,
  Download01Icon,
  CheckmarkCircle01Icon,
  RotateClockwiseIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { ClaritySymbol } from "@/components/clarity-symbol"
import { track } from "@vercel/analytics"
import { motion } from "framer-motion"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@/components/ui/avatar"

type Source = { name: string; initials: string; url: string }

const QUESTIONS = [
  {
    id: "problem", section: "Problem",
    question: "What problem are we solving?",
    why: "37% of projects fail because requirements are unclear.",
    sources: [
      { name: "PMI — Pulse of the Profession", initials: "PMI", url: "https://www.pmi.org/learning/library/pulse-of-the-profession-2018-strategy-implementation-11821" },
    ] as Source[],
    suggestions: [
      "Teams ship features before clearly defining the real problem.",
      "AI tools generate ideas faster than teams can evaluate them.",
    ] as const,
  },
  {
    id: "user", section: "User",
    question: "Who is experiencing this problem?",
    why: "42% of startups fail because there is no market need.",
    sources: [
      { name: "CB Insights — Top Reasons Startups Fail", initials: "CBI", url: "https://www.cbinsights.com/research/startup-failure-reasons-top/" },
    ] as Source[],
    suggestions: [
      "Early-stage founders struggle to define product scope before building.",
      "Designers using AI tools struggle to turn ideas into real products.",
    ] as const,
  },
  {
    id: "success", section: "Success",
    question: "What does success look like?",
    why: "52% of projects experience scope creep due to unclear goals.",
    sources: [
      { name: "PMI — Pulse of the Profession", initials: "PMI", url: "https://www.pmi.org/learning/thought-leadership/pulse" },
    ] as Source[],
    suggestions: [
      "A clear sprint plan the team agrees on before development starts.",
      "A defined outcome that determines whether the sprint succeeded.",
    ] as const,
  },
  {
    id: "constraints", section: "Constraints",
    question: "What constraints should we consider?",
    why: "Large IT projects run 45% over budget on average.",
    sources: [
      { name: "McKinsey — Delivering Large-Scale IT Projects", initials: "MK", url: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/delivering-large-scale-it-projects-on-time-on-budget-and-on-value" },
    ] as Source[],
    suggestions: [
      "A small team with limited engineering time.",
      "AI tools generating ideas faster than teams can prioritise them.",
    ] as const,
  },
  {
    id: "mvp", section: "MVP",
    question: "What is the smallest version we could build?",
    why: "80% of product features are rarely or never used.",
    sources: [
      { name: "Standish Group — CHAOS Report 2015", initials: "ST", url: "https://www.standishgroup.com/sample_research_files/CHAOSReport2015-Final.pdf" },
    ] as Source[],
    suggestions: [
      "A simple tool that helps founders define a sprint in minutes.",
      "A lightweight workflow that clarifies a project before building.",
    ] as const,
  },
  {
    id: "risk", section: "Risk",
    question: "What could make this project fail?",
    why: "17% of IT projects fail so badly they threaten the company's survival.",
    sources: [
      { name: "McKinsey — Delivering Large-Scale IT Projects", initials: "MK", url: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/delivering-large-scale-it-projects-on-time-on-budget-and-on-value" },
    ] as Source[],
    suggestions: [
      "Solving the founder's problem instead of the customer's problem.",
      "Starting development before the team agrees on the scope.",
    ] as const,
  },
] as const

type QuestionId = (typeof QUESTIONS)[number]["id"]

const STAGES = [
  { threshold: 0,   label: "Chaos",      barColor: "bg-red-400",     why: "37% of project failures trace back to unclear requirements." },
  { threshold: 16,  label: "Signal",     barColor: "bg-orange-400",  why: "47% of missed goals trace to misaligned requirements." },
  { threshold: 33,  label: "Pattern",    barColor: "bg-yellow-500",  why: "50% of features shipped are rarely or never used." },
  { threshold: 50,  label: "Framed",     barColor: "bg-teal-500",    why: "52% of projects experience uncontrolled scope changes." },
  { threshold: 66,  label: "Structured", barColor: "bg-blue-500",    why: "Small, focused projects are 10× more likely to succeed." },
  { threshold: 100, label: "Shaped",     barColor: "bg-emerald-500", why: "Catching problems in the brief is 100× cheaper than post-launch." },
]

function getClarityStage(progress: number) {
  let stage = STAGES[0]
  for (const s of STAGES) {
    if (progress >= s.threshold) stage = s
  }
  return stage
}

function generateMarkdown(answers: Record<string, string>): string {
  const sections = QUESTIONS.map((q) => {
    const answer = answers[q.id]?.trim() || "_Not answered_"
    return `## ${q.section}\n${answer}`
  })
  return `# Project Scope\n\n${sections.join("\n\n")}`
}

const QUESTION_INSIGHTS: Record<string, string> = {
  problem: "Without a clearly defined problem, teams risk building the right solution to the wrong question.",
  user: "Unclear user definition leads to misaligned features — up to 85% of rework traces back to not knowing who you're building for.",
  success: "Without a success metric, there's no finish line — 52% of projects experience scope creep when success isn't defined upfront.",
  constraints: "Undefined constraints are a hidden budget risk. Large projects average 45% over budget without them.",
  mvp: "Broad scope is the enemy of shipping. Small, focused scopes are 10× more likely to succeed than large, undefined ones.",
  risk: "17% of IT projects fail catastrophically due to risks that were never surfaced before development began.",
}

const STORAGE_KEY = "clarity-sprint-v1"
type AppState = "questions" | "scorecard"

const LOADING_MESSAGES = [
  "Noted.",
  "Sharpening the picture…",
  "One less unknown.",
  "Getting clearer…",
  "Filed away.",
]

const ANALYSIS_KEY = "clarity-sprint-v1-analysis"

export function ClaritySprint() {
  const [appState, setAppState] = React.useState<AppState>("questions")
  const [currentStep, setCurrentStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [copied, setCopied] = React.useState(false)
  const [aiInsight, setAiInsight] = React.useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [transitionMessage, setTransitionMessage] = React.useState<string>("")
  const [isReflecting, setIsReflecting] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    track("clarity_started")
  }, [])

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.answers) setAnswers(data.answers)
        if (typeof data.currentStep === "number") {
          setCurrentStep(Math.min(Math.max(0, data.currentStep), QUESTIONS.length - 1))
        }
        if (data.appState && ["questions", "scorecard"].includes(data.appState)) {
          setAppState(data.appState)
        }
      }
    } catch {}
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentStep, appState }))
    } catch {}
  }, [answers, currentStep, appState])

  React.useEffect(() => {
    if (appState === "questions") {
      const t = setTimeout(() => textareaRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [currentStep, appState])

  const answeredCount = QUESTIONS.filter((q) => answers[q.id]?.trim()).length
  const progress = (answeredCount / QUESTIONS.length) * 100
  const stage = getClarityStage(progress)

  React.useEffect(() => {
    if (appState === "scorecard") track("clarity_completed")
  }, [appState])

  React.useEffect(() => {
    if (appState !== "scorecard") return
    try {
      const cached = localStorage.getItem(ANALYSIS_KEY)
      if (cached) { setAiInsight(cached); return }
    } catch {}

    setIsAnalyzing(true)
    setAiInsight("")

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    }).then(async (res) => {
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let text = ""
      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setAiInsight(text)
      }
      try { localStorage.setItem(ANALYSIS_KEY, text) } catch {}
    }).catch(() => {}).finally(() => setIsAnalyzing(false))
  }, [appState])

  function handleReset() {
    setAnswers({})
    setCurrentStep(0)
    setAppState("questions")
    setAiInsight("")
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(ANALYSIS_KEY)
    } catch {}
  }

  function handleNext() {
    // If a reflection is already showing, advance to the next step
    if (transitionMessage) {
      setTransitionMessage("")
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep((s) => s + 1)
      } else {
        setAppState("scorecard")
      }
      return
    }

    // Otherwise fetch a reflection first
    const fallback = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
    const q = QUESTIONS[currentStep]
    const answer = answers[q.id] ?? ""

    setIsReflecting(true)
    setTransitionMessage("Thinking…")

    fetch("/api/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q.question, answer }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error()
        const text = await res.text()
        setTransitionMessage(text || fallback)
      })
      .catch(() => {
        setTransitionMessage(fallback)
      })
      .finally(() => {
        setIsReflecting(false)
      })
  }

  function handleBack() {
    if (appState === "scorecard") {
      setAppState("questions")
      setCurrentStep(QUESTIONS.length - 1)
    } else if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generateMarkdown(answers))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  function handleDownload() {
    const blob = new Blob([generateMarkdown(answers)], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "project-scope.md"
    setTimeout(() => {
      a.click()
      URL.revokeObjectURL(url)
    }, 0)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      handleNext()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 z-10 px-6 pt-5 pb-3">
        <Link href="/" aria-label="Back to home">
          <ClaritySymbol size={18} step={answeredCount} isBlurring={isReflecting || !!transitionMessage} />
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {appState === "questions" && (
          <QuestionView
            key={currentStep}
            question={QUESTIONS[currentStep].question}
            why={QUESTIONS[currentStep].why}
            sources={(QUESTIONS[currentStep] as unknown as { sources: Source[] }).sources}
            section={QUESTIONS[currentStep].section}
            suggestions={QUESTIONS[currentStep].suggestions}
            step={currentStep}
            answer={answers[QUESTIONS[currentStep].id] ?? ""}
            transitionMessage={transitionMessage}
            onChange={(val) =>
              setAnswers((prev) => ({ ...prev, [QUESTIONS[currentStep].id]: val }))
            }
            onNext={handleNext}
            onBack={handleBack}
            isLast={currentStep === QUESTIONS.length - 1}
            isReflecting={isReflecting}
            textareaRef={textareaRef}
            onKeyDown={handleKeyDown}
          />
        )}

        {appState === "scorecard" && (
          <ScorecardView
            answers={answers}
            progress={progress}
            stage={stage}
            onReset={handleReset}
            onCopy={handleCopy}
            onDownload={handleDownload}
            copied={copied}
            aiInsight={aiInsight}
            isAnalyzing={isAnalyzing}
          />
        )}
      </div>
    </div>
  )
}

// ─── Made By ──────────────────────────────────────────────────────────────────

function MadeBy() {
  return (
    <a
      href="https://www.enter404.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-150 font-mono"
    >
      by Roy Quilor
    </a>
  )
}

// ─── Clarity Symbol ─────────────────────────── imported from clarity-symbol.tsx

// ─── Ticker Text ──────────────────────────────────────────────────────────────

function TickerText({ items, sources, step }: { items: [string, string]; sources: Source[]; step: number }) {
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
        setIndex((i) => (i + 1) % 2)
        setVisible(true)
      }, 400)
    }, 3500)
    return () => clearInterval(timer)
  }, [reduceMotion])

  const showingSources = index === 1 && sources.length > 0

  return (
    <div className="min-h-20">
      <div
        className="flex flex-col justify-start gap-1.5"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(4px)",
          transition: reduceMotion ? "none" : "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
      <div>
        <span className="text-sm text-muted-foreground font-mono">
          {items[index]}
        </span>
      </div>
      <div
        style={{
          opacity: showingSources ? 1 : 0,
          transition: reduceMotion ? "none" : "opacity 0.4s ease",
        }}
      >
        <AvatarGroup>
          {sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={source.name}
              title={source.name}
            >
              <Avatar size="sm">
                <AvatarFallback className="text-[9px] font-mono font-medium">
                  {source.initials}
                </AvatarFallback>
              </Avatar>
            </a>
          ))}
        </AvatarGroup>
      </div>
      </div>
    </div>
  )
}

// ─── Question View ────────────────────────────────────────────────────────────

type QuestionViewProps = {
  question: string
  why: string
  sources: Source[]
  section: string
  suggestions: readonly [string, string]
  step: number
  answer: string
  transitionMessage: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  isLast: boolean
  isReflecting: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

function QuestionView({
  question,
  why,
  sources,
  suggestions,
  step,
  answer,
  transitionMessage,
  onChange,
  onNext,
  onBack,
  isLast,
  isReflecting,
  textareaRef,
  onKeyDown,
}: QuestionViewProps) {
  const isSuggestionSelected = (suggestions as readonly string[]).includes(answer)
  const hasSelection = !!answer

  function getOptionClass(isSelected: boolean) {
    if (!hasSelection) return "text-foreground/30"
    return isSelected ? "text-foreground" : "text-foreground/15"
  }

  function handleSuggestionClick(suggestion: string) {
    onChange(answer === suggestion ? "" : suggestion)
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  React.useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && (answer.trim() || transitionMessage) && !isReflecting) {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [answer, transitionMessage, isReflecting, onNext])

  return (
    <div className="flex-1 flex flex-col animate-in fade-in-0 duration-200">
      {/* Question + options area */}
      <div className="flex-1 flex flex-col px-6 pb-24 pt-32">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
        {transitionMessage ? (
          <div className="flex flex-col justify-start min-h-20">
            <div className="animate-in fade-in-0 duration-200">
              <span className={cn("text-sm text-foreground font-mono text-pretty", isReflecting && "shimmer-text")}>
                {transitionMessage}
              </span>
            </div>
          </div>
        ) : (
          <TickerText items={[question, why]} sources={sources} step={step} />
        )}

        <div
          className="flex flex-col divide-y divide-border/50"
        >
          {/* Suggestion 1 */}
          <button
            type="button"
            onClick={() => handleSuggestionClick(suggestions[0])}
            disabled={isReflecting || !!transitionMessage}
            className={cn(
              "w-full text-left py-5 font-medium leading-snug tracking-tight transition-[colors,opacity] duration-200 disabled:pointer-events-none",
              getOptionClass(answer === suggestions[0]),
            )}
            style={{
              fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)",
              opacity: (isReflecting || transitionMessage) ? (answer === suggestions[0] ? 0.4 : 0) : 1,
            }}
          >
            {suggestions[0]}
          </button>

          {/* Suggestion 2 */}
          <button
            type="button"
            onClick={() => handleSuggestionClick(suggestions[1])}
            disabled={isReflecting || !!transitionMessage}
            className={cn(
              "w-full text-left py-5 font-medium leading-snug tracking-tight transition-[colors,opacity] duration-200 disabled:pointer-events-none",
              getOptionClass(answer === suggestions[1]),
            )}
            style={{
              fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)",
              opacity: (isReflecting || transitionMessage) ? (answer === suggestions[1] ? 0.4 : 0) : 1,
            }}
          >
            {suggestions[1]}
          </button>

          {/* Free text option */}
          <div
            className="py-5 transition-opacity duration-200"
            style={{
              opacity: (isReflecting || transitionMessage) ? (!isSuggestionSelected && answer ? 0.4 : 0) : 1,
            }}
          >
            <textarea
              ref={textareaRef}
              value={isSuggestionSelected ? "" : answer}
              onChange={handleTextareaChange}
              onKeyDown={onKeyDown}
              disabled={isReflecting || !!transitionMessage}
              rows={1}
              placeholder="Write your own…"
              className={cn(
                "w-full bg-transparent border-none outline-none resize-none text-left",
                "font-medium leading-snug tracking-tight transition-colors duration-150",
                "touch-manipulation",
                !isSuggestionSelected && answer
                  ? "text-foreground"
                  : hasSelection
                  ? "placeholder:text-foreground/15"
                  : "placeholder:text-foreground/30",
              )}
              style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)" }}
              aria-label="Write your own answer"
            />
          </div>
        </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div
        className="fixed bottom-0 left-0 right-0"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
      >
        {/* Blur fade */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
          }}
        />
        <div className="relative flex items-center justify-end px-6 pt-10 pb-0">
        <div className="flex items-center gap-1">
          {step > 0 && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onBack}
              aria-label="Previous question"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            </Button>
          )}
          <Button
            size="sm"
            onClick={onNext}
            disabled={!answer.trim() || isReflecting}
            aria-label={isReflecting ? "Analyzing…" : transitionMessage ? (isLast ? "Finish" : "Next") : "Analyze"}
            className="min-w-[90px]"
          >
            {isReflecting ? (
              <>
                <Spinner />
                Analyzing…
              </>
            ) : transitionMessage ? (
              isLast ? "Finish" : "Next"
            ) : (
              "Analyze"
            )}
          </Button>
        </div>
        </div>
      </div>
    </div>
  )
}

// ─── Progress Stepper ─────────────────────────────────────────────────────────

function ProgressStepper({ answers, progress }: { answers: Record<string, string>; progress: number }) {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    const t = setTimeout(() => setDisplayValue(progress), 800)
    return () => clearTimeout(t)
  }, [progress])

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
      <div className="min-w-[440px] flex flex-col gap-2">
        <Progress value={displayValue} className="h-1 [&>[data-slot=progress-indicator]]:duration-1000 [&>[data-slot=progress-indicator]]:ease-out" />
        <div className="flex">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="flex-1 text-center">
              <span
                className={cn(
                  "text-[10px] font-mono whitespace-nowrap transition-colors duration-300",
                  answers[q.id]?.trim() ? "text-foreground/60" : "text-foreground/25",
                )}
              >
                {q.section}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Scorecard View ───────────────────────────────────────────────────────────

type ScorecardViewProps = {
  answers: Record<string, string>
  progress: number
  stage: (typeof STAGES)[number]
  onReset: () => void
  onCopy: () => void
  onDownload: () => void
  copied: boolean
  aiInsight: string
  isAnalyzing: boolean
}

function ScorecardView({
  answers,
  progress,
  stage,
  onReset,
  onCopy,
  onDownload,
  copied,
  aiInsight,
  isAnalyzing,
}: ScorecardViewProps) {
  const strengths = QUESTIONS.filter((q) => !!answers[q.id]?.trim())
  const gaps = QUESTIONS.filter((q) => !answers[q.id]?.trim())
  const isReady = progress === 100
  const primaryGap = gaps[0]

  return (
    <div className="flex-1 flex flex-col animate-in fade-in-0 duration-200">
      <div className="flex-1 flex flex-col px-6 pt-32 pb-32">
      <div className="w-full max-w-lg mx-auto flex flex-col gap-10">

        {/* Section 1 — Project Clarity Status */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Project Clarity
          </p>
          <div className="flex flex-col gap-4">
            <p className="text-4xl tracking-tight" style={{ fontFamily: "'Newsreader', serif" }}>{stage.label}</p>
            <ProgressStepper answers={answers} progress={progress} />
          </div>
        </div>

{/* Section 3 — Needs Clarity */}
        {gaps.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Needs Clarity
            </p>
            <ul className="flex flex-col gap-2">
              {gaps.map((q) => (
                <li key={q.id} className="flex items-center gap-2.5">
                  <svg viewBox="0 0 16 16" fill="none" className="size-4 shrink-0 text-foreground/30">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                  </svg>
                  <span className="text-sm font-mono text-foreground/40">{q.section}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 4 — Insight (AI) */}
        {(isAnalyzing || aiInsight) && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Insight
            </p>
            {isAnalyzing && !aiInsight ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground/30 font-mono animate-pulse">Analyzing…</span>
              </div>
            ) : (
              <p className="text-sm text-foreground/70 leading-relaxed">{aiInsight}</p>
            )}
          </div>
        )}

{/* Section 5 — Suggested Next Step */}
        {gaps.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Suggested Next Step
            </p>
            <p className="text-sm text-foreground/70">Before starting the sprint, clarify:</p>
            <ul className="flex flex-col gap-1.5">
              {gaps.map((q) => (
                <li key={q.id} className="text-sm font-mono text-foreground/60 flex items-center gap-2">
                  <span className="text-foreground/30">·</span>
                  {q.section}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Status */}
        {isReady && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Status
            </p>
            <p className="text-sm text-foreground/60 font-mono">
              All areas defined. Ready for sprint.
            </p>
          </div>
        )}

        {/* About */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Clarity Report Complete
          </p>
          <p className="text-sm text-foreground/40 leading-relaxed">
            This analysis was generated using Clarity.<br />
            Clarity is part of Enter404 — tools for designers navigating the AI era.
          </p>
          <a
            href="https://enter404.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-foreground/40 hover:text-foreground transition-colors duration-150"
          >
            enter404.com
          </a>
        </div>

      </div>

      {/* Export + actions */}
      <div
        className="fixed bottom-0 left-0 right-0"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
      >
        {/* Blur fade */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
          }}
        />
        <div className="relative flex items-center justify-end gap-2 px-5 pt-10 pb-0">
          <Button size="sm" onClick={onCopy} aria-label="Copy markdown">
            <HugeiconsIcon
              icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
              strokeWidth={2}
              data-icon="inline-start"
              className={cn(copied && "text-foreground")}
            />
            {copied ? "Copied" : "Copy Markdown"}
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onReset} aria-label="New Sprint">
            <HugeiconsIcon icon={RotateClockwiseIcon} strokeWidth={2} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onDownload} aria-label="Download .md file">
            <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Subscribe" asChild onClick={() => track("clarity_subscribe_click")}>
            <a href="https://enter404.com?utm_source=clarity&utm_medium=tool" target="_blank" rel="noopener noreferrer">
              <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />
            </a>
          </Button>
        </div>
      </div>
      </div>
    </div>
  )
}
