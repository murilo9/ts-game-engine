import { Player } from "../../game/classes/Player";
import { Camera } from "./Camera";
import { Collider, ColliderBody } from "./Collider";
import { Debug } from "./Debug";
import { Entity } from "./Entity";
import { GameConfig } from "./GameConfig";
import { Drawable } from "./Graphic";
import { Room } from "./Room";
import { Frame, SpriteSet } from "./SpriteSet";
import { UI } from "./UI";

const CYCLES_MS = 20;

export class Game {
  // HTML canvas element, present inside the #game-canvas element
  private static canvas: HTMLCanvasElement;
  // The setInterval ID of the cycle method
  private static cycleInterval: any;
  // Debug function, logs when this.debug is true
  private static debugLog = (...args: any[]) => this.debug.log && console.log(...args);
  // Current room being executed by the cycle method
  private static currentRoom: Room;
  // Collection of spriteSets
  private static spriteSets: { [name: string]: SpriteSet };
  // True for logging to the console
  private static debug: Debug;
  // Screen width in pixels
  private static screenWidth: number;
  // Screen height in pixels
  private static screenHeight: number;

  public static getCameraOffsetX() {
    return Camera.x - this.screenWidth / 2;
  }
  public static getCameraOffsetY() {
    return Camera.y - this.screenHeight / 2;
  }

  public static ctx: CanvasRenderingContext2D;

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
    debug: Debug = {
      log: false,
      displayCollisionBoxes: false,
      displayPivots: false,
      displayDrawIndexes: false,
    }
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
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    const self = this;
    window.addEventListener("resize", () => {
      setTimeout(() => console.log("resizing", window.innerWidth, window.innerHeight), 200);
      self.canvas.width = window.innerWidth;
      self.canvas.height = window.innerHeight;
    });
  }

  private static cycle() {
    // **** PART 1: Execute entities' beforeRun methods ****

    this.debugLog("cycle", this.currentRoom.getEntities());
    this.currentRoom.getEntities().forEach((entity) => {
      entity.beforeRun && entity.beforeRun();
    });

    // Get context
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.imageSmoothingEnabled = false;

    // **** PART 2: Resolve entities' movements ****

    this.currentRoom.getEntities().forEach((entity) => {
      (entity as Entity & Drawable).x += (entity as Entity & Drawable).xSpeed;
      (entity as Entity & Drawable).y += (entity as Entity & Drawable).ySpeed;
    });
    // Update camera
    Camera.updatePosition();

    // **** PART 3: Resolve entities' sprites ****

    // Sort entities
    const graphicEntities = this.currentRoom
      .getEntities()
      .filter((entity) => entity instanceof Drawable) as Drawable[];
    const sortedGraphicEntities = graphicEntities.sort(
      (entityA, entityB) => entityA.drawIndex - entityB.drawIndex
    );
    // For each sorted entity, render it
    sortedGraphicEntities.forEach((entity) => {
      const { sprite, x, y, xPivot, yPivot, xScale, yScale } = entity;
      let frame: Frame;
      let spriteSet: SpriteSet;
      let image: HTMLImageElement;

      // Render sprites
      if (sprite && entity.visible) {
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
        const dx = x - xPivot - this.getCameraOffsetX() + xAxisFlipCorrection;
        const dy = y - yPivot - this.getCameraOffsetY() + yAxisFlipCorrection;
        const dWidth = sWidth * Math.abs(xScale);
        const dHeight = sHeight * Math.abs(yScale);
        // Render the frame in the canvas context
        this.ctx.save();
        this.ctx.scale(xAxisFlip, yAxisFlip);
        this.ctx.drawImage(
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
        this.ctx.restore();

        // Display entity drawIndex
        if (this.debug.displayDrawIndexes) {
          this.ctx.fillText(
            Math.floor(entity.drawIndex).toString(),
            entity.x - this.getCameraOffsetX(),
            entity.y - dHeight + entity.yPivot - this.getCameraOffsetY()
          );
        }
        // Display entity pivot
        if (this.debug.displayPivots) {
          this.ctx.lineWidth = 2;
          this.ctx.strokeStyle = "red";
          this.ctx.beginPath();
          this.ctx.moveTo(
            entity.x - this.getCameraOffsetX(),
            entity.y + entity.yPivot - this.getCameraOffsetY()
          );
          this.ctx.lineTo(
            entity.x + entity.xPivot - this.getCameraOffsetX(),
            entity.y + entity.yPivot - this.getCameraOffsetY()
          );
          this.ctx.moveTo(
            entity.x + entity.xPivot - this.getCameraOffsetX(),
            entity.y - this.getCameraOffsetY()
          );
          this.ctx.lineTo(
            entity.x + entity.xPivot - this.getCameraOffsetX(),
            entity.y + entity.yPivot - this.getCameraOffsetY()
          );
          this.ctx.stroke();
        }
      }
    });

    // **** PART 4: Resolve entities' collisions ****

    const sortedColliderEntities = sortedGraphicEntities.filter(
      (entity) => entity instanceof Collider
    ) as Collider[];
    // Apply collison bodies transformations
    sortedColliderEntities.forEach((entity) => {
      // Update collision body position
      entity.body.setPosition(
        entity.x - this.getCameraOffsetX(),
        entity.y - this.getCameraOffsetY(),
        false
      );
      // Update collison body scale
      entity.body.setScale(Math.abs(entity.xScale), Math.abs(entity.yScale), false);
      // Update collision body rotation
      entity.body.setAngle(entity.rotation, false);
      // Update collison body pivot
      entity.body.offset.x = entity.xPivot;
      entity.body.offset.y = entity.yPivot;
      // Apply final update
      entity.body.updateBody();
    });
    // Resolve collisions
    const self = this;
    this.currentRoom.getAllCollisionSystems().forEach((system) => {
      system.checkAll((response) => {
        const a = response.a as ColliderBody;
        const { overlapV } = response;
        a.setPosition(a.x - overlapV.x, a.y - overlapV.y);
      });
      if (this.debug.displayCollisionBoxes) {
        self.ctx.strokeStyle = "#00FF00";
        self.ctx.beginPath();
        system.draw(self.ctx);
        self.ctx.stroke();
      }
    });
    // Update entities' position based on collision bodies new position
    sortedColliderEntities.forEach((entity) => {
      entity.x = entity.body.x + this.getCameraOffsetX();
      entity.y = entity.body.y + this.getCameraOffsetY();
    });

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
