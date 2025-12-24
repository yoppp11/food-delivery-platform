import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { ZodError } from "zod";

@Catch(ZodError)
export class BadRequestError implements ExceptionFilter<ZodError> {
  catch(exception: ZodError, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    response.status(400).json({
      code: 400,
      name: "BadRequest",
      message: exception.message,
    });
  }
}

@Catch()
export class UnauthorizedError implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    response.status(401).json({
      code: 401,
      name: "Unauthorized",
      message: "Unauthorized",
    });
  }
}
