import { PaprModel, PaprRepositoryResult } from '../papr';
export * from './objectIdValidator';
export * from './ParsePositiveNumber.pipe';

export type PositiveNumber = number & { _type: 'PositiveNumber' };

export type PaginatedResult<T extends PaprModel> = {
  metadata: {
    page: PositiveNumber;
    perPage: number;
    totalCount: number;
  };
  records: PaprRepositoryResult<T>[];
};
