declare module "fastisfy" {
  import * as fastify from "fastify";

  export type FastisfyInstance = import("fastify").FastifyInstance<
    import("fastify").RawServerDefault,
    import("fastify").RawRequestDefaultExpression<
      import("fastify").RawServerDefault
    >,
    import("fastify").RawReplyDefaultExpression<
      import("fastify").RawServerDefault
    >,
    import("fastify").FastifyBaseLogger,
    import("@fastify/type-provider-typebox").TypeBoxTypeProvider
  >;

  export type FastisfyCustomServer = (
    app: FastisfyInstance,
    opts: Record<string, any>
  ) => Promise<void>;

  export type FastisfySchema = {
    body?: import("@sinclair/typebox").TSchema;
    querystring?: import("@sinclair/typebox").TSchema;
    params?: import("@sinclair/typebox").TSchema;
    headers?: import("@sinclair/typebox").TSchema;
    response?: Record<string, import("@sinclair/typebox").TSchema>;
  };

  export interface RequestContext {}

  export interface FastisfyRequest<
    TSchema extends FastisfySchema = FastisfySchema
  > extends fastify.FastifyRequest<
      fastify.RouteGenericInterface,
      fastify.RawServerDefault,
      fastify.RawRequestDefaultExpression<fastify.RawServerDefault>,
      TSchema,
      import("@fastify/type-provider-typebox").TypeBoxTypeProvider,
      RequestContext,
      fastify.FastifyBaseLogger
    > {}

  export interface FastisfyReply<
    TSchema extends FastisfySchema = FastisfySchema
  > extends fastify.FastifyReply<
      fastify.RawServerDefault,
      fastify.RawRequestDefaultExpression<fastify.RawServerDefault>,
      fastify.RawReplyDefaultExpression<fastify.RawServerDefault>,
      fastify.RouteGenericInterface,
      unknown,
      TSchema,
      import("@fastify/type-provider-typebox").TypeBoxTypeProvider
    > {}

  export type RequestHandler<TSchema extends FastisfySchema = FastisfySchema> =
    {
      (
        req: FastisfyRequest<TSchema>,
        rep: FastisfyReply<TSchema>
      ): Promise<void>;
      schema?: TSchema;
    };
}
