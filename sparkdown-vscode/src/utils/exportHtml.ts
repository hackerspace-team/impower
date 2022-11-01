import * as vscode from "vscode";
import {
  generateSparkScriptHtml,
  generateSparkTitleHtml,
} from "../../../spark-screenplay";
import { ScreenplaySparkParser } from "../classes/ScreenplaySparkParser";
import { fileToBase64 } from "./fileToBase64";
import { getActiveSparkdownDocument } from "./getActiveSparkdownDocument";
import { getEditor } from "./getEditor";
import { getSparkdownConfig } from "./getSparkdownConfig";
import { getSyncOrExportPath } from "./getSyncOrExportPath";
import { writeFile } from "./writeFile";

export const exportHtml = async (
  context: vscode.ExtensionContext
): Promise<void> => {
  const uri = getActiveSparkdownDocument();
  if (!uri) {
    return;
  }
  const editor = getEditor(uri);
  if (!editor) {
    return;
  }
  const fsPath = await getSyncOrExportPath(editor, "html");
  if (!fsPath) {
    return;
  }
  const sparkdown = editor.document.getText();
  const result = ScreenplaySparkParser.instance.parse(sparkdown);

  const config = getSparkdownConfig(uri);

  const htmlUri = vscode.Uri.joinPath(
    context.extensionUri,
    "out",
    "data",
    "staticexport.html"
  );
  let rawHtml: string =
    Buffer.from(await vscode.workspace.fs.readFile(htmlUri)).toString() || "";

  if (process.platform !== "win32") {
    rawHtml = rawHtml.replace(/\r\n/g, "\n");
  }

  let pageClasses = "innerpage";
  if (config.screenplay_print_scene_numbers === "left") {
    pageClasses = "innerpage numberonleft";
  } else if (config.screenplay_print_scene_numbers === "right") {
    pageClasses = "innerpage numberonright";
  } else if (config.screenplay_print_scene_numbers === "both") {
    pageClasses = "innerpage numberonleft numberonright";
  }

  rawHtml = rawHtml.replace("$SCRIPTCLASS$", pageClasses);

  const courierPrimeB64 =
    fileToBase64(
      vscode.Uri.joinPath(
        context.extensionUri,
        "out",
        "data",
        "courier-prime.ttf"
      )?.fsPath
    ) || "";
  const courierPrimeB64_bold =
    fileToBase64(
      vscode.Uri.joinPath(
        context.extensionUri,
        "out",
        "data",
        "courier-prime-bold.ttf"
      )?.fsPath
    ) || "";
  const courierPrimeB64_italic =
    fileToBase64(
      vscode.Uri.joinPath(
        context.extensionUri,
        "out",
        "data",
        "courier-prime-italic.ttf"
      )?.fsPath
    ) || "";
  const courierPrimeB64_bolditalic =
    fileToBase64(
      vscode.Uri.joinPath(
        context.extensionUri,
        "out",
        "data",
        "courier-prime-bold-italic.ttf"
      )?.fsPath
    ) || "";

  rawHtml = rawHtml
    .replace("$COURIERPRIME$", courierPrimeB64)
    .replace("$COURIERPRIME-BOLD$", courierPrimeB64_bold)
    .replace("$COURIERPRIME-ITALIC$", courierPrimeB64_italic)
    .replace("$COURIERPRIME-BOLD-ITALIC$", courierPrimeB64_bolditalic);

  const titleHtml = generateSparkTitleHtml(result, config);
  const scriptHtml = generateSparkScriptHtml(result, config);

  if (titleHtml) {
    rawHtml = rawHtml.replace("$TITLEPAGE$", titleHtml);
  } else {
    rawHtml = rawHtml.replace("$TITLEDISPLAY$", "hidden");
  }
  rawHtml = rawHtml.replace("$SCREENPLAY$", scriptHtml);

  if (!fsPath) {
    return;
  }

  writeFile(fsPath, rawHtml);
};
