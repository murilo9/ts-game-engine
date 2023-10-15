import { Game } from "../core/types/Game";
import { Room } from "../core/types/Room";
import { SpriteSet } from "../core/types/SpriteSet";
import mainSpriteSet from "./assets/main-spriteset.png";
import { Player } from "./classes/Player";
import { GameConfig } from "../core/types/GameConfig";
import { Pillar } from "./classes/Pillar";
import { System } from "detect-collisions";
import { debug } from "./debug";

const DEBUG = false;

const gameConfig: GameConfig = {
  screenWidth: 800,
  screenHeight: 600,
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
  pillar: [80, 80, 80 + 16, 80 + 16 + 16],
});

const spriteSets = {
  spriteSet1,
};
const roomInitialEntities = [
  new Player(),
  new Pillar({ x: 200, y: 200 }),
  new Pillar({ x: 400, y: 200 }),
  new Pillar({ x: 200, y: 400 }),
  new Pillar({ x: 400, y: 400 }),
];
const initialRoom = new Room({ environment: new System() }).appendEntities(
  roomInitialEntities,
  "environment"
);
Game.setup(initialRoom, spriteSets, gameConfig, debug);
Game.start();
