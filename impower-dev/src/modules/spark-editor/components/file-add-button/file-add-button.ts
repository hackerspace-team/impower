import { Component } from "../../../../../../packages/spec-component/src/component";
import getUniqueFileName from "../../utils/getUniqueFileName";
import { Workspace } from "../../workspace/Workspace";
import spec from "./_file-add-button";

export default class FileAddButton extends Component(spec) {
  override onConnected() {
    this.addEventListener("click", this.handleClick);
  }

  override onDisconnected() {
    this.removeEventListener("click", this.handleClick);
  }

  handleClick = async (e: MouseEvent) => {
    const store = this.stores.workspace.current;
    const projectId = store?.project?.id;
    if (projectId) {
      const files = await Workspace.fs.getFiles();
      const fileUris = Object.keys(files);
      const filenames = fileUris.map((uri) => Workspace.fs.getFilename(uri));
      const filename = this.filename;
      if (filename) {
        const uniqueFileName = getUniqueFileName(filenames, filename);
        await Workspace.fs.createFiles({
          files: [
            {
              uri: Workspace.fs.getFileUri(projectId, uniqueFileName),
              data: new ArrayBuffer(0),
            },
          ],
        });
      }
    }
  };

  override onInit() {
    this.setup();
  }

  override onStoreUpdate() {
    this.setup();
  }

  setup() {
    const store = this.stores.workspace.current;
    const syncState = store?.project?.syncState;
    if (
      syncState === "syncing" ||
      syncState === "loading" ||
      syncState === "importing" ||
      syncState === "exporting"
    ) {
      this.ref.button.setAttribute("disabled", "");
    } else {
      this.ref.button.removeAttribute("disabled");
    }
  }
}
