export interface Text {
  length: number;
  lines: number;
}

export type ChangeSet = number | [number, string];

export interface ChangeDesc {
  sections: number[];
}

export interface StateEffectType<Value> {
  map: (value: Value, mapping: ChangeDesc) => Value | undefined;
}

export interface StateEffect<Value> {
  type: StateEffectType<Value>;
  value: Value;
}

export interface SelectionRange {
  anchor: number;
  head: number;
}

export interface SerializableEditorSelection {
  ranges: SelectionRange[];
  main: number;
}

export interface HistoryEvent {
  changes?: ChangeSet;
  effects: StateEffect<unknown>[];
  mapped?: ChangeDesc;
  startSelection?: SerializableEditorSelection;
  selectionsAfter: SerializableEditorSelection[];
}

export interface SerializableHistoryState {
  done: HistoryEvent[];
  undone: HistoryEvent[];
}

export interface SerializableEditorState {
  readonly doc: string;
  readonly selection: SerializableEditorSelection;
  readonly history: SerializableHistoryState;
  readonly userEvent?: string;
  readonly focused?: boolean;
  readonly selected?: boolean;
  readonly snippet?: boolean;
  readonly hasError?: boolean;
}

export interface SearchAction {
  search: string;
  caseSensitive?: boolean;
  regexp?: boolean;
  replace?: string;
  action?: "search" | "find_next" | "find_previous" | "replace" | "replace_all";
}
