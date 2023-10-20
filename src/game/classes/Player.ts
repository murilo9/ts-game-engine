import { Circle, Ellipse } from "detect-collisions";
import { Animation } from "../../core/types/Animation";
import { Camera } from "../../core/types/Camera";
import { Collider } from "../../core/types/Collider";
import { AnimationSpriteConfig, Drawable } from "../../core/types/Graphic";
import { AbilitiesTypeMap, CreatureBase } from "./CreatureBase";
import { getCreatureModifier } from "../utils/getCreatureModifier";

const START_POS_X = 250;
const START_POS_Y = 250;
const ANIMATION_TIME = 3;
const SCALE = 2;
const SPEED = 2;
const X_PIVOT = 8;
const Y_PIVOT = 16;

export class Player extends Collider implements CreatureBase {
  /* Interface-related Attributes */
  _isCreatureBase: true = true;
  private xp = 0;
  private level = 1;
  private HP: number;
  private MP: number;

  /* Movement Attributes */
  private keyPressed: { left: boolean; right: boolean; up: boolean; down: boolean } = {
    down: false,
    left: false,
    right: false,
    up: false,
  };

  constructor(
    private strength: number,
    private dexterity: number,
    private constitution: number,
    private intelligence: number,
    private charisma: number,
    private hpDiceSize: number,
    private mpDiceSize: number
  ) {
    // Movement initializers
    super(
      {
        x: START_POS_X,
        y: START_POS_Y,
        xPivot: X_PIVOT,
        yPivot: Y_PIVOT,
        sprite: {
          type: "animation",
          animation: new Animation(
            "spriteSet1",
            [
              "playerStep1",
              "playerStep2",
              "playerStep3",
              "playerStep4",
              "playerStep5",
              "playerStep6",
            ],
            ANIMATION_TIME
          ),
        },
        xScale: SCALE,
        yScale: SCALE,
      },
      new Ellipse({ x: START_POS_X, y: START_POS_Y }, 6, 2)
    );
    document.addEventListener("keydown", this.handleKey(false));
    document.addEventListener("keyup", this.handleKey(true));
    Camera.attach(this);
    // CreatureBase initialziers (attributes)
    this.xp = 0;
    this.HP = this.getMaxHP();
    this.MP = this.getMaxMP();
  }

  getAbility(ability: AbilitiesTypeMap): number {
    return this[ability];
  }
  getHP(): number {
    return this.HP;
  }
  getMaxHP(): number {
    return this.level * this.hpDiceSize;
  }
  getMP(): number {
    return this.MP;
  }
  getMaxMP(): number {
    const intMod = getCreatureModifier(this, "intelligence");
    const nonZeroIntMod = intMod >= 0 ? intMod : 0;
    return this.level * (this.mpDiceSize + nonZeroIntMod * 2);
  }
  getXpToNextlevel(currentLevel: number): number {
    if (currentLevel === 1) {
      return 1000;
    } else {
      return this.getXpToNextlevel(currentLevel - 1) + 1000;
    }
  }
  addXp(amount: number) {
    this.xp += amount;
  }

  handleKey(up: boolean) {
    return (event: KeyboardEvent) => {
      if (event.key === "a") {
        this.keyPressed.left = !up;
      }
      if (event.key === "d") {
        this.keyPressed.right = !up;
      }
      if (event.key === "s") {
        this.keyPressed.down = !up;
      }
      if (event.key === "w") {
        this.keyPressed.up = !up;
      }
    };
  }

  onRun() {
    // Move player if keys are pressed
    const xModule = -Number(this.keyPressed.left) + Number(this.keyPressed.right);
    const yModule = -Number(this.keyPressed.up) + Number(this.keyPressed.down);
    this.xSpeed = xModule * SPEED;
    this.ySpeed = yModule * SPEED;
    // Update player direction based on xSpeed direction
    if (xModule !== 0) {
      this.xScale = xModule * SCALE;
    }
    // Update player animation based on movement
    const isMoving = xModule !== 0 || yModule !== 0;
    const sprite = this.sprite as AnimationSpriteConfig;
    if (isMoving) {
      sprite.animation.setRefreshTime(ANIMATION_TIME);
    } else {
      sprite.animation.setRefreshTime(0);
      sprite.animation.setFrameIndex(0);
    }
    // Update drawIndex
    this.drawIndex = this.y + this.yPivot;
  }
}
