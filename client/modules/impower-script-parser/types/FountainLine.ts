import { FountainAsset } from "./FountainAsset";
import { FountainTokenType } from "./FountainTokenType";

export interface FountainLine {
  type: FountainTokenType;
  content?: string;
  text?: string;
  notes?: FountainAsset[];

  line?: number;
  level?: number;
  start?: number;
  end?: number;

  order?: number;
  ignore?: boolean;

  html?: string;
}