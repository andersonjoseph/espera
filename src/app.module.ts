import { CacheModule, Module } from '@nestjs/common';
import { WaitlistModule } from './waitlist/waitlist.module';
import { UserModule } from './user/user.module';
import { PaprModule } from './papr';
import { AuthzModule } from './authz/authz.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 30, // 30 minutes
      isGlobal: true,
    }),
    WaitlistModule,
    UserModule,
    PaprModule.forRoot({
      connectionString: process.env.MONGO_URL ?? 'no_uri',
      models: 'src/**/*.model.ts',
    }),
    AuthzModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'build')
    })
  ],
})
export class AppModule {}
