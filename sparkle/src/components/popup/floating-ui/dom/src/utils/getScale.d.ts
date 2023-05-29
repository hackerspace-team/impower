import type { Coords } from "../../../core";
import type { VirtualElement } from "../types";
export declare const FALLBACK_SCALE: {
  x: number;
  y: number;
};
export declare function getScale(element: Element | VirtualElement): Coords;
