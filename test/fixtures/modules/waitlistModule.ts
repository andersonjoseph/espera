import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { WaitlistsService } from '../../../src/waitlist/waitlist.service';
import { WaitlistController } from '../../../src/waitlist/waitlist.controller';
import { getPaprRepositoryToken, PaprRepository } from '../../../src/papr';
import Waitlist from '../../../src/waitlist/waitlist.model';
import { waitlistRepositoryMock } from '../mocks';
import {userProviders} from './userModule';

function serviceFactory(
  waitlistRepository: PaprRepository<typeof Waitlist>,
): WaitlistsService {
  return new WaitlistsService(waitlistRepository);
}

export const waitlistProviders = [
  {
    provide: WaitlistsService,
    useFactory: serviceFactory,
    inject: [getPaprRepositoryToken(Waitlist)],
  },
  {
    provide: getPaprRepositoryToken(Waitlist),
    useValue: waitlistRepositoryMock,
  },
  ...userProviders,
];

export const WaitlistModuleMock: TestingModuleBuilder =
  Test.createTestingModule({
    controllers: [WaitlistController],
    providers: waitlistProviders,
  });
