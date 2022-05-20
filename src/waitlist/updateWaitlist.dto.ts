import FastestValidator from 'fastest-validator';
import { DtoFromSchema } from '../interfaces';

const schema = {
  $$strict: 'remove',
  name: { type: 'string', min: 2, max: 64, optional: true },
  options: {
    type: 'object',
    optional: true,
    properties: {
      userSkips: { type: 'number', positive: true, optional: true },
      sendEmails: { type: 'boolean', optional: true },
      verifyEmails: { type: 'boolean', optional: true },
    },
  },
} as const;

const v = new FastestValidator();

export type updateWaitlistDto = DtoFromSchema<typeof schema>;

export const updateWaitlistValidator = v.compile(schema);
