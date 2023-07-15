import { Definition, Location, LocationLink } from "./languageserver-types";
import { MessageDirection, ProtocolRequestType } from "./messages";
import type {
  PartialResultParams,
  StaticRegistrationOptions,
  TextDocumentPositionParams,
  TextDocumentRegistrationOptions,
  WorkDoneProgressOptions,
  WorkDoneProgressParams,
} from "./protocol";
/**
 * Since 3.6.0
 */
export interface TypeDefinitionClientCapabilities {
  /**
   * Whether implementation supports dynamic registration. If this is set to `true`
   * the client supports the new `TypeDefinitionRegistrationOptions` return value
   * for the corresponding server capability as well.
   */
  dynamicRegistration?: boolean;
  /**
   * The client supports additional metadata in the form of definition links.
   *
   * Since 3.14.0
   */
  linkSupport?: boolean;
}
export interface TypeDefinitionOptions extends WorkDoneProgressOptions {}
export interface TypeDefinitionRegistrationOptions
  extends TextDocumentRegistrationOptions,
    TypeDefinitionOptions,
    StaticRegistrationOptions {}
export interface TypeDefinitionParams
  extends TextDocumentPositionParams,
    WorkDoneProgressParams,
    PartialResultParams {}
/**
 * A request to resolve the type definition locations of a symbol at a given text
 * document position. The request's parameter is of type [TextDocumentPositionParams]
 * (#TextDocumentPositionParams) the response is of type {@link Definition} or a
 * Thenable that resolves to such.
 */
export declare namespace TypeDefinitionRequest {
  const method: "textDocument/typeDefinition";
  const messageDirection: MessageDirection;
  const type: ProtocolRequestType<
    TypeDefinitionParams,
    Definition | LocationLink[] | null,
    Location[] | LocationLink[],
    void,
    TypeDefinitionRegistrationOptions
  >;
}
