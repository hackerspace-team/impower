import { SelectedEditorMessage } from "@impower/spark-editor-protocol/src/protocols/editor/SelectedEditorMessage";
import { ConfigureGameMessage } from "@impower/spark-editor-protocol/src/protocols/game/ConfigureGameMessage";
import { LoadGameMessage } from "@impower/spark-editor-protocol/src/protocols/game/LoadGameMessage";
import { WillExecuteGameCommandMessage } from "@impower/spark-editor-protocol/src/protocols/game/WillExecuteGameCommandMessage";
import { LoadPreviewMessage } from "@impower/spark-editor-protocol/src/protocols/preview/LoadPreviewMessage";
import { DidParseTextDocumentMessage } from "@impower/spark-editor-protocol/src/protocols/textDocument/DidParseTextDocumentMessage";
import getNextPreviewCommandToken from "../../../../../../packages/spark-engine/src/builder/utils/getNextPreviewCommandToken";
import getPreviousPreviewCommandToken from "../../../../../../packages/spark-engine/src/builder/utils/getPreviousPreviewCommandToken";
import { SparkProgram } from "../../../../../../packages/sparkdown/src/types/SparkProgram";
import { Component } from "../../../../../../packages/spec-component/src/component";
import { Workspace } from "../../workspace/Workspace";
import spec from "./_preview-game";

export default class GamePreview extends Component(spec) {
  _uri = "";

  _programs: { uri: string; program: SparkProgram }[] = [];

  _startFromLine = 0;

  override onConnected() {
    this.configureGame();
    this.loadPreview();
    window.addEventListener(
      DidParseTextDocumentMessage.method,
      this.handleDidParseTextDocument
    );
    window.addEventListener(
      SelectedEditorMessage.method,
      this.handleSelectedEditor
    );
    window.addEventListener(
      WillExecuteGameCommandMessage.method,
      this.handleWillExecuteGameCommand
    );
    window.addEventListener("keydown", this.handleKeyDown);
    this.loadGame();
  }

  override onDisconnected() {
    window.removeEventListener(
      DidParseTextDocumentMessage.method,
      this.handleDidParseTextDocument
    );
    window.removeEventListener(
      SelectedEditorMessage.method,
      this.handleSelectedEditor
    );
    window.removeEventListener(
      WillExecuteGameCommandMessage.method,
      this.handleWillExecuteGameCommand
    );
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleDidParseTextDocument = async (e: Event) => {
    if (e instanceof CustomEvent) {
      await this.configureGame();
      await this.loadGame();
      await this.loadPreview();
    }
  };

  handleSelectedEditor = async (e: Event) => {
    if (e instanceof CustomEvent) {
      const message = e.detail;
      if (SelectedEditorMessage.type.isNotification(message)) {
        const { textDocument, selectedRange, docChanged } = message.params;
        if (textDocument.uri === this._uri && !docChanged) {
          const newEntryLine = selectedRange?.start?.line ?? 0;
          if (newEntryLine !== this._startFromLine) {
            await this.configureGame();
            await this.loadPreview();
          }
        }
      }
    }
  };

  handleWillExecuteGameCommand = async (e: Event) => {
    if (e instanceof CustomEvent) {
      const message = e.detail;
      if (WillExecuteGameCommandMessage.type.isNotification(message)) {
        const { textDocument, range } = message.params;
        Workspace.window.revealEditorRange(
          textDocument.uri,
          { start: range.start, end: range.start },
          true
        );
      }
    }
  };

  handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === "PageUp") {
      await this.pageUp();
    }
    if (e.key === "PageDown") {
      await this.pageDown();
    }
  };

  override onStoreUpdate() {
    const store = this.stores.workspace.current;
    const running = store?.preview?.modes?.game?.running;
    const editor = Workspace.window.getActiveEditorForPane("logic");
    if (!running && editor) {
      const { uri } = editor;
      if (uri && uri !== this._uri) {
        this.configureGame();
      }
    }
  }

  async configureGame() {
    const editor = Workspace.window.getActiveEditorForPane("logic");
    if (editor) {
      const { uri, selectedRange } = editor;
      const startLine = selectedRange?.start?.line ?? 0;
      this._programs = Object.entries(
        (await Workspace.ls.getPrograms()) || {}
      ).map(([uri, program]) => ({ uri, program }));
      this._startFromLine = startLine;
      this._uri = uri;
      const waypoints: { uri: string; line: number }[] = [];
      if (Workspace.window.store.project.breakpointRanges) {
        Object.entries(Workspace.window.store.project.breakpointRanges).forEach(
          ([uri, ranges]) => {
            ranges.forEach((range) =>
              waypoints.push({ uri, line: range.start.line })
            );
          }
        );
      }
      const startpoint = {
        uri,
        line: startLine,
      };
      if (this._programs.some((p) => p.uri === uri)) {
        this.emit(
          ConfigureGameMessage.method,
          ConfigureGameMessage.type.request({
            settings: {
              waypoints,
              startpoint,
            },
          })
        );
      }
    }
  }

  async loadGame() {
    const store = this.stores.workspace.current;
    const projectId = store?.project?.id;
    if (projectId) {
      const editor = Workspace.window.getActiveEditorForPane("logic");
      if (editor) {
        const { uri, selectedRange } = editor;
        if (uri) {
          this._programs = Object.entries(
            (await Workspace.ls.getPrograms()) || {}
          ).map(([uri, program]) => ({ uri, program }));
          this._startFromLine = selectedRange?.start?.line ?? 0;
          this._uri = uri;
          if (this._programs.some((p) => p.uri === uri)) {
            this.emit(
              LoadGameMessage.method,
              LoadGameMessage.type.request({
                programs: this._programs,
              })
            );
          }
        }
      }
    }
  }

  async loadPreview() {
    const store = this.stores.workspace.current;
    const projectId = store.project.id;
    const running = store.preview.modes.game.running;
    if (projectId && !running) {
      const editor = Workspace.window.getActiveEditorForPane("logic");
      if (editor) {
        const { uri, visibleRange, selectedRange } = editor;
        const files = await Workspace.fs.getFiles(projectId);
        const file = files[uri];
        if (
          file &&
          file.text != null &&
          this._programs.some((p) => p.uri === uri)
        ) {
          this.emit(
            LoadPreviewMessage.method,
            LoadPreviewMessage.type.request({
              type: "game",
              textDocument: {
                uri,
                languageId: "sparkdown",
                version: file.version,
                text: file.text,
              },
              visibleRange,
              selectedRange,
            })
          );
        }
      }
    }
  }

  async pageUp() {
    const editor = Workspace.window.getActiveEditorForPane("logic");
    if (editor) {
      const { uri, selectedRange } = editor;
      const cached = this._programs.find((p) => p.uri === uri);
      const program = cached?.program;
      const currLine = selectedRange?.start.line ?? 0;
      if (program) {
        const previewCommandToken = getPreviousPreviewCommandToken(
          program,
          currLine
        );
        if (previewCommandToken) {
          const range = {
            start: {
              line: previewCommandToken.line,
              character: 0,
            },
            end: {
              line: previewCommandToken.line,
              character: 0,
            },
          };
          Workspace.window.revealEditorRange(uri, range, true);
        }
      }
    }
  }

  async pageDown() {
    const editor = Workspace.window.getActiveEditorForPane("logic");
    if (editor) {
      const { uri, selectedRange } = editor;
      const cached = this._programs.find((p) => p.uri === uri);
      const program = cached?.program;
      const currLine = selectedRange?.start.line ?? 0;
      if (program) {
        const previewCommandToken = getNextPreviewCommandToken(
          program,
          currLine
        );
        if (previewCommandToken) {
          const range = {
            start: {
              line: previewCommandToken.line,
              character: 0,
            },
            end: {
              line: previewCommandToken.line,
              character: 0,
            },
          };
          Workspace.window.revealEditorRange(uri, range, true);
        }
      }
    }
  }
}
