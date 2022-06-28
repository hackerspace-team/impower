import { ImpowerGame } from "../../../../../../../game";
import { CommandContext, CommandRunner } from "../../../command/commandRunner";
import { DisplayCommandData } from "./displayCommandData";
import { executeDisplayCommand } from "./executeDisplayCommand";

export class DisplayCommandRunner extends CommandRunner<DisplayCommandData> {
  down = false;

  wasPressed = false;

  wasTyped = false;

  timeTyped = -1;

  AUTO_DELAY = 0.5;

  init(): void {
    executeDisplayCommand();
  }

  onExecute(
    data: DisplayCommandData,
    context: CommandContext,
    game: ImpowerGame
  ): number[] {
    this.wasPressed = false;
    this.wasTyped = false;
    this.timeTyped = -1;
    this.down = game.input.state.pointer.down.includes(0);
    executeDisplayCommand(data, context, game, undefined, () => {
      this.wasTyped = true;
    });
    return super.onExecute(data, context, game);
  }

  isFinished(
    data: DisplayCommandData,
    context: CommandContext,
    game: ImpowerGame
  ): boolean {
    const prevDown = this.down;
    this.down = game.input.state.pointer.down.includes(0);
    const blockState =
      game.logic.state.blockStates[data.reference.parentContainerId];
    if (this.wasTyped && this.timeTyped < 0) {
      this.timeTyped = blockState.time;
    }
    const timeSinceTyped = blockState.time - this.timeTyped;
    if (
      data.autoAdvance &&
      this.wasTyped &&
      timeSinceTyped / 1000 >= this.AUTO_DELAY
    ) {
      return true;
    }
    if (!prevDown && this.down) {
      this.wasPressed = true;
    }
    if (this.wasPressed) {
      this.wasPressed = false;
      if (this.wasTyped) {
        this.wasPressed = false;
        this.wasTyped = false;
        return true;
      }
      executeDisplayCommand(
        data,
        {
          ...context,
          instant: true,
        },
        game
      );
      this.wasTyped = true;
    }
    return false;
  }
}
