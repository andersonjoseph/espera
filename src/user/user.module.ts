import { Module } from '@nestjs/common';
import { PaprModule } from 'src/papr';
import { UsersController } from './user.controller';
import User from './user.model';
import { UsersService } from './user.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PaprModule.forFeature(User)],
})
export class UserModule {}
