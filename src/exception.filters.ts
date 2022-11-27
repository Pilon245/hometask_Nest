import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';

// @Catch(Error)
// export class ErrorExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//
//     if (process.env.envorinment === 'production') {
//       response
//         .status(500)
//         .send({ error: exception.toString(), stack: exception.stack });
//     } else {
//       response.status(500).send('some error eccured');
//     }
//   }
// }

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 404) {
      response.sendStatus(404);
      return;
    }
    if (status === 403) {
      response.sendStatus(403);
      return;
    }
    if (status === 401) {
      response.sendStatus(401);
      return;
    }
    // if (status === 500 && process.env.envorinment === 'production') {
    //   response.status(500).send({});
    // }
    if (status === 400) {
      const errorsResponse = {
        errorsMessages: [],
      };
      // {
      //   const errorResponse = {
      //     errorsMessages: [],
      //   };
      //   const responseBody: any = exception.getResponse();
      //   responseBody.message.forEach((m) =>
      //     errorResponse.errorsMessages.push(m),
      //   );
      //   response.status(status).json(errorResponse);
      // }
      const responseBody: any = exception.getResponse();
      responseBody.message.forEach((m) =>
        errorsResponse.errorsMessages.push(m),
      );
      response.status(status).json(errorsResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
