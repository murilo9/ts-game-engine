import { Animation } from "../../core/types/Animation";
import { Drawable } from "../../core/types/Graphic";

const START_POS_X = 400;
const START_POS_Y = 200;
const ANIMATION_SPEED = 3;
const SCALE = 2;
const SPEED = 2;

export class Player extends Drawable {
  constructor() {
    super();
  }

  private keyPressed: { left: boolean; right: boolean; up: boolean; down: boolean } = {
    down: false,
    left: false,
    right: false,
    up: false,
  };

  onInit() {
    this.x = START_POS_X;
    this.y = START_POS_Y;
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
    this.xSpeed = (-Number(this.keyPressed.left) + Number(this.keyPressed.right)) * SPEED;
    this.ySpeed = (-Number(this.keyPressed.up) + Number(this.keyPressed.down)) * SPEED;
  }
}
