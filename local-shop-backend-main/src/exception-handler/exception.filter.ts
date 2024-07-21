import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
  } from '@nestjs/common';

  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      console.log(exception);
      response.status(status).json({
        statusCode: status,
        message: "Please Contact SHOPOLITE",
        timestamp: new Date().toISOString(),
        error: exception as any,
      });
    }
  }