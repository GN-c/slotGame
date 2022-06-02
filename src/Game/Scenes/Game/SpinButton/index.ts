export default class SpinButton extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "Spin");

    this.addToScene()
      .setAlpha(0.5)
      .setInteractive({ cursor: "pointer" })
      .on(Phaser.Input.Events.POINTER_OVER, this.handlePointerOver)
      .on(Phaser.Input.Events.POINTER_OUT, this.handlePointerOut);
  }

  private animateAlphaTo(alpha: number, duration: number = 100) {
    this.scene.add.tween({
      targets: this,
      /** Since we're only tinting to grey, we can simply multiply all components of  */
      alpha: alpha,
      duration,
    });
  }

  private handlePointerOver = () => {
    this.animateAlphaTo(1);
  };
  private handlePointerOut = () => {
    this.animateAlphaTo(0.5);
  };

  setActive(value: boolean): this {
    if (this.active == value) return this;

    if (value == false) this.disableInteractive().animateAlphaTo(0.5);
    else this.setInteractive();

    return super.setActive(value);
  }

  private addToScene() {
    return this.scene.add.existing(this);
  }
}
