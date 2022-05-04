import FastestValidator from 'fastest-validator';
import { DtoFromSchema } from '../interfaces';

const schema = {
  email: { type: 'email' },
  name: { type: 'string', min: 2, max: 5, optional: true },
  referredBy: { type: 'email', optional: true },
} as const;

const v = new FastestValidator();

export type createUserDto = DtoFromSchema<typeof schema>;

export const createUserValidator = v.compile(schema);
