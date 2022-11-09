import { Module } from '@nestjs/common';
import { VideosTestService } from './videos-test.service';
import { VideosTestController } from './videos-test.controller';

@Module({
  controllers: [VideosTestController],
  providers: [VideosTestService]
})
export class VideosTestModule {}
