import { forwardRef, Module } from '@nestjs/common';
import { PaprModule } from 'src/papr';
import { WaitlistModule } from 'src/waitlist/waitlist.module';
import { UsersController } from './user.controller';
import User from './user.model';
import { UsersService } from './user.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PaprModule.forFeature(User), forwardRef(() => WaitlistModule)],
  exports: [UsersService],
})
export class UserModule {}
