/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as z from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema) {}

  transform(value: unknown, _: ArgumentMetadata) {
    return this.schema.parse(value);
  }
}
