import VerticalReel from "../../VerticalReel";

export default class ItemSelector extends Phaser.GameObjects.Image {
  /** Save all options as array */
  private readonly options: string[] = this.scene.textures
    .get(VerticalReel.ATLAS_KEY)
    .getFrameNames(false);

  selectedOptionIndex: number = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, VerticalReel.ATLAS_KEY, 0);

    this.addToScene()
      .setOrigin(0.5)
      .setScale(0.2)
      .setInteractive({ cursor: "pointer" })
      .on(Phaser.Input.Events.POINTER_DOWN, this.handleClick);
  }

  private handleClick = () => {
    this.selectedOptionIndex =
      (this.selectedOptionIndex + 1) % this.options.length;
    this.setFrame(this.selectedOption);
  };

  get selectedOption() {
    return this.options[this.selectedOptionIndex];
  }

  private addToScene() {
    return this.scene.add.existing(this);
  }
}
