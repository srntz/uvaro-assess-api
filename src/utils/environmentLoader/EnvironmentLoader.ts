import { EnvironmentTypeEnum } from "./EnviromnentTypeEnum.js";

export class EnvironmentLoader {
  private static environment: EnvironmentTypeEnum;

  private constructor() {}

  static load(args?: string[]) {
    if (!args && !this.environment) {
      throw new Error(
        "Environment loader has not been initialized yet. Please provide command line arguments",
      );
    }

    if (this.environment) {
      return this.environment;
    }

    const modeArg = args.find((arg) => arg.startsWith("--mode:"));
    if (!modeArg) {
      throw new Error(
        "Environment configuration was not provided. Please provide a value to the --mode: flag",
      );
    }

    const argValue = modeArg.substring(7);

    if (argValue === "development") {
      this.environment = EnvironmentTypeEnum.DEVELOPMENT;
    } else if (argValue === "production") {
      this.environment = EnvironmentTypeEnum.PRODUCTION;
    } else {
      throw new Error(`--mode flag is invalid`);
    }

    return this.environment;
  }
}
