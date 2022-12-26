import * as fastify from "fastify";
import { promises as fs } from "fs";
import oas from "fastify-oas";
import path from "path";
import * as swc from "@swc/core";
import { importFromString } from "module-from-string";
import chokidar from "chokidar";

type Request = fastify.FastifyRequest;
type Response = fastify.FastifyReply;

let app = fastify.fastify();

async function parseHandler(path: string) {
  const result = await swc.transformFile(path, {
    jsc: {
      parser: {
        syntax: "ecmascript",
        dynamicImport: true,
      },
      transform: {},
    },
  });

  return result.code;
}

const allowedMethods = new Set(["get", "post", "put", "delete", "patch"]);

const handlersCode = new Map<string, string>();

// recursively scan the routes directory and populate the handlersCode map
const populateRoutes = async (apiPath: string) => {
  const entries = await fs.readdir(apiPath, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = `${apiPath}/${entry.name}`;
    if (entry.isDirectory()) {
      await populateRoutes(entryPath);
      continue;
    }
    if (!entry.name.endsWith(".js")) {
      continue;
    }
    const routePath = entryPath
      .split("/api")[1]
      .split(".")[0]
      .replace(/\[([^\]]+)\]/g, ":$1");
    const handlerCode = await parseHandler(entryPath);
    handlersCode.set(routePath, handlerCode);
  }
};

const ROOT_API = path.resolve(__dirname, "../api");

async function registerRoutes(app: fastify.FastifyInstance) {
  for (const [route, value] of handlersCode.entries()) {
    const routeHandler = await importFromString(value, {
      dirname: ROOT_API,
    });

    const methods = Object.getOwnPropertyNames(routeHandler).filter(
      (name) =>
        name !== "length" &&
        name !== "name" &&
        name !== "prototype" &&
        allowedMethods.has(name)
    );

    for (const method of methods) {
      app[method](
        route,
        { schema: routeHandler[`${method}Schema`] },
        async (req: Request, res: Response) => {
          await routeHandler[method](req, res, {});
        }
      );
      console.log(`Route: $ {method.toUpperCase()} ${route}`);
    }
  }
}

const boot = async () => {
  console.log("starting");
  await app.register(oas, {
    routePrefix: "/documentation",
    swagger: {
      info: {
        title: "Fastisfy",
        description: "Fastisfy API documentation",
        version: "0.1.0",
      },
      consumes: ["application/json"],
      produces: ["application/json"],
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
    },
    exposeRoute: true,
  });
  await populateRoutes(ROOT_API);
  if (process.env.NODE_ENV !== "production") {
    app.all("*", async (req: Request, res: Response) => {
      const devApp = fastify.fastify();
      await registerRoutes(devApp);
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
      res.status(response.statusCode).send(response.payload);
    });
  } else {
    await registerRoutes(app);
  }
  await app.listen({ port: 3000 });
  console.log("Listening on port 3000");
  if (process.env.NODE_ENV !== "production") {
    console.log("Watching for changes...");
    chokidar
      .watch(ROOT_API, {})
      .on("change", async (entryPath) => {
        console.log("Change detected, reloading...");
        const routePath = entryPath
          .split("/api")[1]
          .split(".")[0]
          .replace(/\[([^\]]+)\]/g, ":$1");
        const handlerCode = await parseHandler(entryPath);
        handlersCode.set(routePath, handlerCode);
      });
  }
};

boot();
