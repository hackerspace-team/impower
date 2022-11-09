import { RAMPS } from "../constants/RAMPS";
import { CurveType } from "../types/CurveType";

export const fadeArray = (
  buffer: Float32Array,
  type: CurveType,
  fadeLength: number,
  fadeDirection: "in" | "out",
  offset: number,
  duration: number
): void => {
  for (let i = 0; i < fadeLength; i += 1) {
    const index =
      fadeDirection === "in" ? offset + i : offset + duration - 1 - i;
    const percent = i / fadeLength;
    const ramp = RAMPS[type];
    if (ramp) {
      const amp = ramp(percent);
      buffer[index] *= amp;
    }
  }
};
