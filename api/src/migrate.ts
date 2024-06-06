import "dotenv/config";
import { db } from "./libs/db";
import { migrate } from "drizzle-orm/node-postgres/migrator";

await migrate(db, { migrationsFolder: "./drizzle"});