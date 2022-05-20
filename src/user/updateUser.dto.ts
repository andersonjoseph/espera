import FastestValidator from 'fastest-validator';
import {ObjectId} from 'mongodb';
import { DtoFromSchema } from '../interfaces';

const schema = {
  $$strict: 'remove',
  email: { type: 'email', optional: true },
  name: { type: 'string', min: 2, max: 50, optional: true },
  referredBy: { type: 'email', optional: true },
  position: { type: 'number', min: 1, optional: true },
  referrers: { type: 'number', min: 0, optional: true },
  verified: { type: 'boolean', optional: true },
  waitlist: { type: 'objectID', ObjectID: ObjectId },
} as const;

const v = new FastestValidator();

export type updateUserDto = DtoFromSchema<typeof schema>;

export const updateUserValidator = v.compile(schema);
