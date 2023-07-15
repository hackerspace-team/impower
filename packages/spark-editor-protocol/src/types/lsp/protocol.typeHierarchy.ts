import { TypeHierarchyItem } from "./languageserver-types";
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
 * @since 3.17.0
 */
export declare type TypeHierarchyClientCapabilities = {
  /**
   * Whether implementation supports dynamic registration. If this is set to `true`
   * the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
   * return value for the corresponding server capability as well.
   */
  dynamicRegistration?: boolean;
};
/**
 * Type hierarchy options used during static registration.
 *
 * @since 3.17.0
 */
export declare type TypeHierarchyOptions = WorkDoneProgressOptions;
/**
 * Type hierarchy options used during static or dynamic registration.
 *
 * @since 3.17.0
 */
export declare type TypeHierarchyRegistrationOptions =
  TextDocumentRegistrationOptions &
    TypeHierarchyOptions &
    StaticRegistrationOptions;
/**
 * The parameter of a `textDocument/prepareTypeHierarchy` request.
 *
 * @since 3.17.0
 */
export declare type TypeHierarchyPrepareParams = TextDocumentPositionParams &
  WorkDoneProgressParams;
/**
 * A request to result a `TypeHierarchyItem` in a document at a given position.
 * Can be used as an input to a subtypes or supertypes type hierarchy.
 *
 * @since 3.17.0
 */
export declare namespace TypeHierarchyPrepareRequest {
  const method: "textDocument/prepareTypeHierarchy";
  const messageDirection: MessageDirection;
  const type: ProtocolRequestType<
    TypeHierarchyPrepareParams,
    TypeHierarchyItem[] | null,
    never,
    void,
    TypeHierarchyRegistrationOptions
  >;
}
/**
 * The parameter of a `typeHierarchy/supertypes` request.
 *
 * @since 3.17.0
 */
export declare type TypeHierarchySupertypesParams = WorkDoneProgressParams &
  PartialResultParams & {
    item: TypeHierarchyItem;
  };
/**
 * A request to resolve the supertypes for a given `TypeHierarchyItem`.
 *
 * @since 3.17.0
 */
export declare namespace TypeHierarchySupertypesRequest {
  const method: "typeHierarchy/supertypes";
  const messageDirection: MessageDirection;
  const type: ProtocolRequestType<
    TypeHierarchySupertypesParams,
    TypeHierarchyItem[] | null,
    TypeHierarchyItem[],
    void,
    void
  >;
}
/**
 * The parameter of a `typeHierarchy/subtypes` request.
 *
 * @since 3.17.0
 */
export declare type TypeHierarchySubtypesParams = WorkDoneProgressParams &
  PartialResultParams & {
    item: TypeHierarchyItem;
  };
/**
 * A request to resolve the subtypes for a given `TypeHierarchyItem`.
 *
 * @since 3.17.0
 */
export declare namespace TypeHierarchySubtypesRequest {
  const method: "typeHierarchy/subtypes";
  const messageDirection: MessageDirection;
  const type: ProtocolRequestType<
    TypeHierarchySubtypesParams,
    TypeHierarchyItem[] | null,
    TypeHierarchyItem[],
    void,
    void
  >;
}
