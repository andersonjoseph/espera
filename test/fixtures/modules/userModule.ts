import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { getPaprRepositoryToken, PaprRepository } from '../../../src/papr';
import { User } from '../../../src/user/user.model';
import { UsersService } from '../../../src/user/user.service';
import { UsersController } from '../../../src/user/user.controller';
import { Cache } from 'cache-manager';
import { userRepositoryMock } from '../mocks';
import { waitlistProviders } from './waitlistModule';

function serviceFactory(
  usersRepository: PaprRepository<typeof User>,
  cacheManager: Cache,
): UsersService {
  return new UsersService(usersRepository, cacheManager);
}

const userProviders = [
  {
    provide: UsersService,
    useFactory: serviceFactory,
    inject: [getPaprRepositoryToken(User), CACHE_MANAGER],
  },
  {
    provide: getPaprRepositoryToken(User),
    useValue: userRepositoryMock,
  },
  ...waitlistProviders,
];

export const UserModuleMock: TestingModuleBuilder = Test.createTestingModule({
  imports: [CacheModule.register()],
  controllers: [UsersController],
  providers: userProviders,
});
