import Konva from "konva";

export interface Token {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
  playerId: string;
  icon?: string; // optional URL or data URL for token icon (SVG/PNG)
}

export interface FogArea {
  x: number;
  y: number;
  radius: number;
}

export class KonvaMap {
  stage!: Konva.Stage;
  backgroundLayer!: Konva.Layer;
  tokenLayer!: Konva.Layer;
  fogLayer?: Konva.Layer;
  tokens = new Map<string, Konva.Group>();

  constructor(
    container: string | HTMLDivElement,
    width: number = 1200,
    height: number = 800,
  ) {
    const containerId =
      typeof container === "string" ? container : "konva-container";

    // If HTMLElement, ensure it has an id
    if (typeof container !== "string" && !container.id) {
      container.id = containerId;
    }

    this.stage = new Konva.Stage({
      container: containerId,
      width,
      height,
    });

    // Layer 1: Background
    this.backgroundLayer = new Konva.Layer();
    this.stage.add(this.backgroundLayer);

    // Layer 2: Tokens (on top of background)
    this.tokenLayer = new Konva.Layer();
    this.stage.add(this.tokenLayer);
  }

  addBackground(imageSrc: string) {
    const image = new Image();
    image.onload = () => {
      const konvaImage = new Konva.Image({
        image,
        x: 0,
        y: 0,
        width: this.stage.width(),
        height: this.stage.height(),
      });
      this.backgroundLayer.add(konvaImage);
      this.backgroundLayer.draw();
    };
    image.onerror = () => {
      // Fallback to a solid color
      const rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.stage.width(),
        height: this.stage.height(),
        fill: "#2a2a2a",
      });
      this.backgroundLayer.add(rect);
      this.backgroundLayer.draw();
    };
    image.src = imageSrc;
  }

  replaceBackground(imageSrc: string) {
    // Clear existing background
    this.backgroundLayer.destroyChildren();
    // Add new background
    this.addBackground(imageSrc);
  }

  addToken(token: Token, onDrag?: (updated: Token) => void, isDM?: boolean) {
    const group = new Konva.Group({
      x: token.x,
      y: token.y,
      draggable: !!onDrag,
      dragBoundFunc: (pos) => ({
        x: Math.round(pos.x / 50) * 50,
        y: Math.round(pos.y / 50) * 50,
      }),
    });

    // Render icon image if provided, otherwise fallback to colored circle
    if (token.icon) {
      const img = new Image();
      img.onload = () => {
        const kImg = new Konva.Image({
          image: img,
          x: -25,
          y: -25,
          width: 50,
          height: 50,
        });
        group.add(kImg);
        // add label below icon
        const text = new Konva.Text({
          text: token.label,
          fontSize: 12,
          fontFamily: "Arial",
          fill: "#ffffff",
          align: "center",
          verticalAlign: "middle",
          offsetX: 0,
          offsetY: 6,
          width: 50,
          y: 28,
        });
        group.add(text);
        this.tokenLayer.draw();
      };
      img.onerror = () => {
        // fallback to circle if image fails
        const circle = new Konva.Circle({
          radius: 25,
          fill: token.color,
          stroke: isDM ? "#ffffff" : "#cccccc",
          strokeWidth: isDM ? 3 : 2,
          shadowColor: "black",
          shadowBlur: 10,
          shadowOpacity: 0.5,
        });
        const text = new Konva.Text({
          text: token.label,
          fontSize: 12,
          fontFamily: "Arial",
          fill: "#ffffff",
          align: "center",
          verticalAlign: "middle",
          offsetX: 0,
          offsetY: 6,
          width: 50,
          fontStyle: "bold",
        });
        group.add(circle);
        group.add(text);
        this.tokenLayer.draw();
      };
      img.src = token.icon;
    } else {
      const circle = new Konva.Circle({
        radius: 25,
        fill: token.color,
        stroke: isDM ? "#ffffff" : "#cccccc",
        strokeWidth: isDM ? 3 : 2,
        shadowColor: "black",
        shadowBlur: 10,
        shadowOpacity: 0.5,
      });

      const text = new Konva.Text({
        text: token.label,
        fontSize: 12,
        fontFamily: "Arial",
        fill: "#ffffff",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 6,
        width: 50,
        fontStyle: "bold",
      });

      group.add(circle);
      group.add(text);
    }

    // Emit a global event when a token is clicked so UI can react (select/delete)
    group.on("click", () => {
      try {
        window.dispatchEvent(
          new CustomEvent("token:selected", { detail: { tokenId: token.id } }),
        );
      } catch (e) {
        // In non-browser contexts, ignore
      }
    });

    if (onDrag) {
      group.on("dragmove", () => {
        this.tokenLayer.draw();
        if (onDrag) {
          onDrag({
            ...token,
            x: Math.round(group.x() / 50) * 50,
            y: Math.round(group.y() / 50) * 50,
          });
        }
      });
    }

    this.tokenLayer.add(group);
    this.tokens.set(token.id, group);
    this.tokenLayer.draw();
  }

  updateToken(tokenId: string, x: number, y: number) {
    const group = this.tokens.get(tokenId);
    if (group) {
      group.x(x);
      group.y(y);
      this.tokenLayer.draw();
    }
  }

  removeToken(tokenId: string) {
    const group = this.tokens.get(tokenId);
    if (group) {
      group.destroy();
      this.tokens.delete(tokenId);
      this.tokenLayer.draw();
    }
  }

  getFogLayer() {
    if (!this.fogLayer) {
      this.fogLayer = new Konva.Layer();
      // Add fog layer and ensure token layer remains on top so tokens
      // are interactive even when fog is present.
      this.stage.add(this.fogLayer);
      try {
        this.tokenLayer.moveToTop();
      } catch (e) {
        /* ignore if tokenLayer not yet initialized */
      }
    }
    return this.fogLayer;
  }

  destroy() {
    this.stage.destroy();
  }
}
