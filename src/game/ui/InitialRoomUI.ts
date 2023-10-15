import { UI } from "../../core/types/UI";
import { fancyButton } from "./FancyButton";

export class InitialRoomUI extends UI {
  public init(): void {
    const updatedUiElement = this.getElement();
    updatedUiElement.appendChild(fancyButton);
    // Finally, update the UI element
    this.setElement(updatedUiElement);
  }
}
