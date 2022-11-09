import { Module } from '@nestjs/common';
import { VidController } from './vid.controller';
import { VidService } from './vid.service';

@Module({
  controllers: [VidController],
  providers: [VidService]
})
export class VidModule {}
