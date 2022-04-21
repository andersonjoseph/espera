import { Controller, Get } from '@nestjs/common';
import { WaitlistsService } from './waitlist.service';

@Controller('waitlists')
export class WaitlistsController {
  constructor(private readonly waitlistService: WaitlistsService) {}

  @Get()
  async findAll(): Promise<void> {
    await this.waitlistService.get();
  }
}
