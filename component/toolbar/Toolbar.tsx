"use client";

import { useEffect, useState } from "react";
import { GameEngine } from "@/lib/gameEngine";

export function Toolbar({
  engine,
  onMapChange,
}: {
  engine: GameEngine | null;
  onMapChange?: (url: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<"NPC" | "ITEM">("NPC");
  const [color, setColor] = useState("#ffd700");
  const [x, setX] = useState<number>(300);
  const [y, setY] = useState<number>(300);
  const [icon, setIcon] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>("/map.jpg");
  const presetMaps = [
    { url: "/map.jpg", label: "Map" },
    { url: "/map1.jpg", label: "Map 1" },
    { url: "/map2.jpg", label: "Map 2" },
    { url: "/map3.jpg", label: "Map 3" },
  ];
  const presetIcons = [
    "/icons/sword.svg",
    "/icons/potion.svg",
    "/icons/skull.svg",
  ];

  useEffect(() => {
    const onSelect = (e: Event) => {
      // @ts-ignore - CustomEvent
      const id = (e as CustomEvent)?.detail?.tokenId as string | undefined;
      if (id) setSelected(id);
    };
    window.addEventListener("token:selected", onSelect as EventListener);
    return () =>
      window.removeEventListener("token:selected", onSelect as EventListener);
  }, []);

  if (!engine) {
    return (
      <aside className="w-72 bg-slate-900 text-slate-100 p-4 border-r border-slate-700">
        <div className="text-center py-8">
          <p className="text-amber-400 font-bold">Initializing DM Tools…</p>
        </div>
      </aside>
    );
  }

  const setTool = (tool: "BRUSH" | "RECT" | "NONE") => {
    engine.setFogTool(tool);
  };

  const resetFog = () => engine.resetFog();

  const spawn = () => {
    const sx = Math.max(0, Math.round(x));
    const sy = Math.max(0, Math.round(y));
    if (type === "NPC") {
      engine.spawnNPC(name || "Monster", sx, sy, color, icon ?? undefined);
    } else {
      engine.spawnItem(name || "Item", sx, sy, icon ?? undefined);
    }
    setName("");
  };

  const removeSelected = () => {
    if (!selected) return;
    engine.deleteToken(selected);
    setSelected(null);
  };

  return (
    <aside className="w-72 bg-slate-900 text-slate-100 p-4 border-r border-slate-700 h-screen fixed left-0 top-0 z-40">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-amber-400">DM Console</h2>
        <p className="text-xs text-slate-400">Controls and tools</p>
      </div>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-cyan-300 mb-2">🗺️ Map</h3>
        <div className="space-y-2 text-sm">
          <select
            value={selectedMap}
            onChange={(e) => {
              const url = e.target.value;
              setSelectedMap(url);
              onMapChange?.(url);
              engine.setBackground(url);
            }}
            className="w-full bg-slate-800 px-2 py-1 rounded"
          >
            {presetMaps.map((m) => (
              <option key={m.url} value={m.url}>
                {m.label}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/jpeg,image/jpg"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = reader.result as string;
                setSelectedMap(dataUrl);
                onMapChange?.(dataUrl);
                engine.setBackground(dataUrl);
              };
              reader.readAsDataURL(f);
            }}
            className="w-full bg-slate-800 px-2 py-1 rounded text-xs"
            placeholder="Upload JPG map"
          />
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-purple-300 mb-2">Fog</h3>
        <div className="space-y-2">
          <button
            onClick={() => setTool("BRUSH")}
            className="w-full px-3 py-2 rounded bg-green-600 text-white text-sm"
          >
            🖌️ Brush
          </button>
          <button
            onClick={() => setTool("RECT")}
            className="w-full px-3 py-2 rounded bg-green-600 text-white text-sm"
          >
            📦 Rectangle
          </button>
          <button
            onClick={() => setTool("NONE")}
            className="w-full px-3 py-2 rounded bg-slate-700 text-sm"
          >
            ❌ Disable
          </button>
          <button
            onClick={resetFog}
            className="w-full px-3 py-2 rounded bg-red-600 text-white text-sm mt-2"
          >
            🔴 Reset Fog
          </button>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">Shortcuts</h3>
        <div className="text-xs text-slate-300 space-y-2">
          <div className="flex justify-between">
            <span>Brush</span>
            <kbd className="bg-slate-700 px-2 rounded">1</kbd>
          </div>
          <div className="flex justify-between">
            <span>Rectangle</span>
            <kbd className="bg-slate-700 px-2 rounded">2</kbd>
          </div>
          <div className="flex justify-between">
            <span>Disable</span>
            <kbd className="bg-slate-700 px-2 rounded">0</kbd>
          </div>
          <div className="flex justify-between">
            <span>Reset Fog</span>
            <kbd className="bg-slate-700 px-2 rounded">R</kbd>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-amber-300 mb-2">Spawn</h3>
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="flex-1 bg-slate-800 px-2 py-1 rounded"
            >
              <option value="NPC">NPC</option>
              <option value="ITEM">Item</option>
            </select>
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              type="color"
              title="Icon color"
              className="w-12 h-8 p-0 bg-slate-800 rounded"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-xs text-slate-300">Icon:</label>
            <select
              value={icon ?? ""}
              onChange={(e) => setIcon(e.target.value || null)}
              className="flex-1 bg-slate-800 px-2 py-1 rounded"
            >
              <option value="">(none)</option>
              {presetIcons.map((p) => (
                <option key={p} value={p}>
                  {p.split("/").pop()}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-2">
            <input
              type="file"
              accept="image/svg+xml,image/png"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setIcon(reader.result as string);
                };
                reader.readAsDataURL(f);
              }}
              className="w-full bg-slate-800 px-2 py-1 rounded text-xs"
            />
          </div>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-800 px-2 py-1 rounded"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
              className="w-1/2 bg-slate-800 px-2 py-1 rounded"
              placeholder="x"
            />
            <input
              type="number"
              value={y}
              onChange={(e) => setY(Number(e.target.value))}
              className="w-1/2 bg-slate-800 px-2 py-1 rounded"
              placeholder="y"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={spawn}
              className="flex-1 px-3 py-2 bg-green-600 rounded text-white"
            >
              ➕ Spawn
            </button>
            <button
              onClick={() => {
                setName("");
                setX(300);
                setY(300);
              }}
              className="px-3 py-2 bg-slate-700 rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-red-300 mb-2">Selected</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <div>
            Selected ID:{" "}
            <span className="font-mono text-xs">{selected ?? "—"}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={removeSelected}
              disabled={!selected}
              className="flex-1 px-3 py-2 bg-red-600 text-white rounded disabled:opacity-50"
            >
              🗑️ Delete
            </button>
            <button
              onClick={() => setSelected(null)}
              className="px-3 py-2 bg-slate-700 rounded"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Tip: click a token on the map to select it.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-indigo-300 mb-2">Guide</h3>
        <p className="text-xs text-slate-300">
          Paint the map to reveal areas to players.
        </p>
        <p className="text-xs text-slate-300">
          Drag tokens to move them (DM can move any token).
        </p>
      </section>
    </aside>
  );
}

export default Toolbar;
//   Drag tokens to move them (DM can move any token).
