import { BullModule } from "@nestjs/bullmq";

BullModule.forRoot({
  connection: {
    host: "localhost",
    port: 6379,
  },
});
