import type Phaser from "phaser";
require("polyfills");

var CONST = require("const");
var Extend = require("utils/object/Extend");

/**
 * Use webpack to load only needed parts from phaser library
 * Will be configured later at the end of game
 */

var phaser = {
  Cameras: {
    Scene2D: require("cameras/2d"),
  },
  Scene: require("scene/Scene"),
  Scenes: require("scene"),
  Events: require("events/index"),
  Animations: require("animations"),
  Game: require("core/Game"),
  GameObjects: {
    DisplayList: require("gameobjects/DisplayList"),
    UpdateList: require("gameobjects/UpdateList"),

    Image: require("gameobjects/image/Image"),

    Sprite: require("gameobjects/sprite/Sprite"),
    BitmapText: require("gameobjects/bitmaptext/static/BitmapText"),

    Factories: {
      Image: require("gameobjects/image/ImageFactory"),
      Sprite: require("gameobjects/sprite/SpriteFactory"),
      BitmapText: require("gameobjects/bitmaptext/static/BitmapTextFactory"),
    },
  },

  Sound: require("sound"),

  Loader: {
    FileTypes: {
      AudioFile: require("loader/filetypes/AudioFile"),
      ImageFile: require("loader/filetypes/ImageFile"),
      SpriteSheetFile: require("loader/filetypes/SpriteSheetFile"),
      BitmapFontFile: require("loader/filetypes/BitmapFontFile"),
    },
    LoaderPlugin: require("loader/LoaderPlugin"),
  },
  Input: {
    Keyboard: require("input/keyboard"),
    InputPlugin: require("input/InputPlugin"),
    Events: require("input/events"),
  },

  Tweens: require("tweens"),

  Display: {
    Masks: require("display/mask"),
  },

  Math: {
    Easing: {
      Bounce: require("math/easing/bounce"),
      Back: require("math/easing/back"),
    },
    Between: require("math/Between"),
  },
} as unknown as typeof Phaser;
//  Merge in the consts

phaser = Extend(false, phaser, CONST);

global.Phaser = phaser;
//  Export it
export default phaser;
