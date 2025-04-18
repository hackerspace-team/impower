import { Create } from "../../../core/types/Create";
import { Gradient } from "../types/Gradient";

export const default_gradient: Create<Gradient> = (obj) => ({
  $type: "gradient",
  $name: "$default",
  type: "linear",
  angle: 180,
  ...obj,
  stops: obj?.stops ?? [
    {
      color: "white",
      opacity: 1,
      position: 0.5,
    },
    {
      color: "white",
      opacity: 0,
      position: 1,
    },
  ],
});
