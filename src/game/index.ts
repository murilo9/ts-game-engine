import { Game } from "../core/types/Game";
import { Room } from "../core/types/Room";
import { SpriteSet } from "../core/types/SpriteSet";
import mainSpriteSet from "./assets/main-spriteset.png";
import { Player } from "./classes/Player";
import { GameConfig } from "../core/types/GameConfig";

const DEBUG = false;

const gameConfig: GameConfig = {
  screenWidth: 800,
  scrrenHeight: 600,
  canvasElementId: "game-canvas",
  canvasBackgroundColor: "#CCCCCC",
};

const spriteSet1 = new SpriteSet(mainSpriteSet, {
  playerIdle: [128, 16, 128 + 16, 32],
  playerStep1: [144, 16, 144 + 16, 32],
  playerStep2: [160, 16, 160 + 16, 32],
  playerStep3: [176, 16, 176 + 16, 32],
  playerStep4: [192, 16, 192 + 16, 32],
  playerStep5: [208, 16, 208 + 16, 32],
  playerStep6: [224, 16, 224 + 16, 32],
});

const spriteSets = {
  spriteSet1,
};
const initialRoom = new Room([new Player()]);
Game.setup(initialRoom, spriteSets, gameConfig, DEBUG);
Game.start();
