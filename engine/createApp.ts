import * as PIXI from "pixi.js";

export async function createApp(container: HTMLElement) {
  const app = new PIXI.Application();

  await app.init({
    backgroundColor: 0x222222,
    antialias: true,
    resizeTo: container,
  });

  container.appendChild(app.canvas);

  return app;
}
