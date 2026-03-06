"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
    id: "problem",
    section: "Problem",
    question: "What problem are we solving?",
    placeholder: "Users struggle to prioritize feedback across multiple design tools…",
  },
  {
    id: "user",
    section: "User",
    question: "Who is experiencing this problem?",
    placeholder: "Startup product designers working with developers…",
  },
  {
    id: "why-now",
    section: "Why Now",
    question: "Why does this problem matter now?",
    placeholder: "AI tools accelerate development but create workflow chaos…",
  },
  {
    id: "success",
    section: "Success",
    question: "What does success look like?",
    placeholder: "Designers can prioritize feedback in under 5 minutes…",
  },
  {
    id: "constraints",
    section: "Constraints",
    question: "What constraints should we consider?",
    placeholder: "Must integrate with Figma and Slack…",
  },
  {
    id: "mvp",
    section: "MVP",
    question: "What is the smallest version we could build?",
    placeholder: "A simple Figma plugin that groups comments by priority…",
  },
  {
    id: "risk",
    section: "Risk",
    question: "What could make this project fail?",
    placeholder: "Users may prefer existing tools…",
  },
  {
    id: "no-build",
    section: "If Not Built",
    question: "What would happen if we didn't build this?",
    placeholder: "Design teams continue wasting time triaging feedback…",
  },
] as const

type QuestionId = (typeof QUESTIONS)[number]["id"]

type Stage = {
  label: string
  threshold: number
  barColor: string
  badgeVariant: "default" | "secondary" | "destructive" | "outline"
}

const STAGES: Stage[] = [
  { threshold: 0,   label: "Chaos",      barColor: "bg-red-500",     badgeVariant: "destructive" },
  { threshold: 20,  label: "Signal",     barColor: "bg-orange-500",  badgeVariant: "outline" },
  { threshold: 40,  label: "Pattern",    barColor: "bg-yellow-500",  badgeVariant: "outline" },
  { threshold: 60,  label: "Framed",     barColor: "bg-teal-500",    badgeVariant: "secondary" },
  { threshold: 80,  label: "Structured", barColor: "bg-blue-500",    badgeVariant: "secondary" },
  { threshold: 100, label: "Shaped",     barColor: "bg-emerald-500", badgeVariant: "default" },
]

function getClarityStage(progress: number): Stage {
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

const STORAGE_KEY = "clarity-sprint-v1"

export function ClaritySprint() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [showExport, setShowExport] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.answers) setAnswers(data.answers)
        if (typeof data.currentStep === "number") setCurrentStep(data.currentStep)
        if (data.showExport) setShowExport(true)
      }
    } catch {}
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentStep, showExport }))
    } catch {}
  }, [answers, currentStep, showExport])

  React.useEffect(() => {
    if (!showExport) {
      const t = setTimeout(() => textareaRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [currentStep, showExport])

  const answeredCount = QUESTIONS.filter((q) => answers[q.id]?.trim()).length
  const progress = (answeredCount / QUESTIONS.length) * 100
  const stage = getClarityStage(progress)
  const currentQuestion = QUESTIONS[currentStep]
  const currentAnswer = answers[currentQuestion.id] ?? ""

  function handleAnswerChange(value: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  function handleNext() {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setShowExport(true)
    }
  }

  function handleBack() {
    if (showExport) {
      setShowExport(false)
    } else if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }

  function handleReset() {
    setAnswers({})
    setCurrentStep(0)
    setShowExport(false)
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
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
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      handleNext()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-border">
        <span className="text-sm font-semibold tracking-tight">Clarity Sprint</span>
        <div className="flex items-center gap-2">
          <Badge variant={stage.badgeVariant}>
            {stage.label}
          </Badge>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleReset}
            aria-label="Start over"
            title="Start over"
          >
            <HugeiconsIcon icon={RotateClockwiseIcon} strokeWidth={2} />
          </Button>
        </div>
      </header>

      {/* Clarity meter */}
      <div className="px-5 py-2.5 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Clarity: ${stage.label}`}
          >
            <div
              className={cn("h-full rounded-full transition-all duration-500 ease-out", stage.barColor)}
              style={{ width: `${Math.max(progress, 0)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-8 text-right shrink-0">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {showExport ? (
            <ExportView
              answers={answers}
              onCopy={handleCopy}
              onDownload={handleDownload}
              copied={copied}
              onBack={handleBack}
              onReset={handleReset}
            />
          ) : (
            <QuestionView
              key={currentStep}
              question={currentQuestion.question}
              section={currentQuestion.section}
              placeholder={currentQuestion.placeholder}
              step={currentStep}
              total={QUESTIONS.length}
              answer={currentAnswer}
              answers={answers}
              onChange={handleAnswerChange}
              onNext={handleNext}
              onBack={handleBack}
              isLast={currentStep === QUESTIONS.length - 1}
              textareaRef={textareaRef}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>
      </main>
    </div>
  )
}

type QuestionViewProps = {
  question: string
  section: string
  placeholder: string
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
  placeholder,
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
  return (
    <div className="flex flex-col gap-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* Step dots */}
      <div className="flex items-center gap-1.5" aria-label={`Step ${step + 1} of ${total}`}>
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
                  ? "w-4 h-1.5 bg-foreground"
                  : isAnswered
                  ? "w-1.5 h-1.5 bg-foreground/60"
                  : "w-1.5 h-1.5 bg-muted-foreground/30"
              )}
            />
          )
        })}
        <span className="ml-2 text-xs text-muted-foreground">
          {step + 1}&nbsp;/&nbsp;{total}
        </span>
      </div>

      {/* Question */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {section}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight leading-snug">
          {question}
        </h2>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="min-h-36 resize-none text-base leading-relaxed"
        aria-label={question}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={step === 0}
          aria-label="Previous question"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} data-icon="inline-start" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {answer.trim() ? "⌘↵ to continue" : ""}
          </span>
          <Button onClick={onNext} aria-label={isLast ? "Finish and export" : "Next question"}>
            {isLast ? "Finish" : "Continue"}
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  )
}

type ExportViewProps = {
  answers: Record<string, string>
  onCopy: () => void
  onDownload: () => void
  copied: boolean
  onBack: () => void
  onReset: () => void
}

function ExportView({ answers, onCopy, onDownload, copied, onBack, onReset }: ExportViewProps) {
  const answeredCount = QUESTIONS.filter((q) => answers[q.id]?.trim()).length
  const isFullyDefined = answeredCount === QUESTIONS.length

  return (
    <div className="flex flex-col gap-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} className="text-emerald-500 size-5" />
          <h2 className="text-2xl font-semibold tracking-tight">
            {isFullyDefined ? "Your project is Shaped." : "Project Scope Ready"}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {answeredCount} of {QUESTIONS.length} questions answered.{" "}
          {!isFullyDefined && "Go back to fill in the remaining sections."}
        </p>
      </div>

      {/* Markdown preview */}
      <div className="rounded-lg border border-border bg-muted/40 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">project-scope.md</span>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="xs" onClick={onCopy} aria-label="Copy markdown">
              <HugeiconsIcon
                icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
                strokeWidth={2}
                data-icon="inline-start"
                className={cn(copied && "text-emerald-500")}
              />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="ghost" size="xs" onClick={onDownload} aria-label="Download markdown file">
              <HugeiconsIcon icon={Download01Icon} strokeWidth={2} data-icon="inline-start" />
              Download
            </Button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto max-h-80">
          <pre className="text-xs text-foreground/80 font-mono whitespace-pre-wrap break-words leading-relaxed">
            {generateMarkdown(answers)}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} aria-label="Go back to last question">
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} data-icon="inline-start" />
          Back
        </Button>
        <Button variant="outline" onClick={onReset} aria-label="Start a new sprint">
          <HugeiconsIcon icon={RotateClockwiseIcon} strokeWidth={2} data-icon="inline-start" />
          New Sprint
        </Button>
      </div>
    </div>
  )
}
