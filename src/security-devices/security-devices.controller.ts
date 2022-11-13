import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SecurityDevicesService } from './security-devices.service';
import { CreateSecurityDeviceDto } from './dto/create-security-device.dto';
import { UpdateSecurityDeviceDto } from './dto/update-security-device.dto';

@Controller('security-devices')
export class SecurityDevicesController {
  constructor(private readonly securityDevicesService: SecurityDevicesService) {}

  @Post()
  create(@Body() createSecurityDeviceDto: CreateSecurityDeviceDto) {
    return this.securityDevicesService.create(createSecurityDeviceDto);
  }

  @Get()
  findAll() {
    return this.securityDevicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.securityDevicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSecurityDeviceDto: UpdateSecurityDeviceDto) {
    return this.securityDevicesService.update(+id, updateSecurityDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.securityDevicesService.remove(+id);
  }
}
