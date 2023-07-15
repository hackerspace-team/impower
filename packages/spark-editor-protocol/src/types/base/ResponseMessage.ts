import { Message } from "./Message";
import { ResponseError } from "./ResponseError";

export interface ResponseMessage<
  M extends string = string,
  P extends string | number | boolean | any[] | object | null = any
> extends Message<M, P> {
  /**
   * The request id.
   */
  id: number | string | null;

  /**
   * The result of a request. This member is REQUIRED on success.
   * This member MUST NOT exist if there was an error invoking the method.
   */
  result?: P;

  /**
   * The error object in case a request fails.
   */
  error?: ResponseError;
}
