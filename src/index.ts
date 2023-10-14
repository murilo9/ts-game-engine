import { Game } from "./types/Game";
import { Room } from "./types/Room";
import { SpriteSet } from "./types/SpriteSet";
import mainSpriteSet from "./assets/main-spriteset.png";
import { Player } from "./types/Player";

const DEBUG = true;

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
const game = new Game(initialRoom, spriteSets, DEBUG);
game.start();
