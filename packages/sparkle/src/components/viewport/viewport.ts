import { Properties } from "../../../../spark-element/src/types/properties";
import getAttributeNameMap from "../../../../spark-element/src/utils/getAttributeNameMap";
import getCssSize from "../../../../sparkle-style-transformer/src/utils/getCssSize";
import SparkleElement, {
  DEFAULT_SPARKLE_ATTRIBUTES,
  DEFAULT_SPARKLE_TRANSFORMERS,
} from "../../core/sparkle-element";
import { SizeName } from "../../types/sizeName";
import { getKeys } from "../../utils/getKeys";
import { getPixelValue } from "../../utils/getPixelValue";
import css from "./viewport.css";
import html from "./viewport.html";

const DEFAULT_TRANSFORMERS = {
  ...DEFAULT_SPARKLE_TRANSFORMERS,
  offset: getCssSize,
};

const DEFAULT_ATTRIBUTES = {
  ...DEFAULT_SPARKLE_ATTRIBUTES,
  ...getAttributeNameMap([
    "constrained-event",
    "unconstrained-event",
    ...getKeys(DEFAULT_TRANSFORMERS),
  ]),
};

/**
 * Viewports fill the entire screen height and shrink to accommodate
 * on-screen virtual keyboards that would otherwise cover up content
 */
export default class Viewport
  extends SparkleElement
  implements Properties<typeof DEFAULT_ATTRIBUTES>
{
  static override tagName = "s-viewport";

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
    return Viewport.augmentCss(css);
  }

  /**
   * The viewport will be constrained when this event is fired
   */
  get constrainedEvent(): string | null {
    return this.getStringAttribute(Viewport.attributes.constrainedEvent);
  }
  set constrainedEvent(value) {
    this.setStringAttribute(Viewport.attributes.constrainedEvent, value);
  }

  /**
   * The viewport will be unconstrained when this event is fired
   */
  get unconstrainedEvent(): string | null {
    return this.getStringAttribute(Viewport.attributes.unconstrainedEvent);
  }
  set unconstrainedEvent(value) {
    this.setStringAttribute(Viewport.attributes.unconstrainedEvent, value);
  }

  /**
   * Determines how much the viewport should be offset
   * in addition to the height of the virtual keyboard
   */
  get offset(): SizeName | null {
    return this.getStringAttribute(Viewport.attributes.offset);
  }
  set offset(value) {
    this.setStringAttribute(Viewport.attributes.offset, value);
  }

  protected _offsetPx = 0;

  protected _pendingViewportUpdate?: number;

  protected _constrained = false;

  protected override onAttributeChanged(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === Viewport.attributes.offset) {
      this._offsetPx = getPixelValue(this.root, "offset");
    }
  }

  protected override onConnected(): void {
    window.visualViewport?.addEventListener(
      "scroll",
      this.handleViewportChange,
      {
        passive: true,
      }
    );
    window.visualViewport?.addEventListener(
      "resize",
      this.handleViewportChange,
      {
        passive: true,
      }
    );
    window.addEventListener("message", this.handleMessage);
  }

  protected override onDisconnected(): void {
    window.visualViewport?.removeEventListener(
      "scroll",
      this.handleViewportChange
    );
    window.visualViewport?.removeEventListener(
      "resize",
      this.handleViewportChange
    );
    window.removeEventListener("message", this.handleMessage);
  }

  protected handleMessage = (e: MessageEvent): void => {
    if (e.data.method === this.unconstrainedEvent) {
      this._constrained = false;
      this.root.style.setProperty("max-height", null);
    }
    if (e.data.method === this.constrainedEvent) {
      this._constrained = true;
      if (window.visualViewport) {
        const maxHeight = `${window.visualViewport.height - this._offsetPx}px`;
        this.root.style.setProperty("max-height", maxHeight);
      }
    }
  };

  protected handleViewportChange = (event: Event) => {
    if (this._pendingViewportUpdate) {
      window.cancelAnimationFrame(this._pendingViewportUpdate);
    }
    this._pendingViewportUpdate = window.requestAnimationFrame(() => {
      const visualViewport = event.target as unknown as { height: number };
      if (visualViewport) {
        const maxHeight = `${visualViewport.height - this._offsetPx}px`;
        this.root.style.setProperty("max-height", maxHeight);
      }
      this._pendingViewportUpdate = undefined;
    });
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "s-viewport": Viewport;
  }
}
