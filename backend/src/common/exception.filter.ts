/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from "@nestjs/common";
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

@Catch(UnauthorizedException)
export class UnauthorizedError implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      code: status,
      name: "Unauthorized",
      message:
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : exceptionResponse["message"],
    });
  }
}
