import { Injectable } from '@nestjs/common';
import { CreateSecurityDeviceDto } from './dto/create-security-device.dto';
import { UpdateSecurityDeviceDto } from './dto/update-security-device.dto';

@Injectable()
export class SecurityDevicesService {
  create(createSecurityDeviceDto: CreateSecurityDeviceDto) {
    return 'This action adds a new securityDevice';
  }

  findAll() {
    return `This action returns all securityDevices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} securityDevice`;
  }

  update(id: number, updateSecurityDeviceDto: UpdateSecurityDeviceDto) {
    return `This action updates a #${id} securityDevice`;
  }

  remove(id: number) {
    return `This action removes a #${id} securityDevice`;
  }
}
