type Primitive = {
  string: string;
  boolean: boolean;
  number: number;
};

type SchemaWithoutFlags<T> = {
  [K in keyof T as K extends `$$${infer Flag}` ? never : K]: T[K];
};

type ValidationSchema = {
  type: string;
  optional?: boolean;
};

type ValidationObjectSchema = {
  type: 'object';
  properties: Record<PropertyKey, ValidationSchema>;
  optional?: boolean;
};

type GetType<T extends ValidationSchema> = T['type'] extends keyof Primitive
  ? Primitive[T['type']]
  : string;

export type DtoFromSchema<T> = {
  [K in keyof SchemaWithoutFlags<T>]: T[K] extends ValidationObjectSchema
    ? T[K]['optional'] extends true
      ? DtoFromSchema<T[K]['properties']> | undefined
      : DtoFromSchema<T[K]['properties']>
    : T[K] extends ValidationSchema
    ? T[K]['optional'] extends true
      ? GetType<T[K]> | undefined
      : GetType<T[K]>
    : never;
};
