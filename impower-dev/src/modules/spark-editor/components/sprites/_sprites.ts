import { spec } from "../../../../../../packages/spec-component/src/spec";
import css from "../../styles/shared";
import workspace from "../../workspace/WorkspaceStore";
import html from "./sprites.html";

export default spec({
  tag: "se-sprites",
  stores: { workspace },
  html,
  css,
});
