export class CreateSessionInputModel {
  ip: string;
  title: string;
  lastActiveDate: string;
  expiresDate: string;
  deviceId: string;
  userId: string;
}
export class SessionFactory {
  constructor(
    public ip: string,
    public title: string,
    public lastActiveDate: string,
    public expiresDate: string,
    public deviceId: string,
    public userId: string,
  ) {}
}
export class CreateSessionUseCaseDto {
  userId: string;
  ip: string;
  deviceName: string;
}
export class DeleteDevicesUseCaseDto {
  id: string;
  deviceId: string;
}
