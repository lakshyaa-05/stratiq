import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { runChat } from "@/lib/engine";

export async function POST(req: NextRequest) {
  try {
    const { analysisId, message } = await req.json();
    const file = join(process.cwd(), "data", "runs", `${analysisId}.json`);
    const analysis = JSON.parse(await readFile(file, "utf-8"));
    const reply = await runChat(analysis, message);
    return NextResponse.json({ reply });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
