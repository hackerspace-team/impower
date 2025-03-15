import { DocumentLocation } from "../../types/DocumentLocation";
import { MessageProtocolNotificationType } from "../MessageProtocolNotificationType";

export type ExecutedMethod = typeof ExecutedMessage.method;

export class ExecutedMessage {
  static readonly method = "story/executed";
  static readonly type = new MessageProtocolNotificationType<
    ExecutedMethod,
    {
      location: DocumentLocation;
      path: string;
      frameId: number;
    }
  >(ExecutedMessage.method);
}
