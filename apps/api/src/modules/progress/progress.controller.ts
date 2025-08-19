import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../shared/jwt-auth.guard';
import { User } from '../shared/user.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

class ProgressDto {
  @IsString() @IsNotEmpty() lessonId!: string;
  @IsString() @IsNotEmpty() status!: string; // NOT_STARTED | IN_PROGRESS | COMPLETED
  @IsString() lastCode?: string;
}

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progress: ProgressService) {}

  @Get()
  list(@User('userId') userId: string) {
    return this.progress.listForUser(userId);
  }

  @Post()
  upsert(@User('userId') userId: string, @Body() dto: ProgressDto) {
    return this.progress.upsert(userId, dto.lessonId, dto.status, dto.lastCode);
  }
}
