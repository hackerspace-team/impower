import { Graphic } from "../types/Graphic";

export default class StyleCache {
  protected _styleSheets: Record<string, CSSStyleSheet> = {};

  protected _styleElements: Record<string, HTMLStyleElement> = {};

  protected _icons: Record<string, Graphic> = {};

  protected _patterns: Record<string, Graphic> = {};

  get styles() {
    return this._styleSheets;
  }

  get icons() {
    return this._icons;
  }

  get patterns() {
    return this._patterns;
  }

  clearStyles() {
    this._styleSheets = {};
  }

  getStyleSheet(css: string) {
    const cached = this._styleSheets[css];
    if (cached) {
      return cached;
    }
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    this._styleSheets[css] = sheet;
    return sheet;
  }

  getStyleElement(el: Element | ShadowRoot | Document, css: string) {
    const cached = this._styleElements[css];
    if (cached) {
      return cached;
    }
    const styleEl = document.createElement("style");
    styleEl.innerHTML = css;
    const targetEl =
      el instanceof Document ? el.getElementsByTagName("head")[0] || el : el;
    return targetEl.appendChild(styleEl);
  }

  adoptStyle(el: Element | ShadowRoot | Document, css: string) {
    if (css) {
      try {
        const targetEl =
          el instanceof Document || el instanceof ShadowRoot
            ? el
            : el.shadowRoot;
        if (targetEl) {
          targetEl.adoptedStyleSheets.push(this.getStyleSheet(css));
        }
      } catch {
        // Fallback to inline styles if constructable style sheets are not supported
        this.getStyleElement(el, css);
      }
    }
  }

  adoptIcons(shapes: Record<string, Graphic>) {
    this._icons = { ...this._icons, ...shapes };
  }

  adoptPatterns(shapes: Record<string, Graphic>) {
    this._patterns = { ...this._patterns, ...shapes };
  }
}
