"use client";

import { useEffect, useRef, useState } from "react";
import { GameEngine } from "@/lib/gameEngine";
import DMToolbar from "@/component/DMToolbar";

export default function CampaignPage({ params, searchParams }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [isDM, setIsDM] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [engine, setEngine] = useState<GameEngine | null>(null);

  useEffect(() => {
    setIsDM(searchParams?.dm === "true");
    setMounted(true);
  }, [searchParams]);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    const newEngine = new GameEngine(ref.current, params.id, isDM);
    engineRef.current = newEngine;
    setEngine(newEngine);
    newEngine.init();
    return () => { newEngine.destroy(); engineRef.current = null; setEngine(null); };
  }, [params.id, isDM, mounted]);

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "#000", display: "flex" }}>
      {isDM && <DMToolbar engine={engine} />}

      <main style={{ flex: 1, marginLeft: isDM ? 288 : 0 }}>
        <div ref={ref} style={{ width: "100%", height: "100vh" }} />

        <div style={{
          position: "fixed", bottom: 12, right: 12,
          padding: "6px 12px",
          background: "rgba(0,0,0,0.82)",
          color: isDM ? "#facc15" : "#4ade80",
          fontSize: "0.75rem",
          fontFamily: "monospace",
          borderRadius: 4,
          zIndex: 50,
          border: `1px solid ${isDM ? "#854d0e" : "#166534"}`,
        }}>
          {isDM ? "⚔ DM Mode" : "🛡 Player Mode"} | {params.id}
        </div>
      </main>
    </div>
  );
}
