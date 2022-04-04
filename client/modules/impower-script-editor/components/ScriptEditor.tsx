import { basicSetup, EditorState, EditorView } from "@codemirror/basic-setup";
import { foldEffect, unfoldAll } from "@codemirror/fold";
import { highlightActiveLineGutter } from "@codemirror/gutter";
import { HighlightStyle } from "@codemirror/highlight";
import { historyField, redo, undo } from "@codemirror/history";
import { foldable, indentUnit } from "@codemirror/language";
import {
  closeLintPanel,
  lintGutter,
  openLintPanel,
  setDiagnosticsEffect,
} from "@codemirror/lint";
import { panels } from "@codemirror/panel";
import {
  closeSearchPanel,
  findNext,
  findPrevious,
  getSearchQuery,
  openSearchPanel,
  replaceAll,
  replaceNext,
  search,
  SearchQuery,
  selectMatches,
  setSearchQuery,
} from "@codemirror/search";
import { Compartment, EditorSelection } from "@codemirror/state";
import { tooltips } from "@codemirror/tooltip";
import { PluginField, ViewPlugin, ViewUpdate } from "@codemirror/view";
import React, { useEffect, useRef } from "react";
import {
  parseSpark,
  SparkDeclarations,
  SparkParseResult,
} from "../../impower-script-parser";
import { colors } from "../constants/colors";
import { editorTheme } from "../constants/editorTheme";
import {
  highlightRunningLineGutter,
  setRunningLinePosition,
} from "../extensions/runningLineGutter";
import {
  closeSearchLinePanel,
  getSearchLineQuery,
  openSearchLinePanel,
  searchLine,
  searchLinePanel,
  SearchLineQuery,
  setSearchLineQuery,
} from "../extensions/searchLinePanel";
import { setSnippetPreview } from "../extensions/snippetPreview";
import {
  SerializableChangeSet,
  SerializableEditorSelection,
  SerializableEditorState,
} from "../types/editor";
import { getDiagnostics } from "../utils/getDiagnostics";
import { quickSnippet } from "../utils/quickSnippet";
import { spark } from "../utils/spark";
import { sparkLanguage, tags as t } from "../utils/sparkLanguage";
import { SearchPanel, SearchTextQuery } from "./SearchTextPanel";

const gutterCompartment = new Compartment();

const marginPlugin = ViewPlugin.fromClass(
  class {
    margin: { top: number; bottom: number };

    update(_update: ViewUpdate): void {
      this.margin = { top: 104, bottom: 128 };
    }
  },
  {
    provide: PluginField.scrollMargins.from((value) => value.margin),
  }
);

const myHighlightStyle = HighlightStyle.define([
  {
    tag: t.formatting,
    color: colors.formatting,
    opacity: 0.5,
    fontWeight: 400,
  },
  { tag: t.centered, color: colors.formatting },
  { tag: t.strong, color: colors.formatting, fontWeight: "bold" },
  { tag: t.emphasis, color: colors.formatting, fontStyle: "italic" },
  {
    tag: t.link,
    color: colors.formatting,
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  },
  {
    tag: t.strikethrough,
    color: colors.formatting,
    textDecoration: "line-through",
  },
  {
    tag: t.dialogue,
    color: colors.dialogue,
  },
  {
    tag: t.character,
    color: colors.character,
  },
  {
    tag: t.parenthetical,
    color: colors.parenthetical,
  },
  {
    tag: t.dualDialogue,
    color: colors.dualDialogue,
  },
  { tag: t.section, color: colors.section },
  { tag: t.sectionMark, color: colors.section, opacity: 0.5 },
  {
    tag: t.scene,
    color: colors.scene,
  },
  {
    tag: t.sceneNumber,
    opacity: 0.5,
  },
  { tag: t.pageBreak, color: colors.pageBreak },
  { tag: t.transition, color: colors.transition },
  { tag: t.assetName, color: colors.asset },
  { tag: t.tagName, color: colors.tag },
  { tag: t.conditionCheck, color: colors.condition },
  {
    tag: t.titleValue,
    color: colors.titleValue,
  },
  {
    tag: t.titleKey,
    color: colors.titleKey,
    fontWeight: 400,
  },
  { tag: t.lyric, fontStyle: "italic" },
  { tag: t.note, color: colors.note },
  { tag: t.noteMark, color: colors.note, opacity: 0.5 },
  { tag: t.synopses, color: colors.comment },
  { tag: t.synopsesMark, color: colors.comment, opacity: 0.5 },
  { tag: t.comment, color: colors.comment },
  {
    tag: t.url,
    color: colors.operator,
  },
  {
    tag: t.escape,
    color: colors.operator,
  },

  { tag: t.keyword, color: colors.keyword },
  { tag: t.typeName, color: colors.typeName },
  { tag: t.sectionName, color: colors.sectionName },
  { tag: t.variableName, color: colors.variableName },
  { tag: t.parameterName, color: colors.parameterName },
  {
    tag: t.string,
    color: colors.string,
  },
  {
    tag: t.number,
    color: colors.number,
  },
  {
    tag: t.boolean,
    color: colors.boolean,
  },
  {
    "tag": t.pause,
    "position": "relative",
    "&:after": {
      content: "'·'",
      opacity: "0.4",
      position: "absolute",
      top: "1px",
      bottom: "0",
      left: "0",
      right: "0",
      textAlign: "center",
      color: colors.keyword,
    },
  },

  { tag: t.invalid, color: colors.invalid },
]);

interface ScriptEditorProps {
  defaultValue: string;
  augmentations?: SparkDeclarations;
  runningLine?: number;
  toggleFolding?: boolean;
  toggleLinting?: boolean;
  toggleGotoLine?: boolean;
  focusFirstError?: boolean;
  snippetPreview?: string;
  searchTextQuery?: SearchTextQuery;
  searchLineQuery?: SearchLineQuery;
  editorChange: {
    category?: string;
    action?: string;
    focus?: boolean;
    selection?: SerializableEditorSelection;
  };
  defaultState?: SerializableEditorState;
  defaultScrollTopLine?: number;
  scrollTopLine?: number;
  scrollTopLineOffset?: number;
  cursor?: {
    anchor: number;
    head: number;
    fromLine: number;
    toLine: number;
  };
  topPanelsContainer?: HTMLElement;
  bottomPanelsContainer?: HTMLElement;
  style?: React.CSSProperties;
  onUpdate?: (update: ViewUpdate) => void;
  onEditorUpdate?: (value: string, state?: SerializableEditorState) => void;
  onDocChange?: (value: string, changes: SerializableChangeSet) => void;
  onParse?: (result: SparkParseResult) => void;
  onCursor?: (range: {
    anchor: number;
    head: number;
    fromLine: number;
    toLine: number;
  }) => void;
  getRuntimeValue?: (id: string) => unknown;
  setRuntimeValue?: (id: string, expression: string) => void;
  observeRuntimeValue?: (
    listener: (id: string, value: unknown) => void
  ) => void;
  onScrollLine?: (event: Event, firstVisibleLine: number) => void;
  onOpenSearchTextPanel?: (query?: SearchTextQuery) => void;
  onCloseSearchTextPanel?: (query?: SearchTextQuery) => void;
  onOpenSearchLinePanel?: (query?: SearchLineQuery) => void;
  onCloseSearchLinePanel?: (query?: SearchLineQuery) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const ScriptEditor = React.memo((props: ScriptEditorProps): JSX.Element => {
  const {
    defaultValue,
    augmentations,
    style,
    runningLine,
    toggleFolding,
    toggleLinting,
    toggleGotoLine,
    focusFirstError,
    snippetPreview,
    searchTextQuery,
    searchLineQuery,
    editorChange,
    defaultState,
    defaultScrollTopLine,
    scrollTopLine,
    scrollTopLineOffset = 0,
    cursor,
    topPanelsContainer,
    bottomPanelsContainer,
    onUpdate,
    onEditorUpdate,
    onDocChange,
    onParse,
    onCursor,
    onScrollLine,
    getRuntimeValue,
    setRuntimeValue,
    observeRuntimeValue,
    onOpenSearchTextPanel,
    onCloseSearchTextPanel,
    onOpenSearchLinePanel,
    onCloseSearchLinePanel,
    onFocus,
    onBlur,
  } = props;

  const initialRef = useRef(true);
  const firstMatchFromRef = useRef<number>();
  const parentElRef = useRef<HTMLDivElement>();
  const viewRef = useRef<EditorView>();
  const cursorRef = useRef<{
    anchor: number;
    head: number;
    fromLine: number;
    toLine: number;
  }>();
  const firstVisibleLineRef = useRef<number>();
  const editorStateRef = useRef<SerializableEditorState>();
  const parseResultRef = useRef<SparkParseResult>();
  const searchLineQueryRef = useRef(searchLineQuery);

  const scrollTopLineOffsetRef = useRef(scrollTopLineOffset);
  scrollTopLineOffsetRef.current = scrollTopLineOffset;
  const defaultValueRef = useRef(defaultValue);
  const defaultScrollTopLineRef = useRef(defaultScrollTopLine);
  const defaultStateRef = useRef(defaultState);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;
  const onEditorUpdateRef = useRef(onEditorUpdate);
  onEditorUpdateRef.current = onEditorUpdate;
  const onDocChangeRef = useRef(onDocChange);
  onDocChangeRef.current = onDocChange;
  const onCursorRef = useRef(onCursor);
  onCursorRef.current = onCursor;
  const onScrollLineRef = useRef(onScrollLine);
  onScrollLineRef.current = onScrollLine;
  const onParseRef = useRef(onParse);
  onParseRef.current = onParse;
  const getRuntimeValueRef = useRef(getRuntimeValue);
  getRuntimeValueRef.current = getRuntimeValue;
  const setRuntimeValueRef = useRef(setRuntimeValue);
  setRuntimeValueRef.current = setRuntimeValue;
  const observeRuntimeValueRef = useRef(observeRuntimeValue);
  observeRuntimeValueRef.current = observeRuntimeValue;
  const onOpenSearchTextPanelRef = useRef(onOpenSearchTextPanel);
  onOpenSearchTextPanelRef.current = onOpenSearchTextPanel;
  const onCloseSearchTextPanelRef = useRef(onCloseSearchTextPanel);
  onCloseSearchTextPanelRef.current = onCloseSearchTextPanel;
  const onOpenSearchLinePanelRef = useRef(onOpenSearchLinePanel);
  onOpenSearchLinePanelRef.current = onOpenSearchLinePanel;
  const onCloseSearchLinePanelRef = useRef(onCloseSearchLinePanel);
  onCloseSearchLinePanelRef.current = onCloseSearchLinePanel;
  const onFocusRef = useRef(onFocus);
  onFocusRef.current = onFocus;
  const onBlurRef = useRef(onBlur);
  onBlurRef.current = onBlur;
  const augmentationsRef = useRef(augmentations);
  augmentationsRef.current = augmentations;

  useEffect(() => {
    const onOpenSearchTextPanel = (view: EditorView): void => {
      const query = getSearchQuery(view.state);
      if (onOpenSearchTextPanelRef.current) {
        onOpenSearchTextPanelRef.current(query);
      }
    };
    const onCloseSearchTextPanel = (view: EditorView): void => {
      const query = getSearchQuery(view.state);
      if (onCloseSearchTextPanelRef.current) {
        onCloseSearchTextPanelRef.current(query);
      }
    };
    const onOpenSearchLinePanel = (view: EditorView): void => {
      const query = getSearchLineQuery(view.state);
      if (onOpenSearchLinePanelRef.current) {
        onOpenSearchLinePanelRef.current(query);
      }
    };
    const onCloseSearchLinePanel = (view: EditorView): void => {
      const query = getSearchLineQuery(view.state);
      if (onCloseSearchLinePanelRef.current) {
        onCloseSearchLinePanelRef.current(query);
      }
    };
    const doc =
      defaultStateRef.current?.doc != null
        ? defaultStateRef.current?.doc
        : defaultValueRef.current;
    const selection =
      defaultStateRef.current?.selection != null
        ? EditorSelection.fromJSON(defaultStateRef.current?.selection)
        : { anchor: 0, head: 0 };
    let restoredState: EditorState;
    if (defaultStateRef.current) {
      const { doc, selection, history } = defaultStateRef.current;
      restoredState = EditorState.fromJSON(
        { doc, selection, history },
        {},
        { history: historyField }
      );
    }
    const restoredExtensions = restoredState
      ? [historyField.init(() => restoredState.field(historyField))]
      : [];
    const startState = EditorState.create({
      doc,
      selection,
      extensions: [
        ...restoredExtensions,
        marginPlugin,
        searchLinePanel({
          onOpen: onOpenSearchLinePanel,
          onClose: onCloseSearchLinePanel,
        }),
        search({
          top: true,
          createPanel: (view: EditorView) => {
            return new SearchPanel(view, {
              onOpen: onOpenSearchTextPanel,
              onClose: onCloseSearchTextPanel,
            });
          },
        }),
        panels({
          topContainer: topPanelsContainer,
          bottomContainer: bottomPanelsContainer,
        }),
        spark({
          base: sparkLanguage,
          initialParseResult: parseSpark(doc, augmentationsRef.current),
          parse: (script: string) => {
            const result = parseSpark(script, augmentationsRef.current);
            parseResultRef.current = { ...result };
            if (onParseRef.current) {
              onParseRef.current(result);
            }
            return result;
          },
          getRuntimeValue: getRuntimeValueRef.current,
          setRuntimeValue: setRuntimeValueRef.current,
          observeRuntimeValue: observeRuntimeValueRef.current,
        }),
        tooltips({
          position: "absolute",
          tooltipSpace: (): {
            top: number;
            left: number;
            bottom: number;
            right: number;
          } => {
            return {
              top: 128,
              left: 0,
              bottom: window.innerHeight - 64,
              right: window.innerWidth,
            };
          },
        }),
        gutterCompartment.of(lintGutter()),
        highlightActiveLineGutter(),
        myHighlightStyle,
        indentUnit.of("  "),
        basicSetup,
        EditorState.phrases.of({ "No diagnostics": "No errors" }),
        EditorView.theme(
          {
            ...editorTheme,
            ".cm-panels": {
              ...(style?.backgroundColor
                ? { backgroundColor: style?.backgroundColor }
                : {}),
            },
            ".cm-scroller": {
              fontFamily: "Courier Prime Sans",
              overflowX: "hidden",
            },
          },
          { dark: true }
        ),
        EditorView.domEventHandlers({
          scroll: (e, v) => {
            const scrollEl = e.target as HTMLElement;
            const scrollTop =
              scrollEl?.scrollTop != null
                ? scrollEl?.scrollTop
                : window.scrollY;
            let firstVisibleLine;
            for (let i = 0; i < v.viewportLineBlocks.length; i += 1) {
              const block = v.viewportLineBlocks[i];
              if (block.top - scrollTop > 0) {
                firstVisibleLine = v.state.doc.lineAt(block.from).number;
                break;
              }
            }
            if (firstVisibleLineRef.current !== firstVisibleLine) {
              firstVisibleLineRef.current = firstVisibleLine;
              if (onScrollLineRef.current) {
                onScrollLineRef.current(e, firstVisibleLine);
              }
            }
          },
        }),
        EditorView.lineWrapping,
        EditorView.updateListener.of((u) => {
          if (onUpdateRef.current) {
            onUpdateRef.current(u);
          }
          const json = u.state.toJSON({ history: historyField });
          const doc = u.view.state.doc.toJSON().join("\n");
          const selection =
            u.view.state.selection.toJSON() as SerializableEditorSelection;
          const history = json?.history;
          const transaction = u.transactions?.[0];
          const userEvent = transaction?.isUserEvent("undo")
            ? "undo"
            : transaction?.isUserEvent("redo")
            ? "redo"
            : null;
          const focused = u.view.hasFocus;
          const parentEl = parentElRef.current;
          const snippet = Boolean(parentEl?.querySelector(".cm-snippetField"));
          const lint = Boolean(parentEl?.querySelector(".cm-panel-lint"));
          const selected =
            selection?.ranges?.[selection.main]?.head !==
            selection?.ranges?.[selection.main]?.anchor;
          const diagnostics = parseResultRef.current?.diagnostics;
          const editorState = {
            doc,
            selection,
            history,
            userEvent,
            focused,
            selected,
            snippet,
            diagnostics,
          };
          if (parentEl) {
            if (snippet) {
              parentEl.classList.add("cm-snippet");
            } else {
              parentEl.classList.remove("cm-snippet");
            }
            if (lint) {
              parentEl.classList.add("cm-lint");
            } else {
              parentEl.classList.remove("cm-lint");
            }
          }
          if (
            JSON.stringify(editorStateRef.current || {}) !==
            JSON.stringify(editorState)
          ) {
            if (onEditorUpdateRef.current) {
              onEditorUpdateRef.current(doc, editorState);
            }
          }
          if (u.focusChanged) {
            if (u.view.hasFocus) {
              onFocusRef.current?.();
            } else {
              onBlurRef.current?.();
            }
          }
          if (u.docChanged) {
            onDocChangeRef.current?.(doc, u.changes.toJSON());
          }
          editorStateRef.current = editorState;
          const cursorRange = u.state.selection.main;
          const anchor = cursorRange?.anchor;
          const head = cursorRange?.head;
          const fromLine = u.state.doc.lineAt(anchor)?.number;
          const toLine = u.state.doc.lineAt(head)?.number;
          if (
            cursorRef.current?.fromLine !== fromLine ||
            cursorRef.current?.toLine !== toLine ||
            cursorRef.current?.anchor !== anchor ||
            cursorRef.current?.head !== head
          ) {
            if (onCursorRef.current) {
              onCursorRef.current({
                anchor,
                head,
                fromLine,
                toLine,
              });
            }
          }
          cursorRef.current = {
            anchor,
            head,
            fromLine,
            toLine,
          };
        }),
      ],
    });
    viewRef.current = new EditorView({
      state: startState,
      parent: parentElRef.current,
    });
    return (): void => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialRef.current && viewRef.current && editorChange) {
      if (editorChange.action === "undo") {
        undo(viewRef.current);
      } else if (editorChange.action === "redo") {
        redo(viewRef.current);
      } else {
        quickSnippet(viewRef.current, editorChange.action);
      }
      if (editorChange.focus) {
        if (!viewRef.current.hasFocus) {
          viewRef.current.focus();
        }
      }
      if (editorChange.selection) {
        const anchor =
          editorChange.selection?.ranges?.[editorChange.selection?.main]
            ?.anchor;
        const changeSelection = (): void => {
          viewRef.current.dispatch({
            selection: {
              anchor,
            },
          });
        };
        if (editorChange.focus) {
          window.requestAnimationFrame(changeSelection);
        } else {
          changeSelection();
        }
      }
    }
    initialRef.current = false;
  }, [editorChange]);

  const focusFirstErrorRef = useRef(focusFirstError);
  focusFirstErrorRef.current = focusFirstError;

  useEffect(() => {
    const view = viewRef.current;
    if (toggleLinting) {
      view.dispatch({
        effects: [
          setDiagnosticsEffect.of(
            getDiagnostics(parseResultRef.current?.diagnostics)
          ),
        ],
      });
      openLintPanel(view);
      const firstError = parseResultRef.current?.diagnostics?.[0];
      if (focusFirstErrorRef.current && firstError) {
        view.dispatch({
          selection: { anchor: firstError.from, head: firstError.to },
          effects: EditorView.scrollIntoView(
            EditorSelection.range(firstError.from, firstError.to),
            {
              y: "center",
            }
          ),
        });
      }
    } else {
      closeLintPanel(view);
    }
  }, [toggleLinting]);

  useEffect(() => {
    if (toggleFolding) {
      const view = viewRef?.current;
      const state = view?.state;
      const effects = [];
      for (let pos = 0; pos < state.doc.length; ) {
        const line = view.lineBlockAt(pos);
        const range = foldable(state, line.from, line.to);
        if (range) {
          effects.push(foldEffect.of(range));
        }
        pos = line.to + 1;
      }
      viewRef.current.dispatch({
        effects,
      });
    } else {
      unfoldAll(viewRef.current);
    }
  }, [toggleFolding]);

  useEffect(() => {
    const view = viewRef.current;
    if (toggleGotoLine) {
      openSearchLinePanel(view);
    } else {
      closeSearchLinePanel(view);
    }
  }, [toggleGotoLine]);

  useEffect(() => {
    const view = viewRef.current;
    if (searchLineQuery) {
      if (searchLineQueryRef.current?.search !== searchLineQuery?.search) {
        openSearchLinePanel(view);
        view.dispatch({
          effects: [setSearchLineQuery.of(searchLineQuery)],
        });
        searchLine(view);
      }
    } else {
      closeSearchLinePanel(view);
    }
    searchLineQueryRef.current = searchLineQuery;
  }, [searchLineQuery]);

  useEffect(() => {
    const view = viewRef.current;
    if (searchTextQuery) {
      if (searchTextQuery.action === "find_next") {
        if (searchTextQuery.search) {
          findNext(view);
        }
      } else if (searchTextQuery.action === "find_previous") {
        if (searchTextQuery.search) {
          findPrevious(view);
        }
      } else if (searchTextQuery.action === "replace") {
        if (searchTextQuery.search) {
          replaceNext(view);
        }
      } else if (searchTextQuery.action === "replace_all") {
        if (searchTextQuery.search) {
          replaceAll(view);
        }
      } else {
        openSearchPanel(view);
        view.dispatch({
          effects: [
            setSearchQuery.of(
              new SearchQuery({
                search: searchTextQuery.search,
                caseSensitive: searchTextQuery.caseSensitive,
                regexp: searchTextQuery.regexp,
                replace: searchTextQuery.replace,
              })
            ),
          ],
        });
        if (searchTextQuery.search) {
          const matchFound = selectMatches(view);
          if (matchFound) {
            const firstMatchFrom = Math.min(
              ...(view.state?.selection?.ranges?.map((r) => r.from) || [])
            );
            if (firstMatchFromRef.current !== firstMatchFrom) {
              firstMatchFromRef.current = firstMatchFrom;
              viewRef.current.dispatch({
                selection: { anchor: firstMatchFrom },
                effects: EditorView.scrollIntoView(firstMatchFrom, {
                  y: "center",
                }),
              });
            }
          }
        }
      }
    } else {
      closeSearchPanel(view);
    }
  }, [searchTextQuery]);

  useEffect(() => {
    const view = viewRef.current;
    if (view) {
      if (runningLine > 0) {
        view.dispatch({
          effects: gutterCompartment.reconfigure(highlightRunningLineGutter()),
        });
      } else {
        view.dispatch({
          effects: gutterCompartment.reconfigure(lintGutter()),
        });
      }
      view.dispatch({
        effects: [
          setRunningLinePosition.of(
            runningLine > 0
              ? { from: view?.state?.doc?.line(runningLine)?.from }
              : undefined
          ),
        ],
      });
    }
  }, [runningLine]);

  const isRunning = runningLine != null;
  useEffect(() => {
    const view = viewRef.current;
    if (isRunning) {
      view.dispatch({
        effects: [
          setDiagnosticsEffect.of(
            getDiagnostics(parseResultRef.current?.diagnostics)
          ),
        ],
      });
    }
  }, [isRunning]);

  useEffect(() => {
    if (viewRef.current && cursor) {
      const line = Math.max(1, cursor.fromLine);
      const from = viewRef.current.state.doc.line(line)?.from;
      viewRef.current.dispatch({
        selection: { anchor: from },
        effects: EditorView.scrollIntoView(from, { y: "center" }),
      });
    }
  }, [cursor]);

  useEffect(() => {
    if (viewRef.current && defaultScrollTopLineRef.current >= 0) {
      const line = Math.max(
        1,
        defaultScrollTopLineRef.current + scrollTopLineOffsetRef.current
      );
      const from = viewRef.current.state.doc.line(line)?.from;
      viewRef.current.dispatch({
        effects: EditorView.scrollIntoView(from, { y: "start" }),
      });
    }
  }, []);

  useEffect(() => {
    if (viewRef.current && scrollTopLine >= 0) {
      const line = Math.max(1, scrollTopLine + scrollTopLineOffsetRef.current);
      const from = viewRef.current.state.doc.line(line)?.from;
      viewRef.current.dispatch({
        effects: EditorView.scrollIntoView(from, { y: "start" }),
      });
    }
  }, [scrollTopLine]);

  useEffect(() => {
    if (viewRef.current && snippetPreview != null) {
      viewRef.current.dispatch({
        effects: [setSnippetPreview.of(snippetPreview)],
      });
    }
  }, [snippetPreview]);

  return (
    <div
      ref={parentElRef}
      style={{ flex: 1, display: "flex", flexDirection: "column", ...style }}
    ></div>
  );
});

export default ScriptEditor;
