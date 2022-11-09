import { Test, TestingModule } from '@nestjs/testing';
import { VideosTestService } from './videos-test.service';

describe('VideosTestService', () => {
  let service: VideosTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideosTestService],
    }).compile();

    service = module.get<VideosTestService>(VideosTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
