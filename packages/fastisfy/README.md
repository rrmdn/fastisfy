# Fastisfy

Fastisfy is a satisfyingly fast and simple web framework to build REST APIs with Node.js with the power of Fastify.
You can define routes using Next.js-like API and use the power of Fastify to build your APIs.

## Pre-requisites

- Node.js 16 or higher
- npx (comes with npm 5.2+)

## Usage

Create `api` directory in your project root and create `hello.js` file in it.

```js
export const get = async (req, reply) => {
  reply.send({ hello: "world" });
};
```

Run `npx @rromadhoni/fastisfy dev` to start the development server. You will be able to access your API at `http://localhost:3000/hello`, and it will return `{ "hello": "world" }`.

## Deployment

Run `npx @rromadhoni/fastisfy start` to start the production server. Everything is the same as the development server, but it is optimized for production.

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

### Route Parameters

You can use parameters in your routes by adding `[parameter]` to the route path. For example, if you want to create a route that returns the name of the user, you can create `users/[id].js` file and use `req.params.id` to get the user ID.

```js
import { Type } from "@sinclair/typebox";

export const get = async (req, reply) => {
  const user = await getUser(req.params.id);
  reply.send({ name: user.name });
};

get.schema = {
  params: Type.Object({
    id: Type.String(),
  }),
};
```

### Route Schema

You can define the schema of your routes by adding a `schema` property to the method name. For example, if you want to define the schema of `GET /users/[id]` route, you can create `users/[id].js` file and add `get` function and assign the schema to `get.schema` property. The schema itself is a Fastify schema object built with [TypeBox](https://github.com/sinclairzx81/typebox).

```js
import { Type } from "@sinclair/typebox";

export const get = async (req, reply) => {
  const user = await getUser(req.params.id);
  reply.send({ name: user.name });
};

get.schema = {
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    200: Type.Object({
      name: Type.String(),
    }),
  },
};
```

### TypeScript Support

Fastisfy emits TypeScript declaration files to help you write your routes in TypeScript. You can create `users/[id].ts` file and use TypeScript to define your routes.

```ts
import * as fastisfy from "fastisfy";
import { Type } from "@sinclair/typebox";

const getSchema = {
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    200: Type.Object({
      name: Type.String(),
    }),
  },
};

export const get: fastisfy.RequestHandler<typeof getSchema> = async (
  req,
  rep
) => {
  const user = await getUser(req.params.id);
  rep.status(200).send({ name: user.name });
};

get.schema = getSchema;
```

In the above example, `fastisfy.RequestHandler` is a type that takes the schema object as a generic type and returns a function that takes `fastify.FastisfyRequest` and `fastify.FastisfyReply` as arguments. The schema will be automatically recognized by TypeScript and you will get type checking for your routes.

### Configuration

You can create `fastisfy.config.js` file in your project root to customize the configuration. The file should export an object with the following properties:

- `features` - An array of features to enable. Available features are:
  - `cors` - Enable CORS support.
  - `compression` - Enable compression.
  - `overload-protection` - Enable overload protection.
  - `swagger` - Enable Swagger schema generation.
- `apiDir` - The directory that contains your API routes. Default is `api` in the `cwd`.

### Examples

- [Todo List](/packages/fastisfy-example-todolist) - A simple todo list API using sqlite3.

## License

MIT

## Acknowledgements

This project was inspired by [Next.js](https://nextjs.org/) API routes.

## Disclaimer

This is an experimental project, do not use this in production unless you know what you are doing.
