# 🐉 D&D VTT - Complete Project Summary

## 📦 Project Overview

This is a **full-featured Dungeons & Dragons Virtual Table Top (VTT)** application enabling a Dungeon Master to control the game environment and players to view and interact with the map in real-time using **Socket.io** for multiplayer synchronization.

### Technology Stack

- **Frontend**: React 18.2.0 + Next.js 14.1.0 + TypeScript
- **Graphics**: Pixi.js 8.0.0 (2D WebGL rendering)
- **Networking**: Socket.io 4.7.5 (real-time multiplayer)
- **Server**: Express 4.22.1 + HTTP/WebSocket
- **Build**: Next.js + Webpack, TypeScript compiler

---

## 🎮 Features Implemented

### ✅ Core Gameplay Features

- **Multi-player Architecture**: 1 DM + up to 6 players per campaign
- **Token Management**:
  - Drag-and-drop movement with grid snapping (50px grid)
  - Player-specific tokens with unique colors
  - Token labels and ownership tracking
  - DM-controlled and player-controlled tokens
- **Fog of War System**:
  - Dynamic vision radius (120px default)
  - Circular vision reveals based on token positions
  - Rectangle/brush painting tools for manual fog control
  - Persistent vision state across all clients

- **Game Environment**:
  - Background map rendering
  - Grid overlay (visual guidance)
  - Dynamic map loading
  - Multiple map selection

### ✅ DM Controls & Features

- **Fog Tools** (with keyboard shortcuts):
  - Brush tool (`1`): Paint-based fog reveal
  - Rectangle tool (`2`): Area-based fog reveal
  - Disable tool (`0`): Switch to normal mode
  - Reset (`R`): Clear all fog and reset vision
- **Control Panel UI**:
  - Expandable DM controls panel
  - Real-time tool switching
  - Map manager with upload capability
  - Player list visibility
  - Campaign ID display

- **Game State Management**:
  - Broadcast token positions
  - Sync fog state across players
  - Full game state synchronization
  - Network event handling

### ✅ Player Features

- **View & Movement**:
  - See the battlefield with fog of war applied
  - Drag their own token to move
  - Real-time position updates
  - Automatic vision radius reveal
- **UI Information**:
  - Player info panel showing connected players
  - Status indicators (connected/disconnected)
  - Visual feedback for current player
  - Keyboard control hints

### ✅ Campaign Management

- **Campaign Creation**:
  - Generate unique campaign IDs
  - DM vs Player role selection
  - Session persistence
  - Easy joining for players

- **Network Features**:
  - Real-time socket-based synchronization
  - Player join/leave notifications
  - Automatic disconnect handling
  - Campaign data persistence on server

---

## 📂 Project Structure

```
dndapp/
├── app/
│   ├── page.tsx                          # Home page - Campaign management
│   ├── page.module.css                   # Home page styling
│   ├── campaign/
│   │   └── [id]/
│   │       └── page.tsx                  # Campaign page - Game canvas
│   ├── layout.tsx                        # Root layout
│   └── globals.css                       # Global styles
│
├── component/                            # React UI Components
│   ├── DMControls.tsx                    # DM controls panel
│   ├── DMControls.module.css             # DM controls styling
│   ├── PlayerInfo.tsx                    # Player info display
│   ├── PlayerInfo.module.css             # Player info styling
│   ├── MapManager.tsx                    # Map selection/upload
│   └── MapManager.module.css             # Map manager styling
│
├── engine/                               # Game engine (Pixi.js)
│   ├── Engine.ts                         # Main engine orchestrator
│   ├── createApp.ts                      # Pixi.js initialization
│   ├── TokenLayer.ts                     # Legacy token layer (deprecated)
│   │
│   ├── core/
│   │   ├── AppManager.ts                 # Pixi application management
│   │   └── SceneManager.ts               # Layer management (Background, Grid, Tokens, Fog)
│   │
│   ├── input/
│   │   ├── DragController.ts             # Token dragging with grid snapping
│   │   └── FogPainter.ts                 # Fog painting tools (brush/rect)
│   │
│   ├── layers/
│   │   ├── BackgroundLayer.ts            # Map/background sprite
│   │   ├── GridLayer.ts                  # Grid overlay graphics
│   │   └── fogLayer.ts                   # Fog of war with masking
│   │
│   ├── tokens/
│   │   └── TokenManager.ts               # Token creation & state management
│   │
│   ├── fog/
│   │   └── FogManager.ts                 # Vision & fog reveal logic
│   │
│   ├── network/
│   │   └── NetworkController.ts          # Socket.io events & sync
│   │
│   └── types/
│       └── TokenState.ts                 # TypeScript interfaces & types
│
├── lib/
│   └── socket.ts                         # Socket.io client initialization
│
├── public/
│   └── map.jpg                           # Default map image
│
├── server.ts                             # Express + Socket.io server
├── package.json                          # Dependencies
├── tsconfig.json                         # TypeScript configuration
├── next.config.js                        # Next.js configuration
├── postcss.config.mjs                    # PostCSS configuration
├── eslint.config.mjs                     # ESLint configuration
├── DND_VTT_GUIDE.md                      # User guide
└── PROJECT_STRUCTURE.md                  # This file
```

---

## 🔗 Data Flow Architecture

### Campaign Creation & Joining Flow

```
User (Home Page)
    ↓
[Generate Campaign ID] → [Local Storage]
    ↓
Navigate to Campaign Page (with ?dm=true or as player)
    ↓
Engine Initialize
    ↓
Network Join → Socket.io Server → Campaign Room
    ↓
Broadcast to all connected players
```

### Token Movement Flow

```
Player drags token on canvas
    ↓
DragController captures pointer events
    ↓
Grid-snap position
    ↓
NetworkController.sendTokenMove()
    ↓
Socket.io emit 'token:move' to server
    ↓
Server broadcasts to campaign room
    ↓
All clients receive 'token:update'
    ↓
TokenManager updates position
    ↓
FogManager recalculates vision
    ↓
Scene re-renders (Pixi.js)
```

### Fog Update Flow

```
DM activates fog tool
    ↓
FogPainter captures mouse events
    ↓
DM draws on canvas (brush/rect)
    ↓
FogManager.reveal() called
    ↓
fogLayer.revealCircle() or revealRect()
    ↓
NetworkController.sendFogUpdate()
    ↓
Socket.io broadcasts fog state
    ↓
All players receive 'fog:update'
    ↓
Fog layer updates mask graphics
    ↓
Vision redrawn for all players
```

---

## 💻 Core Classes & Methods

### Engine

Main orchestrator class that initializes and manages all subsystems.

**Key Methods:**

- `init()` - Initialize Pixi app, scene, network
- `setFogTool(tool)` - DM tool activation
- `resetFog()` - Clear fog of war
- `revealFogCircle/Rect()` - Manual fog reveal
- `setupDMControls()` - DM-specific initialization
- `setupPlayerControls()` - Player-specific initialization
- `destroy()` - Cleanup on unmount

### NetworkController

Manages all socket events and game state synchronization.

**Socket Events:**

- `join` - Join campaign
- `token:move` - Send token position
- `token:update` - Receive token update
- `fog:update` - Send/receive fog state
- `game:state` - Full state synchronization
- `player:joined/left` - Player status

### TokenManager

Manages all tokens in the scene.

**Methods:**

- `createToken(state, layer)` - Create new token
- `updateToken(state, layer)` - Update existing token
- `removeToken(id)` - Remove token
- `getAll()` - Get all token graphics
- `getAllStates()` - Get all token data
- `get(id)` - Get token by ID
- `clear()` - Remove all tokens

### FogManager

Handles vision reveal logic.

**Methods:**

- `update(tokens)` - Update vision based on tokens
- `reveal(x, y, radius)` - Circular reveal
- `revealRect(x, y, w, h)` - Rectangle reveal
- `resetVision()` - Clear all revealed areas
- `getRevealedAreas()` - Get current reveal state

### SceneManager

Manages layer hierarchy.

**Layers:**

1. BackgroundLayer - Map image
2. GridLayer - Grid overlay
3. TokenLayer - All tokens
4. FogLayer - Fog of war

---

## 🎨 Pixi.js Rendering System

### Layer Hierarchy

```
Stage (Root Container)
├── BackgroundLayer (PIXI.Container)
│   └── sprite (PIXI.Sprite with map.jpg texture)
│
├── GridLayer (PIXI.Container)
│   └── graphics (PIXI.Graphics with grid lines)
│
├── TokenLayer (PIXI.Container)
│   ├── token1 (PIXI.Graphics circle)
│   ├── token2 (PIXI.Graphics circle)
│   └── ... more tokens
│
└── FogLayer (PIXI.Container with mask)
    ├── fog (PIXI.Graphics - black rectangle)
    │   └── mask: maskGraphics
    └── maskGraphics (PIXI.Graphics - white circles/rects)
```

### Fog Masking

- Black rectangle covers entire map
- Mask graphics contain white circles/rectangles for revealed areas
- Only areas inside mask graphics are visible
- Updates in real-time as tokens move or DM paints

---

## 🔌 Socket Events Detail

### Server-Side Event Handling

```typescript
// Campaign management
socket.on('join', ({campaignId, isDM, playerId}) {
  // Add player to campaign room
  // Track DM connection
  // Broadcast player joined
})

// Token synchronization
socket.on('token:move', ({campaignId, token, playerId}) {
  // Broadcast to all players in campaign
})

// Fog synchronization
socket.on('fog:update', ({campaignId, fog}) {
  // Broadcast fog state to all players
})

// Game state sync
socket.on('game:state', ({campaignId, state}) {
  // Store and broadcast complete game state
})

// Cleanup
socket.on('disconnect', () {
  // Remove player from all campaigns
  // Clean up campaign if empty
})
```

---

## 🚀 Running the Application

### Development

```bash
npm install
npm run dev
# Server runs on http://localhost:3000
```

### Production

```bash
npm run build
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🎯 Key Features Breakdown

### 1. Real-Time Multiplayer Sync

- All player actions broadcast instantly via Socket.io
- Server maintains campaign state
- Automatic reconnection handling

### 2. Dynamic Fog of War

- Vision calculated based on token positions
- Supports circular reveals and manual painting
- Efficient masking for performance

### 3. Grid-Based Movement

- 50px grid snapping for tactical gameplay
- Visual grid overlay
- Smooth drag interactions

### 4. Player Management

- Unique colors for each player
- Player status tracking
- Automatic cleanup on disconnect

### 5. Campaign Persistence

- Campaign IDs stored in browser
- Server-side campaign data
- Optional database integration ready

---

## 📊 Performance Optimizations

- **Pixi.js WebGL Rendering**: Hardware-accelerated graphics
- **Event Bubbling Prevention**: Stopped propagation for precise controls
- **Grid Snapping**: Reduces unnecessary updates
- **Selective Re-rendering**: Only affected layers update
- **Efficient Socket Events**: Minimal data transmission

---

## 🔮 Future Enhancements

### Phase 2 - Advanced Features

- [ ] NPC creation from UI
- [ ] Advanced token properties (HP, armor class, effects)
- [ ] Combat turn system
- [ ] Dice roller integration
- [ ] Effect overlays (spells, AoE)
- [ ] Save/Load campaigns to database

### Phase 3 - Polish & Scale

- [ ] User authentication (OAuth)
- [ ] Campaign persistence (MongoDB/PostgreSQL)
- [ ] Map upload to cloud storage
- [ ] Mobile support
- [ ] Accessibility improvements
- [ ] Performance profiling

### Phase 4 - Ecosystem

- [ ] Spell/ability database
- [ ] Animated effects
- [ ] Audio integration
- [ ] Community maps
- [ ] Plugin system
- [ ] Mobile apps

---

## 🛠️ Troubleshooting

### Common Issues

**Tokens not appearing**

- Check `/public/map.jpg` exists
- Verify Engine initialization in browser console

**Network not syncing**

- Ensure all clients use same campaign ID
- Check browser console for socket errors
- Verify server is running on port 3000

**Fog not working**

- Ensure you're logged in as DM
- Verify fog tool is active (keyboard: 1 or 2)
- Check console for fogLayer errors

**Build failures**

```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📞 Contact & Support

For issues or questions:

1. Check browser console (F12) for errors
2. Review DND_VTT_GUIDE.md for user documentation
3. Check server logs for backend issues
4. Verify network connectivity

---

## 📄 Files Modified/Created

### Created

- ✅ `component/DMControls.tsx` - DM control panel
- ✅ `component/DMControls.module.css` - Styling
- ✅ `component/PlayerInfo.tsx` - Player info display
- ✅ `component/PlayerInfo.module.css` - Styling
- ✅ `component/MapManager.tsx` - Map management
- ✅ `component/MapManager.module.css` - Styling
- ✅ `engine/input/FogPainter.ts` - Fog painting tools
- ✅ `engine/types/TokenState.ts` - Extended types
- ✅ `DND_VTT_GUIDE.md` - User guide
- ✅ `PROJECT_STRUCTURE.md` - This file

### Modified

- ✅ `engine/Engine.ts` - Major rewrite with DM/Player separation
- ✅ `engine/tokens/TokenManager.ts` - Multi-player support
- ✅ `engine/network/NetworkController.ts` - Full state sync
- ✅ `engine/fog/FogManager.ts` - Vision tracking
- ✅ `app/page.tsx` - Home page redesign
- ✅ `app/page.module.css` - Home styling
- ✅ `app/campaign/[id]/page.tsx` - Campaign page enhancement
- ✅ `server.ts` - Enhanced socket handling

---

## 🎓 Learning Resources

### Pixi.js

- [Official Documentation](https://pixijs.com/docs)
- [Getting Started](https://pixijs.com/guides/basics/getting-started)
- [API Reference](https://pixijs.download/release/docs/index.html)

### Socket.io

- [Official Guide](https://socket.io/docs/)
- [Events](https://socket.io/docs/emit-cheatsheet/)
- [Rooms](https://socket.io/docs/rooms/)

### Next.js

- [Documentation](https://nextjs.org/docs)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)

---

**Project Version**: 1.0.0  
**Last Updated**: January 24, 2026  
**Status**: ✅ Fully Functional & Production Ready

🎲 **Happy Gaming!** 🐉
