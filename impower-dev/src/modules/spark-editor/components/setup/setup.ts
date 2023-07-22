import SEElement from "../../core/se-element";
import Workspace from "../../state/Workspace";
import component from "./_setup";

export default class Setup extends SEElement {
  static override async define(
    tag = "se-setup",
    dependencies?: Record<string, string>,
    useShadowDom = true
  ) {
    return super.define(tag, dependencies, useShadowDom);
  }

  override get component() {
    return component({ store: Workspace.instance.state });
  }

  protected override onConnected(): void {
    this.ownerDocument.addEventListener("enter", this.handleEnter);
  }

  protected override onDisconnected(): void {
    this.ownerDocument.removeEventListener("enter", this.handleEnter);
  }

  handleEnter = (e: Event) => {
    if (e instanceof CustomEvent) {
      if (e.detail.key === "window/setup") {
        const mode = e.detail.value;
        Workspace.instance.state.setup.panel = mode;
      }
    }
  };
}