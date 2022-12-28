import fs from "fs/promises";
import * as swc from "@swc/core";
import * as fastify from "fastify";
import { importFromString } from "module-from-string";
import path from "path";

export default class RouterRegistry {
  static allowedMethods = new Set(["get", "post", "put", "delete", "patch"]);
  handlersMap = new Map<string, string>();
  constructor(
    public rootAPI: string = path.resolve(path.join(process.cwd(), "api"))
  ) {}
  async scanDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        await this.scanDir(entryPath);
        continue;
      }
      await this.parseRoute(entryPath);
    }
  }
  async parseRoute(entryPath: string) {
    if (!entryPath.match(/\.js|\.ts$/)) {
      return;
    }

    const routePath = entryPath
      .split("api")[1]
      .split(".")[0]
      .replace(/\[([^\]]+)\]/g, ":$1")
      .replace(/\/index$/, "");
    const handlerCode = await this.parseHandler(entryPath);
    this.handlersMap.set(routePath, handlerCode);
  }
  async parseHandler(path: string) {
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
   * Look for a file named _server.js or _server.ts in the api folder
   * @param app The fastify instance
   * @returns void
   */
  async loadServerFile(app: fastify.FastifyInstance) {
    try {
      let file: string | null = null;
      try {
        file = path.resolve(`${this.rootAPI}/_server.js`);
        await fs.access(file);
      } catch (error) {
        try {
          file = path.resolve(`${this.rootAPI}/_server.ts`);
          await fs.access(file);
        } catch (error) {
          file = null;
        }
      }
      if (!file) return;
      const serverFile: { default: fastisfy.FastisfyCustomServer } =
        await importFromString(await this.parseHandler(file));
      await serverFile.default(app, {});
    } catch (error) {
      console.log('Custom server file not found. Skipping...')
    }
  }
  async registerRoutes(app: fastify.FastifyInstance) {
    await this.loadServerFile(app);
    for (const [route, value] of this.handlersMap.entries()) {
      const routeHandler = await importFromString(value, {
        dirname: this.rootAPI,
      });

      const methods = Object.getOwnPropertyNames(routeHandler).filter(
        (name) =>
          name !== "length" &&
          name !== "name" &&
          name !== "prototype" &&
          RouterRegistry.allowedMethods.has(name)
      );

      for (const method of methods) {
        const requestHandler = routeHandler[method] as fastisfy.RequestHandler;
        app[method](
          route,
          { schema: requestHandler.schema },
          async (req: fastisfy.Request, rep: fastisfy.Reply) => {
            await requestHandler(req, rep);
          }
        );
        console.log(`Route: ${method.toUpperCase()} ${route}`);
      }
    }
  }
}
