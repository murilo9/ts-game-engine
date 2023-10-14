export type Frame = [number, number, number, number]; // [sx, sy, tx, ty]

export class SpriteSet {
  private image: HTMLImageElement;

  constructor(src: string, private frames: { [name: string]: Frame }) {
    this.image = new Image();
    this.image.src = src;
  }

  public getImage() {
    return this.image;
  }

  public getFrame(name: string) {
    return this.frames[name];
  }
}
