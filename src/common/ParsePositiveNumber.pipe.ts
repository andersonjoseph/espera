import { ArgumentMetadata, Injectable, ParseIntPipe } from '@nestjs/common';
import { PositiveNumber } from './index';

@Injectable()
export class ParsePositiveNumberPipe extends ParseIntPipe {
  constructor() {
    super();
  }

  private validate(value: number): asserts value is PositiveNumber {
    if (value <= 0)
      throw this.exceptionFactory(
        'Validation failed (positive number is expected)',
      );
  }

  async transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Promise<PositiveNumber> {
    const number = await super.transform(value, metadata);

    this.validate(number);

    return number;
  }
}
