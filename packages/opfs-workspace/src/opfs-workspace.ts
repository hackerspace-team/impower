import { FileChangeType } from "@impower/spark-editor-protocol/src/enums/FileChangeType";
import { DidParseTextDocumentMessage } from "@impower/spark-editor-protocol/src/protocols/textDocument/DidParseTextDocumentMessage.js";
import { ConfigurationMessage } from "@impower/spark-editor-protocol/src/protocols/workspace/ConfigurationMessage.js";
import { DidChangeConfigurationMessage } from "@impower/spark-editor-protocol/src/protocols/workspace/DidChangeConfigurationMessage.js";
import { DidChangeWatchedFilesMessage } from "@impower/spark-editor-protocol/src/protocols/workspace/DidChangeWatchedFilesMessage.js";
import { DidCreateFilesMessage } from "@impower/spark-editor-protocol/src/protocols/workspace/DidCreateFilesMessage.js";
import { DidDeleteFilesMessage } from "@impower/spark-editor-protocol/src/protocols/workspace/DidDeleteFilesMessage.js";
import { DidWriteFileMessage } from "@impower/spark-editor-protocol/src/protocols/workspace/DidWriteFileMessage.js";
import { ReadDirectoryFilesMessage } from "@impower/spark-editor-protocol/src/protocols/workspace/ReadDirectoryFilesMessage.js";
import { ReadFileMessage } from "@impower/spark-editor-protocol/src/protocols/workspace/ReadFileMessage.js";
import { WillCreateFilesMessage } from "@impower/spark-editor-protocol/src/protocols/workspace/WillCreateFilesMessage.js";
import { WillDeleteFilesMessage } from "@impower/spark-editor-protocol/src/protocols/workspace/WillDeleteFilesMessage.js";
import { WillWriteFileMessage } from "@impower/spark-editor-protocol/src/protocols/workspace/WillWriteFileMessage.js";
import { FileData } from "@impower/spark-editor-protocol/src/types";
import EngineSparkParser from "../../spark-engine/src/parser/classes/EngineSparkParser";
import { STRUCT_DEFAULTS } from "../../spark-engine/src/parser/constants/STRUCT_DEFAULTS";
import debounce from "./utils/debounce";
import { getAllFiles } from "./utils/getAllFiles";
import { getDirectoryHandleFromPath } from "./utils/getDirectoryHandleFromPath";
import { getFileExtension } from "./utils/getFileExtension";
import { getFileHandleFromUri } from "./utils/getFileHandleFromUri";
import { getFileName } from "./utils/getFileName";
import { getName } from "./utils/getName";
import { getParentPath } from "./utils/getParentPath";
import { getPathFromUri } from "./utils/getPathFromUri";
import { getUriFromPath } from "./utils/getUriFromPath";

const MAGENTA = "\x1b[35m%s\x1b[0m";

const WRITE_DEBOUNCE_DELAY = 100;

const globToRegex = (glob: string) => {
  return RegExp(
    glob
      .replace(/[.]/g, "[.]")
      .replace(/[*]/g, ".*")
      .replace(/[{](.*)[}]/g, (_match, $1) => `(${$1.replace(/[,]/g, "|")})`),
    "i"
  );
};

const parse = (file: FileData, files: FileData[]) => {
  if (file.text != null) {
    const program = EngineSparkParser.instance.parse(file.text, {
      augmentations: { files, objectMap: STRUCT_DEFAULTS },
    });
    return program;
  }
  return undefined;
};

class State {
  static writeQueue: Record<
    string,
    {
      handler: (uri: string) => void;
      version: number;
      buffer: DataView | Uint8Array;
      listeners: ((result: { data: FileData; created: boolean }) => void)[];
    }
  > = {};
  static imageFilePattern?: RegExp;
  static audioFilePattern?: RegExp;
  static scriptFilePattern?: RegExp;
  static files: Record<string, FileData> = {};
}

const initialConfigurationMessage = ConfigurationMessage.type.request({
  items: [{ section: "sparkdown" }],
});
postMessage(initialConfigurationMessage);

onmessage = async (e) => {
  const message = e.data;
  if (ConfigurationMessage.type.isResponse(message)) {
    if (message.id === initialConfigurationMessage.id) {
      const settings = message.result?.[0];
      loadConfiguration(settings);
    }
  }
  if (DidChangeConfigurationMessage.type.isNotification(message)) {
    const { settings } = message.params;
    loadConfiguration(settings);
  }
  if (ReadDirectoryFilesMessage.type.isRequest(message)) {
    const { directory } = message.params;
    const files = await readDirectoryFiles(directory.uri);
    files.forEach((file) => {
      const program = parse(file, files);
      if (program != null) {
        file.program = program;
        postMessage(
          DidParseTextDocumentMessage.type.notification({
            textDocument: { uri: file.uri, version: file.version },
            program,
          })
        );
      }
    });
    postMessage(ReadDirectoryFilesMessage.type.response(message.id, files));
  }
  if (ReadFileMessage.type.isRequest(message)) {
    const { file } = message.params;
    const buffer = await readFile(file.uri);
    const response = ReadFileMessage.type.response(message.id, buffer);
    postMessage(response, [response.result]);
  }
  if (WillWriteFileMessage.type.isRequest(message)) {
    const { file } = message.params;
    const { uri, version, data } = file;
    const buffer = new DataView(data);
    const fileData = await writeFile(uri, version, buffer);
    if (fileData.text != null) {
      const files = Object.values(State.files);
      const program = parse(fileData, files);
      if (program) {
        fileData.program = program;
        postMessage(
          DidParseTextDocumentMessage.type.notification({
            textDocument: { uri, version: file.version },
            program,
          })
        );
      }
    }
    postMessage(WillWriteFileMessage.type.response(message.id, fileData));
    postMessage(DidWriteFileMessage.type.notification({ file: fileData }));
    postMessage(
      DidChangeWatchedFilesMessage.type.notification({
        changes: [
          {
            uri: fileData.uri,
            type: FileChangeType.Changed,
          },
        ],
      })
    );
  }
  if (WillCreateFilesMessage.type.isRequest(message)) {
    const { files } = message.params;
    const result = await createFiles(files);
    const fileDataArray = result.map((r) => r.data);
    postMessage(
      WillCreateFilesMessage.type.response(message.id, fileDataArray)
    );
    const createdResult = result.filter((r) => r.created);
    const changedResult = result.filter((r) => !r.created);
    if (createdResult.length > 0) {
      postMessage(
        DidCreateFilesMessage.type.notification({
          files: createdResult.map((r) => ({
            uri: r.data.uri,
          })),
        })
      );
    }
    if (changedResult.length > 0) {
      changedResult.forEach((change) => {
        postMessage(
          DidWriteFileMessage.type.notification({ file: change.data })
        );
      });
    }
    postMessage(
      DidChangeWatchedFilesMessage.type.notification({
        changes: result.map((r) => ({
          uri: r.data.uri,
          type: r.created ? FileChangeType.Created : FileChangeType.Changed,
        })),
      })
    );
  }
  if (WillDeleteFilesMessage.type.isRequest(message)) {
    const { files } = message.params;
    await deleteFiles(files);
    postMessage(WillDeleteFilesMessage.type.response(message.id, null));
    postMessage(DidDeleteFilesMessage.type.notification({ files }));
    postMessage(
      DidChangeWatchedFilesMessage.type.notification({
        changes: files.map((file) => ({
          uri: file.uri,
          type: FileChangeType.Deleted,
        })),
      })
    );
  }
};

const loadConfiguration = (settings: any) => {
  const scriptFiles = settings?.scriptFiles;
  if (scriptFiles) {
    State.scriptFilePattern = globToRegex(scriptFiles);
  }
  const imageFiles = settings?.imageFiles;
  if (imageFiles) {
    State.imageFilePattern = globToRegex(imageFiles);
  }
  const audioFiles = settings?.audioFiles;
  if (audioFiles) {
    State.audioFilePattern = globToRegex(audioFiles);
  }
};

const readDirectoryFiles = async (directoryUri: string) => {
  const root = await navigator.storage.getDirectory();
  const relativePath = getPathFromUri(directoryUri);
  const directoryHandle = await getDirectoryHandleFromPath(root, relativePath);
  const directoryEntries = await getAllFiles(directoryHandle, relativePath);
  const files = await Promise.all(
    directoryEntries.map(async (entry) => {
      const uri = getUriFromPath(entry.path);
      if (!State.files[uri]) {
        await readFile(uri);
      }
      return State.files[uri]!;
    })
  );
  return files;
};

const readFile = async (fileUri: string) => {
  const root = await navigator.storage.getDirectory();
  const fileHandle = await getFileHandleFromUri(root, fileUri);
  const fileRef = await fileHandle.getFile();
  const buffer = await fileRef.arrayBuffer();
  updateFileCache(fileUri, buffer, false);
  return buffer;
};

const enqueueWrite = async (
  fileUri: string,
  version: number,
  buffer: DataView | Uint8Array
) => {
  return new Promise<{ data: FileData; created: boolean }>((resolve) => {
    if (!State.writeQueue[fileUri]) {
      State.writeQueue[fileUri] = {
        buffer,
        version,
        listeners: [],
        handler: debounce(write, WRITE_DEBOUNCE_DELAY),
      };
    }
    const entry = State.writeQueue[fileUri];
    entry!.buffer = buffer;
    entry!.listeners.push(resolve);
    entry!.handler(fileUri);
  });
};

const writeFile = async (
  uri: string,
  version: number,
  buffer: DataView | Uint8Array
) => {
  const result = await enqueueWrite(uri, version, buffer);
  return result.data;
};

const write = async (fileUri: string) => {
  const queued = State.writeQueue[fileUri]!;
  const buffer = queued.buffer;
  const version = queued.version;
  const listeners = queued.listeners;
  const root = await navigator.storage.getDirectory();
  const relativePath = getPathFromUri(fileUri);
  const directoryPath = getParentPath(relativePath);
  const filename = getFileName(relativePath);
  const directoryHandle = await getDirectoryHandleFromPath(root, directoryPath);
  let created = false;
  try {
    await directoryHandle.getFileHandle(filename, { create: false });
  } catch (err) {
    // File does not exist yet
    created = true;
  }
  const fileHandle = await directoryHandle.getFileHandle(filename, {
    create: true,
  });
  const syncAccessHandle = await fileHandle.createSyncAccessHandle();
  syncAccessHandle.truncate(0);
  syncAccessHandle.write(buffer, { at: 0 });
  syncAccessHandle.flush();
  syncAccessHandle.close();
  const arrayBuffer = buffer.buffer;
  const data = updateFileCache(fileUri, arrayBuffer, true, version);
  listeners.forEach((l) => {
    l({ data, created });
  });
  queued.listeners = [];
  console.log(MAGENTA, "WRITE", fileUri);
};

const createFiles = async (files: { uri: string; data: ArrayBuffer }[]) => {
  const result = await Promise.all(
    files.map(async (file) => {
      const buffer = new DataView(file.data);
      return enqueueWrite(file.uri, 0, buffer);
    })
  );
  return result;
};

const deleteFiles = async (files: { uri: string }[]) => {
  const root = await navigator.storage.getDirectory();
  await Promise.all(
    files.map(async (file) => {
      const relativePath = getPathFromUri(file.uri);
      const directoryPath = getParentPath(relativePath);
      const directoryHandle = await getDirectoryHandleFromPath(
        root,
        directoryPath
      );
      directoryHandle.removeEntry(getFileName(relativePath));
      const existingFile = State.files[file.uri];
      if (existingFile) {
        URL.revokeObjectURL(existingFile.src);
        delete State.files[file.uri];
        console.log(MAGENTA, "DELETE", file.uri);
      }
    })
  );
};

const getType = (uri: string) => {
  return State.imageFilePattern?.test(uri)
    ? "image"
    : State.audioFilePattern?.test(uri)
    ? "audio"
    : State.scriptFilePattern?.test(uri)
    ? "script"
    : "text";
};

const getContentType = (type: string, ext: string) => {
  const encoding = type === "text" ? "plain" : ext === "svg" ? "svg+xml" : ext;
  return `${type}/${encoding}`;
};

const updateFileCache = (
  uri: string,
  buffer: ArrayBuffer,
  overwrite: boolean,
  version?: number
) => {
  const existingFile = State.files[uri];
  let src = existingFile?.src;
  const name = getName(uri);
  const ext = getFileExtension(uri);
  const type = getType(uri);
  if (!src || overwrite) {
    if (src) {
      URL.revokeObjectURL(src);
    }
    src = URL.createObjectURL(
      new Blob([buffer], { type: getContentType(type, ext) })
    );
  }
  const text =
    type === "script" || type === "text"
      ? new TextDecoder("utf-8").decode(buffer)
      : undefined;
  const program = existingFile?.program;
  const file = {
    uri,
    name,
    ext,
    type,
    src,
    version: version ?? existingFile?.version ?? 0,
    text,
    program,
  };
  State.files[uri] = file;
  return file;
};
