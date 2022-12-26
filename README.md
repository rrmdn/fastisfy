# Fastisfy

Fastisfy is a satistfyingly fast and simple web framework to build REST APIs with Node.js on top of Fastify.
You can define routes using Next.js-like API and use the power of Fastify to build your APIs.

## Usage

Create `api` directory in your project root and create `hello.js` file in it.

```js
export const get = async (req, reply) => {
  reply.send({ hello: "world" });
};
```

Run `fastisfy dev` to start the development server. You will be able to access your API at `http://localhost:3000/hello`, and it will return `{ "hello": "world" }`.

## API

### Custom server.js

You can create `server.js` file in your project root to customize the server. The file should export a function that takes Fastify instance as an argument.

```js
export default async function server(fastify) {
  await fastify.register(require("fastify-cors"), {
    origin: true,
  });
}
```

### Parameters

You can use parameters in your routes by adding `[parameter]` to the route path. For example, if you want to create a route that returns the name of the user, you can create `users/[id].js` file and use `req.params.id` to get the user ID.

```js
export const get = async (req, reply) => {
  const user = await getUser(req.params.id);
  reply.send({ name: user.name });
};
```

### Route Schema

You can define the schema of your routes by adding a schema export respective to the method name. For example, if you want to define the schema of `GET /users/[id]` route, you can create `users/[id].js` file and add `get` function and `getSchema` export.

```js
export const get = async (req, reply) => {
  const user = await getUser(req.params.id);
  reply.send({ name: user.name });
};

export const getSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
    },
  },
};
```

The schema follows the [Fastify schema](https://www.fastify.io/docs/latest/Validation-and-Serialization/) format.

## License

MIT

## Acknowledgements

This project was inspired by [Next.js](https://nextjs.org/) API routes.

## Disclaimer

This is an experimental project, do not use this in production unless you know what you are doing.
