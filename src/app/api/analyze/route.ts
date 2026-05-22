import { NextRequest, NextResponse } from "next/server";
import { runAnalysis } from "@/lib/engine";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessMode, businessName, categories, country, city, website } = body;

    if (!businessName || !categories?.length || !country || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const analysisId = Math.random().toString(36).slice(2, 10);
    const result = await runAnalysis({ analysisId, businessMode: businessMode || "existing", businessName, categories, country, city, website: website || undefined });

    // Persist to data/runs/
    const dir = join(process.cwd(), "data", "runs");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, `${analysisId}.json`), JSON.stringify(result, null, 2));

    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Analyze error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
