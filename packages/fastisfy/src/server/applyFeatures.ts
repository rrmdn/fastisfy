import os from "os";
import { FastifyInstance } from "fastify";
import Discover from "./Discover/Discover";

export default async function applyFeatures(
  app: FastifyInstance,
  opts = { port: 3000, safe: false }
) {
  const config = await Discover.config();
  const features = new Set(config.features);
  if (features.has("compression") && opts.safe) {
    await app.register(require("@fastify/compress"));
    console.log("Compression enabled");
  }
  if (features.has("cors")) {
    await app.register(require("@fastify/cors"));
    console.log("CORS enabled");
  }
  if (features.has("overload-protection") && opts.safe) {
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
          url: "https://swagger.io",
          description: "Find more info here",
        },
        host: `localhost:${opts.port}`,
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
      },
    });
    await app.register(require("@fastify/swagger-ui"), {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      staticCSP: true,
      transformSpecificationClone: true,
    });
  }
}
