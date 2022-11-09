import { Injectable } from '@nestjs/common';
import { CreateVideosTestDto } from './dto/create-videos-test.dto';
import { UpdateVideosTestDto } from './dto/update-videos-test.dto';

@Injectable()
export class VideosTestService {
  create(createVideosTestDto: CreateVideosTestDto) {
    return 'This action adds a new videosTest';
  }

  findAll() {
    return `This action returns all videosTest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} videosTest`;
  }

  update(id: number, updateVideosTestDto: UpdateVideosTestDto) {
    return `This action updates a #${id} videosTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} videosTest`;
  }
}
