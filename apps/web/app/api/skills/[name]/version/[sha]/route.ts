import { NextResponse } from "next/server";
import { getSkillAtCommit } from "@/lib/github";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string; sha: string }> }
) {
  try {
    const { name, sha } = await params;
    const skill = await getSkillAtCommit(name, sha);
    return NextResponse.json({ content: skill.raw }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load version";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
