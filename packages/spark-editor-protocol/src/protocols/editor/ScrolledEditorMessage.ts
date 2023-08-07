import { Range, TextDocumentIdentifier } from "../../types";
import { MessageProtocolNotificationType } from "../MessageProtocolNotificationType";

export type ScrolledEditorMethod = typeof ScrolledEditorMessage.method;

export interface ScrolledEditorParams {
  textDocument: TextDocumentIdentifier;
  visibleRange: Range;
  target: string;
}

export namespace ScrolledEditorMessage {
  export const method = "editor/scrolled";
  export const type = new MessageProtocolNotificationType<
    ScrolledEditorMethod,
    ScrolledEditorParams
  >(ScrolledEditorMessage.method);
}
