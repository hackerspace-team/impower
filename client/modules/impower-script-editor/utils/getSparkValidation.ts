import {
  ANIMATION_VALIDATION,
  CHARACTER_VALIDATION,
  EASE_VALIDATION,
  FONT_VALIDATION,
  GRADIENT_VALIDATION,
  GRAPHIC_VALIDATION,
  RecursiveValidation,
  SHADOW_VALIDATION,
  SOUND_VALIDATION,
  STYLE_VALIDATION,
  THEME_VALIDATION,
  WRITER_VALIDATION,
} from "../../../../spark-engine/src/inspector";

export const getSparkValidation = (
  type: string,
  objectMap?: {
    [type: string]: Record<string, object>;
  }
): RecursiveValidation | undefined => {
  if (type === "graphic") {
    return GRAPHIC_VALIDATION(objectMap);
  }
  if (type === "font") {
    return FONT_VALIDATION;
  }
  if (type === "theme") {
    return THEME_VALIDATION;
  }
  if (type === "shadow") {
    return SHADOW_VALIDATION;
  }
  if (type === "gradient") {
    return GRADIENT_VALIDATION;
  }
  if (type === "ease") {
    return EASE_VALIDATION;
  }
  if (type === "animation") {
    return ANIMATION_VALIDATION(objectMap);
  }
  if (type === "style") {
    return STYLE_VALIDATION(objectMap);
  }
  if (type === "character") {
    return CHARACTER_VALIDATION;
  }
  if (type === "writer") {
    return WRITER_VALIDATION;
  }
  if (type === "sound") {
    return SOUND_VALIDATION;
  }
  return undefined;
};
