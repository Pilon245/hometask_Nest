import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
  async sendEmail(email: string, code: string) {
    try {
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
        html: `<h1>Thank for your registration</h1>
               <p>To finish registration please follow the link below:
                  <a href='https://hometask-nest.vercel.app/auth/email-confirmation?code=${code}'>complete registration</a>
              </p>`, // html body
      });
      console.log('info', info);
      return info;
    } catch (e) {
      console.log('email adapter, sendEmail => e', e);
      return false;
    }
  }
}
