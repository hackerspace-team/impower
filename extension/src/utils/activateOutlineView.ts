import * as vscode from "vscode";
import { SparkdownSymbolProvider } from "../providers/Symbols";
import { outlineViewProvider } from "../state/outlineViewProvider";
import { changeSparkdownUIPersistence, uiPersistence } from "./persistence";

export const activateOutlineView = (context: vscode.ExtensionContext): void => {
  // Register Outline view
  vscode.window.registerTreeDataProvider(
    "sparkdown-outline",
    outlineViewProvider
  );
  outlineViewProvider.treeView = vscode.window.createTreeView(
    "sparkdown-outline",
    { treeDataProvider: outlineViewProvider, showCollapseAll: true }
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("sparkdown.outline.visibleitems", () => {
      const quickPick = vscode.window.createQuickPick();
      quickPick.canSelectMany = true;
      quickPick.items = [
        {
          alwaysShow: true,
          label: "Notes",
          detail: "[[Text enclosed between two brackets]]",
          picked: uiPersistence.outline_visibleNotes,
        },
        {
          alwaysShow: true,
          label: "Synopses",
          detail: "= Any line which starts like this",
          picked: uiPersistence.outline_visibleSynopses,
        },
        {
          alwaysShow: true,
          label: "Sections",
          detail: "# Sections begin with one or more '#'",
          picked: uiPersistence.outline_visibleSections,
        },
        {
          alwaysShow: true,
          label: "Scenes",
          detail:
            "Any line starting with INT. or EXT. is a scene. Can also be forced by starting a line with '.'",
          picked: uiPersistence.outline_visibleScenes,
        },
      ];
      quickPick.selectedItems = quickPick.items.filter((item) => item.picked);
      quickPick.onDidChangeSelection((e) => {
        let visibleScenes = false;
        let visibleSections = false;
        let visibleSynopses = false;
        let visibleNotes = false;
        for (let i = 0; i < e.length; i++) {
          if (e[i].label === "Notes") {
            visibleNotes = true;
          }
          if (e[i].label === "Scenes") {
            visibleScenes = true;
          }
          if (e[i].label === "Sections") {
            visibleSections = true;
          }
          if (e[i].label === "Synopses") {
            visibleSynopses = true;
          }
        }
        changeSparkdownUIPersistence("outline_visibleNotes", visibleNotes);
        changeSparkdownUIPersistence("outline_visibleScenes", visibleScenes);
        changeSparkdownUIPersistence(
          "outline_visibleSections",
          visibleSections
        );
        changeSparkdownUIPersistence(
          "outline_visibleSynopses",
          visibleSynopses
        );
        outlineViewProvider.update();
      });
      quickPick.show();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("sparkdown.outline.reveal", () => {
      outlineViewProvider.reveal();
    })
  );
  //Setup symbols (outline)
  vscode.languages.registerDocumentSymbolProvider(
    { language: "sparkdown" },
    new SparkdownSymbolProvider()
  );
};
