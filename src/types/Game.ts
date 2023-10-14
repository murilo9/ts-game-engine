import { Entity } from "./Entity";
import { Drawable } from "./Graphic";
import { Room } from "./Room";
import { Frame, SpriteSet } from "./SpriteSet";

export class Game {
  private canvas: HTMLCanvasElement;
  private cycleInterval: any;
  private debugLog = (...args: any[]) => this.debug && console.log(...args);

  constructor(
    private room: Room,
    private spriteSets: { [name: string]: SpriteSet },
    private debug = false
  ) {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "game-canvas";
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.canvas.style.background = "#CCCCCC";
    document.body.appendChild(this.canvas);
    this.debugLog("Game constructor: room", this.room);
    this.debugLog("Game constructor: spriteSets", this.spriteSets);
  }

  private cycle() {
    // **** PART 1: Execute entities' beforeRun methods ****

    this.debugLog("cycle", this.room.getEntities());
    this.room.getEntities().forEach((entity) => {
      entity.beforeRun && entity.beforeRun();
    });

    // Get context
    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.imageSmoothingEnabled = false;

    // **** PART 2: Resolve entities' movements ****

    this.room.getEntities().forEach((entity) => {
      (entity as Entity & Drawable).x += (entity as Entity & Drawable).xSpeed;
      (entity as Entity & Drawable).y += (entity as Entity & Drawable).ySpeed;
    });

    // **** PART 3: Resolve entities' sprites ****

    // Sort entities
    const sortedGraphicEntities = this.room
      .getEntities()
      .filter((entity) => (entity as Entity & Drawable)._isGraphic)
      .sort(
        (entityA, entityB) =>
          (entityA as Entity & Drawable).drawIndex - (entityB as Entity & Drawable).drawIndex
      );
    // For each sorted entity, render it
    sortedGraphicEntities.forEach((entity) => {
      this.debugLog(entity);
      if ((entity as Entity & Drawable)._isGraphic) {
        const { sprite, x, y, xPivot, yPivot, xScale, yScale } = entity as Entity & Drawable;
        let frame: Frame;
        let spriteSet: SpriteSet;
        let image: HTMLImageElement;
        // Render sprites
        if (sprite && (entity as Entity & Drawable).visible) {
          // Deal with static sprite
          if (sprite.type === "static") {
            const { frameName, spriteSetName } = sprite;
            spriteSet = this.spriteSets[spriteSetName];
            image = spriteSet.getImage();
            frame = spriteSet.getFrame(frameName);
          }
          // Deal with animated sprite
          else {
            sprite.animation._countFrame();
            const spriteSetName = sprite.animation.spriteSetName;
            spriteSet = this.spriteSets[spriteSetName];
            image = spriteSet.getImage();
            const frameName = sprite.animation.getCurrentFrameName();
            frame = spriteSet.getFrame(frameName);
          }
          // Prepare the sprite frame to be rendered
          const sx = frame[0];
          const sy = frame[1];
          const sWidth = frame[2] - sx;
          const sHeight = frame[3] - sy;
          const dx = x - xPivot;
          const dy = y - yPivot;
          const dWidth = sWidth * xScale;
          const dHeight = sHeight * yScale;
          // Render the frame in the canvas context
          this.debugLog(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
          ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        }
      }
    });

    // **** PART 4: Resolve entities' movements ****

    // TODO

    // **** PART 5: Execute entities' onRun methods ****

    this.room.getEntities().forEach((entity) => {
      entity.onRun && entity.onRun();
    });

    // **** PART 5: Execute entities' beforeRun methods ****

    this.room.getEntities().forEach((entity) => {
      entity.afterRun && entity.afterRun();
    });
  }

  public start() {
    const self = this;
    // Initialize room's entities
    this.room.getEntities().forEach((entity) => {
      entity.onInit();
    });
    // Try to cycle at 60 fps
    this.cycleInterval = setInterval(function () {
      self.cycle();
    }, 16);
  }

  public exit() {
    clearInterval(this.cycleInterval);
  }
}
