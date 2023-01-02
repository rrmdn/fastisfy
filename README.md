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

## Environment Variables

Fastisfy uses [dotenv](https://www.npmjs.com/package/dotenv) to load environment variables from `.env` file. You can create `.env` file in your project root to define environment variables. For example, if you want to define `PORT` environment variable, you can create `.env` file with the following content:

```
PORT=3000
```

Note that different command will prefer to load environment variables from different files. For example, `npx @rromadhoni/fastisfy dev` will load environment variables from `.env.development` file, and `npx @rromadhoni/fastisfy start` will load environment variables from `.env.production` file. However, if the file does not exist, it will fallback to `.env` file.

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

### Authentication & Authorization

Fastisfy supports authentication and authorization using `@fastify/auth` plugin. You can create `_auth.js` file in your project root to define your authentication and authorization logic. The file should export the following properties:

```js
export const authenticate = async (req, reply) => {
  // Authenticate the request
  return { id: "user-id", role: "user" };
};
```

The `authenticate` function will be called before every request and should return an object that contains the user information. The user information will be accesible in the `req.requestContext` property.

```js
// api/users/me.js
export const get = async (req, reply) => {
  const user = req.requestContext.get("user");
  const profile = await getProfile(user.id);
  reply.send(profile);
};

get.allow = ["user"];
```
This example uses the `allow` property to define the roles that are allowed to access the route. If the user role is not in the `allow` array, the request will be rejected with `403 Forbidden` error.

Fastisfy lets you define the authentication strategy in the `_auth.js` file. You can use any authentication strategy that is supported by Fastify. For example, if you want to use JWT authentication, you can install `@fastify/jwt` plugin and use it in the `_auth.js` file. But first you need to register the plugin in the `_server.js` file.

```js
import fastifyJwt from "@fastify/jwt";

// _server.js
export default async function (app, opts) {
  await app.register(fastifyJwt, {
    secret: "supersecret",
  });
}
```

From there, you can use the methods provided by the plugin to authenticate the request.

```js
// _auth.js
export const authenticate = async (req) => {
  try {
    if (!req.headers.authorization) throw new Error("No authorization header");
    return req.jwtVerify();
  } catch (error) {
    return { id: "anonymous", role: "public" };
  }
};
```

This example uses the `jwtVerify` method provided by the `@fastify/jwt` plugin to authenticate the request. If the request is authenticated, the method will return the user information. If the request is not authenticated, the method will throw an error and the `authenticate` function will return the default user information, which is an anonymous user with `public` role.

To test this example, you need to implement a login route that signs a JWT token and returns it to the client. You can use the `jwtSign` method provided by the `@fastify/jwt` plugin to sign the token.

```js
// api/auth/login.js
import { Type } from "@sinclair/typebox";

export const post = async (req, rep) => {
  const { email } = req.body;
  const token = await rep.jwtSign({ id: email, role: "user" });
  rep.status(200).send({ token });
};

post.schema = {
  body: Type.Object({
    email: Type.String(),
    password: Type.String(),
  }),
  response: {
    200: Type.Object({
      token: Type.String(),
    }),
  },
};
```

Now you can test the authentication by sending a request to the login route and passing the token in the `Authorization` header to the protected route.

1. Login

```bash
curl -X POST -H "Content-Type: application/json" -d '{"email": "hello@pm.me", "password": "123"}' http://localhost:3000/api/auth/login
```
2. Get user profile

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <insert-token-here>" http://localhost:3000/api/users/me
```

### Examples

- [Todo List](/packages/fastisfy-example-todolist) - A simple todo list API using sqlite3.

## License

MIT

## Acknowledgements

This project was inspired by [Next.js](https://nextjs.org/) API routes.

## Disclaimer

This is an experimental project, do not use this in production unless you know what you are doing.
