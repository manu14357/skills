import { NextResponse } from "next/server";
import { z } from "zod";
import { revertSkillToCommit } from "@/lib/github";

const schema = z.object({
  skillName: z.string().min(1),
  targetCommitSha: z.string().min(7),
  summary: z.string().min(3)
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());

    const result = await revertSkillToCommit({
      skillName: payload.skillName,
      targetCommitSha: payload.targetCommitSha,
      summary: payload.summary
    });

    return NextResponse.json({
      message: "Revert PR created.",
      pullRequestUrl: result.pullRequestUrl,
      pullRequestNumber: result.pullRequestNumber
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create revert PR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
