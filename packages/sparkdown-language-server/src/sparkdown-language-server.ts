import type {
  CompletionItem,
  CompletionParams,
  HoverParams,
  InitializeParams,
  InitializeResult,
  ServerCapabilities,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  TextDocumentSyncKind,
  createConnection,
} from "vscode-languageserver/browser";

import {
  DidParseTextDocument,
  DidParseTextDocumentParams,
} from "@impower/spark-editor-protocol/src/protocols/textDocument/messages/DidParseTextDocument";

import SparkdownTextDocuments from "./classes/SparkdownTextDocuments";
import getColorPresentations from "./utils/getColorPresentations";
import getCompletions from "./utils/getCompletions";
import getDocumentColors from "./utils/getDocumentColors";
import getDocumentDiagnostics from "./utils/getDocumentDiagnostics";
import getDocumentSymbols from "./utils/getDocumentSymbols";
import getFoldingRanges from "./utils/getFoldingRanges";
import getHover from "./utils/getHover";

console.log("running sparkdown-language-server");

try {
  const messageReader = new BrowserMessageReader(self);
  const messageWriter = new BrowserMessageWriter(self);
  const connection = createConnection(messageReader, messageWriter);

  const documents = new SparkdownTextDocuments(TextDocument);

  connection.onInitialize((params: InitializeParams): InitializeResult => {
    const { initializationOptions } = params;
    const { packages } = initializationOptions;
    documents.loadPackages(packages);
    const capabilities: ServerCapabilities = {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      foldingRangeProvider: true,
      documentSymbolProvider: true,
      colorProvider: true,
      hoverProvider: true,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: [".", "\n", "\r", "-", " ", "(", "["],
        completionItem: {
          labelDetailsSupport: true,
        },
      },
    };
    return { capabilities };
  });

  // parseProvider
  documents.onDidParse((change) => {
    const params: DidParseTextDocumentParams = {
      textDocument: {
        uri: change.document.uri,
        version: change.document.version,
      },
      program: change.program,
    };
    connection.sendNotification(DidParseTextDocument.method, params);
    connection.sendDiagnostics(
      getDocumentDiagnostics(change.document, change.program)
    );
  });

  // foldingRangeProvider
  connection.onFoldingRanges((params) => {
    const uri = params.textDocument.uri;
    const document = documents.get(uri);
    const program = documents.program(uri);
    return getFoldingRanges(document, program);
  });

  // documentSymbolProvider
  connection.onDocumentSymbol((params) => {
    const uri = params.textDocument.uri;
    const document = documents.get(uri);
    const program = documents.program(uri);
    return getDocumentSymbols(document, program);
  });

  // colorProvider
  connection.onDocumentColor((params) => {
    const uri = params.textDocument.uri;
    const document = documents.get(uri);
    const program = documents.program(uri);
    return getDocumentColors(document, program);
  });
  connection.onColorPresentation((params) => {
    return getColorPresentations(params.color);
  });

  // hoverProvider
  connection.onHover((params: HoverParams) => {
    const uri = params.textDocument.uri;
    const document = documents.get(uri);
    const program = documents.program(uri);
    return getHover(document, program, params.position);
  });

  // completionProvider
  connection.onCompletion((params: CompletionParams) => {
    const uri = params.textDocument.uri;
    const document = documents.get(uri);
    const program = documents.program(uri);
    return getCompletions(document, program, params.position, params.context);
  });
  connection.onCompletionResolve((item: CompletionItem) => {
    return item;
  });

  documents.listen(connection);

  connection.listen();
} catch (e) {
  console.error(e);
}
