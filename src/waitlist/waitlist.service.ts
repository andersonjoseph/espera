import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
  PaprRepository,
  getPaprRepositoryToken,
  PaprRepositoryResult,
} from '../papr';
import { createWaitlistDto } from './createWaitlist.dto';
import { updateWaitlistDto } from './updateWaitlist.dto';
import { Waitlist } from './waitlist.model';

@Injectable()
export class WaitlistsService {
  constructor(
    @Inject(getPaprRepositoryToken(Waitlist))
    private readonly waitlistRepository: PaprRepository<typeof Waitlist>,
  ) {}

  async getByName(
    name: string,
  ): Promise<PaprRepositoryResult<typeof Waitlist> | null> {
    const waitlist = await this.waitlistRepository.findOne({ name });

    return waitlist;
  }

  async create(
    input: createWaitlistDto,
  ): Promise<PaprRepositoryResult<typeof Waitlist>> {
    const existingWaitlist = await this.getByName(input.name);

    if (existingWaitlist) {
      throw new ConflictException('A waitlist with this name already exists');
    }

    const newWailistData = {
      ...input,
      date: new Date(),
    };

    const newWaitlist = await this.waitlistRepository.insertOne(newWailistData);

    return newWaitlist;
  }

  async update(
    id: string,
    input: updateWaitlistDto,
  ): Promise<PaprRepositoryResult<typeof Waitlist> | null> {
    const newWaitlist = await this.waitlistRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
    );

    return newWaitlist;
  }

  async get(): Promise<PaprRepositoryResult<typeof Waitlist>[]> {
    const waitlists = await this.waitlistRepository.find({});

    return waitlists;
  }

  async getById(
    id: string,
  ): Promise<PaprRepositoryResult<typeof Waitlist> | null> {
    const waitlist = await this.waitlistRepository.findById(id);

    return waitlist;
  }

  async remove(id: string): Promise<void> {
    await this.waitlistRepository.deleteOne({ _id: new ObjectId(id) });
  }
}
