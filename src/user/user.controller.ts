import {
  Body,
  ConflictException,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import User from './user.model';
import { UsersService } from './user.service';
import { PaprRepositoryResult } from '../papr';
import { createUserDto, createUserValidator } from './createUser.dto';
import { FastestValidatorPipe } from '../FastestValidatorPipe';
import {
  objectIdValidator,
  ParsePositiveNumberPipe,
  PositiveNumber,
  PaginatedResult,
} from '../common';
import { updateUserDto, updateUserValidator } from './updateUser.dto';
import { WaitlistsService } from '../waitlist/waitlist.service';
import { AuthGuard } from '@nestjs/passport';
import JsonStreamStringify from 'json-stream-stringify';
import Waitlist from 'src/waitlist/waitlist.model';
import { Response } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly waitlistService: WaitlistsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('export')
  async export(
    @Query(
      'waitlist',
      new DefaultValuePipe(null),
      new FastestValidatorPipe(objectIdValidator, { optional: true }),
    )
    waitlist: string | null,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    let waitlistObject:
      | PaprRepositoryResult<typeof Waitlist>
      | null
      | undefined;
    if (waitlist) {
      waitlistObject = await this.waitlistService.getById(waitlist);

      if (!waitlistObject)
        throw new ConflictException('Waitlist does not exist');
    }

    const stream = new JsonStreamStringify({
      waitlist: waitlistObject,
      records: this.usersService.getAll(waitlist),
    });

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="export-${new Date()}.json"`,
    });

    return new StreamableFile(stream);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParsePositiveNumberPipe)
    page: PositiveNumber,
    @Query(
      'waitlist',
      new DefaultValuePipe(null),
      new FastestValidatorPipe(objectIdValidator, { optional: true }),
    )
    waitlist: string | null,
  ): Promise<PaginatedResult<typeof User>> {
    const perPage = this.usersService.perPage;
    const [users, totalCount] = await Promise.all([
      waitlist
        ? await this.usersService.getByWaitlist(waitlist, page)
        : await this.usersService.get(page),
      await this.usersService.getCount(waitlist),
    ]);

    const response = {
      metadata: {
        page,
        perPage,
        totalCount,
      },
      records: users,
    };

    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id', new FastestValidatorPipe(objectIdValidator)) id: string,
  ): Promise<PaprRepositoryResult<typeof User>> {
    const user = await this.usersService.getById(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Post()
  async create(
    @Body(new FastestValidatorPipe(createUserValidator)) input: createUserDto,
    @Query(
      'ref',
      new DefaultValuePipe(null),
      new FastestValidatorPipe(objectIdValidator, { optional: true }),
    )
    referrer: string | null,
  ): Promise<PaprRepositoryResult<typeof User>> {
    const waitlist = await this.waitlistService.getById(input.waitlist);
    if (!waitlist) throw new ConflictException('Waitlist does not exist');

    let userReferrer: PaprRepositoryResult<typeof User> | null = null;

    if (referrer) {
      const user = await this.usersService.getById(referrer);
      if (!user) throw new ConflictException('Referrer does not exist');
      userReferrer = user;
      input.referredBy = user._id.toString();
    }

    const user = await this.usersService.create(input);

    if (referrer && userReferrer) {
      await this.usersService.addReferrer(referrer);

      if (waitlist.options.userSkips > 0)
        await this.usersService.skip(userReferrer, waitlist.options.userSkips);
    }

    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new FastestValidatorPipe(objectIdValidator)) id: string,
  ): Promise<void> {
    await this.usersService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id', new FastestValidatorPipe(objectIdValidator)) id: string,
    @Body(new FastestValidatorPipe(updateUserValidator)) input: updateUserDto,
  ): Promise<PaprRepositoryResult<typeof User>> {
    const updatedUser = await this.usersService.update(id, input);

    if (!updatedUser) throw new NotFoundException();

    return updatedUser;
  }
}
