import SparkleElement from "../../core/sparkle-element";
import { getCssIcon } from "../../utils/getCssIcon";
import { getCssSize } from "../../utils/getCssSize";
import type Ripple from "../ripple/ripple";
import type Spinner from "../spinner/spinner";
import css from "./button.css";
import html from "./button.html";

const styles = new CSSStyleSheet();
styles.replaceSync(css);

/**
 * Buttons represent actions that are available to the user.
 */
export default class Button extends SparkleElement {
  static dependencies = {
    badge: "s-badge",
    spinner: "s-spinner",
    ripple: "s-ripple",
  };

  static async define(
    tag = "s-button",
    dependencies = {
      badge: "s-badge",
      spinner: "s-spinner",
      ripple: "s-ripple",
    }
  ): Promise<CustomElementConstructor> {
    customElements.define(tag, this);
    if (dependencies) {
      this.dependencies = dependencies;
    }
    return customElements.whenDefined(tag);
  }

  override get styles(): CSSStyleSheet[] {
    return [styles];
  }

  override get html(): string {
    return (
      this.href
        ? html.replace("<button ", "<a ").replace("</button>", "</a>")
        : html
    )
      .replace(/s-spinner/g, Button.dependencies.spinner)
      .replace(/s-ripple/g, Button.dependencies.ripple);
  }

  static override get observedAttributes() {
    return [
      ...super.observedAttributes,
      "aria-expanded",
      "aria-haspopup",
      "href",
      "target",
      "disabled",
      "variant",
      "icon",
    ];
  }

  /**
   * The URL that the link button points to.
   */
  get href(): string | null {
    return this.getStringAttribute("href");
  }

  /**
   * Where to display the linked `href` URL for a link button. Common options
   * include `_blank` to open in a new tab.
   */
  get target(): string | null {
    return this.getStringAttribute("target");
  }

  /**
   * Determines the overall look of the button.
   */
  get variant(): "filled" | "tonal" | "outlined" | "text" | null {
    return this.getStringAttribute("variant");
  }

  /**
   * The size of the button.
   *
   * Default is `md`.
   */
  get size(): "xs" | "sm" | "md" | "lg" | null {
    return this.getStringAttribute("size");
  }

  /**
   * The spacing between the icon and the label
   */
  get spacing(): string | null {
    return this.getStringAttribute("spacing");
  }

  /**
   * The icon to display next to the label.
   */
  get icon(): string | null {
    return this.getStringAttribute("icon");
  }

  get labelEl(): HTMLElement | null {
    return this.getElementByPart("label");
  }

  get spinner(): Spinner | null {
    return this.getElementByTag<Spinner>(Button.dependencies.spinner);
  }

  get ripple(): Ripple | null {
    return this.getElementByTag<Ripple>(Button.dependencies.ripple);
  }

  protected override attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "disabled" || name === "loading") {
      if (newValue != null) {
        this.ripple?.setAttribute("disabled", "");
      } else {
        this.ripple?.removeAttribute("disabled");
      }
    }
    if (name === "loading") {
      if (newValue != null) {
        this.spinner?.setAttribute("position", "absolute");
      } else {
        this.spinner?.removeAttribute("position");
      }
    }
    if (name === "aria-haspopup") {
      this.updateRootAttribute("aria-haspopup", newValue);
    }
    if (name === "aria-expanded") {
      this.updateRootAttribute("aria-expanded", newValue);
    }
    if (name === "href") {
      this.updateRootAttribute("href", newValue);
    }
    if (name === "target") {
      this.updateRootAttribute("target", newValue);
    }
    if (name === "icon") {
      this.updateRootStyle("--icon", getCssIcon(newValue));
    }
    if (name === "spacing") {
      this.updateRootStyle("--spacing", getCssSize(newValue));
    }
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.ripple?.bind?.(this.root);
    this.getElementByPart("label")?.addEventListener(
      "slotchange",
      this.handleLabelSlotChange
    );
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.ripple?.unbind?.(this.root);
    this.getElementByPart("label")?.removeEventListener(
      "slotchange",
      this.handleLabelSlotChange
    );
  }

  protected handleLabelSlotChange = (e: Event) => {
    const slot = e.currentTarget as HTMLSlotElement;
    const nodes = slot?.assignedNodes?.();
    nodes.forEach((node) => {
      if (node.nodeName.toLowerCase() === Button.dependencies.badge) {
        const el = node as HTMLElement;
        el.setAttribute("float", this.getAttribute("rtl") ? "left" : "right");
      }
    });
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "s-button": Button;
  }
}
