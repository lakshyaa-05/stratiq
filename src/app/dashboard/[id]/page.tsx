"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnalysisResult } from "@/lib/types";
import { getAnalysis } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try sessionStorage first (just completed analysis)
    const cached = sessionStorage.getItem(`stratiq_result_${id}`);
    if (cached) {
      try {
        setResult(JSON.parse(cached));
        setLoading(false);
        return;
      } catch {}
    }

    // Otherwise fetch from API
    getAnalysis(id)
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #FF4D6D, #FF8C69)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A2E", margin: "0 0 8px" }}>Analysis not found</h2>
          <p style={{ fontSize: 14, color: "#9CA3AF", margin: "0 0 24px" }}>{error || "This analysis may have expired."}</p>
          <button
            onClick={() => router.push("/onboarding")}
            style={{ padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg, #FF4D6D, #FF8C69)", color: "white", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}
          >
            Start New Analysis
          </button>
        </div>
      </div>
    );
  }

  return <DashboardLayout result={result} />;
}
