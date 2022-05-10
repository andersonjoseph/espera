type Primitive = {
  string: string;
  boolean: boolean;
  number: number;
};

type GetOptionalKeys<T extends Record<PropertyKey, { optional?: boolean }>> =
  keyof {
    [K in keyof T as T[K] extends { optional: true } ? K : never]: K;
  };

type MapSchema<
  T extends Record<PropertyKey, { type: string; optional?: boolean }>,
> = {
  [K in keyof T]: T[K]['type'] extends keyof Primitive
    ? Primitive[T[K]['type']]
    : string;
};

export type DtoFromSchema<
  T extends Record<PropertyKey, { type: string; optional?: boolean }>,
  _OptionalKeys extends keyof T = GetOptionalKeys<T>,
> = MapSchema<T> extends infer R
  ? _OptionalKeys extends keyof R
    ? Partial<Pick<R, _OptionalKeys>> & Omit<R, _OptionalKeys>
    : never
  : never;
