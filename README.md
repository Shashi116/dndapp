<p align="center">
  <h1 align="center">🐉 D&D Virtual Tabletop (VTT)</h1>
</p>

<p align="center">
  <strong>A fast, lightweight, real-time Virtual Tabletop for Dungeons & Dragons</strong><br/>
  Built for Dungeon Masters and players who want instant, synced gameplay.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Real--Time-Multiplayer-blue" />
  <img src="https://img.shields.io/badge/Fog%20of%20War-DM%20Controlled-purple" />
  <img src="https://img.shields.io/badge/Canvas-Konva-orange" />
  <img src="https://img.shields.io/badge/Framework-Next.js-black" />
  <img src="https://img.shields.io/badge/Networking-Socket.io-green" />
</p>

<p align="center">━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

## 🎥 Quick Demo

<p align="center">
  <img src="https://raw.githubusercontent.com/GreenImp/rpg-dice-roller/master/resources/dice-roller.gif" width="200" alt="Dice Rolling Animation" />
</p>

**DM Controls:**

- 1 = Fog Brush Tool
- 2 = Rectangle Reveal
- 0 = Disable Tool
- R = Reset Fog

**Player Controls:**

- Drag token to move
- See fog of war updates in real-time

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation & Run

Step 1: npm install
Step 2: npm run dev

🌐 Open http://localhost:3000 in your browser

---

## 📋 Features

- ✅ **Real-time multiplayer:** Supports 1 DM + 6 players simultaneously.
- ✅ **Animated Dice:** Visual dice rolling feedback for all players.
- ✅ **Token Management:** Drag-and-drop mechanics with real-time sync.
- ✅ **Dynamic Fog of War:** DM-controlled visibility tools (Brush & Rectangle).
- ✅ **Tactical Grid:** Built-in overlay for precise combat movement.
- ✅ **Asset Support:** Upload custom SVGs or use local icon presets.

---

## 🛠️ Technical Overview

- **Frontend:** Next.js + React.
- **Rendering:** Konva (HTML5 Canvas) for high-performance map and token rendering.
- **Networking:** Socket.io for instant data synchronization.
- **Animation:** CSS/SVG transitions for dice and UI interactions.

### 🎨 Adding Icons

To add your own preset icons, place SVG or PNG files in the public/icons/ directory. They will automatically appear in the preset list within the DM Spawn panel.

---

## 🎲 Development Notes

The project uses a dedicated server.ts to handle the Socket.io logic. Ensure your environment variables are configured if deploying to a production server to allow WebSocket handshakes.

**Happy Mapping!**
