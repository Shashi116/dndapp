"use client";

import { useState } from "react";
import {
  Crown,
  Shield,
  Sword,
  Map,
  Scroll,
  Flame,
  ChevronRight,
  X,
} from "lucide-react";
import styles from "./page.module.css";

const quickStart = [
  "DM launches first to create the session",
  "Copy the session ID and share with players",
  "Players join using the campaign code",
  "DM controls fog of war, NPCs & items",
  "Players drag tokens to move in real-time",
  "Roll dice — all players see the result",
];

export default function Home() {
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const generateCampaignId = () =>
    `campaign-${Math.random().toString(36).substr(2, 9)}`;

  const handleQuickStart = (isDM: boolean) => {
    const id = generateCampaignId();
    window.location.href = `/campaign/${id}${isDM ? "?dm=true" : ""}`;
  };

  const handleJoinCampaign = () => {
    if (joinCode.trim()) window.location.href = `/campaign/${joinCode.trim()}`;
  };

  return (
    <div className={styles.page}>
      <div className={styles.vignette} />

      <div className={styles.layout}>
        <div className={styles.container}>

          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerIcon}>
              <Flame size={42} strokeWidth={1.5} />
            </div>
            <h1 className={styles.title}>D&amp;D Virtual TableTop</h1>
            <p className={styles.subtitle}>Real-Time Multiplayer Campaign Management</p>
          </header>

          {/* Ornamental divider */}
          <div className={styles.divider}>
            <Sword size={16} strokeWidth={1.5} />
          </div>

          {/* Cards */}
          <div className={styles.cards}>

            {/* DM Card */}
            <div className={`${styles.card} ${styles.cardDM}`}>
              <div className={styles.cardIcon}>
                <span className={styles.cardIconDM}><Crown size={28} strokeWidth={1.5} /></span>
                <h2 className={styles.cardHeadingDM}>Dungeon Master</h2>
              </div>
              <p className={styles.cardText}>
                Command the entire battlefield. Reveal the fog of war, spawn
                enemies, place treasures, and guide your players through
                legendary adventures.
              </p>
              <button
                className={`${styles.btn} ${styles.btnDM}`}
                onClick={() => handleQuickStart(true)}
              >
                <Flame size={16} strokeWidth={2} />
                Launch as DM
              </button>
            </div>

            {/* Player Card */}
            <div className={`${styles.card} ${styles.cardPlayer}`}>
              <div className={styles.cardIcon}>
                <span className={styles.cardIconPlayer}><Shield size={28} strokeWidth={1.5} /></span>
                <h2 className={styles.cardHeadingPlayer}>Player</h2>
              </div>
              <p className={styles.cardText}>
                Join a campaign and forge your legend. Move your token, manage
                your inventory, roll dice, and fight alongside your party.
              </p>
              <button
                className={`${styles.btn} ${styles.btnPlayer}`}
                onClick={() => setShowJoinPopup(true)}
              >
                <Map size={16} strokeWidth={2} />
                Launch as Player
              </button>
            </div>
          </div>

          {/* Parchment Quick Start */}
          <div className={styles.parchment}>
            <div className={styles.parchmentHeader}>
              <Scroll size={18} strokeWidth={1.5} color="#5c3a0a" />
              <span className={styles.parchmentTitle}>Quick Start</span>
            </div>
            <div className={styles.parchmentGrid}>
              {quickStart.map((item, i) => (
                <div key={i} className={styles.parchmentItem}>
                  <ChevronRight size={14} strokeWidth={2.5} className={styles.parchmentBullet} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Join Popup */}
      {showJoinPopup && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h2 className={styles.popupTitle}>
              <Map size={20} strokeWidth={1.5} />
              Enter Campaign Code
            </h2>
            <input
              className={styles.popupInput}
              placeholder="e.g. campaign-abc123"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoinCampaign()}
              autoFocus
            />
            <div className={styles.popupActions}>
              <button
                className={`${styles.btn} ${styles.btnPlayer}`}
                style={{ flex: 1 }}
                onClick={handleJoinCampaign}
              >
                <Shield size={15} strokeWidth={2} />
                Join Campaign
              </button>
              <button
                className={styles.btnCancel}
                onClick={() => setShowJoinPopup(false)}
              >
                <X size={14} strokeWidth={2} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
