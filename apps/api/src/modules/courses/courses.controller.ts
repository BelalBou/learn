import { Controller, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private courses: CoursesService) {}

  @Get()
  list() {
    return this.courses.list();
  }

  @Get('lesson/:id')
  getLesson(@Param('id') id: string) {
    return this.courses.findLesson(id);
  }
}
