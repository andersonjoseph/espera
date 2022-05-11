import { types, schema } from 'papr';
import { createModel } from '../papr';

const waitlistSchema = schema({
  name: types.string({ required: true }),
  date: types.date({ required: true }),
  options: types.object(
    {
      userSkips: types.number({ required: true }),
      sendEmails: types.boolean({ required: true }),
      verifyEmails: types.boolean({ required: true }),
    },
    {
      additionalProperties: false,
      required: true,
    },
  ),
});

export const Waitlist = createModel('waitlists', waitlistSchema);
export default Waitlist;
