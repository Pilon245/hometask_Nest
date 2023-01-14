import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
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
import {
  DeleteDevicesCommand,
  DeleteDevicesUseCase,
} from '../application/use-cases/delete.devices.session.use.cases';
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
    return this.commandBus.execute(new DeleteDevicesCommand(currentPayload));
  }
  @UseGuards(RefreshTokenGuard)
  @Delete('devices/:deviceId')
  @HttpCode(204)
  async deleteSessionsByDeviceId(
    @Param('deviceId') deviceId: string,
    @CurrentUserId() currentUserId,
  ) {
    const foundDevice =
      await this.sessionsQueryRepository.findDevicesByDeviceId(deviceId);
    console.log('foundDevice', foundDevice);

    if (!foundDevice) {
      throw new HttpException('Incorrect Not Found', 404);
    }
    if (!foundDevice.userId != currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    return this.commandBus.execute(new DeleteDeviceByDeviceIdCommand(deviceId));
  }
}
