import { Command, Flags } from "@oclif/core";
import * as fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import applyFeatures from "../server/applyFeatures";
import RouterRegistry from "../server/RouterRegistry";
import Discover from "../server/Discover/Discover";
import path from "path";

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
    const root = path.resolve(path.join(process.cwd(), config.apiDir || "api"));
    const routerRegistry = new RouterRegistry(root);
    await Discover.env("production");
    const app = fastify.fastify().withTypeProvider<TypeBoxTypeProvider>();
    await applyFeatures(app, { port: flags.port, safe: true });
    await routerRegistry.scanDir(routerRegistry.rootAPI);
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
