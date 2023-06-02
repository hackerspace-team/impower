import * as vscode from "vscode";
import { diagnosticState } from "../state/diagnosticState";
import { editorState } from "../state/editorState";
import { parseState } from "../state/parseState";
import { previewState } from "../state/previewState";
import { getEditor } from "../utils/getEditor";
import { getSparkdownConfig } from "../utils/getSparkdownConfig";
import { removePreviewPanel } from "../utils/removePreviewPanels";
import { getVisibleLine } from "./getVisibleLine";
import { parseSparkDocument } from "./parseSparkDocument";
import { updateAssets } from "./updateAssets";
import { watchFiles } from "./watchFiles";

export const loadWebView = async (
  type: "screenplay" | "game",
  context: vscode.ExtensionContext,
  uri: vscode.Uri,
  panel: vscode.WebviewPanel,
  dynamic: boolean
): Promise<void> => {
  console.log("loadWebView", type);
  const id = Date.now() + Math.floor(Math.random() * 1000);
  previewState[type].push({
    uri: uri.toString(),
    dynamic: dynamic,
    panel: panel,
    id: id,
  });

  if (panel) {
    panel.iconPath = {
      light: vscode.Uri.joinPath(context.extensionUri, "icon-lang.svg"),
      dark: vscode.Uri.joinPath(context.extensionUri, "icon-lang.svg"),
    };
  }
  panel.webview.onDidReceiveMessage(async (message) => {
    if (message.command === "sparkdown.updateFontResult") {
      const parsedDoc =
        parseState.parsedDocuments[vscode.Uri.parse(message.uri).toString()];
      if (parsedDoc) {
        if (
          message.content === false &&
          parsedDoc.properties?.fontLine !== -1
        ) {
          //The font could not be rendered
          diagnosticState.diagnostics.length = 0;
          diagnosticState.diagnostics.push(
            new vscode.Diagnostic(
              new vscode.Range(
                new vscode.Position(parsedDoc.properties?.fontLine || 0, 0),
                new vscode.Position(
                  parseState.parsedDocuments[uri.toString()]?.properties
                    ?.fontLine || 0,
                  5
                )
              ),
              "This font could not be rendered in the live preview. Is it installed?",
              vscode.DiagnosticSeverity.Error
            )
          );
          diagnosticState.diagnosticCollection.set(
            vscode.Uri.parse(message.uri),
            diagnosticState.diagnostics
          );
        } else {
          //Yay, the font has been rendered
          diagnosticState.diagnosticCollection.set(
            vscode.Uri.parse(message.uri),
            []
          );
        }
      }
    } else if (message.command === "sparkdown.revealLine") {
      const cfg = getSparkdownConfig(vscode.Uri.parse(message.uri));
      const syncedWithCursor =
        type === "game"
          ? cfg.game_preview_synchronized_with_cursor
          : cfg.screenplay_preview_synchronized_with_cursor;

      if (!syncedWithCursor) {
        return;
      }
      editorState.isScrolling = true;
      const sourceLine = Math.floor(message.content);
      const fraction = message.content - sourceLine;
      const editor = getEditor(vscode.Uri.parse(message.uri));
      if (editor && !Number.isNaN(sourceLine)) {
        const text = editor.document.lineAt(sourceLine).text;
        const start = Math.floor(fraction * text.length);
        editor.revealRange(
          new vscode.Range(sourceLine, start, sourceLine, 1),
          vscode.TextEditorRevealType.AtTop
        );
      }
    }
    if (message.command === "sparkdown.changeselection") {
      const linePos = Number(message.line);
      let charPos = Number(message.character);
      if (Number.isNaN(linePos)) {
        return;
      }
      if (Number.isNaN(charPos)) {
        charPos = 0;
      }

      const selectionposition = new vscode.Position(
        message.line,
        message.character
      );

      let editor = getEditor(vscode.Uri.parse(message.uri));
      if (editor === undefined) {
        const doc = await vscode.workspace.openTextDocument(
          vscode.Uri.parse(message.uri)
        );
        editor = await vscode.window.showTextDocument(doc);
      } else {
        await vscode.window.showTextDocument(
          editor.document,
          editor.viewColumn,
          false
        );
      }

      editor.selection = new vscode.Selection(
        selectionposition,
        selectionposition
      );
      editor.revealRange(
        new vscode.Range(linePos, 0, linePos + 1, 0),
        vscode.TextEditorRevealType.InCenterIfOutsideViewport
      );
    }
  });
  panel.onDidDispose(() => {
    removePreviewPanel(type, id);
  });

  const htmlUri = vscode.Uri.joinPath(
    context.extensionUri,
    "out",
    "webviews",
    `${type}-preview.html`
  );
  const previewJsUri = vscode.Uri.joinPath(
    context.extensionUri,
    "out",
    "webviews",
    `${type}-preview.bundle.js`
  );

  const webviewHtml =
    Buffer.from(await vscode.workspace.fs.readFile(htmlUri)).toString() || "";
  const rootUriPath = panel.webview
    .asWebviewUri(context.extensionUri)
    .toString();
  const previewJsUriPath = panel.webview.asWebviewUri(previewJsUri).toString();

  panel.webview.html = webviewHtml
    .replace(/\$ROOTDIR\$/g, rootUriPath)
    .replace(/\$PREVIEWJS\$/g, previewJsUriPath);

  panel.webview.postMessage({
    command: "setstate",
    uri: uri.toString(),
    dynamic: dynamic,
  });
  const config = getSparkdownConfig(uri);
  panel.webview.postMessage({
    command: "sparkdown.updateconfig",
    content: config,
  });

  const editor = getEditor(uri);
  if (!editor) {
    return;
  }

  watchFiles(editor.document);
  await updateAssets(editor.document);
  parseSparkDocument(editor.document);

  const syncedWithCursor =
    type === "game"
      ? config.game_preview_synchronized_with_cursor
      : config.screenplay_preview_synchronized_with_cursor;
  if (syncedWithCursor) {
    panel.webview.postMessage({
      command: "sparkdown.highlightline",
      content: editor.selection.start.line,
    });
    panel.webview.postMessage({
      command: "sparkdown.showsourceline",
      content: getVisibleLine(editor),
      linescount: editor.document.lineCount,
      source: "scroll",
    });
  }
};