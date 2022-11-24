import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { AuthService } from '../auth/auth.service';
import { verifyTokens } from '../auth/helper/generate.token';
import { Response } from 'express';
import { payloadRefreshToken } from '../helper/auth.function';

@Controller('security')
export class SessionController {
  constructor(private readonly sessionsService: SessionService) {}
  @Get('devices')
  async getDevices(@Param('id') id: string, @Req() req, @Res() res: Response) {
    if (!req.cookies.refreshToken) return res.sendStatus(401);
    const result: any = await payloadRefreshToken(req.cookies.refreshToken);
    if (!result) return res.sendStatus(401);
    const devices = await this.sessionsService.findDevices(result.id);
    return res.status(200).send(devices);
  }

  @Delete('devices')
  @HttpCode(204)
  async deleteAllSessionsExceptOne(@Req() req, @Res() res: Response) {
    if (!req.cookies.refreshToken) return res.sendStatus(401);
    console.log('req.cookies.refreshToken', req.cookies.refreshToken);
    const result: any = await payloadRefreshToken(req.cookies.refreshToken);
    if (!result) return res.sendStatus(401);
    console.log('result', result);
    await this.sessionsService.deleteDevices(result.userId, result.id);
    return res.sendStatus(401);
  }

  @Delete('devices/:deviceId')
  async deleteSessionsByDeviceId(
    @Param('deviceId') deviceId: string,
    @Req() req,
    @Res() res: Response,
  ) {
    if (!req.cookies.refreshToken) return res.sendStatus(401);
    const result: any = await payloadRefreshToken(req.cookies.refreshToken);
    if (!result) return res.sendStatus(401);
    await this.sessionsService.deleteDevicesById(result.id);
    return res.sendStatus(401);
  }
}
