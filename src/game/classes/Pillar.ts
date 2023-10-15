import { Drawable } from "../../core/types/Graphic";

const SCALE = 2;

export class Pillar extends Drawable {
  constructor({ x, y }: { x: number; y: number }) {
    super({
      x,
      y,
      sprite: {
        type: "static",
        spriteSetName: "spriteSet1",
        frameName: "pillar",
      },
      xScale: SCALE,
      yScale: SCALE,
    });
  }
}
