import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AsyncCheckFunction, SyncCheckFunction } from 'fastest-validator';

type FastestValidatorPipeOptions = {
  optional: boolean;
} | null;

@Injectable()
export class FastestValidatorPipe implements PipeTransform {
  constructor(
    private readonly validator: SyncCheckFunction | AsyncCheckFunction,
    private readonly options: FastestValidatorPipeOptions = null,
  ) {}

  transform(input: Record<string, unknown>): Record<string, unknown> {
    if (this.options?.optional && !input) return input;

    const res = this.validator(input);

    if (res !== true) {
      throw new BadRequestException(res);
    }
    return input;
  }
}
