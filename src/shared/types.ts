// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectType = Record<string, any>;
export type responseType = Promise<Response>;

export type ApiReturnType1<arg1, arg2> = (
    arg1: arg1,
    arg2: arg2,
  ) => ResponseType;