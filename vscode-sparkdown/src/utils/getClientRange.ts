import { Range } from "@impower/spark-editor-protocol/src/types";
import * as vscode from "vscode";

export const getClientRange = (range: Range): vscode.Range =>
  new vscode.Range(
    new vscode.Position(range.start.line, range.start.character),
    new vscode.Position(range.end.line, range.end.character)
  );
