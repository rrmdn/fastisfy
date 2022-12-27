import { Command, Flags } from "@oclif/core";
import * as fastify from "fastify";
import chokidar from "chokidar";
import RouterRegistry from "../server/RouterRegistry";

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
    const routerRegistry = new RouterRegistry();
    const app = fastify.fastify();
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
