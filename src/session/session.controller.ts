import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { Response } from 'express';
import { JwtGenerate } from '../auth/helper/generate.token';
import { SessionQueryRepository } from './session.query.repository';
import { RefreshTokenGuard } from '../auth/strategy/refresh.token.guard';

@Controller('security')
export class SessionController {
  constructor(
    private readonly sessionsService: SessionService,
    protected jwtGenerate: JwtGenerate,
    private sessionsQueryRepository: SessionQueryRepository,
  ) {}
  @UseGuards(RefreshTokenGuard)
  @Get('devices')
  async getDevices(@Req() req, @Res() res: Response) {
    const devices = await this.sessionsQueryRepository.findDevices(req.user.id);
    return res.status(200).send(devices);
  }
  @UseGuards(RefreshTokenGuard)
  @Delete('devices')
  @HttpCode(204)
  async deleteAllSessionsExceptOne(@Req() req, @Res() res: Response) {
    console.log('req.user.id,', req.user.id);
    console.log('req.user.deviceId', req.user.deviceId);
    await this.sessionsService.deleteDevices(req.user.id, req.user.deviceId);
    return res.sendStatus(204);
  }
  @UseGuards(RefreshTokenGuard)
  @Delete('devices/:deviceId')
  async deleteSessionsByDeviceId(
    @Param('deviceId') deviceId: string,
    @Req() req,
    @Res() res: Response,
  ) {
    const foundDevice =
      await this.sessionsQueryRepository.findDevicesByDeviceId(deviceId);
    console.log('foundDevice', foundDevice);
    if (!foundDevice) return res.sendStatus(404);
    const foundUser =
      await this.sessionsQueryRepository.findDevicesByDeviceIdAndUserId(
        req.user.id,
        deviceId,
      );
    console.log('foundUser', foundUser);
    if (!foundUser) return res.sendStatus(403);
    await this.sessionsService.deleteDevicesById(deviceId);
    return res.sendStatus(204);
  }
}
