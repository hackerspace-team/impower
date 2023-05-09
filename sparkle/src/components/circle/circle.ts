import SparkleElement from "../../core/sparkle-element";
import { getCssSize } from "../../utils/getCssSize";
import css from "./circle.css";

const styles = new CSSStyleSheet();
styles.replaceSync(css);

/**
 * Circles are basic surfaces for styling and laying out content.
 */
export default class Circle extends SparkleElement {
  static override async define(
    tag = "s-circle",
    dependencies?: Record<string, string>
  ): Promise<CustomElementConstructor> {
    return super.define(tag, dependencies);
  }

  override get styles(): CSSStyleSheet[] {
    return [styles];
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, "size"];
  }

  /**
   * The size of the circle.
   */
  get size(): string | null {
    return this.getStringAttribute("size");
  }

  protected override onAttributeChanged(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === "size") {
      this.updateRootCssVariable(name, getCssSize(newValue));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "s-circle": Circle;
  }
}