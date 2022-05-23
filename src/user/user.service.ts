import {
  Injectable,
  Inject,
  ConflictException,
  CACHE_MANAGER,
} from '@nestjs/common';
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
import { Cache } from 'cache-manager';
import { queueAsPromised } from 'fastq';

@Injectable()
export class UsersService {
  public readonly perPage = 20;
  private queue: queueAsPromised<createUserDto> | null = null;
  constructor(
    @Inject(getPaprRepositoryToken(User))
    private readonly userRepository: PaprRepository<typeof User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getCount(waitlist: string | null): Promise<number> {
    let count: number;
    if(waitlist) 
      count = await this.userRepository.countDocuments({waitlist: new ObjectId(waitlist)});
    else 
      count = await this.userRepository.countDocuments({});

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
        sort: { position: 1 },
      },
    );

    return users;
  }

  async getByWaitlist(
    waitlist: string,
    page: PositiveNumber = 1 as PositiveNumber,
  ): Promise<PaprRepositoryResult<typeof User>[]> {
    const users = await this.userRepository.find(
      {
        waitlist: new ObjectId(waitlist),
      },
      {
        limit: this.perPage,
        skip: (page - 1) * this.perPage,
        sort: { position: 1 },
      },
    );

    return users;
  }

  async getByEmail(
    email: string,
  ): Promise<PaprRepositoryResult<typeof User>[]> {
    const user = await this.userRepository.find({ email });

    return user;
  }

  async getById(id: string): Promise<PaprRepositoryResult<typeof User> | null> {
    const user = await this.userRepository.findById(new ObjectId(id));

    return user;
  }

  private async getLastUser(): Promise<PaprRepositoryResult<
    typeof User
  > | null> {
    const cachedLastUser = await this.cacheManager.get<
      PaprRepositoryResult<typeof User>
    >('lastUser');

    if (cachedLastUser) return cachedLastUser;

    const [lastUser] = await this.userRepository.aggregate([
      {
        $sort: { position: -1 },
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
    const [existingUsers, lastUser] = await Promise.all([
      this.getByEmail(input.email),
      this.getLastUser(),
    ]);

    const userExists =
      existingUsers.findIndex(
        (user) => user.waitlist.toString() === input.waitlist,
      ) >= 0;

    if (userExists) throw new ConflictException('User already exists');

    const position = lastUser ? lastUser.position + 1 : 1;

    const newUserData = {
      ...input,
      waitlist: new ObjectId(input.waitlist),
      position,
      date: new Date(),
      referrers: 0,
      verified: false,
    };

    const newUser = await this.userRepository.insertOne(newUserData);

    await this.cacheManager.set('lastUser', newUser);

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
    const deletedUser = await this.userRepository.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (deletedUser) {
      await this.userRepository.updateMany(
        {
          position: { $gte: deletedUser.position },
        },
        {
          $inc: { position: -1 },
        },
      );

      const lastUser = await this.getLastUser();

      if (lastUser?._id.toString() === deletedUser._id.toString())
        await this.cacheManager.del('lastUser');
    }
  }

  async addReferrer(id: string): Promise<void> {
    await this.userRepository.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: {
          referrers: 1,
        },
      },
    );
  }

  async skip(
    user: PaprRepositoryResult<typeof User>,
    positions: number,
  ): Promise<void> {
    if (user.position === 1) return;

    let newPosition = user.position - positions;

    if (newPosition <= 0) newPosition = 1;

    this.update(user._id.toString(), {
      name: user.name,
      email: user.email,
      verified: user.verified,
      referredBy: user.referredBy,
      referrers: user.referrers,
      waitlist: user.waitlist.toString(),

      position: newPosition,
    });
  }

  async update(
    id: string,
    input: updateUserDto,
  ): Promise<PaprRepositoryResult<typeof User> | null> {
    const currentUser = await this.userRepository.findById(id);
    if (!currentUser) return currentUser;

    if (input.email) {
      const existingUsers = await this.getByEmail(input.email);

      const userExists =
        existingUsers.findIndex(
          (user) =>
            user.waitlist.toString() === input.waitlist &&
            user._id.toString() !== currentUser._id.toString(),
        ) >= 0;

      if (userExists) throw new ConflictException('User already exists');
    }

    const lastUser = await this.getLastUser();

    if (
      input.position &&
      lastUser?.position &&
      input.position > lastUser.position
    )
      throw new ConflictException(
        `New position can not be greater than the last position (${lastUser.position})`,
      );

    const updatedUser = await this.userRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...input,
          waitlist: new ObjectId(input.waitlist),
        },
      },
    );
    if (!updatedUser) return updatedUser;

    if (lastUser?._id.toString() === updatedUser._id.toString())
      await this.cacheManager.del('lastUser');

    if (input.position && input.position !== currentUser.position) {
      if (input.position > currentUser.position) {
        await this.userRepository.updateMany(
          {
            waitlist: new ObjectId(input.waitlist),
            _id: { $ne: updatedUser._id },
            position: { $gt: currentUser.position, $lte: input.position },
          },
          {
            $inc: { position: -1 },
          },
        );
      } else if (input.position < currentUser.position) {
        await this.userRepository.updateMany(
          {
            waitlist: new ObjectId(input.waitlist),
            _id: { $ne: updatedUser._id },
            position: { $lt: currentUser.position, $gte: input.position },
          },
          {
            $inc: { position: 1 },
          },
        );
      }
    }

    return updatedUser;
  }
}
