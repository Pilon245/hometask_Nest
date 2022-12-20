import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Scope,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionQueryRepository } from './session.query.repository';
import { RefreshTokenGuard } from '../auth/strategy/refresh.token.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '../auth/current-user.param.decorator';
import { CurrentPayload } from '../auth/current-payload.param.decorator';

@ApiTags('security')
@Controller({
  path: 'security',
  scope: Scope.DEFAULT,
})
export class SessionController {
  constructor(
    private readonly sessionsService: SessionService,
    private sessionsQueryRepository: SessionQueryRepository,
  ) {}
  @UseGuards(RefreshTokenGuard)
  @Get('devices')
  async getDevices(@CurrentUserId() currentUserId) {
    return this.sessionsQueryRepository.findDevices(currentUserId);
  }
  @UseGuards(RefreshTokenGuard)
  @Delete('devices')
  @HttpCode(204)
  async deleteAllSessionsExceptOne(@CurrentPayload() currentPayload) {
    return this.sessionsService.deleteDevices(
      currentPayload.id,
      currentPayload.deviceId,
    );
  }
  @UseGuards(RefreshTokenGuard)
  @Delete('devices/:deviceId')
  async deleteSessionsByDeviceId(
    @Param('deviceId') deviceId: string,
    @CurrentUserId() currentUserId,
  ) {
    const foundDevice =
      await this.sessionsQueryRepository.findDevicesByDeviceId(deviceId);
    if (!foundDevice) {
      throw new UnauthorizedException();
    }
    const foundUser =
      await this.sessionsQueryRepository.findDevicesByDeviceIdAndUserId(
        currentUserId,
        deviceId,
      );
    if (!foundUser) {
      throw new UnauthorizedException();
    }
    return this.sessionsService.deleteDevicesById(deviceId);
  }
}
