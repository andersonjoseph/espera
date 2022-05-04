import FastestValidator from 'fastest-validator';
import { ObjectID } from 'mongodb';

const schema = {
  $$root: true,
  type: 'objectID',
  ObjectID, // TODO: This is deprecated
} as const;

const v = new FastestValidator();

export const objectIdValidator = v.compile(schema);
