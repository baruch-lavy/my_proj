
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as
      | string
      | { message: string; description: string; cause?: Error };

    console.log(exceptionResponse)
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message,
        description: typeof exceptionResponse === 'string' ? undefined : exceptionResponse.description,
        cause: typeof exceptionResponse === 'string' ? undefined : exceptionResponse.cause,
      });
  }
}
