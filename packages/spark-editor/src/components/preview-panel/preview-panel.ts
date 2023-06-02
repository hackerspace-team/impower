import SEElement from "../../core/se-element";
import html from "./preview-panel.html";

export default class PreviewPanel extends SEElement {
  static override async define(
    tag = "se-preview-panel",
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
