import CheatTool from "./CheatTool";
import MotionBlurFX from "./MotionBlurFX";
import SpinButton from "./SpinButton";
import VerticalReel from "./VerticalReel";

export default class GameScene extends Phaser.Scene {
  declare renderer: Phaser.Renderer.WebGL.WebGLRenderer;

  background: Phaser.GameObjects.Image;
  reels: VerticalReel[];
  spinButton: SpinButton;
  winText: Phaser.GameObjects.Image;
  cheatTool: CheatTool;

  constructor() {
    super("Game");
  }

  create() {
    this.input.setPollAlways();
    /**
     * Add MotionBlurFX to rendering pipeline
     */
    this.renderer.pipelines.add(MotionBlurFX.KEY, new MotionBlurFX(this.game));

    this.background = this.add
      .image(0, 0, "Background")
      .setOrigin(0, 0)
      .setDepth(1);

    this.winText = this.add
      .image(this.camera.centerX, 130, "Win")
      .setOrigin(0.5, 0)
      .setDepth(2)
      .setVisible(false);

    this.reels = [
      new VerticalReel(this, new Phaser.Geom.Rectangle(399, 292, 342, 453)),
      new VerticalReel(this, new Phaser.Geom.Rectangle(789, 292, 342, 453)),
      new VerticalReel(this, new Phaser.Geom.Rectangle(1179, 292, 342, 453)),
    ];

    this.spinButton = new SpinButton(this)
      .setOrigin(0.5, 1)
      .setPosition(this.camera.centerX, this.camera.height - 100)
      .setDepth(2)
      .on(Phaser.Input.Events.POINTER_DOWN, this.handleSpin);

    this.cheatTool = new CheatTool(this).setPosition(0, 0).setDepth(2);
  }

  handleSpin = async () => {
    this.winText.setVisible(false);
    this.spinButton.setActive(false);
    const items = await this.spinReels(
      !this.cheatTool.minimized ? this.cheatTool.selectedItems : undefined
    );
    /** Check if items match */
    if (items.every((item) => item == items[0])) this.winText.setVisible(true);
    this.spinButton.setActive(true);
  };

  async spinReels(targetItems: string[] = []) {
    /**
     * Spin each reel with little offset from each other
     */
    this.reels.forEach((reel, index) =>
      reel.spin(5 + index * 3, 1000 + index * 600, targetItems[index])
    );

    /**
     * Wait until last reel is done spinning
     */
    await new Promise((res) =>
      this.time.delayedCall(1000 + this.reels.length * 600, res)
    );

    return this.reels.map((reel) => reel.activeItemName);
  }

  get camera() {
    return this.cameras.main;
  }
}
