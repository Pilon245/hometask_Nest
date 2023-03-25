import { Test, TestingModule } from '@nestjs/testing';
import { AvatarsService } from './avatars.service';
import { AvatarsController } from 'avatars/avatars.controller';

describe('AvatarController', () => {
  let controller: AvatarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarsController],
      providers: [AvatarsService],
    }).compile();

    controller = module.get<AvatarsController>(AvatarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
