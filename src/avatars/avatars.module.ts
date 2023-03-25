import { Module } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { AvatarsController } from './avatars.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../blogs/domain/entities/nosql/blog.entity';
import { Avatars, AvatarSchema } from './avatars.entity';
import { FilesService } from './filesService';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Avatars.name, schema: AvatarSchema }]),
  ],
  controllers: [AvatarsController],
  providers: [AvatarsService, FilesService],
})
export class AvatarsModule {}
