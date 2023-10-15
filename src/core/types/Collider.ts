import { Box, Circle, Ellipse, Line, Point, Polygon } from "detect-collisions";
import { Drawable, DrawableArgs } from "./Graphic";

export type ColliderBody = Box | Circle | Ellipse | Line | Point | Polygon;

export class Collider extends Drawable {
  public body: ColliderBody;

  constructor(args: DrawableArgs, body: ColliderBody) {
    super(args);
    this.body = body;
  }
}
