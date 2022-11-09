import { Test, TestingModule } from '@nestjs/testing';
import { VidController } from './vid.controller';

describe('VidController', () => {
  let controller: VidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VidController],
    }).compile();

    controller = module.get<VidController>(VidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
