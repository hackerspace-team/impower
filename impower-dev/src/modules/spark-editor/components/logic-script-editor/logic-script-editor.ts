import { LoadEditorMessage } from "@impower/spark-editor-protocol/src/protocols/editor/LoadEditorMessage.js";
import { DidChangeTextDocumentMessage } from "@impower/spark-editor-protocol/src/protocols/textDocument/DidChangeTextDocumentMessage";
import { DidSaveTextDocumentMessage } from "@impower/spark-editor-protocol/src/protocols/textDocument/DidSaveTextDocumentMessage";
import { Component } from "../../../../../../packages/spec-component/src/component";
import { debounce } from "../../utils/debounce";
import { Workspace } from "../../workspace/Workspace";
import spec from "./_logic-script-editor";

const AUTOSAVE_DELAY = 200;

export default class LogicScriptEditor extends Component(spec) {
  protected _uri?: string;

  protected _version?: number;

  protected _text?: string;

  override onConnected() {
    this.loadFile();
    window.addEventListener(
      DidChangeTextDocumentMessage.method,
      this.handleDidChangeTextDocument
    );
    window.addEventListener(
      DidSaveTextDocumentMessage.method,
      this.handleDidSaveTextDocument
    );
  }

  override onDisconnected() {
    window.removeEventListener(
      DidChangeTextDocumentMessage.method,
      this.handleDidChangeTextDocument
    );
    window.removeEventListener(
      DidSaveTextDocumentMessage.method,
      this.handleDidSaveTextDocument
    );
  }

  protected handleDidChangeTextDocument = async (e: Event) => {
    if (e instanceof CustomEvent) {
      const message = e.detail;
      if (DidChangeTextDocumentMessage.type.isNotification(message)) {
        const params = message.params;
        const textDocument = params.textDocument;
        if (this._uri != null && this._uri === textDocument.uri) {
          this._version = textDocument.version;
        }
      }
    }
  };

  protected handleDidSaveTextDocument = async (e: Event) => {
    if (e instanceof CustomEvent) {
      const message = e.detail;
      if (DidSaveTextDocumentMessage.type.isNotification(message)) {
        const params = message.params;
        const textDocument = params.textDocument;
        const text = params.text;
        if (
          this._uri != null &&
          this._uri === textDocument.uri &&
          this._version != null
        ) {
          if (text != null) {
            this._text = text;
            this.debouncedSave();
          }
        }
      }
    }
  };

  protected debouncedSave = debounce(() => {
    this.save();
  }, AUTOSAVE_DELAY);

  async save() {
    if (this._uri && this._version && this._text) {
      await Workspace.fs.writeTextDocument({
        textDocument: {
          uri: this._uri,
          version: this._version,
          text: this._text,
        },
      });
      await Workspace.window.recordScriptChange();
    }
  }

  override onContextChanged(
    oldContext: { textPulledAt: string },
    newContext: { textPulledAt: string }
  ) {
    if (oldContext.textPulledAt !== newContext.textPulledAt) {
      this.loadFile();
    }
  }

  async loadFile() {
    const store = this.stores.workspace.current;
    const projectId = store?.project?.id;
    if (projectId) {
      const filename = this.filename || "main.script";
      const editor = Workspace.window.getActiveEditorForFile(filename);
      if (editor) {
        const uri = editor.uri;
        const visibleRange = editor.visibleRange;
        const selectedRange = editor.selectedRange;
        const breakpointRanges = editor.breakpointRanges;
        const files = await Workspace.fs.getFiles(projectId);
        const file = files[uri];
        const text = file?.text || "";
        const version = file?.version || 0;
        const languageServerCapabilities =
          await Workspace.lsp.getServerCapabilities();
        this._uri = uri;
        this._version = version;
        this.emit(
          LoadEditorMessage.method,
          LoadEditorMessage.type.request({
            textDocument: {
              uri,
              languageId: "sparkdown",
              version,
              text,
            },
            visibleRange,
            selectedRange,
            breakpointRanges,
            languageServerCapabilities,
          })
        );
      }
    }
  }

  override onInit() {
    this.updateReadonlyState();
  }

  override onStoreUpdate() {
    this.updateReadonlyState();
  }

  updateReadonlyState() {
    const store = this.stores.workspace.current;
    const syncState = store?.project?.syncState;
    if (
      syncState === "syncing" ||
      syncState === "loading" ||
      syncState === "importing" ||
      syncState === "exporting"
    ) {
      this.ref.sparkdownScriptEditor.setAttribute("readonly", "");
    } else {
      this.ref.sparkdownScriptEditor.removeAttribute("readonly");
    }
  }
}
