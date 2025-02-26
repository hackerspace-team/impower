import { Range } from "@codemirror/state";
import { SparkdownAnnotation } from "../SparkdownAnnotation";
import { SparkdownAnnotator } from "../SparkdownAnnotator";
import { SparkdownSyntaxNodeRef } from "../../types/SparkdownSyntaxNodeRef";

export class SceneAnnotator extends SparkdownAnnotator {
  override enter(
    annotations: Range<SparkdownAnnotation>[],
    nodeRef: SparkdownSyntaxNodeRef
  ): Range<SparkdownAnnotation>[] {
    if (nodeRef.name === "Scene_content") {
      annotations.push(
        SparkdownAnnotation.mark().range(nodeRef.from, nodeRef.to)
      );
      return annotations;
    }
    return annotations;
  }
}
