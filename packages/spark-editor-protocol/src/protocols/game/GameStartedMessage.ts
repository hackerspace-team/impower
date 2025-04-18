import { NotificationMessage } from "../../types/base/NotificationMessage";
import { MessageProtocolNotificationType } from "../MessageProtocolNotificationType";

export type GameStartedMethod = typeof GameStartedMessage.method;

export interface GameStartedParams {}

export class GameStartedMessage {
  static readonly method = "game/started";
  static readonly type = new MessageProtocolNotificationType<
    GameStartedMethod,
    GameStartedParams
  >(GameStartedMessage.method);
}

export namespace GameStartedMessage {
  export interface Notification
    extends NotificationMessage<GameStartedMethod, GameStartedParams> {}
}
