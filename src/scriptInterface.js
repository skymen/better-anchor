function getScriptInterface(parentClass, map) {
  return class extends parentClass {
    constructor() {
      super();
      map.set(this, parentClass._GetInitInst().GetSdkInstance());
      this.CONSTRAINT = {
        ABSOLUTE: 0,
        PERCENTAGE: 1,
        NO_OFFSET: 2,
      };
      this.HORIZONTAL_EDGE = {
        LEFT: 0,
        CENTER: 1,
        RIGHT: 2,
        NONE: 3,
      };
      this.VERTICAL_EDGE = {
        TOP: 0,
        CENTER: 1,
        BOTTOM: 2,
        NONE: 3,
      };
      this.RESIZE_MODE = {
        STRETCH: 1,
        CONTAIN: 2,
        COVER: 3,
      };
      this.ANCHOR_PARENT = {
        PARENT: 0,
        VIEWPORT: 1,
      };
    }
  };
}
