import { GameEvent1 } from "../../core";
import { GameEvent } from "../../core/classes/GameEvent";
import { Manager } from "../../core/classes/Manager";
import { LogData } from "../types/LogData";

export interface DebugEvents extends Record<string, GameEvent> {
  onLog: GameEvent1<LogData>;
}

export interface DebugConfig {}

export interface DebugState {
  debugging: boolean;
  currentLogs: LogData[];
}

export class DebugManager extends Manager<
  DebugEvents,
  DebugConfig,
  DebugState
> {
  constructor(config?: Partial<DebugConfig>, state?: Partial<DebugState>) {
    const initialEvents: DebugEvents = { onLog: new GameEvent1<LogData>() };
    const initialConfig: DebugConfig = { ...(config || {}) };
    const initialState: DebugState = {
      debugging: false,
      currentLogs: [],
      ...(state || {}),
    };
    super(initialEvents, initialConfig, initialState);
  }

  startDebugging(): void {
    this._state.debugging = true;
  }

  stopDebugging(): void {
    this._state.debugging = false;
  }

  log(data: LogData): void {
    this._state.currentLogs.push({ ...data });
    this._events.onLog.dispatch({ ...data });
  }

  clearLogs(): void {
    this._state.currentLogs = [];
  }
}
