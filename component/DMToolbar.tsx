"use client";
"use client";

import Toolbar from "@/component/toolbar/Toolbar";
import { GameEngine } from "@/lib/gameEngine";

export default function DMToolbar({
  engine,
  onMapChange,
}: {
  engine: GameEngine | null;
  onMapChange?: (url: string) => void;
}) {
  return <Toolbar engine={engine} onMapChange={onMapChange} />;
}
