import { GameSparkParser } from "../classes/GameSparkParser";
import { getActiveSparkdownDocument } from "./getActiveSparkdownDocument";
import { getEditor } from "./getEditor";
import { getSyncOrExportPath } from "./getSyncOrExportPath";
import { writeFile } from "./writeFile";

export const exportJson = async (): Promise<void> => {
  const uri = getActiveSparkdownDocument();
  if (!uri) {
    return;
  }
  const editor = getEditor(uri);
  if (!editor) {
    return;
  }
  const fsPath = await getSyncOrExportPath(editor, "json");
  if (!fsPath) {
    return;
  }
  const sparkdown = editor.document.getText();
  const result = GameSparkParser.instance.parse(sparkdown);
  console.log(result);
  const output = JSON.stringify(result, null, 4);
  writeFile(fsPath, output);
};
