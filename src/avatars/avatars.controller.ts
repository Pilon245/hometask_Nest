import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import fs from 'node:fs';
import path from 'node:path';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('avatar')
export class AvatarsController {
  constructor(private readonly avatarService: AvatarsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createAvatarDto: CreateAvatarDto, @UploadedFile() image) {
    return this.avatarService.create(createAvatarDto, image);
  }

  @Get('change-page')
  changeAvatarPage() {
    //todo добавить папку views в dist
    //todo почему это не происходит автоматически?
    fs.read;
    return '<h1>Change Avatar Page</h1>';
    // return this.avatarService.findAll();
  }

  @Get()
  findAll() {
    return this.avatarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avatarService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvatarDto: UpdateAvatarDto) {
    return this.avatarService.update(+id, updateAvatarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avatarService.remove(+id);
  }
}
