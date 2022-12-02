import { EmailAdapter } from '../adapters/emailAdapter';
import { Injectable } from '@nestjs/common';
import { PasswordEmailAdapter } from '../adapters/password-email-adapter.service';

@Injectable()
export class EmailManager {
  constructor(
    protected emailAdapter: EmailAdapter,
    protected passwordEmailAdapter: PasswordEmailAdapter,
  ) {}
  async sendPasswordRecoveryMessage(user: any) {
    await this.emailAdapter.sendEmail(
      user.accountData.email,
      user.emailConfirmation.confirmationCode,
    );
  }
  async sendNewPasswordMessage(user: any) {
    await this.passwordEmailAdapter.sendPasswordOnEmail(
      user.accountData.email,
      user.passwordConfirmation.confirmationCode,
    );
  }
}
