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
    // console.log('req.cookies.refreshToken', req.cookies.refreshToken);
    // if (!req.cookies.refreshToken) return res.sendStatus(401);
    // const result: any = await this.jwtGenerate.verifyTokens(
    //   req.cookies.refreshToken,
    // );
    // console.count(result);
    // if (!result) return res.sendStatus(401);
    console.log('req.user', req.user);
    const devices = await this.sessionsQueryRepository.findDevices(
      req.user.deviceId,
    );
    return res.status(200).send(devices);
  }

  @Delete('devices')
  @HttpCode(204)
  async deleteAllSessionsExceptOne(@Req() req, @Res() res: Response) {
    if (!req.cookies.refreshToken) return res.sendStatus(401);
    console.log('req.cookies.refreshToken', req.cookies.refreshToken);
    const result: any = await this.jwtGenerate.verifyTokens(
      req.cookies.refreshToken,
    );
    if (!result) return res.sendStatus(401);
    console.log('result', result);
    await this.sessionsService.deleteDevices(result.id, result.deviceId);
    return res.sendStatus(200);
  }

  @Delete('devices/:deviceId')
  async deleteSessionsByDeviceId(
    @Param('deviceId') deviceId: string,
    @Req() req,
    @Res() res: Response,
  ) {
    if (!req.cookies.refreshToken) return res.sendStatus(401);
    const result: any = await this.jwtGenerate.verifyTokens(
      req.cookies.refreshToken,
    );
    const foundUser =
      await this.sessionsQueryRepository.findDevicesByDeviceIdAndUserId(
        result.id,
        result.deviceId,
      );
    if (!foundUser) return res.sendStatus(403);
    if (!result) return res.sendStatus(401);
    await this.sessionsService.deleteDevicesById(result.deviceId);
    return res.sendStatus(200);
  }
}
