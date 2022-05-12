const repositoryMock = (
  result: Record<string, unknown>,
): Record<string, jest.Mock> => ({
  find: jest.fn().mockResolvedValue([result]),
  findOne: jest.fn().mockResolvedValue(result),
  findOneAndUpdate: jest.fn().mockResolvedValue(result),
  findOneAndDelete: jest.fn().mockResolvedValue(result),
  insertOne: jest.fn().mockResolvedValue(result),
  aggregate: jest.fn().mockResolvedValue([result]),
  findById: jest.fn().mockResolvedValue(result),
  deleteOne: jest.fn().mockResolvedValue(undefined),
  updateMany: jest.fn().mockResolvedValue(undefined),
  countDocuments: jest.fn().mockResolvedValue(10),
});

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
  findOneAndDelete: jest.fn().mockResolvedValue(userResultMock),
  insertOne: jest.fn().mockResolvedValue(userResultMock),
  aggregate: jest.fn().mockResolvedValue([userResultMock]),
  findById: jest.fn().mockResolvedValue(userResultMock),
  deleteOne: jest.fn().mockResolvedValue(undefined),
  updateMany: jest.fn().mockResolvedValue(undefined),
  countDocuments: jest.fn().mockResolvedValue(10),
};
