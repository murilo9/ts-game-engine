import { Drawable } from "../../core/types/Graphic";

export class Pillar extends Drawable {
  onInit(): void {
    this.sprite = {
      type: "static",
      spriteSetName: "spriteSet1",
      frameName: "pillar",
    };
    this.xScale = this.yScale = 2;
  }
}
