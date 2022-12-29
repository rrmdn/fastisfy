import * as fastisfy from "fastisfy";

const server: fastisfy.FastisfyCustomServer = async (app, opts) => {
  console.log("registering custom server file");
  app.get("/", async (request, reply) => {
    reply.send({ hello: "world" });
  });
};

export default server;
