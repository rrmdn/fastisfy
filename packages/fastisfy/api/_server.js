export default async function server(fastify, opts) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });
}
