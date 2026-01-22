"use client";

import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { Engine } from "@/engine/Engine";

export default function CampaignPage({ params }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const engine = new Engine(ref.current, params.id);
    engineRef.current = engine;

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, [params.id]);

  return <div ref={ref} style={{ width: "100vw", height: "100vh" }} />;
}
