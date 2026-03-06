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
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const QUESTIONS = [
  {
    id: "problem", section: "Problem",
    question: "What problem are we solving?",
    why: "37% of project failures trace back to unclear requirements.",
    examples: [
      "Designers are feeling drained with AI",
      "Teams start sprints without a clear brief",
      "Scope keeps shifting mid-project",
    ],
  },
  {
    id: "user", section: "User",
    question: "Who is experiencing this problem?",
    why: "Missing stakeholder groups drive up to 85% of rework costs.",
    examples: [
      "Product designers at early-stage startups",
      "Founders building their first product",
      "Small dev teams without a dedicated PM",
    ],
  },
  {
    id: "why-now", section: "Why Now",
    question: "Why does this problem matter now?",
    why: "47% of missed goals trace to misaligned requirements — knowing the trigger prevents drift.",
    examples: [
      "AI tools ship faster but problems stay undefined",
      "Remote teams struggle to align on scope",
      "Funding depends on shipping something meaningful",
    ],
  },
  {
    id: "success", section: "Success",
    question: "What does success look like?",
    why: "Without a clear success metric, 52% of projects experience uncontrolled scope changes.",
    examples: [
      "Teams start sprints with a clear shared brief",
      "Less back-and-forth during design review",
      "AI tools generate relevant output on the first prompt",
    ],
  },
  {
    id: "constraints", section: "Constraints",
    question: "What constraints should we consider?",
    why: "Large projects average 45% over budget when constraints aren't made explicit upfront.",
    examples: [
      "Must work without a login or account",
      "No budget for a backend — client-side only",
      "Needs to run in a browser, no installs",
    ],
  },
  {
    id: "mvp", section: "MVP",
    question: "What is the smallest version we could build?",
    why: "Small, focused scopes are 10× more likely to succeed than large undefined ones.",
    examples: [
      "A single-page form that exports a markdown brief",
      "A Figma plugin that captures meeting notes",
      "A shared doc template the team fills in together",
    ],
  },
  {
    id: "risk", section: "Risk",
    question: "What could make this project fail?",
    why: "17% of IT projects become black swans that can threaten a company's existence.",
    examples: [
      "Teams may skip it under time pressure",
      "Stakeholders won't see value until after the sprint",
      "Too many questions makes it feel like busywork",
    ],
  },
  {
    id: "no-build", section: "If Not Built",
    question: "What would happen if we didn't build this?",
    why: "Catching problems in the brief is 100× cheaper than fixing them after launch.",
    examples: [
      "Teams keep starting sprints blind",
      "AI tools keep generating the wrong solutions",
      "Design effort gets wasted on undefined problems",
    ],
  },
] as const

type QuestionId = (typeof QUESTIONS)[number]["id"]

const STAGES = [
  { threshold: 0,   label: "Chaos",      barColor: "bg-red-400",     why: "37% of project failures trace back to unclear requirements." },
  { threshold: 20,  label: "Signal",     barColor: "bg-orange-400",  why: "47% of missed goals trace to misaligned requirements." },
  { threshold: 40,  label: "Pattern",    barColor: "bg-yellow-500",  why: "50% of features shipped are rarely or never used." },
  { threshold: 60,  label: "Framed",     barColor: "bg-teal-500",    why: "52% of projects experience uncontrolled scope changes." },
  { threshold: 80,  label: "Structured", barColor: "bg-blue-500",    why: "Small, focused projects are 10× more likely to succeed." },
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

function getSprintReadiness(progress: number) {
  if (progress === 100) return "Ready for Sprint"
  if (progress >= 80)   return "Almost Ready"
  if (progress >= 60)   return "Getting There"
  return "Needs More Work"
}

const STORAGE_KEY = "clarity-sprint-v1"
type AppState = "questions" | "scorecard"

export function ClaritySprint() {
  const [appState, setAppState] = React.useState<AppState>("questions")
  const [currentStep, setCurrentStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [copied, setCopied] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

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

  function handleReset() {
    setAnswers({})
    setCurrentStep(0)
    setAppState("questions")
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  function handleNext() {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setAppState("scorecard")
    }
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
      {/* Top strip */}
      <div className="px-6 pt-6">
        <p className="text-xs text-muted-foreground">
          {appState === "questions" ? QUESTIONS[currentStep].why : stage.why}
        </p>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {appState === "questions" && (
          <QuestionView
            key={currentStep}
            question={QUESTIONS[currentStep].question}
            section={QUESTIONS[currentStep].section}
            examples={QUESTIONS[currentStep].examples}
            step={currentStep}
            total={QUESTIONS.length}
            answer={answers[QUESTIONS[currentStep].id] ?? ""}
            answers={answers}
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
          />
        )}
      </div>
    </div>
  )
}

// ─── Animated Example ─────────────────────────────────────────────────────────

function AnimatedExample({
  examples,
  onExampleChange,
}: {
  examples: readonly string[]
  onExampleChange?: (example: string) => void
}) {
  const [index, setIndex] = React.useState(0)
  const [visible, setVisible] = React.useState(true)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  React.useEffect(() => {
    onExampleChange?.(examples[index])
  }, [index, examples, onExampleChange])

  React.useEffect(() => {
    if (examples.length <= 1 || reduceMotion) return
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % examples.length)
        setVisible(true)
      }, 400)
    }, 3500)
    return () => clearInterval(timer)
  }, [examples.length, reduceMotion])

  return (
    <span
      style={{
        display: "block",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: reduceMotion ? "none" : "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {examples[index]}
    </span>
  )
}

// ─── Question View ────────────────────────────────────────────────────────────

type QuestionViewProps = {
  question: string
  section: string
  examples: readonly string[]
  step: number
  total: number
  answer: string
  answers: Record<string, string>
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  isLast: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

function QuestionView({
  question,
  section,
  examples,
  step,
  total,
  answer,
  answers,
  onChange,
  onNext,
  onBack,
  isLast,
  textareaRef,
  onKeyDown,
}: QuestionViewProps) {
  const currentExampleRef = React.useRef<string>(examples[0])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab" && !answer) {
      e.preventDefault()
      onChange(currentExampleRef.current)
    } else {
      onKeyDown(e)
    }
  }

  return (
    <div className="flex-1 flex flex-col animate-in fade-in-0 duration-200">
      {/* Question + answer area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 gap-6">
        <div className="w-full max-w-lg flex flex-col gap-6">
          <p className="text-sm text-muted-foreground text-center">{question}</p>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              rows={3}
              className={cn(
                "relative z-10 w-full bg-transparent border-none outline-none resize-none",
                "text-3xl font-medium leading-snug tracking-tight text-center",
                "touch-manipulation",
              )}
              style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
              aria-label={question}
            />
            {!answer && (
              <div
                className="absolute top-0 left-0 w-full pointer-events-none text-foreground/25 text-3xl font-medium leading-snug tracking-tight text-center"
                style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
                aria-hidden="true"
              >
                <AnimatedExample
                  examples={examples}
                  onExampleChange={(ex) => { currentExampleRef.current = ex }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 pt-3 bg-background"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
      >
        {/* Step dots */}
        <div className="flex items-center gap-1" aria-label={`Step ${step + 1} of ${total}`}>
          {Array.from({ length: total }).map((_, i) => {
            const q = QUESTIONS[i]
            const isAnswered = !!answers[q.id]?.trim()
            const isCurrent = i === step
            return (
              <div
                key={i}
                className={cn(
                  "rounded-full transition-all duration-300",
                  isCurrent
                    ? "w-3 h-1.5 bg-foreground"
                    : isAnswered
                    ? "w-1.5 h-1.5 bg-foreground/50"
                    : "w-1.5 h-1.5 bg-foreground/15",
                )}
              />
            )
          })}
        </div>

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
          <Button size="sm" onClick={onNext} aria-label={isLast ? "Finish" : "Next question"}>
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
}

function ScorecardView({
  answers,
  progress,
  stage,
  onReset,
  onCopy,
  onDownload,
  copied,
}: ScorecardViewProps) {
  const readiness = getSprintReadiness(progress)
  const isReady = progress === 100

  return (
    <div className="flex-1 flex flex-col animate-in fade-in-0 duration-200">
      <div className="flex-1 flex flex-col px-6 pt-8 pb-4 gap-8 max-w-lg">
        {/* Score */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Clarity Score
          </p>
          <p className="text-6xl font-semibold tabular-nums tracking-tight">
            {Math.round(progress)}%
          </p>
          <div className="flex items-center gap-2 mt-1">
            {isReady && (
              <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} className="text-emerald-500 size-4" />
            )}
            <p className="text-sm text-muted-foreground">{readiness}</p>
          </div>
        </div>


        {/* Section checklist */}
        <ul className="flex flex-col gap-3" aria-label="Section completion">
          {QUESTIONS.map((q) => {
            const answered = !!answers[q.id]?.trim()
            return (
              <li key={q.id} className="flex items-center gap-3">
                <span
                  className={cn(
                    "size-4 shrink-0",
                    answered ? "text-emerald-500" : "text-foreground/20",
                  )}
                  aria-hidden="true"
                >
                  {answered ? (
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4" />
                  ) : (
                    <svg viewBox="0 0 16 16" fill="none" className="size-4">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    answered ? "text-foreground" : "text-foreground/30 line-through",
                  )}
                >
                  {q.section}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Export + actions */}
      <div className="px-5 pb-6 pt-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCopy} aria-label="Copy markdown">
            <HugeiconsIcon
              icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
              strokeWidth={2}
              data-icon="inline-start"
              className={cn(copied && "text-emerald-500")}
            />
            {copied ? "Copied" : "Copy Markdown"}
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload} aria-label="Download .md file">
            <HugeiconsIcon icon={Download01Icon} strokeWidth={2} data-icon="inline-start" />
            Download
          </Button>
        </div>
        <div className="flex items-center justify-end">
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
            <HugeiconsIcon icon={RotateClockwiseIcon} strokeWidth={2} data-icon="inline-start" />
            New Sprint
          </Button>
        </div>
      </div>
    </div>
  )
}
