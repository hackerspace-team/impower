import { isNameable } from "../../../../../impower-core";
import { ContainerData, createContainerData } from "../../../../data";
import { InstanceInspector } from "../../instance/instanceInspector";

export abstract class ContainerInspector<
  T extends ContainerData
> extends InstanceInspector<T> {
  createData(
    data?: Partial<ContainerData> & Pick<ContainerData, "reference">
  ): T {
    return createContainerData(data) as T;
  }

  getName(data: T): string {
    if (isNameable(data)) {
      return data.name;
    }
    return super.getName(data);
  }

  getSummary(data: T): string {
    return data.children && data.children?.length > 0
      ? `(${data.children.length})`
      : "";
  }

  isPropertyVisible(propertyPath: string, data: T): boolean {
    if (propertyPath === "children") {
      return false;
    }
    return super.isPropertyVisible(propertyPath, data);
  }
}
