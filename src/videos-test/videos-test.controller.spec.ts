import { Test, TestingModule } from '@nestjs/testing';
import { VideosTestController } from './videos-test.controller';
import { VideosTestService } from './videos-test.service';

describe('VideosTestController', () => {
  let controller: VideosTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosTestController],
      providers: [VideosTestService],
    }).compile();

    controller = module.get<VideosTestController>(VideosTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
