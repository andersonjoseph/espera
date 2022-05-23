import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PaprModule } from '../papr';
import { WaitlistController } from './waitlist.controller';
import { Waitlist } from './waitlist.model';
import { WaitlistsService } from './waitlist.service';

@Module({
  imports: [PaprModule.forFeature(Waitlist), forwardRef(() => UserModule)],
  controllers: [WaitlistController],
  providers: [WaitlistsService],
  exports: [WaitlistsService],
})
export class WaitlistModule {}
