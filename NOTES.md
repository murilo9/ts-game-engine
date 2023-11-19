## TODO

- Phone and desktop builds
- Test buttons on phone touch
- Sounds
- SpriteSet tool
- Try to implement React on UI

## Classes

#### Entity

- \_id: string
- onInit()
- beforeRun()
- onRun()
- afterRun()

#### Drawable (extends Entity)

- \_isGraphic: true
- x: number
- y: number
- xPivot: number
- yPivot: number
- rotation: number
- xSpeed: number
- ySpeed: number
- sprite: StaticSpriteConfig | AnimationSpriteConfig | null
- drawIndex: number
- xScale: number
- yScale: number
- visible: boolean

#### StaticSpriteConfig

- type: "static"
- spriteSetName: string
- frameName: string

#### AnimationSpriteConfig

- type: "animation"
- animation: Animation

#### Frame

- [sx: number, sy: numbe, tx: numbe, ty: number]

#### SpriteSet

- image: HTMLImageElement
- getImage(): Image
- getFrame(): Frame

## Game

In order to build a game:

1. Declare the spriteSets
2. Declare the initial room
3. Instantiate a new Game instance, passing the initialRoom, spriteSets and debug as parameters
4. Call the Game instance start method

### Game lifecycle

The game will initiate the HTML canvas at the element with "game-canvas" id. Then the game instance start method will initialize all entities inside the initial room by calling their onInit methods. Finally the game instance will call its cycle method each 16 ms. The game instance exit method will clear the cycle interval, preventing the cycles from running.
Each game cycle will:

1. Execute all entities' beforeRun methods
2. Resolve dynamic entities (apply movements)
3. Draw graphic entities (sort entities by drawIndex, and draw their respective sprites or animations)
4. Resolve physic entities (resolve collisions)
5. Execute all entities' onRun methods
6. Execute all entities' afterRun methods

### How does UI work

Every Room has a public UI instance, which is defined in the Room's constructor. To build the UI of a Room, create a MyRoomUI class that extends the UI class. Inside MyRoomUI class init method, get the element instance, append any HTMLElement(s) into it (through the appendChild method) and call the setElement method:

```js
const myButton = document.createElement("button");
myButton.innerHTML = "My Button";
myButton.onclick = () => {
  console.log("clicked myButton");
};
const myHeader = document.createElement("h1");
myHeader.innerHTML = "My Header";
myHeader.style.color = "green";

export class MyRoomUI extends UI {
  public init(): void {
    const updatedUiElement = this.getElement();
    updatedUiElement.appendChild(myButton);
    updatedUiElement.appendChild(myHeader);
    // Finally, update the UI element
    this.setElement(updatedUiElement);
  }
}
```

Once MyRoom inits, it will render the contents of its UI.
