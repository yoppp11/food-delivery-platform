import { PrismaClient } from "@prisma/client";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import { execSync } from "child_process";

let postgresContainer: StartedPostgreSqlContainer;
let redisContainer: StartedRedisContainer;
let prisma: PrismaClient;

export async function setupTestEnvironment() {
  postgresContainer = await new PostgreSqlContainer("postgres:16-alpine")
    .withDatabase("test_db")
    .withUsername("test")
    .withPassword("test")
    .start();

  redisContainer = await new RedisContainer("redis:7-alpine").start();

  const databaseUrl = postgresContainer.getConnectionUri();

  process.env.DATABASE_URL = databaseUrl;
  process.env.REDIS_CACHE_HOST = redisContainer.getHost();
  process.env.REDIS_CACHE_PORT = redisContainer.getMappedPort(6379).toString();

  execSync("npx prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });

  prisma = new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
  });

  await prisma.$connect();

  return { prisma, postgresContainer, redisContainer };
}

export async function teardownTestEnvironment() {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (postgresContainer) {
    await postgresContainer.stop();
  }
  if (redisContainer) {
    await redisContainer.stop();
  }
}

export async function cleanDatabase(prisma: PrismaClient) {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  if (tables.length > 0) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch {
      // Ignore errors during cleanup
    }
  }
}

export { prisma, postgresContainer, redisContainer };
