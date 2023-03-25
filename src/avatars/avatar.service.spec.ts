import { Test, TestingModule } from '@nestjs/testing';
import { AvatarsService } from './avatars.service';

describe('AvatarService', () => {
  let service: AvatarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvatarsService],
    }).compile();

    service = module.get<AvatarsService>(AvatarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
