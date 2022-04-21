import { types, schema } from 'papr';
import { createModel } from '../../src/papr';

const userSchema = schema({
  email: types.string({ required: true }),
  name: types.string({ required: false }),
});

export const UserModelFixture = createModel('users', userSchema);
export default UserModelFixture;
