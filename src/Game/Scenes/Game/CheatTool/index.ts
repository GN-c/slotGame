import ItemSelector from "./ItemSelector";

export default class CheatTool extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Image;
  private readonly minimizeText: Phaser.GameObjects.Text;
  private readonly minimizeArrow: Phaser.GameObjects.Image;
  private readonly itemSelectors: ItemSelector[];

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.addToScene();

    /**
     * Create Background
     */
    this.background = this.scene.add
      .image(0, 0, "CheatToolBackground")
      .setOrigin(0);
    this.add(this.background);

    /**
     * Add `Tools` text and arrow
     */
    this.minimizeText = this.scene.add
      .text(50, 240, "Tools", {
        color: "white",
        fontSize: "32px",
        fontStyle: "bold",
      })
      .setOrigin(0, 1);
    this.add(this.minimizeText);

    this.minimizeArrow = this.scene.add
      .image(160, 235, "Arrow")
      .setOrigin(0, 1)
      .setFlipY(true)
      .setInteractive({ cursor: "pointer" })
      .on(Phaser.Input.Events.POINTER_DOWN, this.handleMinimize);
    this.add(this.minimizeArrow);

    /**
     * Add slot item selectors
     */
    this.itemSelectors = [
      new ItemSelector(this.scene).setPosition(100, 100),
      new ItemSelector(this.scene).setPosition(230, 100),
      new ItemSelector(this.scene).setPosition(360, 100),
    ];
    this.add(this.itemSelectors);
  }

  get selectedItems() {
    return this.itemSelectors.map((selector) => selector.selectedOption);
  }

  minimized = false;
  setMinimize(value: boolean): this {
    if (value == this.minimized) return this;

    this.minimized = value;
    this.scene.add.tween({
      targets: this,
      y: value ? -200 : 0,
      duration: 200,
      onStart: () => this.minimizeArrow.disableInteractive().setFlipY(!value),
      onComplete: () => this.minimizeArrow.setInteractive(),
    });

    return this;
  }

  private handleMinimize = () => {
    this.setMinimize(!this.minimized);
  };

  private addToScene() {
    return this.scene.add.existing(this);
  }
}
