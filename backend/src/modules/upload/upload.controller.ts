/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* */
import {
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { CloudinaryUpload } from "../../common/cloudinary/cloudinary.storage";

@Controller("upload")
export class UploadController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prisma: PrismaService,
  ) {}

  @Post("image")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: CloudinaryUpload,
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new HttpException("File is required", HttpStatus.BAD_REQUEST);
      }

      const result = await this.prisma.image.create({
        data: {
          imageUrl: file.path,
        },
        select: {
          id: true,
          imageUrl: true,
        },
      });

      return result;
    } catch (error) {
      this.logger.error(`Upload failed: ${error}`);
      throw error;
    }
  }
}
