import FastestValidator from 'fastest-validator';
import { ObjectId } from 'mongodb';

const schema = {
  $$root: true,
  type: 'objectID',
  ObjectID: ObjectId,
} as const;

const v = new FastestValidator();

export const objectIdValidator = v.compile(schema);
