"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Copy01Icon,
  Download01Icon,
  CheckmarkCircle01Icon,
  RotateClockwiseIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
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
    why: "37% of project failures start with unclear requirements.",
    sources: [
      { name: "PMI 2014", initials: "PMI", url: "https://www.pmi.org/-/media/pmi/documents/public/pdf/learning/thought-leadership/pulse/requirements-management.pdf" },
    ] as Source[],
    suggestions: [
      "Designers spend more time managing AI output than solving real problems.",
      "Teams ship features no one uses because the problem was never defined.",
    ] as const,
  },
  {
    id: "user", section: "User",
    question: "Who is experiencing this problem?",
    why: "Unclear users drive up to 85% of rework costs.",
    sources: [
      { name: "Westfall 2005", initials: "WT", url: "https://ima.udg.edu/~sellares/EINF-ES2/The_Why_What_Who_When_and_How_Of_Software_Requirements.pdf" },
    ] as Source[],
    suggestions: [
      "Product designers at early-stage startups building with AI tools.",
      "Founders shipping their first product without a dedicated PM.",
    ] as const,
  },
  {
    id: "success", section: "Success",
    question: "What does success look like?",
    why: "52% of projects experience scope creep without a clear success metric.",
    sources: [
      { name: "PMI 2018", initials: "PMI", url: "https://www.pmi.org/learning/library/scope-creep-rising-11308" },
    ] as Source[],
    suggestions: [
      "The team starts the sprint without a single clarifying meeting.",
      "AI tools generate on-target output from the first prompt.",
    ] as const,
  },
  {
    id: "constraints", section: "Constraints",
    question: "What constraints should we consider?",
    why: "Large projects average 45% over budget without explicit constraints.",
    sources: [
      { name: "McKinsey 2012", initials: "MK", url: "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/delivering-large-scale-it-projects-on-time-on-budget-and-on-value" },
    ] as Source[],
    suggestions: [
      "No backend — must work entirely client-side, no login required.",
      "Two-week sprint, team of two, no existing design system.",
    ] as const,
  },
  {
    id: "mvp", section: "MVP",
    question: "What is the smallest version we could build?",
    why: "Small, focused scopes are 10× more likely to succeed than large undefined ones.",
    sources: [
      { name: "Standish 2013", initials: "ST", url: "https://athena.ecs.csus.edu/~buckley/CSc231_files/Standish_2013_Report.pdf" },
    ] as Source[],
    suggestions: [
      "A single form that exports a one-page scope brief as Markdown.",
      "A shared template filled out collaboratively before every sprint.",
    ] as const,
  },
  {
    id: "risk", section: "Risk",
    question: "What could make this project fail?",
    why: "17% of IT projects fail catastrophically due to unaddressed risks.",
    sources: [
      { name: "McKinsey 2012", initials: "MK", url: "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/delivering-large-scale-it-projects-on-time-on-budget-and-on-value" },
    ] as Source[],
    suggestions: [
      "Teams skip the process under deadline pressure.",
      "Stakeholders won't see value until after the sprint ends.",
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
    const msg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
    setTransitionMessage(msg)
    setTimeout(() => {
      setTransitionMessage("")
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep((s) => s + 1)
      } else {
        setAppState("scorecard")
      }
    }, 2400)
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
      {/* Step dots — hidden, replaced by ClaritySymbol progress indicator */}

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

// ─── Clarity Symbol ───────────────────────────────────────────────────────────

function ClaritySymbol({ isBlurring, step = 0 }: { isBlurring: boolean; step?: number }) {
  const r = 6
  const circumference = 2 * Math.PI * r
  const filledSegments = step // 0–5 completed phases
  const dashArray = (filledSegments / 6) * circumference

  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 mt-1.5"
      animate={
        isBlurring
          ? {
              filter: [
                "blur(0px)",
                "blur(3.5px)",
                "blur(0.5px)",
                "blur(3.5px)",
                "blur(0px)",
              ],
              opacity: [1, 0.5, 0.8, 0.5, 1],
            }
          : { filter: "blur(0px)", opacity: 1 }
      }
      transition={
        isBlurring
          ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.4 }
      }
    >
      {/* Track */}
      <circle
        cx="8"
        cy="8"
        r={r}
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-muted-foreground/20"
      />
      {/* Progress arc — starts at top (−90°) */}
      <motion.circle
        cx="8"
        cy="8"
        r={r}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-foreground"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        transform="rotate(-90 8 8)"
        animate={{ strokeDashoffset: circumference - dashArray }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </motion.svg>
  )
}

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
    <div className="flex items-start gap-3 min-h-20">
      <ClaritySymbol isBlurring={false} step={step} />
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
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && answer.trim()) {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [answer, onNext])

  return (
    <div className="flex-1 flex flex-col animate-in fade-in-0 duration-200">
      {/* Question + options area */}
      <div className="flex-1 flex flex-col px-6 pb-24 pt-32">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
        {transitionMessage ? (
          <div className="h-16 flex flex-col justify-start">
            <div className="flex items-start gap-3 animate-in fade-in-0 duration-200">
              <ClaritySymbol isBlurring={true} step={step} />
              <span className="text-sm text-foreground font-mono mt-1.5">
                {transitionMessage}
              </span>
            </div>
          </div>
        ) : (
          <TickerText items={[question, why]} sources={sources} step={step} />
        )}

        <div
          className="flex flex-col divide-y divide-border/50 transition-opacity duration-200 ml-[28px]"
          style={{ opacity: transitionMessage ? 0.15 : 1 }}
        >
          {/* Suggestion 1 */}
          <button
            type="button"
            onClick={() => handleSuggestionClick(suggestions[0])}
            className={cn(
              "w-full text-left py-5 font-medium leading-snug tracking-tight transition-colors duration-150",
              getOptionClass(answer === suggestions[0]),
            )}
            style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)" }}
          >
            {suggestions[0]}
          </button>

          {/* Suggestion 2 */}
          <button
            type="button"
            onClick={() => handleSuggestionClick(suggestions[1])}
            className={cn(
              "w-full text-left py-5 font-medium leading-snug tracking-tight transition-colors duration-150",
              getOptionClass(answer === suggestions[1]),
            )}
            style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)" }}
          >
            {suggestions[1]}
          </button>

          {/* Free text option */}
          <div className="py-5">
            <textarea
              ref={textareaRef}
              value={isSuggestionSelected ? "" : answer}
              onChange={handleTextareaChange}
              onKeyDown={onKeyDown}
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
        className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 pt-3 bg-background"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
      >
        {/* Attribution */}
        <MadeBy />

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
          <Button size="sm" onClick={onNext} disabled={!answer.trim() || !!transitionMessage} aria-label={isLast ? "Finish" : "Next question"}>
            {isLast ? "Finish" : "Next"}
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-end" />
          </Button>
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
          <div className="flex items-start gap-3">
            <ClaritySymbol isBlurring={false} step={strengths.length} />
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1.5">
              Project Clarity
            </p>
          </div>
          <div className="flex flex-col gap-3 ml-[28px]">
          <p className="text-4xl font-semibold tracking-tight">{stage.label}</p>
          {/* Stage track */}
          <div className="flex items-center gap-1 flex-wrap">
            {STAGES.map((s, i) => {
              const isCurrent = s.label === stage.label
              const isPast = s.threshold <= stage.threshold
              return (
                <React.Fragment key={s.label}>
                  <span
                    className={cn(
                      "text-xs font-mono transition-colors duration-300",
                      isCurrent
                        ? "text-foreground font-medium"
                        : isPast
                        ? "text-foreground/40"
                        : "text-foreground/20",
                    )}
                  >
                    {s.label}
                  </span>
                  {i < STAGES.length - 1 && (
                    <span className="text-foreground/15 text-xs font-mono">—</span>
                  )}
                </React.Fragment>
              )
            })}
          </div>
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
          <div className="flex flex-col gap-3 ml-[28px]">
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
          <div className="flex flex-col gap-3 ml-[28px]">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Status
            </p>
            <p className="text-sm text-foreground/60 font-mono">
              All areas defined. Ready for sprint.
            </p>
          </div>
        )}

        {/* About */}
        <div className="flex flex-col gap-3 ml-[28px]">
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
      <div className="fixed bottom-0 left-0 right-0 px-5 pt-4 bg-background flex items-center justify-end gap-2" style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}>
        <Button variant="outline" size="sm" onClick={onCopy} aria-label="Copy markdown">
          <HugeiconsIcon
            icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
            strokeWidth={2}
            data-icon="inline-start"
            className={cn(copied && "text-foreground")}
          />
          {copied ? "Copied" : "Copy Markdown"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
          <HugeiconsIcon icon={RotateClockwiseIcon} strokeWidth={2} data-icon="inline-start" />
          New Sprint
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onDownload} aria-label="Download .md file">
          <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
        </Button>
      </div>
      </div>
    </div>
  )
}
