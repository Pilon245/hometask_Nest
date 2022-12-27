import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
  async sendEmail(email: string, code: string) {
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
      subject: 'Registration', // Subject line
      text: "Hello friends, I'am five age!", // plain text body
      html:
        ' <h1>Thanks for your registration</h1>\n' +
        '       <p>To finish registration please follow the link below:\n' +
        `          <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>\n` +
        '      </p>', // html body
    });
    return info;
  }
}
