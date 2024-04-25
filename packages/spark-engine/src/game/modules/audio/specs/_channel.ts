import { Create } from "../../../core/types/Create";
import { Channel } from "../types/Channel";

export const _channel: Create<Channel> = (obj) => ({
  $type: "channel",
  loop: false,
  fadein: 0,
  fadeout: 0,
  ...obj,
});
