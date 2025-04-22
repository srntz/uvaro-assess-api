import { EnvironmentTypeEnum } from "./EnviromnentTypeEnum";

/**
 * This class determines the environment based on the respective command line argument.
 * Currently, it is used for loading corrent .env file according to the environment.
 *
 * The class is a singleton to ensure the consistency of the environment across the application.
 * It is recommended to be initialized as early as possible.
 */
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
    } else if (argValue === "test") {
      this.environment = EnvironmentTypeEnum.TEST;
    } else {
      throw new Error(`--mode value is invalid`);
    }

    return this.environment;
  }
}
