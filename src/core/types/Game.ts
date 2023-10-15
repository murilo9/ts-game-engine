import { Camera } from "./Camera";
import { Entity } from "./Entity";
import { GameConfig } from "./GameConfig";
import { Drawable } from "./Graphic";
import { Room } from "./Room";
import { Frame, SpriteSet } from "./SpriteSet";

const CYCLES_MS = 16;

export class Game {
  // HTML canvas element, present inside the #game-canvas element
  private static canvas: HTMLCanvasElement;
  // The setInterval ID of the cycle method
  private static cycleInterval: any;
  // Debug function, logs when this.debug is true
  private static debugLog = (...args: any[]) => this.debug && console.log(...args);
  // Current room being executed by the cycle method
  private static currentRoom: Room;
  // Collection of spriteSets
  private static spriteSets: { [name: string]: SpriteSet };
  // True for logging to the console
  private static debug: boolean;
  // Screen width in pixels
  private static screenWidth: number;
  // Screen height in pixels
  private static screenHeight: number;

  public static getScreen() {
    return {
      width: this.screenWidth,
      height: this.screenHeight,
    };
  }

  public static setup(
    initialRoom: Room,
    spriteSets: { [name: string]: SpriteSet },
    config: GameConfig,
    debug = false
  ) {
    const { screenWidth, screenHeight, canvasElementId, canvasBackgroundColor } = config;
    this.currentRoom = initialRoom;
    this.spriteSets = spriteSets;
    this.debug = debug;
    this.canvas = document.createElement("canvas");
    this.canvas.id = canvasElementId;
    this.canvas.width = this.screenWidth = screenWidth;
    this.canvas.height = this.screenHeight = screenHeight;
    this.canvas.style.background = canvasBackgroundColor;
    document.body.appendChild(this.canvas);
    this.debugLog("Game constructor: room", this.currentRoom);
    this.debugLog("Game constructor: spriteSets", this.spriteSets);
  }

  private static cycle() {
    // **** PART 1: Execute entities' beforeRun methods ****

    this.debugLog("cycle", this.currentRoom.getEntities());
    this.currentRoom.getEntities().forEach((entity) => {
      entity.beforeRun && entity.beforeRun();
    });

    // Get context
    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.imageSmoothingEnabled = false;

    // **** PART 2: Resolve entities' movements ****

    this.currentRoom.getEntities().forEach((entity) => {
      (entity as Entity & Drawable).x += (entity as Entity & Drawable).xSpeed;
      (entity as Entity & Drawable).y += (entity as Entity & Drawable).ySpeed;
    });
    // Update camera
    Camera.updatePosition();

    // **** PART 3: Resolve entities' sprites ****

    // Sort entities
    const sortedGraphicEntities = this.currentRoom
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
          const xAxisFlip = xScale > 0 ? 1 : -1;
          const yAxisFlip = yScale > 0 ? 1 : -1;
          const xAxisFlipCorrection = xAxisFlip === -1 ? 2 * sWidth : 0;
          const yAxisFlipCorrection = yAxisFlip === -1 ? 2 * sHeight : 0;
          const dx = x - xPivot - (Camera.x - this.screenWidth / 2) + xAxisFlipCorrection;
          const dy = y - yPivot - (Camera.y - this.screenHeight / 2) + yAxisFlipCorrection;
          const dWidth = sWidth * Math.abs(xScale);
          const dHeight = sHeight * Math.abs(yScale);
          // Render the frame in the canvas context
          ctx.save();
          ctx.scale(xAxisFlip, yAxisFlip);
          ctx.drawImage(
            image,
            sx,
            sy,
            sWidth,
            sHeight,
            dx * xAxisFlip,
            dy * yAxisFlip,
            dWidth,
            dHeight
          );
          //ctx.arc(100, 75, 50, 0, 2 * Math.PI);
          ctx.restore();
        }
      }
    });

    // **** PART 4: Resolve entities' movements ****

    // TODO

    // **** PART 5: Execute entities' onRun methods ****

    this.currentRoom.getEntities().forEach((entity) => {
      entity.onRun && entity.onRun();
    });

    // **** PART 5: Execute entities' beforeRun methods ****

    this.currentRoom.getEntities().forEach((entity) => {
      entity.afterRun && entity.afterRun();
    });
  }

  public static start() {
    const self = this;
    // Initialize room's entities
    this.currentRoom.getEntities().forEach((entity) => {
      entity.onInit();
    });
    // Try to cycle at 60 fps
    this.cycleInterval = setInterval(function () {
      self.cycle();
    }, CYCLES_MS);
  }

  public static exit() {
    clearInterval(this.cycleInterval);
  }
}
