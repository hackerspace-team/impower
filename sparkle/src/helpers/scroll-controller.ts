import { prefersReducedMotion } from "../utils/animate";
import { debounce } from "../utils/debounce";
import { waitForEvent } from "../utils/events";

interface ScrollHost extends HTMLElement {
  scrollContainer: HTMLElement;
  requestUpdate: () => void;
}

/**
 * A controller for handling scrolling and mouse dragging.
 */
export default class ScrollController<T extends ScrollHost> {
  private host: T;
  private pointers = new Set();

  dragging = false;
  scrolling = false;
  mouseDragging = false;

  constructor(
    host: T,
    options?: {
      dragging?: boolean;
      scrolling?: boolean;
      mouseDragging?: boolean;
    }
  ) {
    this.host = host;
    this.dragging = options?.dragging ?? this.dragging;
    this.scrolling = options?.scrolling ?? this.scrolling;
    this.mouseDragging = options?.mouseDragging ?? this.mouseDragging;
  }

  async hostParsed() {
    const host = this.host;

    const scrollContainer = host.scrollContainer;

    scrollContainer.addEventListener("scroll", this.handleScroll, {
      passive: true,
    });
    scrollContainer.addEventListener("pointerdown", this.handlePointerDown);
    scrollContainer.addEventListener("pointerup", this.handlePointerUp);
    scrollContainer.addEventListener("pointercancel", this.handlePointerUp);
    scrollContainer.addEventListener("touchstart", this.handleTouchStart, {
      passive: true,
    });
    scrollContainer.addEventListener("touchend", this.handleTouchEnd);
  }

  hostDisconnected(): void {
    const host = this.host;
    const scrollContainer = host.scrollContainer;

    scrollContainer.removeEventListener("scroll", this.handleScroll);
    scrollContainer.removeEventListener("pointerdown", this.handlePointerDown);
    scrollContainer.removeEventListener("pointerup", this.handlePointerUp);
    scrollContainer.removeEventListener("pointercancel", this.handlePointerUp);
    scrollContainer.removeEventListener("touchstart", this.handleTouchStart);
    scrollContainer.removeEventListener("touchend", this.handleTouchEnd);
  }

  handleScroll() {
    if (!this.scrolling) {
      this.scrolling = true;
      this.host.requestUpdate();
    }
    this.debouncedScrollEnd();
  }

  debouncedScrollEnd() {
    debounce(this.handleScrollEnd, 100);
  }

  handleScrollEnd = (): void => {
    if (!this.pointers.size) {
      this.scrolling = false;
      this.host.scrollContainer.dispatchEvent(
        new CustomEvent("scrollend", {
          bubbles: false,
          cancelable: false,
        })
      );
      this.host.requestUpdate();
    } else {
      this.debouncedScrollEnd();
    }
  };

  handlePointerDown = (event: PointerEvent) => {
    if (event.pointerType === "touch") {
      return;
    }

    const scrollContainer = this.host.scrollContainer;
    this.pointers.add(event.pointerId);
    scrollContainer.setPointerCapture(event.pointerId);

    if (this.mouseDragging && this.pointers.size === 1) {
      event.preventDefault();
      scrollContainer.addEventListener("pointermove", this.handlePointerMove);
    }
  };

  handlePointerMove = (event: PointerEvent) => {
    const host = this.host;
    const scrollContainer = host.scrollContainer;

    if (scrollContainer.hasPointerCapture(event.pointerId)) {
      if (!this.dragging) {
        this.handleDragStart();
      }

      this.handleDrag(event);
    }
  };

  handlePointerUp = (event: PointerEvent) => {
    const host = this.host;
    const scrollContainer = host.scrollContainer;

    this.pointers.delete(event.pointerId);
    scrollContainer.releasePointerCapture(event.pointerId);

    if (this.pointers.size === 0) {
      this.handleDragEnd();
    }
  };

  handleTouchStart = (event: TouchEvent) => {
    for (const touch of Array.from(event.touches)) {
      this.pointers.add(touch.identifier);
    }
  };

  handleTouchEnd = (event: TouchEvent) => {
    for (const touch of Array.from(event.changedTouches)) {
      this.pointers.delete(touch.identifier);
    }
  };

  handleDragStart() {
    const host = this.host;

    this.dragging = true;
    host.scrollContainer.style.setProperty("scroll-snap-type", "unset");
    host.requestUpdate();
  }

  handleDrag(event: PointerEvent) {
    this.host.scrollContainer.scrollBy({
      left: -event.movementX,
      top: -event.movementY,
    });
  }

  async handleDragEnd() {
    const host = this.host;
    const scrollContainer = host.scrollContainer;

    scrollContainer.removeEventListener("pointermove", this.handlePointerMove);
    this.dragging = false;

    const startLeft = scrollContainer.scrollLeft;
    const startTop = scrollContainer.scrollTop;

    scrollContainer.style.removeProperty("scroll-snap-type");
    const finalLeft = scrollContainer.scrollLeft;
    const finalTop = scrollContainer.scrollTop;

    scrollContainer.style.setProperty("scroll-snap-type", "unset");
    scrollContainer.scrollTo({
      left: startLeft,
      top: startTop,
      behavior: "auto",
    });
    scrollContainer.scrollTo({
      left: finalLeft,
      top: finalTop,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });

    if (this.scrolling) {
      await waitForEvent(scrollContainer, "scrollend");
    }

    scrollContainer.style.removeProperty("scroll-snap-type");

    host.requestUpdate();
  }
}
