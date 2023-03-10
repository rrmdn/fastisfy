import { Command, Flags } from "@oclif/core";
import * as fastify from "fastify";
import chokidar from "chokidar";
import RouterRegistry from "../server/RouterRegistry";
import applyFeatures from "../server/applyFeatures";
import Discover from "../server/Discover/Discover";
import path from "path";

export default class Dev extends Command {
  static flags = {
    help: Flags.help({ char: "h" }),
    port: Flags.integer({
      char: "p",
      description: "port to listen on",
      default: 3000,
    }),
  };
  static description = "Run the development server";
  async run() {
    const { flags } = await this.parse(Dev);
    const config = await Discover.config();
    const root = path.resolve(path.join(process.cwd(), config.apiDir || "api"));
    const routerRegistry = new RouterRegistry(config, root);
    await Discover.env("development");
    await routerRegistry.scanDir(config.apiDir);
    const app = fastify.fastify();
    app.all(
      "*",
      async (req: fastify.FastifyRequest, rep: fastify.FastifyReply) => {
        const devApp = fastify.fastify();
        await applyFeatures(devApp, { port: flags.port, safe: false });
        await routerRegistry.registerRoutes(devApp);
        const response = await new Promise<fastify.LightMyRequestResponse>(
          (resolve, reject) => {
            devApp.inject(
              {
                // @ts-ignore
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: req.body,
              },
              (err, resp) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(resp);
                }
              }
            );
          }
        );
        rep.status(response.statusCode).send(response.payload);
      }
    );
    app.setErrorHandler((err, req, rep) => {
      console.error(err);
      rep
        .status(500)
        .send({ message: "Internal server error", error: err.message });
    });

    await app.listen({ port: flags.port });
    console.log("Development server started, listening on port", flags.port);
    console.log("Watching for changes...");
    console.log(routerRegistry.rootAPI);
    const watcher = chokidar
      .watch(routerRegistry.rootAPI, {})
      .on("change", async (entryPath) => {
        console.log("Change detected, reloading...");
        await routerRegistry.parseRoute(entryPath);
      });
    process.on("SIGINT", () => {
      watcher.close();
      process.exit();
    });
  }
}
