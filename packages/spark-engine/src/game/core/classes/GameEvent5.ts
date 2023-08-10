import { GameEvent } from "./GameEvent";

export class GameEvent5<P1, P2, P3, P4, P5> extends GameEvent {
  override addListener(
    handler: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5) => void
  ): void {
    super.addListener(handler);
  }

  override removeListener(
    handler: (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5) => void
  ): void {
    super.removeListener(handler);
  }

  override dispatch(p1: P1, p2: P2, p3: P3, p4: P4, p5: P5): void {
    super.dispatch(p1, p2, p3, p4, p5);
  }
}
