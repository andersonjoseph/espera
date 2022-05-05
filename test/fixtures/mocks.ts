export const userResultMock = {
  _id: '6272f75b20545b275cd4b547',
  email: 'andersonjuega@gmail.com',
  position: 1,
  date: '2022-05-04T21:59:55.718Z',
  referrers: 0,
  verified: false,
};

export const userRepositoryMock = {
  find: jest.fn().mockResolvedValue([userResultMock]),
  findOne: jest.fn().mockResolvedValue(userResultMock),
  findOneAndUpdate: jest.fn().mockResolvedValue(userResultMock),
  insertOne: jest.fn().mockResolvedValue(userResultMock),
  aggregate: jest.fn().mockResolvedValue([userResultMock]),
  findById: jest.fn().mockResolvedValue(userResultMock),
  deleteOne: jest.fn().mockResolvedValue(undefined),
};
