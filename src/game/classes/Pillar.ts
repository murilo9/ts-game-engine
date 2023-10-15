import { Circle } from "detect-collisions";
import { Collider } from "../../core/types/Collider";
import { Drawable } from "../../core/types/Graphic";

const SCALE = 2;
const X_PIVOT = 8;
const Y_PIVOT = 32;

export class Pillar extends Collider {
  constructor({ x, y }: { x: number; y: number }) {
    super(
      {
        x,
        y,
        sprite: {
          type: "static",
          spriteSetName: "spriteSet1",
          frameName: "pillar",
        },
        xScale: SCALE,
        yScale: SCALE,
        xPivot: X_PIVOT,
        yPivot: Y_PIVOT,
        drawIndex: y + Y_PIVOT,
      },
      new Circle({ x, y }, 8, { isStatic: true })
    );
  }
}
