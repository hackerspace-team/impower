import {
  GRAPHIC_RANDOMIZATIONS,
  RecursiveRandomization,
  SOUND_RANDOMIZATIONS,
} from "../../../../spark-engine/src/inspector";

export const getSparkRandomizations = (
  type: string,
  _objectMap?: {
    [type: string]: Record<string, object>;
  }
): Record<string, RecursiveRandomization> | undefined => {
  if (type === "sound") {
    return SOUND_RANDOMIZATIONS;
  }
  if (type === "graphic") {
    return GRAPHIC_RANDOMIZATIONS;
  }
  return undefined;
};
