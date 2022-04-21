import { types, schema } from 'papr';
import { createModel } from '../papr';

const waitlistSchema = schema({
  name: types.string({ required: false }),
  date: types.date({ required: true }),
  users: types.array(types.string(), { required: true }),
  referrers: types.number({ required: true, minimum: 0 }),
  options: types.object({
    userSkips: types.number(),
    sendEmails: types.boolean(),
    verifyEmails: types.boolean(),
  }),
});

export const Waitlist = createModel('waitlists', waitlistSchema);
export default Waitlist;
