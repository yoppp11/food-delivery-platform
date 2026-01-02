/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import * as z from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema) {}

  transform(value: any, _: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException(JSON.stringify(error.issues, null, 2));
      }
      throw new BadRequestException("Validation failed");
    }
  }
}
