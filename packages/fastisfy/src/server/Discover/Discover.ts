import fs from "fs/promises";
import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import path from "path";

const FastisfyConfig = Type.Object({
  features: Type.Array(Type.String()),
  apiDir: Type.Optional(Type.String()),
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
    const configFile = await fs.readFile(file, "utf-8");
    const parsed = JSON.parse(configFile);
    if (FastisfyConfigCompiler.Check(parsed)) {
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
}
