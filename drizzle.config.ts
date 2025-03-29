import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { EnvironmentLoader } from "./src/utils/environmentLoader/EnvironmentLoader";

dotenv.config({
  path: `.env.${EnvironmentLoader.load(["--mode:development"])}`,
});

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas",
  dbCredentials: {
    url: process.env.UVARO_POSTGRES_URL,
  },
});
