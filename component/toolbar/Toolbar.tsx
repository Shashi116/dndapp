"use client";

import { useEffect, useState } from "react";
import { GameEngine } from "@/lib/gameEngine";
import {
  Eye, Square, Ban, RotateCcw,
  Plus, Trash2, RefreshCw, Paintbrush,
} from "lucide-react";
import styles from "./Toolbar.module.css";

const presetIcons = ["/icons/sword.svg", "/icons/potion.svg", "/icons/skull.svg"];

export function Toolbar({ engine }: { engine: GameEngine | null }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<"NPC" | "ITEM">("NPC");
  const [color, setColor] = useState("#ffd700");
  const [x, setX] = useState(300);
  const [y, setY] = useState(300);
  const [icon, setIcon] = useState<string | null>(null);

  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent)?.detail?.tokenId as string | undefined;
      if (id) setSelected(id);
    };
    window.addEventListener("token:selected", onSelect as EventListener);
    return () => window.removeEventListener("token:selected", onSelect as EventListener);
  }, []);

  if (!engine) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.loading}>Initializing DM Tools…</div>
      </aside>
    );
  }

  const spawn = () => {
    const sx = Math.max(0, Math.round(x));
    const sy = Math.max(0, Math.round(y));
    if (type === "NPC") engine.spawnNPC(name || "Monster", sx, sy, color, icon ?? undefined);
    else engine.spawnItem(name || "Item", sx, sy, icon ?? undefined);
    setName("");
  };

  return (
    <aside className={styles.sidebar}>

      {/* Header */}
      <div>
        <div className={`${styles.sectionTitle} ${styles.titleDM}`}>⚔ DM Console</div>
        <div className={styles.titleSub}>Controls and tools</div>
      </div>

      <hr className={styles.divider} />

      {/* Fog */}
      <section>
        <div className={`${styles.sectionTitle} ${styles.titleFog}`}>Fog of War</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <button className={`${styles.btn} ${styles.btnGreen}`} onClick={() => engine.setFogTool("BRUSH")}>
            <Paintbrush size={13} /> Brush
          </button>
          <button className={`${styles.btn} ${styles.btnGreen}`} onClick={() => engine.setFogTool("RECT")}>
            <Square size={13} /> Rectangle
          </button>
          <button className={`${styles.btn} ${styles.btnSlate}`} onClick={() => engine.setFogTool("NONE")}>
            <Ban size={13} /> Disable
          </button>
          <button className={`${styles.btn} ${styles.btnRed}`} onClick={() => engine.resetFog()}>
            <RotateCcw size={13} /> Reset Fog
          </button>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* Shortcuts */}
      <section>
        <div className={`${styles.sectionTitle} ${styles.titleShort}`}>Shortcuts</div>
        {[["Brush", "1"], ["Rectangle", "2"], ["Disable", "0"], ["Reset Fog", "R"]].map(([label, key]) => (
          <div key={key} className={styles.shortcutRow}>
            <span>{label}</span><span className={styles.kbd}>{key}</span>
          </div>
        ))}
      </section>

      <hr className={styles.divider} />

      {/* Spawn */}
      <section>
        <div className={`${styles.sectionTitle} ${styles.titleSpawn}`}>Spawn Token</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div className={styles.formRow}>
            <select className={styles.select} value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="NPC">NPC</option>
              <option value="ITEM">Item</option>
            </select>
            <input type="color" className={styles.colorPicker} value={color} onChange={(e) => setColor(e.target.value)} title="Icon color" />
          </div>
          <div className={styles.formRow}>
            <span className={styles.label}>Icon:</span>
            <select className={styles.select} value={icon ?? ""} onChange={(e) => setIcon(e.target.value || null)}>
              <option value="">(none)</option>
              {presetIcons.map((p) => <option key={p} value={p}>{p.split("/").pop()}</option>)}
            </select>
          </div>
          <input
            type="file" accept="image/svg+xml,image/png"
            className={styles.fileInput}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => setIcon(reader.result as string);
              reader.readAsDataURL(f);
            }}
          />
          <input className={styles.input} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className={styles.formRow}>
            <input type="number" className={`${styles.input} ${styles.halfInput}`} value={x} onChange={(e) => setX(Number(e.target.value))} placeholder="x" />
            <input type="number" className={`${styles.input} ${styles.halfInput}`} value={y} onChange={(e) => setY(Number(e.target.value))} placeholder="y" />
          </div>
          <div className={styles.btnRow}>
            <button className={`${styles.btn} ${styles.btnGreen}`} onClick={spawn}><Plus size={13} /> Spawn</button>
            <button className={`${styles.btn} ${styles.btnSlate}`} onClick={() => { setName(""); setX(300); setY(300); }}><RefreshCw size={13} /> Reset</button>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* Selected */}
      <section>
        <div className={`${styles.sectionTitle} ${styles.titleSel}`}>Selected Token</div>
        <div className={styles.selectedId}>{selected ?? "— none —"}</div>
        <div className={styles.btnRow} style={{ marginTop: "0.5rem" }}>
          <button className={`${styles.btn} ${styles.btnDanger}`} disabled={!selected} onClick={() => { engine.deleteToken(selected!); setSelected(null); }}>
            <Trash2 size={13} /> Delete
          </button>
          <button className={`${styles.btn} ${styles.btnSlate}`} onClick={() => setSelected(null)}>Clear</button>
        </div>
        <p className={styles.guideText} style={{ marginTop: "0.4rem" }}>Click a token on the map to select it.</p>
      </section>

      <hr className={styles.divider} />

      {/* Guide */}
      <section>
        <div className={`${styles.sectionTitle} ${styles.titleGuide}`}>Guide</div>
        <p className={styles.guideText}>Paint the map to reveal areas to players.</p>
        <p className={styles.guideText}>Drag tokens to move them (DM can move any token).</p>
      </section>

    </aside>
  );
}

export default Toolbar;
