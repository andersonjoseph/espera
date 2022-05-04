import { types, schema } from 'papr';
import { createModel } from '../papr';

const userSchema = schema({
  position: types.number({ required: true, minimum: 1 }),
  email: types.string({ required: true }),
  name: types.string({ required: false }),
  date: types.date({ required: true }),
  referrers: types.number({ required: true, minimum: 0 }),
  verified: types.boolean({ required: true }),
  referredBy: types.string({ required: false }),
});

export const User = createModel('users', userSchema);
export default User;
