type Primitive = {
  string: string;
  boolean: boolean;
  number: number;
};

type ValidationSchema = Record<
  PropertyKey,
  { type: string; properties?: ValidationSchema }
>;

type GetObjectType<T extends ValidationSchema> = {
  [P in keyof T]: T['optional'] extends true
    ? GetType<T, P> | undefined
    : GetType<T, P>;
};

type GetType<
  T extends ValidationSchema,
  K extends keyof T,
> = T[K]['type'] extends keyof Primitive
  ? Primitive[T[K]['type']]
  : T[K]['properties'] extends ValidationSchema
  ? GetObjectType<T[K]['properties']>
  : string;

export type DtoFromSchema<
  T extends Record<PropertyKey, { type: string; optional?: boolean }>,
> = {
  [K in keyof T]: T[K]['optional'] extends true
    ? GetType<T, K> | undefined
    : GetType<T, K>;
};
