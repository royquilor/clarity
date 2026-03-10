import Anthropic from "@anthropic-ai/sdk"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextRequest } from "next/server"
import { z } from "zod"

const anthropic = new Anthropic()

const ratelimit = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_KV_REST_API_URL!,
    token: process.env.UPSTASH_REDIS_KV_REST_API_TOKEN!,
  }),
  limiter: Ratelimit.slidingWindow(60, "1 h"),
  prefix: "clarity:reflect",
})

const ReflectSchema = z.object({
  question: z.string().max(200),
  answer: z.string().max(500),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous"
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return new Response("Too many requests.", { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response("Invalid request body.", { status: 400 })
  }

  const parsed = ReflectSchema.safeParse(body)
  if (!parsed.success) {
    return new Response("Invalid input.", { status: 400 })
  }

  const { question, answer } = parsed.data

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 80,
    messages: [
      {
        role: "user",
        content: `You are a sharp product thinking partner. A team is defining their sprint scope.

Question: "${question}"
Their answer: "${answer}"

Write one sentence — a specific, insightful observation about their answer. Not generic advice. Reference what they actually said. No fluff, no filler, no bullet points.`,
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text.trim() : ""
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
