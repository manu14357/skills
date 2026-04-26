import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrUpdateSkillPullRequest } from "@/lib/github";
import { enforceRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  skillName: z.string().min(1),
  description: z.string().min(1),
  category: z.string().optional(),
  agents: z.array(z.string()).optional(),
  body: z.string().min(1),
  author: z.string().optional(),
  summary: z.string().min(1),
  forkedFrom: z.string().optional()
});

function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());

    const limit = await enforceRateLimit(getIp(request), "edit");
    if (!limit.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded for edits." }, { status: 429 });
    }

    const result = await createOrUpdateSkillPullRequest({
      mode: "edit",
      skillName: payload.skillName,
      description: payload.description,
      category: payload.category,
      agents: payload.agents,
      body: payload.body,
      author: payload.author,
      summary: payload.summary,
      forkedFrom: payload.forkedFrom
    });

    return NextResponse.json({
      message: "Your skill edit PR is open.",
      pullRequestUrl: result.pullRequestUrl,
      pullRequestNumber: result.pullRequestNumber,
      branch: result.branch
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit edit";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
