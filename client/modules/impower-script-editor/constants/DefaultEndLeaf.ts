import { BlockContext } from "../classes/BlockContext";
import { Line } from "../classes/Line";
import { Type } from "../types/type";
import {
  getSectionLevel,
  inBlockContext,
  isBulletList,
  isFencedCode,
  isHTMLBlock,
  isOrderedList,
  isPageBreak,
  isScene,
  isStructDeclaration,
  isSynopsis,
  isTitle,
  isTransition,
} from "../utils/markdown";

export const DefaultEndLeaf: readonly ((
  cx: BlockContext,
  line: Line
) => boolean)[] = [
  (_, line): boolean => getSectionLevel(line) >= 1,
  (_, line): boolean => Boolean(isScene(line)),
  (_, line): boolean => Boolean(isSynopsis(line)),
  (_, line): boolean => Boolean(isTransition(line)),
  (_, line): boolean => Boolean(isPageBreak(line)),
  (p, line): boolean =>
    Boolean(isStructDeclaration(line)) || inBlockContext(p, Type.Struct),
  (p, line): boolean => isTitle(line, p, true) >= 0,
  (p, line): boolean => isBulletList(line, p, true) >= 0,
  (p, line): boolean => isOrderedList(line, p, true) >= 0,
  (p, line): boolean => isHTMLBlock(line, p, true) >= 0,
  (_, line): boolean => isFencedCode(line) >= 0,
];
