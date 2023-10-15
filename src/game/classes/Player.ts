import { Animation } from "../../core/types/Animation";
import { Camera } from "../../core/types/Camera";
import { Drawable } from "../../core/types/Graphic";

const START_POS_X = 0;
const START_POS_Y = 0;
const ANIMATION_SPEED = 3;
const SCALE = 2;
const SPEED = 2;

export class Player extends Drawable {
  private keyPressed: { left: boolean; right: boolean; up: boolean; down: boolean } = {
    down: false,
    left: false,
    right: false,
    up: false,
  };

  onInit() {
    this.x = START_POS_X;
    this.y = START_POS_Y;
    this.xPivot = 8;
    this.yPivot = 8;
    this.sprite = {
      type: "animation",
      animation: new Animation(
        "spriteSet1",
        ["playerStep1", "playerStep2", "playerStep3", "playerStep4", "playerStep5", "playerStep6"],
        ANIMATION_SPEED
      ),
    };
    this.xScale = this.yScale = SCALE;
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
    this.xSpeed = (-Number(this.keyPressed.left) + Number(this.keyPressed.right)) * SPEED;
    this.ySpeed = (-Number(this.keyPressed.up) + Number(this.keyPressed.down)) * SPEED;
  }
}
