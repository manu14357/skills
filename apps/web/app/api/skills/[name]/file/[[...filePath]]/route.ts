import { NextResponse } from "next/server";
import { getSkillFileContent } from "@/lib/github";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string; filePath?: string[] }> }
) {
  try {
    const { name, filePath } = await params;
    const path = (filePath || []).join("/");
    const content = await getSkillFileContent(name, path);

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
