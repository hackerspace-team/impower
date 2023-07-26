import SparkdownScriptEditor from "@impower/sparkdown-script-views/src/modules/editor/index.js";
import SparkdownScriptPreview from "@impower/sparkdown-script-views/src/modules/preview/index.js";
import Sparkle from "@impower/sparkle/src/index.js";
import SparkEditor from "../modules/spark-editor/index";
import Workspace from "../modules/spark-editor/workspace/Workspace";

const load = async () => {
  await Promise.allSettled([
    Sparkle.init(),
    SparkdownScriptEditor.init({
      languageServerConnection: Workspace.lsp.connection,
      fileSystemReader: {
        scheme: Workspace.fs.scheme,
        read: (uri: string) => Workspace.fs.readFile({ file: { uri } }),
      },
    }),
    SparkdownScriptPreview.init(),
    SparkEditor.init(),
  ]);
  document.body.classList.add("ready");
};
load();
