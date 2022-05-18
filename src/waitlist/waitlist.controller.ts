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
  UseGuards,
} from '@nestjs/common';
import { PaprRepositoryResult } from 'src/papr';
import { WaitlistsService } from './waitlist.service';
import { Waitlist } from './waitlist.model';
import {
  createWaitlistDto,
  createWaitlistValidator,
} from './createWaitlist.dto';
import { FastestValidatorPipe } from '../FastestValidatorPipe';
import { objectIdValidator } from '../common';
import {
  updateWaitlistValidator,
  updateWaitlistDto,
} from './updateWaitlist.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/waitlists')
export class WaitlistController {
  constructor(private readonly waitlistsService: WaitlistsService) {}

  @Post()
  async create(
    @Body(new FastestValidatorPipe(createWaitlistValidator))
    input: createWaitlistDto,
  ): Promise<PaprRepositoryResult<typeof Waitlist>> {
    const newWaitlist = await this.waitlistsService.create(input);

    return newWaitlist;
  }

  @Get()
  async findAll(): Promise<PaprRepositoryResult<typeof Waitlist>[]> {
    const waitlists = await this.waitlistsService.get();

    return waitlists;
  }

  @Get(':id')
  async findById(
    @Param('id', new FastestValidatorPipe(objectIdValidator)) id: string,
  ): Promise<PaprRepositoryResult<typeof Waitlist>> {
    const waitlist = await this.waitlistsService.getById(id);
    if (!waitlist) throw new NotFoundException();

    return waitlist;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new FastestValidatorPipe(objectIdValidator)) id: string,
  ): Promise<void> {
    await this.waitlistsService.remove(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new FastestValidatorPipe(objectIdValidator)) id: string,
    @Body(new FastestValidatorPipe(updateWaitlistValidator))
    input: updateWaitlistDto,
  ): Promise<PaprRepositoryResult<typeof Waitlist>> {
    const updatedWaitlist = await this.waitlistsService.update(id, input);

    if (!updatedWaitlist) throw new NotFoundException();

    return updatedWaitlist;
  }
}
