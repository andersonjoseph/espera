import FastestValidator from 'fastest-validator';
import { DtoFromSchema } from '../interfaces';

const schema = {
  email: { type: 'email', optional: true },
  name: { type: 'string', min: 2, max: 5, optional: true },
  referredBy: { type: 'email', optional: true },
  position: { type: 'number', min: 1, optional: true },
  referrers: { type: 'number', min: 1, optional: true },
  verified: { type: 'boolean', optional: true },
} as const;

const v = new FastestValidator();

export type updateUserDto = DtoFromSchema<typeof schema>;

export const updateUserValidator = v.compile(schema);
