import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordEmailAdapter {
  async sendPasswordOnEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'saidparsermail@gmail.com',
        pass: 'kofignlwgnictwgn',
      },
    });

    const info = await transporter.sendMail({
      from: 'Said', // sender address
      to: email, // list of receivers
      subject: 'Recovery Password', // Subject line
      text: "Hello friends, I'am five age!", // plain text body
      html:
        ' <h1>Password recovery</h1>\n' +
        '       <p>To finish password recovery please follow the link below:\n' +
        `         <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>\n` +
        '      </p>', // html body
    });
    return info;
  }
}
