import { TypeInfo } from "../../../../../../../data";
import { getProjectColor } from "../../../../../../../inspector/utils/getProjectColor";
import { CommandInspector } from "../../../command/commandInspector";
import { HideImageCommandData } from "./hideImageCommandData";

export class HideImageCommandInspector extends CommandInspector<HideImageCommandData> {
  getTypeInfo(): TypeInfo {
    return {
      category: "Image",
      name: "Hide Image",
      icon: "eye-slash",
      color: getProjectColor("pink", 5),
      description: "Hide an image from displaying",
    };
  }

  getSummary(_data: HideImageCommandData): string {
    return `{image}`;
  }

  createData(
    data?: Partial<HideImageCommandData> &
      Pick<HideImageCommandData, "reference">
  ): HideImageCommandData {
    return {
      ...super.createData(data),
      image: "",
      duration: 0,
      ...data,
    };
  }

  isPropertyVisible(propertyPath: string, data: HideImageCommandData): boolean {
    if (propertyPath === "waitUntilFinished") {
      return true;
    }
    return super.isPropertyVisible(propertyPath, data);
  }
}
