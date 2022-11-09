import { PartialType } from '@nestjs/mapped-types';
import { CreateVideosTestDto } from './create-videos-test.dto';

export class UpdateVideosTestDto extends PartialType(CreateVideosTestDto) {}
