import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { PositiveNumber } from 'src/common';
import {
  PaprRepository,
  PaprRepositoryResult,
  getPaprRepositoryToken,
} from '../papr';
import { createUserDto } from './createUser.dto';
import { updateUserDto } from './updateUser.dto';
import { User } from './user.model';
import * as fastq from 'fastq';
import { queueAsPromised } from 'fastq';

@Injectable()
export class UsersService {
  public readonly perPage = 20;
  private queue: queueAsPromised<createUserDto> | null = null;
  constructor(
    @Inject(getPaprRepositoryToken(User))
    private readonly userRepository: PaprRepository<typeof User>,
  ) {}

  async getCount(): Promise<number> {
    const count = await this.userRepository.countDocuments({});

    return count;
  }

  async get(
    page: PositiveNumber = 1 as PositiveNumber,
  ): Promise<PaprRepositoryResult<typeof User>[]> {
    const users = await this.userRepository.find(
      {},
      {
        limit: this.perPage,
        skip: (page - 1) * this.perPage,
      },
    );

    return users;
  }

  async getByEmail(
    email: string,
  ): Promise<PaprRepositoryResult<typeof User> | null> {
    const user = await this.userRepository.findOne({ email });

    return user;
  }

  async getById(id: string): Promise<PaprRepositoryResult<typeof User> | null> {
    const user = await this.userRepository.findById(new ObjectId(id));

    return user;
  }

  private async getLastUser(): Promise<PaprRepositoryResult<
    typeof User
  > | null> {
    const [lastUser] = await this.userRepository.aggregate([
      {
        $sort: { date: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    return lastUser;
  }

  private async insertUser(
    input: createUserDto,
  ): Promise<PaprRepositoryResult<typeof User>> {
    const [existingUser, lastUser] = await Promise.all([
      this.getByEmail(input.email),
      this.getLastUser(),
    ]);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const position = lastUser ? lastUser.position + 1 : 1;

    const newUserData = {
      ...input,
      position,
      date: new Date(),
      referrers: 0,
      verified: false,
    };

    const newUser = await this.userRepository.insertOne(newUserData);

    return newUser;
  }

  async create(
    input: createUserDto,
  ): Promise<PaprRepositoryResult<typeof User>> {
    if (!this.queue) {
      this.queue = fastq.promise(this, this.insertUser, 1);
    }

    const newUser = await this.queue.push(input);

    return newUser;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.deleteOne({ _id: new ObjectId(id) });
  }

  async update(
    id: string,
    input: updateUserDto,
  ): Promise<PaprRepositoryResult<typeof User> | null> {
    const updatedUser = await this.userRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
    );

    return updatedUser;
  }
}
