import getCssSize from "../../../../sparkle-style-transformer/src/utils/getCssSize";
import { Properties } from "../../../../spec-component/src/types/Properties";
import getAttributeNameMap from "../../../../spec-component/src/utils/getAttributeNameMap";
import getKeys from "../../../../spec-component/src/utils/getKeys";
import SparkleElement, {
  DEFAULT_SPARKLE_ATTRIBUTES,
  DEFAULT_SPARKLE_TRANSFORMERS,
} from "../../core/sparkle-element";
import { SizeName } from "../../types/sizeName";
import { getPixelValue } from "../../utils/getPixelValue";
import spec from "./_viewport";

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
  static override get tag() {
    return spec.tag;
  }

  override get html() {
    return this.getHTML(spec, { props: {}, state: {} });
  }

  override get css() {
    return this.getCSS(spec);
  }

  static override get attrs() {
    return DEFAULT_ATTRIBUTES;
  }

  override get transformers() {
    return DEFAULT_TRANSFORMERS;
  }

  /**
   * The viewport will be constrained when this event is fired
   */
  get constrainedEvent(): string | null {
    return this.getStringAttribute(Viewport.attrs.constrainedEvent);
  }
  set constrainedEvent(value) {
    this.setStringAttribute(Viewport.attrs.constrainedEvent, value);
  }

  /**
   * The viewport will be unconstrained when this event is fired
   */
  get unconstrainedEvent(): string | null {
    return this.getStringAttribute(Viewport.attrs.unconstrainedEvent);
  }
  set unconstrainedEvent(value) {
    this.setStringAttribute(Viewport.attrs.unconstrainedEvent, value);
  }

  /**
   * Determines how much the viewport should be offset
   * in addition to the height of the virtual keyboard
   */
  get offset(): SizeName | null {
    return this.getStringAttribute(Viewport.attrs.offset);
  }
  set offset(value) {
    this.setStringAttribute(Viewport.attrs.offset, value);
  }

  protected _offsetPx = 0;

  protected _pendingViewportUpdate?: number;

  protected _constrained = false;

  override onAttributeChanged(name: string, newValue: string): void {
    if (name === Viewport.attrs.offset) {
      this._offsetPx = getPixelValue(this.root, "offset");
    }
  }

  override onConnected(): void {
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
    const constrainedEvent = this.constrainedEvent;
    if (constrainedEvent) {
      window.addEventListener(constrainedEvent, this.handleConstrained);
    }
    const unconstrainedEvent = this.unconstrainedEvent;
    if (unconstrainedEvent) {
      window.addEventListener(unconstrainedEvent, this.handleUnconstrained);
    }
  }

  override onDisconnected(): void {
    window.visualViewport?.removeEventListener(
      "scroll",
      this.handleViewportChange
    );
    window.visualViewport?.removeEventListener(
      "resize",
      this.handleViewportChange
    );
    const constrainedEvent = this.constrainedEvent;
    if (constrainedEvent) {
      window.removeEventListener(constrainedEvent, this.handleConstrained);
    }
    const unconstrainedEvent = this.unconstrainedEvent;
    if (unconstrainedEvent) {
      window.removeEventListener(unconstrainedEvent, this.handleUnconstrained);
    }
  }

  protected handleConstrained = (e: Event): void => {
    this._constrained = true;
    if (window.visualViewport) {
      const maxHeight = `${window.visualViewport.height - this._offsetPx}px`;
      this.root.style.setProperty("max-height", maxHeight);
    }
  };

  protected handleUnconstrained = (e: Event): void => {
    this._constrained = false;
    this.root.style.setProperty("max-height", null);
  };

  protected handleViewportChange = (event: Event) => {
    if (this._pendingViewportUpdate) {
      window.cancelAnimationFrame(this._pendingViewportUpdate);
    }
    this._pendingViewportUpdate = window.requestAnimationFrame(() => {
      const visualViewport = event.target as unknown as { height: number };
      if (visualViewport) {
        if (this._constrained) {
          const maxHeight = `${visualViewport.height - this._offsetPx}px`;
          this.root.style.setProperty("max-height", maxHeight);
        } else {
          this.root.style.setProperty("max-height", null);
        }
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
