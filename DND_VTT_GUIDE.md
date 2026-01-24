# 🐉 D&D Virtual Table Top (VTT) - Complete Guide

A full-featured Dungeons & Dragons Virtual Table Top application built with **Next.js**, **Pixi.js**, and **Socket.io** for real-time multiplayer gameplay.

## 🎮 Features

### Core Gameplay

- **Real-time Multiplayer**: Dungeon Master + up to 6 players
- **Token Management**: Drag-and-drop player/NPC tokens with unique colors
- **Fog of War**: Dynamic vision-based fog that reveals as characters move
- **Grid Overlay**: 50px grid for tactical positioning
- **Map System**: Background images with grid overlay support

### Dungeon Master Controls

- **Fog Tools**:
  - Brush tool for custom fog painting
  - Rectangle tool for area reveals
  - Reset fog to clear vision
  - Keyboard shortcuts: `1` = Brush, `2` = Rectangle, `0` = None, `R` = Reset
- **Token Management**: Create, move, and manage all tokens on the board
- **Game State Broadcasting**: Sync all changes to players in real-time
- **Player Tracking**: See connected players and their positions

### Player Features

- **Automated Vision**: See everything within character vision radius
- **Token Movement**: Drag your own token to move
- **Live Updates**: Real-time position updates from DM and other players
- **Read-Only Map**: See the battlefield with fog of war applied

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
cd dndapp
npm install
```

### Running the Application

**Development Mode:**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## 📋 Usage Guide

### For Dungeon Masters

1. **Create Campaign**
   - Go to home page
   - Click "Create Campaign"
   - Share the Campaign ID with players

2. **Launch Campaign**
   - Click "Launch as DM"
   - You'll be the Dungeon Master with full control

3. **Control Fog of War**
   - Use the DM Controls panel (top-right)
   - Or use keyboard shortcuts:
     - **1**: Activate Brush tool
     - **2**: Activate Rectangle tool
     - **0**: Deactivate tool
     - **R**: Reset all fog
4. **Manage Tokens**
   - Drag your DM token around the map
   - Updates automatically broadcast to all players
   - Add more tokens via the UI (feature in development)

### For Players

1. **Join Campaign**
   - Go to home page
   - Click "Join Existing Campaign"
   - Enter the Campaign ID shared by your DM
   - Join as a player

2. **Gameplay**
   - Your token appears on the map
   - Drag your token to move
   - Vision automatically updates as you move
   - All position changes sync in real-time

## 🏗️ Architecture

### Frontend (React/Next.js)

```
/app
  /campaign/[id]/page.tsx    # Campaign canvas & controls
  page.tsx                    # Home page with campaign management

/component
  DMControls.tsx              # DM control panel UI
  DMControls.module.css       # Styling

/engine
  Engine.ts                   # Main game engine orchestrator

  /core
    AppManager.ts             # Pixi.js application setup
    SceneManager.ts           # Layer management

  /input
    DragController.ts         # Token dragging & grid snapping

  /layers
    BackgroundLayer.ts        # Map/background rendering
    GridLayer.ts              # Grid overlay rendering
    fogLayer.ts               # Fog of war rendering

  /tokens
    TokenManager.ts           # Token creation & state management

  /network
    NetworkController.ts      # Socket.io events & game state sync

  /fog
    FogManager.ts             # Vision & fog reveal logic

  /types
    TokenState.ts             # Type definitions
```

### Backend (Express + Socket.io)

**server.ts** handles:

- WebSocket connections
- Campaign room management
- Real-time event broadcasting
- Game state persistence

## 🔌 Network Events

### Client → Server

- `join`: Player/DM joins a campaign
- `token:move`: Token position update
- `fog:update`: Fog reveal areas update
- `game:state`: Full game state sync

### Server → Client

- `token:update`: Token position broadcast
- `fog:update`: Fog update broadcast
- `game:state`: Full game state sync
- `player:joined`: New player connected
- `player:left`: Player disconnected

## 📦 Game State Structure

```typescript
interface TokenState {
  id: string;
  x: number;
  y: number;
  playerId?: string;
  color?: number;
  label?: string;
}

interface GameState {
  tokens: TokenState[];
  fogReveal: Array<{ x: number; y: number; radius: number }>;
  mapUrl?: string;
}
```

## 🎨 Pixi.js Rendering Pipeline

```
Stage (Root Container)
├── BackgroundLayer (Map image)
├── GridLayer (Grid overlay)
├── TokenLayer (Token graphics)
└── FogLayer (Fog of war with mask)
```

## 🛠️ Development

### File Structure

```
engine/
  createApp.ts         # Pixi.js initialization
  Engine.ts            # Main game orchestrator
  TokenLayer.ts        # Legacy token layer

lib/
  socket.ts            # Socket.io client initialization
```

### Key Classes

#### Engine

Main orchestrator that:

- Initializes Pixi.js application
- Sets up all managers (tokens, fog, network)
- Handles DM vs Player initialization
- Manages keyboard shortcuts

#### NetworkController

Handles all socket events:

- Campaign joining
- Token synchronization
- Fog updates
- Player status

#### TokenManager

Manages all tokens:

- Creation with player colors
- Position updates
- Storage of token states
- Multi-player support

#### FogManager

Handles vision & fog:

- Circular vision reveals
- Rectangle reveals
- Tracking revealed areas
- Broadcasting updates

## 🎯 Current Features & Roadmap

### ✅ Completed

- [x] Multi-player support (DM + players)
- [x] Token dragging with grid snapping
- [x] Real-time position sync
- [x] Fog of war rendering
- [x] DM controls panel
- [x] Campaign creation & joining
- [x] Network synchronization
- [x] Player vision radius

### 🚧 In Development

- [ ] Map upload & storage
- [ ] Custom fog painting tools (interactive)
- [ ] NPC token creation from UI
- [ ] Advanced token properties (HP, effects)
- [ ] Dice roller integration
- [ ] Combat turn system
- [ ] Effect overlays (spells, AoE)
- [ ] Save/Load campaigns
- [ ] User authentication

## 🐛 Known Issues & Fixes

### Issue: Tokens not visible

**Solution**: Check that map.jpg is in `/public` directory

### Issue: Network not syncing

**Solution**: Ensure all clients connect to same campaign ID

### Issue: Fog not updating

**Solution**: Make sure you're the DM and fog tool is active

## 📝 Configuration

### Grid Size

Edit `engine/DragController.ts`:

```typescript
const GRID_SIZE = 50; // pixels
```

### Vision Radius

Edit `engine/fog/FogManager.ts`:

```typescript
const VISION_RADIUS = 120; // pixels
```

### Server Port

Edit `server.ts`:

```typescript
httpServer.listen(3000); // Change port here
```

## 🤝 Contributing

Contributions are welcome! Areas needing help:

- Map upload system
- Advanced fog tools
- Performance optimizations
- Mobile support
- Accessibility improvements

## 📚 Dependencies

### Core

- `next`: 14.1.0 - React framework
- `pixi.js`: 8.0.0 - 2D rendering
- `socket.io`: 4.7.5 - WebSocket communication
- `express`: 4.22.1 - Server framework

### Development

- `typescript`: 5.3.3
- `tsx`: 4.7.0 - TypeScript runner

## 📄 License

Open source - feel free to use and modify!

## 🚀 Deployment

### Vercel (Recommended for Next.js)

1. Push to GitHub
2. Connect repository to Vercel
3. Vercel auto-detects Next.js setup
4. Deploy!

### Self-Hosted

```bash
npm run build
npm start
```

Server runs on port 3000 by default.

## 🆘 Troubleshooting

**Port already in use:**

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Build fails:**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Socket connection issues:**
Check browser console for errors. Ensure Socket.io server is running on correct port.

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the architecture documentation
3. Check console logs for errors
4. Verify network connectivity

---

**Enjoy your D&D Virtual Table Top! 🎲**
