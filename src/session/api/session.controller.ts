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
import { SessionService } from '../application/session.service';
import { SessionQueryRepository } from '../infrastructure/session.query.repository';
import { RefreshTokenGuard } from '../../auth/guards/refresh.token.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '../../auth/current-user.param.decorator';
import { CurrentPayload } from '../../auth/current-payload.param.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteDeviceByDeviceIdCommand } from '../application/use-cases/delete.device.id.session.use.cases';
import { DeleteDevicesUseCase } from '../application/use-cases/delete.devices.session.use.cases';
import { SessionSqlQueryRepository } from '../infrastructure/session.sql.query.repository';

@ApiTags('security')
@Controller({
  path: 'security',
  scope: Scope.DEFAULT,
})
export class SessionController {
  constructor(
    private readonly sessionsService: SessionService,
    private sessionsQueryRepository: SessionSqlQueryRepository,
    private commandBus: CommandBus,
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
    return this.commandBus.execute(new DeleteDevicesUseCase(currentPayload));
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
    return this.commandBus.execute(new DeleteDeviceByDeviceIdCommand(deviceId));
  }
}
