type Primitive = {
  string: string;
  boolean: boolean;
  number: number;
};

export type DtoFromSchema<T extends Record<PropertyKey, { type: string }>> = {
  [K in keyof T]: T[K]['type'] extends keyof Primitive
    ? Primitive[T[K]['type']]
    : string;
};
