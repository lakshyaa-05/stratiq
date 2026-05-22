import { AnalysisRequest, AnalysisResult } from "./types";

// All API calls go to Next.js API routes — no separate backend needed
const BASE = "/api";

export async function runAnalysis(data: AnalysisRequest): Promise<AnalysisResult> {
  const res = await fetch(`${BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Analysis failed" }));
    throw new Error(err.error || "Analysis failed");
  }
  return res.json();
}

export async function getAnalysis(id: string): Promise<AnalysisResult> {
  const res = await fetch(`${BASE}/analysis/${id}`);
  if (!res.ok) throw new Error("Analysis not found");
  return res.json();
}

export async function listProjects(): Promise<AnalysisResult[]> {
  const res = await fetch(`${BASE}/projects`);
  if (!res.ok) return [];
  return res.json();
}

export async function chatMessage(analysisId: string, message: string): Promise<string> {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysisId, message }),
  });
  if (!res.ok) throw new Error("Chat failed");
  const data = await res.json();
  return data.reply;
}
