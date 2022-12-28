declare namespace fastisfy {
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

  export type Request<TSchema extends FastisfySchema = FastisfySchema> =
    import("fastify").FastifyRequest<
      import("fastify").RouteGenericInterface,
      import("fastify").RawServerDefault,
      import("fastify").RawRequestDefaultExpression<
        import("fastify").RawServerDefault
      >,
      TSchema,
      import("@fastify/type-provider-typebox").TypeBoxTypeProvider,
      import("fastify").FastifyBaseLogger
    >;

  export type Reply<TSchema extends FastisfySchema = FastisfySchema> =
    import("fastify").FastifyReply<
      import("fastify").RawServerDefault,
      import("fastify").RawRequestDefaultExpression<
        import("fastify").RawServerDefault
      >,
      import("fastify").RawReplyDefaultExpression<
        import("fastify").RawServerDefault
      >,
      import("fastify").RouteGenericInterface,
      unknown,
      TSchema,
      import("@fastify/type-provider-typebox").TypeBoxTypeProvider
    >;

  export type RequestHandler<TSchema extends FastisfySchema = FastisfySchema> =
    {
      (req: Request<TSchema>, rep: Reply<TSchema>): Promise<void>;
      schema?: TSchema;
    };
}
