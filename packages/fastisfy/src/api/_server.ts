import * as fastisfy from "fastisfy";
import fastifyJwt from "@fastify/jwt";

const server: fastisfy.FastisfyCustomServer = async (app, opts) => {
  console.log("registering custom server file");
  await app.register(fastifyJwt, {
    secret: "supersecret",
  });
  app.get("/", async (request, reply) => {
    reply.send({ hello: "world" });
  });
};

export default server;
