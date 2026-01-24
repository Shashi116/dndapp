# 🎲 How to Launch as Dungeon Master

Your D&D VTT is now running! Here's how to get the full experience:

## ✅ Server is Running

- **URL**: http://localhost:3000
- **Status**: Ready to play!

---

## 🎮 Launch as Dungeon Master

### Option 1: Quick URL

Open this URL in your browser:

```
http://localhost:3000/campaign/test-campaign?dm=true
```

Then share the Campaign ID `test-campaign` with players.

### Option 2: Through Home Page

1. Go to http://localhost:3000
2. Click **"Create Campaign"**
3. You'll get a Campaign ID
4. Click **"Launch as DM"**
5. Share Campaign ID with players

---

## 👥 Join as a Player

Share your Campaign ID with friends:

1. They go to http://localhost:3000
2. Click **"Join Existing Campaign"**
3. Enter your Campaign ID
4. Click "Join Campaign"

---

## 🎯 What You Can Do as DM

### See the Full Environment

- ✅ Map with grid overlay
- ✅ All player tokens
- ✅ Full game board

### Control Fog of War

Press these keys:

- **1** = Paint fog with brush
- **2** = Reveal areas with rectangle
- **0** = Disable tool
- **R** = Reset all fog

### Manage the Game

- Drag your token to show position
- Watch player tokens move
- Monitor connected players
- Control what's visible

---

## 🎨 What Players Can Do

### See the Map

- View the battlefield with fog of war
- See grid for positioning
- Watch other players' tokens

### Move Their Token

- Click and drag their token
- Snap to grid automatically
- Real-time position updates for DM

### Experience Fog of War

- Darkness hides unknown areas
- Vision expands as they move
- DM controls visibility

---

## 🧪 Test Locally (Recommended)

Open **TWO browser tabs**:

**Tab 1 (DM):**

```
http://localhost:3000/campaign/test-campaign?dm=true
```

**Tab 2 (Player):**

```
http://localhost:3000/campaign/test-campaign
```

Now you can:

- DM side: See controls, paint fog, see all tokens
- Player side: See map, move your token, see updates

---

## 🔍 What You Should See

### As DM:

- ✅ Tactical grid map (1200x800)
- ✅ DM Controls panel (top-right)
- ✅ Map Manager panel (top-left)
- ✅ Grid overlay
- ✅ Your DM token (labeled "DM")
- ✅ Any connected player tokens

### As Player:

- ✅ Same map with fog overlay
- ✅ Your token (labeled "You")
- ✅ Player Info panel (bottom-left)
- ✅ Fog reveals as you move
- ✅ Other player tokens

---

## 🐛 Troubleshooting

### No Map Visible?

✅ Fixed! Map file created automatically

### Can't Drag Tokens?

- Make sure you're **launched as DM** for full control
- Players can drag their own token
- Use keyboard shortcuts for fog (1, 2, 0, R)

### No Scenery/Grid?

- Map should be visible now
- If not, refresh browser
- Check browser console (F12) for errors

### Build Error?

✅ Fixed! Configuration updated for Pixi.js

---

## 🚀 Quick Test

1. **Start Server**:

   ```bash
   npm run dev
   ```

2. **Open Two Tabs**:
   - DM: `http://localhost:3000/campaign/test?dm=true`
   - Player: `http://localhost:3000/campaign/test`

3. **Test Features**:
   - DM: Press `1` to paint fog
   - Both: Drag tokens around
   - Watch real-time sync!

---

## 💡 Pro Tips

### Keyboard Shortcuts (DM Only)

- **1** = Brush Tool - Paint fog freely
- **2** = Rectangle Tool - Reveal rectangular areas
- **0** = Disable - Switch back to normal
- **R** = Reset - Clear all fog instantly

### Grid Alignment

- Tokens snap to 50px grid
- Great for tactical positioning
- DM can see exact positions

### Campaign ID Sharing

- Easy to remember: `test`, `campaign1`, etc.
- Share via chat/email/Discord
- Players use it to join

---

## 🎲 You're Ready!

Everything is working:

- ✅ Server running
- ✅ Map loaded
- ✅ Build fixed
- ✅ Ready to play

**Start here**: http://localhost:3000

---

## 📝 Next Steps

1. **Test Local**: Open DM and Player tabs
2. **Test Network**: Use different machines
3. **Customize**: Adjust grid size or vision radius
4. **Deploy**: Put on real server (optional)

---

**Happy DMing! 🐉🎲**
