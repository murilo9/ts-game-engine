import { Animation } from "../../core/types/Animation";
import { Camera } from "../../core/types/Camera";
import { AnimationSpriteConfig, Drawable } from "../../core/types/Graphic";

const START_POS_X = 0;
const START_POS_Y = 0;
const ANIMATION_TIME = 3;
const SCALE = 2;
const SPEED = 2;

export class Player extends Drawable {
  private keyPressed: { left: boolean; right: boolean; up: boolean; down: boolean } = {
    down: false,
    left: false,
    right: false,
    up: false,
  };

  constructor() {
    super({
      x: START_POS_X,
      y: START_POS_Y,
      xPivot: 8,
      yPivot: 8,
      sprite: {
        type: "animation",
        animation: new Animation(
          "spriteSet1",
          [
            "playerStep1",
            "playerStep2",
            "playerStep3",
            "playerStep4",
            "playerStep5",
            "playerStep6",
          ],
          ANIMATION_TIME
        ),
      },
      xScale: SCALE,
      yScale: SCALE,
    });
    document.addEventListener("keydown", this.handleKey(false));
    document.addEventListener("keyup", this.handleKey(true));
    Camera.attach(this);
  }

  handleKey(up: boolean) {
    return (event: KeyboardEvent) => {
      if (event.key === "a") {
        this.keyPressed.left = !up;
      }
      if (event.key === "d") {
        this.keyPressed.right = !up;
      }
      if (event.key === "s") {
        this.keyPressed.down = !up;
      }
      if (event.key === "w") {
        this.keyPressed.up = !up;
      }
    };
  }

  onRun() {
    // Move player if keys are pressed
    const xModule = -Number(this.keyPressed.left) + Number(this.keyPressed.right);
    const yModule = -Number(this.keyPressed.up) + Number(this.keyPressed.down);
    this.xSpeed = xModule * SPEED;
    this.ySpeed = yModule * SPEED;
    // Update player direction based on xSpeed direction
    if (xModule !== 0) {
      this.xScale = xModule * SCALE;
    }
    // Update player animation based on movement
    const isMoving = xModule !== 0 || yModule !== 0;
    const sprite = this.sprite as AnimationSpriteConfig;
    if (isMoving) {
      sprite.animation.setRefreshTime(ANIMATION_TIME);
    } else {
      sprite.animation.setRefreshTime(0);
      sprite.animation.setFrameIndex(0);
    }
  }
}
