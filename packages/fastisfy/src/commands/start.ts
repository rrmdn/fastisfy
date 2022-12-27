import os from "os";
import { Command, Flags } from "@oclif/core";
import * as fastify from "fastify";
import RouterRegistry from "../server/RouterRegistry";
import Discover from "../server/Discover/Discover";

export default class Start extends Command {
  static flags = {
    help: Flags.help({ char: "h" }),
    port: Flags.integer({
      char: "p",
      description: "port to listen on",
      default: 3000,
    }),
  };
  static description = "Start the production server";
  async run() {
    const { flags } = await this.parse(Start);
    const config = await Discover.config();
    const features = new Set(config.features);
    const routerRegistry = new RouterRegistry();
    const app = fastify.fastify();
    if (features.has("compression")) {
      await app.register(require("@fastify/compress"));
      console.log("Compression enabled");
    }
    if (features.has("cors")) {
      await app.register(require("@fastify/cors"));
      console.log("CORS enabled");
    }
    if (features.has("overload-protection")) {
      const mem = os.totalmem();
      await app.register(require("@fastify/under-pressure"), {
        maxEventLoopDelay: 1000,
        maxRssBytes: mem * 0.8,
        maxEventLoopUtilization: 0.98,
      });
      console.log("Overload protection enabled");
    }
    if (features.has("swagger")) {
      await app.register(require("@fastify/swagger"), {
        swagger: {
          info: {
            title: "Fastisfy API",
            description: "Fastisfy API documentation",
            version: "0.1.0",
          },
          externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
          },
          host: `localhost:${flags.port}`,
          schemes: ["http"],
          consumes: ["application/json"],
          produces: ["application/json"],
        },
      });
      await app.register(require('@fastify/swagger-ui'), {
        routePrefix: '/documentation',
        uiConfig: {
          docExpansion: 'full',
          deepLinking: false
        },
        staticCSP: true,
        transformSpecificationClone: true
      })
    }
    await routerRegistry.scanDir("api");
    await routerRegistry.registerRoutes(app);

    app.setErrorHandler((err, req, rep) => {
      console.error(err);
      rep
        .status(500)
        .send({ message: "Internal server error", error: err.message });
    });

    await app.listen({ port: flags.port });
    console.log("Server started, listening on port", flags.port);
  }
}
