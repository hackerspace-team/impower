import { MessageProtocolRequestType } from "../../MessageProtocolRequestType";

export type CreateFilesMethod = typeof CreateFiles.method;

export interface CreateFilesParams {
  /**
   * The files that should be created.
   */
  files: {
    /**
     * The uri of the file.
     */
    uri: string;
    /**
     * The data to populate the file with.
     */
    data: ArrayBuffer;
  }[];
}

export abstract class CreateFiles {
  static readonly method = "workspace/createFiles";
  static readonly type = new MessageProtocolRequestType<
    CreateFilesMethod,
    CreateFilesParams,
    null
  >(CreateFiles.method);
}
