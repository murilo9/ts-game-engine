import { Animation } from "./Animation";
import { Entity } from "./Entity";

type StaticSpriteConfig = {
  type: "static";
  spriteSetName: string;
  frameName: string;
};

type AnimationSpriteConfig = {
  type: "animation";
  animation: Animation;
};

export class Drawable extends Entity {
  _isGraphic: true;
  x: number;
  y: number;
  xPivot: number;
  yPivot: number;
  rotation: number;
  xSpeed: number;
  ySpeed: number;
  sprite: StaticSpriteConfig | AnimationSpriteConfig | null;
  drawIndex: number;
  xScale: number;
  yScale: number;
  visible: boolean;

  constructor(arg?: {
    x?: number;
    y?: number;
    xPivot?: number;
    yPivot?: number;
    rotation?: number;
    xSpeed?: number;
    ySpeed?: number;
    drawIndex?: number;
    xScale?: number;
    yScale?: number;
    visible?: boolean;
  }) {
    super();
    this._isGraphic = true;
    this.x = arg?.x || 0;
    this.y = arg?.y || 0;
    this.xPivot = arg?.xPivot || 0;
    this.yPivot = arg?.yPivot || 0;
    this.rotation = arg?.rotation || 0;
    this.xSpeed = arg?.xSpeed || 0;
    this.ySpeed = arg?.ySpeed || 0;
    this.drawIndex = arg?.drawIndex || 1;
    this.xScale = arg?.xScale || 1;
    this.yScale = arg?.yScale || 1;
    this.visible = arg?.visible || true;
    this.sprite = null;
  }
}
