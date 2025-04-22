import dotenv from "dotenv";
import { EnvironmentLoader } from "../utils/environmentLoader/EnvironmentLoader";

export default async function () {
  dotenv.config({ path: `.env.${EnvironmentLoader.load(["--mode:test"])}` });
}
