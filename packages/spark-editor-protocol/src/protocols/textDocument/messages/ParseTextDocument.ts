import type { SparkProgram } from "../../../../../sparkdown/src/types/SparkProgram";
import { TextDocumentIdentifier } from "../../../types";
import { MessageProtocolRequestType } from "../../MessageProtocolRequestType";

export type ParseTextDocumentMethod = typeof ParseTextDocument.method;

export interface ParseTextDocumentParams {
  /**
   * The document that should be parsed.
   */
  textDocument: TextDocumentIdentifier;
}

export abstract class ParseTextDocument {
  static readonly method = "textDocument/parse";
  static readonly type = new MessageProtocolRequestType<
    ParseTextDocumentMethod,
    ParseTextDocumentParams,
    SparkProgram
  >(ParseTextDocument.method);
}