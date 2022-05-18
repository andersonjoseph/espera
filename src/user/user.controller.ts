import {
  Body,
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

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly waitlistService: WaitlistsService,
  ) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParsePositiveNumberPipe)
    page: PositiveNumber,
  ): Promise<PaginatedResult<typeof User>> {
    const perPage = this.usersService.perPage;
    const [users, totalCount] = await Promise.all([
      await this.usersService.get(page),
      await this.usersService.getCount(),
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
  ): Promise<PaprRepositoryResult<typeof User>> {
    const user = await this.usersService.create(input);

    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new FastestValidatorPipe(objectIdValidator)) id: string,
  ): Promise<void> {
    await this.usersService.remove(id);
  }

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
