export const getSchema = {
  params: {
    type: "object",
    properties: {
      product_id: { type: "string" },
    },
    required: ["product_id"],
  },
  querystring: {
    type: "object",
    properties: {
      limit: { type: "number" },
      offset: { type: "number" },
    },
    required: [],
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              product_id: { type: "string" },
              user_id: { type: "string" },
              rating: { type: "number" },
              comment: { type: "string" },
              created_at: { type: "string" },
              updated_at: { type: "string" },
            },
          },
        },
        meta: {
          type: "object",
          properties: {
            limit: { type: "number" },
            offset: { type: "number" },
            total: { type: "number" },
          },
        },
      },
    },
  },
};

export const get = async function (req, rep, ctx) {
  const { product_id } = req.params;
  const { limit, offset } = req.query;
  rep.send({
    data: [
      {
        id: "1",
        product_id,
        user_id: "",
        rating: 3,
        comment: "Great product",
        created_at: "2021-01-01",
        updated_at: "2021-01-01",
      },
    ],
    meta: { limit, offset, total: 1 },
  });
};
