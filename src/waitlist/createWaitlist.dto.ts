import FastestValidator from 'fastest-validator';
import { DtoFromSchema } from '../interfaces';

const schema = {
  name: { type: 'string', min: 2, max: 64 },
  options: {
    type: 'object',
    properties: {
      userSkips: { type: 'number', positive: true },
      sendEmails: { type: 'boolean' },
      verifyEmails: { type: 'boolean' },
    },
  },
} as const;

const v = new FastestValidator();

export type createWaitlistDto = DtoFromSchema<typeof schema>;

export const createWaitlistValidator = v.compile(schema);
