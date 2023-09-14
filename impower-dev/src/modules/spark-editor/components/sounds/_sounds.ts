import { spec } from "../../../../../../packages/spec-component/src/spec";
import css from "../../styles/shared";
import WorkspaceContext from "../../workspace/WorkspaceContext";
import html from "./sounds.html";

export default spec({
  tag: "se-sounds",
  context: WorkspaceContext.instance,
  css,
  html,
});
