import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AsyncCheckFunction, SyncCheckFunction } from 'fastest-validator';

@Injectable()
export class FastestValidatorPipe implements PipeTransform {
  constructor(
    private readonly validator: SyncCheckFunction | AsyncCheckFunction,
  ) {}

  transform(input: Record<string, unknown>): Record<string, unknown> {
    const res = this.validator(input);

    if (res !== true) {
      throw new BadRequestException(res);
    }
    return input;
  }
}
