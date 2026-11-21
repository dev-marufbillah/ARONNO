import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
const isVercel = process.env.VERCEL === "1";

if (!connectionString) {
  throw new Error("DATABASE_URL must be configured before starting the application.");
}

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn =
  globalForDb.conn ??
  postgres(connectionString, {
    max: isVercel ? 1 : 10,
    prepare: !isVercel,
    connect_timeout: 5,
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });