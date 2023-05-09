import SparkleEvent from "../../core/SparkleEvent";
import SparkleElement from "../../core/sparkle-element";
import Animations from "../../helpers/animations";
import { animateTo, parseDuration, stopAnimations } from "../../utils/animate";
import { waitForEvent } from "../../utils/events";
import type Popup from "../popup/popup";
import css from "./tooltip.css";
import html from "./tooltip.html";

const styles = new CSSStyleSheet();
styles.replaceSync(css);

const closingEvent = new SparkleEvent("closing");
const closedEvent = new SparkleEvent("closed");
const openingEvent = new SparkleEvent("opening");
const openedEvent = new SparkleEvent("opened");

export const DEFAULT_TOOLTIP_DEPENDENCIES = {
  "s-popup": "s-popup",
};

/**
 * Tooltips display additional information based on a specific action.
 */
export default class Tooltip extends SparkleElement {
  static override dependencies = DEFAULT_TOOLTIP_DEPENDENCIES;

  static override async define(
    tag = "s-tooltip",
    dependencies = DEFAULT_TOOLTIP_DEPENDENCIES
  ): Promise<CustomElementConstructor> {
    return super.define(tag, dependencies);
  }

  override get html(): string {
    return Tooltip.augment(html, DEFAULT_TOOLTIP_DEPENDENCIES);
  }

  override get styles(): CSSStyleSheet[] {
    return [styles];
  }

  static override get observedAttributes() {
    return [
      ...super.observedAttributes,
      "content",
      "placement",
      "open",
      "distance",
      "skidding",
      "trigger",
      "hoist",
    ];
  }

  private hoverTimeout?: number;

  get anchorSlot(): HTMLSlotElement | null {
    return this.getElementByClass<HTMLSlotElement>("anchor");
  }

  get bodyEl(): HTMLElement | null {
    return this.getElementByClass("body");
  }

  get popup(): Popup | null {
    return this.root as Popup;
  }

  /**
   * The tooltip's content. If you need to display HTML, use the `content` slot instead.
   */
  get content(): string | null {
    return this.getStringAttribute("content");
  }

  /**
   * The preferred placement of the tooltip. Note that the actual placement may vary as needed to keep the tooltip
   * inside of the viewport.
   */
  get placement():
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | null {
    return this.getStringAttribute("placement");
  }

  /**
   * Indicates whether or not the tooltip is open. You can use this in lieu of the show/hide methods.
   */
  get open(): boolean {
    return this.getBooleanAttribute("open");
  }
  set open(value: boolean) {
    this.setBooleanAttribute("open", value);
  }

  /**
   * The distance in pixels from which to offset the tooltip away from its target.
   *
   * Default is `8`.
   */
  get distance(): number | null {
    return this.getNumberAttribute("distance");
  }

  /**
   * The distance in pixels from which to offset the tooltip along its target.
   */
  get skidding(): number | null {
    return this.getNumberAttribute("skidding");
  }

  /**
   * Controls how the tooltip is activated. Possible options include `click`, `hover`, `focus`, and `manual`. Multiple
   * options can be passed by separating them with a space. When manual is used, the tooltip must be activated
   * programmatically.
   *
   * Default is `hover focus`.
   */
  get trigger(): string | null {
    return this.getStringAttribute("trigger") || "hover focus";
  }

  /**
   * Enable this option to prevent the tooltip from being clipped when the component is placed inside a container with
   * `overflow: auto|hidden|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all,
   * scenarios.
   */
  get hoist(): boolean {
    return this.getBooleanAttribute("hoist");
  }

  protected override onAttributeChanged(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    const bodyEl = this.bodyEl;
    if (name === "content") {
      if (bodyEl) {
        bodyEl.textContent = newValue;
      }
    }
    if (name === "open") {
      this.updateRootClass("open", newValue);
      if (bodyEl) {
        bodyEl.setAttribute("aria-live", newValue != null ? "polite" : "off");
      }
      this.handleOpenChange();
    }
    if (name === "placement") {
      this.updateRootAttribute(name, newValue);
    }
    if (name === "distance") {
      this.updateRootAttribute(name, newValue);
    }
    if (name === "skidding") {
      this.updateRootAttribute(name, newValue);
    }
    if (name === "hoist") {
      this.updateRootAttribute(
        "strategy",
        newValue != null ? "fixed" : "absolute"
      );
    }
    if (
      name === "content" ||
      name === "distance" ||
      name === "hoist" ||
      name === "placement" ||
      name === "skidding"
    ) {
      this.popup?.reposition();
    }
    if (name === "disabled") {
      if (this.disabled && this.open) {
        this.close();
      }
    }
  }

  protected override onConnected(): void {
    this.addEventListener("blur", this.handleBlur, true);
    this.addEventListener("focus", this.handleFocus, true);
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
    this.addEventListener("mouseover", this.handleMouseOver);
    this.addEventListener("mouseout", this.handleMouseOut);
  }

  protected override onParsed(): void {
    const bodyEl = this.bodyEl;
    if (bodyEl) {
      bodyEl.hidden = !this.open;
    }
    const popup = this.popup;
    if (popup) {
      // If the tooltip is visible on init, update its position
      if (this.open) {
        popup.active = true;
        popup.reposition();
      }
    }
  }

  protected override onDisconnected(): void {
    this.removeEventListener("blur", this.handleBlur, true);
    this.removeEventListener("focus", this.handleFocus, true);
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
    this.removeEventListener("mouseover", this.handleMouseOver);
    this.removeEventListener("mouseout", this.handleMouseOut);
  }

  private handleBlur = (): void => {
    if (this.hasTrigger("focus")) {
      this.close();
    }
  };

  private handleClick = (): void => {
    if (this.hasTrigger("click")) {
      if (this.open) {
        this.close();
      } else {
        this.show();
      }
    }
  };

  private handleFocus = (): void => {
    if (this.hasTrigger("focus")) {
      this.show();
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    // Pressing escape when the target element has focus should dismiss the tooltip
    if (this.open && event.key === "Escape") {
      event.stopPropagation();
      this.close();
    }
  };

  private handleMouseOver = (): void => {
    if (this.hasTrigger("hover")) {
      const delay = parseDuration(
        getComputedStyle(this).getPropertyValue("--show-delay")
      );
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = window.setTimeout(() => this.show(), delay);
    }
  };

  private handleMouseOut = (): void => {
    if (this.hasTrigger("hover")) {
      const delay = parseDuration(
        getComputedStyle(this).getPropertyValue("--hide-delay")
      );
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = window.setTimeout(() => this.close(), delay);
    }
  };

  private hasTrigger(triggerType: string) {
    const trigger = this.trigger;
    if (!trigger) {
      return false;
    }
    const triggers = trigger.split(" ");
    return triggers.includes(triggerType);
  }

  async handleOpenChange(): Promise<void> {
    const popupEl = this.popup?.rootEl;
    const bodyEl = this.bodyEl;
    const popup = this.popup;
    if (this.open) {
      if (this.disabled) {
        return;
      }

      // Show
      this.dispatchEvent(openingEvent);

      if (bodyEl) {
        await stopAnimations(bodyEl);
        bodyEl.hidden = false;
      }
      if (popup) {
        popup.active = true;
      }
      if (popupEl) {
        await animateTo(popupEl, Animations.get("enter"));
      }

      this.dispatchEvent(openedEvent);
    } else {
      // Hide
      this.dispatchEvent(closingEvent);

      if (bodyEl) {
        await stopAnimations(bodyEl);
      }
      if (popupEl) {
        await animateTo(popupEl, Animations.get("exit"));
      }
      if (popup) {
        popup.active = false;
      }
      if (bodyEl) {
        bodyEl.hidden = true;
      }

      this.dispatchEvent(closedEvent);
    }
  }

  /** Shows the tooltip. */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, "opened");
  }

  /** Hides the tooltip */
  async close() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, "closed");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "s-tooltip": Tooltip;
  }
  interface HTMLElementEventMap {
    closing: SparkleEvent;
    closed: SparkleEvent;
    opening: SparkleEvent;
    opened: SparkleEvent;
  }
}