import { Module } from '@nestjs/common';
import { PaprModule } from '../papr';
import { WaitlistController } from './waitlist.controller';
import { Waitlist } from './waitlist.model';
import { WaitlistsService } from './waitlist.service';

@Module({
  imports: [PaprModule.forFeature(Waitlist)],
  controllers: [WaitlistController],
  providers: [WaitlistsService],
})
export class WaitlistModule {}
