export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    /** Set base URL */
    this.load.setBaseURL("./assets/");

    /**
     * Load assets
     */
    this.load.image("Background");
    this.load.image("Spin");
    this.load.image("Win");
    this.load.image("CheatToolBackground");
    this.load.image("Arrow");
    this.load.atlas("fruits");
  }

  create() {
    this.scene.start("Game");
  }
}
