import { NextResponse } from "next/server";
import { getSkillFolderStructure } from "@/lib/github";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const { searchParams } = new URL(request.url);
    const folderPath = searchParams.get("path") || "";
    
    const files = await getSkillFolderStructure(name, folderPath);

    return NextResponse.json(files, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
