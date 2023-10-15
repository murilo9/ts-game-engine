import { Animation } from "../../core/types/Animation";
import { Drawable } from "../../core/types/Graphic";

export class Player extends Drawable {
  constructor() {
    super();
  }

  onInit() {
    this.xSpeed = 1;
    this.x = 400;
    this.y = 200;
    this.sprite = {
      type: "animation",
      animation: new Animation(
        "spriteSet1",
        ["playerStep1", "playerStep2", "playerStep3", "playerStep4", "playerStep5", "playerStep6"],
        3
      ),
    };
    this.xScale = this.yScale = 2;
  }
}
