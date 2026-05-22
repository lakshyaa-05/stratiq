"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { chatMessage } from "@/lib/api";
import { C, G, S } from "@/lib/design";

interface Message { role: "user" | "assistant"; content: string; }

interface Props { analysisId: string; businessName: string; onClose: () => void; }

export default function AIChat({ analysisId, businessName, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hi! I'm your Stratiq AI assistant. I've analyzed ${businessName}'s market. Ask me anything about your competitors, strategy, or opportunities!` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const reply = await chatMessage(analysisId, userMsg);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't connect right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      style={{
        position: "fixed", bottom: 96, right: 24, zIndex: 50,
        width: 380, height: 520,
        background: "white",
        borderRadius: 24,
        border: `1px solid ${C.border}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: `1px solid ${C.border}`, background: "linear-gradient(135deg, #FFF5F7, white)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 11, background: G.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={16} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Stratiq AI</div>
          <div style={{ fontSize: 11, color: C.soft, display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
            Analyzing {businessName}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ width: 32, height: 32, borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = C.bg; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <X size={16} color={C.soft} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontSize: 13, lineHeight: 1.55,
                background: msg.role === "user" ? C.coral : C.bg,
                color: msg.role === "user" ? "white" : C.ink,
                border: msg.role === "user" ? "none" : `1px solid ${C.border}`,
              }}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "10px 16px", borderRadius: "16px 16px 16px 4px", background: C.bg, border: `1px solid ${C.border}`, display: "flex", gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  style={{ width: 7, height: 7, borderRadius: "50%", background: C.coral }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask about your market..."
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 12, background: C.bg,
              border: `1px solid ${C.border}`, fontSize: 13, color: C.ink, outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.coral; }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.border; }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            style={{
              width: 42, height: 42, borderRadius: 12, background: G.coral, border: "none",
              cursor: !input.trim() || loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: !input.trim() || loading ? 0.4 : 1,
              boxShadow: S.btn, transition: "all 0.15s",
            }}
          >
            <Send size={16} color="white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
