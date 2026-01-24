#!/bin/bash

# 🐉 D&D VTT - COMPLETION VERIFICATION CHECKLIST

echo "════════════════════════════════════════════════════════════════"
echo "🐉  D&D VIRTUAL TABLE TOP - IMPLEMENTATION VERIFICATION"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

passed=0
failed=0

check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((passed++))
    else
        echo -e "${RED}❌${NC} $1"
        ((failed++))
    fi
}

echo "CORE FILES VERIFICATION"
echo "─────────────────────────────────────────────────────────────────"

# Check core files exist
test -f "engine/Engine.ts" && check "✓ Engine.ts exists" || check "✗ Engine.ts missing"
test -f "engine/tokens/TokenManager.ts" && check "✓ TokenManager.ts exists" || check "✗ TokenManager.ts missing"
test -f "engine/network/NetworkController.ts" && check "✓ NetworkController.ts exists" || check "✗ NetworkController.ts missing"
test -f "engine/fog/FogManager.ts" && check "✓ FogManager.ts exists" || check "✗ FogManager.ts missing"
test -f "engine/input/FogPainter.ts" && check "✓ FogPainter.ts exists" || check "✗ FogPainter.ts missing"

echo ""
echo "UI COMPONENTS VERIFICATION"
echo "─────────────────────────────────────────────────────────────────"

test -f "component/DMControls.tsx" && check "✓ DMControls.tsx exists" || check "✗ DMControls.tsx missing"
test -f "component/PlayerInfo.tsx" && check "✓ PlayerInfo.tsx exists" || check "✗ PlayerInfo.tsx missing"
test -f "component/MapManager.tsx" && check "✓ MapManager.tsx exists" || check "✗ MapManager.tsx missing"

echo ""
echo "STYLING VERIFICATION"
echo "─────────────────────────────────────────────────────────────────"

test -f "component/DMControls.module.css" && check "✓ DMControls CSS exists" || check "✗ DMControls CSS missing"
test -f "component/PlayerInfo.module.css" && check "✓ PlayerInfo CSS exists" || check "✗ PlayerInfo CSS missing"
test -f "component/MapManager.module.css" && check "✓ MapManager CSS exists" || check "✗ MapManager CSS missing"

echo ""
echo "DOCUMENTATION VERIFICATION"
echo "─────────────────────────────────────────────────────────────────"

test -f "README.md" && check "✓ README.md exists" || check "✗ README.md missing"
test -f "DND_VTT_GUIDE.md" && check "✓ DND_VTT_GUIDE.md exists" || check "✗ DND_VTT_GUIDE.md missing"
test -f "PROJECT_STRUCTURE.md" && check "✓ PROJECT_STRUCTURE.md exists" || check "✗ PROJECT_STRUCTURE.md missing"
test -f "IMPLEMENTATION_COMPLETE.md" && check "✓ IMPLEMENTATION_COMPLETE.md exists" || check "✗ IMPLEMENTATION_COMPLETE.md missing"
test -f "COMPLETION_SUMMARY.md" && check "✓ COMPLETION_SUMMARY.md exists" || check "✗ COMPLETION_SUMMARY.md missing"

echo ""
echo "CONFIGURATION VERIFICATION"
echo "─────────────────────────────────────────────────────────────────"

test -f "package.json" && check "✓ package.json exists" || check "✗ package.json missing"
test -f "tsconfig.json" && check "✓ tsconfig.json exists" || check "✗ tsconfig.json missing"
test -f "next.config.js" && check "✓ next.config.js exists" || check "✗ next.config.js missing"
test -f "server.ts" && check "✓ server.ts exists" || check "✗ server.ts missing"

echo ""
echo "BUILD VERIFICATION"
echo "─────────────────────────────────────────────────────────────────"

# Check if can compile
npm run build > /tmp/build.log 2>&1
if grep -q "✓ Compiled successfully\|Finalizing page" /tmp/build.log; then
    check "✓ TypeScript compilation successful"
else
    check "✗ TypeScript compilation failed"
fi

echo ""
echo "NODE MODULES VERIFICATION"
echo "─────────────────────────────────────────────────────────────────"

test -d "node_modules/pixi.js" && check "✓ Pixi.js installed" || check "✗ Pixi.js not installed"
test -d "node_modules/socket.io" && check "✓ Socket.io installed" || check "✗ Socket.io not installed"
test -d "node_modules/next" && check "✓ Next.js installed" || check "✗ Next.js not installed"
test -d "node_modules/react" && check "✓ React installed" || check "✗ React not installed"
test -d "node_modules/express" && check "✓ Express installed" || check "✗ Express not installed"

echo ""
echo "FEATURE VERIFICATION"
echo "─────────────────────────────────────────────────────────────────"

# Check key features in code
grep -q "setFogTool" engine/Engine.ts && check "✓ Fog tool functionality" || check "✗ Fog tool missing"
grep -q "NetworkController" engine/Engine.ts && check "✓ Network integration" || check "✗ Network missing"
grep -q "TokenManager" engine/Engine.ts && check "✓ Token management" || check "✗ Token management missing"
grep -q "socket.emit\|socket.on" engine/network/NetworkController.ts && check "✓ Socket events" || check "✗ Socket events missing"
grep -q "FogManager" engine/Engine.ts && check "✓ Fog system" || check "✗ Fog system missing"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "FINAL RESULTS"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Passed: $passed${NC}"
echo -e "${RED}❌ Failed: $failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED!${NC}"
    echo ""
    echo "Your D&D VTT is ready to go!"
    echo ""
    echo "To get started:"
    echo "  1. npm run dev"
    echo "  2. Open http://localhost:3000"
    echo "  3. Create or join a campaign"
    echo "  4. Start playing! 🎲"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  SOME CHECKS FAILED${NC}"
    echo ""
    echo "Please review the failures above and fix them."
    echo ""
    exit 1
fi
