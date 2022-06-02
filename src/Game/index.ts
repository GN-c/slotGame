import Phaser from "phaser";

import GameScene from "./Scenes/Game";
import PreloadScene from "./Scenes/Preload";

export default class Game extends Phaser.Game {
  constructor(parent: HTMLElement) {
    super({
      type: Phaser.WEBGL,
      backgroundColor: 0xffffff,
      scale: {
        /**
         * Fixed size of canvas based on 1x assets
         */
        width: 1920,
        height: 1080,
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
        parent,
      },
      roundPixels: true,
      scene: [PreloadScene, GameScene],
      physics: {
        default: "matter",
        matter: {
          // debug: true,
        },
      },
    });
  }
}
