import { Properties } from "../../../../spark-element/src/types/properties";
import getAttributeNameMap from "../../../../spark-element/src/utils/getAttributeNameMap";
import getCssDuration from "../../../../sparkle-style-transformer/src/utils/getCssDuration";
import getCssDurationMS from "../../../../sparkle-style-transformer/src/utils/getCssDurationMS";
import SparkleElement, {
  DEFAULT_SPARKLE_ATTRIBUTES,
  DEFAULT_SPARKLE_TRANSFORMERS,
} from "../../core/sparkle-element";
import { SizeName } from "../../types/sizeName";
import { animationsComplete } from "../../utils/animationsComplete";
import { getBreakpointValue } from "../../utils/getBreakpointValue";
import { getCurrentBreakpoint } from "../../utils/getCurrentBreakpoint";
import { getKeys } from "../../utils/getKeys";
import { nextAnimationFrame } from "../../utils/nextAnimationFrame";
import css from "./hidden.css";
import html from "./hidden.html";

const DEFAULT_TRANSFORMERS = {
  ...DEFAULT_SPARKLE_TRANSFORMERS,
  "hide-delay": getCssDuration,
  "show-delay": getCssDuration,
};

const DEFAULT_ATTRIBUTES = {
  ...DEFAULT_SPARKLE_ATTRIBUTES,
  ...getAttributeNameMap([
    "initial",
    "if-below",
    "if-above",
    "hide-event",
    "show-event",
    "hide-instantly",
    ...getKeys(DEFAULT_TRANSFORMERS),
  ]),
};

/**
 * Hidden is used to hide or unhide elements when a certain events are fired.
 */
export default class Hidden
  extends SparkleElement
  implements Properties<typeof DEFAULT_ATTRIBUTES>
{
  static override tagName = "s-hidden";

  static override get attributes() {
    return DEFAULT_ATTRIBUTES;
  }

  override get transformers() {
    return DEFAULT_TRANSFORMERS;
  }

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

  override get css() {
    return Hidden.augmentCss(css);
  }

  /**
   * Determines if the element is initially hidden or not.
   *
   * Defaults to `show`.
   */
  get initial(): "hide" | "show" | null {
    return this.getStringAttribute(Hidden.attributes.initial);
  }
  set initial(value) {
    this.setStringAttribute(Hidden.attributes.initial, value);
  }

  /**
   * If provided, the element will only listen for events when the width of the screen is below the specified breakpoint.
   */
  get ifBelow(): SizeName | null {
    return this.getStringAttribute(Hidden.attributes.ifBelow);
  }
  set ifBelow(value) {
    this.setStringAttribute(Hidden.attributes.ifBelow, value);
  }

  /**
   * If provided, the element will only listen for events when the width of the screen is above the specified breakpoint.
   */
  get ifAbove(): SizeName | null {
    return this.getStringAttribute(Hidden.attributes.ifAbove);
  }
  set ifAbove(value) {
    this.setStringAttribute(Hidden.attributes.ifAbove, value);
  }

  /**
   * The element will hide when this event is fired
   */
  get hideEvent(): string | null {
    return this.getStringAttribute(Hidden.attributes.hideEvent);
  }
  set hideEvent(value) {
    this.setStringAttribute(Hidden.attributes.hideEvent, value);
  }

  /**
   * The element will be shown again when this event is fired
   */
  get showEvent(): string | null {
    return this.getStringAttribute(Hidden.attributes.showEvent);
  }
  set showEvent(value) {
    this.setStringAttribute(Hidden.attributes.showEvent, value);
  }

  /**
   * The hide transition duration
   */
  get hideInstantly(): string | null {
    return this.getStringAttribute(Hidden.attributes.hideInstantly);
  }
  set hideInstantly(value) {
    this.setStringAttribute(Hidden.attributes.hideInstantly, value);
  }

  /**
   * The delay before the element is hidden
   */
  get hideDelay(): string | null {
    return this.getStringAttribute(Hidden.attributes.hideDelay);
  }
  set hideDelay(value) {
    this.setStringAttribute(Hidden.attributes.hideDelay, value);
  }

  /**
   * The delay before the element is shown again
   */
  get showDelay(): string | null {
    return this.getStringAttribute(Hidden.attributes.showDelay);
  }
  set showDelay(value) {
    this.setStringAttribute(Hidden.attributes.showDelay, value);
  }

  _breakpointValue = 0;

  _hideTransitionTimeout = 0;

  _showTransitionTimeout = 0;

  protected override onConnected(): void {
    window.addEventListener("resize", this.handleWindowResize, {
      passive: true,
    });
    const hideEvent = this.hideEvent;
    if (hideEvent) {
      window.addEventListener(hideEvent, this.handleHide);
    }
    const showEvent = this.showEvent;
    if (showEvent) {
      window.addEventListener(showEvent, this.handleShow);
    }
  }

  protected override onParsed(): void {
    this.load();
  }

  protected override onDisconnected(): void {
    window.removeEventListener("resize", this.handleWindowResize);
    const hideEvent = this.hideEvent;
    if (hideEvent) {
      window.removeEventListener(hideEvent, this.handleHide);
    }
    const showEvent = this.showEvent;
    if (showEvent) {
      window.removeEventListener(showEvent, this.handleShow);
    }
  }

  updateBreakpoint() {
    const breakpoint = getCurrentBreakpoint(window.innerWidth);
    this._breakpointValue = getBreakpointValue(breakpoint);
  }

  preConditionsSatisfied() {
    const aboveBreakpoint = this.ifAbove;
    const belowBreakpoint = this.ifBelow;
    const aboveSatisfied =
      aboveBreakpoint == null ||
      this._breakpointValue > getBreakpointValue(aboveBreakpoint);
    const belowSatisfied =
      belowBreakpoint == null ||
      this._breakpointValue < getBreakpointValue(belowBreakpoint);
    return aboveSatisfied && belowSatisfied;
  }

  async load() {
    this.updateBreakpoint();
    if (this.initial === "hide") {
      this.hide();
    } else {
      this.show();
    }
    await nextAnimationFrame();
    this.root.setAttribute("loaded", "");
  }

  async hide() {
    if (this.hideInstantly != null) {
      this.root.hidden = true;
      this.root.setAttribute("state", "hidden");
    } else {
      this.root.setAttribute("state", "hiding");
      await animationsComplete(this.root);
      this.root.hidden = true;
    }
  }

  async show() {
    this.root.hidden = false;
    this.root.setAttribute("state", "mounting");
    await animationsComplete(this.root);
    this.root.setAttribute("state", "showing");
    await animationsComplete(this.root);
    this.root.setAttribute("state", "shown");
  }

  async cancelPending() {
    if (this._hideTransitionTimeout) {
      window.clearTimeout(this._hideTransitionTimeout);
    }
    if (this._showTransitionTimeout) {
      window.clearTimeout(this._showTransitionTimeout);
    }
  }

  private handleWindowResize = (): void => {
    this.updateBreakpoint();
  };

  private handleHide = () => {
    this.cancelPending();
    const hideDelay = getCssDurationMS(this.hideDelay, 0);
    const conditionallyHide = () => {
      if (this.preConditionsSatisfied()) {
        this.hide();
      }
    };
    if (hideDelay > 0) {
      this._hideTransitionTimeout = window.setTimeout(
        conditionallyHide,
        hideDelay
      );
    } else {
      conditionallyHide();
    }
  };

  private handleShow = () => {
    this.cancelPending();
    const showDelay = getCssDurationMS(this.showDelay, 0);
    const conditionallyShow = () => {
      if (this.preConditionsSatisfied()) {
        this.show();
      }
    };
    if (showDelay > 0) {
      this._showTransitionTimeout = window.setTimeout(
        conditionallyShow,
        showDelay
      );
    } else {
      conditionallyShow();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "s-hidden": Hidden;
  }
}