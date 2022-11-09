import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VideosTestService } from './videos-test.service';
import { CreateVideosTestDto } from './dto/create-videos-test.dto';
import { UpdateVideosTestDto } from './dto/update-videos-test.dto';

@Controller('videos-test')
export class VideosTestController {
  constructor(private readonly videosTestService: VideosTestService) {}

  @Post()
  create(@Body() createVideosTestDto: CreateVideosTestDto) {
    return this.videosTestService.create(createVideosTestDto);
  }

  @Get()
  findAll() {
    return this.videosTestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosTestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideosTestDto: UpdateVideosTestDto) {
    return this.videosTestService.update(+id, updateVideosTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosTestService.remove(+id);
  }
}
