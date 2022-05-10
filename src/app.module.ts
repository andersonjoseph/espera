import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WaitlistModule } from './waitlist/waitlist.module';
import { UserModule } from './user/user.module';
import { PaprModule } from './papr';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 30, // 30 minutes
    }),
    WaitlistModule,
    UserModule,
    PaprModule.forRoot({
      connectionString: process.env.MONGO_URL ?? 'no_uri',
      models: 'src/**/*.model.ts',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
