import Anthropic from "@anthropic-ai/sdk"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextRequest } from "next/server"

const anthropic = new Anthropic()

const ratelimit = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_KV_REST_API_URL!,
    token: process.env.UPSTASH_REDIS_KV_REST_API_TOKEN!,
  }),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  prefix: "clarity:analyze",
})

const ALLOWED_KEYS = ["problem", "user", "success", "constraints", "mvp", "risk"] as const
const MAX_ANSWER_LENGTH = 500

const QUESTION_LABELS: Record<string, string> = {
  problem: "Problem",
  user: "User",
  success: "Success",
  constraints: "Constraints",
  mvp: "MVP",
  risk: "Risk",
}

export async function POST(req: NextRequest) {
  // Rate limiting by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous"
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return new Response("Too many requests. Please try again later.", { status: 429 })
  }

  // Input validation
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response("Invalid request body.", { status: 400 })
  }

  if (!body || typeof body !== "object" || !("answers" in body) || typeof (body as Record<string, unknown>).answers !== "object") {
    return new Response("Invalid answers format.", { status: 400 })
  }

  const rawAnswers = (body as { answers: Record<string, unknown> }).answers

  // Only allow known keys, sanitize values
  const answers: Record<string, string> = {}
  for (const key of ALLOWED_KEYS) {
    const val = rawAnswers[key]
    if (typeof val === "string" && val.trim()) {
      answers[key] = val.trim().slice(0, MAX_ANSWER_LENGTH)
    }
  }

  if (Object.keys(answers).length === 0) {
    return new Response("No valid answers provided.", { status: 400 })
  }

  const answered = ALLOWED_KEYS.filter((k) => answers[k])
  const unanswered = ALLOWED_KEYS.filter((k) => !answers[k])

  const answerBlock = answered
    .map((k) => `${QUESTION_LABELS[k]}: ${answers[k]}`)
    .join("\n")

  const gapsBlock =
    unanswered.length > 0
      ? `\nNot yet defined: ${unanswered.map((k) => QUESTION_LABELS[k]).join(", ")}`
      : ""

  const prompt = `You are a product clarity advisor reviewing a team's sprint readiness brief.

Here are their answers:

${answerBlock}${gapsBlock}

Write a short, direct analysis of the overall project clarity in 2-3 sentences. Be specific — reference their actual answers, not generic advice. Highlight the strongest part and the most important gap. Do not use bullet points, headers, or markdown. Plain prose only.`

  const stream = await anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
