/*!
 * Based on material-web ripple <https://github.com/material-components/material-web/blob/master/ripple/lib/ripple.ts>
 *
 * Copyright 2021 Google LLC
 * Released under the Apache-2.0 license.
 */

import type SparkleEvent from "../../core/SparkleEvent";
import SparkleElement from "../../core/sparkle-element";
import { getDimensions } from "../../utils/getDimensions";
import css from "./ripple.css";
import html from "./ripple.html";

const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const PRESS_PSEUDO = "::after";
const PRESS_EASE = "cubic-bezier(0.2, 0, 0, 1)";
const ANIMATION_FILL = "forwards";

/**
 * Interaction states for the ripple.
 *
 * On Touch:
 *  - `INACTIVE -> TOUCH_DELAY -> WAITING_FOR_CLICK -> INACTIVE`
 *  - `INACTIVE -> TOUCH_DELAY -> HOLDING -> WAITING_FOR_CLICK -> INACTIVE`
 *
 * On Mouse or Pen:
 *   - `INACTIVE -> WAITING_FOR_CLICK -> INACTIVE`
 */
enum State {
  /**
   * Initial state of the control, no touch in progress.
   *
   * Transitions:
   *   - on touch down: transition to `TOUCH_DELAY`.
   *   - on mouse down: transition to `WAITING_FOR_CLICK`.
   */
  INACTIVE,
  /**
   * Touch down has been received, waiting to determine if it's a swipe or
   * scroll.
   *
   * Transitions:
   *   - on touch up: begin press; transition to `WAITING_FOR_CLICK`.
   *   - on cancel: transition to `INACTIVE`.
   *   - after `TOUCH_DELAY_MS`: begin press; transition to `HOLDING`.
   */
  TOUCH_DELAY,
  /**
   * A touch has been deemed to be a press
   *
   * Transitions:
   *  - on up: transition to `WAITING_FOR_CLICK`.
   */
  HOLDING,
  /**
   * The user touch has finished, transition into rest state.
   *
   * Transitions:
   *   - on click end press; transition to `INACTIVE`.
   */
  WAITING_FOR_CLICK,
  /**
   * The user touch has activated a click with their keyboard.
   */
  KEYBOARD_PRESS,
}

/**
 * Delay reacting to touch so that we do not show the ripple for a swipe or
 * scroll interaction.
 */
const TOUCH_DELAY_MS = 150;

const styles = new CSSStyleSheet();

const HOVERED_EVENT = "hovered";
const UNHOVERED_EVENT = "unhovered";
const PRESSED_EVENT = "pressed";
const UNPRESSED_EVENT = "unpressed";

/**
 * A ripple component.
 */
export default class Ripple extends SparkleElement {
  static override tagName = "s-ripple";

  static override async define(
    tagName?: string,
    dependencies?: Record<string, string>,
    useShadowDom = true
  ): Promise<CustomElementConstructor> {
    return super.define(tagName, dependencies, useShadowDom);
  }

  override get html() {
    return html;
  }

  override get styles() {
    styles.replaceSync(Ripple.augmentCss(css));
    return [styles];
  }

  private _hovered = false;
  get hovered(): boolean {
    return this._hovered;
  }
  set hovered(value: boolean) {
    this._hovered = value;
    if (value) {
      this.emit(HOVERED_EVENT);
    } else {
      this.emit(UNHOVERED_EVENT);
    }
  }

  private _pressed = false;
  get pressed(): boolean {
    return this._pressed;
  }
  set pressed(value: boolean) {
    this._pressed = value;
    this.updateRootClass("pressed", value);
    if (value) {
      this.emit(PRESSED_EVENT);
    } else {
      this.emit(UNPRESSED_EVENT);
    }
  }

  private rippleSize = "";
  private rippleScale = "";
  private initialSize = 0;
  private growAnimation?: Animation;
  private state = State.INACTIVE;
  private pointerInitiated = false;
  private startPointX = 0;
  private startPointY = 0;
  private endPointX = 0;
  private endPointY = 0;

  protected override onAttributeChanged(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === SparkleElement.attributes.hidden) {
      if (newValue != null) {
        this.pressed = false;
      }
    }
  }

  handleMouseDown = async (event: MouseEvent) => {
    if (event.target !== this) {
      return;
    }

    this.updateAnimationPosition(event);

    this.state = State.WAITING_FOR_CLICK;
    this.pointerInitiated = true;
    this.startPressAnimation();
  };

  handleTouchStart = async (event: TouchEvent) => {
    if (event.target !== this) {
      return;
    }

    this.updateAnimationPosition(event);

    // Wait for a hold after touch delay
    this.state = State.TOUCH_DELAY;

    await new Promise((resolve) => {
      setTimeout(resolve, TOUCH_DELAY_MS);
    });
    if (this.state !== State.TOUCH_DELAY) {
      return;
    }

    this.state = State.HOLDING;
    this.pointerInitiated = true;
    this.startPressAnimation();
  };

  handleClick = async () => {
    if (this.pointerInitiated) {
      this.endPressAnimation();
    } else {
      // keyboard synthesized click event
      this.state = State.KEYBOARD_PRESS;
      this.updateAnimationPosition();
      await this.startPressAnimation();
      if (this.state !== State.KEYBOARD_PRESS) {
        return;
      }
      this.endPressAnimation();
    }
  };

  handlePointerLeave = (event: PointerEvent) => {
    this.endPressAnimation();
  };

  handlePointerUp = (event: PointerEvent) => {
    this.endPressAnimation();
  };

  bind(element: HTMLElement) {
    element.addEventListener("click", this.handleClick);
    element.addEventListener("mousedown", this.handleMouseDown);
    element.addEventListener("touchstart", this.handleTouchStart);
    element.addEventListener("pointerleave", this.handlePointerLeave);
    element.addEventListener("pointerup", this.handlePointerUp);
    window.addEventListener("pointerup", this.handlePointerUp);
  }

  unbind(element: HTMLElement) {
    element.removeEventListener("click", this.handleClick);
    element.removeEventListener("mousedown", this.handleMouseDown);
    element.removeEventListener("touchstart", this.handleTouchStart);
    element.removeEventListener("pointerleave", this.handlePointerLeave);
    element.removeEventListener("pointerup", this.handlePointerUp);
    window.removeEventListener("pointerup", this.handlePointerUp);
  }

  private determineRippleSize() {
    const { height, width } = getDimensions(this);
    const maxDim = Math.max(height, width);
    const softEdgeSize = Math.max(
      SOFT_EDGE_CONTAINER_RATIO * maxDim,
      SOFT_EDGE_MINIMUM_SIZE
    );

    let maxRadius = maxDim;
    let initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);

    const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
    maxRadius = hypotenuse + PADDING;

    this.initialSize = initialSize;
    this.rippleScale = `${(maxRadius + softEdgeSize) / initialSize}`;
    this.rippleSize = `${this.initialSize}px`;
  }

  private updateAnimationPosition(
    pointerEvent?: TouchEvent | MouseEvent | PointerEvent
  ) {
    const { height, width } = getDimensions(this);

    let pointerPos = {
      x: width / 2,
      y: height / 2,
    };
    if (pointerEvent) {
      const { scrollX, scrollY } = window;
      const { left, top } = getDimensions(this);
      const documentX = scrollX + left;
      const documentY = scrollY + top;
      let pageX: number | undefined;
      let pageY: number | undefined;
      if (pointerEvent instanceof TouchEvent) {
        const touch = pointerEvent.targetTouches?.[0];
        pageX = touch?.pageX;
        pageY = touch?.pageY;
      } else {
        pageX = pointerEvent?.pageX;
        pageY = pointerEvent?.pageY;
      }
      if (pageX != null && pageY != null) {
        pointerPos = { x: pageX - documentX, y: pageY - documentY };
      }
    }

    // center around start point
    this.startPointX = pointerPos.x - this.initialSize / 2;
    this.startPointY = pointerPos.y - this.initialSize / 2;

    // end in the center
    this.endPointX = (width - this.initialSize) / 2;
    this.endPointY = (height - this.initialSize) / 2;
  }

  private startPressAnimation() {
    this.pressed = true;
    this.growAnimation?.cancel();
    this.determineRippleSize();
    const translateStart = `${this.startPointX}px, ${this.startPointY}px`;
    const translateEnd = `${this.endPointX}px, ${this.endPointY}px`;

    this.growAnimation = this.root.animate(
      {
        top: [0, 0],
        left: [0, 0],
        height: [this.rippleSize, this.rippleSize],
        width: [this.rippleSize, this.rippleSize],
        transform: [
          `translate(${translateStart}) scale(1)`,
          `translate(${translateEnd}) scale(${this.rippleScale})`,
        ],
      },
      {
        pseudoElement: PRESS_PSEUDO,
        duration: PRESS_GROW_MS,
        easing: PRESS_EASE,
        fill: ANIMATION_FILL,
      }
    );

    return this.growAnimation.finished;
  }

  private async endPressAnimation() {
    const animation = this.growAnimation;
    const pressAnimationPlayState = animation?.currentTime ?? Infinity;
    if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
      this.pressed = false;
      this.state = State.INACTIVE;
      return;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState);
    });

    if (this.growAnimation !== animation) {
      // A new press animation was started. The old animation was canceled and
      // should not finish the pressed state.
      return;
    }

    this.pressed = false;
    this.state = State.INACTIVE;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "s-ripple": Ripple;
  }
  interface HTMLElementEventMap {
    hovered: SparkleEvent;
    unhovered: SparkleEvent;
    pressed: SparkleEvent;
    unpressed: SparkleEvent;
  }
}
