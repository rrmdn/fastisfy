import fs from "fs/promises";
import * as fastify from "fastify";
import { importFromString } from "module-from-string";
import path from "path";
import { Forbidden } from "http-errors";
import * as fastisfy from "fastisfy";
import CodeLoader from "./CodeLoader";
import AuthorizationHandler from "./AuthorizationHandler";
import { FastisfyConfig } from "../server/Discover/Discover";
import { Static } from "@sinclair/typebox";

export default class RouterRegistry {
  static allowedMethods: Record<string, string> = {
    del: "delete",
    get: "get",
    post: "post",
    put: "put",
    patch: "patch",
  };
  handlersMap = new Map<string, string>();
  constructor(
    private config: Static<typeof FastisfyConfig>,
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
    const handlerCode = await CodeLoader.parseHandler(entryPath);
    this.handlersMap.set(routePath, handlerCode);
  }
  /**
   * Look for a file named _server.js or _server.ts in the api folder
   * @param app The fastify instance
   * @returns void
   */
  async loadServerFile(app: fastify.FastifyInstance) {
    try {
      const serverFile = await CodeLoader.implements<{
        default: fastisfy.FastisfyCustomServer;
      }>(`${this.config.apiDir}/_server`, { default: async () => {} });

      try {
        await serverFile.default(app, {});
      } catch (error) {
        console.log("Server file error: ");
        console.error(error);
      }
    } catch (error) {
      console.log("Custom server file not found. Skipping...");
      console.error(error);
    }
  }
  async registerRoutes(app: fastify.FastifyInstance) {
    await this.loadServerFile(app);
    const authHandler = new AuthorizationHandler(this.config);
    const isAuthEnabled = this.config.features.includes("auth");
    for (const [route, value] of this.handlersMap.entries()) {
      const routeHandler = await importFromString(value, {
        dirname: this.rootAPI,
        useCurrentGlobal: true,
      });

      const methods = Object.getOwnPropertyNames(routeHandler).filter(
        (name) => !!RouterRegistry.allowedMethods[name]
      );

      for (const method of methods) {
        const requestHandler = routeHandler[method] as fastisfy.RequestHandler;
        const allowList = requestHandler.allow || ["public"];
        app[RouterRegistry.allowedMethods[method]](
          route,
          {
            schema: requestHandler.schema,
            preHandler: isAuthEnabled
              ? app.auth([
                  (req, rep, done) => {
                    authHandler
                      .isAllowed(req, allowList)
                      .then((allowed) => {
                        done(
                          allowed ? undefined : new Forbidden("Not allowed")
                        );
                      })
                      .catch(done);
                  },
                ])
              : undefined,
          },
          async (
            req: fastisfy.FastisfyRequest,
            rep: fastisfy.FastisfyReply
          ) => {
            await requestHandler(req, rep);
          }
        );
        console.log(`Route: ${method.toUpperCase()} ${route}`);
      }
    }
  }
}
