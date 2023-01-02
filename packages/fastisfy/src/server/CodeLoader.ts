import { importFromString } from "module-from-string";
import * as swc from "@swc/core";
import path from "path";
import * as fs from "fs/promises";

export default class CodeLoader {
  static async parseHandler(path: string) {
    const result = await swc.transformFile(path, {
      jsc: {
        parser: {
          syntax: path.endsWith(".ts") ? "typescript" : "ecmascript",
          dynamicImport: true,
        },
        transform: {},
      },
    });

    return result.code;
  }
  /**
   * Load a custom implementation of an interface, looks for a .js or .ts file
   * @param location the location of the file
   * @param defaultInterface the default interface of the file if not found
   * @returns the implementation of the interface
   */
  static async implements<T>(location: string, defaultInterface?: T): Promise<T> {
    try {
      let file: string | null = null;
      try {
        file = path.resolve(`${location}.js`);
        await fs.access(file);
      } catch (error) {
        try {
          file = path.resolve(`${location}.ts`);
          await fs.access(file);
        } catch (error) {
          console.log(error)
          file = null;
        }
      }
      if (!file) throw new Error("File not found");
      const implemented = await importFromString(
        await CodeLoader.parseHandler(file),
        {
          dirname: file.split("/").slice(0, -1).join("/"),
          useCurrentGlobal: true,
        }
      );
      return implemented;
    } catch (error) {
      console.log("Custom server file not found. Skipping....");
      console.error(error);
      if (!defaultInterface) throw error;
      return defaultInterface;
    }
  }
}
