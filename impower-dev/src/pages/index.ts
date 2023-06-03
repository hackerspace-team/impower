import SparkEditor from "@impower/spark-editor/src/index.js";
import Sparkle from "@impower/sparkle/src/index.js";

const load = async () => {
  await Promise.allSettled([Sparkle.init(), SparkEditor.init()]);
  document.body.classList.add("ready");
};
load();