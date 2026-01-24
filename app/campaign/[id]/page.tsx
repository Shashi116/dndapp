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
    const dmParam = searchParams?.dm === "true";
    setIsDM(dmParam);
    setMounted(true);
  }, [searchParams]);

  useEffect(() => {
    if (!mounted || !ref.current) return;

    const newEngine = new GameEngine(ref.current, params.id, isDM);
    engineRef.current = newEngine;
    setEngine(newEngine);

    newEngine.init();

    return () => {
      newEngine.destroy();
      engineRef.current = null;
      setEngine(null);
    };
  }, [params.id, isDM, mounted]);

  return (
    <div className="w-screen min-h-screen bg-black flex">
      {isDM && <DMToolbar engine={engine} />}

      <main className="flex-1 ml-0" style={{ marginLeft: isDM ? 288 : 0 }}>
        <div
          ref={ref}
          className="w-full h-screen transition-all duration-300"
          style={{ minHeight: "100vh" }}
        />

        <div
          className="fixed bottom-3 right-3 px-3 py-2 bg-black bg-opacity-80 text-xs font-mono rounded z-50"
          style={{ color: isDM ? "#ffff00" : "#00ff00" }}
        >
          {isDM ? "🎮 DM Mode" : "👤 Player Mode"} | {params.id}
        </div>
      </main>
    </div>
  );
}
