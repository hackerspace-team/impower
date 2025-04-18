import * as vscode from "vscode";
import { SparkdownPreviewScreenplayPanelManager } from "../managers/SparkdownPreviewScreenplayPanelManager";

/**
 * Get the relevant sparkdown document for the currently selected preview or text editor
 */
export const getActiveSparkdownDocument = (): vscode.Uri | undefined => {
  //first check if any previews have focus
  if (
    SparkdownPreviewScreenplayPanelManager.instance.panel?.active &&
    SparkdownPreviewScreenplayPanelManager.instance.document
  ) {
    return SparkdownPreviewScreenplayPanelManager.instance.document?.uri;
  }
  //no previews were active, is activeTextEditor a sparkdown document?
  if (vscode.window.activeTextEditor?.document?.languageId === "sparkdown") {
    return vscode.window.activeTextEditor.document.uri;
  }
  //As a last resort, check if there are any visible sparkdown text editors
  for (let i = 0; i < vscode.window.visibleTextEditors.length; i++) {
    if (
      vscode.window.visibleTextEditors[i]?.document.languageId === "sparkdown"
    ) {
      return vscode.window.visibleTextEditors[i]?.document.uri;
    }
  }
  //all hope is lost
  return undefined;
};
