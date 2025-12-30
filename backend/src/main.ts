import { NestFactory } from "@nestjs/core";
import "dotenv/config";
import { AppModule } from "./app.module";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { CurrentUserInterceptor } from "./common/interceptors";
import { PrismaService } from "./common/prisma.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const prisma = new PrismaService();

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });
  app.useLogger(logger);
  app.setGlobalPrefix("api");
  app.useGlobalInterceptors(new CurrentUserInterceptor(prisma));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
