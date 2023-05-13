import SparkleEvent from "../../core/SparkleEvent";
import SparkleElement from "../../core/sparkle-element";
import Animations from "../../helpers/animations";
import { animateTo, stopAnimations } from "../../utils/animate";
import { waitForEvent } from "../../utils/events";
import { getAttributeNameMap } from "../../utils/getAttributeNameMap";
import { getCssDurationMS } from "../../utils/getCssDurationMS";
import { getDependencyNameMap } from "../../utils/getDependencyNameMap";
import css from "./toast.css";
import html from "./toast.html";

const styles = new CSSStyleSheet();
styles.replaceSync(css);

const closingEvent = new SparkleEvent("closing");
const closedEvent = new SparkleEvent("closed");
const openingEvent = new SparkleEvent("opening");
const openedEvent = new SparkleEvent("opened");

export const DEFAULT_TOAST_DEPENDENCIES = getDependencyNameMap(["s-button"]);

export const DEFAULT_TOAST_ATTRIBUTES = getAttributeNameMap([
  "open",
  "message",
  "action",
  "timeout",
  "auto-close",
]);

/**
 * Toasts are used to display important messages inline or as alert notifications.
 */
export default class Toast extends SparkleElement {
  static override tagName = "s-toast";

  static override dependencies = { ...DEFAULT_TOAST_DEPENDENCIES };

  static override get attributes() {
    return { ...super.attributes, ...DEFAULT_TOAST_ATTRIBUTES };
  }

  static override async define(
    tagName?: string,
    dependencies = DEFAULT_TOAST_DEPENDENCIES
  ): Promise<CustomElementConstructor> {
    return super.define(tagName, dependencies);
  }

  override get html(): string {
    return Toast.augment(html, DEFAULT_TOAST_DEPENDENCIES);
  }

  override get styles(): CSSStyleSheet[] {
    return [styles];
  }

  /**
   * Indicates whether or not the toast is open. You can toggle this attribute to show and hide the toast, or you can
   * use the `show()` and `hide()` methods and this attribute will reflect the toast's open state.
   */
  get open(): boolean {
    return this.getBooleanAttribute(Toast.attributes.open);
  }
  set open(value: boolean) {
    this.setBooleanAttribute(Toast.attributes.open, value);
  }

  /**
   * The message to display inside the toast.
   */
  get message(): string | null {
    return this.getStringAttribute(Toast.attributes.message);
  }
  set message(value: string | null) {
    this.setStringAttribute(Toast.attributes.message, value);
  }

  /**
   * The label for the action button.
   *
   * (Clicking this button will dismiss the toast.)
   */
  get action(): string | null {
    return this.getStringAttribute(Toast.attributes.action);
  }
  set action(value: string | null) {
    this.setStringAttribute(Toast.attributes.action, value);
  }

  /**
   * The length of time, in milliseconds, the toast will show before closing itself.
   * If the user interacts with the toast before it closes (e.g. moves the mouse over it),
   * the timer will restart.
   *
   * Set to `none`, to make it so toast will remain indefinitely (or until the user dismisses it).
   *
   * Defaults to `4000`.
   */
  get timeout(): string | null {
    return this.getStringAttribute(Toast.attributes.timeout);
  }
  set timeout(value: string | null) {
    this.setStringAttribute(Toast.attributes.timeout, value);
  }

  get buttonEl(): HTMLButtonElement | null {
    return this.getElementByClass("button");
  }

  get closeEl(): HTMLElement | null {
    return this.getElementByClass("close");
  }

  get actionSlot(): HTMLSlotElement | null {
    return this.getElementByClass("action");
  }

  private _setup = false;

  private _autoHideTimeout?: number;

  protected override onAttributeChanged(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === Toast.attributes.color) {
      const buttonEl = this.buttonEl;
      if (buttonEl) {
        if (newValue != null) {
          buttonEl.setAttribute(name, newValue);
        } else {
          buttonEl.removeAttribute(name);
        }
      }
    }
    if (name === Toast.attributes.open) {
      const open = newValue != null;
      this.ariaHidden = open ? "false" : "true";
      const durationMS = getCssDurationMS(this.timeout, 4000);
      this.changeState(open, durationMS);
    }
    if (name === Toast.attributes.timeout) {
      const open = this.open;
      const durationMS = getCssDurationMS(newValue, 4000);
      this.restartAutoClose(open, durationMS);
    }
    if (name === Toast.attributes.message) {
      const message = newValue;
      if (message) {
        this.setAssignedToSlot(message);
      }
    }
    if (name === Toast.attributes.action) {
      const action = newValue;
      if (action) {
        this.setAssignedToSlot(action, "action");
      }
      const closeEl = this.closeEl;
      if (closeEl) {
        closeEl.hidden = action == null;
      }
    }
  }

  protected override onConnected(): void {
    const open = this.open;
    const durationMS = getCssDurationMS(this.timeout, 4000);
    this.changeState(open, durationMS);
    const message = this.message;
    if (message) {
      this.setAssignedToSlot(message);
    }
    const action = this.action;
    if (action) {
      this.setAssignedToSlot(action, "action");
    }
    const closeEl = this.closeEl;
    if (closeEl) {
      closeEl.hidden = action == null;
    }
    this.root.addEventListener("mousemove", this.handleHover);
    this.buttonEl?.addEventListener("click", this.handleButtonClick);
    this.actionSlot?.addEventListener(
      "slotchange",
      this.handleActionSlotChange
    );
  }

  protected override onDisconnected(): void {
    this.root.removeEventListener("mousemove", this.handleHover);
    this.buttonEl?.removeEventListener("click", this.handleButtonClick);
    this.actionSlot?.removeEventListener(
      "slotchange",
      this.handleActionSlotChange
    );
  }

  protected override onContentAssigned(slot: HTMLSlotElement) {
    const assignedElement = slot?.assignedElements?.()?.[0];
    if (assignedElement) {
      if (this.message == null) {
        this.setAttribute("message", "");
      }
    }
  }

  protected handleActionSlotChange = (e: Event) => {
    const slot = e.currentTarget as HTMLSlotElement;
    const assignedElement = slot?.assignedElements?.()?.[0];
    if (assignedElement) {
      if (this.action == null) {
        this.setAttribute("action", "");
      }
    }
  };

  private restartAutoClose(open: boolean, autoCloseDuration: number): void {
    clearTimeout(this._autoHideTimeout);
    if (open && autoCloseDuration >= 0 && autoCloseDuration < Infinity) {
      this._autoHideTimeout = window.setTimeout(
        () => this.close(),
        autoCloseDuration
      );
    }
  }

  private handleButtonClick = (): void => {
    this.close();
  };

  private handleHover = (): void => {
    const open = this.open;
    const durationMS = getCssDurationMS(this.timeout, 4000);
    this.restartAutoClose(open, durationMS);
  };

  protected async changeState(
    open: boolean,
    autoCloseDuration: number
  ): Promise<void> {
    if (!this._setup) {
      this._setup = true;
      if (!open) {
        // Don't show close animation if starts closed.
        this.root.hidden = true;
        this.root.style.display = "none";
        return;
      }
    }
    if (open) {
      // Show
      this.dispatchEvent(openingEvent);

      if (autoCloseDuration >= 0 && autoCloseDuration < Infinity) {
        this.restartAutoClose(open, autoCloseDuration);
      }

      await stopAnimations(this.root);
      this.root.hidden = false;
      this.root.style.display = "flex";
      await animateTo(this.root, Animations.get("enter"));

      this.dispatchEvent(openedEvent);
    } else {
      // Hide
      this.dispatchEvent(closingEvent);

      clearTimeout(this._autoHideTimeout);

      await stopAnimations(this.root);
      await animateTo(this.root, Animations.get("exit"));
      this.root.hidden = true;
      this.root.style.display = "none";

      this.dispatchEvent(closedEvent);
    }
  }

  /**
   * Shows the toast.
   */
  async show(): Promise<void> {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, "opened");
  }

  /**
   * Hides the toast
   */
  async close(): Promise<void> {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, "closed");
  }

  /**
   * Displays the toast as an alert notification.
   * When dismissed, the toast will be removed from the DOM completely.
   * By storing a reference to the toast, you can reuse it by calling this method again.
   * The returned promise will resolve after the toast is hidden.
   */
  async alert(container: HTMLElement): Promise<void> {
    return new Promise<void>((resolve) => {
      this.show();
      this.addEventListener(
        "closed",
        () => {
          container.removeChild(this);
          resolve();
        },
        { once: true }
      );
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "s-toast": Toast;
  }
  interface HTMLElementEventMap {
    closing: SparkleEvent;
    closed: SparkleEvent;
    opening: SparkleEvent;
    opened: SparkleEvent;
    removed: SparkleEvent;
  }
}
