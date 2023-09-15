import { spec } from "../../../../../../packages/spec-component/src/spec";
import css from "../../styles/shared";
import workspace from "../../workspace/WorkspaceStore";
import html from "./access.html";

export default spec({
  tag: "se-access",
  stores: { workspace },
  html,
  css,
});
