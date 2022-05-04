import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import User from './user.model';
import { UsersService } from './user.service';
import { PaprRepositoryResult } from '../papr';
import { createUserDto, createUserValidator } from './createUser.dto';
import { FastestValidatorPipe } from 'src/FastestValidatorPipe';
import { objectIdValidator } from 'src/common';
import { ObjectId } from 'mongodb';
import { updateUserDto, updateUserValidator } from './updateUser.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<PaprRepositoryResult<typeof User>[]> {
    const users = await this.usersService.get();

    return users;
  }

  @Get(':id')
  async findOne(
    @Param('id', new FastestValidatorPipe(objectIdValidator)) id: string,
  ): Promise<PaprRepositoryResult<typeof User>> {
    const user = await this.usersService.getById(new ObjectId(id));

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
    await this.usersService.remove(new ObjectId(id));
  }

  @Patch(':id')
  async update(
    @Param('id', new FastestValidatorPipe(objectIdValidator)) id: string,
    @Body(new FastestValidatorPipe(updateUserValidator)) input: updateUserDto,
  ): Promise<PaprRepositoryResult<typeof User>> {
    const updatedUser = await this.usersService.update(new ObjectId(id), input);

    if (!updatedUser) throw new NotFoundException();

    return updatedUser;
  }
}
