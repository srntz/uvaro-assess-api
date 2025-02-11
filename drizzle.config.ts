import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas",
  dbCredentials: {
    url: process.env.UVARO_POSTGRES_URL,
  },
});
