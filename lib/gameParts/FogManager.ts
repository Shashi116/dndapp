import Konva from "konva";
import { KonvaMap } from "@/lib/konvaMap";
import { socket } from "@/lib/socket";

export class FogManager {
  map: KonvaMap;
  campaignId: string;
  isDM: boolean;
  fogLayer?: Konva.Layer;
  fogCanvas?: HTMLCanvasElement;
  fogContext?: CanvasRenderingContext2D;
  fogImage?: Konva.Image;
  fogTool: "BRUSH" | "RECT" | "NONE" = "NONE";
  brushMode = false;
  brushStartX = 0;
  brushStartY = 0;
  drawingShape?: Konva.Shape;
  stageWidth = 1200;
  stageHeight = 800;

  constructor(map: KonvaMap, campaignId: string, isDM: boolean) {
    this.map = map;
    this.campaignId = campaignId;
    this.isDM = isDM;
  }

  initFogLayer() {
    this.fogLayer = this.map.getFogLayer();

    this.stageWidth = this.map.stage.width();
    this.stageHeight = this.map.stage.height();

    this.fogCanvas = document.createElement("canvas");
    this.fogCanvas.width = this.stageWidth;
    this.fogCanvas.height = this.stageHeight;
    this.fogContext = this.fogCanvas.getContext("2d") || undefined;

    if (this.fogContext) {
      this.fogContext.fillStyle = "#000";
      this.fogContext.globalAlpha = 0.7;
      this.fogContext.fillRect(0, 0, this.stageWidth, this.stageHeight);
    }

    const konvaImage = new Image();
    konvaImage.onload = () => {
      this.fogImage = new Konva.Image({
        image: konvaImage,
        x: 0,
        y: 0,
        width: this.stageWidth,
        height: this.stageHeight,
        listening: false,
      });
      this.fogLayer!.add(this.fogImage);
      try {
        this.map.tokenLayer.moveToTop();
      } catch (e) {}
      this.map.stage.draw();
    };
    konvaImage.src = this.fogCanvas.toDataURL();
  }

  setFogTool(tool: "BRUSH" | "RECT" | "NONE") {
    this.fogTool = tool;
  }

  setupFogTools() {
    if (!this.isDM) return;

    this.map.stage.on("pointerdown", (e: any) => {
      if (this.fogTool === "NONE") return;

      this.brushMode = true;
      const pos = this.map.stage.getPointerPosition();
      if (pos) {
        this.brushStartX = pos.x;
        this.brushStartY = pos.y;

        if (this.fogTool === "BRUSH") {
          this.brushReveal(pos.x, pos.y, 30);
        } else if (this.fogTool === "RECT") {
          if (this.drawingShape) this.drawingShape.destroy();
          this.drawingShape = new Konva.Rect({
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            fill: "rgba(0, 255, 0, 0.2)",
            stroke: "#00ff00",
            strokeWidth: 2,
          });
          this.fogLayer?.add(this.drawingShape);
        }
      }
    });

    this.map.stage.on("pointermove", (e: any) => {
      if (!this.brushMode || this.fogTool === "NONE") return;
      const pos = this.map.stage.getPointerPosition();
      if (pos) {
        if (this.fogTool === "BRUSH") {
          this.brushReveal(pos.x, pos.y, 30);
        } else if (this.fogTool === "RECT" && this.drawingShape) {
          const width = pos.x - this.brushStartX;
          const height = pos.y - this.brushStartY;
          this.drawingShape.width(width);
          this.drawingShape.height(height);
          if (width < 0) this.drawingShape.x(pos.x);
          else this.drawingShape.x(this.brushStartX);
          if (height < 0) this.drawingShape.y(pos.y);
          else this.drawingShape.y(this.brushStartY);
          this.map.stage.draw();
        }
      }
    });

    this.map.stage.on("pointerup", () => {
      if (this.fogTool === "RECT" && this.drawingShape) {
        const width = Math.abs(this.drawingShape.width());
        const height = Math.abs(this.drawingShape.height());
        const x = Math.min(this.drawingShape.x(), this.brushStartX);
        const y = Math.min(this.drawingShape.y(), this.brushStartY);
        if (width > 0 && height > 0) this.rectangleReveal(x, y, width, height);
        this.drawingShape.destroy();
        this.drawingShape = undefined;
      }
      this.brushMode = false;
    });

    if (this.fogLayer) {
      this.fogLayer.on("pointerupoutside", () => {
        if (this.drawingShape) {
          this.drawingShape.destroy();
          this.drawingShape = undefined;
        }
        this.brushMode = false;
      });
    }
  }

  private brushReveal(x: number, y: number, radius: number) {
    if (!this.fogCanvas || !this.fogContext || !this.fogImage) return;
    this.fogContext.globalCompositeOperation = "destination-out";
    this.fogContext.fillStyle = "rgba(0,0,0,1)";
    this.fogContext.beginPath();
    this.fogContext.arc(x, y, radius, 0, Math.PI * 2);
    this.fogContext.fill();
    this.fogContext.globalCompositeOperation = "source-over";

    const konvaImage = new Image();
    konvaImage.onload = () => {
      this.fogImage!.image(konvaImage);
      this.map.stage.draw();
    };
    konvaImage.src = this.fogCanvas.toDataURL();

    socket.emit("fog:brush", {
      campaignId: this.campaignId,
      x,
      y,
      radius,
    });
  }

  private rectangleReveal(x: number, y: number, width: number, height: number) {
    if (!this.fogCanvas || !this.fogContext || !this.fogImage) return;
    this.fogContext.globalCompositeOperation = "destination-out";
    this.fogContext.fillStyle = "rgba(0,0,0,1)";
    this.fogContext.fillRect(x, y, width, height);
    this.fogContext.globalCompositeOperation = "source-over";

    const konvaImage = new Image();
    konvaImage.onload = () => {
      this.fogImage!.image(konvaImage);
      this.map.stage.draw();
    };
    konvaImage.src = this.fogCanvas.toDataURL();

    socket.emit("fog:rect", {
      campaignId: this.campaignId,
      x,
      y,
      width,
      height,
    });
  }

  setupSocketListeners() {
    socket.on("fog:brush", (data: any) => {
      if (!this.fogCanvas || !this.fogContext || !this.fogImage) return;
      this.fogContext.globalCompositeOperation = "destination-out";
      this.fogContext.fillStyle = "rgba(0,0,0,1)";
      this.fogContext.beginPath();
      this.fogContext.arc(data.x, data.y, data.radius, 0, Math.PI * 2);
      this.fogContext.fill();
      this.fogContext.globalCompositeOperation = "source-over";
      const konvaImage = new Image();
      konvaImage.onload = () => {
        this.fogImage!.image(konvaImage);
        this.map.stage.draw();
      };
      konvaImage.src = this.fogCanvas.toDataURL();
    });

    socket.on("fog:rect", (data: any) => {
      if (!this.fogCanvas || !this.fogContext || !this.fogImage) return;
      this.fogContext.globalCompositeOperation = "destination-out";
      this.fogContext.fillStyle = "rgba(0,0,0,1)";
      this.fogContext.fillRect(data.x, data.y, data.width, data.height);
      this.fogContext.globalCompositeOperation = "source-over";
      const konvaImage = new Image();
      konvaImage.onload = () => {
        this.fogImage!.image(konvaImage);
        this.map.stage.draw();
      };
      konvaImage.src = this.fogCanvas.toDataURL();
    });

    socket.on("fog:reset", () => {
      if (!this.fogCanvas || !this.fogContext || !this.fogImage) return;
      this.fogContext.clearRect(0, 0, this.stageWidth, this.stageHeight);
      this.fogContext.fillStyle = "#000";
      this.fogContext.globalAlpha = 0.7;
      this.fogContext.fillRect(0, 0, this.stageWidth, this.stageHeight);
      const konvaImage = new Image();
      konvaImage.onload = () => {
        this.fogImage!.image(konvaImage);
        this.map.stage.draw();
      };
      konvaImage.src = this.fogCanvas.toDataURL();
    });
  }
}
