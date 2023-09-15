import { spec } from "../../../spec-component/src/spec";
import css from "./spark-web-player.css";
import html from "./spark-web-player.html";

export default spec({
  tag: "spark-web-player",
  html,
  selectors: {
    sparkRoot: "#spark-root",
    sparkGame: "#spark-game",
  } as const,
  css,
});
