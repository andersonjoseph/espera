import { Injectable, Inject } from '@nestjs/common';
import { PaprRepository, getPaprRepositoryToken } from '../papr';
import { Waitlist } from './waitlist.model';

@Injectable()
export class WaitlistsService {
  constructor(
    @Inject(getPaprRepositoryToken(Waitlist))
    private readonly waitlistRepository: PaprRepository<typeof Waitlist>,
  ) {}

  async get(): Promise<void> {
    console.log(this.waitlistRepository);
  }
}
