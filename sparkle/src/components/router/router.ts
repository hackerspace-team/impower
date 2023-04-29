import SparkleElement from "../../core/sparkle-element";
import css from "./router.css";
import html from "./router.html";

const styles = new CSSStyleSheet();
styles.replaceSync(css);

/**
 * Routers are used to lazy-load templates when their value matches an observed value.
 *
 * This element loads any child template whose value attribute matches an observed value.
 * All other children are unloaded.
 */
export default class Router extends SparkleElement {
  static async define(tag = "s-router"): Promise<CustomElementConstructor> {
    customElements.define(tag, this);
    return customElements.whenDefined(tag);
  }

  override get styles(): CSSStyleSheet[] {
    return [styles];
  }

  override get html(): string {
    return html;
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, "observe"];
  }

  /**
   * The id of the sibling element to observe.
   *
   * If not specified, this element will observe any sibling with a value attribute.
   */
  get observe(): string | null {
    return this.getStringAttribute("observe");
  }

  get observedEl(): HTMLElement | null {
    const observedElId = this.observe;
    const siblings = this.parentElement?.childNodes;
    let found = null;
    if (observedElId) {
      siblings?.forEach((sibling) => {
        const el = sibling as HTMLElement;
        if (el?.getAttribute?.("id") === observedElId) {
          found = el;
        }
      });
    }
    if (found) {
      return found;
    }
    siblings?.forEach((sibling) => {
      const el = sibling as HTMLElement;
      if (el?.getAttribute?.("value") != null) {
        found = el;
      }
    });
    return found;
  }

  get contentEl(): HTMLElement | null {
    return this.getElementByPart("content");
  }

  get slotEl(): HTMLElement | null {
    return this.getElementByPart("templates");
  }

  protected _templates: HTMLTemplateElement[] = [];

  protected _valueObserver?: MutationObserver;

  protected override attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "observe") {
    }
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.slotEl?.addEventListener("slotchange", this.handleSlotChange);
  }

  protected override parsedCallback(): void {
    super.parsedCallback();
    this.observeValue();
    this.loadTemplates();
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.slotEl?.removeEventListener("slotchange", this.handleSlotChange);
  }

  loadTemplates() {
    const observedEl = this.observedEl;
    const contentEl = this.contentEl;
    // Unload all existing content
    contentEl?.replaceChildren();
    this._templates.forEach((el) => {
      if (observedEl && contentEl) {
        const observedValue = observedEl.getAttribute("value");
        const value = el.getAttribute("value");
        if (observedValue === value) {
          // Load template content
          contentEl.appendChild(el.content.cloneNode(true));
        }
      }
    });
  }

  observeValue() {
    if (this._valueObserver) {
      this._valueObserver.disconnect();
    }
    const observedEl = this.observedEl;
    if (observedEl) {
      this._valueObserver = new MutationObserver(this.onValueMutation);
      this._valueObserver.observe(observedEl, {
        attributes: true,
        attributeFilter: ["value"],
      });
    }
  }

  protected handleSlotChange = (e: Event) => {
    const slot = e.currentTarget as HTMLSlotElement;
    this._templates = slot
      ?.assignedElements?.()
      .filter(
        (el) => el.tagName.toLowerCase() === "template"
      ) as HTMLTemplateElement[];
  };

  protected onValueMutation = (mutations: MutationRecord[]) => {
    this.loadTemplates();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "s-router": Router;
  }
}
