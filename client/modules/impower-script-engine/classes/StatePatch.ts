import { Container } from "./Container";
import { RuntimeObject } from "./RuntimeObject";

export class StatePatch {
  get globals(): Record<string, RuntimeObject> {
    return this._globals;
  }

  get changedVariables(): Set<string> {
    return this._changedVariables;
  }

  get visitCounts(): Map<Container, number> {
    return this._visitCounts;
  }

  get turnIndices(): Map<Container, number> {
    return this._turnIndices;
  }

  constructor();

  constructor(toCopy: StatePatch);

  constructor(...args) {
    if (args.length === 1 && args[0] !== null) {
      const toCopy = args[0] as StatePatch;
      this._globals = { ...toCopy._globals };
      this._changedVariables = new Set(toCopy._changedVariables);
      this._visitCounts = new Map(toCopy._visitCounts);
      this._turnIndices = new Map(toCopy._turnIndices);
    } else {
      this._globals = {};
      this._changedVariables = new Set();
      this._visitCounts = new Map();
      this._turnIndices = new Map();
    }
  }

  public TryGetGlobal(
    name: string,
    /* out */ value: RuntimeObject
  ): RuntimeObject {
    if (name !== null && this._globals[name]) {
      return this._globals[name];
    }

    return value;
  }

  public SetGlobal(name: string, value: RuntimeObject): void {
    this._globals[name] = value;
  }

  public AddChangedVariable(name: string): Set<string> {
    return this._changedVariables.add(name);
  }

  public TryGetVisitCount(
    container: Container,
    /* out */ count: number
  ): { result: number; exists: boolean } {
    if (this._visitCounts.has(container)) {
      return { result: this._visitCounts.get(container), exists: true };
    }

    return { result: count, exists: false };
  }

  public SetVisitCount(container: Container, count: number): void {
    this._visitCounts.set(container, count);
  }

  public SetTurnIndex(container: Container, index: number): void {
    this._turnIndices.set(container, index);
  }

  public TryGetTurnIndex(
    container: Container,
    /* out */ index: number
  ): { result: number; exists: boolean } {
    if (this._turnIndices.has(container)) {
      return { result: this._turnIndices.get(container), exists: true };
    }

    return { result: index, exists: false };
  }

  private _globals: Record<string, RuntimeObject>;

  private _changedVariables: Set<string> = new Set();

  private _visitCounts: Map<Container, number> = new Map();

  private _turnIndices: Map<Container, number> = new Map();
}
