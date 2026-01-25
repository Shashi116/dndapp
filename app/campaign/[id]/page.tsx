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
  const [mapUrl, setMapUrl] = useState<string>("/map.jpg");
  const [username, setUsername] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(true);

  useEffect(() => {
    const dmParam = searchParams?.dm === "true";
    const map = searchParams?.map ?? "/map.jpg";
    const savedUsername = localStorage.getItem("vtt_username");
    setIsDM(dmParam);
    setMapUrl(map);
    if (savedUsername) {
      setUsername(savedUsername);
      setShowUsernamePrompt(false);
    }
    setMounted(true);
  }, [searchParams]);

  useEffect(() => {
    if (!mounted || !ref.current || !username) return;

    const newEngine = new GameEngine(ref.current, params.id, isDM, username);
    engineRef.current = newEngine;
    setEngine(newEngine);

    newEngine.init(mapUrl);

    return () => {
      newEngine.destroy();
      engineRef.current = null;
      setEngine(null);
    };
  }, [params.id, isDM, mounted, mapUrl, username]);

  const handleUsernameSubmit = () => {
    if (!usernameInput.trim()) return;
    setUsername(usernameInput);
    localStorage.setItem("vtt_username", usernameInput);
    setShowUsernamePrompt(false);
  };

  if (showUsernamePrompt) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="bg-slate-900 p-8 rounded-lg border border-amber-400 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">
            Join Campaign
          </h2>
          <p className="text-slate-300 mb-4">Enter your character name:</p>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUsernameSubmit()}
            placeholder="Character name"
            className="w-full bg-slate-800 px-3 py-2 rounded mb-4 text-white"
            autoFocus
          />
          <button
            onClick={handleUsernameSubmit}
            className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold"
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-black flex">
      {isDM && (
        <DMToolbar engine={engine} onMapChange={(url) => setMapUrl(url)} />
      )}

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
          {isDM ? "🎮 DM Mode" : "👤 Player Mode"} | {username} | {params.id}
        </div>
      </main>
    </div>
  );
}
