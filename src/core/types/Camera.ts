import { Drawable } from "./Graphic";

export class Camera {
  public static x: number = 400;
  public static y: number = 400;
  public static attachedEntity: Drawable | null = null;

  public static attach(entity: Drawable) {
    this.attachedEntity = entity;
  }

  public static updatePosition() {
    if (this.attachedEntity) {
      this.x = this.attachedEntity.x;
      this.y = this.attachedEntity.y;
    }
  }
}
