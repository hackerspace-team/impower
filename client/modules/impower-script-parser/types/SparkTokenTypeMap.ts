import {
  SparkActionToken,
  SparkAssetsToken,
  SparkAssetToken,
  SparkCallToken,
  SparkCenteredToken,
  SparkChoiceToken,
  SparkConditionToken,
  SparkDialogueToken,
  SparkEntityToken,
  SparkGoToken,
  SparkReturnToken,
  SparkSceneToken,
  SparkSectionToken,
  SparkTagToken,
  SparkToken,
  SparkTransitionToken,
  SparkVariableToken,
} from "./SparkToken";

export interface SparkTokenTypeMap {
  comment: SparkToken;
  title: SparkToken;
  separator: SparkToken;
  synopses: SparkToken;
  page_break: SparkToken;
  dialogue_asset: SparkToken;
  action_asset: SparkToken;
  dialogue_end: SparkToken;
  dual_dialogue_start: SparkToken;
  dual_dialogue_end: SparkToken;
  lyric: SparkToken;
  note: SparkToken;
  boneyard_start: SparkToken;
  boneyard_end: SparkToken;
  repeat: SparkToken;
  credit: SparkToken;
  author: SparkToken;
  authors: SparkToken;
  source: SparkToken;
  watermark: SparkToken;
  font: SparkToken;
  notes: SparkToken;
  copyright: SparkToken;
  revision: SparkToken;
  date: SparkToken;
  draft_date: SparkToken;
  contact: SparkToken;
  contact_info: SparkToken;
  dialogue_start: SparkToken;
  character: SparkToken;
  parenthetical: SparkToken;

  image: SparkAssetToken;
  audio: SparkAssetToken;
  video: SparkAssetToken;
  text: SparkAssetToken;

  ui: SparkEntityToken;
  object: SparkEntityToken;
  enum: SparkEntityToken;

  centered: SparkCenteredToken;
  tag: SparkTagToken;
  variable: SparkVariableToken;
  assign: SparkAssetToken;
  call: SparkCallToken;
  condition: SparkConditionToken;
  choice: SparkChoiceToken;
  go: SparkGoToken;
  return: SparkReturnToken;
  section: SparkSectionToken;
  scene: SparkSceneToken;
  dialogue: SparkDialogueToken;
  action: SparkActionToken;
  assets: SparkAssetsToken;
  transition: SparkTransitionToken;
}