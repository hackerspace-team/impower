import SEElement from "../../core/se-element";
import html from "./header-navigation.html";

export default class HeaderNavigation extends SEElement {
  static override async define(
    tag = "se-header-navigation",
    dependencies?: Record<string, string>,
    useShadowDom = true,
    useInlineStyles = true
  ) {
    return super.define(tag, dependencies, useShadowDom, useInlineStyles);
  }

  override get html(): string {
    return html;
  }
}
