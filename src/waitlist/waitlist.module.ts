import { Module } from '@nestjs/common';
import { PaprModule } from '../papr';
import { WaitlistsController } from './waitlist.controller';
import { Waitlist } from './waitlist.model';
import { WaitlistsService } from './waitlist.service';

@Module({
  imports: [PaprModule.forFeature(Waitlist)],
  controllers: [WaitlistsController],
  providers: [WaitlistsService],
})
export class WaitlistModule {}
