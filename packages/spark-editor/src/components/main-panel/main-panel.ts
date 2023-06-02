import SEElement from "../../core/se-element";
import html from "./main-panel.html";

export default class MainPanel extends SEElement {
  static override async define(
    tag = "se-main-panel",
    dependencies?: Record<string, string>,
    useShadowDom = true,
    useInlineStyles = true
  ) {
    return super.define(tag, dependencies, useShadowDom, useInlineStyles);
  }

  override get html() {
    return html;
  }
}
