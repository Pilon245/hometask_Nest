import { Injectable } from '@nestjs/common';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
} from '../comments/domain/entities/nosql/comments.entity';
import { Model } from 'mongoose';
import { AvatarDocument, Avatars } from './avatars.entity';
import { FilesService } from './filesService';

@Injectable()
export class AvatarsService {
  constructor(
    @InjectModel(Avatars.name) private commentModel: Model<AvatarDocument>,
    private fileService: FilesService,
  ) {}
  async create(createAvatarDto: CreateAvatarDto, image: any) {
    const fileName = this.fileService.createFile(image);
    const dto = { ...createAvatarDto, image: 'kkk' };
    const comment = await new this.commentModel(dto);
    await comment.save();
    return comment;
  }

  findAll() {
    return `This action returns all avatar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} avatar`;
  }

  update(id: number, updateAvatarDto: UpdateAvatarDto) {
    return `This action updates a #${id} avatar`;
  }

  remove(id: number) {
    return `This action removes a #${id} avatar`;
  }
}
