import { EditorState } from "@codemirror/state";
import { EditorView, highlightActiveLine, ViewUpdate } from "@codemirror/view";
import { syntaxParserRunning } from "@codemirror/language";
import { scrollMargins } from "../../../cm-scroll-margins/scrollMargins";
import debounce from "../../../utils/debounce";
import PREVIEW_THEME from "../constants/PREVIEW_THEME";
import screenplayFormatting from "./screenplayFormatting";

interface EditorConfig {
  textDocument: { uri: string; version: number; text: string };
  scrollMargin?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  stabilizationDuration?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  onIdle?: () => void;
  onSelectionChanged?: (
    update: ViewUpdate,
    anchor: number,
    head: number
  ) => void;
  onHeightChanged?: () => void;
}

const createEditorView = (
  parent: HTMLElement,
  config?: EditorConfig
): EditorView => {
  const textDocument = config?.textDocument;
  const scrollMargin = config?.scrollMargin;
  const stabilizationDuration = config?.stabilizationDuration ?? 50;
  const onBlur = config?.onBlur;
  const onFocus = config?.onFocus;
  const onIdle = config?.onIdle ?? (() => {});
  const onSelectionChanged = config?.onSelectionChanged;
  const onHeightChanged = config?.onHeightChanged;
  const debouncedIdle = debounce(onIdle, stabilizationDuration);
  const startState = EditorState.create({
    doc: textDocument?.text,
    extensions: [
      EditorState.readOnly.of(true),
      EditorView.theme(PREVIEW_THEME),
      EditorView.lineWrapping,
      EditorView.updateListener.of((u) => {
        if (!syntaxParserRunning(u.view)) {
          debouncedIdle();
        }
        if (u.heightChanged) {
          onHeightChanged?.();
        }
        if (u.selectionSet) {
          const cursorRange = u.state.selection.main;
          const anchor = cursorRange?.anchor;
          const head = cursorRange?.head;
          onSelectionChanged?.(u, anchor, head);
        }
        if (u.focusChanged) {
          if (u.view.hasFocus) {
            onFocus?.();
          } else {
            onBlur?.();
          }
        }
      }),
      screenplayFormatting(),
      scrollMargins(scrollMargin),
      highlightActiveLine(),
    ],
  });
  const view = new EditorView({
    state: startState,
    parent,
  });
  return view;
};

export default createEditorView;
