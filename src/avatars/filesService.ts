import { HttpException, Injectable } from '@nestjs/common';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
} from '../comments/domain/entities/nosql/comments.entity';
import { Model } from 'mongoose';
import { AvatarDocument, Avatars } from './avatars.entity';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      const fileName = randomUUID() + '.jpg';
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      console.log(e);
      throw new HttpException('Error', 405);
    }
  }
}
