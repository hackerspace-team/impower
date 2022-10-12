import path from "path";
import * as vscode from "vscode";
import { SparkVariable } from "../../../sparkdown";
import { audioExts, imageExts } from "../constants/extensions";
import { fileState } from "../state/fileState";
import { getAssetsRelativePath } from "./getAssetsRelativePath";

export const updateAssets = async (doc: vscode.TextDocument) => {
  const uri = doc.uri;
  const relativePath = getAssetsRelativePath(uri);
  if (!relativePath) {
    return undefined;
  }
  return vscode.workspace
    .findFiles(relativePath)
    .then((assetUris: vscode.Uri[]) => {
      const assets: Record<string, SparkVariable> = {};
      assetUris.forEach((u) => {
        const parsedPath = path.parse(u.path);
        const name = parsedPath.name;
        const ext = parsedPath.ext.replace(".", "");
        const type = imageExts.includes(ext)
          ? "image"
          : audioExts.includes(ext)
          ? "audio"
          : "";
        if (type) {
          const id = `.${name}`;
          const sparkAsset: SparkVariable = {
            from: -1,
            to: -1,
            line: -1,
            type,
            name,
            value: u.path,
          };
          assets[id] = sparkAsset;
        }
      });
      fileState[uri.toString()].assets = assets;
    });
};