import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations',
  },
  datasource: {
    // Use process.env directly to allow optional DATABASE_URL during build
    // This allows 'prisma generate' to work without a real database connection
    url: process.env.DATABASE_URL!,
  },
});
