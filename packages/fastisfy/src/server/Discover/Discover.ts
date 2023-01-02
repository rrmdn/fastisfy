import fs from "fs/promises";
import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import path from "path";
import Dotenv from "dotenv";

export const FastisfyConfig = Type.Object({
  features: Type.Array(Type.String()),
  apiDir: Type.Optional(Type.String({ default: "api" })),
  auth: Type.Optional(Type.Object({ roles: Type.Array(Type.String()) })),
});

const FastisfyConfigCompiler = TypeCompiler.Compile(FastisfyConfig);

export default class Discover {
  /*
   * This method is used to load the config file
   * @param file The path to the config file
   * @returns The config file as a JSON object
   * @throws An error if the config file is invalid
   * @example
   * const config = await Discover.config();
   * console.log(config.features);
   * // => ["api", "auth", "database", "email"]
   *
   */
  static config = async (
    file = path.resolve(path.join(process.cwd(), "fastisfy.config.json"))
  ): Promise<Static<typeof FastisfyConfig>> => {
    const configFile = await fs
      .readFile(file, "utf-8")
      .catch(() => JSON.stringify({ features: [] }));
    const parsed = JSON.parse(configFile);
    if (FastisfyConfigCompiler.Check(parsed)) {
      parsed.apiDir = path.resolve(path.join(process.cwd(), parsed.apiDir || "api"));
      return parsed;
    }
    const errors = FastisfyConfigCompiler.Errors(parsed);
    throw new Error(
      "Invalid fastisfy.config.json file: " +
        Array.from(errors)
          .map((e) => `${e.message} at ${e.path.replace(/\//g, ".")}`)
          .join(", ")
    );
  };
  /**
   * This method is used to load environment variables
   * @param prefered The prefered environment
   */
  static env = async (prefered = "production") => {
    const root = process.cwd();
    try {
      const preferedEnv = path.resolve(path.join(root, `.env.${prefered}`));
      await fs.access(preferedEnv);
      Dotenv.config({ path: preferedEnv });
      console.log(`Loaded environment variables from ${preferedEnv}`);
    } catch (error) {
      console.log(`No environment file found for ${prefered}`);
      try {
        const env = path.resolve(path.join(root, ".env"));
        await fs.access(env);
        Dotenv.config({ path: env });
        console.log(`Loaded environment variables from ${env}`);
      } catch (error) {
        console.log(`No environment file found`);
      }
    }
  };
}
