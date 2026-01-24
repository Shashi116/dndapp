"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [campaignId, setCampaignId] = useState("");

  const generateCampaignId = () => {
    return `campaign-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleQuickStart = (isDM: boolean) => {
    const id = generateCampaignId();
    const url = `/campaign/${id}${isDM ? "?dm=true" : ""}`;
    window.location.href = url;
  };

  return (
    <div className="w-screen h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-600 mb-4">
            🐉 D&D Virtual TableTop
          </h1>
          <p className="text-lg text-slate-300">
            Real-time multiplayer campaign management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* DM Mode */}
          <div className="bg-linear-to-br from-slate-800 to-slate-700 p-8 rounded-2xl border-2 border-purple-600/50 shadow-xl hover:border-purple-400 transition">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">
              👑 Dungeon Master
            </h2>
            <p className="text-slate-300 mb-6">
              Control the entire battlefield. Manage fog of war, spawn enemies,
              place treasures, and guide your players through epic adventures.
            </p>
            <button
              onClick={() => handleQuickStart(true)}
              className="w-full px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-lg border-2 border-purple-500 shadow-lg hover:shadow-purple-600/50 transition-all"
            >
              Launch as DM
            </button>
          </div>

          {/* Player Mode */}
          <div className="bg-linear-to-br from-slate-800 to-slate-700 p-8 rounded-2xl border-2 border-cyan-600/50 shadow-xl hover:border-cyan-400 transition">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">👤 Player</h2>
            <p className="text-slate-300 mb-6">
              Join a campaign and guide your character through the adventure.
              Move your token, manage your inventory, and work with your party.
            </p>
            <button
              onClick={() => handleQuickStart(false)}
              className="w-full px-6 py-3 bg-linear-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-lg border-2 border-cyan-500 shadow-lg hover:shadow-cyan-600/50 transition-all"
            >
              Launch as Player
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-slate-300 text-sm">
          <h3 className="text-amber-400 font-bold mb-2">Quick Start:</h3>
          <ul className="space-y-2">
            <li>✓ DM launches first to create the session</li>
            <li>✓ Copy the session ID and share with players</li>
            <li>✓ Players join with the same ID</li>
            <li>✓ DM controls fog, NPCs, and items</li>
            <li>✓ Players move their characters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
