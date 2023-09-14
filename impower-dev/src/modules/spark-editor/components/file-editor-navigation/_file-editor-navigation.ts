import { spec } from "../../../../../../packages/spec-component/src/spec";
import css from "../../styles/shared";
import WorkspaceContext from "../../workspace/WorkspaceContext";
import html from "./file-editor-navigation.html";

export default spec({
  tag: "se-file-editor-navigation",
  context: WorkspaceContext.instance,
  css,
  html,
});
