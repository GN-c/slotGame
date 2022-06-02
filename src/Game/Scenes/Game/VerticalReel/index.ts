import MotionBlurFX from "../MotionBlurFX";

/**
 * Define reel simply by specifying target area, item population & infinite scrolling and everything else is handle by VerticalReel
 *
 * Use Object pooling to optimize performance by reusing Phaser gameobjects when spinning
 */
export default class VerticalReel extends Phaser.GameObjects.Group {
  public static readonly ATLAS_KEY = "fruits";
  public static readonly SPACING = 40;
  public static readonly BLUR_SCALE = 23;

  private static readonly dummyRect = new Phaser.Geom.Rectangle();

  /** Retrieve all frame names from atlas */
  private readonly itemNames = this.scene.textures
    .get(VerticalReel.ATLAS_KEY)
    .getFrameNames(false);

  /** We assume that all items are same size to simplify calculations */
  private readonly itemSize = this.scene.textures.getFrame(
    VerticalReel.ATLAS_KEY,
    0
  ) as { [key in "width" | "height"]: number };

  /** Calculate distance between items */
  private readonly gap = this.itemSize.height + VerticalReel.SPACING;

  /**
   * Special object passed as pipeline data
   */
  private readonly blurData = { blurScale: 0 };

  /**
   * Calculate how many items fit in target area
   *
   * it should be always odd number, since we have to focus only on one item
   */
  private readonly numberOfItems =
    Math.ceil(this.targetArea.height / this.gap) | 1;

  private targetItem?: string;
  private itemsUntillTarget: number = Infinity;

  /**
   * Create Geometric mask to hide oveflow
   */
  private readonly mask = new Phaser.Display.Masks.GeometryMask(
    this.scene,
    this.scene.make.graphics({}, false).fillRectShape(this.targetArea)
  );

  private tween?: Phaser.Tweens.Tween;

  constructor(
    scene: Phaser.Scene,
    private readonly targetArea: Phaser.Geom.Rectangle
  ) {
    super(scene, { classType: Phaser.GameObjects.Image });
    this.populate();
  }

  private getItem() {
    return (
      (this.get(0, 0, VerticalReel.ATLAS_KEY) as Phaser.GameObjects.Image)
        .setPosition(this.targetArea.centerX, this.targetArea.centerY)
        .setMask(this.mask)
        .setFrame(
          --this.itemsUntillTarget == 0 && this.targetItem
            ? this.targetItem
            : this.randomItemKey
        )
        /** Change pipeline to support for motion blur  */
        .setPipeline(MotionBlurFX.KEY, this.blurData)
        .setOrigin(0.5)
        .setActive(true)
        .setVisible(true)
    );
  }

  /**
   * Spawn first batch of items
   */
  private populate() {
    for (let i = 0; i < this.numberOfItems; i++)
      this.getItem().setY(
        this.targetArea.centerY + (i - (this.numberOfItems - 1) / 2) * this.gap
      );
  }

  /**
   * Spin reel with animation
   * @param itemsToScroll how many items to scroll? can't be lower than half of visible items
   * @param duration total spin duration
   * @param targetItem spin to specific item?
   * @returns this
   */
  public spin(itemsToScroll: number, duration: number, targetItem?: string) {
    (this.itemsUntillTarget = Math.max(
      1,
      itemsToScroll - (this.numberOfItems - 1) / 2
    )),
      (this.targetItem = targetItem);

    /**
     * Create tween to scroll reel
     */
    if (!this.tween?.isPlaying())
      this.tween = this.scene.tweens.addCounter({
        duration,
        from: 0,
        to:
          Math.max(itemsToScroll, (this.numberOfItems - 1) / 2 + 1) * this.gap,
        onUpdate: (tween) => {
          const deltaY = tween.data[0].current! - tween.data[0].previous!;
          this.update(deltaY);
          /** Update blur shader */
          this.blurData.blurScale =
            VerticalReel.BLUR_SCALE * (1 - tween.progress);
        },
        ease: Phaser.Math.Easing.Cubic.Out,
      });

    return this;
  }

  private update(deltaY: number) {
    this.updateStack();
    /** Move items downward */
    this.incY(deltaY);

    /**
     * Test that the least amount of objects is created and used
     */
    // console.log(this.activeItems.length);
  }

  private updateStack() {
    let top = Infinity;
    const activeItems = this.activeItems;

    /**
     * Loop through active items and remove them if they're below target area
     */
    activeItems.forEach((item) => {
      const itemBounds = item.getBounds(VerticalReel.dummyRect);
      top = Math.min(top, itemBounds.top);
      if (itemBounds.top > this.targetArea.bottom) {
        this.killAndHide(item);
      }
    });

    /**
     * Iterate until the space between the top item in stack and targetArea's top edge is filled with items
     */
    while (top > this.targetArea.top) {
      this.getItem().setY(
        top - VerticalReel.SPACING - this.itemSize.height / 2
      );
      top -= this.gap;
    }

    return this;
  }

  /**
   * Simply find the closest item to target area's center
   */
  get activeItem() {
    let minDist = Infinity,
      centerY = this.targetArea.centerY,
      activeItems = this.activeItems,
      activeItem: Phaser.GameObjects.Image;
    for (let i = 0; i < activeItems.length; i++) {
      const dist = Math.abs(activeItems[i].y - centerY);
      if (dist < minDist) {
        activeItem = activeItems[i];
        minDist = dist;
      }
    }
    return activeItem!;
  }

  get activeItemName() {
    return this.activeItem.frame.name;
  }

  /**
   * Return All active items
   */
  get activeItems() {
    return this.getChildren().filter(
      (child) => child.active
    ) as Phaser.GameObjects.Image[];
  }

  get randomItemKey() {
    return Phaser.Math.RND.pick(this.itemNames);
  }

  debugTargetArea() {
    const rect = this.scene.add
      .rectangle(
        this.targetArea.x,
        this.targetArea.y,
        this.targetArea.width,
        this.targetArea.height
      )
      .setDepth(Infinity)
      .setStrokeStyle(4, 0xff0000)
      .setOrigin(0);
    rect.isFilled = false;

    return this;
  }
}
