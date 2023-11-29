function getInstanceJs(parentClass, scriptInterface, addonTriggers, C3) {
  return class extends parentClass {
    constructor(inst, properties) {
      super(inst);
      this._enabled = true;
      this._anchorTop = 0;
      this._anchorLeft = 0;
      this._anchorRight = 3;
      this._anchorBottom = 3;
      this._anchorParent = 0;
      this._resizeMode = 0;

      this._left = 0;
      this._top = 0;
      this._right = 0;
      this._bottom = 0;
      this._minWidth = 0;
      this._minHeight = 0;

      this._leftMode = 0;
      this._topMode = 0;
      this._rightMode = 0;
      this._bottomMode = 0;

      this._needUpdateXY = false;
      this.parentAngle = 0;
      if (properties) {
        this._resizeMode = properties[0];

        this._anchorLeft = properties[1];
        this._leftMode = properties[2];

        this._anchorTop = properties[3];
        this._topMode = properties[4];

        this._anchorRight = properties[5];
        this._rightMode = properties[6];

        this._anchorBottom = properties[7];
        this._bottomMode = properties[8];

        this._anchorParent = properties[9];
        this._enabled = properties[10];
      }

      const rt = this._runtime.Dispatcher();
      this._disposables = new C3.CompositeDisposable(
        C3.Disposable.From(rt, "layoutchange", () => this._OnLayoutChange())
      );
      this._SetXYOffsets();
      if (this._enabled) {
        this._StartTicking();
        this._StartTicking2();
        if (this._anchorParent === 0) {
          this._needUpdateXY = true;
        }
      }
    }

    Release() {
      super.Release();
    }

    SaveToJson() {
      return {
        enabled: this._enabled,
        anchorTop: this._anchorTop,
        anchorLeft: this._anchorLeft,
        anchorRight: this._anchorRight,
        anchorBottom: this._anchorBottom,
        anchorParent: this._anchorParent,
        resizeMode: this._resizeMode,
        left: this._left,
        top: this._top,
        right: this._right,
        bottom: this._bottom,
        leftMode: this._leftMode,
        topMode: this._topMode,
        rightMode: this._rightMode,
        bottomMode: this._bottomMode,
        minWidth: this._minWidth,
        minHeight: this._minHeight,
        needUpdateXY: this._needUpdateXY,
      };
    }

    LoadFromJson(o) {
      // load state for savegames
      this._enabled = o.enabled;
      this._anchorTop = o.anchorTop;
      this._anchorLeft = o.anchorLeft;
      this._anchorRight = o.anchorRight;
      this._anchorBottom = o.anchorBottom;
      this._anchorParent = o.anchorParent;
      this._resizeMode = o.resizeMode;
      this._left = o.left;
      this._top = o.top;
      this._right = o.right;
      this._bottom = o.bottom;
      this._leftMode = o.leftMode;
      this._topMode = o.topMode;
      this._rightMode = o.rightMode;
      this._bottomMode = o.bottomMode;
      this._minWidth = o.minWidth;
      this._minHeight = o.minHeight;
      this._needUpdateXY = o.needUpdateXY;
    }

    _IsParentViewport() {
      return this._anchorParent === 1 || !this._inst.GetWorldInfo().HasParent();
    }

    _OnLayoutChange() {
      this._UpdatePosition();
    }

    Trigger(method) {
      super.Trigger(method);
      const addonTrigger = addonTriggers.find((x) => x.method === method);
      if (addonTrigger) {
        this.GetScriptInterface().dispatchEvent(new C3.Event(addonTrigger.id));
      }
    }

    GetScriptInterfaceClass() {
      return scriptInterface;
    }

    Tick() {
      this._UpdatePosition();
    }

    Tick2() {
      this._UpdatePosition();
    }

    _GetParentBBox() {
      const wi = this._inst.GetWorldInfo();
      if (this._IsParentViewport()) {
        this.parentAngle = 0;
        return wi.GetLayer().GetViewport();
      }
      const parent = wi.GetParent();
      this.parentAngle = parent.GetAngle();
      return parent.GetBoundingBox();
    }

    _CalculateAnchorValue(selfPos, parentPos, parentSize, mode) {
      switch (mode) {
        case 0: // absolute
          return selfPos - parentPos;
        case 1: // percentage
          return (selfPos - parentPos) / parentSize;
        case 2: // no offset
          return 0;
      }
    }

    _CalculateChildPosition(offset, constraint, parentPos, parentSize) {
      switch (constraint) {
        case 0: // absolute
          return parentPos + offset;
        case 1: // percentage
          return parentPos + offset * parentSize;
        case 2: // no offset
          return parentPos;
      }
    }

    _GetParentAnchorValue(anchor, parentBbox, direction) {
      const left = direction === 0 ? parentBbox.getLeft() : parentBbox.getTop();
      const right =
        direction === 0 ? parentBbox.getRight() : parentBbox.getBottom();
      const center = direction === 0 ? parentBbox.midX() : parentBbox.midY();
      const size = direction === 0 ? parentBbox.width() : parentBbox.height();
      return {
        val: [left, center, right, 0][anchor],
        size,
      };
    }

    _SetXYOffsets() {
      let parentBbox = this._GetParentBBox();
      if (!parentBbox) return;

      const wi = this._inst.GetWorldInfo();
      const bbox = wi.GetBoundingBox();

      const leftParentAnchor = this._GetParentAnchorValue(
        this._anchorLeft,
        parentBbox,
        0
      );
      this._left = this._CalculateAnchorValue(
        bbox.getLeft(),
        leftParentAnchor.val,
        leftParentAnchor.size,
        this._leftMode
      );

      const topParentAnchor = this._GetParentAnchorValue(
        this._anchorTop,
        parentBbox,
        1
      );
      this._top = this._CalculateAnchorValue(
        bbox.getTop(),
        topParentAnchor.val,
        topParentAnchor.size,
        this._topMode
      );

      const rightParentAnchor = this._GetParentAnchorValue(
        this._anchorRight,
        parentBbox,
        0
      );
      this._right = this._CalculateAnchorValue(
        bbox.getRight(),
        rightParentAnchor.val,
        rightParentAnchor.size,
        this._rightMode
      );

      const bottomParentAnchor = this._GetParentAnchorValue(
        this._anchorBottom,
        parentBbox,
        1
      );
      this._bottom = this._CalculateAnchorValue(
        bbox.getBottom(),
        bottomParentAnchor.val,
        bottomParentAnchor.size,
        this._bottomMode
      );

      this._minWidth = bbox.width();
      this._minHeight = bbox.height();
    }

    _UpdatePosition() {
      if (!this._enabled) return;
      if (this._needUpdateXY) {
        this._SetXYOffsets();
        this._needUpdateXY = false;
      }
      const parentBbox = this._GetParentBBox();
      if (!parentBbox) return;
      const wi = this._inst.GetWorldInfo();

      let leftEdge = 0;
      let topEdge = 0;
      let rightEdge = 0;
      let bottomEdge = 0;

      if (this._anchorLeft !== 3) {
        const leftParentAnchor = this._GetParentAnchorValue(
          this._anchorLeft,
          parentBbox,
          0
        );
        leftEdge = this._CalculateChildPosition(
          this._left,
          this._leftMode,
          leftParentAnchor.val,
          leftParentAnchor.size
        );
      } else {
        leftEdge = wi.GetBoundingBox().getLeft();
      }

      if (this._anchorTop !== 3) {
        const topParentAnchor = this._GetParentAnchorValue(
          this._anchorTop,
          parentBbox,
          1
        );
        topEdge = this._CalculateChildPosition(
          this._top,
          this._topMode,
          topParentAnchor.val,
          topParentAnchor.size
        );
      } else {
        topEdge = wi.GetBoundingBox().getTop();
      }
      if (this._anchorRight !== 3) {
        const rightParentAnchor = this._GetParentAnchorValue(
          this._anchorRight,
          parentBbox,
          0
        );
        rightEdge = this._CalculateChildPosition(
          this._right,
          this._rightMode,
          rightParentAnchor.val,
          rightParentAnchor.size
        );
      } else {
        rightEdge = wi.GetBoundingBox().getLeft() + this._minWidth;
      }

      if (this._anchorBottom !== 3) {
        const bottomParentAnchor = this._GetParentAnchorValue(
          this._anchorBottom,
          parentBbox,
          1
        );
        bottomEdge = this._CalculateChildPosition(
          this._bottom,
          this._bottomMode,
          bottomParentAnchor.val,
          bottomParentAnchor.size
        );
      } else {
        bottomEdge = wi.GetBoundingBox().getTop() + this._minHeight;
      }

      let newWidth = rightEdge - leftEdge;
      let newHeight = bottomEdge - topEdge;

      if (this._resizeMode === 1) {
        // contain
        const widthRatio = this._minWidth / newWidth;
        const heightRatio = this._minHeight / newHeight;
        const ratio = Math.max(widthRatio, heightRatio);
        leftEdge += (newWidth - this._minWidth / ratio) / 2;
        topEdge += (newHeight - this._minHeight / ratio) / 2;
        newWidth = this._minWidth / ratio;
        newHeight = this._minHeight / ratio;
      } else if (this._resizeMode === 2) {
        // cover
        const widthRatio = this._minWidth / newWidth;
        const heightRatio = this._minHeight / newHeight;
        const ratio = Math.min(widthRatio, heightRatio);
        leftEdge += (newWidth - this._minWidth / ratio) / 2;
        topEdge += (newHeight - this._minHeight / ratio) / 2;
        newWidth = this._minWidth / ratio;
        newHeight = this._minHeight / ratio;
      }

      wi.SetSize(newWidth, newHeight);

      let x = newWidth * wi.GetOriginX();
      let y = newHeight * wi.GetOriginY();

      // set position but rotate with parent angle
      const cos = Math.cos(this.parentAngle);
      const sin = Math.sin(this.parentAngle);
      const x2 = x * cos - y * sin;
      const y2 = x * sin + y * cos;
      wi.SetXY(leftEdge + x, topEdge + y);
      //wi.SetAngle(this.parentAngle);
      wi.SetBboxChanged();
    }

    // ACTS
    _SetEnabled(enabled) {
      this._enabled = enabled;
      if (this._enabled) {
        this._SetXYOffsets();
        this._StartTicking();
        this._StartTicking2();
      } else {
        this._StopTicking();
        this._StopTicking2();
      }
    }
    _SetLeftOffset(offset, constraint) {
      this._left = offset;
      this._leftMode = constraint;
    }
    _SetTopOffset(offset, constraint) {
      this._top = offset;
      this._topMode = constraint;
    }
    _SetRightOffset(offset, constraint) {
      this._right = offset;
      this._rightMode = constraint;
    }
    _SetBottomOffset(offset, constraint) {
      this._bottom = offset;
      this._bottomMode = constraint;
    }
    _SetLeftEdge(value) {
      this._anchorLeft = value;
    }
    _SetTopEdge(value) {
      this._anchorTop = value;
    }
    _SetRightEdge(value) {
      this._anchorRight = value;
    }
    _SetBottomEdge(value) {
      this._anchorBottom = value;
    }
    _SetResizeMode(mode) {
      this._resizeMode = mode;
    }
    _SetAnchorTo(value) {
      this._anchorParent = value;
    }

    //CNDS
    _IsEnabled() {
      return this._enabled;
    }

    //EXPS

    _Left() {
      return this._left;
    }
    _Top() {
      return this._top;
    }
    _Right() {
      return this._right;
    }
    _Bottom() {
      return this._bottom;
    }
  };
}
