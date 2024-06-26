import { spec } from "../../../../../../packages/spec-component/src/spec";
import css from "../../styles/shared";
import workspace from "../../workspace/WorkspaceStore";
import html from "./share-game.html";

export default spec({
  tag: "se-share-game",
  stores: { workspace },
  html,
  css,
});
