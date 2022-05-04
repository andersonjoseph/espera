import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
  PaprRepository,
  PaprRepositoryResult,
  getPaprRepositoryToken,
} from '../papr';
import { createUserDto } from './createUser.dto';
import { updateUserDto } from './updateUser.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject(getPaprRepositoryToken(User))
    private readonly userRepository: PaprRepository<typeof User>,
  ) {}

  async get(): Promise<PaprRepositoryResult<typeof User>[]> {
    const users = await this.userRepository.find({});

    return users;
  }

  async getByEmail(
    email: string,
  ): Promise<PaprRepositoryResult<typeof User> | null> {
    const user = await this.userRepository.findOne({ email });

    return user;
  }

  async getById(
    id: ObjectId,
  ): Promise<PaprRepositoryResult<typeof User> | null> {
    const user = await this.userRepository.findById(id);

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

  async create(
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

  async remove(id: ObjectId): Promise<void> {
    await this.userRepository.deleteOne({ _id: id });
  }
  async update(
    id: ObjectId,
    input: updateUserDto,
  ): Promise<PaprRepositoryResult<typeof User> | null> {
    const updatedUser = await this.userRepository.findOneAndUpdate(
      { _id: id },
      { $set: input },
    );

    return updatedUser;
  }
}
