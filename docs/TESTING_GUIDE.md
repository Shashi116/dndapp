# Quick Test Guide

## Prerequisites

```bash
npm install  # Install all dependencies
```

## Starting the Dev Server

```bash
npm run dev
```

The server should start on `http://localhost:3000`

---

## Test 1: Username Persistence (Solo Test)

**Setup:**

1. Open `http://localhost:3000/campaign/test-campaign` in a browser
2. As DM: `http://localhost:3000/campaign/test-campaign?dm=true`

**Test Steps:**

1. You see a **username prompt modal** asking to "Enter your character name"
2. Type a username like "Alice" and click "Join"
3. See the campaign load with Konva canvas and toolbar
4. Check footer (bottom-right) shows `👤 Player Mode | Alice | test-campaign`
5. **Refresh the page** (F5 or Cmd+R)
6. ✅ **Expected:** Username prompt does NOT appear, campaign loads directly
7. ✅ **Verify:** Footer still shows `👤 Player Mode | Alice | test-campaign`

**Verification:**

- [ ] Username prompt appears on first load
- [ ] Username is persisted in localStorage
- [ ] Page refresh skips prompt
- [ ] Same username shows in footer after refresh

---

## Test 2: Token Icon Support (Solo Test)

**Setup:**

1. Open campaign as DM: `http://localhost:3000/campaign/test-campaign?dm=true`
2. You should see the DM toolbar on the left

**Test Steps:**

1. Look for **"Icons"** section in toolbar (below NPCs/Items spawn fields)
2. Click icon dropdown → should show options:
   - "No Icon"
   - "/icons/sword.svg"
   - "/icons/potion.svg"
   - "/icons/skull.svg"
3. Select "sword.svg"
4. Enter NPC name (e.g., "Guard") and click "Spawn NPC"
5. ✅ **Expected:** Token appears on canvas with sword icon (not colored circle)
6. Select no icon, spawn another NPC
7. ✅ **Expected:** Token appears with colored circle (fallback)
8. Try **"Upload Icon"** file input
9. Select a local SVG or PNG file
10. ✅ **Expected:** Icon preview shows in toolbar

**Verification:**

- [ ] Preset icon dropdown works
- [ ] Icon selection shows 4 options
- [ ] Spawned token with icon renders icon image
- [ ] Token without icon renders colored circle
- [ ] File upload input accepts SVG/PNG

---

## Test 3: Map Selection (Solo Test)

**Setup:**

1. Open campaign as DM: `http://localhost:3000/campaign/test-campaign?dm=true`
2. Look for **"🗺️ Map"** section at top of toolbar

**Test Steps:**

1. Click map dropdown → should show:
   - "Map" (/map.jpg)
   - "Map 1" (/map1.jpg)
   - "Map 2" (/map2.jpg)
   - "Map 3" (/map3.jpg)
2. Select "Map 1" → ✅ Canvas background changes to map1.jpg
3. Select "Map 2" → ✅ Canvas background changes to map2.jpg
4. Try **"Upload JPG"** file input
5. Select a local JPG file → ✅ Canvas background changes to uploaded image
6. Refresh page → ✅ Map selection persists (stays on last selected map)

**Verification:**

- [ ] Map dropdown shows 4 preset options
- [ ] Selecting map updates canvas background
- [ ] File upload accepts JPG/JPEG
- [ ] Uploaded map displays on canvas
- [ ] Map selection persists across refresh

---

## Test 4: Real-Time Map Sync (Multi-Client Test) ⭐ CRITICAL

**Setup - Open TWO browser windows/tabs:**

**Window A (DM):**

1. Open `http://localhost:3000/campaign/test-campaign?dm=true`
2. Enter username "DM_Master" → Join
3. See 🎮 DM Mode in footer

**Window B (Player):**

1. Open `http://localhost:3000/campaign/test-campaign` (NO ?dm=true)
2. Enter username "Player_Alice" → Join
3. See 👤 Player Mode in footer

**Test Steps:**

1. **Initial State Check:**
   - Window A (DM): See toolbar on left, canvas on right
   - Window B (Player): See full canvas (no toolbar)
   - Both should see same map (Map.jpg by default)

2. **DM Changes Map via Dropdown:**
   - Window A: Click map dropdown, select "Map 1"
   - Window A: ✅ Canvas updates to map1.jpg
   - Window B: ✅ Canvas SHOULD update to map1.jpg IN REAL-TIME (NO refresh needed!)

3. **DM Uploads Custom Map:**
   - Window A: Upload a JPG file
   - Window A: ✅ Canvas shows uploaded map
   - Window B: ✅ Canvas SHOULD show uploaded map IN REAL-TIME (NO refresh needed!)

4. **DM Changes Map Again:**
   - Window A: Select "Map 2"
   - Window A: Canvas updates to map2.jpg
   - Window B: ✅ Canvas SHOULD sync to map2.jpg immediately

**Verification (CRITICAL):**

- [ ] Both clients start on same map
- [ ] DM changes map via dropdown
- [ ] Player's map updates in real-time (without refresh)
- [ ] DM uploads custom JPG
- [ ] Player sees custom map immediately
- [ ] Map changes continue to sync across multiple changes
- [ ] Player's map matches DM's map at all times

**If Test 4 Fails:**

1. Check browser console (F12) for errors
2. Check server terminal for "Map changed in campaign" messages
3. Verify Socket.io connection shows in Network tab (WS)
4. Check that `map:change` events are logged in server

---

## Test 5: Player Persistence (Multi-Session Test)

**Setup:**

1. Open campaign as Player: `http://localhost:3000/campaign/test-campaign`
2. Enter username "Archer" and Join
3. Check footer shows `👤 Player Mode | Archer`

**Test Steps:**

1. Close the browser tab completely (or navigate away)
2. Wait a few seconds
3. Open `http://localhost:3000/campaign/test-campaign` in new tab
4. ✅ **Expected:** Username prompt does NOT appear
5. ✅ **Expected:** Campaign loads directly with "Archer" in footer
6. Open campaign in a DIFFERENT tab/window
7. ✅ **Expected:** Username prompt DOES appear (new session, different localStorage? or same?)

**Verification:**

- [ ] Username persists across tab close/reopen
- [ ] New tab shows username prompt (or saved username based on design)
- [ ] Returning player has consistent playerId
- [ ] No "duplicate player" issues

---

## Troubleshooting

### Username Prompt Not Appearing

- **Issue:** Page loads without prompt
- **Solution:**
  1. Clear localStorage: Open DevTools → Application → localStorage → delete `vtt_username`
  2. Reload page

### Map Not Changing on Other Clients

- **Issue:** Player sees outdated map
- **Solution:**
  1. Check server logs for `Map changed in campaign` message
  2. Check browser console for `map:change` event logs
  3. Verify Socket.io connection (Network → WS should show connection)
  4. Restart dev server: `npm run dev`

### Icons Not Rendering

- **Issue:** Tokens show as circles instead of icons
- **Solution:**
  1. Check DevTools → Network tab for 404 on `/icons/sword.svg`
  2. Verify files exist: `public/icons/sword.svg`, etc.
  3. Check that icon URL is correct: `/icons/sword.svg` not `icons/sword.svg`

### TypeScript Errors on Compile

- **Issue:** Build fails with TS errors
- **Solution:**
  1. Run `npm run build` to see full error list
  2. Check error message for file and line number
  3. Verify all imports are correct

### Socket.io Connection Issues

- **Issue:** Real-time sync not working
- **Solution:**
  1. Check that `server.ts` has map:change handler
  2. Verify socket.ts is importing correctly: `require("@/lib/socket")`
  3. Look for "connection refused" in console
  4. Try restarting both dev server and trying different port

---

## Success Criteria

✅ **All tests pass** if:

1. Username prompt appears once, then persists
2. Icons render correctly for tokens
3. Map dropdown and upload work
4. Map changes sync in real-time to all connected clients
5. No TypeScript errors on compile
6. No JavaScript errors in browser console
7. Socket.io events appear in server logs

🎉 **If all pass:** Implementation is complete and ready for production!

---

## Run Commands Reference

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check only (no build)
npx tsc --noEmit

# Clear node_modules and reinstall
rm -rf node_modules && npm install
```
