import dotenv from "dotenv";
import { DatabaseConnection } from "../db/DatabaseConnection";

export default async function () {
  dotenv.config({ path: ".env.test" });
}
