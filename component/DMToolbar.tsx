"use client";
"use client";

import Toolbar from "@/component/toolbar/Toolbar";
import { GameEngine } from "@/lib/gameEngine";

export default function DMToolbar({ engine }: { engine: GameEngine | null }) {
  return <Toolbar engine={engine} />;
}
