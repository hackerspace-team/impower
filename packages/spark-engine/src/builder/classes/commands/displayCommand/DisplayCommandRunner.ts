import { Game } from "../../../../game/core/classes/Game";
import { EventMessage } from "../../../../game/core/classes/messages/EventMessage";
import { MessageCallback } from "../../../../game/core/types/MessageCallback";
import { CommandRunner } from "../CommandRunner";
import { DisplayCommandData } from "./DisplayCommandData";
import { DisplayContentItem } from "./DisplayCommandParams";
import { executeDisplayCommand } from "./utils/executeDisplayCommand";

export class DisplayCommandRunner<G extends Game> extends CommandRunner<
  G,
  DisplayCommandData
> {
  protected _autoDelay = 0.5;

  protected _wasPressed = false;

  protected _startedExecution = false;

  protected _finishedExecution = false;

  protected _timeTypedMS = -1;

  protected _elapsedMS = 0;

  protected _choices: DisplayContentItem[] | undefined = undefined;

  protected _chosenBlockId: string | undefined = undefined;

  protected _onTick?: (deltaMS: number) => void;

  override isSavepoint(_data: DisplayCommandData): boolean {
    return true;
  }

  override isChoicepoint(data: DisplayCommandData): boolean {
    return data.params.content.some((c) => c.button);
  }

  override onExecute(data: DisplayCommandData) {
    this._wasPressed = false;
    this._startedExecution = false;
    this._finishedExecution = false;
    this._timeTypedMS = -1;
    this._elapsedMS = 0;
    this._chosenBlockId = undefined;
    const { onTick, displayed } = executeDisplayCommand(
      this.game,
      data,
      {},
      () => {
        this._startedExecution = true;
      },
      () => {
        this._finishedExecution = true;
      },
      (c) => {
        const choiceId = data.id + "." + c.instance || "";
        const jumpTo = c.button || "";
        this._chosenBlockId = this.game.module.logic.choose(
          data.parent,
          choiceId,
          jumpTo
        );
      }
    );
    this._choices = displayed?.filter((c) => c.button);
    this._onTick = onTick;
    this._onTick?.(0);

    return super.onExecute(data);
  }

  override onUpdate(deltaMS: number) {
    if (this._onTick) {
      this._onTick(deltaMS);
      this._elapsedMS += deltaMS;
    }
  }

  override onInit(): void {
    this.game.connection.incoming.addListener("event", this.onEvent);
  }

  override onDestroy() {
    this._onTick = undefined;
    this.game.connection.incoming.removeListener("event", this.onEvent);
  }

  onEvent: MessageCallback = (msg) => {
    if (EventMessage.type.isNotification(msg)) {
      const params = msg.params;
      if (params.type === "pointerdown") {
        this._wasPressed = true;
      }
    }
  };

  override isFinished(data: DisplayCommandData) {
    const { autoAdvance } = data.params;
    const waitingForChoice = this._choices && this._choices.length > 0;
    const blockState = this.game.module.logic.state.blocks?.[data.parent];
    if (!blockState) {
      return false;
    }
    if (this._finishedExecution && this._timeTypedMS < 0) {
      this._timeTypedMS = this._elapsedMS;
    }
    const timeMSSinceTyped = this._elapsedMS - this._timeTypedMS;
    if (
      !waitingForChoice &&
      autoAdvance &&
      this._finishedExecution &&
      timeMSSinceTyped / 1000 >= this._autoDelay
    ) {
      return true;
    }
    if (this._wasPressed) {
      this._wasPressed = false;
      if (this._finishedExecution) {
        this._finishedExecution = false;
        if (!waitingForChoice) {
          return true;
        }
      }
      if (this._startedExecution && !waitingForChoice) {
        executeDisplayCommand(this.game, data, {
          instant: true,
        });
        this._finishedExecution = true;
      }
    }
    if (waitingForChoice && this._chosenBlockId != null) {
      const chosenBlockId = this._chosenBlockId;
      this._chosenBlockId = undefined;

      return chosenBlockId;
    }
    return false;
  }

  override onPreview(data: DisplayCommandData) {
    executeDisplayCommand(this.game, data, { instant: true, preview: true });
    return true;
  }
}
