import { Test, TestingModule } from '@nestjs/testing';
import { VidService } from './vid.service';

describe('VidService', () => {
  let service: VidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VidService],
    }).compile();

    service = module.get<VidService>(VidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
