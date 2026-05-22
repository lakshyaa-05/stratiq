import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const dir = join(process.cwd(), "data", "runs");
    const files = await readdir(dir).catch(() => []);
    const results = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          const raw = await readFile(join(dir, f), "utf-8");
          return JSON.parse(raw);
        })
    );
    results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
