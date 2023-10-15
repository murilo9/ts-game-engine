export class UI {
  private element: HTMLElement;

  constructor() {
    const ui = document.createElement("div");
    document.body.appendChild(ui);
    ui.id = "game-ui";
    ui.style.position = "fixed";
    ui.style.top = "0";
    ui.style.left = "0";
    ui.style.width = "100vw";
    ui.style.height = "100vh";
    this.element = ui;
    return this;
  }

  public init() {
    // Here is where elements get appendt to this.element
  }

  public getElement() {
    return this.element;
  }

  public setElement(element: HTMLElement) {
    this.element.remove();
    this.element = element;
    document.body.appendChild(this.element);
  }
}
