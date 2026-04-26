import { NextResponse } from "next/server";
import { z } from "zod";
import { incrementSkillCopyCount } from "@/lib/kv";

const schema = z.object({
  skill: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const count = await incrementSkillCopyCount(payload.skill);
    return NextResponse.json({ ok: true, count });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
